import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import SemiPlugin from "vite-plugin-semi-theme";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        SemiPlugin({
            theme: "@semi-bot/semi-theme-universedesign",
        }),
    ],
    server: {
        host: "0.0.0.0",
    },
});
