import React from "react";
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import { useDevice } from "~/routes/contexts/DeviceContext";
interface MarqueeHeaderProps {
  text: string; // Dynamic text prop
  backgroundColor?: string; // Optional background color prop
  textColor?: string; // Optional text color prop
  animationDuration?: string;
  marginBottom?: number; // Optional dynamic margin bottom
  marginTop?: number; // Optional dynamic margin top
}

const MarqueeHeader: React.FC<MarqueeHeaderProps> = ({
  text,
  backgroundColor = "transparent", // Default to transparent
  textColor = "black", // Default to black
  animationDuration = "20s", // Default animation duration
  marginBottom = 0, 
  marginTop = 0, 
}) => {
  const { fs,fsm, fluidStyle, fluidClass } = useUniversalFluid();
  const isMobile =  useDevice();

  return (
    <div
      className={`w-full border-t-2 border-b-2 border-black overflow-hidden whitespace-nowrap ${fluidClass({
        paddingBottom: 1,
        marginBottom: marginBottom,
        marginTop: fs(marginTop),
      })}`}
      style={{
        ...fluidStyle({
          paddingTop: 8,
          paddingBottom: 8,
          marginBottom: fs(marginBottom), // Dynamic fluid margin bottom
          marginTop: fs(marginTop), // Dynamic fluid margin top
        }),
        backgroundColor, // Apply dynamic background color
      }}
    >
      <div
        className={`inline-block animate-marquee font-bold font-cousine italic`}
        style={{
          fontSize: isMobile? fsm(25):fs(25),
          color: textColor, // Apply dynamic text color
          animationDuration, // Apply dynamic animation duration
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {text.repeat(4)} {/* Repeat text 5 times for marquee effect */}
      </div>
    </div>
  );
};

export default MarqueeHeader;