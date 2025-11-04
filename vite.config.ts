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
  ssr: {
    noExternal: ['react-responsive', 'react-markdown', 'remark-gfm'], // Bundle dependencies for SSR
  },
  optimizeDeps: {
    include: ["leaflet", "react-leaflet"],
  },
});
