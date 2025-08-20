import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import supabase from "~/supabase";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { ResponsiveGrid, GridItem } from "~/components/ResponsiveGrid.tsx";
import { useMediaQuery } from "react-responsive";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import ShimmerLayout from "./ShimmerLayout/SlBlogList";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);

  const isMobile = useMediaQuery({ maxWidth: 767 });

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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Latest <span className="text-indigo-600">Articles</span>
      </h1>

      <div className="bg-blue-500 text-white p-4 mb-4">Test Tailwind</div>

      <ResponsiveGrid
        columns={isMobile ? "1fr" : "1fr 1fr"}
        rows="auto"
        gap={32}
        isMobile={isMobile}
        className="w-full"
      >
        {blogs.map((blog, index) => (
          <GridItem
            key={blog.id}
            column={isMobile ? 1 : (index % 2) + 1}
            row={isMobile ? index + 1 : Math.floor(index / 2) + 1}
            columnSpan={1}
            rowSpan={1}
            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
              <span className="text-xs text-gray-500">
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
                <BookmarkIcon
                  className={`h-5 w-5 ${
                    bookmarkedBlogs.includes(blog.id) ? "text-indigo-600 fill-indigo-600" : "text-sky-400"
                  }`}
                />
              </button>
            </div>

            {blog.top_image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.top_image}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-indigo-600">
                {blog.title}
              </h2>
              <div className="text-gray-600 text-sm mb-3 line-clamp-5">
                <ReactMarkdown>{getExcerpt(blog.details, 5)}</ReactMarkdown>
              </div>

              <div className="flex justify-end">
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                >
                  more+
                </Link>
              </div>
            </div>
          </GridItem>
        ))}
      </ResponsiveGrid>
    </div>
  );
}