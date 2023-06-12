/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SERVER_PORT: number
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
