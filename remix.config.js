/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['.*'],
  serverBuildPath: 'build/server/index.js',
  appDirectory: 'app',
  serverDependenciesToBundle: [
    '@remix-run/server-build',
    '@supabase/supabase-js',
  ],
  routes: {
    'shops/:id': 'routes/ShopDetails.tsx',
    'places/:id': 'routes/ShopDetails.tsx',
  },
  future: {
    v3_fetcherPersist: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true,
  },
};