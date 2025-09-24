import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useDevice } from "~/routes/contexts/DeviceContext";
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
}) => {
  const { fs, fsm } = useUniversalFluid();
  const navigate = useNavigate();
  const isMobile = useDevice();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(initialLikes);
  const [categoriesShop, setCategoriesShop] = useState<any[]>([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem(category) || '{}');
    if (savedBookmarks[shopId || '']) {
      setIsBookmarked(true);
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        console.log('Fetched Categories:', data);
        if (error) throw error;
        setCategoriesShop(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };
    fetchData();
  }, [category, shopId]);

  const getCategoryName = (categoryId: string) => {
    if (!categoriesShop.length) return 'Loading...';
    const category = categoriesShop.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category';
  };

  const handleLoveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shopId) {
      console.error('No shopId provided for love click');
      return;
    }
    try {
      const { error } = await supabase.rpc('increment_love_count', { shop_id: shopId });
      if (error) {
        console.error('Error incrementing love count:', error);
      } else {
        setLikes(likes + 1);
        console.log('Love count incremented for shopId:', shopId);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shopId) {
      console.error('No shopId provided for bookmark');
      return;
    }
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
    };
    const savedBookmarks = JSON.parse(localStorage.getItem(getCategoryName(category_id)) || '{}');
    if (isBookmarked) {
      delete savedBookmarks[shopId];
      localStorage.setItem(getCategoryName(category_id), JSON.stringify(savedBookmarks));
      setIsBookmarked(false);
    } else {
      savedBookmarks[shopId] = productData;
      localStorage.setItem(getCategoryName(category_id), JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
    }
  };

  const handleBlogListClick = () => {
    if (!shopId) {
      console.error('No shopId provided for navigation');
      return;
    }
    navigate(`${linkTo}?id=${shopId}&type=shops`, {
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
        },
        type: 'shops',
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
              src="/src/love.svg"
              alt="Love"
              onClick={handleLoveClick}
              style={{
                width: isMobile ? fsm(20) : fs(20),
                height: isMobile ? fsm(20) : fs(20),
                cursor: 'pointer',
              }}
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