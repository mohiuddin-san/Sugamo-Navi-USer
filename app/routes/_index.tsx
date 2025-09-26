import { json, useLoaderData } from "@remix-run/react";
import { getInstagramVideos, getTikTokVideos } from "~/components/socialMediaFetcher";
import Home from "~/components/Home";
import supabaseShops from "~/supabase";
import supabaseBlogs from "~/supabase_blog";

// Define types (same as before)
type Shop = {
  id: string;
  name: string;
  category_id: string;
  description: string;
  address: string;
  image_url: string;
  love_count: number;
  review_count: number;
  near_station: string;
  map_embed: string;
  other_images: JSON;
  opening_hours: string;
};

type Blog = {
  id: string;
  title: string;
  details: string;
  status: string;
  category_id: string;
  top_image: string;
  publish_date: string;
};

type LoaderData = {
  posts: any[];
  tiktokVideos: any[];
  error: string | null;
  topImg: string;
  imageUrl: string;
  title: string;
  details: string[];
  letsGOimg: string;
  blogs: Blog[];
  categories: Record<string, string>;
  categoriesShop: { id: string; name: string }[];
  topShops: Shop[];
};

export const loader = async () => {
  try {
    console.log("🔄 _index.tsx loader: Starting data fetch..."); // Debug log

    // Static data (always succeeds)
    const staticData = {
      topImg: "/src/sugamo-navi.webp", 
      imageUrl: "./src/sugamo-gate.png",
      title: "ABOUT SUGAMO",
      details: [
        "「巣鴨」は、東京の中でも個性的な街のひとつです。",
        "ここ「地蔵通り商店街」は、寺社や老舗の和菓子屋さん、薬局やグルメなお店が入り混じった賑やかな場所で、「おばあちゃんの原宿」として知られ、最近は懐かしい雰囲気が好きな若い人にも人気があります。",
        "下町の雰囲気を味わいたい方の東京観光の際は、ぜひ巣鴨に足を運んでみてください！",
        "また、毎月4日、14日、24日には「縁日」が開催されます。",
        "骨董品やインテリア雑貨の露店、そして屋台グルメが並ぶ、巣鴨地蔵通り商店街での散策や食べ歩きにぴったりのイベントです。",
      ],
      letsGOimg: "/src/lets-g.svg",
    };

    // Fetch social media data
    console.log("🔄 Fetching social media..."); // Debug
    const [instagramPosts, tiktokVideos] = await Promise.all([
      getInstagramVideos().catch(err => {
        console.error("❌ Instagram fetch failed:", err);
        return [];
      }),
      getTikTokVideos().catch(err => {
        console.error("❌ TikTok fetch failed:", err);
        return [];
      }),
    ]);
    console.log("✅ Social media fetched:", { posts: instagramPosts.length, videos: tiktokVideos.length });

    // Fetch blogs
    console.log("🔄 Fetching blogs..."); // Debug
    const { data: blogsData, error: blogError } = await supabaseBlogs
      .from("blogs")
      .select("id, title, details, status, category_id, top_image, publish_date")
      .eq("status", "publish")
      .order("publish_date", { ascending: false })
      .limit(3);

    if (blogError) {
      console.error("❌ Blogs fetch failed:", blogError);
      throw new Error(`Blogs error: ${blogError.message}`);
    }
    console.log("✅ Blogs fetched:", blogsData?.length || 0);

    const categoryIds = [...new Set(blogsData?.map((blog) => blog.category_id).filter(Boolean)) || []];
    let categoriesMap = {};
    if (categoryIds.length > 0) {
      const { data: categoriesData, error: categoriesError } = await supabaseBlogs
        .from("categories")
        .select("id, name")
        .in("id", categoryIds);
      if (categoriesError) throw new Error(`Categories error: ${categoriesError.message}`);
      categoriesMap = categoriesData.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {});
    }
    console.log("✅ Categories mapped:", Object.keys(categoriesMap).length);

    // Fetch shops
    console.log("🔄 Fetching shops..."); // Debug
    const { data: recommendations, error: recError } = await supabaseShops
      .from("recommendations")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true })
      .limit(3);

    if (recError) {
      console.error("❌ Recommendations fetch failed:", recError);
      throw new Error(`Recommendations error: ${recError.message}`);
    }
    console.log("✅ Recommendations fetched:", recommendations?.length || 0);

    const shopIds = recommendations.map((rec) => rec.shop_id);
    const { data: categoriesShop, error: catError } = await supabaseShops
      .from("categories")
      .select("id, name")
      .order("name");

    if (catError) {
      console.error("❌ Shop categories fetch failed:", catError);
      throw new Error(`Shop categories error: ${catError.message}`);
    }

    const { data: shops, error: shopsError } = await supabaseShops
      .from("shops")
      .select("*")
      .in("id", shopIds);

    if (shopsError) {
      console.error("❌ Shops fetch failed:", shopsError);
      throw new Error(`Shops error: ${shopsError.message}`);
    }

    const sortedShops = recommendations
      .map((rec) => shops.find((shop) => shop.id === rec.shop_id))
      .filter((shop) => shop !== undefined) as Shop[];

    return json({
      ...staticData,
      blogs: blogsData || [],
      categories: categoriesMap,
      categoriesShop: categoriesShop || [],
      topShops: sortedShops,
      posts: Array.isArray(instagramPosts) ? instagramPosts.slice(0, 3) : [],
      tiktokVideos: Array.isArray(tiktokVideos) ? tiktokVideos.slice(0, 3) : [],
      error: null,
    });
  } catch (error) {
    console.error("💥 Loader error:", error); // Debug
    return json(
      {
        topImg: "/src/sugamo-navi.webp",
        imageUrl: "/src/sugamo-gate.webp",
        title: "ABOUT SUGAMO",
        details: [], // Always array
        letsGOimg: "/src/lets-g.svg",
        blogs: [],
        categories: {},
        categoriesShop: [],
        topShops: [],
        posts: [],
        tiktokVideos: [],
        error: (error as Error).message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
};

export default function HomePage() {
  const data = useLoaderData<LoaderData>();
  console.log("📊 HomePage rendering with data:", { error: data.error, blogs: data.blogs?.length, shops: data.topShops?.length, posts: data.posts?.length }); // Debug

  return (
    <div className="bg-white">
      <Home {...data} />
    </div>
  );
}