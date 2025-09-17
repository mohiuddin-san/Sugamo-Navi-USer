import { useLocation } from 'react-router-dom';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import ProductCard from '~/components/ShopItem';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import { ResponsiveGrid, GridItem } from "../components/ResponsiveGrid";
import { useDevice } from "~/routes/contexts/DeviceContext";
import { useUniversalFluid } from '../hooks/useUniversalFluid';

export default function Shoppage() {
  const location = useLocation();
  const { fs, fsm} = useUniversalFluid();
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);
  const isMobile = useDevice();
  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="FOOD&DRINK"
        subtitle="食べる"
        imageSrc="/src/food.png"
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

      <ResponsiveGrid
        columns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
        isMobile={isMobile}
        className="flex justify-center"
        style={{
          gap: isMobile ? fsm(19) : fs(32),
          marginTop: isMobile ? fsm(0) : fsm(120),
          marginLeft: isMobile ? fsm(20) : fs(161),
          marginRight: isMobile ? fsm(20) : fs(161)
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <GridItem
            key={index}
            column={isMobile ? (index % 2) + 1 : (index % 3) + 1}
            row={
              isMobile
                ? Math.floor(index / 2) + 1 
                : Math.floor(index / 3) + 1 
            }
            columnSpan={1}
            rowSpan={1}
            style={{ minHeight: isMobile ? "auto" : "auto", height: "auto",marginTop: isMobile? fsm(0):fs(8)}}
            className="w-full"
          >
            <ProductCard
              title='ボストール・ボストール'
              imageUrl='./src/food-item.png'
              description='巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！巣鴨店限定のお地蔵パンも！コスパ良いパン屋さん！'
              likes={1500}
              views={1200}
            />
          </GridItem>
        ))}
      </ResponsiveGrid>
      <Footer marginTop={64} />
    </div>
  );
}