import { useLocation } from 'react-router-dom';
import Header from '~/components/Header';
import React, { useEffect, useState } from 'react';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '~/components/Footer';
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
        title="TRAVEL TIPS"
        subtitle="旅の情報"
        imageSrc="/src/bookmark.png"
        imageAlt="Travel tips Image"
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
         
        </div>
      </div>
      {/* Footer */}
      <Footer marginTop={200} />
    </div>
  );
}