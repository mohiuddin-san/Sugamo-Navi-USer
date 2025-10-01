import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface MapProps {
  onPinClick: (title: string) => void;
  svgPath: string;
}

const MapSVG: React.FC<MapProps> = ({ onPinClick, svgPath }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.04;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);
  
  useEffect(() => {
    fetch(svgPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((svgText) => {
        console.log('SVG loaded:', svgText.substring(0, 200));
        const modifiedSvg = svgText.replace(
          /<svg([^>]*)>/,
          `<svg$1 viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">`
        );
        setSvgContent(modifiedSvg);
      })
      .catch((error) => {
        console.error('Error loading SVG:', error);
        setSvgContent(`
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="gray"/>
            <path d="M100 300 L400 300" stroke="red" stroke-width="10" fill="none"/>
            <g class="pin" data-title="マルジ">
              <circle cx="250" cy="300" r="15" fill="white" stroke="black"/>
              <text x="250" y="305" text-anchor="middle" font-size="12" fill="black">マルジ</text>
            </g>
            <text x="50" y="50" font-size="20" fill="black">come to Sugamo! Pick your fav</text>
            <text x="50" y="550" font-size="20" fill="black">our faves! Welcome to Sugamo!</text>
          </svg>
        `);
      });
  }, [svgPath]);

  // Adjust container size based on SVG aspect ratio
  const adjustContainer = () => {
    if (!svgContainerRef.current || !svgContent) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    const wrapper = svgContainerRef.current.parentElement?.parentElement;
    if (!wrapper) return;

    let svgWidth = 800;
    let svgHeight = 600;
    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox) {
      const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
      svgWidth = vbWidth;
      svgHeight = vbHeight;
    }

    if (svgWidth === 0 || svgHeight === 0) {
      console.warn('SVG dimensions could not be determined');
      return;
    }

    const aspectRatio = svgHeight / svgWidth;
    const containerWidth = wrapper.clientWidth;
    const containerHeight = containerWidth * aspectRatio;
    wrapper.style.height = `${containerHeight}px`;
    if (transformRef.current) {
      transformRef.current.resetTransform(0);
    }
  };

  useEffect(() => {
    if (svgContent) {
      adjustContainer();
    }

    const handleResize = () => {
      adjustContainer();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [svgContent]);
  useEffect(() => {
    if (!svgContainerRef.current) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    const pins = svgElement.querySelectorAll('.pin');

    const handleClick = (event: MouseEvent) => {
      const target = event.target as SVGElement;
      const title = target.getAttribute('data-title') || 'Unknown Location';
      console.log('Clicked pin:', title);
      target.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.5)' },
          { transform: 'scale(1)' },
        ],
        {
          duration: 300,
          iterations: 1,
        }
      );

      onPinClick(title);
    };

    pins.forEach((pin) => {
      pin.addEventListener('click', handleClick);
    });

    return () => {
      pins.forEach((pin) => {
        pin.removeEventListener('click', handleClick);
      });
    };
  }, [svgContent, onPinClick]);

  return (
    <div className="relative w-full border-2 border-black bg-white">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={1}
        maxScale={3}
        centerOnInit={true}
        centerZoomedOut={true}
        wheel={{ step: 0.1 }}
        panning={{
          disabled: false,
          velocityDisabled: false,
          allowLeftClickPan: true,
          allowMiddleClickPan: true,
          allowRightClickPan: true,
        }}
        doubleClick={{ disabled: true }}
        pinch={{ disabled: false }}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => zoomIn()}
                className="bg-blue-500 text-white w-10 h-10 rounded-full hover:bg-blue-600"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="bg-blue-500 text-white w-10 h-10 rounded-full hover:bg-blue-600"
              >
                –
              </button>
            </div>
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                overflow: 'auto',
              }}
              contentStyle={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                ref={svgContainerRef}
                className="w-full h-full"
                style={{ cursor: 'grab' }}
              >
                {svgContent ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    <p>Loading...</p>
                  </div>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default MapSVG;