import React from 'react';

const MarqueeHeader: React.FC = () => {
  return (
    <div className="border-t border-b border-black py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee text-lg font-bold">
        Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!
      </div>
    </div>
  );
};

export default MarqueeHeader;