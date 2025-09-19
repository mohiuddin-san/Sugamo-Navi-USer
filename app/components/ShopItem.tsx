import React from 'react';
import { Link } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useDevice } from '~/routes/contexts/DeviceContext';

interface ProductCardProps {
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  views: number;
  type: 'place' | 'shop';
  id: string;
  style?: React.CSSProperties;
}

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  title,
  imageUrl,
  description,
  likes,
  views,
  style,
  id,
}) => {
  const { fs, fsm } = useUniversalFluid();
  const isMobile = useDevice();
  const targetLink = `/ShopDetails?id=${id}&type=${type}s`;

  return (
    <div
      className="border-2 border-black rounded-lg bg-white flex flex-col font-cairo w-full h-full overflow-hidden"
      style={{
        borderRadius: isMobile ? fsm(10) : fs(10),
        ...style,
      }}
    >
      <div
        className="flex items-center justify-center w-full"
        style={{ height: isMobile ? fsm(64) : fs(87) }}
      >
        <h1
          className="text-center font-bold font-cairo text-black line-clamp-2 w-full"
          style={{
            fontSize: isMobile ? fsm(16) : fs(25),
            maxWidth: '100%',
            height: isMobile ? fsm(32) : fs(50),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.2',
          }}
        >
          {title || 'Untitled'}
        </h1>
      </div>
      <div className="relative">
        <img
          src={imageUrl || (type === 'place' ? '/src/see-do.png' : '/src/shop.png')}
          alt={title || 'Item'}
          className="w-full object-cover border-t-2 border-b-2 border-l-0 border-r-0 border-black"
          style={{ height: isMobile ? fsm(148) : fs(210) }}
          onError={(e) => {
            e.currentTarget.src = type === 'place' ? '/src/see-do.png' : '/src/shop.png';
          }}
        />
      </div>
      <div
        className="flex flex-col md:flex-row justify-center items-center md:justify-between"
        style={{
          paddingLeft: isMobile ? fsm(14) : fs(19),
          paddingTop: isMobile ? fsm(10) : fs(12),
          paddingRight: isMobile ? fsm(14) : fs(19),
        }}
      >
        <button
          className="bg-[#ED4548] text-white rounded-full italic font-cairo text-center"
          style={{
            width: isMobile ? fsm(92) : fs(92),
            minWidth: isMobile ? fsm(72) : fs(72),
            height: isMobile ? fsm(22) : fs(22),
            minHeight: isMobile ? fsm(17) : fs(17),
            fontSize: isMobile ? fsm(12) : fs(12),
          }}
        >
          {type === 'place' ? 'Place' : 'Shop'}
        </button>
        <div
          className="flex"
          style={{ marginTop: isMobile ? fsm(15) : fs(0), gap: isMobile ? fsm(16) : fs(16) }}
        >
          <span className="flex items-center" style={{ gap: isMobile ? fsm(5) : fs(5) }}>
            <img
              src="/src/love.svg"
              alt="Love"
              style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
            />
            <p
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
            >
              {likes || 0}
            </p>
          </span>
          <span className="flex items-center" style={{ gap: isMobile ? fsm(5) : fs(5) }}>
            <img
              src="/src/eye.svg"
              alt="Views"
              style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }}
            />
            <p
              className="font-bold font-cairo"
              style={{ fontSize: isMobile ? fsm(14) : fs(14), color: '#111827' }}
            >
              {views || 0}
            </p>
          </span>
          <span className="flex items-center">
            <img
              src="/src/bookmark.svg"
              alt="Bookmark"
              style={{ width: isMobile ? fsm(17) : fs(17), height: isMobile ? fsm(21) : fs(21) }}
            />
          </span>
        </div>
      </div>
      <div
        className="flex flex-col justify-between"
        style={{ paddingBottom: isMobile ? fsm(10) : fs(16), marginTop: fs(29), height: fs(132) }}
      >
        {!isMobile && (
          <p
            className="font-medium text-[#313131] font-cairo text-start line-clamp-3"
            style={{ fontSize: fs(16), paddingLeft: fs(38), paddingRight: fs(38), letterSpacing: 0 }}
          >
            {description || 'No description available'}
          </p>
        )}
        <Link
          to={targetLink}
          state={{ type: `${type}s`, item: { id, title, imageUrl, description, likes, views } }}
          className="italic font-bold font-cousine text-center md:text-end"
          style={{
            marginTop: isMobile ? fsm(15) : fs(0),
            fontSize: isMobile ? fsm(16) : fs(16),
            color: '#000000',
            paddingRight: isMobile ? fsm(0) : fs(18),
          }}
        >
          more+
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;