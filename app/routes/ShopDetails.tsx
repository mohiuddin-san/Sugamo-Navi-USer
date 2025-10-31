import { Link } from '@remix-run/react';
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
import { useIsMobile } from "~/hooks/useIsMobile";
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
  const { isMobile } = useIsMobile();
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const tocItemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const ulRef = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    if (ulRef.current && headings.length > 0) {
      const firstLi = ulRef.current.querySelector('li');
      const lastLi = ulRef.current.querySelector('li:last-child');
      if (firstLi && lastLi) {
        const firstRect = firstLi.getBoundingClientRect();
        const lastRect = lastLi.getBoundingClientRect();
        const lineHeight = lastRect.bottom - firstRect.top;
        const line = ulRef.current.querySelector('.toc-line');
        if (line) {
          (line as HTMLElement).style.height = `${Math.max(lineHeight, 20)}px`;
        }
      }
    }
  }, [headings, tocKey]);

  const markdownComponents: any = {
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
      const nodeChildren = node?.children || [];

      // Extract images (Markdown images and raw URLs) and non-image content
      const images: { url: string; alt?: string }[] = [];
      const nonImageContent: any[] = [];

      // Debug: Log entire node and children
      console.log('Paragraph node:', JSON.stringify(node, null, 2));
      console.log('nodeChildren:', JSON.stringify(nodeChildren, null, 2));

      nodeChildren.forEach((child: any, index: number) => {
        if (child.type === 'image') {
          console.log('Found image node:', child);
          images.push({ url: child.url, alt: child.alt || `Image ${index + 1}` });
        } else if (child.type === 'text') {
          const text = (child.value || '').trim();
          const urlRegex = /(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif)(?:\?[^\s]*)?)/gi;
          let lastIndex = 0;
          let match;

          console.log('Processing text:', text);

          // Split text around URLs
          while ((match = urlRegex.exec(text)) !== null) {
            const url = match[0];
            const start = match.index;
            const end = start + url.length;

            // Add text before the URL
            if (start > lastIndex) {
              const beforeText = text.slice(lastIndex, start).trim();
              if (beforeText) {
                nonImageContent.push(beforeText);
                console.log('Added beforeText:', beforeText);
              }
            }

            // Add URL as image
            images.push({ url, alt: `Image ${images.length + 1}` });
            console.log('Added image URL:', url);

            lastIndex = end;
          }

          // Add remaining text (including non-image URLs)
          if (lastIndex < text.length) {
            const remainingText = text.slice(lastIndex).trim();
            if (remainingText) {
              nonImageContent.push(remainingText);
              console.log('Added remainingText:', remainingText);
            }
          }
        } else if (child.type === 'link') {
          nonImageContent.push(
            <a key={`link-${index}`} href={child.url} {...child.properties}>
              {child.children?.map((c: any, i: number) => (
                c.type === 'text' ? c.value : (
                  c.type === 'strong' ? <strong key={`strong-${i}`}>{c.children?.map((sc: any) => sc.value || '')}</strong> :
                  c.type === 'emphasis' ? <em key={`em-${i}`}>{c.children?.map((sc: any) => sc.value || '')}</em> :
                  c.value || ''
                )
              ))}
            </a>
          );
          console.log('Added link:', child.url);
        } else if (child.type === 'strong') {
          nonImageContent.push(
            <strong key={`strong-${index}`}>
              {child.children?.map((c: any, i: number) => (
                c.type === 'text' ? c.value : (
                  c.type === 'link' ? <a key={`link-${i}`} href={c.url} {...c.properties}>{c.children?.map((sc: any) => sc.value || '')}</a> :
                  c.type === 'emphasis' ? <em key={`em-${i}`}>{c.children?.map((sc: any) => sc.value || '')}</em> :
                  c.value || ''
                )
              ))}
            </strong>
          );
          console.log('Added strong:', child);
        } else if (child.type === 'emphasis') {
          nonImageContent.push(
            <em key={`em-${index}`}>
              {child.children?.map((c: any, i: number) => (
                c.type === 'text' ? c.value : (
                  c.type === 'link' ? <a key={`link-${i}`} href={c.url} {...c.properties}>{c.children?.map((sc: any) => sc.value || '')}</a> :
                  c.type === 'strong' ? <strong key={`strong-${i}`}>{c.children?.map((sc: any) => sc.value || '')}</strong> :
                  c.value || ''
                )
              ))}
            </em>
          );
          console.log('Added emphasis:', child);
        } else {
          // Fallback for other nodes
          if (child.value) {
            nonImageContent.push(child.value);
            console.log('Added fallback text:', child.value);
          }
        }
      });

      // Debug: Log final arrays
      console.log('Images:', images);
      console.log('NonImageContent:', nonImageContent);

      // Handle side-by-side images
      const combinedText = nodeChildren
        .map((c: any) => {
          if (c.type === 'text') return c.value || '';
          if (c.type === 'image') return `![](${c.url})`;
          if (c.type === 'link') return (c.children?.map((ch: any) => ch.value || '').join('')) || '';
          return '';
        })
        .join('');
      const startsWithSideBySide = combinedText.trim().startsWith('[side-by-side:');

      if (startsWithSideBySide || images.length === 2) {
        if (images.length === 2) {
          console.log('Rendering side-by-side images:', images);
          return (
            <div className="image-pair-container" {...props} style={{ marginTop: '10px', marginBottom: '10px' }}>
              <div className="image-pair-item image-left">
                <img src={images[0].url} alt={images[0].alt || ''} className="markdown-image" style={{ width: '100%' }} />
              </div>
              <div className="image-pair-item image-right">
                <img src={images[1].url} alt={images[1].alt || ''} className="markdown-image" style={{ width: '100%' }} />
              </div>
            </div>
          );
        }
        // Fallback for side-by-side marker with wrong number of images
        if (images.length > 0) {
          console.log('Rendering individual images (side-by-side fallback):', images);
          return (
            <div>
              {images.map((img, idx) => (
                <div key={`image-${idx}`} style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <img src={img.url} alt={img.alt || ''} className="markdown-image" style={{ width: '100%' }} />
                </div>
              ))}
              {nonImageContent.length > 0 && (
                <p {...props}>
                  {nonImageContent}
                </p>
              )}
            </div>
          );
        }
      }

      // Handle images (one or more)
      if (images.length > 0) {
        console.log('Rendering individual images:', images);
        return (
          <div>
            {images.map((img, idx) => (
              <div key={`image-${idx}`} style={{ marginTop: '10px', marginBottom: '10px' }}>
                <img src={img.url} alt={img.alt || ''} className="markdown-image" style={{ width: '100%' }} />
              </div>
            ))}
            {nonImageContent.length > 0 && (
              <p {...props}>
                {nonImageContent}
              </p>
            )}
          </div>
        );
      }

      // Default paragraph rendering
      console.log('Rendering default paragraph with nonImageContent:', nonImageContent);
      return (
        <p {...props}>
          {cursorNode && cursorNode.parentElement === node && typeof children === "string" ? (
            <>
              {children.substring(0, cursorOffset)}
              <span ref={cursorRef} className="blinking-cursor">|</span>
              {children.substring(cursorOffset)}
            </>
          ) : (
            nonImageContent.length > 0 ? nonImageContent : children
          )}
        </p>
      );
    },
    img: ({ node, ...props }: any) => (
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <img {...props} className="markdown-image" style={{ width: '100%' }} />
      </div>
    ),
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

  const [linePosition, setLinePosition] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (!headings.length) return;

    const firstId = headings[0].id;
    const lastId = headings[headings.length - 1].id;
    const firstEl = tocItemRefs.current[firstId];
    const lastEl = tocItemRefs.current[lastId];

    if (firstEl && lastEl) {
      const containerTop = ulRef.current?.getBoundingClientRect().top ?? 0;
      const firstTop = firstEl.offsetTop + firstEl.offsetHeight / 2;
      const lastTop = lastEl.offsetTop + lastEl.offsetHeight / 2;

      setLinePosition({
        top: firstTop,
        height: lastTop - firstTop,
      });
    }
  }, [headings]);

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

      <div className="mx-auto" style={{marginTop: isMobile? fsm(134): fs(155), paddingLeft: isMobile? fsm(20):fs(0),paddingRight:isMobile? fsm(20):fs(0)}}>
        <div className="flex flex-col lg:flex-row gap-10">

          {!isMobile && ( <div className="p-2 flex flex-col gap-[31px] justify-center items-center rounded-r-lg border-t-2 border-b-2 border-l-0 border-r-2 border-black overflow-hidden" style={{width: fs(114),height: fs(205) }}>
            <a href="https://www.instagram.com/reel/DNfV4MozhwL/">
              <img src="/src/instagram-icon.svg" alt="Instagram" style={{width: fs(40), height: fs(40)}}/>
            </a>
            <a href="https://www.tiktok.com/@sugamo_japan">
              <img src="/src/titok.svg" alt="TikTok" style={{width: fs(40), height: fs(40)}} />
            </a>
          </div>)}

          <div className={`bg-white overflow-hidden ${headings.length > 0 ? 'lg:w-3/4 lg:order-1' : 'w-full'}`}>
            {blog.top_image && (
              <div className=" overflow-hidden" style={{width: isMobile? "100%": fs(900), height: isMobile? fsm(309):fs(630)}}>
                <img src={blog.top_image} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="pt-2">
              <h1 className="font-semibold font-cairo text-black mb-2" style={{fontSize: isMobile? fsm(31): fs(61)}}>{blog.title}</h1>
              <span className="font-courierPrime text-gray-500" style={{fontSize: isMobile? fsm(16): fs(20)}}>
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
              <Link to="/BlogList" className="text-[#ED4548] font-medium hover:text-[#ED4548] transition-colors">← Back to Articles</Link>
            </div>
          </div>

          {headings.length > 0 && !isMobile && (
            <div className="lg:w-1/4 mb-8 lg:mb-0 lg:order-2">
              <div className="sticky top-28 bg-transparent p-6 rounded-l-[30px] border-t-2 border-b-2 border-l-2 border-black">
                <h3 className="text-xl font-semibold font-cairo text-black mb-4 text-center">目次</h3>
                <div
                  className="toc-container relative max-h-[calc(100vh-200px)] overflow-y-auto"
                  ref={tocContainerRef}
                >
                  <ul className="space-y-1 relative" ref={ulRef}>
                    <div
                      className="toc-line absolute left-[9px] w-[2px] bg-black"
                      style={{ top: linePosition.top, height: linePosition.height }}
                    />

                    {headings.map((heading) => (
                      <li
                        key={heading.id}
                        ref={(el) => {
                          tocItemRefs.current[heading.id] = el;
                        }}
                        className={`toc-item toc-level-${heading.level} cursor-pointer flex items-center`}
                        onClick={() => scrollToHeading(heading.id)}
                      >
                        <span
                          className={`toc-marker-wrapper flex justify-center items-center bg-transparent rounded-full ${heading.level === 2
                              ? "w-[19px] h-[19px] pl-[2px]"
                              : "w-[19px] h-[9px] pl-[2px]"
                            }`}
                        >
                          <span
                            className={`toc-marker ${activeHeading === heading.id
                                ? "text-[#ED4548] font-bold"
                                : "text-black"
                              } ${heading.level === 2 ? "triangle-marker" : "circle-marker"
                              }`}
                            style={{
                              fontSize: heading.level === 2 ? fs(15) : fs(9),
                            }}
                          >
                            {heading.level === 2
                              ? activeHeading === heading.id
                                ? "▼"
                                : "▽"
                              : activeHeading === heading.id
                                ? "●"
                                : "○"}
                          </span>
                        </span>
                        <span
                          className={`flex-1 ml-3 ${activeHeading === heading.id
                              ? "text-[#ED4548] font-bold"
                              : "text-black"
                            } ${heading.level === 3 ? "toc-level-3" : "toc-level-2"}`}
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
    </div>
  );
}