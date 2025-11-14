// app/routes/robots[.]txt.ts

import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const robots = `
User-agent: *
Allow: /

Sitemap: https://sugamo-navi.com/sitemap.xml
`.trim();

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};