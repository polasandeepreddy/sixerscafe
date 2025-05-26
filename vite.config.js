import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          // Group tailwind-merge separately to avoid resolution issues
          ui: ["clsx", "class-variance-authority", "lucide-react"],
          "tailwind-merge": ["tailwind-merge"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    hmr: {
      host: "localhost",
      port: 3000,
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
    host: true,
  },
});
