import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DeviceContextType = {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  mounted: boolean;
};

const DeviceContext = createContext<DeviceContextType>({
  width: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  mounted: false,
});

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
    setWidth(window.innerWidth);

    const handleResize = () => {
      clearTimeout((window as any).resizeTimeout);
      (window as any).resizeTimeout = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout((window as any).resizeTimeout);
    };
  }, []);

  const isMobile = mounted && width < 768;
  const isTablet = mounted && width >= 768 && width < 1024;
  const isDesktop = mounted && width >= 1024;

  return (
    <DeviceContext.Provider 
      value={{ width, isMobile, isTablet, isDesktop, mounted }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);