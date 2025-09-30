import { useLoaderData, useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useEffect, useState, useRef } from 'react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import { useDevice } from '~/routes/contexts/DeviceContext';
import ModelCourseDetailsItem from '../components/ModelCourseDetailsItem';
import ShopItem from '~/components/ShopItem';
import { json } from '@remix-run/node';
import MapSVG from '~/components/MapSVG';

export async function loader() {
  return json({
    modelCourse: [
      {
        title: 'ナンジェリー・ボストール',
        imageUrl: '/src/model-course-1.png',
        itemNumber: 1,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl: '/src/model-course-2.png',
        itemNumber: 2,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl: '/src/model-course-1.png',
        itemNumber: 3,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl: '/src/model-course-2.png',
        itemNumber: 4,
      },
      {
        title: 'ナンジェリー・ボストール',
        imageUrl: '/src/model-course-1.png',
        itemNumber: 5,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl: '/src/model-course-2.png',
        itemNumber: 6,
      },
    ],
    stops: [
      {
        id: 1,
        title: '古奈屋 巣鴨本店',
        description: '古奈屋 巣鴨本店で美味しいラーメンを味わう。',
        image: '/src/food-1.png',
      },
      {
        id: 2,
        title: '高岩寺 (とげぬき地蔵)',
        description: '高岩寺で癒しを求める参拝客で賑わう。',
        image: '/src/food-2.png',
      },
      {
        id: 3,
        title: '地蔵通り',
        description: '地蔵通り商店街を散策し、地元の雰囲気を楽しむ。',
        image: '/src/food-3.png',
      },
      {
        id: 4,
        title: 'かき氷 工房 雪や',
        description: 'かき氷工房雪やで美味しいかき氷を堪能する。',
        image: '/src/food-4.png',
      },
      {
        id: 5,
        title: '六義園',
        description: '六義園で自然を満喫し、心をリフレッシュ。',
        image: '/src/food-5.png',
      },
      {
        id: 6,
        title: '六義園',
        description: '六義園で自然を満喫し、心をリフレッシュ。',
        image: '/src/food-5.png',
      },
    ],
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
  });
}

export default function ModelCourse() {
  const data = useLoaderData<typeof loader>();
  const modelCourse = data?.modelCourse || [];
  const products = data?.products || [];
  const stops = data?.stops || [];
  const location = useLocation();
  const isMobile = useDevice();
  const { fs, fsm } = useUniversalFluid();
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));

  const [currentIndex, setCurrentIndex] = useState(1);
  const [currentIndexM, setCurrentIndexM] = useState(0);
  const [selectedStop, setSelectedStop] = useState<typeof stops[0] | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [hasSvgAnimated, setHasSvgAnimated] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const stopsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % modelCourse.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + modelCourse.length) % modelCourse.length);
  };

  const handleNextM = () => {
    setCurrentIndexM((prev) => (prev + 1) % modelCourse.length);
  };

  const handlePrevM = () => {
    setCurrentIndexM((prev) => (prev - 1 + modelCourse.length) % modelCourse.length);
  };

  const handlePinClick = (title: string) => {
    console.log('পিন ক্লিক করা হয়েছে, টাইটেল:', title);
    setSelectedTitle(title);

    const matchingStop = stops.find(
      (stop) => stop.title.trim() === title.trim()
    );
    if (matchingStop) {
      setSelectedStop(matchingStop);
      console.log('ম্যাচিং স্টপ:', matchingStop);

      // Scroll to the corresponding stop
      const stopIndex = stops.findIndex((stop) => stop.title.trim() === title.trim());
      if (stopIndex !== -1 && stopsRef.current[stopIndex]) {
        stopsRef.current[stopIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    } else {
      console.log('কোনো ম্যাচিং স্টপ পাওয়া যায়নি:', title);
      setSelectedStop(null);
    }
  };

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  // Intersection Observer to trigger SVG animation only once
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasSvgAnimated) {
            setHasSvgAnimated(true);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, [hasSvgAnimated]);

  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="MODEL COURSE"
        subtitle="モデルコース"
        imageSrc="/src/food.png"
        imageAlt="Food and Drink Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="40s"
        marginBottom={43}
        marginTop={98}
      />
      <div
        className="relative border-2 border-black rounded-[30px]"
        style={{
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(90),
          paddingTop: isMobile ? fsm(61) : fs(25),
        }}
      >
        <div className="rounded-lg overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out overflow-x-auto"
            style={{
              transform: isMobile
                ? `translateX(-${currentIndexM * 25}%)`
                : `translateX(-${currentIndexM * 33.33}%)`,
              width: isMobile
                ? `${modelCourse.length * 25}%`
                : `${modelCourse.length * 33.33}%`,
            }}
          >
            {modelCourse.map((modelC, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-row"
                style={{ paddingLeft: isMobile ? fsm(16) : fs(42) }}
              >
                <ModelCourseDetailsItem
                  title={modelC.title}
                  imageUrl={modelC.imageUrl}
                  itemNumber={modelC.itemNumber}
                />
                {index !== modelCourse.length - 1 && (
                  <div
                    className="w-[2px] h-full bg-black"
                    style={{ marginLeft: isMobile ? fsm(16) : fs(42) }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex justify-between"
          style={{
            height: isMobile ? fsm(61) : fs(68),
            paddingLeft: isMobile ? fsm(20) : fs(23),
            paddingRight: isMobile ? fsm(20) : fs(23),
          }}
        >
          <button onClick={handlePrevM} className="text-4xl">
            ←
          </button>
          <button onClick={handleNextM} className="text-4xl">
            →
          </button>
        </div>
      </div>

      <div
        className="relative border-black border-2 rounded-[30px] overflow-hidden"
        style={{
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(90),
          marginTop: isMobile ? fsm(88) : fs(101),
        }}
      >
        <div className="bg-white overflow-hidden" style={{ marginLeft: fs(33) }}>
          <div
            className="flex flex-col justify-between"
            style={{ marginRight: fs(33) }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <p
                  className="font-bold font-cousine text-black"
                  style={{ fontSize: isMobile ? fsm(48) : fs(61) }}
                >
                  COURSE
                </p>
                {!isMobile && (
                  <div className="flex flex-row items-center">
                    <div className="border-l-2 border-black h-10 mx-4"></div>
                    <p
                      className="font-semibold font-cairo"
                      style={{
                        fontSize: isMobile ? fsm(25) : fs(25),
                        color: '#111827',
                      }}
                    >
                      食べ歩きとお守り巡り
                    </p>
                  </div>
                )}
              </span>
              <span
                className="font-cousine font-bold italic ml-2"
                style={{
                  fontSize: isMobile ? fsm(21) : fs(31),
                  color: '#000000',
                }}
              >
                #1
              </span>
            </div>
          </div>
          <div
            className="border-t-2 border-black"
            style={{ marginBottom: isMobile ? fsm(33) : fs(33), marginRight: fs(33) }}
          ></div>
          <div
            className="border-l-2 border-r-2 border-black rounded-lg overflow-hidden"
            style={{ marginRight: fs(33) }}
          >
            <MarqueeHeader
              text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
              backgroundColor="#FFFFFF"
              textColor="#000000"
              animationDuration="90s"
              marginBottom={0}
              marginTop={0}
            />
            <div style={{ position: 'relative' }} ref={mapRef}>
              <MapSVG
                svgPath="/src/map-pin.svg"
                onPinClick={handlePinClick}
                startAnimation={hasSvgAnimated}
              />
            </div>
            <MarqueeHeader
              text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
              backgroundColor="#FFFFFF"
              textColor="#000000"
              animationDuration="40s"
              marginBottom={0}
              marginTop={0}
            />
          </div>
          <div
            className="border-t-2 border-black"
            style={{ marginTop: isMobile ? fsm(16) : fs(26), marginRight: fs(33) }}
          ></div>
          <div
            className="min-h-screen"
            style={{
              marginTop: isMobile ? fsm(33) : fs(33),
              paddingBottom: isMobile ? fsm(33) : fs(33),
            }}
          >
            <div className="mx-auto flex flex-col md:flex-row">
              <div
                className="w-full md:w-2/3"
                style={{ paddingRight: isMobile ? fsm(0) : fs(36) }}
              >
                <p
                  className="w-full text-black text-start leading-[40px] font-cairo font-normal"
                  style={{
                    fontSize: isMobile ? fsm(16) : fs(16),
                    paddingLeft: isMobile ? fsm(21) : fs(28),
                    paddingTop: isMobile ? fsm(0) : fs(58),
                    paddingRight: isMobile ? fsm(21) : fs(0),
                  }}
                >
                  {selectedStop ? (
                    <>
                      <strong>{selectedStop.title}</strong>: {selectedStop.description}
                    </>
                  ) : (
                    <>
                      このコースは、巣鴨の歴史と文化、そしてグルメをバランスよく楽しめる、まさに「王道」と呼ぶにふさわしい内容です。
                      <br />
                      コースの始まりは、江戸六地蔵のひとつである眞性寺。旅の安全を願って造られた歴史的なお地蔵様を拝んだら、巣鴨のメインストリート、地蔵通り商店街へ。
                      <br />
                      商店街の中ほどにあるとげぬき地蔵尊 高岩寺では、お年寄りから「とげぬき地蔵」として親しまれているお地蔵様にお参りできます。「洗い観音」に水をかけて清める体験も、巣鴨ならではです。
                      <br />
                      <br />
                      お参りを終えたら、お待ちかねのグルメタイム。「カレーうどん」で有名な古奈屋で食事をしたり、行列のできるかき氷店雪菓で休憩したりと、人気の味を堪能できます。また、マルジでは「赤いパンツ」をはじめとするユニークな商品が並び、巣鴨らしい活気を感じられます。さらに、お茶の老舗山年園や、名物の「塩大福」が人気のみずのに立ち寄れば、お土産探しも完璧です。
                      <br />
                      <br />
                      <br />
                      歴史的なお寺を巡り、おいしいものを味わい、活気あふれる商店街で買い物を楽しむ。このコースは、巣鴨の魅力をぎゅっと凝縮した、初めての方にもリピーターにもおすすめのコースです。
                    </>
                  )}
                </p>
              </div>
              <div
                className="w-[2px] bg-black h-auto"
                style={{ marginRight: isMobile ? fsm(0) : fs(36) }}
              ></div>
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="text-start w-full">
                  <h2
                    className="text-start font-cousine font-bold italic text-black"
                    style={{
                      fontSize: isMobile ? fsm(31) : fs(31),
                      paddingTop: isMobile ? fsm(32) : fs(14),
                    }}
                  >
                    START!
                  </h2>
                </div>
                <div
                  className="w-full pr-2"
                  style={{
                    height: isMobile ? 'auto' : fs(645),
                    overflowY: isMobile ? 'visible' : 'scroll',
                  }}
                >
                  {stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      ref={(el) => (stopsRef.current[index] = el)}
                      className={`flex flex-col items-center `}
                      style={{
                        height: isMobile ? fsm(115) : fs(115),
                        marginBottom: isMobile ? fsm(16) : fs(16),
                      }}
                    >
                      <div
                        className={` border-2 border-black rounded-[10px] w-full flex overflow-hidden ${
                        selectedTitle === stop.title ? 'bg-[#ED4548]' : 'bg-[#FFFFFF]'
                      }`}
                      >
                        <div
                          className="bg-gray-300 flex items-center justify-center text-gray-600"
                          style={{
                            backgroundImage: `url(${stop.image})`,
                            backgroundSize: 'cover',
                            width: isMobile ? fsm(113) : fs(113),
                            height: isMobile ? fsm(113) : fs(113),
                          }}
                        >
                          {stop.image.includes('placeholder') && `Image ${stop.id}`}
                        </div>
                        <div
                          className="text-start"
                          style={{ marginLeft: isMobile ? fsm(16) : fs(16) }}
                        >
                          <h3
                            className={`italic font-bold font-cousine ${
                        selectedTitle === stop.title ? 'text-[#FFFFFF]' : 'text-[#000000]'
                      }`}
                            style={{
                              fontSize: isMobile ? fsm(16) : fs(16),
                              marginTop: isMobile ? fsm(7) : fs(7),
                            }}
                          >
                            STOP.{stop.id}
                          </h3>
                          <p
                            className={`font-cairo font-semibold ${
                        selectedTitle === stop.title ? 'text-[#FFFFFF]' : 'text-[#000000]'
                      }`}
                            style={{ fontSize: isMobile ? fsm(20) : fs(20) }}
                          >
                            {stop.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full text-end pr-2">
                  <h2
                    className="font-bold text-black font-cousine italic"
                    style={{
                      fontSize: isMobile ? fsm(31) : fs(31),
                      marginTop: isMobile ? fsm(16) : fs(26),
                    }}
                  >
                    FINISH!
                  </h2>
                </div>
              </div>
              {!isMobile && (
                <div className="mx-auto h-full" style={{ marginTop: fs(73) }}>
                  <img
                    src="/src/union.svg"
                    alt="Description"
                    style={{ height: fs(311) }}
                  />
                  <img
                    src="/src/union.svg"
                    alt="Description"
                    style={{ marginTop: fs(18) }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative"
        style={{
          marginTop: isMobile ? fsm(117) : fs(207),
          paddingLeft: isMobile ? fsm(20) : fs(90),
          paddingRight: isMobile ? fsm(20) : fs(90),
          marginBottom: isMobile ? fsm(144) : fs(130),
        }}
      >
        <div
          className="border-2 border-black rounded-[10px] overflow-visible relative"
          style={{ paddingTop: isMobile ? fsm(76) : fs(76) }}
        >
          <div
            className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-bold italic font-cousine inline-block text-wrap"
            style={{
              paddingLeft: isMobile ? fsm(2) : fs(14),
              paddingRight: isMobile ? fsm(2) : fs(14),
              fontSize: autoSize(31),
            }}
          >
            COURSE SHOPS
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
                    imageUrl={product.imageUrl}
                    description={product.description}
                    likes={product.likes}
                    views={product.views}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex justify-between px-4"
            style={{ height: autoSize(76) }}
          >
            <button
              onClick={handlePrev}
              className="text-4xl disabled:opacity-30"
              disabled={currentIndex === 0}
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="text-4xl disabled:opacity-30"
              disabled={currentIndex >= products.length - 4}
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