import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useIsMobile } from '../hooks/useIsMobile';
import { CountingNumber } from '../components/counting-number';
import supabase from '~/supabase';

interface ProductCardProps {
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  views: number;
  linkTo?: string;
  category: string;
  category_id: string;
  opening_hours: string;
  style?: React.CSSProperties;
  shopId?: string;
  near_station: string;
  address: string;
  map_embed: string;
  other_images: string[];
  imageHeight?: number;
  paddingText?: number;
  type: 'shops' | 'travels'; // Added type prop
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
  category_id,
  description,
  opening_hours,
  likes: initialLikes,
  views,
  linkTo = '/ShopDetails',
  style,
  imageHeight = 210,
  paddingText = 38,
  type, // Added type to props
}) => {
  const { fs, fsm } = useUniversalFluid();
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(initialLikes);
  const [hasLoved, setHasLoved] = useState<boolean>(false);
  const [categoriesShop, setCategoriesShop] = useState<any[]>([]);

  useEffect(() => {
    console.log('ProductCard: Initializing for shopId:', shopId, 'initialLikes:', initialLikes);

    // Unified bookmark check
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    if (shopId && savedBookmarks[shopId]) {
      setIsBookmarked(true);
    }

    // Check if user has already loved this shop
    const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
    if (shopId && lovedItems[shopId]) {
      setHasLoved(true);
      console.log('ProductCard: Shop already loved for shopId:', shopId);
    }

    // Fetch categories
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        if (error) throw error;
        setCategoriesShop(data || []);
      } catch (error) {
        console.error('ProductCard: Error fetching categories:', error);
      }
    };
    fetchData();
  }, [category, shopId, category_id]);

  const getCategoryName = (categoryId: string) => {
    if (!categoriesShop.length) return 'Loading...';
    const category = categoriesShop.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category';
  };

  // Toggle love: increment if not loved, decrement if already loved
  const handleLoveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shopId) {
      console.error('ProductCard: No shopId provided for love toggle');
      alert('Cannot like/unlike shop: Invalid shop ID');
      return;
    }

    console.log('ProductCard: shopId for toggle:', shopId, 'type:', typeof shopId, 'hasLoved:', hasLoved);

    if (hasLoved) {
      // Decrement
      try {
        console.log('ProductCard: Calling decrement_love_count RPC for shopId:', shopId);
        const { error, data } = await supabase.rpc('decrement_love_count', { shop_id: shopId });

        if (error) {
          console.error('ProductCard: RPC error:', error);
          alert(`Failed to unlike shop: ${error.message}`);
          return;
        }

        console.log('ProductCard: RPC success:', data);
        setLikes(prev => Math.max(prev - 1, 0));
        setHasLoved(false);

        // Remove from localStorage
        const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
        delete lovedItems[shopId];
        localStorage.setItem('lovedItems', JSON.stringify(lovedItems));

        console.log('ProductCard: Successfully unliked shopId:', shopId, 'new likes:', Math.max(likes - 1, 0));
      } catch (err) {
        console.error('ProductCard: Unexpected error in decrement:', err);
        alert('Failed to unlike shop: Unexpected error');
      }
    } else {
      // Increment
      try {
        console.log('ProductCard: Calling increment_love_count RPC for shopId:', shopId);
        const { error, data } = await supabase.rpc('increment_love_count', { shop_id: shopId });

        if (error) {
          console.error('ProductCard: RPC error:', error);
          alert(`Failed to like shop: ${error.message}`);
          return;
        }

        console.log('ProductCard: RPC success:', data);
        setLikes(prev => prev + 1);
        setHasLoved(true);

        // Save to localStorage
        const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
        lovedItems[shopId] = true;
        localStorage.setItem('lovedItems', JSON.stringify(lovedItems));

        console.log('ProductCard: Successfully liked shopId:', shopId, 'new likes:', likes + 1);
      } catch (err) {
        console.error('ProductCard: Unexpected error in increment:', err);
        alert('Failed to like shop: Unexpected error');
      }
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shopId) {
      console.error('ProductCard: No shopId provided for bookmark');
      return;
    }

    const normalizedType = type === 'shops' ? 'shop' : 'place'; // Standardize type for consistency

    const productData = {
      id: shopId,
      title,
      imageUrl,
      description,
      likes,
      views,
      near_station,
      address,
      map_embed,
      category_id,
      other_images,
      opening_hours,
      category: getCategoryName(category_id),
      type: normalizedType, // Use normalized type
    };

    // Unified key
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');

    if (isBookmarked) {
      delete savedBookmarks[shopId];
      localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
      setIsBookmarked(false);
    } else {
      savedBookmarks[shopId] = productData;
      localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
    }
  };

  const handleBlogListClick = () => {
    if (!shopId) {
      console.error('ProductCard: No shopId provided for navigation');
      return;
    }

    // Use original type for URL param to match details page expectation
    navigate(`${linkTo}?id=${shopId}&type=${type}`, {
      state: {
        shop: {
          id: shopId,
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
          category: getCategoryName(category_id),
          category_id,
          type, // Keep original type in state if needed
        },
        type,
      },
    });
  };

  return (
    <div
      onClick={handleBlogListClick}
      className="border-2 border-black rounded-lg bg-white flex flex-col font-cairo w-full pb-5 cursor-pointer"
      style={{
        borderRadius: isMobile ? fsm(10) : fs(10),
        ...style,
      }}
    >
      <h1
        className="text-center font-bold font-cairo flex items-center justify-center"
        style={{
          fontSize: isMobile ? fsm(25) : fs(25),
          color: '#313131',
          height: isMobile ? fsm(87) : fs(87),
        }}
      >
        {title || 'No Title Available'}
      </h1>
      <img
        src={imageUrl || '/src/shop.png'}
        alt={title}
        className="w-full object-cover"
        style={{ height: isMobile ? fsm(210) : fs(imageHeight) }}
      />
      <div
        className="flex justify-between"
        style={{
          paddingLeft: isMobile ? fsm(14) : fs(19),
          paddingTop: isMobile ? fsm(12) : fs(16),
          paddingRight: isMobile ? fsm(14) : fs(19),
        }}
      >
        <button
          className="bg-[#ED4548] text-white font-bold rounded-full italic font-cairo text-center"
          style={{
            width: isMobile ? fsm(92) : fs(92),
            minWidth: isMobile ? fsm(72) : fs(72),
            height: isMobile ? fsm(22) : fs(22),
            minHeight: isMobile ? fsm(17) : fs(17),
            fontSize: isMobile ? fsm(13) : fs(13),
          }}
        >
          {getCategoryName(category_id) || 'Shop'}
        </button>
        <div className="flex space-x-3">
          <span className="flex items-center gap-1">
            <img
              src={hasLoved ? '/src/red-love.svg' : '/src/love.svg'}
              alt="Love"
              onClick={handleLoveToggle}
              style={{
                width: isMobile ? fsm(20) : fs(20),
                height: isMobile ? fsm(20) : fs(20),
                cursor: 'pointer',
              }}
              onError={(e) => {
                console.error('ProductCard: Love icon failed to load');
                e.currentTarget.src = '/src/shop.png'; // Fallback
              }}
            />
            <CountingNumber
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
              number={likes}
            >
            </CountingNumber>
          </span>
          <span className="flex items-center gap-1">
            <img
              src="/src/eye.svg"
              alt="Views"
              style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
            />
            <CountingNumber
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
              number={views}
            >
            </CountingNumber>
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
          className="font-normal font-cairo text-[#313131] text-start line-clamp-3 leading-loose overflow-hidden"
          style={{
            fontSize: isMobile ? fsm(16) : fs(16),
            fontWeight: fs(500),
            paddingRight: isMobile ? fsm(paddingText) : fs(paddingText),
            paddingLeft: isMobile ? fsm(paddingText) : fs(paddingText),
          }}
        >
          {description || 'No description available'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;