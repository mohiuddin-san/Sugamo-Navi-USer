import React from "react";
import { ResponsiveGrid, GridItem } from "../ResponsiveGrid";
import { useMediaQuery } from "react-responsive";
import { useUniversalFluid } from "../../hooks/useUniversalFluid";

const ShimmerLayout: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { fs, fsm } = useUniversalFluid();

  const shimmerStyle = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  const shimmerAnimation = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  return (
    <div>
      <style>{shimmerAnimation}</style>
      <ResponsiveGrid
        columns={isMobile ? "1fr" : "1fr 1fr"}
        rows="auto"
        isMobile={isMobile}
        className="flex justify-center mx-10 md:mx-[10%]"
        style={{ gap: isMobile ? fsm(64) : fs(133), maxWidth: "100%", width: "100%" }}
      >
        {[...Array(isMobile ? 4 : 6)].map((_, index) => (
          <GridItem
            key={index}
            column={isMobile ? 1 : (index % 2) + 1}
            row={isMobile ? index + 1 : Math.floor(index / 2) + 1}
            columnSpan={1}
            rowSpan={1}
            style={{
              height: isMobile ? "100%" : fs(570),
              padding: isMobile ? fsm(20) : fs(20),
              border: "2px solid #000",
              borderRadius: isMobile ? fsm(10) : fs(10),
              backgroundColor: "#fff",
              maxWidth: "100%", // Ensure width doesn't exceed container
              width: "100%", // Full width within GridItem
            }}
            className="w-full rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-2">
              <div
                style={{
                  ...shimmerStyle,
                  width: isMobile ? fsm(150) : fs(150),
                  height: isMobile ? fsm(20) : fs(20),
                  borderRadius: isMobile ? fsm(4) : fs(4),
                }}
              />
              <div
                style={{
                  ...shimmerStyle,
                  width: isMobile ? fsm(20) : fs(20),
                  height: isMobile ? fsm(20) : fs(20),
                  borderRadius: "50%",
                }}
              />
            </div>

            <div
              style={{
                ...shimmerStyle,
                marginTop: isMobile ? fsm(16) : fs(16),
                width: "100%",
                height: isMobile ? fsm(225) : fs(225),
                borderRadius: isMobile ? fsm(4) : fs(4),
              }}
            />

            <div style={{ marginTop: isMobile ? fsm(16) : fs(16) }}>
              <div
                style={{
                  ...shimmerStyle,
                  width: "80%",
                  height: isMobile ? fsm(30) : fs(30),
                  marginTop: isMobile ? fsm(10) : fs(10),
                  marginBottom: isMobile ? fsm(15) : fs(15),
                  borderRadius: isMobile ? fsm(4) : fs(4),
                }}
              />
              <div
                style={{
                  ...shimmerStyle,
                  width: "100%",
                  height: isMobile ? fsm(137) : fs(137),
                  marginBottom: isMobile ? fsm(15) : fs(15),
                  borderRadius: isMobile ? fsm(4) : fs(4),
                }}
              />
              <div
                style={{
                  ...shimmerStyle,
                  width: isMobile ? fsm(80) : fs(80),
                  height: isMobile ? fsm(25) : fs(25),
                  marginTop: isMobile ? fsm(30) : fs(30),
                  borderRadius: isMobile ? fsm(4) : fs(4),
                }}
                className="ml-auto"
              />
            </div>
          </GridItem>
        ))}
      </ResponsiveGrid>
    </div>
  );
};

export default ShimmerLayout;