import React, { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import ProductCard from '~/components/ProductCard';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '~/components/Footer';
import { useDevice } from '~/routes/contexts/DeviceContext';
import { useUniversalFluid } from '~/hooks/useUniversalFluid';
import supabase  from '~/supabase'; // Adjust import based on your setup

interface Shop {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  likes: number;
  views: number;
  near_station: string;
  address: string;
  map_embed: string;
  other_images: JSON;
  opening_hours: string;
  category: string;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const location = useLocation();
  const { fs, fsm } = useUniversalFluid();
  const isMobile = useDevice();

useEffect(() => {
  const fetchBookmarksAndShops = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const localCategories = [];
      const shopIds = [];

      // Step 1: Extract categories and shop IDs from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (!key.startsWith('sb-')) {
          const bookmarks = JSON.parse(localStorage.getItem(key) || '{}');
          if (Object.keys(bookmarks).length > 0) {
            localCategories.push(key);
            Object.keys(bookmarks).forEach((shopId) => {
              const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
              if (uuidRegex.test(shopId) && !shopIds.includes(shopId)) {
                shopIds.push(shopId);
              }
            });
          }
        }
      });

      if (localCategories.length === 0) {
        setCategories([]);
        setBookmarkedProducts([]);
        setErrorMsg('No bookmarked items found.');
        setLoading(false);
        return;
      }

      // Set default category
      if (!selectedCategory && localCategories.length > 0) {
        setSelectedCategory(localCategories[0]);
      }
      setCategories(localCategories);

      if (shopIds.length === 0) {
        setBookmarkedProducts([]);
        setErrorMsg('No valid bookmarked shops found.');
        setLoading(false);
        return;
      }

      // Step 2: Fetch shop details from Supabase
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .in('id', shopIds);

      if (shopsError) {
        throw new Error(`Failed to fetch shops: ${shopsError.message}`);
      }

      if (!shops || shops.length === 0) {
        setBookmarkedProducts([]);
        setErrorMsg('No matching shops found in database.');
        setLoading(false);
        return;
      }

      // Step 3: Filter shops by selected category
      const filteredShops = shops.filter((shop) => {
        const categoryBookmarks = JSON.parse(localStorage.getItem(shop.category) || '{}');
        return selectedCategory ? shop.category === selectedCategory && categoryBookmarks[shop.id] : categoryBookmarks[shop.id];
      });

      setBookmarkedProducts(filteredShops);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error fetching bookmarked shops';
      setErrorMsg(errMsg);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchBookmarksAndShops();
}, [selectedCategory]);
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
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
        animationDuration="40s"
        marginBottom={117}
        marginTop={98}
      />
      <div
        className="w-full items-center text-center mb-8 px-4 flex justify-center gap-4 font-sawarabi"
        style={{ marginBottom: isMobile ? fsm(56) : fs(72) }}
      >
        {categories.length > 0 ? (
          categories.map((category) => (
            <p
              key={category}
              className={`text-center h-auto cursor-pointer ${
                selectedCategory === category ? 'bg-black text-white' : 'text-black border'
              }`}
              style={{
                fontSize: isMobile ? fsm(20) : fs(20),
                fontFamily: 'sans-serif',
                width: isMobile ? fsm(159) : fs(159),
              }}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </p>
          ))
        ) : (
          <p
            className="text-center font-sawarabi"
            style={{ fontSize: isMobile ? fsm(20) : fs(20), color: '#313131' }}
          >
            No categories found.
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
              paddingLeft: isMobile ? fsm(20) : fsm(163),
              paddingRight: isMobile ? fsm(20) : fsm(163),
            }}
          >
            {bookmarkedProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.name}
                imageUrl={product.imageUrl}
                description={product.description}
                likes={product.likes}
                views={product.views}
                shopId={product.id}
                near_station={product.near_station}
                address={product.address}
                map_embed={product.map_embed}
                other_images={product.other_images}
                opening_hours={product.opening_hours}
                category={product.category}
                linkTo="/ShopDetails"
              />
            ))}
          </div>
        ) : (
          <p
            className="text-center font-sawarabi"
            style={{ fontSize: isMobile ? fsm(20) : fs(20), color: '#313131' }}
          >
            No bookmarks found for {selectedCategory || 'any category'}.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}