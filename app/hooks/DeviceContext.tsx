import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DeviceContextType = {
  width: number;
  isMobile: boolean;
  mounted: boolean;
};

const DeviceContext = createContext<DeviceContextType>({
  width: 0,
  isMobile: false,
  mounted: false,
});

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    console.log('useEffect running!'); // Debug log
    const currentWidth = window.innerWidth;
    console.log('Setting width to:', currentWidth); // Debug log
    
    setWidth(currentWidth);
    setMounted(true);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      console.log('Resizing to:', newWidth); // Debug log
      setWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width > 0 && width < 768;
  
  console.log('Provider rendering - width:', width, 'isMobile:', isMobile); // Debug log

  return (
    <DeviceContext.Provider 
      value={{ width, isMobile, mounted }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);