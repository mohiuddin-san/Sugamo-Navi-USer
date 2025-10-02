import { createContext, useContext, useState, useEffect } from "react";

const DeviceContext = createContext({
  width: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: false,
});

export const DeviceProvider = ({ children }) => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => setWidth(window.innerWidth), 150);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <DeviceContext.Provider value={{ width, isMobile, isTablet, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
