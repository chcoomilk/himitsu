import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from "vite-plugin-pwa";
// import preact from '@preact/preset-vite'

export default defineConfig({
    build: {
        outDir: 'build' // Changed output folder, like in CRA
    },
    plugins: [
        react(),
        viteTsconfigPaths(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
            },
            injectRegister: "auto",
        })
    ],
});