import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tanstackRouter({}),
  ],
  build: {
    minify: 'esbuild',            // lightweight minifier
    sourcemap: false,
    chunkSizeWarningLimit: 10000, // avoid large chunk warnings
    rollupOptions: {
      output: {
        // Only manually chunk large external dependencies
        manualChunks(id) {
          if (id.includes('node_modules/starknetkit')) return 'starknetkit';
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@dynamic-labs/sdk-react-core'], // avoid pre-bundling issues
  },
  ssr: {
    noExternal: ['@dynamic-labs/sdk-react-core'], // keep SSR-friendly
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // alias for src
    },
  },
});
