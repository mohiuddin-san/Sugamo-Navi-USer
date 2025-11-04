import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import supabase from "~/supabase_blog";
import { json } from "@remix-run/node";
import { ResponsiveGrid, GridItem } from "../components/ResponsiveGrid";
import { useMediaQuery } from "react-responsive";
import { useLoaderData } from "@remix-run/react";
import MarkdownClamp from "../components/MarkdownClamp";
import ShimmerLayout from "../components/ShimmerLayout/SlBlogList";
import MarqueeHeader from "~/components/MarqueeHeader";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import Header from "../components/Header";
import CommonCategoryTop from "../components/CommonCategoryTop";
import TikTokVideoSlider from "../components/TikTokVideoSlider"
import { getTikTokVideos } from "~/components/socialMediaFetcher";
import { useIsMobile } from '../hooks/useIsMobile';
import Footer from '../components/Footer';

interface Blog {
  id: string;
  title: string;
  details: string;
  status: string;
  category_id: string;
  top_image: string;
  publish_date: string;
}

interface Category {
  id: string;
  name: string;
}

export const loader = async () => {
  const videos = await getTikTokVideos();
  return json({ videos });
};
export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>([]);
  const { fs, fsm } = useUniversalFluid();
  const { isMobile } = useIsMobile();
  const { videos } = useLoaderData<{ videos: any[] }>();
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
    setBookmarkedBlogs(savedBookmarks);

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.log("Running on server side, skipping client-side data fetch");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch blogs...");
        
        // Test Supabase connection first
        if (!supabase) {
          throw new Error("Supabase client is not initialized");
        }
        
        // Check if blogs table exists by trying a simple query first
        const { data: blogsData, error: blogError } = await supabase
          .from("blogs")
          .select("id, title, details, status, category_id, top_image, publish_date")
          .eq("status", "publish")
          .order("publish_date", { ascending: false });

        console.log("Blogs fetch result:", { blogsData, blogError });
        
        if (blogError) {
          console.error("Blog fetch error:", blogError);
          
          // Check if it's a table not found error
          if (blogError.message && blogError.message.includes('table')) {
            console.warn("Database tables not found, using fallback data");
            // Use fallback mock data
            const mockBlogs = [
              {
                id: "1",
                title: "巣鴨地蔵通り商店街の魅力",
                details: "巣鴨地蔵通り商店街は、「おばあちゃんの原宿」として親しまれている東京の人気観光スポットです。江戸時代から続く歴史ある商店街で、とげぬき地蔵として知られる高岩寺を中心に、約200店舗が軒を連ねています。\n\n商店街では、お年寄りに優しい商品やサービスが充実しており、赤いパンツで有名なマルジや、塩大福で人気のみずのなど、個性的なお店が楽しめます。\n\n毎月4、14、24日の縁日には多くの参拝客で賑わい、地元グルメや伝統的な和菓子を味わうことができます。",
                status: "publish",
                category_id: "1",
                top_image: "/src/sugamo-street.jpg",
                publish_date: new Date().toISOString()
              },
              {
                id: "2", 
                title: "とげぬき地蔵のご利益と参拝方法",
                details: "高岩寺のとげぬき地蔵は、正式には「延命地蔵菩薩」と呼ばれ、病気平癒や延命長寿のご利益があるとされています。\n\n参拝の際は、まず本堂でお参りをし、その後「洗い観音」に清水をかけて自分の体の痛いところと同じ部分を洗うのが作法です。\n\n縁日には境内で御影（おみかげ）というお札が配布され、これを飲み込むと病気が治るという言い伝えがあります。多くの人々が健康を願って訪れる、巣鴨のパワースポットです。",
                status: "publish", 
                category_id: "2",
                top_image: "/src/jizo-temple.jpg",
                publish_date: new Date(Date.now() - 86400000).toISOString() // Yesterday
              },
              {
                id: "3",
                title: "巣鴨グルメガイド - 名物料理とおすすめスイーツ",
                details: "巣鴨には多くの美味しいグルメスポットがあります。特に有名なのは：\n\n**古奈屋**：カレーうどんの老舗として知られ、コクのあるカレースープが自慢です。\n\n**みずの**：塩大福発祥の店として有名で、甘さ控えめの大福は多くの人に愛されています。\n\n**千成もなか**：手作りのもなかが自慢の和菓子店で、あんこの上品な甘さが人気です。\n\nその他にも、昔ながらの喫茶店や、お年寄りに優しいメニューを提供するレストランが数多くあります。",
                status: "publish",
                category_id: "3", 
                top_image: "/src/sugamo-food.jpg",
                publish_date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
              }
            ];
            
            setBlogs(mockBlogs);
            setCategories({
              "1": "観光スポット",
              "2": "寺社・パワースポット", 
              "3": "グルメ・食事"
            });
            return;
          }
          
          throw new Error(`Database error: ${blogError.message || 'Failed to fetch blogs'}`);
        }

        const categoryIds = [...new Set(blogsData.map((blog) => blog.category_id).filter(Boolean))];
        console.log("Category IDs found:", categoryIds);

        if (categoryIds.length > 0) {
          console.log("Fetching categories...");
          const { data: categoriesData, error: categoriesError } = await supabase
            .from("categories")
            .select("id, name")
            .in("id", categoryIds);

          console.log("Categories fetch result:", { categoriesData, categoriesError });

          if (categoriesError) {
            console.error("Categories fetch error:", categoriesError);
            throw categoriesError;
          }

          const categoriesMap = categoriesData.reduce((acc: Record<string, string>, cat: Category) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {});

          setCategories(categoriesMap);
        }

        console.log("Setting blogs data:", blogsData);
        setBlogs(blogsData || []);
        
        if (!blogsData || blogsData.length === 0) {
          console.warn("No blogs found in database");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        let errorMessage = "An unknown error occurred";
        
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = (err as any).message;
        }
        
        console.error("Detailed error info:", {
          error: err,
          message: errorMessage,
          stack: err instanceof Error ? err.stack : 'No stack trace'
        });
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleBookmark = (blogId: string) => {
    const updatedBookmarks = bookmarkedBlogs.includes(blogId)
      ? bookmarkedBlogs.filter((id) => id !== blogId)
      : [...bookmarkedBlogs, blogId];

    setBookmarkedBlogs(updatedBookmarks);
    localStorage.setItem("bookmarkedBlogs", JSON.stringify(updatedBookmarks));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExcerpt = (details: string | null, maxLines: number = 5) => {
    if (!details) return "";
    const lines = details.split("\n").filter((p: string) => p.trim());
    return lines.slice(0, maxLines).join("\n");
  };

  //if (loading) return <ShimmerLayout />;

  if (error)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg max-w-4xl">
            <h2 className="text-xl font-bold mb-2">🚧 Database Setup Required</h2>
            <p className="mb-4">The blog database tables are not set up yet.</p>
            
            {error.includes('table') && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">📝 Database Setup Instructions:</h3>
                <div className="text-sm text-yellow-700 space-y-2">
                  <p>1. Go to your Supabase dashboard</p>
                  <p>2. Run this SQL in the SQL Editor:</p>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto mt-2">
{`-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table  
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'draft',
  category_id UUID REFERENCES categories(id),
  top_image TEXT,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO categories (name) VALUES 
  ('観光スポット'), ('寺社・パワースポット'), ('グルメ・食事');`}
                  </pre>
                  <p>3. Refresh this page after running the SQL</p>
                </div>
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Technical Details</summary>
              <p className="mt-2 text-sm bg-red-50 p-2 rounded">{error}</p>
            </details>
            
            <div className="mt-4 space-x-2">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
              <button 
                onClick={() => setError(null)} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Use Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="max-w-full">
      <Header />
      <CommonCategoryTop
        title="TRAVEL TIPS"
        subtitle="旅の情報"
        imageSrc="/src/bookmark.jpg"
        imageAlt="Travel tips Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#0000000"
        animationDuration="90s"
        marginBottom={0}
        marginTop={98}
      />
      <ResponsiveGrid
        columns={isMobile ? "1fr" : "1fr 1fr"}
        rows="auto"
        className="justify-center items-center"
        style={{
          gap: isMobile ? fsm(64) : fs(133),
          marginTop: isMobile ? fsm(0) : fsm(120),
          paddingLeft: isMobile ? fsm(20) : fs(163), // Reduced padding
          paddingRight: isMobile ? fsm(20) : fs(161), // Reduced padding
          overflowX: "hidden", // Prevent overflow
        }}
      >
        {blogs.length === 0 && !loading ? (
          <div className="col-span-full text-center py-16">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-600 mb-4">📝 No Travel Tips Available</h3>
              <p className="text-gray-500">Check back later for new travel tips and information!</p>
            </div>
          </div>
        ) : (
          blogs.map((blog, index) => (
          <GridItem
            key={blog.id}
            column={isMobile ? 1 : (index % 2) + 1}
            row={isMobile ? index + 1 : Math.floor(index / 2) + 1}
            columnSpan={1}
            rowSpan={1}
            style={{
              width: isMobile ? "70%" : fs(492), // Full width in mobile
              height: isMobile ? fsm(613) : fs(613),
              padding: isMobile ? fsm(21) : fs(21),
              margin: isMobile ? "0 auto" : "0",
            }}
            className="border-2 border-black rounded-lg"
          >
            <Link to={`/blog/${blog.id}`} className="block">
              <div className="bg-gradient-to-r flex items-center justify-between">
                <span className="text-black font-courierPrime" style={{ fontSize: isMobile ? fsm(20) : fs(20) }}>
                  {formatDate(blog.publish_date)} | {categories[blog.category_id] || "General"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(blog.id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Toggle bookmark"
                >
                </button>
              </div>

              {blog.top_image && (
                <div className="overflow-hidden" style={{ marginTop: isMobile ? fsm(16) : fs(16) }}>
                  <img
                    src={blog.top_image}
                    className="w-full object-cover transition-transform duration-300 hover:scale-105"
                    style={{ height: isMobile ? fsm(225) : fs(225) }}
                  />
                </div>
              )}

              <div style={{ marginTop: isMobile ? fsm(16) : fs(16) }}>
                <h2
                  className="font-bold font-cairo text-gray-800 line-clamp-1"
                  style={{
                    fontSize: isMobile ? fsm(30) : fs(30),
                    marginTop: isMobile ? fsm(10) : 10,
                    marginBottom: isMobile ? fsm(15) : fs(15),
                  }}
                >
                  {blog.title}
                </h2>
                <div
                  className="font-medium mb-3 font-sawarabi overflow-hidden"
                  style={{ fontSize: isMobile ? fsm(16) : fs(16) }}
                >
                  <MarkdownClamp content={blog.details} />
                </div>
                <div
                  className="flex justify-end text-black font-medium font-courierPrime"
                  style={{ fontSize: isMobile ? fsm(25) : fs(25) }}
                >
                  more+
                </div>
              </div>
            </Link>
          </GridItem>
          ))
        )}
      </ResponsiveGrid>

      <div style={{ marginLeft: isMobile? fsm(20):fs(90), marginBottom: isMobile? fsm(60):fs(100)  }}>
        <h2 className=" font-cousine text-black text-start" style={{ fontSize: isMobile ? fsm(25) : fs(25), marginTop: isMobile ? fsm(100) : fs(100) }}>
          SNSの動画
        </h2>
        <h2 className=" font-cousine text-black text-start font-bold" style={{ fontSize: isMobile ? fsm(60) : fs(60), marginTop: isMobile ? fsm(20) : fs(20) }}>
          SUGAMO NAVI
        </h2>
        <h2 className=" font-cousine text-[#ED4548] text-start italic" style={{ fontSize: isMobile ? fsm(48) : fs(48), marginTop: isMobile ? fsm(20) : fs(20) }}>
          #INSTAGRAM
        </h2>
        <h2 className=" font-cousine text-[#ED4548] text-start italic" style={{ fontSize: isMobile ? fsm(48) : fs(48), marginTop: isMobile ? fsm(8) : fs(8) }}>
          #TIKTOK
        </h2>
      </div>
      <TikTokVideoSlider videos={videos} />
      <Footer marginTop={200} />
    </div>
  );
}