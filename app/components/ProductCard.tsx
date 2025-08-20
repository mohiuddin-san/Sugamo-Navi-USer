import React from 'react';
import { Link } from '@remix-run/react';

interface ProductCardProps {
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  views: number;
  linkTo?: string; // Optional prop for custom link
}

const ProductCard: React.FC<ProductCardProps> = ({ title, imageUrl, description, likes, views, linkTo = '/ShopDetails' }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 w-64 shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <img src={imageUrl || '/src/shop.png'} alt={title} className="w-full h-40 object-cover top-0 rounded-md mb-2" />
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">{description}</p>
        <button className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mb-2">Shop</button>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>❤️ {likes}</span>
          <span>👀 {views}</span>
        </div>
        <Link to={linkTo} className="text-xs hover:text-blue-600 text-gray-500 mt-1">
          more+
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;