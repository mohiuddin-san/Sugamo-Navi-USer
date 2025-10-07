import { Link } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useIsMobile } from '~/hooks/useIsMobile';
import React, { useState, useEffect } from 'react';
import supabase from '~/supabase';

interface ProductCardProps {
  title: string;
  imageUrl: string;
  description: string;
  category_id: string;
  category: string;
  likes: number;
  views: number;
  type: 'place' | 'shop';
  id: string;
  style?: React.CSSProperties;
  near_station?: string;
  address?: string;
  map_embed?: string;
  other_images?: string[];
  opening_hours?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  title,
  imageUrl,
  description,
  category_id,
  category,
  likes: initialLikes,
  views,
  style,
  id,
  near_station,
  address,
  map_embed,
  other_images,
  opening_hours,
}) => {
  const { fs, fsm } = useUniversalFluid();
  const { isMobile } = useIsMobile();
  const targetLink = `/ShopDetails?id=${id}&type=${type}s`;
  const [categoriesShop, setCategoriesShop] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(initialLikes);
  const [hasLoved, setHasLoved] = useState<boolean>(false);

  useEffect(() => {
    if (!['shop', 'place'].includes(type)) {
      console.error('ProductCard: Invalid type provided:', type);
      return;
    }

    // Unified bookmark check
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    if (savedBookmarks[id]) {
      setIsBookmarked(true);
      console.log(`ProductCard: Bookmark found for ${type} id: ${id}`);
    }

    // Unified love check
    const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
    if (lovedItems[id]) {
      setHasLoved(true);
    }

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
  }, [category, id, type]);

  const getCategoryName = (categoryId: string) => {
    const category = categoriesShop?.find(cat => cat.id === categoryId);
    return category ? category.name : category || 'No Category';
  };

  const handleLoveIncrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      console.error('ProductCard: No id provided for love increment');
      alert('Cannot like item: Invalid ID');
      return;
    }

    if (hasLoved) {
      console.log('ProductCard: Already loved, ignoring increment');
      return;
    }

    try {
      let rpcName, param;
      if (type === 'shop') {
        rpcName = 'increment_love_count';
        param = { shop_id: id };
      } else {
        rpcName = 'increment_love_count_place';
        param = { place_id: id };
      }

      const { error, data } = await supabase.rpc(rpcName, param);

      if (error) {
        console.error('ProductCard: RPC error:', error);
        alert(`Failed to like ${type}: ${error.message}`);
        return;
      }

      console.log('ProductCard: RPC success:', data);
      setLikesCount(prev => prev + 1);
      setHasLoved(true);

      // Unified localStorage
      const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
      lovedItems[id] = true;
      localStorage.setItem('lovedItems', JSON.stringify(lovedItems));

      console.log(`ProductCard: Successfully liked ${type} id: ${id}, new likes: ${likesCount + 1}`);
    } catch (err) {
      console.error('ProductCard: Unexpected error in increment:', err);
      alert('Failed to like item: Unexpected error');
    }
  };

  const handleLoveDecrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      console.error('ProductCard: No id provided for love decrement');
      alert('Cannot unlike item: Invalid ID');
      return;
    }

    if (!hasLoved) {
      console.log('ProductCard: Not loved yet, ignoring decrement');
      return;
    }

    try {
      let rpcName, param;
      if (type === 'shop') {
        rpcName = 'decrement_love_count';
        param = { shop_id: id };
      } else {
        rpcName = 'decrement_love_count_place';
        param = { place_id: id };
      }

      const { error, data } = await supabase.rpc(rpcName, param);

      if (error) {
        console.error('ProductCard: RPC error:', error);
        alert(`Failed to unlike ${type}: ${error.message}`);
        return;
      }

      console.log('ProductCard: RPC success:', data);
      setLikesCount(prev => Math.max(prev - 1, 0));
      setHasLoved(false);

      // Unified localStorage
      const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
      delete lovedItems[id];
      localStorage.setItem('lovedItems', JSON.stringify(lovedItems));

      console.log(`ProductCard: Successfully unliked ${type} id: ${id}, new likes: ${Math.max(likesCount - 1, 0)}`);
    } catch (err) {
      console.error('ProductCard: Unexpected error in decrement:', err);
      alert('Failed to unlike item: Unexpected error');
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      console.error('ProductCard: No id provided for bookmark');
      alert('Cannot bookmark item: Invalid ID');
      return;
    }

    if (!['shop', 'place'].includes(type)) {
      console.error('ProductCard: Invalid type for bookmark:', type);
      alert('Cannot bookmark item: Invalid type');
      return;
    }

    const productData = {
      id,
      title: title || 'Untitled',
      imageUrl: imageUrl || (type === 'place' ? '/src/see-do.png' : '/src/shop.png'),
      description: description || 'No description available',
      likes: likesCount,
      views: views || 0,
      category_id,
      category: getCategoryName(category_id),
      type,
      near_station: near_station || '',
      address: address || '',
      map_embed: map_embed || '',
      other_images: other_images || [],
      opening_hours: opening_hours || '',
    };

    // Unified key
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');

    if (isBookmarked) {
      delete savedBookmarks[id];
      localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
      setIsBookmarked(false);
      console.log(`ProductCard: Removed bookmark for ${type} id: ${id}`);
    } else {
      savedBookmarks[id] = productData;
      localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
      console.log(`ProductCard: Added bookmark for ${type} id: ${id}`);
    }
  };

  return (
    <div
      className="border-2 border-black rounded-lg bg-white flex flex-col font-cairo w-full h-full overflow-hidden"
      style={{
        borderRadius: isMobile ? fsm(10) : fs(10),
        ...style,
      }}
    >
      <div
        className="flex items-center justify-center w-full"
        style={{ height: isMobile ? fsm(64) : fs(87) }}
      >
        <h1
          className="text-center font-bold font-cairo text-black line-clamp-2 w-full"
          style={{
            fontSize: isMobile ? fsm(16) : fs(25),
            maxWidth: '100%',
            height: isMobile ? fsm(32) : fs(50),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.2',
          }}
        >
          {title || 'Untitled'}
        </h1>
      </div>
      <div className="relative">
        <img
          src={imageUrl || (type === 'place' ? '/src/see-do.png' : '/src/shop.png')}
          alt={title || 'Item'}
          className="w-full object-cover border-t-2 border-b-2 border-l-0 border-r-0 border-black"
          style={{ height: isMobile ? fsm(148) : fs(210) }}
          onError={(e) => {
            e.currentTarget.src = type === 'place' ? '/src/see-do.png' : '/src/shop.png';
          }}
        />
      </div>
      <div
        className="flex flex-col md:flex-row justify-center items-center md:justify-between"
        style={{
          paddingLeft: isMobile ? fsm(14) : fs(19),
          paddingTop: isMobile ? fsm(10) : fs(12),
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
          {getCategoryName(category_id)}
        </button>
        <div
          className="flex"
          style={{ marginTop: isMobile ? fsm(15) : fs(0), gap: isMobile ? fsm(16) : fs(16) }}
        >
          <span className="flex items-center" style={{ gap: isMobile ? fsm(5) : fs(5) }}>
            <img
              src={hasLoved ? '/src/red-love.svg' : '/src/love.svg'}
              alt="Love"
              onClick={handleLoveIncrement}
              onDoubleClick={handleLoveDecrement}
              style={{
                width: isMobile ? fsm(20) : fs(20),
                height: isMobile ? fsm(20) : fs(20),
                cursor: 'pointer',
              }}
              onError={(e) => {
                e.currentTarget.src = '/src/love.svg';
              }}
            />
            <p
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
            >
              {likesCount || 0}
            </p>
          </span>
          <span className="flex items-center" style={{ gap: isMobile ? fsm(5) : fs(5) }}
          >
            <img
              src="/src/eye.svg"
              alt="Views"
              style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
            />
            <p
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
            >
              {views || 0}
            </p>
          </span>
          <span className="flex items-center">
            <img
              src={isBookmarked ? '/src/bookmark-filled.svg' : '/src/bookmark.svg'}
              alt="Bookmark"
              onClick={handleBookmarkClick}
              style={{
                width: isMobile ? fsm(17) : fs(17),
                height: isMobile ? fsm(21) : fs(21),
                cursor: 'pointer',
              }}
            />
          </span>
        </div>
      </div>
      <div
        className="flex flex-col justify-between"
        style={{ paddingBottom: isMobile ? fsm(10) : fs(16), marginTop: fs(29), height: fs(132) }}
      >
        {!isMobile && (
          <p
            className="font-medium text-[#313131] font-cairo text-start line-clamp-3"
            style={{ fontSize: fs(16), paddingLeft: fs(38), paddingRight: fs(38), letterSpacing: 0 }}
          >
            {description || 'No description available'}
          </p>
        )}
        <Link
          to={targetLink}
          state={{
            type: `${type}s`,
            item: {
              id,
              title: title || 'Untitled',
              imageUrl: imageUrl || (type === 'place' ? '/src/see-do.png' : '/src/shop.png'),
              description: description || 'No description available',
              likes: likesCount,
              views: views || 0,
              category_id,
              category: getCategoryName(category_id),
              near_station: near_station || '',
              address: address || '',
              map_embed: map_embed || '',
              other_images: other_images || [],
              opening_hours: opening_hours || '',
            },
          }}
          className="italic font-bold font-cousine text-center md:text-end"
          style={{
            marginTop: isMobile ? fsm(15) : fs(0),
            fontSize: isMobile ? fsm(16) : fs(16),
            color: '#000000',
            paddingRight: isMobile ? fsm(0) : fs(18),
          }}
        >
          more+
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;