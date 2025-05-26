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
          ui: ["clsx", "lucide-react"], // Removed class-variance-authority from here
          "tailwind-merge": ["tailwind-merge"],
          supabase: ["@supabase/supabase-js"],
          // class-variance-authority will be bundled normally (default chunk)
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
