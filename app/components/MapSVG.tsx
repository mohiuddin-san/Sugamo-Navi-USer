// app/components/MapSVG.tsx
import React, { useState, useEffect, useRef } from 'react';

interface MapProps {
  onPinClick: (title: string) => void;
  svgPath: string;
}

const MapSVG: React.FC<MapProps> = ({ onPinClick, svgPath }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // SVG ফাইল লোড করা
  useEffect(() => {
    fetch(svgPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((svgText) => {
        console.log('SVG লোড হয়েছে:', svgText.substring(0, 200));
        setSvgContent(svgText);
      })
      .catch((error) => {
        console.error('SVG লোড করতে সমস্যা:', error);
        // Fallback SVG
        setSvgContent(`
          <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="lightblue"/>
            <circle cx="100" cy="100" r="20" fill="red" class="pin" data-title="Test Location 1"/>
            <circle cx="200" cy="200" r="20" fill="red" class="pin" data-title="Test Location 2"/>
          </svg>
        `);
      });
  }, [svgPath]);

  // SVG-এর DOM-এ ইভেন্ট লিসেনার যোগ করা
  useEffect(() => {
    if (!svgContainerRef.current) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    // SVG-এর সব <path>, <rect>, <circle> এলিমেন্ট খুঁজে বের করা
    const paths = svgElement.querySelectorAll('path');
    const rects = svgElement.querySelectorAll('rect');
    const circles = svgElement.querySelectorAll('circle');

    // ডিবাগিং: সব পিন এলিমেন্ট লগ করা
    console.log('SVG-এর পাথ এলিমেন্ট সংখ্যা:', paths.length);
    console.log('SVG-এর রেক্ট এলিমেন্ট সংখ্যা:', rects.length);
    console.log('SVG-এর সার্কেল এলিমেন্ট সংখ্যা:', circles.length);
    console.log(
      'পাথ এলিমেন্টগুলোর ডাটা:',
      Array.from(paths).map((p) => ({
        d: p.getAttribute('d')?.substring(0, 20),
        dataTitle: p.getAttribute('data-title'),
      }))
    );

    const handleClick = (event: MouseEvent) => {
      const target = event.target as SVGElement;
      let title = 'Unknown Location';

      if (target.tagName === 'path' || target.tagName === 'rect' || target.tagName === 'circle') {
        // data-title থেকে টাইটেল নেওয়া
        title = target.getAttribute('data-title') || 'Location';
        console.log('পিন ক্লিক করা হয়েছে:', title);
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
    };
  }, [svgContent, onPinClick]);

  return (
    <div
      ref={svgContainerRef}
      className="relative w-full h-full"
      style={{ cursor: 'pointer' }}
    >
      {svgContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-200">
          <p>লোড হচ্ছে...</p>
        </div>
      )}
    </div>
  );
};

export default MapSVG;