import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from "vite-plugin-pwa";
import dynamicImport from 'vite-plugin-dynamic-import';

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        build: {
            outDir: 'build' // Changed output folder, like in CRA
        },
        server: {
            host: process.env.HOST || "0.0.0.0",
            port: +process.env.PORT || 3000,
            cors: true,
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
            }),
            dynamicImport(),
        ],
        optimizeDeps: {
            include: [
                "./"
            ]
        }
    });
} 