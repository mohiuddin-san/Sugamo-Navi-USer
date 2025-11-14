import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
      },
    }),
    netlifyPlugin(),
    tsconfigPaths()
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 300,
    },
    hmr: {
      overlay: true,
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"), // Explicitly map ~ to app directory
    },
  },
  build: {
    sourcemap: false, // Disable source maps to avoid build issues on Netlify
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress source map warnings
        if (warning.code === 'SOURCEMAP_ERROR') return;
        warn(warning);
      }
    }
  },
  ssr: {
    noExternal: ['react-responsive', 'react-markdown', 'remark-gfm', 'motion'], // Bundle dependencies for SSR
  },
  optimizeDeps: {
    include: ["leaflet", "react-leaflet"],
  },
});
