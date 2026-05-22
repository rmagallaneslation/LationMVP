import { createClient } from "@supabase/supabase-js";
import { sendLeadNotification } from "./_lib/notify.js";
import { enforceRateLimit } from "./_lib/rate-limit.js";
import {
  createRequestContext,
  getAllowedOrigins,
  isAllowedOrigin,
  isRequestBodyWithinLimit,
  logEvent,
  validateLeadPayload,
  verifyTurnstileToken,
} from "./_lib/security.js";

const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 10 * 60;
const ALLOWED_LEAD_TABLES = new Set(["leads"]);

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function resolveLeadTargetTable() {
  const configuredTable = process.env.LEADS_TARGET_TABLE?.trim();
  if (configuredTable) {
    if (!ALLOWED_LEAD_TABLES.has(configuredTable)) {
      return { ok: false, error: "invalid_target_table" };
    }

    return { ok: true, value: configuredTable };
  }

  return { ok: true, value: "leads" };
}

export default async function handler(req, res) {
  const context = createRequestContext(req, "/api/lead");
  const isProduction = process.env.NODE_ENV === "production";

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    logEvent("warn", context, 405, "method_not_allowed");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const allowedOrigins = getAllowedOrigins();
  if (!isAllowedOrigin(req.headers.origin, allowedOrigins, isProduction)) {
    logEvent("warn", context, 403, "forbidden");
    return res.status(403).json({ error: "forbidden" });
  }

  if (!isRequestBodyWithinLimit(req)) {
    logEvent("warn", context, 400, "validation_error");
    return res.status(400).json({ error: "validation_error" });
  }

  const parsedPayload = validateLeadPayload(req.body);
  if (!parsedPayload.ok) {
    logEvent("warn", context, 400, "validation_error");
    return res.status(400).json({ error: "validation_error" });
  }

  const rateLimitResult = await enforceRateLimit({
    key: `lead:${context.ipHash}`,
    limit: RATE_LIMIT,
    windowSeconds: RATE_WINDOW_SECONDS,
    isProduction,
  });

  if (!rateLimitResult.ok) {
    const statusCode = rateLimitResult.error === "service_unavailable" ? 503 : 429;
    const errorCode = rateLimitResult.error || "rate_limited";
    res.setHeader("Retry-After", String(rateLimitResult.retryAfter ?? RATE_WINDOW_SECONDS));
    logEvent("warn", context, statusCode, errorCode);
    return res.status(statusCode).json({ error: errorCode });
  }

  if (parsedPayload.value.website) {
    logEvent("info", context, 200, "ok");
    return res.status(200).json({ ok: true });
  }

  const requestHost = Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host;
  const turnstileResult = await verifyTurnstileToken(
    parsedPayload.value.turnstileToken,
    context.ip,
    requestHost || ""
  );
  if (!turnstileResult.ok) {
    const statusCode = turnstileResult.reason === "service_unavailable" ? 503 : 403;
    logEvent("warn", context, statusCode, turnstileResult.reason);
    return res.status(statusCode).json({ error: turnstileResult.reason });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    logEvent("error", context, 503, "service_unavailable");
    return res.status(503).json({ error: "service_unavailable" });
  }

  const targetTableResult = resolveLeadTargetTable();
  if (!targetTableResult.ok) {
    logEvent("error", context, 503, targetTableResult.error);
    return res.status(503).json({ error: "service_unavailable" });
  }

  const targetTable = targetTableResult.value;
  const timestamp = new Date().toISOString();
  const { error } = await supabase.from(targetTable).insert({
    name: parsedPayload.value.name,
    email: parsedPayload.value.email,
    company: parsedPayload.value.company,
    role: parsedPayload.value.role,
    phone: parsedPayload.value.phone,
    service_interest: parsedPayload.value.serviceInterest,
    message: parsedPayload.value.message,
    source: "landing",
    locale: parsedPayload.value.locale,
    status: "new",
    metadata: {
      request_id: context.requestId,
      target_table: targetTable,
      submitted_at: timestamp,
    },
  });

  if (error) {
    logEvent("error", context, 500, "internal_error");
    return res.status(500).json({ error: "internal_error" });
  }

  void sendLeadNotification(parsedPayload.value, {
    requestId: context.requestId,
    targetTable,
    timestamp,
  });

  logEvent("info", context, 200, "ok");
  return res.status(200).json({ ok: true });
}
