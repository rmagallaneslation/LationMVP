/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_DEMO_MODE?: string;
  readonly VITE_SHOW_CONTACT_CONFIG_HINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
