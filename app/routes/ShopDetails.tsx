import { useLoaderData, useLocation, useParams } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useState, useEffect } from 'react';
import ShopItem from '~/components/ShopItem';
import MarqueeHeader from '~/components/MarqueeHeader';
import Footer from '~/components/Footer';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useDevice } from '~/routes/contexts/DeviceContext';
import supabase from '~/supabase';

interface Shop {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  category: string;
  views: number;
  near_station?: string;
  address?: string;
  map_embed?: string;
  other_images?: string[];
  opening_hours?: string;
}

export async function loader({ params }: { params: { id: string } }) {
  let { id } = params;
  id = '1ea7ae99-de53-4c3d-ac87-d2a47203cc64'; // Hardcode a valid ID from your data for testing

  try {
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('id, name, image_url, description, contact_phone, love_count, review_count, category, address, near_station, map_embed, other_images, opening_hours')
      .eq('id', id)
      .single();

    if (shopError) {
      console.log('Loader: Supabase shop error:', shopError); // Debug log
      throw new Error(`Failed to fetch shop: ${shopError.message}`);
    }

    if (!shopData) {
      console.log('Loader: Shop not found for id:', id); // Debug log
      throw new Error('Shop not found');
    }

    return {
      menu: {
        id: shopData.id,
        name: shopData.name,
        description: shopData.description,
        hours: shopData.opening_hours || 'OPEN 10:00 ~ 22:00',
        phone: shopData.contact_phone || 'TEL: 03-5944-5737',
        image: shopData.image_url || '/src/burger.png',
        link: 'https://example.com',
        category: shopData.category,
        lastText: shopData.near_station || 'JR巣鴨駅より徒歩5分',
        address: shopData.address || 'Unknown address',
        map_embed: shopData.map_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.1234567890123!2d139.728123!3d35.735678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c1234567890%3A0xabcdef1234567890!2sSugamo%2C%20Toshima%20City%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2us!4v1692500000',
        other_images: shopData.other_images || ['/src/burger.png', '/src/burger.png', '/src/burger.png', '/src/burger.png', '/src/burger.png', '/src/burger.png'],
      },
      products: [
        {
          title: 'ナンジェリー・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1000,
          views: 1000,
        },
        {
          title: 'ボストール・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1500,
          views: 1200,
        },
        {
          title: 'ナンジェリー・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1000,
          views: 1000,
        },
        {
          title: 'ボストール・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1500,
          views: 1200,
        },
        {
          title: 'ナンジェリー・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1000,
          views: 1000,
        },
        {
          title: 'ボストール・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1500,
          views: 1200,
        },
        {
          title: 'ナンジェリー・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1000,
          views: 1000,
        },
        {
          title: 'ボストール・ボストール',
          imageUrl: '/src/burger.png',
          description: '巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！',
          likes: 1500,
          views: 1200,
        },
      ],
    };
  } catch (error) {
    console.log('Loader: Error:', error); // Debug log
    return {
      menu: null,
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default function ShopDetails() {
  const { menu, products, error: loaderError } = useLoaderData();
  const { id, category } = useParams();
  const location = useLocation();
  const shopFromState = location.state?.shop as Shop | undefined;
  const [shop, setShop] = useState<Shop | null>(shopFromState || (menu ? {
    id: menu.id,
    title: menu.name,
    imageUrl: menu.image,
    description: menu.description,
    likes: menu.love_count || 1000, // Use Supabase data if available
    views: menu.review_count || 1000, // Use Supabase data if available
    near_station: menu.lastText,
    address: menu.address,
    category: menu.category,
    map_embed: menu.map_embed,
    other_images: menu.other_images,
    opening_hours: menu.hours,
  } : null));
  const [loading, setLoading] = useState(!shopFromState && !menu);
  const [error, setError] = useState<string | null>(loaderError);
  const [currentIndex, setCurrentIndex] = useState(1);
  const { fs, fsm, fluidStyle } = useUniversalFluid();
  const isMobile = useDevice();
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));
  const visibleCards = 1;



  useEffect(() => {
    let effectiveId = id;  // Use params id, but override for testing
    if (!shopFromState && !menu && effectiveId) {
      const fetchShop = async () => {
        try {
          setLoading(true);
          console.log('useEffect: Fetching shop with id:', effectiveId); // Debug log
          const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .select('id, name, image_url, description, contact_phone, love_count, review_count, category, address, near_station, map_embed, other_images, opening_hours')
            .eq('id', effectiveId)
            .single();

          if (shopError) {
            console.log('useEffect: Supabase shop error:', shopError); // Debug log
            throw new Error(`Failed to fetch shop: ${shopError.message}`);
          }

          if (!shopData) {
            console.log('useEffect: Shop not found for id:', effectiveId); // Debug log
            throw new Error('Shop not found');
          }

          console.log('useEffect: Fetched shop data:', shopData); // Debug log
          setShop({
            id: shopData.id,
            title: shopData.name,
            imageUrl: shopData.image_url,
            description: shopData.description,
            likes: shopData.love_count,
            views: shopData.review_count,
            near_station: shopData.near_station,
            address: shopData.address,
            map_embed: shopData.map_embed,
            other_images: shopData.other_images,
            category: shopData.category,
            opening_hours: shopData.opening_hours,
          });
        } catch (err) {
          console.log('useEffect: Error:', err); // Debug log
          setError(err instanceof Error ? err.message : 'Unknown error');
          setShop(null);
        } finally {
          setLoading(false);
        }
      };

      fetchShop();
    }
  }, [id, shopFromState, menu]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, products.length - 4) // max = last 4 items visible
    );
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || !shop) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error || 'Shop not found'}</div>;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves!Welcome to Sugamo! Pick your faves!Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!Welcome to Sugamo! Pick your faves!Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="40s"
        marginBottom={120}
        marginTop={100}
      />
      <div
        className="flex flex-col md:flex-row items-center justify-center overflow-hidden"
        style={{ paddingLeft: isMobile ? fsm(40) : fs(90), paddingRight: isMobile ? fsm(40) : fs(90) }}
      >
        <div className="md:w-3/6 w-full mb-4 md:mb-0">
          {isMobile && (<div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <div className="flex space-x-2 ml-auto">

                <button
                  className="bg-[#ED4548] text-white rounded-full italic font-cousine font-bold text-center"
                  style={{
                    width: isMobile ? fsm(92) : fs(92),
                    minWidth: isMobile ? fsm(72) : fs(72),
                    height: isMobile ? fsm(22) : fs(22),
                    minHeight: isMobile ? fsm(17) : fs(17),
                    fontSize: isMobile ? fsm(12) : fs(12),
                  }}
                >
                  {"SHOP"}
                </button>

                <span className="flex items-center gap-1">
                  <img
                    src="/src/red-love.svg"
                    alt="Love"
                    style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
                  />
                  <p
                    className="font-bold font-cairo"
                    style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
                  >
                    {shop.likes}
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
                    {shop.views}
                  </p>
                </span>
              </div>
            </div>
            <button className="py-1 transition-transform duration-300 hover:scale-125">
              <img
                src="/src/bookmark.svg"
                alt="Bookmark Icon"
                style={{ height: autoSize(20), width: autoSize(20) }}
              />
            </button>
          </div>)}
          <img
            src={shop.imageUrl}
            alt={shop.title}
            className="w-full h-auto"
            style={{ width: isMobile ? "100%" : fs(540), height: isMobile ? fsm(401) : fs(540) }}
          />
          {isMobile && (<div
            style={{
              marginTop: isMobile ? fsm(16) : fs(90),
            }}
          >
            <div className="flex space-x-4 overflow-x-auto">
              {(shop.other_images || []).map((image, index) => (
                <div
                  key={index}
                  style={{ minWidth: isMobile ? fsm(117) : fs(358), height: isMobile ? fsm(88) : fs(270) }}
                >
                  <img src={image} alt={`Related Item ${index + 1}`} className="w-full h-auto" style={{ maxHeight: isMobile ? fsm(88) : fs(270) }} />
                </div>
              ))}
            </div>
          </div>)}
        </div>
        <div className="md:w-auto w-full " style={{ paddingLeft: isMobile ? fsm(0) : fs(90), height: isMobile ? fsm(401) : fs(540), paddingTop: fs(63) }}>
          {!isMobile && (<div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <div className="flex space-x-2 ml-auto">

                <button
                  className="bg-[#ED4548] text-white rounded-full italic font-bold font-cairo text-center"
                  style={{
                    width: isMobile ? fsm(92) : fs(92),
                    minWidth: isMobile ? fsm(72) : fs(72),
                    height: isMobile ? fsm(22) : fs(22),
                    minHeight: isMobile ? fsm(17) : fs(17),
                    fontSize: isMobile ? fsm(13) : fs(13),
                  }}
                >
                  {"shop"}
                </button>

                <span className="flex items-center gap-1">
                  <img
                    src="/src/red-love.svg"
                    alt="Love"
                    style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
                  />
                  <p
                    className="font-bold font-cairo"
                    style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
                  >
                    {shop.likes}
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
                    {shop.views}
                  </p>
                </span>
              </div>
            </div>
            <button className="py-1 transition-transform duration-300 hover:scale-125">
              <img
                src="/src/bookmark.svg"
                alt="Bookmark Icon"
                style={{ height: autoSize(20), width: autoSize(20) }}
              />
            </button>
          </div>)}
          <div className=" h-full flex flex-col justify-between">
            <div>
              <h2
                className="font-semibold font-cairo text-brown-700"
                style={{ marginTop: isMobile ? fsm(8) : fs(35), fontSize: autoSize(22) }}
              >
                {shop.title}
              </h2>
              <p
                className=" font-normal font-cairo leading-loose"
                style={{ marginTop: isMobile ? fsm(16) : fs(19), fontSize: autoSize(16) }}
              >
                {shop.description}
              </p>
            </div>
            <div
              className="flex items-center justify-between"
              style={{ paddingBottom: isMobile ? fsm(0) : fs(61) }}
            >
              <div>
                <p className="text-[#313131] font-cairo font-medium" style={{ fontSize: autoSize(13) }}>
                  OPEN {shop.opening_hours}
                </p>
                <p className="text-[#313131] mt-2 font-cairo font-medium" style={{ fontSize: autoSize(13) }}>
                  Address {shop.address}
                </p>
                <p className="text-[#313131] mt-2 font-cairo font-medium" style={{ fontSize: autoSize(13) }}>
                  {shop.near_station}
                </p>
              </div>
              <a href={menu.link} target="_blank" rel="noopener noreferrer">
                <img
                  className="text-yellow-500 text-lg"
                  src="/src/link_url.png"
                  alt="Link Icon"
                />
              </a>
            </div>
          </div>

        </div>
      </div>
      {!isMobile && (<div
        style={{
          paddingLeft: fs(90),
          paddingRight: fs(90),
          marginTop: fs(90),
        }}
      >
        <div className="flex space-x-4 overflow-x-auto">
          {(shop.other_images || []).map((image, index) => (
            <div
              key={index}
              style={{ minWidth: isMobile ? fsm(117) : fs(358) }}
            >
              <img src={image} alt={`Related Item ${index + 1}`} className="w-full h-auto" style={{ maxHeight: isMobile ? fsm(88) : fs(270) }} />
            </div>
          ))}
        </div>
      </div>)}
      <div className='text-[#ED4548] italic underline w-full text-center font-cousine' style={{ fontSize: autoSize(25), marginTop: isMobile ? fsm(138) : fs(90), marginBottom: isMobile ? fsm(24) : fs(0) }}>Google Map</div>
      <div className="mx-auto border-2 border-black rounded-lg overflow-hidden" style={{ height: isMobile ? fsm(332) : fs(591), marginLeft: isMobile ? fsm(20) : fs(160), marginRight: isMobile ? fsm(20) : fs(160) }}>
        <iframe
          src={shop.map_embed}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div
        className="relative "
        style={{
          paddingTop: isMobile ? fsm(40) : fs(90),
          paddingLeft: isMobile ? fsm(40) : fs(90),
          paddingRight: isMobile ? fsm(40) : fs(90),
          marginBottom: isMobile ? fsm(144) : fs(130),
        }}
      >
        <div className="border border-black rounded-[10px] overflow-visible relative" style={{ paddingTop: fs(76)}}>
          {/* SEE MORE label */}
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-bold italic font-cousine inline-block text-wrap" style={{ paddingLeft: isMobile ? fsm(20) : fs(45), paddingRight: isMobile ? fsm(20) : fs(45), fontSize: autoSize(31) }}>
            SEE MORE
          </div>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out px-[25%]"
              style={{
                transform: `translateX(-${currentIndex * 25}%)`,
                width: `${products.length * 25}%`,
              }}
            >
              {products.map((product, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 p-2"
                  style={{
                    width: isMobile ? fsm(210) : fs(350),
                    height: isMobile ? fsm(301) : fs(496),
                  }}
                >
                  <ShopItem
                    title={product.title}
                    imageUrl={"./src/shop.png"}
                    description={product.description}
                    likes={product.likes}
                    views={product.views}
                  />
                </div>
              ))}
            </div>
          </div>


          {/* Navigation buttons */}
          <div className="flex justify-between px-4" style={{ height: autoSize(76) }}>
            <button
              onClick={handlePrev}
              className="text-2xl disabled:opacity-30"
              disabled={currentIndex === 0}
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="text-2xl disabled:opacity-30"
              disabled={currentIndex >= products.length - 4} // keep 4 slots visible
            >
              →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="container mx-auto p-4 text-red-600">
      An unexpected error occurred. Please try again later.
    </div>
  );
}