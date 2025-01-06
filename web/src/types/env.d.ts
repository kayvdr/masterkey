/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_BASIC_USER: string;
  readonly VITE_BASIC_PASS: string;
  readonly VITE_GA_TRACKING_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
