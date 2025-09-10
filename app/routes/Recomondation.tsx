import { useLocation } from 'react-router-dom';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import ProductCard from '~/components/ProductCard';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';

export default function ShopDetails() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);
  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="Recommend"
        subtitle="推奨"
        imageSrc="/src/food.png"
        imageAlt="Food and Drink Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#0000000"
        animationDuration="40s"
        marginBottom={120}
        marginTop={0}
      />
  
      <div className="p-4 flex justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          <ProductCard
            title='ボストール・ボストール'
            imageUrl='./src/burger.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1500}
            views={1200}
           />
          <ProductCard
            title='ボストール・ボストール'
            imageUrl='./src/food-item.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1500}
            views={1200}
           />
          <ProductCard
            title='ナンジェリー・ボストール'
            imageUrl='./src/burger.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1000}
            views={1000}
           />
          <ProductCard
            title='ボストール・ボストール'
            imageUrl='./src/food-item.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1500}
            views={1200}
           />
          <ProductCard
            title='ナンジェリー・ボストール'
            imageUrl='./src/burger.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1000}
            views={1000}
           />
          <ProductCard
            title='ボストール・ボストール'
            imageUrl='./src/food-item.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1500}
            views={1200}
           />
          <ProductCard
            title='ナンジェリー・ボストール'
            imageUrl='./src/burger.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1000}
            views={1000}
           />
          <ProductCard
            title='ボストール・ボストール'
            imageUrl='./src/food-item.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1500}
            views={1200}
           />
          <ProductCard
            title='ナンジェリー・ボストール'
            imageUrl='./src/burger.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1000}
            views={1000}
           />
          <ProductCard
            title='ボストール・ボストール'
            imageUrl='./src/food-item.png'
            description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
            likes={1500}
            views={1200}
           />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}