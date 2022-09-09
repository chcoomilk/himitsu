/// <reference types="vite/client" />

interface ImportMetaEnv {
    // more env variables...
    readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
