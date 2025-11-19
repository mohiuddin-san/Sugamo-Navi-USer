import { useLoaderData, useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useState, useEffect, useRef } from 'react';
import ShopItem from '~/components/ShopItem';
import MarqueeHeader from '~/components/MarqueeHeader';
import Footer from '~/components/Footer';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useIsMobile } from '../hooks/useIsMobile';
import supabase from '~/supabase';
import { MetaFunction } from "@remix-run/react";
import localShopsData from '../../cache/shops.json';

interface Shop {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  views: number;
  category_id?: string;
  near_station?: string;
  address?: string;
  map_embed?: string;
  other_images?: string[];
  opening_hours?: string;
  category?: string;
  website_url?: string;
}

interface LoaderData {
  type: string;
  menu: any;
  products: any[];
  error?: string;
  instagramShops: any[];
}
interface WebsiteLink {
  logo: string;   // URL to the icon image
  url: string;    // Destination URL
}

function parseWebsiteLinks(raw?: string): WebsiteLink[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((it): it is WebsiteLink =>
          typeof it.logo === 'string' && typeof it.url === 'string' &&
          it.logo.trim() !== '' && it.url.trim() !== ''
        )
        .map(it => ({ logo: it.logo.trim(), url: it.url.trim() }));
    }
  } catch (e) {
    console.warn('Failed to parse website_url JSON:', e);
  }

  return []; // No fallback – only API-provided logos
}
const parseOtherImages = (images: any) => {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try { return JSON.parse(images); } catch { return []; }
  }
  return [];
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.menu) {
    return [
      { title: "Not Found | Sugamo Navi" },
      { name: "description", content: "お探しのページは見つかりません。" },
    ];
  }

  const { menu, type } = data;
  const isPlace = type === "places";
  const title = `${menu.name} | ${isPlace ? "見る・遊ぶ" : "食べる"} - Sugamo Navi`;
  const desc = menu.description?.replace(/<[^>]*>/g, '').slice(0, 150) + "...";

  return [
    { title },
    { name: "description", content: desc },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "og:image", content: menu.image },
    { property: "og:url", content: `https://sugamo-navi.com/ShopDetails?id=${menu.id}&type=${type}` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type') || 'shops';

  if (!id) return { type, menu: null, products: [], error: 'Missing id' };
  if (!['shops', 'places'].includes(type)) return { type, menu: null, products: [], error: `Invalid type: ${type}` };

  const table = type === 'places' ? 'tourist_places' : 'shops';

  try {
    const { data: itemData, error: itemError } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (itemError || !itemData) return { type, menu: null, products: [], error: itemError?.message || `${type} not found` };

    let categoryName = 'No Category';
    if (itemData.category_id) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', itemData.category_id)
        .single();
      categoryName = categoryData?.name || 'No Category';
    }

    const { data: relatedData, error: relatedError } = await supabase
      .from(table)
      .select('*')
      .neq('id', id)
      .order('name', { ascending: true })
      .limit(8);

    if (relatedError) {
      return {
        type,
        menu: {
          id: itemData.id,
          name: itemData.name,
          image: itemData.image_url || (type === 'places' ? '/src/see-do.png' : '/src/shop.png'),
          description: itemData.description || 'No description available',
          hours: itemData.opening_hours || 'OPEN 10:00 ~ 22:00',
          category_id: itemData.category_id || 'Unknown',
          category: categoryName,
          lastText: itemData.near_station || 'Unknown station',
          address: itemData.address || 'Unknown address',
          map_embed: itemData.map_embed || 'https://www.google.com/maps/embed?...',
          other_images: parseOtherImages(itemData.other_images) || [(type === 'places' ? '/src/see-do.png' : '/src/shop.png')],
          likes: itemData.love_count || 0,
          views: itemData.review_count || 0,
          website_url: itemData.website_url || '',
        },
        products: [],
        error: `Failed to fetch related ${type}s: ${relatedError.message}`,
      };
    }
    let instagramShops: any[] = [];
    try {
      const cached = await getCachedShops();
      instagramShops = cached.shops || [];
    } catch (err) {
      console.warn('Instagram cache failed to load (this is okay)');
      instagramShops = [];
    }

    return {
      menu: {
        id: itemData.id,
        name: itemData.name,
        image: itemData.image_url || (type === 'places' ? '/src/see-do.png' : '/src/shop.png'),
        description: itemData.description || 'No description available',
        hours: itemData.opening_hours || 'OPEN 10:00 ~ 22:00',
        category_id: itemData.category_id || 'Unknown',
        category: categoryName,
        lastText: itemData.near_station || 'Unknown station',
        address: itemData.address || 'Unknown address',
        map_embed: itemData.map_embed || 'https://www.google.com/maps/embed?...',
        other_images: parseOtherImages(itemData.other_images) || [(type === 'places' ? '/src/see-do.png' : '/src/shop.png')],
        likes: itemData.love_count || 0,
        views: itemData.review_count || 0,
        website_url: itemData.website_url || '',
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
        other_images: parseOtherImages(item.other_images),
        opening_hours: item.opening_hours,
        category_id: item.category_id,
        category: categoryName,
        website_url: item.website_url || '',
      })),
      type,
      error: null,
      instagramShops: instagramShops,
    };
  } catch (error) {
    return { type, menu: null, products: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
<<<<<<< HEAD
=======
const getInstagramMediaForShop = (shopName: string, address?: string): string[] => {
  if (!shopName || !localShopsData?.shops?.length) return [];
>>>>>>> 09b3d543fcf5e4a71196a52cc47ddb89bccf28e0

export default function ShopDetails() {
  const { menu, products, type, error: loaderError, instagramShops = [] } = useLoaderData<LoaderData>();
  const getInstagramMediaForShop = (shopName: string, address?: string): string[] => {
    if (!shopName || !instagramShops.length) return [];

    const normalizedName = shopName.trim().toLowerCase();
    const normalizedAddr = (address || '').toLowerCase();

    const matchedShop = instagramShops.find((s: any) => {
      const candidates = [s.name].filter(Boolean);
      return candidates.some((text: string) => {
        const lower = text.toLowerCase();
        return (
          lower.includes(normalizedName) ||
          normalizedName.includes(lower) ||
          (normalizedAddr && lower.includes(normalizedAddr))
        );
      });
    });

    return matchedShop?.images || [];
  };
  const location = useLocation();
  const shopFromState = location.state?.item as Shop | undefined;
  const typeFromState = location.state?.type as 'shops' | 'places' | undefined;
  const effectiveType = type || typeFromState || 'shops';

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(!shopFromState && !menu);
  const [error, setError] = useState<string | null>(loaderError || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [categoriesShop, setCategoriesShop] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [hasLoved, setHasLoved] = useState<boolean>(false);
  const visitAttemptedRef = useRef<boolean>(false);
  const loveAttemptedRef = useRef<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { fs, fsm } = useUniversalFluid();
  const { isMobile } = useIsMobile();
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));
  const visibleCards = 4;

  const websiteLinks = shop ? parseWebsiteLinks(shop.website_url) : [];

  const allImages = (() => {
    if (!shop) return [];

    const instagramMedia = getInstagramMediaForShop(shop.title, shop.address);
    const mainImage = shop.imageUrl && !shop.imageUrl.includes('src/shop.png') && !shop.imageUrl.includes('src/see-do.png')
      ? [shop.imageUrl]
      : [];

    return [...mainImage, ...instagramMedia].filter(Boolean);
  })();
  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [allImages.length]);
  // Infinite slider setup
  const totalSlides = products.length;
  const extendedProducts = totalSlides > 0 ? [...products, ...products, ...products] : [];

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      if (currentIndex >= totalSlides) {
        setCurrentIndex(currentIndex - totalSlides);
      } else if (currentIndex < 0) {
        setCurrentIndex(currentIndex + totalSlides);
      }
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, totalSlides]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('id, name').order('name');
        if (error) throw error;
        setCategoriesShop(data || []);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    fetchCategories();

    if (shop?.id) {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
      const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
      setIsBookmarked(!!savedBookmarks[shop.id]);
      setHasLoved(!!lovedItems[shop.id]);
    }
  }, [shop?.id]);

  const handleLoveClick = async () => {
    if (!shop?.id) return alert('Cannot like item: Invalid ID');
    const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
    const table = effectiveType === 'places' ? 'tourist_places' : 'shops';
    const rpcName = effectiveType === 'places'
      ? (hasLoved ? 'decrement_love_count_place' : 'increment_love_count_place')
      : (hasLoved ? 'decrement_love_count' : 'increment_love_count');
    const param = effectiveType === 'places' ? { place_id: shop.id } : { shop_id: shop.id };

    try {
      loveAttemptedRef.current = true;
      const { error } = await supabase.rpc(rpcName, param);
      if (error) throw error;

      const { data: updatedData }: any = await supabase.from(table).select('love_count').eq('id', shop.id).single();
      setShop(prev => prev ? { ...prev, likes: updatedData.love_count } : prev);

      if (hasLoved) {
        delete lovedItems[shop.id];
        setHasLoved(false);
      } else {
        lovedItems[shop.id] = true;
        setHasLoved(true);
      }
      localStorage.setItem('lovedItems', JSON.stringify(lovedItems));
    } catch (err) {
      alert(`Failed to ${hasLoved ? 'unlike' : 'like'} ${effectiveType}`);
    } finally {
      loveAttemptedRef.current = false;
    }
  };

  const handleBookmarkClick = () => {
    if (!shop?.id) return;
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    const normalizedType = effectiveType === 'places' ? 'place' : 'shop';

    if (isBookmarked) {
      delete savedBookmarks[shop.id];
      setIsBookmarked(false);
    } else {
      savedBookmarks[shop.id] = {
        id: shop.id,
        title: shop.title,
        imageUrl: shop.imageUrl,
        description: shop.description,
        likes: shop.likes,
        views: shop.views,
        category_id: shop.category_id,
        category: getCategoryName(shop.category_id),
        near_station: shop.near_station,
        address: shop.address,
        map_embed: shop.map_embed,
        other_images: parseOtherImages(shop.other_images),
        opening_hours: shop.opening_hours,
        type: normalizedType,
      };
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
  };

  useEffect(() => {
    if (location.state?.item?.id) {
      const fetchShop = async () => {
        setLoading(true);
        const table = effectiveType === 'places' ? 'tourist_places' : 'shops';
        const { data: shopData, error: shopError } = await supabase.from(table).select('*').eq('id', location.state.item.id).single();
        if (shopError || !shopData) throw new Error(shopError?.message || `${effectiveType} not found`);

        let categoryName = location.state.item.category || 'No Category';
        if (shopData.category_id && !location.state.item.category) {
          const { data: categoryData } = await supabase.from('categories').select('name').eq('id', shopData.category_id).single();
          categoryName = categoryData?.name || 'No Category';
        }

        const newShop = {
          id: shopData.id,
          title: shopData.name,
          imageUrl: shopData.image_url || (effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png'),
          description: shopData.description || 'No description available',
          likes: shopData.love_count || 0,
          views: shopData.review_count || 0,
          near_station: shopData.near_station || 'Unknown station',
          address: shopData.address || 'Unknown address',
          map_embed: shopData.map_embed || 'https://www.google.com/maps/embed?...',
          other_images: parseOtherImages(shopData.other_images) || [],
          category_id: shopData.category_id || 'Unknown',
          category: categoryName,
          opening_hours: shopData.opening_hours || 'OPEN 10:00 ~ 22:00',
          website_url: shopData.website_url || '',
        };

        setShop(newShop);
        setCurrentIndex(0);
        setLoading(false);

        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
        const lovedItems = JSON.parse(localStorage.getItem('lovedItems') || '{}');
        setIsBookmarked(!!savedBookmarks[newShop.id]);
        setHasLoved(!!lovedItems[newShop.id]);
      };
      fetchShop();
    } else if (menu && !shop) {
      const newShop = {
        id: menu.id,
        title: menu.name,
        imageUrl: menu.image,
        description: menu.description,
        likes: menu.likes || 0,
        views: menu.views || 0,
        near_station: menu.lastText,
        address: menu.address,
        category_id: menu.category_id,
        map_embed: menu.map_embed,
        other_images: parseOtherImages(menu.other_images),
        opening_hours: menu.hours,
        category: menu.category,
        website_url: menu.website_url || '',
      };
      setShop(newShop);
      setCurrentIndex(0);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [location.state?.item?.id, effectiveType, menu]);

  useEffect(() => {
    if (shopFromState && !shop) {
      const newShop = {
        id: shopFromState.id,
        title: shopFromState.title,
        imageUrl: shopFromState.imageUrl || (effectiveType === 'places' ? '/src/see-do.png' : '/src/shop.png'),
        description: shopFromState.description || 'No description available',
        likes: shopFromState.likes || 0,
        views: shopFromState.views || 0,
        near_station: shopFromState.near_station || 'Unknown station',
        address: shopFromState.address || 'Unknown address',
        map_embed: shopFromState.map_embed || 'https://www.google.com/maps/embed?...',
        other_images: shopFromState.other_images || [],
        category_id: shopFromState.category_id || 'Unknown',
        opening_hours: shopFromState.opening_hours || 'OPEN 10:00 ~ 22:00',
        category: shopFromState.category || 'No Category',
        website_url: shopFromState.website_url || '',
      };
      setShop(newShop);
      setCurrentIndex(0);
    }
  }, [shopFromState, effectiveType, shop]);

  // View increment
  useEffect(() => {
    if (!shop?.id || visitAttemptedRef.current) return;
    const visitKey = `${effectiveType}:${shop.id}`;
    const visitedShops = JSON.parse(localStorage.getItem('visitedShops') || '{}');
    if (visitedShops[visitKey]) {
      visitAttemptedRef.current = true;
      return;
    }

    const incrementVisit = async () => {
      try {
        visitAttemptedRef.current = true;
        const table = effectiveType === 'places' ? 'tourist_places' : 'shops';
        const rpcName = effectiveType === 'places' ? 'increment_review_count_place' : 'increment_review_count';
        const param = effectiveType === 'places' ? { place_id: shop.id } : { shop_id: shop.id };
        const { error } = await supabase.rpc(rpcName, param);
        if (error) throw error;

        const { data: updatedData } = await supabase.from(table).select('review_count').eq('id', shop.id).single();
        setShop(prev => prev ? { ...prev, views: updatedData?.review_count ?? prev.views } : prev);
        visitedShops[visitKey] = true;
        localStorage.setItem('visitedShops', JSON.stringify(visitedShops));
      } catch (err) {
        console.error('View increment error:', err);
      }
    };
    incrementVisit();
  }, [shop?.id, effectiveType]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error || !shop) return <div className="container mx-auto p-4 text-red-600">Error: {error || `${effectiveType} not found`}</div>;

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return shop.category || 'No Category';
    const category = categoriesShop.find(cat => cat.id === categoryId);
    return category ? category.name : shop.category || 'No Category';
  };
  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video') || url.includes('.mp4') || url.includes('dash');
  };
  return (
    <div className="min-h-screen">
      <Header />
      <MarqueeHeader text="Welcome to Sugamo! Pick your faves! ..." backgroundColor="#FFFFFF" textColor="#000000" animationDuration="90s" marginBottom={120} marginTop={100} />

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row items-stretch justify-center min-h-0" style={{ paddingLeft: isMobile ? fsm(40) : fs(90), paddingRight: isMobile ? fsm(40) : fs(90) }}>
        {/* LEFT */}
        <div className="flex flex-col w-full md:w-1/2">
          {isMobile && <h2 className="font-semibold font-cairo text-brown-700" style={{ marginBottom: fsm(20), fontSize: autoSize(22) }}>{shop.title}</h2>}
          {isMobile && (
            <div className="flex flex-row justify-between items-center" style={{ marginBottom: fsm(20) }}>
              <div className="flex flex-row items-center space-x-3">
                <div className="flex flex-wrap gap-2">
                  {(getCategoryName(shop.category_id) || "Shop").split("、").map((category: string, index: React.Key) => (
                    <button key={index} className="bg-[#ED4548] text-white rounded-full italic font-bold font-cairo text-center" style={{ width: fsm(92), minWidth: fsm(72), height: fsm(22), fontSize: fsm(12), padding: '0 8px' }}>
                      {category.trim()}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleLoveClick} className="flex items-center gap-1">
                    <img src={hasLoved ? '/src/red-love.svg' : '/src/love.svg'} alt="Love" style={{ width: fsm(20), height: fsm(20) }} />
                    <span className="font-bold font-cairo text-gray-900" style={{ fontSize: fsm(14) }}>{shop.likes}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <img src="/src/eye.svg" alt="Views" style={{ width: fsm(20), height: fsm(20) }} />
                    <span className="font-bold font-cairo text-gray-900" style={{ fontSize: fsm(14) }}>{shop.views}</span>
                  </div>
                </div>
              </div>
              <button className="transition-transform hover:scale-125" onClick={handleBookmarkClick}>
                <img src={isBookmarked ? '/src/bookmark-filled.svg' : '/src/bookmark.svg'} alt="Bookmark" style={{ width: autoSize(20), height: autoSize(20) }} />
              </button>
            </div>
          )}

          <div className="flex-1 flex items-center justify-center relative bg-black rounded-lg overflow-hidden">
            {allImages.length > 0 ? (
              (() => {
                const mediaUrl = allImages[currentIndex % allImages.length];
                const isVideo = isVideoUrl(mediaUrl);

                return isVideo ? (
                  <video
                    key={mediaUrl}
                    src={mediaUrl}
                    controls
                    loop
                    muted
                    playsInline
                    autoPlay
                    className="w-a h-full max-w-[100%] max-h-[100%] object-contain"
                    style={{
                      maxHeight: isMobile ? fsm(401) : fs(500),
                      minHeight: isMobile ? fsm(401) : fs(540),
                    }}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={shop.title}
                    className="w-full h-full object-cover rounded-lg"

                    style={{ height: isMobile ? fsm(401) : fs(540) }}
                    onError={(e) => (e.currentTarget.src = '/src/shop.png')}
                  />
                );
              })()
            ) : (
              <img
                src={shop.imageUrl}
                alt={shop.title}
                className="w-full h-full object-cover rounded-lg"
                style={{ height: isMobile ? fsm(401) : fs(540) }}
              />
            )}
            {/* {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex % allImages.length
                        ? 'bg-white w-6'
                        : 'bg-white/50 w-2'
                      }`}
                  />
                ))}
              </div>
            )} */}
          </div>


        </div>
        <div className="flex flex-col w-full md:w-1/2">
          <div className="flex-1 flex flex-col pl-0 md:pl-8 justify-between">
            <div className="space-y-4">
              {!isMobile && <h2 className="font-semibold font-cairo text-brown-700" style={{ fontSize: autoSize(22) }}>{shop.title}</h2>}
              {!isMobile && (
                <div className="flex justify-between items-start">
                  <div className="flex flex-wrap items-center gap-3">
                    {(getCategoryName(shop.category_id) || "Shop").split("、").map((category: string, index: React.Key) => (
                      <button key={index} className="bg-[#ED4548] text-white rounded-full italic font-bold font-cairo text-center" style={{ width: fs(92), minWidth: fs(72), height: fs(22), fontSize: fs(13), padding: '0 10px' }}>
                        {category.trim()}
                      </button>
                    ))}
                    <div className="flex items-center gap-4">
                      <button onClick={handleLoveClick} className="flex items-center gap-1">
                        <img src={hasLoved ? '/src/red-love.svg' : '/src/love.svg'} alt="Love" style={{ width: fs(20), height: fs(20) }} />
                        <span className="font-bold font-cairo text-gray-900" style={{ fontSize: fs(14) }}>{shop.likes}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <img src="/src/eye.svg" alt="Views" style={{ width: fs(20), height: fs(20) }} />
                        <span className="font-bold font-cairo text-gray-900" style={{ fontSize: fs(14) }}>{shop.views}</span>
                      </div>
                    </div>
                  </div>
                  <button className="transition-transform hover:scale-125" onClick={handleBookmarkClick}>
                    <img src={isBookmarked ? '/src/bookmark-filled.svg' : '/src/bookmark.svg'} alt="Bookmark" style={{ width: autoSize(20), height: autoSize(20) }} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <p className="text-[#313131] font-normal font-cairo leading-loose" style={{ marginTop: isMobile ? fsm(16) : fs(19), fontSize: autoSize(16), maxHeight: isMobile ? 'none' : fs(540), overflowY: 'auto', paddingRight: '4px' }} dangerouslySetInnerHTML={{ __html: shop.description }} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative flex flex-col md:flex-row items-start justify-between gap-4"
        style={{
          marginTop: isMobile ? fsm(54) : fs(40),
          paddingLeft: isMobile ? fsm(40) : fs(90),
          paddingRight: isMobile ? fsm(40) : fs(90),
        }}
      >
        <div className="flex-1">
          <p
            className="text-[#313131] font-cairo font-medium"
            style={{ fontSize: isMobile ? fsm(13) : fs(18) }}
          >
            オープン:{' '}
            {shop.opening_hours ? (
              <span dangerouslySetInnerHTML={{ __html: shop.opening_hours }} />
            ) : (
              'Not available'
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 justify-end max-w-xs">
          {websiteLinks.length > 0 ? (
            websiteLinks.map(({ url, logo }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 mx-auto transition-transform hover:scale-110"
              >
                <img
                  src={logo}
                  alt={`Visit site ${idx + 1}`}
                  className="w-full h-full object-contain rounded-md shadow-sm bg-white p-1"
                  onError={(e) => {
                    e.currentTarget.src = '/src/link_url.png';
                  }}
                />
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-3 text-center">No links available</p>
          )}
        </div>
      </div>

      <p className="text-[#313131] mt-2 font-cairo font-medium" style={{ fontSize: isMobile ? fsm(13) : fs(18), marginTop: isMobile ? fsm(10) : fs(10), paddingLeft: isMobile ? fsm(40) : fs(90), paddingRight: isMobile ? fsm(40) : fs(90) }}>
        最寄り: {shop.near_station || 'Not available'}
      </p>

      {/* GOOGLE MAP */}
      {shop.map_embed && (
        <div>
          <div className="text-[#ED4548] italic underline w-full text-center font-cousine" style={{ fontSize: autoSize(25), marginTop: isMobile ? fsm(138) : fs(90), marginBottom: isMobile ? fsm(24) : fs(0) }}>
            Google Map
          </div>
          <div className="mx-auto border-2 border-black rounded-lg overflow-hidden" style={{ height: isMobile ? fsm(332) : fs(591), marginLeft: isMobile ? fsm(20) : fs(160), marginRight: isMobile ? fsm(20) : fs(160) }}>
            <iframe src={shop.map_embed} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      )}

      {/* SEE MORE SLIDER */}
      {products.length > 0 ? (
        <div className="relative" style={{ paddingTop: isMobile ? fsm(141) : fs(180), paddingLeft: isMobile ? fsm(20) : fs(90), paddingRight: isMobile ? fsm(20) : fs(90), marginBottom: isMobile ? fsm(144) : fs(130) }}>
          <div className="border-2 border-black rounded-[30px] overflow-visible relative" style={{ paddingTop: isMobile ? fsm(70) : fs(76) }}>
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-bold italic font-cousine inline-block text-wrap" style={{ paddingLeft: isMobile ? fsm(20) : fs(45), paddingRight: isMobile ? fsm(20) : fs(45), fontSize: autoSize(31) }}>
              SEE MORE
            </div>
            <div className="overflow-hidden">
              <div ref={sliderRef} className={`flex gap-4 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : 'transition-none'}`} style={{ transform: `translateX(calc(-${(currentIndex + totalSlides) * (100 / visibleCards)}% - ${(currentIndex + totalSlides) * 1}rem))` }}>
                {extendedProducts.map((product: any, index: number) => (
                  <div key={`${product.id}-${index}`} className="flex-shrink-0" style={{ width: `calc(${100 / visibleCards}% - 1rem)`, minWidth: isMobile ? fsm(210) : fs(350) }}>
                    <div className="h-full">
                      <ShopItem id={product.id} title={product.title} imageUrl={product.imageUrl} description={product.description} likes={product.likes} views={product.views} type={effectiveType === 'places' ? 'place' : 'shop'} near_station={product.near_station} address={product.address} map_embed={product.map_embed} other_images={product.other_images} opening_hours={product.opening_hours} category_id={product.category_id} category={product.category} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between px-4" style={{ height: isMobile ? fsm(106) : fs(76) }}>
              <button onClick={goToPrev} className="text-4xl hover:scale-110 transition-transform">Left Arrow</button>
              <button onClick={goToNext} className="text-4xl hover:scale-110 transition-transform">Right Arrow</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-[#ED4548] font-cairo" style={{ paddingTop: isMobile ? fsm(141) : fs(180), paddingLeft: isMobile ? fsm(20) : fs(90), paddingRight: isMobile ? fsm(20) : fs(90), marginBottom: isMobile ? fsm(144) : fs(130), fontSize: autoSize(16) }}>
          No related shops available.
        </div>
      )}

      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  return <div className="container mx-auto p-4 text-red-600">An unexpected error occurred. Please try again later.</div>;
}