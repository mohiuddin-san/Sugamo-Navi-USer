// ~/routes/contexts/DeviceContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface DeviceContextType {
  isMobile: boolean;
  isClient: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isClient: false,
});

export default function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // তোমার কোডে 480px
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile, isClient }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}