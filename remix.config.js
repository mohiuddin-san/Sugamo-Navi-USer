/** @type {import('@remix-run/dev').AppConfig} */
export default {
  // ... other configurations
  // server: './server.ts',
  serverBuildPath: 'build/server/index.js',
  appDirectory: "app",
  serverDependenciesToBundle: [
    // This is the important part!
    '@remix-run/server-build',
  ],
  // ... other configurations
};