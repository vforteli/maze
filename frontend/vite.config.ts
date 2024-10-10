import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import pluginChecker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr(), pluginChecker({ typescript: true })],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
