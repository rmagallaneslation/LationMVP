const isHostedBuild =
  process.env.HOSTED_ENV_VALIDATION === "true" ||
  process.env.CI === "true" ||
  process.env.VERCEL === "1";

if (!isHostedBuild) {
  process.exit(0);
}

const requiredFrontendEnv = ["VITE_TURNSTILE_SITE_KEY"];
const requiredLeadApiEnv = [
  "VITE_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LEADS_TARGET_TABLE",
  "TURNSTILE_SECRET_KEY",
];
const allowedLeadTables = new Set(["leads", "leads_demo", "leads_dev"]);

const missing = [];

for (const key of requiredFrontendEnv) {
  if (!process.env[key]?.trim()) {
    missing.push(key);
  }
}

const usesServerlessLeadRoute = !process.env.VITE_API_URL?.trim();
if (usesServerlessLeadRoute) {
  for (const key of requiredLeadApiEnv) {
    if (!process.env[key]?.trim()) {
      missing.push(key);
    }
  }
}

if (missing.length > 0) {
  for (const key of missing) {
    console.error(`Missing required contact deploy env: ${key}`);
  }
  process.exit(1);
}

if (usesServerlessLeadRoute) {
  const configuredTable = process.env.LEADS_TARGET_TABLE?.trim();
  if (!allowedLeadTables.has(configuredTable)) {
    console.error(
      `Invalid LEADS_TARGET_TABLE: ${configuredTable}. Allowed values: leads, leads_demo, leads_dev`,
    );
    process.exit(1);
  }
}
