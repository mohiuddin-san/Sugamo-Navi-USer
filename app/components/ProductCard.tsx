import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useNavigate } from '@remix-run/react';
import { useMediaQuery } from 'react-responsive';

interface ProductCardProps {
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  views: number;
  linkTo?: string;
  category: string;
  opening_hours: string;
  style?: React.CSSProperties;
  shopId?: string;
  near_station: string;
  address: string;
  map_embed: string;
  other_images: JSON;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  imageUrl,
  shopId,
  near_station,
  address,
  map_embed,
  other_images,
  category,
  description,
  opening_hours,
  likes,
  views,
  linkTo = '/ShopDetails',
  style,
}) => {
  const { fs, fsm, fluidStyle, fluidClass } = useUniversalFluid();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // State to track bookmark status
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Check local storage on component mount to set initial bookmark state
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem(category) || '{}');
    if (savedBookmarks[shopId || '']) {
      setIsBookmarked(true);
    }
  }, [category, shopId]);

  // Handle bookmark click
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick

    const productData = {
      id: shopId || '1ea7ae99-de53-4c3d-ac87-d2a47203cc64',
      title,
      imageUrl,
      description,
      likes,
      views,
      near_station,
      address,
      map_embed,
      other_images,
      opening_hours,
      category,
    };

    // Get existing bookmarks for the category
    const savedBookmarks = JSON.parse(localStorage.getItem(category) || '{}');

    if (isBookmarked) {
      // Remove from local storage
      delete savedBookmarks[shopId || ''];
      localStorage.setItem(category, JSON.stringify(savedBookmarks));
      setIsBookmarked(false);
    } else {
      // Add to local storage
      savedBookmarks[shopId || ''] = productData;
      localStorage.setItem(category, JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
    }
  };

  const handleBlogListClick = () => {
    navigate(linkTo, {
      state: {
        shop: {
          id: shopId || '1ea7ae99-de53-4c3d-ac87-d2a47203cc64',
          title,
          imageUrl,
          description,
          likes,
          views,
          near_station,
          address,
          map_embed,
          other_images,
          opening_hours,
        },
      },
    });
  };

  return (
    <div
      onClick={handleBlogListClick}
      className="border-2 border-black rounded-lg bg-white flex flex-col font-cairo w-full pb-5"
      style={{
        borderRadius: isMobile ? fsm(10) : fs(10),
        ...style,
      }}
    >
      {/* Title */}
      <h1
        className="text-center font-bold my-5 font-cairo"
        style={{ fontSize: isMobile ? fsm(25) : fs(25), color: '#313131' }}
      >
        {title}
      </h1>

      {/* Image */}
      <img
        src={imageUrl || '/src/shop.png'}
        alt={title}
        className="w-full object-cover"
        style={{ height: isMobile ? fsm(210) : fs(210) }}
      />

      {/* Buttons + Stats */}
      <div
        className="flex justify-between"
        style={{
          paddingLeft: isMobile ? fsm(14) : fs(19),
          paddingTop: isMobile ? fsm(12) : fs(16),
          paddingRight: isMobile ? fsm(14) : fs(19),
        }}
      >
        <button
          className="bg-[#ED4548] text-white rounded-full italic font-cairo text-center"
          style={{
            width: isMobile ? fsm(92) : fs(92),
            minWidth: isMobile ? fsm(72) : fs(72),
            height: isMobile ? fsm(22) : fs(22),
            minHeight: isMobile ? fsm(17) : fs(17),
            fontSize: isMobile ? fsm(12) : fs(12),
          }}
        >
          {category}
        </button>

        <div className="flex space-x-3">
          <span className="flex items-center gap-1">
            <img
              src="/src/love.svg"
              alt="Love"
              style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
            />
            <p
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
            >
              {likes}
            </p>
          </span>

          <span className="flex items-center gap-1">
            <img
              src="/src/eye.svg"
              alt="Views"
              style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
            />
            <p
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
            >
              {views}
            </p>
          </span>

          <span className="flex items-center">
            <img
              src={isBookmarked ? '/src/bookmark-filled.svg' : '/src/bookmark.svg'}
              alt="Bookmark"
              onClick={handleBookmarkClick}
              style={{
                width: isMobile ? fsm(20) : fs(20),
                height: isMobile ? fsm(20) : fs(20),
                cursor: 'pointer',
              }}
            />
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow" style={{ marginTop: isMobile ? fs(32) : fs(24) }}>
        <p
          className="px-5 font-medium font-cairo text-start line-clamp-5"
          style={{ fontSize: isMobile ? fsm(16) : fs(16), color: '#313131', fontWeight: fs(500) }}
        >
          {description}
        </p>
        <Link
          to={linkTo}
          className="font-bold mt-6 text-end mr-5 hover:text-blue-600"
          style={{ fontSize: isMobile ? fsm(12) : fs(12), color: '#000000' }}
        >
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;