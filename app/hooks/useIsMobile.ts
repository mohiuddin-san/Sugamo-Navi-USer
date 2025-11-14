// hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => {
      // window.innerWidth এখন সঠিক device width দেবে (viewport থাকলে)
      setIsMobile(window.innerWidth < 768);
    };

    // প্রথমবার চেক
    check();
    setMounted(true);

    // Resize এ চেক
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { isMobile, mounted };
}