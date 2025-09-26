import { Link } from "@remix-run/react";
import Header from "~/components/Header";
import React, { useMemo } from "react";
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import Footer from "./Footer";
import MarqueeHeader from "./MarqueeHeader";
import ProductCard from "~/components/ProductCard";
import ModelCourseItem from "./ModelCourseItem";
import TravelsTipsItem from "./TravelsTipsItem";
import { useMediaQuery } from "react-responsive";
import InstagramVideosAll from "~/components/InstagramVideos";
import TikTokVideos from "~/components/TiktokVideos";

// Define types
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

type Blog = {
  id: string;
  title: string;
  details: string;
  status: string;
  category_id: string;
  top_image: string;
  publish_date: string;
};

type HomeProps = {
  posts: any[];
  tiktokVideos: any[];
  error: string | null;
  topImg: string;
  imageUrl: string;
  title: string;
  details: string[];
  letsGOimg: string;
  blogs: Blog[];
  categories: Record<string, string>;
  categoriesShop: { id: string; name: string }[];
  topShops: Shop[];
};

// Memoized components
const ProductCardMemo = React.memo(ProductCard);
const ModelCourseItemMemo = React.memo(ModelCourseItem);
const TravelsTipsItemMemo = React.memo(TravelsTipsItem);

export default function Home({
  posts = [],
  tiktokVideos = [],
  error,
  topImg = "./src/sugamo-navi.webp", // Fallback local path
  imageUrl = "./src/sugamo-gate.webp",
  title = "ABOUT SUGAMO",
  details = [],
  letsGOimg = "./src/lets-g.svg",
  blogs = [],
  categories = {},
  categoriesShop = [],
  topShops = [],
}: HomeProps) {
  console.log("Home props:", { posts, topImg, imageUrl, letsGOimg, topShops, blogs }); // Debug props

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { fs, fsm, fluidStyle } = useUniversalFluid();

  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));

  // Memoize category lookup
  const getCategoryName = useMemo(
    () => (categoryId: string) => {
      const category = categoriesShop.find((cat) => cat.id === categoryId);
      return category ? category.name : "No Category";
    },
    [categoriesShop]
  );

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600">Error: {error}</div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <div
        className="md:bg-white w-full"
        style={{
          paddingLeft: isMobile ? fsm(19) : fs(90),
          paddingRight: isMobile ? fsm(19) : fs(90),
        }}
      >
        <picture>
          <source
            srcSet={isMobile ? "./src/sugamunavi-mobile.webp" : topImg}
            type="image/webp"
          />
          <img
            className="w-full"
            style={{ marginTop: autoSize(21), height: "auto" }}
            src={topImg}
            alt="Sugamo Japan"
            loading="eager" // Critical image, load eagerly
            onError={(e) => {
              console.error("Top image failed to load:", topImg);
              e.currentTarget.src = "./src/fallback-image.webp"; // Fallback
            }}
          />
        </picture>
      </div>
      <div
        className="flex flex-col md:flex-row bg-[#F7F7F7]"
        style={{
          gap: fs(54),
          marginLeft: isMobile ? fsm(20) : fs(130),
          marginRight: isMobile ? fsm(20) : fs(130),
          paddingTop: isMobile ? fsm(25) : fs(59),
          paddingLeft: isMobile ? fsm(40) : fs(83),
          paddingRight: isMobile ? fsm(40) : fs(55),
          paddingBottom: isMobile ? fsm(36) : fs(54),
        }}
      >
        <div className="flex flex-col w-full md:w-1/2">
          <p
            className="text-center md:text-left font-cousine italic font-bold"
            style={{ fontSize: isMobile ? fsm(44) : fs(48), letterSpacing: isMobile ? fsm(0) : fs(0) }}
          >
            {title}
          </p>
          <div
            className="font-semibold font-cairo text-[#313131] text-start"
            style={{
              fontSize: isMobile ? fsm(16) : fs(16),
              width: "100%",
              lineHeight: 1.6,
              marginTop: isMobile ? fsm(10) : fs(16),
            }}
          >
            {details.length > 0 ? (
              details.map((line, index) => (
                <p key={index} className="mb-6">{line}</p>
              ))
            ) : (
              <p>No details available.</p>
            )}
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
                alt="Let's Go Sugamo"
                className="absolute top-0 left-0 w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  console.error("Let's Go image failed:", letsGOimg);
                  e.currentTarget.src = "./src/fallback-image.webp";
                }}
              />
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="flex justify-center items-center w-full md:w-1/2 md:mt-0">
            <div className="relative w-full h-full">
              <img
                src={imageUrl}
                alt="Sugamo Gate"
                className="w-full h-full absolute top-0 left-0 object-cover rounded-[30px]"
                loading="lazy"
                onError={(e) => {
                  console.error("Gate image failed:", imageUrl);
                  e.currentTarget.src = "./src/fallback-image.webp";
                }}
              />
            </div>
          </div>
        )}
      </div>
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="90s"
        marginBottom={0}
        marginTop={isMobile ? 0 : 124}
      />
      <div className="w-full h-auto">
        <div
          className="flex md:flex-row flex-col"
          style={{
            marginLeft: isMobile ? fsm(20) : fs(90),
            marginRight: isMobile ? fsm(20) : fs(90),
            paddingTop: isMobile ? fsm(40) : fs(70),
            paddingBottom: isMobile ? fsm(40) : fs(70),
            gap: isMobile ? fsm(40) : fs(58),
          }}
        >
          <div
            className="flex flex-row justify-center md:items-center"
            style={{ gap: isMobile ? fsm(26) : fs(24) }}
          >
            <div
              key={posts[0]?.id || "1"}
              className="relative overflow-hidden rounded-lg"
              style={{
                width: isMobile ? "45%" : fs(253),
                height: isMobile ? fsm(360) : fs(450),
                maxWidth: isMobile ? fsm(207) : fs(253),
              }}
            >
              <video
                src={posts[0]?.media_url || "./src/video1.mp4"}
                className="object-cover w-full h-full"
                controls
                preload="metadata"
                poster={posts[0]?.thumbnail_url || "./src/thumb1.webp"}
                onError={(e) => {
                  console.error("Video 1 failed:", posts[0]?.media_url);
                  e.currentTarget.poster = "./src/assets/fallback-image.webp";
                }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute bg-opacity-50 flex-row bottom-2 flex justify-center items-center px-3 py-2 gap-2">
                <img
                  src="./src/eye_white.svg"
                  className="w-4 h-4"
                  alt="View Count"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Eye icon failed");
                    e.currentTarget.src = "./src/assets/fallback-image.webp";
                  }}
                />
                <p className="text-body font-cairo text-white">{posts[0]?.like_count || 0}</p>
              </div>
            </div>
            <div
              key={posts[1]?.id || "2"}
              className="relative overflow-hidden rounded-lg"
              style={{
                width: isMobile ? "45%" : fs(253),
                height: isMobile ? fsm(360) : fs(450),
                maxWidth: isMobile ? fsm(207) : fs(253),
              }}
            >
              <video
                src={posts[1]?.media_url || "./src/video2.mp4"}
                className="object-cover w-full h-full"
                controls
                preload="metadata"
                poster={posts[1]?.thumbnail_url || "./src/thumb2.webp"}
                onError={(e) => {
                  console.error("Video 2 failed:", posts[1]?.media_url);
                  e.currentTarget.poster = "./src/assets/fallback-image.webp";
                }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute bg-opacity-50 flex-row bottom-2 flex justify-center items-center px-3 py-2 gap-2">
                <img
                  src="./src/eye_white.svg"
                  className="w-4 h-4"
                  alt="View Count"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Eye icon failed");
                    e.currentTarget.src = "./src/assets/fallback-image.webp";
                  }}
                />
                <p className="text-body font-cairo text-white">{posts[1]?.like_count || 0}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:items-start">
            {!isMobile && (
              <img
                style={{ width: fs(200), height: fs(100) }}
                alt="SUGAMO NAVI"
                src="./src/sugamo-navi-text.svg"
                loading="lazy"
                onError={(e) => {
                  console.error("Sugamo Navi text failed");
                  e.currentTarget.src = "./src/fallback-image.webp";
                }}
              />
            )}
            <div className="flex flex-col w-auto">
              <p
                className="font-cousine font-bold italic text-[#ED4548] underline decoration-[#ED4548] decoration-2 space-x-0 underline-offset-[3px]"
                style={{
                  fontSize: isMobile ? fsm(75) : fs(80),
                  textDecorationSkipInk: "none",
                }}
              >
                INSTAGRAM
              </p>
              <div className="flex flex-row justify-center md:justify-start items-center gap-2">
                <p
                  className="font-cousine font-bold italic text-black underline space-x-0 decoration-black decoration-2 underline-offset-[3px]"
                  style={{
                    fontSize: isMobile ? fsm(75) : fs(80),
                    textDecorationSkipInk: "none",
                    letterSpacing: 0,
                  }}
                >
                  TIKTOK
                </p>
                <img
                  style={{ width: isMobile ? fsm(58) : fs(58), height: isMobile ? fsm(58) : fs(58) }}
                  src="./src/instragram.svg"
                  alt="Instagram Icon"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Instagram icon failed");
                    e.currentTarget.src = "./src/fallback-image.webp";
                  }}
                />
                <img
                  style={{ width: isMobile ? fsm(58) : fs(58), height: isMobile ? fsm(58) : fs(58) }}
                  src="./src/titok.svg"
                  alt="TikTok Icon"
                  loading="lazy"
                  onError={(e) => {
                    console.error("TikTok icon failed");
                    e.currentTarget.src = "./src/fallback-image.webp";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="90s"
        marginBottom={0}
      />
      <div
        className="flex flex-col justify-center items-center"
        style={{
          marginTop: isMobile ? fsm(90) : fs(90),
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(90),
        }}
      >
        {topShops.length === 0 ? (
          <div className="container mx-auto p-4 text-red-600">No shops available</div>
        ) : (
          <div
            className="relative flex flex-col items-center border-2 border-black"
            style={{ borderRadius: autoSize(30) }}
          >
            <span
              className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-cousine italic font-bold"
              style={{
                fontSize: isMobile ? fsm(28) : fs(61),
                width: isMobile ? fsm(338) : "75%",
              }}
            >
              {"SUGAMO’S BEST SHOP"}
              <span
                className="w-auto font-cairo font-semibold block md:inline md:mt-0 not-italic"
                style={{
                  fontSize: isMobile ? fsm(16) : fs(20),
                  paddingLeft: isMobile ? fsm(0) : fs(32),
                }}
              >
                巣鴨のおすすめのお店
              </span>
            </span>
            <div
              className="grid grid-cols-1 md:grid-cols-3 items-center"
              style={{
                paddingTop: isMobile ? fsm(90) : fs(90),
                paddingLeft: isMobile ? fsm(35) : fs(35),
                paddingRight: isMobile ? fsm(35) : fs(35),
                paddingBottom: autoSize(80),
                gap: isMobile ? fsm(32) : fs(42),
              }}
            >
              {/* 1st Card */}
              <div className="flex flex-col items-center transform order-1 md:order-2" style={{ gap: isMobile ? fsm(16) : fs(25) }}>
                <img
                  src="./src/first.svg"
                  alt="First Place"
                  style={{ width: autoSize(116), height: autoSize(113) }}
                  className="object-cover rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    console.error("First place icon failed");
                    e.currentTarget.src = "./src/fallback-image.webp";
                  }}
                />
                <ProductCardMemo
                  title={topShops[0]?.name || "ブーランジェリーボヌール"}
                  imageUrl={topShops[0]?.image_url || "./src/shop.webp"}
                  description={topShops[0]?.description || "巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！"}
                  likes={topShops[0]?.love_count || 0}
                  views={topShops[0]?.review_count || 0}
                  shopId={topShops[0]?.id || ""}
                  opening_hours={topShops[0]?.opening_hours || ""}
                  near_station={topShops[0]?.near_station || ""}
                  address={topShops[0]?.address || ""}
                  category={getCategoryName(topShops[0]?.category_id) || ""}
                  category_id={topShops[0]?.category_id}
                  map_embed={topShops[0]?.map_embed || ""}
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
                  loading="lazy"
                  onError={(e) => {
                    console.error("Second place icon failed");
                    e.currentTarget.src = "./src/fallback-image.webp";
                  }}
                />
                <ProductCardMemo
                  title={topShops[1]?.name || "Cafe Sugamo"}
                  imageUrl={topShops[1]?.image_url || "./src/shop.webp"}
                  description={topShops[1]?.description || "Cozy cafe with traditional sweets"}
                  likes={topShops[1]?.love_count || 0}
                  views={topShops[1]?.review_count || 0}
                  shopId={topShops[1]?.id || ""}
                  opening_hours={topShops[1]?.opening_hours || ""}
                  near_station={topShops[1]?.near_station || ""}
                  address={topShops[1]?.address || ""}
                  category={getCategoryName(topShops[1]?.category_id) || ""}
                  category_id={topShops[1]?.category_id || ""}
                  map_embed={topShops[1]?.map_embed || ""}
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
                  loading="lazy"
                  onError={(e) => {
                    console.error("Third place icon failed");
                    e.currentTarget.src = "./src/fallback-image.webp";
                  }}
                />
                <ProductCardMemo
                  title={topShops[2]?.name || "Restaurant Sugamo"}
                  imageUrl={topShops[2]?.image_url || "./src/shop.webp"}
                  description={topShops[2]?.description || "Fine dining in Sugamo style"}
                  likes={topShops[2]?.love_count || 0}
                  views={topShops[2]?.review_count || 0}
                  shopId={topShops[2]?.id || ""}
                  opening_hours={topShops[2]?.opening_hours || ""}
                  near_station={topShops[2]?.near_station || ""}
                  address={topShops[2]?.address || ""}
                  category={getCategoryName(topShops[2]?.category_id) || ""}
                  category_id={topShops[2]?.category_id}
                  map_embed={topShops[2]?.map_embed || ""}
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
                alt="Top 3 Rankings Left"
                className="h-auto object-cover"
                style={{ width: autoSize(32) }}
                loading="lazy"
                onError={(e) => {
                  console.error("Left line icon failed");
                  e.currentTarget.src = "./src/fallback-image.webp";
                }}
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
                alt="Top 3 Rankings Right"
                className="h-auto object-cover"
                style={{ width: autoSize(32) }}
                loading="lazy"
                onError={(e) => {
                  console.error("Right line icon failed");
                  e.currentTarget.src = "./src/fallback-image.webp";
                }}
              />
            </div>
          </div>
        )}
        <Link
          to="/Recommendation"
          className="w-full italic font-bold text-end text-black font-cousine"
          style={{
            fontSize: isMobile ? fsm(25) : fs(25),
            marginTop: isMobile ? fsm(40) : fs(20),
            marginRight: isMobile ? fsm(20) : fs(0),
          }}
          prefetch="intent"
        >
          more+
        </Link>
      </div>
      <div
        className="flex flex-col justify-center items-center"
        style={{
          marginTop: isMobile ? fsm(80) : fs(154),
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(90),
        }}
      >
        <div
          className="w-full h-auto relative flex flex-col items-center bg-white border-2 border-black rounded-[30px]"
          style={{ paddingBottom: isMobile ? fsm(26) : fs(35) }}
        >
          <span
            className="absolute p-0 -translate-y-1/2 left-1/2 transform -translate-x-1/2 bg-white text-center font-cousine italic font-bold"
            style={{ lineHeight: 1, fontSize: isMobile ? fsm(31) : fs(61), width: isMobile ? fsm(257) : fs(642) }}
          >
            {"MODEL COURSE"}
            <span
              className="font-cairo font-semibold not-italic"
              style={{ fontSize: isMobile ? fsm(16) : fs(20) }}
            >
              モデルコース
            </span>
          </span>
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ paddingTop: isMobile ? fsm(50) : fs(71) }}
          >
            <ModelCourseItemMemo
              imageUrl="./src/model-course-1.png"
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
              <ModelCourseItemMemo
                imageUrl="./src/model-course-2.png"
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
          style={{
            fontSize: isMobile ? fsm(25) : fs(25),
            marginTop: isMobile ? fsm(40) : fs(20),
            marginRight: isMobile ? fsm(20) : fs(0),
          }}
          prefetch="intent"
        >
          more+
        </Link>
      </div>
      <div
        className="flex flex-col justify-center items-center w-full"
        style={{
          marginTop: isMobile ? fsm(154) : fs(224),
          paddingLeft: isMobile ? fsm(20) : fs(90),
          paddingRight: isMobile ? fsm(20) : fs(90),
        }}
      >
        <div
          className="w-full h-auto relative flex flex-col items-center border-2 border-black rounded-[30px] bg-white"
          style={{
            paddingBottom: autoSize(90),
            paddingTop: autoSize(94),
          }}
        >
          <span
            className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-bold italic font-cousine inline-block text-wrap"
            style={{
              fontSize: isMobile ? fsm(31) : fs(61),
              width: isMobile ? fsm(240) : "auto",
              paddingLeft: isMobile ? fsm(0) : fs(24),
              paddingRight: isMobile ? fsm(0) : fs(24),
            }}
          >
            {"TRAVEL TIPS"}
            <span
              className="w-auto font-cairo font-semibold block md:inline mt-1 md:mt-0 not-italic"
              style={{ fontSize: isMobile ? fsm(16) : fs(20) }}
            >
              旅の情報
            </span>
          </span>
          <div
            className="grid grid-cols-1 md:grid-cols-3 w-full"
            style={{
              paddingLeft: isMobile ? fsm(33) : fs(46),
              paddingRight: isMobile ? fsm(33) : fs(46),
              gap: isMobile ? fsm(16) : fsm(24),
            }}
          >
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <TravelsTipsItemMemo
                  key={blog.id}
                  categories={categories[blog.category_id] ? [categories[blog.category_id]] : ["General"]}
                  blog={blog}
                />
              ))
            ) : (
              Array.from({ length: 3 }).map((_, index) => (
                <TravelsTipsItemMemo key={index} categories={["Travel", "Tips"]} />
              ))
            )}
          </div>
        </div>
        <Link
          to="/BlogList"
          className="w-full italic font-bold text-end text-black font-cousine"
          style={{
            fontSize: isMobile ? fsm(25) : fs(25),
            marginTop: isMobile ? fsm(40) : fs(20),
            marginRight: isMobile ? fsm(20) : fs(0),
          }}
          prefetch="intent"
        >
          more+
        </Link>
      </div>
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="90s"
        marginTop={131}
        marginBottom={50}
      />
      <div
        className="grid grid-cols-2 md:grid-cols-2"
        style={{
          marginTop: isMobile ? fsm(64) : fs(90),
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(72),
          marginBottom: isMobile ? fsm(56) : fs(170),
          gap: isMobile ? fsm(56) : fs(72),
        }}
      >
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