import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import SemiPlugin from "vite-plugin-semi-theme";
import { semiTheming } from "vite-plugin-semi-theming";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        // npm 使用这个来引入样式
        // SemiPlugin({
        //     theme: "@semi-bot/semi-theme-feishu-dashboard",
        // }),

        // 由于pnpm使用软链方式，所以pnpm需要使用这个插件
        semiTheming({
            theme: "@semi-bot/semi-theme-feishu-dashboard",
        }),
    ],
    server: {
        host: "0.0.0.0",
    },
});
