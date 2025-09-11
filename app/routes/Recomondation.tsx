import { useLocation } from 'react-router-dom';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import ProductCard from '~/components/ProductCard';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import supabaseShops from "~/supabase";  

type Shop = {
  id: string;
  name: string;
  category: string;
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
export default function ShopDetails() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();
  const [topShops, setTopShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState<string | null>(null);
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
          throw new Error(`Failed to fetch recommendations: ${recError.message} (Code: ${recError.code || 'unknown'})`);
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
          throw new Error(`Failed to fetch shops: ${shopsError.message} (Code: ${shopsError.code || 'unknown'})`);
        }

        console.log('Shops:', shops);
        const sortedShops = recommendations
          .map(rec => shops.find(shop => shop.id === rec.shop_id))
          .filter(shop => shop !== undefined) as Shop[];

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
        textColor="#0000000"
        animationDuration="40s"
        marginBottom={120}
        marginTop={98}
      />
  
      <div className="p-4 flex justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
           {topShops.map((shop, index) => (
          <ProductCard
                  key={shop.id}
                  title={shop.name || "ブーランジェリーボヌール"}
                  imageUrl={shop.image_url || "./src/shop.png"}
                  description={shop.description || "巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！"}
                  likes={shop.love_count || 0}
                  views={shop.review_count || 0}
                  shopId={shop.id || ''}
                  opening_hours={shop.opening_hours || ''}
                  near_station={shop.near_station || ''}
                  address={shop.address || ''}
                  category={shop.category || ''}
                  map_embed={shop.map_embed || ''}
                  other_images={shop.other_images || null}
                />
                ))}
        
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}