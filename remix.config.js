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
};