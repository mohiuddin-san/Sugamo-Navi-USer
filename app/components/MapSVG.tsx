import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface MapProps {
  onPinClick: (title: string) => void;
  svgPath: string;
}

const MapSVG: React.FC<MapProps> = ({ onPinClick, svgPath }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [containerSize, setContainerSize] = useState({ width: "100%", height: 600 });
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
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

  // Load SVG file
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

  // Calculate and set container dimensions
  const calculateContainerSize = () => {
    if (!svgContainerRef.current) return;

    const wrapper = svgContainerRef.current.closest('.react-transform-wrapper');
    if (!wrapper) return;

    const parent = wrapper.parentElement;
    if (!parent) return;

    // Use the full available width
    const availableWidth = parent.clientWidth;
    const availableHeight = window.innerHeight * 0.8; // 80% of viewport height

    // Calculate height based on SVG aspect ratio (800x600 = 4:3)
    const aspectRatio = 0.4;
    let calculatedWidth = availableWidth;
    let calculatedHeight = availableWidth * aspectRatio;

    // If calculated height is more than available height, adjust
    if (calculatedHeight > availableHeight) {
      calculatedHeight = availableHeight;
      calculatedWidth = availableHeight / aspectRatio;
    }

    setContainerSize({
      width: calculatedWidth,
      height: calculatedHeight
    });

    // Reset transform after resize
    setTimeout(() => {
      if (transformRef.current) {
        transformRef.current.resetTransform();
        transformRef.current.centerView();
      }
    }, 100);
  };
  useEffect(() => {
    if (!svgContainerRef.current) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;
    const paths = svgElement.querySelectorAll('path');
    const rects = svgElement.querySelectorAll('rect');
    const circles = svgElement.querySelectorAll('circle');
    const texts = svgElement.querySelectorAll('text');

    const handleClick = (event: MouseEvent) => {
      const target = event.target as SVGElement;
      let title = 'Unknown Location';

      if (
        target.tagName === 'path' ||
        target.tagName === 'rect' ||
        target.tagName === 'circle' ||
        target.tagName === 'text'
      ) {
        title = target.getAttribute('data-title') || target.textContent || 'Location';
        console.log('ক্লিক করা এলিমেন্ট:', title);
        onPinClick(title);
      }
    };

    paths.forEach((path) => {
      path.addEventListener('click', handleClick);
    });
    rects.forEach((rect) => {
      rect.addEventListener('click', handleClick);
    });
    circles.forEach((circle) => {
      circle.addEventListener('click', handleClick);
    });
    texts.forEach((text) => {
      text.addEventListener('click', handleClick);
    });

    // ক্লিনআপ
    return () => {
      paths.forEach((path) => {
        path.removeEventListener('click', handleClick);
      });
      rects.forEach((rect) => {
        rect.removeEventListener('click', handleClick);
      });
      circles.forEach((circle) => {
        circle.removeEventListener('click', handleClick);
      });
      texts.forEach((text) => {
        text.removeEventListener('click', handleClick);
      });
    };
  }, [svgContent, onPinClick]);
  useEffect(() => {
    if (svgContent) {
      calculateContainerSize();
    }

    const handleResize = () => {
      calculateContainerSize();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [svgContent]);

  // Combined click handler for all SVG elements
  useEffect(() => {
    if (!svgContainerRef.current || !svgContent) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    const handleSvgClick = (event: MouseEvent) => {
      const target = event.target as SVGElement;
      
      // Check if clicked element is a pin or has data-title
      const pinElement = target.closest('.pin') || 
                        target.closest('[data-title]') || 
                        (target.hasAttribute('data-title') ? target : null);

      if (pinElement) {
        event.stopPropagation();
        const title = pinElement.getAttribute('data-title') || 
                     (pinElement.textContent || 'Unknown Location').trim();
        
        console.log('ক্লিক করা এলিমেন্ট:', title);

        // Animation effect
        if (pinElement instanceof SVGElement) {
          pinElement.animate(
            [
              { transform: 'scale(1)' },
              { transform: 'scale(1.2)' },
              { transform: 'scale(1)' },
            ],
            {
              duration: 300,
              iterations: 1,
            }
          );
        }

        onPinClick(title);
      }
    };

    svgElement.addEventListener('click', handleSvgClick);

    return () => {
      svgElement.removeEventListener('click', handleSvgClick);
    };
  }, [svgContent, onPinClick]);

  return (
    <div className="relative w-full border-2 border-black bg-white" >
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        initialPositionX={0}
        initialPositionY={0}
        centerOnInit={true}
        centerZoomedOut={true}
        wheel={{ step: 0.1 }}
        panning={{
          disabled: false,
          velocityDisabled: true,
          allowLeftClickPan: true,
          allowMiddleClickPan: false,
          allowRightClickPan: false,
        }}
        doubleClick={{ disabled: true }}
        pinch={{ disabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => (
          <>
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => zoomIn()}
                className="bg-blue-500 text-white w-10 h-10 rounded-full hover:bg-blue-600 flex items-center justify-center shadow-lg"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="bg-blue-500 text-white w-10 h-10 rounded-full hover:bg-blue-600 flex items-center justify-center shadow-lg"
              >
                –
              </button>
              <button
                onClick={() => {
                  resetTransform();
                  setTimeout(() => centerView(), 100);
                }}
                className="bg-green-500 text-white w-10 h-10 rounded-full hover:bg-green-600 flex items-center justify-center text-xs shadow-lg"
                title="Reset View"
              >
                ↻
              </button>
            </div>
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
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
                style={{ 
                  width: `${containerSize.width}px`,
                  height: `${containerSize.height}px`,
                  cursor: 'grab'
                }}
                className="flex items-center justify-center"
              >
                {svgContent ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    <p>Loading SVG...</p>
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