const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();
const apiUrl = import.meta.env.VITE_API_URL?.trim();

const missingContactConfig = [
  !turnstileSiteKey ? "VITE_TURNSTILE_SITE_KEY" : null,
].filter(Boolean) as string[];

export const isContactFormConfigured = missingContactConfig.length === 0;

export const contactConfigError = isContactFormConfigured
  ? null
  : `Missing frontend configuration: ${missingContactConfig.join(", ")}`;

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

export const runtimeConfig = {
  turnstileSiteKey,
  apiUrl,
} as const;
