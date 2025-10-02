import React from "react";
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import { useDevice } from "~/routes/contexts/DeviceContext";

interface MarqueeHeaderProps {
  text: string; // Dynamic text prop
  backgroundColor?: string; // Optional background color prop
  textColor?: string; // Optional text color prop
  animationDuration?: string;
  marginTopClass?: string;   // Tailwind margin-top class
  marginBottomClass?: string; // Tailwind margin-bottom class
}

const MarqueeHeader: React.FC<MarqueeHeaderProps> = ({
  text,
  backgroundColor = "transparent",
  textColor = "black",
  animationDuration = "20s",
  marginTopClass = "mt-0",
  marginBottomClass = "mb-0",
}) => {
  const { fsm, fluidStyle, fluidClass } = useUniversalFluid();
  const isMobile = useDevice();

  return (
    <div
      className={`w-full border-t-2 border-b-2 border-black overflow-hidden whitespace-nowrap ${marginTopClass} ${marginBottomClass} `}
      style={{
        ...fluidStyle({
          paddingTop: 8,
          paddingBottom: 8,
        }),
        backgroundColor,
      }}
    >
      <div
        className={`inline-block animate-marquee font-bold font-cousine italic`}
        style={{
          fontSize: isMobile ? fsm(25) : 25, // mobile হলে fsm, না হলে fixed 25px
          color: textColor,
          animationDuration,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {text.repeat(4)}
      </div>
    </div>
  );
};

export default MarqueeHeader;
