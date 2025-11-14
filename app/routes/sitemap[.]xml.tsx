
import { LoaderFunction } from "@remix-run/node";
import supabaseShops from "~/supabase";
import supabaseBlog from "~/supabase_blog";

interface UrlEntry {
  url: string;
  priority: string;
  lastmod?: string;
  changefreq?: string;
}

export const loader: LoaderFunction = async () => {
  const baseUrl = "https://sugamo-navi.com";

  const staticUrls: UrlEntry[] = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/FoodAndDrink", priority: "0.9", changefreq: "daily" },
    { url: "/SeeAndDo", priority: "0.9", changefreq: "daily" },
    { url: "/BlogList", priority: "0.9", changefreq: "daily" },
  ];

  const { data: blogs } = await supabaseBlog
    .from("blogs")
    .select("id, publish_date, updated_at")
    .eq("status", "publish");

  const blogUrls: UrlEntry[] = (blogs || []).map(b => ({
    url: `blog/${b.id}`,
    lastmod: b.updated_at
      ? new Date(b.updated_at).toISOString().split("T")[0]
      : b.publish_date
      ? new Date(b.publish_date).toISOString().split("T")[0]
      : undefined,
    priority: "0.8",
    changefreq: "weekly",
  }));
  const { data: shops } = await supabaseShops
    .from("shops")
    .select("id, updated_at");

  const shopUrls: UrlEntry[] = (shops || []).map(s => ({
    url: `ShopDetails?id=${s.id}&type=shops`,
    lastmod: s.updated_at
      ? new Date(s.updated_at).toISOString().split("T")[0]
      : undefined,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const { data: places } = await supabaseShops
    .from("tourist_places")
    .select("id, updated_at");

  const placeUrls: UrlEntry[] = (places || []).map(p => ({
    url: `ShopDetails?id=${p.id}&type=places`,
    lastmod: p.updated_at
      ? new Date(p.updated_at).toISOString().split("T")[0]
      : undefined,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const urls: UrlEntry[] = [...staticUrls, ...blogUrls, ...shopUrls, ...placeUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ url, lastmod, priority, changefreq }) => `
  <url>
    <loc>${baseUrl}/${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq || "monthly"}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
};