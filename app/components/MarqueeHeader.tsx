// app/components/MarqueeHeader.tsx
import React from "react";
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import { useIsMobile } from '../hooks/useIsMobile';
import { useTranslation } from "react-i18next";

interface MarqueeHeaderProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  animationDuration?: string;
  marginBottom?: number;
  marginTop?: number;
}

const MarqueeHeader: React.FC<MarqueeHeaderProps> = ({
  text,
  backgroundColor = "transparent",
  textColor = "black",
  animationDuration = "20s",
  marginBottom = 0,
  marginTop = 0,
}) => {
  const { fs, fsm, fluidStyle, fluidClass } = useUniversalFluid();
  const { isMobile } = useIsMobile();
  const { t } = useTranslation();

  // ১. fallback সরাসরি string হিসেবে দাও
  const fallback = "FOLLOW US AND SEE MORE!";

  // ২. t(text) শুধু string হলে
  const translated = typeof text === "string" ? t(text) : null;

  // ৩. কোনোটাই না থাকলে fallback
  const displayText = translated ?? fallback;

  // ৪. toUpperCase শুধু string হলে
  const safeText = typeof displayText === "string" ? displayText.toUpperCase() : fallback.toUpperCase();

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
          marginBottom: fs(marginBottom),
          marginTop: fs(marginTop),
        }),
        backgroundColor,
      }}
    >
      <div
        className="inline-block animate-marquee font-bold font-cousine italic"
        style={{
          fontSize: isMobile ? fsm(25) : fs(25),
          color: textColor,
          animationDuration,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {safeText.repeat(4)}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default MarqueeHeader;