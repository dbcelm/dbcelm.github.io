/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
