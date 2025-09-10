import { useLocation } from 'react-router-dom';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import ProductCard from '~/components/ShopItem';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import { useDevice } from "~/routes/contexts/DeviceContext";
import { useUniversalFluid } from '../hooks/useUniversalFluid';

export default function ShopDetails() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();
  const { fs, fsm, fsVw, fluidStyle, fluidClass } = useUniversalFluid();
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);
  const isMobile  = useDevice();
  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="SEE&DO"
        subtitle="観る・遊ぶ"
        imageSrc="/src/see-do.png"
        imageAlt="Food and Drink Image"
      />
      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#0000000"
        animationDuration="40s"
        marginBottom={120}
        marginTop={98}
      />
  
      <div className="flex justify-center" style={{marginBottom: isMobile? fsm(70):fs(70)}}>
        <div className="grid grid-cols-2 lg:grid-cols-3" style={{gap: isMobile? fsm(19):fs(32),paddingLeft: isMobile?fsm(20):fsm(163),paddingRight: isMobile?fsm(20):fsm(163)}}>
          <ProductCard
            title='ボストール・ボストール'
            imageUrl='./src/food-item.png'
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
            imageUrl='./src/food-item.png'
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
            imageUrl='./src/food-item.png'
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
            imageUrl='./src/food-item.png'
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
            imageUrl='./src/food-item.png'
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