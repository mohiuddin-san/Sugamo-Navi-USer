import { useLoaderData } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useState } from 'react';
import ProductCard from '~/components/ProductCard';
import MarqueeHeader from '~/components/MarqueeHeader';

export function loader() {
  return {
    menu: {
      name: '店舗名が入ります',
      description: '店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。店舗の説明テキストが入ります。',
      hours: 'OPEN 10:00 ~ 22:00',
      phone: 'TEL: 03-5944-5737',
      image: '/src/burger.png', // Example image path
      link: 'https://example.com',
      lastText: 'JR巣鴨駅より徒歩5分',
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
}

export default function ShopDetails() {
  const { menu, products } = useLoaderData(); // Destructure both menu and products
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/src/burger.png', // Replace with actual paths for each image
    '/src/burger.png',
    '/src/burger.png',
    '/src/burger.png',
    '/src/burger.png',
    '/src/burger.png',
  ];
  const visibleCards = 1; // Show 1 card at a time

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="min-h-screen">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MarqueeHeader />
      <div className="flex flex-col md:flex-row items-center justify-center bg-white p-4">
        <div className="md:w-1/3 w-full mb-4 md:mb-0">
          <img
            src={menu.image} // Use dynamic image from loader
            alt="Delicious Burger"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
        <div className="md:w-2/3 w-full md:pl-8">
          <div className="flex items-center space-x-2">
            <button className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              Shop
            </button>
            <div className="flex space-x-2 ml-auto">
              <span className="text-red-500 text-xl">❤️</span>
              <span className="text-blue-500 text-xl">📖</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white">
            <h2 className="text-2xl font-bold text-brown-700">{menu.name}</h2>
            <p className="text-gray-600 mt-2">{menu.description}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text">
                <p className="text-black"><strong>Hours:</strong> {menu.hours}</p>
                <p className="text-black mt-2"><strong>Phone:</strong> {menu.phone}</p>
                <p className="text-black mt-2"><strong></strong> {menu.lastText}</p>
              </div>
              <img
                className="text-yellow-500 text-lg mx-11"
                src="/src/link_url.png" // Replace with actual link icon path
                alt="link Icon"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex space-x-4 overflow-x-auto">
          {images.map((image, index) => (
            <div key={index} className="min-w-[200px]">
              <img src={image} alt={`Related Item ${index + 1}`} className="rounded-lg shadow-lg w-full h-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 w-2/3 mx-auto mb-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.1234567890123!2d139.728123!3d35.735678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c1234567890%3A0xabcdef1234567890!2sSugamo%2C%20Toshima%20City%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2sus!4v1692500000"
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="mt-10 relative w-full">
        <div className="border border-gray-300 p-4 rounded-lg overflow-hidden">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 text-center text-black font-bold">
            SEE MORE
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
    </div>
  );
}