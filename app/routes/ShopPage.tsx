import supabaseShops from "~/supabase";
import { Link, useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import ProductCard from '~/components/ShopItem';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import { ResponsiveGrid, GridItem } from "../components/ResponsiveGrid";
import { useIsMobile } from "~/hooks/useIsMobile";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
type Shop = {
  id: string;
  name: string;
  category_id: string;
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

export default function Shoppage() {
  const location = useLocation();
  const { fs, fsm } = useUniversalFluid();
  const {isMobile} = useIsMobile();
  const [shops, setShops] = useState<Shop[]>([]); // State for shops data
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    async function fetchShops() {
      setLoading(true);
      try {
        const { data, error } = await supabaseShops
          .from('shops')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching shops:', error.message);
          throw error;
        }

        setShops(data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  // Handle window resize
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="FOOD&DRINK"
        subtitle="食べる"
        imageSrc="/src/food.png"
        imageAlt="Food and Drink Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#0000000"
        animationDuration="90s"
        marginBottom={120}
        marginTop={98}
      />

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      ) : (
        <ResponsiveGrid
          columns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
          rows="auto"
          className="flex justify-center"
          style={{
            gap: isMobile ? fsm(19) : fs(32),
            marginTop: isMobile ? fsm(0) : fsm(120),
            marginLeft: isMobile ? fsm(20) : fs(161),
            marginRight: isMobile ? fsm(20) : fs(161)
          }}
        >
          {shops.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No shops found.</p>
            </div>
          ) : (
            shops.map((shop, index) => (
              <GridItem
                key={shop.id}
                column={isMobile ? (index % 2) + 1 : (index % 3) + 1}
                row={isMobile ? Math.floor(index / 2) + 1 : Math.floor(index / 3) + 1}
                columnSpan={1}
                rowSpan={1}
                style={{ minHeight: isMobile ? "auto" : "auto", height: "auto", marginTop: isMobile ? fsm(0) : fs(8) }}
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
                  category={shop.category || 'shop'}
                  category_id={shop.category_id}
                  opening_hours={shop.opening_hours || 'Not specified'}
                  near_station={shop.near_station || 'Not specified'}
                  address={shop.address || 'Not specified'}
                  map_embed={shop.map_embed || ''}
                  other_images={shop.other_images ? [JSON.stringify(shop.other_images)] : []}
                />

              </GridItem>
            ))
          )}
        </ResponsiveGrid>
      )}
      <Footer marginTop={64} />
    </div>
  );
}