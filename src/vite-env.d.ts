/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
    // more env variables...
    readonly VITE_BACKEND_URL: string;
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
