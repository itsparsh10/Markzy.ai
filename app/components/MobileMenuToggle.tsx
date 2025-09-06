'use client';

import React from 'react';

interface MobileMenuToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenuToggle({ isOpen, setIsOpen }: MobileMenuToggleProps) {
  return (
    <button 
      className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
    >
      <span className="sr-only">Toggle mobile menu</span>
      {isOpen ? (
        <i className="fas fa-times text-lg"></i>
      ) : (
        <i className="fas fa-bars text-lg"></i>
      )}
    </button>
  );
}
