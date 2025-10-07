import React, { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import ProductCard from '~/components/ProductCard';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '~/components/Footer';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useUniversalFluid } from '~/hooks/useUniversalFluid';
import supabase from '~/supabase';

interface Shop {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  love_count: number;
  review_count: number;
  near_station?: string;
  address?: string;
  map_embed?: string;
  other_images?: string[];
  opening_hours?: string;
  category: string;
  category_id: string;
  type?: 'shop' | 'place';
}

type ItemType = 'shops' | 'places';

export default function BookmarkPage() {
  const [selectedType, setSelectedType] = useState<ItemType>('shops');
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Shop[]>([]);
  const [availableTypes, setAvailableTypes] = useState<ItemType[]>(['shops', 'places']);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const location = useLocation();
  const { fs, fsm } = useUniversalFluid();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    const fetchBookmarksAndItems = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
        console.log('Unified Bookmarks:', savedBookmarks);

        if (Object.keys(savedBookmarks).length === 0) {
          setAvailableTypes([]);
          setBookmarkedProducts([]);
          setErrorMsg('No bookmarked items found.');
          setLoading(false);
          return;
        }

        // Group by type and extract IDs
        const typeGroups: { [key in ItemType]: string[] } = { shops: [], places: [] };

        Object.keys(savedBookmarks).forEach((itemId) => {
          const bookmark = savedBookmarks[itemId];
          if (bookmark && bookmark.type) {
            const normalizedType = bookmark.type === 'shop' ? 'shops' : 'places';
            if (!typeGroups[normalizedType as ItemType].includes(itemId)) {
              typeGroups[normalizedType as ItemType].push(itemId);
            }
          } else {
            if (!typeGroups['shops'].includes(itemId)) {
              typeGroups['shops'].push(itemId);
            }
          }
        });

        console.log('Type Groups:', typeGroups);

        const typesWithData = Object.keys(typeGroups).filter((t) => typeGroups[t as ItemType].length > 0) as ItemType[];
        if (typesWithData.length === 0) {
          setAvailableTypes([]);
          setBookmarkedProducts([]);
          setErrorMsg('No valid bookmarked items found.');
          setLoading(false);
          return;
        }

        if (!typesWithData.includes(selectedType)) {
          setSelectedType(typesWithData[0]);
        }
        setAvailableTypes(typesWithData);

        const currentType = selectedType;
        const itemIds = typeGroups[currentType];

        if (itemIds.length === 0) {
          setBookmarkedProducts([]);
          setErrorMsg(`No bookmarked ${currentType} found.`);
          setLoading(false);
          return;
        }

        const { data: shops, error: shopsError } = await supabase
          .from('shops')
          .select('*')
          .in('id', itemIds);

        if (shopsError) {
          throw new Error(`Failed to fetch shops: ${shopsError.message}`);
        }

        let items: Shop[] = [];
        if (shops && shops.length > 0) {
          items = shops.map(shop => ({
            ...shop,
            imageUrl: shop.image_url || shop.imageUrl || '/src/shop.png',
            other_images: typeof shop.other_images === 'string' ? JSON.parse(shop.other_images) : (shop.other_images || []),
            type: shop.type || 'shop',
            likes: Number.isFinite(shop.likes) ? shop.likes : 0, // Fallback
            views: Number.isFinite(shop.views) ? shop.views : 0, // Fallback
          }));
        }

        if (items.length === 0) {
          setBookmarkedProducts([]);
          setErrorMsg(`No matching ${currentType} found in database.`);
          setLoading(false);
          return;
        }

        const filteredItems = items.filter((item) => {
          const bookmark = savedBookmarks[item.id];
          if (!bookmark) return false;
          const bookmarkType = bookmark.type === 'shop' ? 'shops' : 'places';
          return bookmarkType === currentType;
        });

        console.log('Filtered Items:', filteredItems);
        setBookmarkedProducts(filteredItems);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error fetching bookmarked items';
        setErrorMsg(errMsg);
        console.error('Error details:', error);
      } finally {
        setLoading(false);
      }
    };

    console.log('Fetching bookmarks for type:', selectedType);
    fetchBookmarksAndItems();
  }, [selectedType]);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  const handleTypeClick = (type: ItemType) => {
    setSelectedType(type);
  };

  const getDisplayName = (type: ItemType) => {
    return type === 'shops' ? 'Shops' : 'Places';
  };

  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="BOOKMARK"
        subtitle="⛉"
        imageSrc="/src/food.png"
        imageAlt="Food and Drink Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="90s"
        marginBottom={117}
        marginTop={98}
      />
      <div
        className="w-full items-center text-center mb-8 px-4 flex justify-center gap-4 font-sawarabi"
        style={{ marginBottom: isMobile ? fsm(56) : fs(72) }}
      >
        {availableTypes.length > 0 ? (
          availableTypes.map((type) => (
            <p
              key={type}
              className={`text-center h-auto cursor-pointer ${
                selectedType === type ? 'bg-black text-white' : 'text-black border'
              }`}
              style={{
                fontSize: isMobile ? fsm(20) : fs(20),
                fontFamily: 'sans-serif',
                width: isMobile ? fsm(159) : fs(159),
              }}
              onClick={() => handleTypeClick(type)}
            >
              {getDisplayName(type)}
            </p>
          ))
        ) : (
          <p
            className="text-center font-sawarabi"
            style={{ fontSize: isMobile ? fsm(20) : fs(20), color: '#313131' }}
          >
            No types found.
          </p>
        )}
      </div>

      <div className="flex justify-center" style={{ marginBottom: isMobile ? fsm(70) : fs(70) }}>
        {loading ? (
          <p
            className="text-center font-sawarabi"
            style={{ fontSize: isMobile ? fsm(20) : fs(20), color: '#313131' }}
          >
            Loading bookmarks...
          </p>
        ) : errorMsg ? (
          <p
            className="text-center font-sawarabi"
            style={{ fontSize: isMobile ? fsm(20) : fs(20), color: '#313131' }}
          >
            {errorMsg}
          </p>
        ) : bookmarkedProducts.length > 0 ? (
          <div
            className="grid grid-cols-2 lg:grid-cols-3"
            style={{
              gap: isMobile ? fsm(19) : fs(32),
              paddingLeft: isMobile ? fsm(20) : fs(163),
              paddingRight: isMobile ? fsm(20) : fs(163),
            }}
          >
            {bookmarkedProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.name}
                imageUrl={product.imageUrl}
                description={product.description}
                likes={product.love_count}
                views={product.review_count}
                shopId={product.id}
                near_station={product.near_station || ''}
                address={product.address || ''}
                map_embed={product.map_embed || ''}
                other_images={product.other_images || []}
                opening_hours={product.opening_hours || ''}
                category={product.category}
                category_id={product.category_id}
                linkTo="/ShopDetails"
                style={{ width: isMobile ? 'auto' : fs(350), height: isMobile ? 'auto' : fs(496) }}
                imageHeight={210}
                type={product.type === 'place' ? 'travels' : 'shops'}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-center font-sawarabi"
            style={{ fontSize: isMobile ? fsm(20) : fs(20), color: '#313131' }}
          >
            No bookmarks found for {getDisplayName(selectedType)}.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}