import { useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import ProductCard from '~/components/ShopItem';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import supabaseShops from '~/supabase';
import { ResponsiveGrid, GridItem } from '../components/ResponsiveGrid';
import { useDevice } from '~/routes/contexts/DeviceContext';
import { useUniversalFluid } from '../hooks/useUniversalFluid';

type Shop = {
  id: string;
  name: string;
  category_id: string;
  description: string;
  address: string;
  image_url: string;
  love_count: number;
  review_count: number;
  near_station: string;
  map_embed: string;
  other_images: JSON;
  opening_hours: string;
};


export default function Recommendation() {
  const location = useLocation();
  const [topShops, setTopShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState<string | null>(null);
  const { fs, fsm } = useUniversalFluid();
  const isMobile = useDevice();

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  useEffect(() => {
    const fetchTopShops = async () => {
      try {
        setShopsLoading(true);
        setShopsError(null);
        console.log('Fetching recommendations...');
        const { data: recommendations, error: recError } = await supabaseShops
          .from('recommendations')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: true });

        if (recError) {
          throw new Error(`Failed to fetch recommendations: ${recError.message}`);
        }
        console.log('Recommendations:', recommendations);
        if (!recommendations || recommendations.length === 0) {
          setShopsError('No active recommendations found.');
          setTopShops([]);
          return;
        }

        const shopIds = recommendations.map(rec => rec.shop_id);
        console.log('Shop IDs:', shopIds);

        const { data: shops, error: shopsError } = await supabaseShops
          .from('shops')
          .select('*')
          .in('id', shopIds);

        if (shopsError) {
          throw new Error(`Failed to fetch shops: ${shopsError.message}`);
        }
        console.log('Shops:', shops);
        const sortedShops = recommendations
          .map(rec => shops.find(shop => shop.id === rec.shop_id))
          .filter(shop => shop !== undefined)
          .map(shop => ({
            ...shop,
            other_images: Array.isArray(shop.other_images) ? shop.other_images : [],
          })) as Shop[];

        if (sortedShops.length === 0) {
          setShopsError('No matching shops found for recommendations.');
        }
        setTopShops(sortedShops);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error fetching top shops';
        setShopsError(errMsg);
        console.error('Error details:', error);
      } finally {
        setShopsLoading(false);
      }
    };

    fetchTopShops();
  }, []);

  if (shopsError) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        Error: {shopsError}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="Recommend"
        subtitle="推奨"
        imageSrc="/src/food.png"
        imageAlt="Food and Drink Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="90s"
        marginBottomClass="mb-120"
        marginTopClass="mt-98"
      />
      {shopsLoading ? (
        <div className="container mx-auto p-4">Loading shops...</div>
      ) : (
        <ResponsiveGrid
          columns={isMobile ? '1fr 1fr' : '1fr 1fr 1fr'}
          isMobile={isMobile}
          className="flex justify-center"
          style={{
            gap: isMobile ? fsm(19) : fs(32),
            marginTop: isMobile ? fsm(0) : fsm(120),
            marginLeft: isMobile ? fsm(20) : fs(161),
            marginRight: isMobile ? fsm(20) : fs(161),
          }}
        >
          {topShops.map((shop, index) => (
            <GridItem
              key={shop.id}
              column={isMobile ? (index % 2) + 1 : (index % 3) + 1}
              row={isMobile ? Math.floor(index / 2) + 1 : Math.floor(index / 3) + 1}
              columnSpan={1}
              rowSpan={1}
              style={{ minHeight: isMobile ? 'auto' : 'auto', height: 'auto', marginTop: isMobile ? fsm(0) : fs(8) }}
              className="w-full"
            >
              <ProductCard
                  id={shop.id}
                  title={shop.name}
                  imageUrl={shop.image_url || '/src/shop.png'}
                  description={shop.description || 'No description available'}
                  likes={shop.love_count || 0}
                  views={shop.review_count || 0}
                  type={'shop'}
                  category_id={shop.category_id}
                  linkTo={`/shops/${shop.id}`}
                />
            </GridItem>
          ))}
        </ResponsiveGrid>
      )}
      <Footer marginTop={64} />
    </div>
  );
}