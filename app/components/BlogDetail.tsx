import { Link } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Import remark-gfm
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface BlogDetailProps {
  blog: {
    id: string;
    title: string;
    details: string;
    top_image?: string;
    publish_date: string;
  };
  categoryName: string;
}

export default function BlogDetail({ blog, categoryName }: BlogDetailProps) {
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
    setBookmarkedBlogs(savedBookmarks);
  }, []);

  const toggleBookmark = (blogId: string) => {
    const updatedBookmarks = bookmarkedBlogs.includes(blogId)
      ? bookmarkedBlogs.filter((id) => id !== blogId)
      : [...bookmarkedBlogs, blogId];

    setBookmarkedBlogs(updatedBookmarks);
    localStorage.setItem("bookmarkedBlogs", JSON.stringify(updatedBookmarks));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">
              {formatDate(blog.publish_date)} | {categoryName}
            </span>
          </div>
          <button
            onClick={() => toggleBookmark(blog.id)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle bookmark"
          >
            <BookmarkIcon
              className={`h-6 w-6 ${
                bookmarkedBlogs.includes(blog.id)
                  ? "text-indigo-600 fill-indigo-600"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {blog.top_image && (
          <div className="h-96 overflow-hidden">
            <img
              src={blog.top_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <div className="prose prose-lg text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.details}</ReactMarkdown>
          </div>
        </div>

        <div className="p-6">
          <Link
            to="/"
            className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            ← Back to Articles
          </Link>
        </div>
      </div>
    </div>
  );
}