import { Resend } from "resend";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseRecipients(value) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function resolveLeadSubjectPrefix(targetTable) {
  if (process.env.VITE_DEMO_MODE === "true") return "[DEMO] ";
  return "";
}

export async function sendLeadNotification(payload, context) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.LEAD_NOTIFY_FROM?.trim();
  const recipientsRaw = process.env.LEAD_NOTIFY_TO?.trim();

  if (!apiKey || !fromEmail || !recipientsRaw) {
    return;
  }

  const recipients = parseRecipients(recipientsRaw);
  if (recipients.length === 0) {
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const safeName = escapeHtml(payload.name);
    const safeEmail = escapeHtml(payload.email);
    const safeCompany = payload.company ? escapeHtml(payload.company) : "No company";
    const safePhone = payload.phone ? escapeHtml(payload.phone) : "Not provided";
    const safeRole = payload.role ? escapeHtml(payload.role) : "Not provided";
    const safeServiceInterest = payload.serviceInterest
      ? escapeHtml(payload.serviceInterest)
      : "Not provided";
    const safeLocale = payload.locale ? escapeHtml(payload.locale) : "Not provided";
    const safeMessage = escapeHtml(payload.message);
    const safeTargetTable = escapeHtml(context.targetTable);
    const safeTimestamp = escapeHtml(context.timestamp);
    const subjectPrefix = resolveLeadSubjectPrefix(context.targetTable);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `${subjectPrefix}New Lead: ${payload.name} (${payload.company || "No company"})`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Role / hiring need:</strong> ${safeRole}</p>
        <p><strong>Service interest:</strong> ${safeServiceInterest}</p>
        <p><strong>Message:</strong> ${safeMessage}</p>
        <p><strong>Locale:</strong> ${safeLocale}</p>
        <p><strong>Source:</strong> landing</p>
        <p><strong>Environment/table:</strong> ${safeTargetTable}</p>
        <p><strong>Timestamp:</strong> ${safeTimestamp}</p>
      `,
    });

    if (error) {
      console.warn(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          request_id: context.requestId,
          route: "/api/lead",
          status: 200,
          code: "notification_failed",
        })
      );
    }
  } catch {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        request_id: context.requestId,
        route: "/api/lead",
        status: 200,
        code: "notification_failed",
      })
    );
  }
}
