import { useLoaderData, useLocation } from 'react-router-dom';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import MarqueeHeader from '~/components/MarqueeHeader';
import MapView from '~/components/Map';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import ModelCourseDetailsItem from '../components/ModelCourseDetailsItem';
import ProductCard from '~/components/ProductCard';



export function loader() {
  console.log('Loader called'); // For debugging
  return {
    modelCourse: [
      {
        title: 'ナンジェリー・ボストール',
        imageUrl: "/src/model-course-1.png",
        itemNumber: 1,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl: "/src/model-course-2.png",
        itemNumber: 2,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl: "/src/model-course-1.png",
        itemNumber: 3,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl: "/src/model-course-2.png",
        itemNumber: 4,
      },
      {
        title: 'ナンジェリー・ボストール',
        imageUrl: "/src/model-course-1.png",
        itemNumber: 5,
      },
      {
        title: 'ボストール・ボストール',
        imageUrl:"/src/model-course-2.png",
        itemNumber: 6,
      },
    ],
    stops: [
      {
        id: 1,
        title: '古奈屋 巣鴨本店',
        description: '古奈屋 巣鴨本店で美味しいラーメンを味わう。',
        image: './src/food-1.png', // Replace with actual image path
      },
      {
        id: 2,
        title: '高岩寺 (とげぬき地蔵)',
        description: '高岩寺で癒しを求める参拝客で賑わう。',
        image: './src/food-2.png', // Replace with actual image path
      },
      {
        id: 3,
        title: '地蔵通り',
        description: '地蔵通り商店街を散策し、地元の雰囲気を楽しむ。',
        image: './src/food-3.png', // Replace with actual image path
      },
      {
        id: 4,
        title: 'かき氷 工房 雪や',
        description: 'かき氷工房雪やで美味しいかき氷を堪能する。',
        image: './src/food-4.png', // Replace with actual image path
      },
      {
        id: 5,
        title: '六義園',
        description: '六義園で自然を満喫し、心をリフレッシュ。',
        image: './src/food-5.png', // Replace with actual image path
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
  };
}

export default function ModelCourse() {
  const data = useLoaderData();
  const modelCourse = data?.modelCourse || []; // Fallback to empty array
  const products = data?.products || []; // Fallback to empty array
  const stops = data?.stops || []; // Fallback to empty array
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();
  const { fs, fsm, fsVw, fluidStyle, fluidClass } = useUniversalFluid();
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % modelCourse.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + modelCourse.length) % modelCourse.length);
  };

  return (
    <div className="min-h-screen">
      <Header/>
      <CommonCategoryTop
        title="MODEL COURSE"
        subtitle="モデルコース"
        imageSrc="/src/food.png" // Ensure this path is correct
        imageAlt="Food and Drink Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="40s"
        marginBottom={120}
        marginTop={0}
      />
      <div className="mt-10 relative border border-black rounded-lg" style={{ marginLeft: fs(80), marginRight: fs(80) }}>
        <div className="p-4 rounded-lg overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${modelCourse.length * 16}%` }}
          >
            {modelCourse.map((modelC, index) => (
              <div key={index} className="flex-shrink-0 p-2" style={{ width: '33.33%', boxSizing: 'border-box' }}>
                <ModelCourseDetailsItem
                  title={modelC.title}
                  imageUrl={modelC.imageUrl}
                  itemNumber={modelC.itemNumber}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4 px-4">
          <button onClick={handlePrev} className="text-2xl">
            ←
          </button>
          <button onClick={handleNext} className="text-2xl">
            →
          </button>
        </div>
      </div>

      <div className="mt-10 relative border border-black rounded-lg" style={{ marginLeft: fs(80), marginRight: fs(80), marginTop: fs(33), marginBottom: fs(33) }}>
        <div className=" bg-white overflow-hidden" style={{ marginLeft: fs(33), marginTop: fs(33), marginBottom: fs(33) }}>
          <div className="flex flex-col justify-between">
            <div className="flex space-x-3 justify-between" style={{marginRight: fs(33)}}>
              <span className="flex items-center space-x-3">
                <p className="font-bold font-cairo" style={{ fontSize: fs(40), color: "#111827" }}>
                  COURSE
                </p>
                <div className="border-l-2 border-black h-10 mx-4"></div>
                <p className="font-semibold font-cairo" style={{ fontSize: fs(16), color: "#111827" }}>
                  食べ歩きとお守り巡り
                </p>
              </span>
              <span className="ml-1" style={{ fontSize: fs(20), color: "#000000" }}>#1</span>
            </div>
          </div>
          <div className="border-t border-black  my-4" style={{marginRight: fs(33)}}></div>
          <div className="border border-black rounded-lg mt-4"  style={{marginRight: fs(33)}}>
            <MarqueeHeader
              text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
              backgroundColor="#FFFFFF"
              textColor="#000000"
              animationDuration="40s"
              marginBottom={0}
              marginTop={0}
            />
            <MapView />
            <MarqueeHeader
              text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
              backgroundColor="#FFFFFF"
              textColor="#000000"
              animationDuration="40s"
              marginBottom={0}
              marginTop={0}
            />
          </div>
          <div className="border-t border-black my-4" style={{marginRight: fs(33)}}></div>
          <div className="min-h-screen">
            <div className="mx-auto flex flex-row">
              {/* Left Side: Description Text */}
              <div className="w-2/3 pr-8 pt-5">
                <p className="w-full text-black text-star">店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。</p>
              </div>
              <div className="w-px bg-black h-auto mx-4"></div>

              <div className="w-1/3 flex flex-col items-center">
                <div className="text-start mb-8 w-full">
                  <h2 className="text-start text-3xl font-bold text-green-600">START!</h2>
                </div>

                <div className="w-full">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className=" flex flex-col items-center">
                      <div className="bg-white border-2 rounded-md w-full flex">
                        <div
                          className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center text-gray-600"
                          style={{ backgroundImage: `url(${stop.image})`, backgroundSize: 'cover' }}
                        >
                          {stop.image.includes('placeholder') && `Image ${stop.id}`}
                        </div>
                        <div className="mt-2 text-start px-4">
                          <h3 className="italic" style={{fontFamily:'Cousine',fontSize: fs(16)}}>STOP.{stop.id}</h3>
                          <p className="text-lg mt-4">{stop.title}</p>
                        </div>
                      </div>
                      {index < stops.length - 1 && (
                        <div className="text-2xl text-gray-400">↓</div>
                      )}
                    </div>
                  ))}

                  
                  <div className="text-end mt-8">
                    <h2 className="text-3xl font-bold text-red-600">FINISH!</h2>
                  </div>
                </div>
              </div>
              <div className="ml-4 mt-9 space-y-4 ">
                <img src="./src/union.svg" alt="Description" style={{marginTop: fs(33), marginBottom: fs(33)}}/>
                <img src="./src/union.svg" alt="Description" style={{marginTop: fs(33), marginBottom: fs(33)}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <div className="mt-10 relative border border-black rounded-lg" style={{marginLeft: fs(80), marginRight: fs(80), marginTop: fs(33), marginBottom: fs(33)}}>
        <div className=" p-4 rounded-lg overflow-hidden">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 text-center text-black font-bold">
            COURSE SHOPS
          </div>
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 10}%)`, width: `${products.length * 10}%` }}
          >
            {products.map((product, index) => (
              <div key={index} className=" flex-shrink-0 p-2" style={{ boxSizing: 'border-box' }}>
                <ProductCard
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
        <div className="flex justify-between mt-4 px-4">
          <button onClick={handlePrev} className="text-2xl">
            ←
          </button>
          <button onClick={handleNext} className="text-2xl">
            →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}