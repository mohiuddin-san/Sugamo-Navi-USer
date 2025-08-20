import React from 'react';
import Header from './Header';
import CommonCategoryTop from './CommonCategoryTop';
import MarqueeHeader from './MarqueeHeader';
import ProductCard from './ProductCard';


const Layout = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CommonCategoryTop />
      <MarqueeHeader />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
       <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
       <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
    </div>
  );
};

export default Layout;