import { Link } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import CommonCategoryTop from "../components/CommonCategoryTop";
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import Header from "../components/Header";
import OGPPreview from "~/components/OGPPreview";
import { useMediaQuery } from "react-responsive";
import MarqueeHeader from "../components/MarqueeHeader";

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

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function BlogDetail({ blog, categoryName }: BlogDetailProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const headingElements = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topImageInputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [cursorNode, setCursorNode] = useState<Node | null>(null);
  const [cursorOffset, setCursorOffset] = useState(0);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [tocKey, setTocKey] = useState(0);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>([]);
  const { fs, fsm, fsVw, fluidStyle, fluidClass } = useUniversalFluid();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const tocItemRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const registerHeading = (id: string, element: HTMLElement | null, text: string, level: number) => {
    if (element && text && id) {
      headingElements.current[id] = element;
      if ((level === 2 || level === 3) && !headings.some(h => h.id === id)) {
        setHeadings(prev => [...prev, { id, text, level }]);
        setTocKey(prev => prev + 1);
      }
    }
  };

  const scrollToHeading = (id: string) => {
    const element = headingElements.current[id];
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrollTop;
      const headerHeight = 180;
      const targetPosition = elementTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      element.classList.add('highlighted-heading');
      setTimeout(() => {
        element.classList.remove('highlighted-heading');
      }, 2000);
      setActiveHeading(id);
    }
  };

  const extractText = (children: any): string => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(extractText).join('');
    if (children?.props?.children) return extractText(children.props.children);
    return '';
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      let closestHeading: string | null = null;
      let minDistance = Infinity;

      Object.entries(headingElements.current).forEach(([id, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const distance = Math.abs(scrollPosition + 180 - elementTop);
          if (distance < minDistance) {
            minDistance = distance;
            closestHeading = id;
          }
        }
      });

      setActiveHeading(closestHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  useEffect(() => {
    if (activeHeading && tocItemRefs.current[activeHeading] && tocContainerRef.current) {
      const tocItem = tocItemRefs.current[activeHeading];
      const tocContainer = tocContainerRef.current;
      const tocRect = tocContainer.getBoundingClientRect();
      const itemRect = tocItem.getBoundingClientRect();

      if (itemRect.bottom > tocRect.bottom || itemRect.top < tocRect.top) {
        tocItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [activeHeading]);

  const markdownComponents = {
    h1: ({ node, children, ...props }: any) => null,
    h2: ({ node, children, ...props }: any) => {
      const text = extractText(children);
      return (
        <h2 
          id={props.id} 
          ref={(el) => registerHeading(props.id || "", el, text, 2)} 
          {...props} 
          className="markdown-heading markdown-h2" 
        >
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      const text = extractText(children);
      return (
        <h3 
          id={props.id} 
          ref={(el) => registerHeading(props.id || "", el, text, 3)} 
          {...props} 
          className="markdown-heading markdown-h3" 
        >
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }: any) => {
      const text = extractText(children);
      return (
        <h4 
          id={props.id} 
          ref={(el) => registerHeading(props.id || "", el, text, 4)} 
          {...props} 
          className="markdown-heading markdown-h4" 
        >
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }: any) => {
      const text = extractText(children);
      return (
        <h5 
          id={props.id} 
          ref={(el) => registerHeading(props.id || "", el, text, 5)} 
          {...props} 
          className="markdown-heading markdown-h5" 
        >
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }: any) => {
      const text = extractText(children);
      return (
        <h6 
          id={props.id} 
          ref={(el) => registerHeading(props.id || "", el, text, 6)} 
          {...props} 
          className="markdown-heading markdown-h6" 
        >
          {children}
        </h6>
      );
    },
    table: ({ node, ...props }: any) => (
      <div className="table-container">
        <table {...props} />
      </div>
    ),
    p: ({ node, children, ...props }: any) => {
      if (typeof children === "string" && children.startsWith("[side-by-side:")) {
        const images = children.match(/!\[.*?\]\(.*?\)/g) || [];
        return (
          <div className="side-by-side-container">
            {images.map((imgMd: string, index: number) => (
              <div key={index} className="side-by-side-image">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeRaw]}
                  components={markdownComponents}
                >
                  {imgMd}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        );
      }
      return (
        <p {...props}>
          {cursorNode && cursorNode.parentElement === node && typeof children === "string" ? (
            <>
              {children.substring(0, cursorOffset)}
              <span ref={cursorRef} className="blinking-cursor">|</span>
              {children.substring(cursorOffset)}
            </>
          ) : (
            children
          )}
        </p>
      );
    },
    span: ({ node, ...props }: any) => <span {...props} style={props.style} />,
    a: ({ node, href, children, ...props }: any) => {
      if (href?.startsWith("ogp:")) {
        const actualUrl = href.replace("ogp:", "");
        return <OGPPreview url={actualUrl} />;
      }
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline ? (
        <div className="code-block">
          <div className="code-language">{match?.[1] || "code"}</div>
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

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
    <div>
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
      />
      <div className=" mx-auto py-12 bg-white">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="h-40 p-2 flex flex-col gap-3 justify-center items-center rounded-r-lg border-t-2 border-b-2 border-l-0 border-r-2 border-black overflow-hidden">
            <a href="https://www.instagram.com/reel/DNfV4MozhwL/">
              <img
                src="/src/instagram-icon.svg"
                alt="Instagram"
                className="w-10 h-10"
              />
            </a>
            <a href="https://www.tiktok.com/@sugamo_japan">
              <img
                src="/src/titok.svg"
                alt="TikTok"
                className="w-10 h-10"
              />
            </a>
          </div>
          <div className={`bg-white rounded-tl-xl rounded-bl-xl rounded-r-none overflow-hidden ${headings.length > 0 ? 'lg:w-3/4 lg:order-1' : 'w-full'} border-t-2 border-b-2 border-l-2 border-r-0 border-black`}>
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
              <h1 className="text-3xl font-semibold font-cairo text-black mb-2">{blog.title}</h1>
              <span className="font-courierPrime text-gray-500">
                {formatDate(blog.publish_date)} | {categoryName}
              </span>
              <div
                className="prose prose-lg text-black font-cairo font-semibold markdown-content"
                style={{
                  marginTop: isMobile ? fsm(55) : fs(55),
                  fontSize: isMobile ? fsm(16) : fs(20),
                  letterSpacing: "10%",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeRaw]}
                  components={markdownComponents}
                >
                  {blog.details}
                </ReactMarkdown>
              </div>
            </div>
            <div className="p-6">
              <Link
                to="/"
                className="text-[#ED4548] font-medium hover:text-[#ED4548] transition-colors"
              >
                ← Back to Articles
              </Link>
            </div>
          </div>

          {/* Table of Contents */}
          {headings.length > 0 && (
           <div className="lg:w-1/4 mb-8 lg:mb-0 lg:order-2">
              <div className="sticky top-28 bg-white p-6 rounded-l-xl border-t-2 border-b-2 border-l-2 border-black">
                <h3 className="text-xl font-semibold font-cairo text-black mb-4 text-center">
                  目次
                </h3>
                <div className="toc-container relative max-h-[calc(100vh-200px)] overflow-y-auto" ref={tocContainerRef}>
                  <ul className="space-y-1">
                    {headings.map((heading) => (
                      <li
                        key={heading.id}
                        ref={(el) => { tocItemRefs.current[heading.id] = el; }}
                        className={`toc-item toc-level-${heading.level} transition-colors cursor-pointer flex items-center`}
                        onClick={() => scrollToHeading(heading.id)}
                      >
                        <span
                          className={`toc-marker-wrapper flex justify-center items-center bg-white rounded-full ${
                            heading.level === 2 ? 'w-[19px] h-[19px] pl-[2px]' : 'w-[19px] h-[9px] pl-[2px]'
                          }`}
                        >
                          <span
                            className={`toc-marker ${
                              activeHeading === heading.id
                                ? 'text-[#ED4548] font-bold'
                                : 'text-gray-700'
                            } ${heading.level === 2 ? 'triangle-marker' : 'circle-marker'}`}
                          >
                            {heading.level === 2
                              ? activeHeading === heading.id
                                ? '▼'
                                : '▽'
                              : activeHeading === heading.id
                              ? '●'
                              : '○'}
                          </span>
                        </span>
                        <span
                          className={`flex-1 ml-3 ${
                            activeHeading === heading.id
                              ? 'text-[#ED4548] font-bold'
                              : 'text-gray-700 hover:text-indigo-600'
                          } ${heading.level === 3 ? 'toc-level-3' : 'toc-level-2'}`}
                        >
                          {heading.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .markdown-heading {
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #000;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.3em;
          scroll-margin-top: 120px;
        }
        
        .markdown-h2 {
          font-size: 1.875em !important;
          border-bottom-width: 2px;
          border-color: #60a5fa;
        }
        
        .markdown-h3 {
          font-size: 1.5em !important;
          border-bottom-width: 2px;
          border-color: #93c5fd;
        }
        
        .markdown-h4 {
          font-size: 1.25em !important;
          border-bottom-width: 1px;
          border-style: dashed;
        }
        
        .markdown-h5 {
          font-size: 1.125em !important;
          border-bottom-width: 1px;
          border-style: dotted;
        }
        
        .markdown-h6 {
          font-size: 1em !important;
          color: #6b7280;
          border-bottom-width: 1px;
          border-style: dotted;
          border-color: #d1d5db;
        }
        
        .highlighted-heading {
          background-color: rgba(255, 237, 213, 0.8);
          transition: background-color 2s ease;
        }
        
        .markdown-content {
          line-height: 1.8;
        }
        
        .markdown-content p {
          margin-bottom: 1.2em;
        }
        
        .table-container {
          overflow-x: auto;
          margin: 1.5em 0;
        }
        
        .table-container table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .table-container th, .table-container td {
          border: 1px solid #e5e7eb;
          padding: 0.75em;
          text-align: left;
        }
        
        .table-container th {
          background-color: #f9fafb;
          font-weight: bold;
        }
        
        .table-container tr:nth-child(even) {
          background-color: #f3f4f6;
        }
        
        .code-block {
          position: relative;
          margin: 1.5em 0;
          border-radius: 0.5em;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .code-language {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #3b82f6;
          color: white;
          padding: 0.25em 0.75em;
          font-size: 0.75em;
          border-bottom-left-radius: 0.5em;
          font-family: monospace;
        }
        
        .code-block code {
          display: block;
          padding: 1.5em 1em 1em 1em;
          overflow-x: auto;
          background-color: #1f2937;
          color: #f3f4f6;
        }
        
        .side-by-side-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          margin: 1.5em 0;
        }
        
        .side-by-side-image {
          flex: 1;
          min-width: 250px;
        }
        
        .side-by-side-image img {
          width: 100%;
          height: auto;
          border-radius: 0.5em;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .blinking-cursor {
          animation: blink 1s steps(2, start) infinite;
          color: #3b82f6;
          font-weight: bold;
        }
        
        .toc-container {
          position: relative;
        }
        
        .toc-container::before {
          content: '';
          position: absolute;
          left: 9.5px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #d1d5db;
          z-index: 1;
        }
        
        .toc-item {
          display: flex;
          align-items: center;
          padding: 0.4em 0;
          transition: all 0.2s ease;
          line-height: 1.4;
          position: relative;
          z-index: 2;
        }
        
        .toc-marker-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
          border-radius: 50%;
          margin-left: 0;
          margin-right: 0;
        }
        
        .toc-marker {
          line-height: 1;
        }
        
        .triangle-marker {
          font-size: 12px;
          line-height: 1;
        }
        
        .circle-marker {
          font-size: 7px;
          line-height: 1;
        }
        
        .toc-level-2 {
          font-weight: 600;
          font-size: 1.1em;
        }
        
        .toc-level-3 {
          font-weight: 500;
          font-size: 1em;
        }
        
        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}