import supabaseShops from "~/supabase";
import { Link, useLocation, useSearchParams } from '@remix-run/react';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page') || '1');
  const pageSize = 9;
  const { fs, fsm } = useUniversalFluid();
  const { isMobile } = useIsMobile();

  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchShops() {
      setLoading(true);
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      try {
        const { data, error, count } = await supabaseShops
          .from('shops')
          .select('*', { count: 'exact' })
          .order('name', { ascending: true })
          .range(from, to);

        if (error) throw error;
        setShops(data || []);
        setTotalCount(count || 0);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, [currentPage]);

  // Pagination Component
  const Pagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const setPage = (page: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', page.toString());
      setSearchParams(newParams);
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-6 mt-12 mb-8 flex-wrap text-lg font-medium">
        {/* Prev Button */}
        <button
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`text-black hover:text-[#ED4548] transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Prev
        </button>
        <div className="flex gap-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className="relative group transition-all"
            >
              <span
                className={`block pb-1 transition-colors ${page === currentPage ? 'text-[#ED4548]' : 'text-black hover:text-[#ED4548]'
                  }`}
              >
                {page}
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#ED4548] transition-transform origin-left ${page === currentPage ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
              />
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`text-black hover:text-[#ED4548] transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Next
        </button>
      </div>
    );
  };

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
        <>
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
              <div className="text-center py-16 col-span-full">
                <p className="text-gray-400 text-lg">No shops found.</p>
              </div>
            ) : (
              shops.map((shop, index) => (
                <GridItem
                  key={shop.id}
                  column={isMobile ? (index % 2) + 1 : (index % 3) + 1}
                  row={isMobile ? Math.floor(index / 2) + 1 : Math.floor(index / 3) + 1}
                  className="w-full"
                >
                  <ProductCard
                    id={shop.id}
                    title={shop.name}
                    imageUrl={shop.image_url || '/src/shop.png'}
                    description={shop.description || 'No description'}
                    likes={shop.love_count || 0}
                    views={shop.review_count || 0}
                    type="shop"
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

          <Pagination />
        </>
      )}

      <Footer marginTop={64} />
    </div>
  );
}