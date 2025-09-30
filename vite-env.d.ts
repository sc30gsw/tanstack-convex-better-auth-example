/// <reference types="vite/client" />

interface ViteTypeOptions {
  // この行を追加することで ImportMetaEnv の型を厳密にし、不明なキーを許可しないように
  // できます。
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string
  readonly VITE_CONVEX_DEPLOYMENT: string
  readonly VITE_CONVEX_SITE_URL: string
  // その他の環境変数...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}