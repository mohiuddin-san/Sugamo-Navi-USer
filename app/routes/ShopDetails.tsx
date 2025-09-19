import { useLoaderData, useLocation } from '@remix-run/react';
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
  views: number;
  category?: string;
  near_station?: string;
  address?: string;
  map_embed?: string;
  other_images?: string[];
  opening_hours?: string;
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type') || 'shops';
  console.log('Loader: Fetching with type:', type, 'id:', id);

  if (!id) {
    console.log('Loader: Missing id');
    return { type, menu: null, products: [], error: 'Missing id' };
  }

  if (!['shops', 'places'].includes(type)) {
    console.log('Loader: Invalid type:', type);
    return { type, menu: null, products: [], error: `Invalid type: ${type}` };
  }

  const table = type === 'places' ? 'tourist_places' : 'shops';
  const selectFields = 'id, name, image_url, description, love_count, review_count, category, address, near_station, map_embed, other_images, opening_hours';

  try {
    // Fetch the current shop
    console.log(`Loader: Fetching from ${table} with id: ${id}`);
    const { data: itemData, error: itemError } = await supabase
      .from(table)
      .select(selectFields)
      .eq('id', id)
      .single();

    if (itemError || !itemData) {
      console.log(`Loader: Supabase ${table} error or no data:`, itemError);
      return { type, menu: null, products: [], error: itemError?.message || `${type} not found` };
    }

    console.log(`Loader: Fetched ${table} data:`, itemData);

    // Fetch all related items of the same type (excluding current id)
    const { data: relatedData, error: relatedError } = await supabase
      .from(table)
      .select(selectFields)
      .neq('id', id)
      .order('name', { ascending: true })
      .limit(8);

    if (relatedError) {
      console.log(`Loader: Supabase related ${table} error:`, relatedError);
      return {
        type,
        menu: {
          id: itemData.id,
          name: itemData.name,
          image: itemData.image_url || (type === 'places' ? '/src/see-do.png' : '/src/shop.png'),
          description: itemData.description || 'No description available',
          hours: itemData.opening_hours || 'OPEN 10:00 ~ 22:00',
          category: itemData.category || 'Unknown',
          lastText: itemData.near_station || 'Unknown station',
          address: itemData.address || 'Unknown address',
          map_embed: itemData.map_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.1234567890123!2d139.728123!3d35.735678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c1234567890%3A0xabcdef1234567890!2sSugamo%2C%20Toshima%20City%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2us!4v1692500000',
          other_images: itemData.other_images || [(type === 'places' ? '/src/see-do.png' : '/src/shop.png')],
          likes: itemData.love_count || 0,
          views: itemData.review_count || 0,
        },
        products: [],
        error: `Failed to fetch related ${type}s: ${relatedError.message}`,
      };
    }

    console.log(`Loader: Fetched related ${table} data:`, relatedData);

    return {
      menu: {
        id: itemData.id,
        name: itemData.name,
        image: itemData.image_url || (type === 'places' ? '/src/see-do.png' : '/src/shop.png'),
        description: itemData.description || 'No description available',
        hours: itemData.opening_hours || 'OPEN 10:00 ~ 22:00',
        category: itemData.category || 'Unknown',
        lastText: itemData.near_station || 'Unknown station',
        address: itemData.address || 'Unknown address',
        map_embed: itemData.map_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.1234567890123!2d139.728123!3d35.735678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c1234567890%3A0xabcdef1234567890!2sSugamo%2C%20Toshima%20City%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2us!4v1692500000',
        other_images: itemData.other_images || [(type === 'places' ? '/src/see-do.png' : '/src/shop.png')],
        likes: itemData.love_count || 0,
        views: itemData.review_count || 0,
      },
      products: relatedData.map((item) => ({
        id: item.id,
        title: item.name,
        imageUrl: item.image_url || (type === 'places' ? '/src/see-do.png' : '/src/shop.png'),
        description: item.description || 'No description available',
        likes: item.love_count || 0,
        views: item.review_count || 0,
        near_station: item.near_station,
        address: item.address,
        map_embed: item.map_embed,
        other_images: item.other_images,
        opening_hours: item.opening_hours,
        category: item.category,
      })),
      type,
      error: null,
    };
  } catch (error) {
    console.log('Loader: Error:', error);
    return { type, menu: null, products: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export default function ShopDetails() {
  const { menu, products, type, error: loaderError } = useLoaderData();
  const location = useLocation();
  console.log('ShopDetails: Loader data:', { menu, products, type, loaderError });
  console.log('ShopDetails: Navigation state:', location.state);
  const shopFromState = location.state?.item as Shop | undefined;
  const typeFromState = location.state?.type as 'shops' | 'places' | undefined;
  const effectiveType = type || typeFromState || 'shops';

  const [shop, setShop] = useState<Shop | null>(
    shopFromState
      ? {
          id: shopFromState.id,
          title: shopFromState.title,
          imageUrl: shopFromState.imageUrl || (effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png'),
          description: shopFromState.description || 'No description available',
          likes: shopFromState.likes || 0,
          views: shopFromState.views || 0,
          near_station: shopFromState.near_station || 'Unknown station',
          address: shopFromState.address || 'Unknown address',
          map_embed: shopFromState.map_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.1234567890123!2d139.728123!3d35.735678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c1234567890%3A0xabcdef1234567890!2sSugamo%2C%20Toshima%20City%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2us!4v1692500000',
          other_images: shopFromState.other_images || [(effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png')],
          category: shopFromState.category || 'Unknown',
          opening_hours: shopFromState.opening_hours || 'OPEN 10:00 ~ 22:00',
        }
      : menu
      ? {
          id: menu.id,
          title: menu.name,
          imageUrl: menu.image,
          description: menu.description,
          likes: menu.likes || 0,
          views: menu.views || 0,
          near_station: menu.lastText,
          address: menu.address,
          category: menu.category,
          map_embed: menu.map_embed,
          other_images: menu.other_images,
          opening_hours: menu.hours,
        }
      : null
  );
  const [loading, setLoading] = useState(!shopFromState && !menu);
  const [error, setError] = useState<string | null>(loaderError);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { fs, fsm } = useUniversalFluid();
  const isMobile = useDevice();
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));
  const visibleCards = 4;

  useEffect(() => {
    if (!shop && location.state?.item?.id && location.state?.type) {
      const fetchShop = async () => {
        try {
          setLoading(true);
          const table = effectiveType === 'places' ? 'tourist_places' : 'shops';
          const selectFields = 'id, name, image_url, description, love_count, review_count, category, address, near_station, map_embed, other_images, opening_hours';

          console.log(`useEffect: Fetching from ${table} with id: ${location.state.item.id}`);
          const { data: shopData, error: shopError } = await supabase
            .from(table)
            .select(selectFields)
            .eq('id', location.state.item.id)
            .single();

          if (shopError || !shopData) {
            console.log(`useEffect: Supabase ${table} error or no data:`, shopError);
            throw new Error(shopError?.message || `${effectiveType} not found`);
          }

          console.log(`useEffect: Fetched ${table} data:`, shopData);
          setShop({
            id: shopData.id,
            title: shopData.name,
            imageUrl: shopData.image_url || (effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png'),
            description: shopData.description || 'No description available',
            likes: shopData.love_count || 0,
            views: shopData.review_count || 0,
            near_station: shopData.near_station || 'Unknown station',
            address: shopData.address || 'Unknown address',
            map_embed: shopData.map_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.1234567890123!2d139.728123!3d35.735678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c1234567890%3A0xabcdef1234567890!2sSugamo%2C%20Toshima%20City%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2us!4v1692500000',
            other_images: shopData.other_images || [(effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png')],
            category: shopData.category || 'Unknown',
            opening_hours: shopData.opening_hours || 'OPEN 10:00 ~ 22:00',
          });
        } catch (err) {
          console.log('useEffect: Error:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
          setShop(location.state.item); // Fallback to navigation state
        } finally {
          setLoading(false);
        }
      };

      fetchShop();
    } else {
      console.log('ShopDetails: No fetch needed, shop state:', shop);
    }
  }, [shop, location.state, effectiveType]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || !shop) {
    console.log('ShopDetails: Rendering error, error:', error, 'shop:', shop);
    return <div className="container mx-auto p-4 text-red-600">Error: {error || `${effectiveType} not found`}</div>;
  }

  console.log('ShopDetails: Rendering shop:', shop);
  console.log('ShopDetails: Rendering products:', products);

  return (
    <div className="min-h-screen">
      <Header />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="40s"
        marginBottom={120}
        marginTop={100}
      />
      <div
        className="flex flex-col md:flex-row items-center justify-center"
        style={{ paddingLeft: isMobile ? fsm(40) : fs(90), paddingRight: isMobile ? fsm(40) : fs(90) }}
      >
        <div className="md:auto w-full">
          {isMobile && (
            <div className="flex flex-row justify-between items-center" style={{ marginBottom: fsm(20) }}>
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
                    {effectiveType === 'places' ? 'Place' : 'Shop'}
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
            </div>
          )}
          <img
            src={shop.imageUrl}
            alt={shop.title}
            className="w-full h-auto"
            style={{ width: isMobile ? '100%' : fs(540), height: isMobile ? fsm(401) : fs(540) }}
            onError={(e) => {
              e.currentTarget.src = effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png';
            }}
          />
          {isMobile && shop.other_images && shop.other_images.length > 0 && (
            <div style={{ marginTop: isMobile ? fsm(16) : fs(90) }}>
              <div className="flex space-x-2 overflow-x-auto">
                {shop.other_images.map((image, index) => (
                  <div
                    key={index}
                    style={{ minWidth: isMobile ? fsm(117) : fs(358), height: isMobile ? fsm(88) : fs(270) }}
                  >
                    <img
                      src={image}
                      alt={`Related Item ${index + 1}`}
                      className="w-full h-auto"
                      style={{ maxHeight: isMobile ? fsm(88) : fs(270) }}
                      onError={(e) => {
                        e.currentTarget.src = effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          className="md:auto w-full max-h-max"
          style={{ paddingLeft: isMobile ? fsm(0) : fs(20), height: isMobile ? 'auto' : fs(540), paddingTop: fs(63) }}
        >
          {!isMobile && (
            <div className="flex flex-row justify-between items-center">
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
                    {effectiveType === 'places' ? 'Place' : 'Shop'}
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
            </div>
          )}
          <div className="flex-col justify-between">
            <div>
              <h2
                className="font-semibold font-cairo text-brown-700"
                style={{ marginTop: isMobile ? fsm(34) : fs(35), fontSize: autoSize(22) }}
              >
                {shop.title}
              </h2>
              <p
                className="text-[#313131] font-normal font-cairo leading-loose"
                style={{ marginTop: isMobile ? fsm(16) : fs(19), fontSize: autoSize(16), height: isMobile ? 'auto' : fs(210) }}
              >
                {shop.description}
              </p>
            </div>
            <div
              className="flex items-center justify-between"
              style={{ marginTop: isMobile ? fsm(54) : fs(30), paddingBottom: isMobile ? fsm(0) : fs(61) }}
            >
              <div>
                <p className="text-[#313131] font-cairo font-medium" style={{ fontSize: autoSize(13) }}>
                  OPEN {shop.opening_hours || 'Not available'}
                </p>
                <p className="text-[#313131] mt-2 font-cairo font-medium" style={{ fontSize: autoSize(13) }}>
                  Address: {shop.address || 'Not available'}
                </p>
                <p className="text-[#313131] mt-2 font-cairo font-medium" style={{ fontSize: autoSize(13) }}>
                  Near: {shop.near_station || 'Not available'}
                </p>
              </div>
              <a href={shop.map_embed || '#'} target="_blank" rel="noopener noreferrer">
                <img className="text-yellow-500 text-lg" src="/src/link_url.png" alt="Link Icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {!isMobile && shop.other_images && shop.other_images.length > 0 && (
        <div style={{ paddingLeft: fs(90), paddingRight: fs(90), marginTop: fs(90) }}>
          <div className="flex space-x-4 overflow-x-auto">
            {shop.other_images.map((image, index) => (
              <div
                key={index}
                style={{ minWidth: isMobile ? fsm(117) : fs(358) }}
              >
                <img
                  src={image}
                  alt={`Related Item ${index + 1}`}
                  className="w-full h-auto"
                  style={{ maxHeight: isMobile ? fsm(88) : fs(270) }}
                  onError={(e) => {
                    e.currentTarget.src = effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {shop.map_embed && (
        <div>
          <div
            className="text-[#ED4548] italic underline w-full text-center font-cousine"
            style={{ fontSize: autoSize(25), marginTop: isMobile ? fsm(138) : fs(90), marginBottom: isMobile ? fsm(24) : fs(0) }}
          >
            Google Map
          </div>
          <div
            className="mx-auto border-2 border-black rounded-lg overflow-hidden"
            style={{ height: isMobile ? fsm(332) : fs(591), marginLeft: isMobile ? fsm(20) : fs(160), marginRight: isMobile ? fsm(20) : fs(160) }}
          >
            <iframe
              src={shop.map_embed}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      )}
      {products.length > 0 ? (
        <div
          className="relative"
          style={{
            paddingTop: isMobile ? fsm(141) : fs(180),
            paddingLeft: isMobile ? fsm(20) : fs(90),
            paddingRight: isMobile ? fsm(20) : fs(90),
            marginBottom: isMobile ? fsm(144) : fs(130),
          }}
        >
          <div className="border-2 border-black rounded-[30px] overflow-visible relative" style={{ paddingTop: isMobile ? fsm(70) : fs(76) }}>
            <div
              className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-bold italic font-cousine inline-block text-wrap"
              style={{ paddingLeft: isMobile ? fsm(20) : fs(45), paddingRight: isMobile ? fsm(20) : fs(45), fontSize: autoSize(31) }}
            >
              SEE MORE
            </div>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out px-[25%]"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  width: `${products.length * (100 / visibleCards)}%`,
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
                      id={product.id}
                      title={product.title}
                      imageUrl={product.imageUrl}
                      description={product.description}
                      likes={product.likes}
                      views={product.views}
                      type={effectiveType === 'places' ? 'place' : 'shop'}
                      near_station={product.near_station}
                      address={product.address}
                      map_embed={product.map_embed}
                      other_images={product.other_images}
                      opening_hours={product.opening_hours}
                      category={product.category}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between px-4" style={{ height: isMobile ? fsm(106) : fs(76) }}>
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                className="text-4xl disabled:opacity-30"
                disabled={currentIndex === 0}
              >
                ←
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, products.length - visibleCards))}
                className="text-4xl disabled:opacity-30"
                disabled={currentIndex >= products.length - visibleCards}
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="text-center text-[#ED4548] font-cairo"
          style={{
            paddingTop: isMobile ? fsm(141) : fs(180),
            paddingLeft: isMobile ? fsm(20) : fs(90),
            paddingRight: isMobile ? fsm(20) : fs(90),
            marginBottom: isMobile ? fsm(144) : fs(130),
            fontSize: autoSize(16),
          }}
        >
          No related shops available.
        </div>
      )}
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