import React from 'react';
import { Link } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useNavigate } from '@remix-run/react';
import { useMediaQuery } from "react-responsive";
import { useDevice } from "~/routes/contexts/DeviceContext";
interface ProductCardProps {
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  views: number;
  linkTo?: string,
  style?: React.CSSProperties;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, imageUrl, description, likes, views, linkTo = '/ShopDetails', style }) => {
  const { fs, fsm, fsVw, fluidStyle, fluidClass } = useUniversalFluid();
  const navigate = useNavigate();
  const handleBlogListClick = () => {
    navigate('/ShopDetails');
  };
  const isMobile = useDevice();
  return (
    <div
      className="border-2 border-black rounded-lg bg-white flex flex-col font-cairo w-full h-full overflow-hidden "
      style={{
        borderRadius: isMobile ? fsm(10) : fs(10),
        ...style,
      }}
    >
      {/* Title */}
      <div
        className="flex items-center justify-center"
        style={{ height: isMobile ? fsm(64) : fs(87) }}
      >
        <h1
          className="text-center font-bold font-cairo text-black line-clamp-2 h-fu"
          style={{ fontSize: isMobile ? fsm(16) : fs(25) }}
        >
          {title}
        </h1>
      </div>


      {/* Image */}
      <img
        src={"./src/shop.png"}
        alt={title}
        className="w-full object-cover border-t-2 border-b-2 border-l-0 border-r-0 border-black"
      />

      {/* Buttons + Stats */}
      <div className="flex flex-col md:flex-row justify-center items-center  md:justify-between" style={{ paddingLeft: isMobile ? fsm(14) : fs(19), paddingTop: isMobile ? fsm(10) : fs(12), paddingRight: isMobile ? fsm(14) : fs(19) }}>
        <button
          className="bg-[#ED4548] text-white rounded-full italic font-cairo text-center"
          style={{
            width: isMobile ? fsm(92) : fs(92),
            minWidth: isMobile ? fsm(72) : fs(72),
            height: isMobile ? fsm(22) : fs(22),
            minHeight: isMobile ? fsm(17) : fs(17),
            fontSize: isMobile ? fsm(12) : fs(12)
          }}
        >
          Shop
        </button>

        <div className="flex" style={{ marginTop: isMobile ? fsm(15) : fs(0), gap: isMobile ? fsm(16) : fs(16) }}>
          <span className="flex items-center" style={{ gap: isMobile ? fsm(5) : fs(5) }}>
            <img src="/src/love.svg" alt="Love" style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }} />
            <p className="font-bold font-cairo" style={{ fontSize: isMobile ? fsm(14) : fs(14), color: "#111827" }}>
              1000
            </p>
          </span>

          <span className="flex items-center" style={{ gap: isMobile ? fsm(5) : fs(5) }}>
            <img src="/src/eye.svg" alt="Views" style={{ width: isMobile ? fsm(20) : fs(20), height: isMobile ? fsm(20) : fs(20) }} />
            <p className="font-bold font-cairo" style={{ fontSize: isMobile ? fsm(14) : fs(14), color: "#111827" }}>
              1000
            </p>
          </span>

          <span className="flex items-center">
            <img src="/src/bookmark.svg" alt="Bookmark" style={{ width: isMobile ? fsm(17) : fs(17), height: isMobile ? fsm(21) : fs(21) }} />
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between" style={{ paddingBottom: isMobile ? fsm(10) : fs(16), marginTop:fs(29),height: fs(132)}}>
        {!isMobile && (<p
          className="font-medium text-[#313131] font-cairo text-start"
          style={{ fontSize: fs(16), paddingLeft: fs(38), paddingRight: fs(38), letterSpacing: 0 }}
        >
          {description}
        </p>)}
        <Link
          to={linkTo}
          className="italic font-bold font-cousine text-center md:text-end"
          style={{ marginTop: isMobile? fsm(15): fs(0), fontSize: isMobile ? fsm(16) : fs(16), color: "#000000", paddingRight: isMobile ? fsm(0) : fs(18) }}
        >
          more+
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;