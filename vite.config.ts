import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from "vite-plugin-pwa";
import path from 'path';

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
            splitVendorChunkPlugin(),
        ],
        experimental: {
            renderBuiltUrl(filename, { hostId, type }) {
                if (type === 'public') {
                    return { relative: false };
                }
                else if (path.extname(hostId) === '.js') {
                    return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` };
                }
                else {
                    return { relative: true };
                }
            }
        },
    });
} 
