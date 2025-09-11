// TravelsTipsItem.tsx
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import { useMediaQuery } from "react-responsive";
import { Link } from "@remix-run/react";

interface Blog {
  id: string;
  title: string;
  details?: string;
  publish_date?: string;
  top_image?: string;
  category_id?: string;
}

interface TravelsTipsItemProps {
  categories: string[];
  blog?: Blog;  // Optional single blog data
}

export default function TravelsTipsItem({ categories , blog }: TravelsTipsItemProps) {
  const { fs, fsm } = useUniversalFluid();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));

  // Format date from blog.publish_date or fallback
  const formatDate = (dateString?: string) => {
    if (!dateString) return "2025.08.15";  // Fallback
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  };

  const getExcerpt = (details?: string) => {
    if (!details) return null;
    return details.split('\n')[0] || details.substring(0, 50) + '...';
  };
  const imageSrc = blog?.top_image || "./src/tips-1.png";
  const blogId = blog?.id || "default-id";
  const enhancedCategories = blog?.category_id ? [categories] : categories;

  return (
    <Link
      to={`/blog/${blogId}`}
      className="no-underline"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="flex flex-row border-2 border-black rounded-lg w-full overflow-hidden"
        style={{
          height: autoSize(113),
        }}
      >
        <img
          className="object-cover m-0"
          style={{
            width: autoSize(113),
          }}
          src={imageSrc}
          alt={blog?.title || "Spices"}
        />

        <div
          className="flex flex-col justify-between"
          style={{
            marginLeft: autoSize(16),
            paddingRight: autoSize(18),
            paddingBottom: autoSize(9),
            paddingTop: autoSize(9)
          }}
        >
          <div>
            <p
              className="italic font-cousine text-black"
              style={{
                width: isMobile ? fsm(77) : fs(77),
                fontSize: autoSize(12),
                lineHeight: autoSize(30),
                maxLines: 1,
                fontWeight: autoSize(400)
              }}
            >
              {formatDate(blog?.publish_date)}
            </p>
            <h2
              className="font-semibold text-[#313131] font-cairo"
              style={{
                fontSize: autoSize(16),
                lineHeight: autoSize(24),
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {blog?.title || "テキスが入ります"}
            </h2>
          </div>

          {/* Categories */}
          <div className="flex space-x-2" style={{ marginTop: autoSize(12) }}>
            <div className="flex" style={{ gap: autoSize(8) }}>
              {enhancedCategories.map((category, index) => (
                <span
                  key={index}
                  className="border border-red-500 text-red-500 rounded-full italic text-center bg-white font-cousine px-2"
                  style={{
                    fontSize: autoSize(12),
                    lineHeight: autoSize(17),
                  }}
                >
                  #{category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>

  );
}