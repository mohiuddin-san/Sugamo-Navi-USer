import { useState } from 'react';

export function useMenuToggle() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return { isMenuOpen, toggleMenu };
}