import { Link } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useIsMobile } from '../hooks/useIsMobile';
import Footer from './Footer';
import MarqueeHeader from "./MarqueeHeader";
import ProductCard from '~/components/ProductCard';
import ModelCourseItem from './ModelCourseItem';
import TravelsTipsItem from './TravelsTipsItem';
import InstagramVideosAll from '~/components/InstagramVideos';
import { useLoaderData } from '@remix-run/react';
import supabaseShops from "~/supabase";
import supabaseBlogs from "~/supabase_blog";
import TikTokVideos from '~/components/TiktokVideos';

type LoaderData = {
  posts: any[];
  error: string | null;
  topImg: string;
  imageUrl: string;
  title: string;
  details: string[];
  letsGOimg: string;

};

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

export function loader() {
  // Dummy posts to avoid errors (replace with real data fetch later)
  const dummyPosts = [
    { id: '1', media_url: './src/video1.mp4', thumbnail_url: './src/thumb1.png', like_count: 100 },
    { id: '2', media_url: './src/video2.mp4', thumbnail_url: './src/thumb2.png', like_count: 200 },
  ];
  return {
    topImg: "./src/sugamo-navi.webp",
    imageUrl: "./src/sugamo-gate.jpg",
    title: "ABOUT SUGAMO",
    details: [
      "「巣鴨」は、東京の中でも個性的な街のひとつです。",
      "ここ「地蔵通り商店街」は、寺社や老舗の和菓子屋さん、薬局やグルメなお店が入り混じった賑やかな場所で、「おばあちゃんの原宿」として知られ、最近は懐かしい雰囲気が好きな若い人にも人気があります。",
      "下町の雰囲気を味わいたい方の東京観光の際は、ぜひ巣鴨に足を運んでみてください！",
      "また、毎月4日、14日、24日には「縁日」が開催されます。",
      "骨董品やインテリア雑貨の露店、そして屋台グルメが並ぶ、巣鴨地蔵通り商店街での散策や食べ歩きにぴったりのイベントです。"
    ],
    letsGOimg: "./src/lets-g.svg",
    posts: dummyPosts,
    error: null,
  };
}

export default function HomePage() {
  const data = useLoaderData<LoaderData>();
  const { posts, tiktokVideos } = useLoaderData<{
    posts: any[];
    tiktokVideos: any[];
    error: string | null;
  }>();
  const error = data?.error || null;
  const { topImg, imageUrl, title, details, letsGOimg } = loader();
  const { isMobile, mounted } = useIsMobile();
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));
  const { fs, fsm, fluidStyle, fluidClass } = useUniversalFluid();
  const [topShops, setTopShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState({});
  const [categoriesShop, setCategoriesShop] = useState({});
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState<string | null>(null);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
    setBookmarkedBlogs(savedBookmarks);

    const fetchData = async () => {
      try {
        console.log("Starting blogs fetch...");
        setBlogsLoading(true);
        setBlogsError(null);
        const { data: blogsData, error: blogError } = await supabaseBlogs
          .from("blogs")
          .select("id, title, details, status, category_id, top_image, publish_date")
          .eq("status", "publish")
          .order("publish_date", { ascending: false });

        if (blogError) throw blogError;

        console.log("Blogs data fetched:", blogsData);

        const categoryIds = [...new Set(blogsData.map((blog) => blog.category_id).filter(Boolean))];

        if (categoryIds.length > 0) {
          const { data: categoriesData, error: categoriesError } = await supabaseBlogs
            .from("categories")
            .select("id, name")
            .in("id", categoryIds);

          if (categoriesError) throw categoriesError;

          const categoriesMap = categoriesData.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {});

          setCategories(categoriesMap);
          console.log("Categories map:", categoriesMap);
        }

        setBlogs(blogsData || []);
        console.log("Blogs data loaded in state:", blogsData || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogsError(err.message || "Failed to load blogs");
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchData();
  }, []);

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

        if (!recommendations || recommendations.length === 0) {
          setShopsError('No active recommendations found.');
          setTopShops([]);
          return;
        }

        const shopIds = recommendations.map(rec => rec.shop_id);

        try {
          const { data, error } = await supabaseShops
            .from('categories')
            .select('id, name')
            .order('name');

          if (error) throw error;
          setCategoriesShop(data);
        } catch (error) {
          console.error('Error fetching categories:', error.message);
        }
        const { data: shops, error: shopsError } = await supabaseShops
          .from('shops')
          .select('*')
          .in('id', shopIds);

        if (shopsError) {
          throw new Error(`Failed to fetch shops: ${shopsError.message} (Code: ${shopsError.code || 'unknown'})`);
        }
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

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        Error: {error}
      </div>
    );
  }
  const getCategoryName = (categoryId) => {
    const category = categoriesShop.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category';
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <div className=" md:bg-white w-full" style={{ paddingLeft: isMobile ? fsm(19) : fs(90), paddingRight: isMobile ? fsm(19) : fs(90) }}>
        <img
          className="w-full"
          style={{ marginTop: autoSize(21), height: 'auto' }}
          src={isMobile ? "./src/sugamunavi-mobile.webp" : topImg}
          alt="Sugamo Japan"
        />
      </div>
      <div className="flex flex-col md:flex-row bg-[#F7F7F7]" style={{ gap: fs(54), marginLeft: isMobile ? fsm(20) : fs(130), marginRight: isMobile ? fsm(20) : fs(130), paddingTop: isMobile ? fsm(25) : fs(59), paddingLeft: isMobile ? fsm(40) : fs(83), paddingRight: isMobile ? fsm(40) : fs(55), paddingBottom: isMobile ? fsm(36) : fs(54) }}>
        <div className="flex flex-col w-full md:w-1/2">
          <p
            className="text-center md:text-left font-cousine italic font-bold "
            style={{ fontSize: isMobile ? fsm(44) : fs(48), letterSpacing: isMobile ? fsm(0) : fs(0) }}
          >
            {title}
          </p>
          <div
            className="font-semibold font-cairo text-[#313131] text-start"
            style={{
              fontSize: isMobile ? fsm(16) : fs(16),
              width: '100%',
              lineHeight: 1.6,
              marginTop: isMobile ? fsm(10) : fs(16)
            }}
          >
            {details.map((line, index) => (
              <p key={index} className="mb-6">{line}</p>
            ))}
          </div>

          <div className="mt-8 w-full flex justify-center md:justify-end">

            <div
              className="relative w-full flex justify-center md:justify-end"
              style={{
                width: isMobile ? fsm(311) : fs(319),
                height: isMobile ? fsm(100) : fs(95),
              }}
            >
              <img
                src={letsGOimg}
                alt="Sugamo Japan"
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            </div>

          </div>
        </div>

        {!isMobile && (
          <div className="flex justify-center items-center w-full md:w-1/2 md:mt-0">
            <div
              className="relative w-full h-full">
              <img
                src={imageUrl}
                alt="Sugamo Japan"
                className="w-full h-full absolute top-0 left-0 object-cover rounded-[30px] "

              />
            </div>
          </div>
        )}
      </div>
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="90s"
        marginBottom={0}
        marginTop={isMobile ? 0 : 124}
      />
      <div className='w-full h-auto '>
        <div className="flex md:flex-row flex-col " style={{ marginLeft: isMobile ? fsm(20) : fs(90), marginRight: isMobile ? fsm(20) : fs(90), paddingTop: isMobile ? fsm(40) : fs(70), paddingBottom: isMobile ? fsm(40) : fs(70), gap: isMobile ? fsm(40) : fs(58) }}>
          <div className='flex flex-row justify-center md:items-center ' style={{ gap: isMobile ? fsm(26) : fs(24) }}>
            <div key={posts[0]?.id || '1'} className="relative overflow-hidden rounded-lg" style={{ width: isMobile ? '45%' : fs(253), height: isMobile ? fsm(360) : fs(450), maxWidth: isMobile ? fsm(207) : fs(253) }}>
              <video
                src={posts[0]?.media_url || './src/video1.mp4'}
                className="object-cover w-full h-full"
                controls
                preload="metadata"
                poster={posts[0]?.thumbnail_url || './src/thumb1.png'}
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute bg-opacity-50 flex-row bottom-2 flex justify-center items-center px-3 py-2 gap-2">
                <img src='./src/eye_white.svg' className='w-4 h-4' />
                <p className='text-body font-cairo text-white'>{posts[0]?.like_count || 0}</p>
              </div>
            </div>
            <div key={posts[1]?.id || '2'} className="relative overflow-hidden rounded-lg" style={{ width: isMobile ? '45%' : fs(253), height: isMobile ? fsm(360) : fs(450), maxWidth: isMobile ? fsm(207) : fs(253) }}>
              <video
                src={posts[1]?.media_url || './src/video2.mp4'}
                className="object-cover w-full h-full"
                controls
                preload="metadata"
                poster={posts[1]?.thumbnail_url || './src/thumb2.png'}
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute bg-opacity-50 flex-row bottom-2 flex justify-center items-center px-3 py-2 gap-2">
                <img src='./src/eye_white.svg' className='w-4 h-4' />
                <p className='text-body font-cairo text-white'>{posts[1]?.like_count || 0}</p>
              </div>
            </div>
          </div>
          <div className=' flex flex-col justify-center items-center md:items-start'>
            {!isMobile && (
              <img
                style={{ width: fs(200), height: fs(100) }}
                alt="SUGAMO NAVI"
                src="./src/sugamo-navi-text.svg"
              />
            )}

            <div className='flex flex-col w-auto'>
              <p
                className={`
    font-cousine font-bold italic text-[#ED4548] underline 
    decoration-[#ED4548] decoration-2 space-x-0 underline-offset-[3px]
  `}
                style={{
                  fontSize: isMobile ? fsm(75) : fs(80),
                  textDecorationSkipInk: "none",
                }}
              >
                INSTAGRAM
              </p>


              <div className='flex flex-row justify-center md:justify-start items-center gap-2'>
                <p
                  className="font-cousine font-bold italic text-black underline space-x-0 decoration-black decoration-2 underline-offset-[3px]"
                  style={{
                    fontSize: isMobile ? fsm(75) : fs(80),
                    textDecorationSkipInk: "none",
                    letterSpacing: 0
                  }}
                >
                  TIKTOK
                </p>

                <img
                  style={{ width: isMobile ? fsm(58) : fs(58), height: isMobile ? fsm(58) : fs(58) }}
                  src='./src/instragram.svg'
                />
                <img
                  style={{ width: isMobile ? fsm(58) : fs(58), height: isMobile ? fsm(58) : fs(58) }}
                  src='./src/titok.svg'
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="90s"
        marginBottom={0}
      />
      <div
        className="flex flex-col justify-center items-center"
        style={fluidStyle({
          marginTop: isMobile ? fsm(90) : fs(90),
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(90)
        })}
      >
        {shopsLoading ? (
          <div className="container mx-auto p-4">
            Loading shops...
          </div>
        ) : shopsError ? (
          <div className="container mx-auto p-4 text-red-600">
            Error: {shopsError}
          </div>
        ) : (
          <div className="relative flex flex-col items-center border-2 border-black" style={{ borderRadius: autoSize(30) }}>
            <span
              className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-cousine italic font-bold"
              style={fluidStyle({
                fontSize: isMobile ? fsm(28) : fs(61),
                w: isMobile ? fsm(338) : "75%"
              })}
            >
              {"SUGAMO’S BEST SHOP"}
              <span
                className="w-auto font-cairo font-semibold block md:inline md:mt-0 not-italic"
                style={fluidStyle({
                  fontSize: isMobile ? fsm(16) : fs(20),
                  paddingLeft: isMobile ? fsm(0) : fs(32)
                })}
              >
                巣鴨のおすすめのお店
              </span>
            </span>

            <div
              className="grid grid-cols-1 md:grid-cols-3 items-center"
              style={fluidStyle({
                paddingTop: isMobile ? fsm(90) : fs(90),
                paddingLeft: isMobile ? fsm(35) : fs(35),
                paddingRight: isMobile ? fsm(35) : fs(35),
                paddingBottom: autoSize(80),
                gap: isMobile ? fsm(32) : fs(42)
              })}
            >
              {/* 1st Card */}
              <div className="flex flex-col items-center transform order-1 md:order-2" style={{ gap: isMobile ? fsm(16) : fs(25) }}>
                <img
                  src="./src/first.svg"
                  alt="First Place"
                  style={{ width: autoSize(116), height: autoSize(113) }}
                  className="object-cover rounded-lg"
                />
                <ProductCard
                  title={topShops[0]?.name || "ブーランジェリーボヌール"}
                  imageUrl={topShops[0]?.image_url || "./src/shop.png"}
                  description={topShops[0]?.description || "巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！"}
                  likes={topShops[0]?.love_count || 0}
                  views={topShops[0]?.review_count || 0}
                  shopId={topShops[0]?.id || ''}
                  opening_hours={topShops[0]?.opening_hours || ''}
                  near_station={topShops[0]?.near_station || ''}
                  address={topShops[0]?.address || ''}
                  category={getCategoryName(topShops[0]?.category_id )|| ''}
                  category_id= {topShops[0]?.category_id}
                  map_embed={topShops[0]?.map_embed || ''}
                  other_images={topShops[0]?.other_images || null}
                  style={{ width: isMobile ? "auto" : fs(434), height: isMobile ? "auto" : fs(560) }}
                  imageHeight={262}
                  paddingText={54}
                />
              </div>
              {/* 2nd Card */}
              <div className="flex flex-col items-center order-2 md:order-1" style={{ gap: isMobile ? fsm(16) : fs(26) }}>
                <img
                  src="./src/second.svg"
                  alt="Second Place"
                  style={{ width: autoSize(88), height: autoSize(88) }}
                  className="object-cover rounded-lg"
                />
                <ProductCard
                  title={topShops[1]?.name || "Cafe Sugamo"}
                  imageUrl={topShops[1]?.image_url || "./src/shop.png"}
                  description={topShops[1]?.description || "Cozy cafe with traditional sweets"}
                  likes={topShops[1]?.love_count || 0}
                  views={topShops[1]?.review_count || 0}
                  shopId={topShops[1]?.id || ''}
                  opening_hours={topShops[1]?.opening_hours || ''}
                  near_station={topShops[1]?.near_station || ''}
                  address={topShops[1]?.address || ''}
                  category={(getCategoryName( topShops[1]?.category_id )) || ''}
                  category_id= {(topShops[1]?.category_id ) || ''}
                  map_embed={topShops[1]?.map_embed || ''}
                  other_images={topShops[1]?.other_images || null}
                  style={{ width: isMobile ? "auto" : fs(350), height: isMobile ? "auto" : fs(496) }}
                  imageHeight={210}
                />
              </div>
              {/* 3rd Card */}
              <div className="flex flex-col items-center order-3 lg:order-3" style={{ gap: isMobile ? fsm(16) : fs(25) }}>
                <img
                  src="./src/third.svg"
                  alt="Third Place"
                  style={{ width: autoSize(88), height: autoSize(88) }}
                  className="object-cover rounded-lg"
                />
                <ProductCard
                  title={topShops[2]?.name || "Restaurant Sugamo"}
                  imageUrl={topShops[2]?.image_url || "./src/shop.png"}
                  description={topShops[2]?.description || "Fine dining in Sugamo style"}
                  likes={topShops[2]?.love_count || 0}
                  views={topShops[2]?.review_count || 0}
                  shopId={topShops[2]?.id || ''}
                  opening_hours={topShops[2]?.opening_hours || ''}
                  near_station={topShops[2]?.near_station || ''}
                  address={topShops[2]?.address || ''}
                  category={getCategoryName(topShops[2]?.category_id ) || ''}
                  category_id= {topShops[2]?.category_id }
                  map_embed={topShops[2]?.map_embed || ''}
                  other_images={topShops[2]?.other_images || null}
                  style={{ width: isMobile ? "auto" : fs(350), height: isMobile ? "auto" : fs(496) }}
                  imageHeight={210}
                />
              </div>
            </div>
            <div
              className="absolute bottom-0 translate-y-1/2 flex items-center bg-white whitespace-nowrap max-w-full"
              style={{ gap: autoSize(13), paddingLeft: autoSize(20), paddingRight: autoSize(20) }}
            >
              <img
                src="./src/left-line.svg"
                alt="Top 3 Rankings"
                className="h-auto object-cover"
                style={{ width: autoSize(32) }}
              />
              <p
                className="text-black font-cairo italic font-bold text-center"
                style={{
                  fontSize: isMobile ? fsm(31) : fs(48),
                  fontWeight: 700,
                }}
              >
                TOP 3 RANKINGS
              </p>
              <img
                src="./src/right-line.svg"
                alt="Top 3 Rankings"
                className="h-auto object-cover"
                style={{ width: autoSize(32) }}
              />
            </div>
          </div>
        )}
        <Link
          to="/Recommendation"
          className="w-full italic font-bold text-end text-black font-cousine"
          style={fluidStyle({
            fontSize: isMobile ? fsm(25) : fs(25),
            marginTop: isMobile ? fsm(40) : fs(20),
            marginRight: isMobile ? fsm(20) : fs(0)
          })}
        >
          more+
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center" style={{ marginTop: isMobile ? fsm(80) : fs(154), marginLeft: isMobile ? fsm(20) : fs(90), marginRight: isMobile ? fsm(20) : fs(90) }}>
        <div className="w-full h-auto relative flex flex-col items-center bg-white border-2 border-black rounded-[30px]" style={{ paddingBottom: isMobile ? fsm(26) : fs(35) }}>
          <span
            className="absolute p-0 -translate-y-1/2 left-1/2 transform -translate-x-1/2 bg-white text-center font-cousine italic font-bold"
            style={{ lineHeight: 1, fontSize: isMobile ? fsm(31) : fs(61), width: isMobile ? fsm(257) : fs(642) }}
          >
            {"MODEL COURSE"} <span className="font-cairo font-semibold not-italic" style={{ fontSize: isMobile ? fsm(16) : fs(20) }}>モデルコース</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ paddingTop: isMobile ? fsm(50) : fs(71) }}>
            <ModelCourseItem
              imageUrl="./src/model-course-1.jpg"
              title="食べ歩きとお守り巡り"
              details="巣鴨地蔵通り商店街をスタート。昔ながらの和菓子や塩せんべいを片手に、ぶらり食べ歩きはいかがですか？"
              categories={["Temple", "Tea", "History", "???????"]}
              itemNumber={1}
            />
            <div className="relative flex flex-col">
              <div className="block md:hidden mx-3">
                <div className="w-full h-px bg-black"></div>
              </div>
              <div className="hidden md:block absolute top-0 bottom-0 left-0 -translate-x-1/2">
                <div className="h-full w-px bg-black pt-8 pb-7"></div>
              </div>
              <ModelCourseItem
                imageUrl="./src/model-course-2.jpg"
                title="寺社巡り〜歴史と癒しの旅〜"
                details="巣鴨地蔵通り商店街をスタート。昔ながらの和菓子や塩せんべいを片手に、ぶらり食べ歩きはいかがですか？"
                categories={["Temple", "Tea", "History"]}
                itemNumber={2}
              />
            </div>
          </div>
        </div>
        <Link
          to="/ModelCourse"
          className="w-full italic font-bold text-end text-black font-cousine"
          style={fluidStyle({
            fontSize: isMobile ? fsm(25) : fs(25),
            marginTop: isMobile ? fsm(40) : fs(20),
            marginRight: isMobile ? fsm(20) : fs(0)
          })}
        >
          more+
        </Link>
      </div>
      <div
        className="flex flex-col justify-center items-center w-full"
        style={{
          marginTop: isMobile ? fsm(154) : fs(224),
          paddingLeft: isMobile ? fsm(20) : fs(90),
          paddingRight: isMobile ? fsm(20) : fs(90)
        }}
      >
        <div
          className="w-full h-auto relative flex flex-col items-center border-2 border-black rounded-[30px] bg-white"
          style={{
            paddingBottom: autoSize(90),
            paddingTop: autoSize(94)
          }}
        >
          <span
            className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-bold italic font-cousine inline-block text-wrap"
            style={fluidStyle({
              fontSize: isMobile ? fsm(31) : fs(61),
              w: isMobile ? fsm(240) : "auto",
              paddingLeft: isMobile ? fsm(0) : fs(24),
              paddingRight: isMobile ? fsm(0) : fs(24)
            })}
          >
            {"TRAVEL TIPS "}
            <span
              className="w-auto font-cairo font-semibold block md:inline mt-1 md:mt-0 not-italic"
              style={fluidStyle({ fontSize: isMobile ? fsm(16) : fs(20) })}
            >
              旅の情報
            </span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 w-full" style={{ paddingLeft: isMobile ? fsm(33) : fs(46), paddingRight: isMobile ? fsm(33) : fs(46), gap: isMobile ? fsm(16) : fsm(24) }}>
            {blogsLoading ? (
              <div className="col-span-full text-center p-4">Loading tips...</div>
            ) : blogsError ? (
              <div className="col-span-full text-red-600 text-center p-4">Error loading tips: {blogsError}</div>
            ) : blogs.length > 0 ? (
              blogs.slice(0, 3).map((blog) => (
                <TravelsTipsItem
                  key={blog.id}
                  categories={categories[blog.category_id] || ["General"]}
                  blog={blog}  // New: Single blog data pass
                />
              ))
            ) : (
              Array.from({ length: 3 }).map((_, index) => (
                <TravelsTipsItem key={index} categories={["Travel", "Tips"]} />  // Fallback without blog
              ))
            )}
          </div>
        </div>
        <Link
          to="/BlogList"
          className="w-full italic font-bold text-end text-black font-cousine"
          style={fluidStyle({
            fontSize: isMobile ? fsm(25) : fs(25),
            marginTop: isMobile ? fsm(40) : fs(20),
            marginRight: isMobile ? fsm(20) : fs(0)
          })}
        >
          more+
        </Link>
      </div>
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="90s"
        marginTop={131}
        marginBottom={50}
      />
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: isMobile ? fsm(64) : fs(90), marginLeft: isMobile ? fsm(20) : fs(90), marginRight: isMobile ? fsm(20) : fs(72), marginBottom: isMobile ? fsm(56) : fs(170), gap: isMobile ? fsm(56) : fs(72) }}>
        <div>
          <InstagramVideosAll />
        </div>
        <div>
          <TikTokVideos videos={tiktokVideos} />
        </div>
      </div>
      <Footer />
    </div>
  );
}