import React from 'react';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="text-xl font-bold">SUGAMO NAVI</div>
      <div className="flex space-x-6">
        <span className="text-sm hover:text-blue-600 cursor-pointer">食べろ</span>
        <span className="text-sm hover:text-blue-600 cursor-pointer">観る・遊ぶ</span>
        <span className="text-sm hover:text-blue-600 cursor-pointer">モデルコース</span>
        <span className="text-sm hover:text-blue-600 cursor-pointer">旅の情報</span>
        <span className="text-sm hover:text-blue-600 cursor-pointer">おすすめの店</span>
      </div>
      <div className="flex space-x-4 items-center">
        <button className="px-2 py-1">
          <img src="/src/search.svg" alt="Search Icon" className="h-6 w-6" />
        </button>
        <input
          type="text"
          placeholder="Search"
          className="px-2 py-1 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="px-2 py-1">
          <img src="/src/bookmark.svg" alt="Bookmark Icon" className="h-5 w-5" />
        </button>
        <button className="px-2 py-1">
          <img src="/src/love.svg" alt="Love Icon" className="h-6 w-6" />
        </button>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Header;