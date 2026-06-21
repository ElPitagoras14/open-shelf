import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	define: {
		__APP_VERSION__: JSON.stringify(version),
	},
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		viteReact(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "pwa192.png", "pwa512.png"],
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
			},
			manifest: {
				name: "Open Shelf",
				short_name: "Open Shelf",
				description: "Pantry tracker — track expiry dates offline",
				start_url: "/",
				display: "standalone",
				theme_color: "#16a34a",
				background_color: "#ffffff",
				icons: [
					{
						src: "favicon.ico",
						sizes: "64x64 32x32 24x24 16x16",
						type: "image/x-icon",
					},
					{
						src: "pwa192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
});

export default config;
