import { useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import Footer from '../components/Footer';
import React, { useEffect, useState } from 'react';
import ProductCard from '~/components/ShopItem';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';

import { ResponsiveGrid, GridItem } from "../components/ResponsiveGrid";
import { useIsMobile } from "~/hooks/useIsMobile";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import supabase from '~/supabase';
type place= {
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
  const [places, setPlaces] =  useState<place[]>([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch tourist_places data from Supabase
  useEffect(() => {
    async function fetchPlaces() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tourist_places')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching tourist places:', error.message);
          throw error;
        }

        setPlaces(data);
      } catch (error) {
        console.error('Error fetching tourist places:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  // Handle window resize
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="SEE&DO"//SEE&DO
        subtitle="観る・遊ぶ"
        imageSrc="/src/see-do.jpg"
        imageAlt="See and Do Image"
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
            marginRight: isMobile ? fsm(20) : fs(161),
          }}
        >
          {places.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No tourist places found.</p>
            </div>
          ) : (
            places.map((place, index) => (
              <GridItem
                key={place.id}
                column={isMobile ? (index % 2) + 1 : (index % 3) + 1}
                row={isMobile ? Math.floor(index / 2) + 1 : Math.floor(index / 3) + 1}
                columnSpan={1}
                rowSpan={1}
                style={{ minHeight: isMobile ? "auto" : "auto", height: "auto", marginTop: isMobile ? fsm(0) : fs(8) }}
                className="w-full"
              >
            
                <ProductCard
                  id={place.id}
                  title={place.name}
                  imageUrl={place.image_url || "/src/shop.png"}
                  description={place.description || 'No description available'}
                  likes={place.love_count || 0}
                  views={place.review_count || 0}
                  type={'place'}
                  category={place.category || 'tourist_place'}
                  category_id={place.category_id}
                  opening_hours={place.opening_hours || 'Not specified'}
                  near_station={place.near_station || 'Not specified'}
                  address={place.address || 'Not specified'}
                  map_embed={place.map_embed || ''}
                  other_images={place.other_images ? [JSON.stringify(place.other_images)] : []}
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