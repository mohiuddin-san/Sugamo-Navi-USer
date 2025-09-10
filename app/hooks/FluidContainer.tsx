import React, { useState, useEffect } from 'react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';

interface FluidContainerProps {
  mobileStyles: {
    w?: string;
    h?: string;
    p?: string;
    m?: string;
    fontSize?: string;
  };
  desktopStyles: {
    w?: string;
    h?: string;
    p?: string;
    m?: string;
    fontSize?: string;
  };
  children: React.ReactNode;
}

const FluidContainer: React.FC<FluidContainerProps> = ({
  mobileStyles,
  desktopStyles,
  children,
}) => {
  const { fluidStyle } = useUniversalFluid();
  // Initialize isDesktop as false for SSR to avoid window usage
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const styles = isDesktop
    ? fluidStyle({
        w: desktopStyles.w || '100%',
        h: desktopStyles.h || 'auto',
        p: desktopStyles.p || '0',
        m: desktopStyles.m || '0',
        fontSize: desktopStyles.fontSize || '16px',
      })
    : fluidStyle({
        w: mobileStyles.w || '100%',
        h: mobileStyles.h || 'auto',
        p: mobileStyles.p || '0',
        m: mobileStyles.m || '0',
        fontSize: mobileStyles.fontSize || '16px',
      });

  return (
    <div
      style={{
        ...styles,
        backgroundColor: '#e5e7eb', // Equivalent to Tailwind bg-gray-200
        borderRadius: '0.5rem', // Equivalent to Tailwind rounded-lg
        overflow: 'auto',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          wordBreak: 'break-word',
          maxWidth: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FluidContainer;