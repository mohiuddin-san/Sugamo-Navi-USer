import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import supabase from "~/supabase_blog";
import { json } from "@remix-run/node";
import { ResponsiveGrid, GridItem } from "../components/ResponsiveGrid";
import { useMediaQuery } from "react-responsive";
import { useLoaderData } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import ShimmerLayout from "../components/ShimmerLayout/SlBlogList";
import MarqueeHeader from "~/components/MarqueeHeader";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import Header from "../components/Header";
import CommonCategoryTop from "../components/CommonCategoryTop";
import TikTokVideoSlider from "../components/TikTokVideoSlider"
import { getTikTokVideos } from "~/components/socialMediaFetcher";
import Footer from '../components/Footer';

export const loader = async () => {
  const videos = await getTikTokVideos();
  return json({ videos });
};
export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const { fs, fsm, fsVw, fluidStyle, fluidClass } = useUniversalFluid();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { videos } = useLoaderData<{ videos: any[] }>();
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
    setBookmarkedBlogs(savedBookmarks);

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: blogsData, error: blogError } = await supabase
          .from("blogs")
          .select("id, title, details, status, category_id, top_image, publish_date")
          .eq("status", "publish")
          .order("publish_date", { ascending: false });

        if (blogError) throw blogError;

        const categoryIds = [...new Set(blogsData.map((blog) => blog.category_id).filter(Boolean))];

        if (categoryIds.length > 0) {
          const { data: categoriesData, error: categoriesError } = await supabase
            .from("categories")
            .select("id, name")
            .in("id", categoryIds);

          if (categoriesError) throw categoriesError;

          const categoriesMap = categoriesData.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {});

          setCategories(categoriesMap);
        }

        setBlogs(blogsData || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleBookmark = (blogId) => {
    const updatedBookmarks = bookmarkedBlogs.includes(blogId)
      ? bookmarkedBlogs.filter((id) => id !== blogId)
      : [...bookmarkedBlogs, blogId];

    setBookmarkedBlogs(updatedBookmarks);
    localStorage.setItem("bookmarkedBlogs", JSON.stringify(updatedBookmarks));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExcerpt = (details, maxLines = 5) => {
    if (!details) return "";
    const lines = details.split("\n").filter((p) => p.trim());
    return lines.slice(0, maxLines).join("\n");
  };

  if (loading) return <ShimmerLayout />;

  if (error)
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mx-auto max-w-7xl">
        <p>Error: {error}</p>
      </div>
    );
  return (
    <div className="max-w-full">
      <Header />
      <CommonCategoryTop
        title="TRAVEL TIPS"
        subtitle="旅の情報"
        imageSrc="/src/bookmark.png"
        imageAlt="Travel tips Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#0000000"
        animationDuration="40s"
        marginBottom={0}
        marginTop={98}
      />.
      <ResponsiveGrid
        columns={isMobile ? "1fr" : "1fr 1fr"}
        rows="auto"
        isMobile={isMobile}
        className="flex justify-center mx-10 md:mx-[10%]"
        style={{ gap: isMobile?fsm(64): fs(133), marginTop:isMobile? fsm(0):fsm(130)}}
      >
        {blogs.map((blog, index) => (
          <GridItem
            key={blog.id}
            column={isMobile ? 1 : (index % 2) + 1}
            row={isMobile ? index + 1 : Math.floor(index / 2) + 1}
            columnSpan={1}
            rowSpan={1}
            style={{ height: isMobile ? "100%" : fs(570), padding: isMobile ? fsm(20) : fs(20) }}
            className="w-full border-2 border-black rounded-xl hover:shadow-lg transition-all duration-300 md:min-h-[510px]"
          >
            <div className="bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
              <span className="text-black font-courierPrime" style={{ fontSize: isMobile? fsm(20):fs(20) }}>
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
              <div className=" overflow-hidden" style={{ marginTop: isMobile? fsm(16):fs(16) }}>
                <img
                  src={blog.top_image}
                  className="w-full object-cover transition-transform duration-300 hover:scale-105"
                  style={{ height: isMobile? fsm(225):fs(225) }}
                />
              </div>
            )}

            <div style={{ marginTop: isMobile? fsm(16): fs(16) }}>
              <h2 className="font-bold font-cairo text-gray-800 hover:text-rose-400 line-clamp-1" style={{ fontSize: isMobile? fsm(30): fs(30), marginTop: isMobile?fsm(10):(10), marginBottom: isMobile?fsm(15):fs(15) }}>
                {blog.title}
              </h2>
              <div className=" text-black mb-3  font-sawarabi line-clamp-4" style={{ maxHeight: isMobile?fsm(137):fs(137), overflow: "hidden" }}>
                <ReactMarkdown>{getExcerpt(blog.details)}</ReactMarkdown>
              </div>

              <div className="flex justify-end">
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-black text-sm font-medium hover:text-indigo-800 font-courierPrime"
                  style={{ fontSize: isMobile? fsm(25):fs(25), marginTop: isMobile? fsm(30):fs(30) }}
                >
                  more+
                </Link>
              </div>
            </div>
          </GridItem>
        ))}
      </ResponsiveGrid>
      
      <div style={{marginLeft: fs(90)}}>
        <h2 className=" font-cousine text-black text-start" style={{ fontSize: isMobile?fsm(25):fs(25), marginTop: isMobile? fsm(100):fs(100) }}>
          SNSの動画
        </h2>
        <h2 className=" font-cousine text-black text-start font-bold" style={{ fontSize: isMobile?fsm(60):fs(60), marginTop:isMobile? fsm(20): fs(20) }}>
          SUGAMO NAVI
        </h2>
        <h2 className=" font-cousine text-[#ED4548] text-start italic" style={{ fontSize: isMobile? fsm(48):fs(48), marginTop:isMobile? fsm(20) :fs(20) }}>
          #INSTAGRAM
        </h2>
        <h2 className=" font-cousine text-[#ED4548] text-start italic" style={{ fontSize: isMobile? fsm(48): fs(48), marginTop: isMobile? fsm(8):fs(8) }}>
          #TIKTOK
        </h2>
      </div>
       <TikTokVideoSlider videos={videos} />
        <Footer />
    </div>
  );
}