"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="
      flex justify-between items-center px-4 py-3 md:px-6 lg:px-8
      bg-[var(--bg-dark1)] border-b border-[var(--bg-dark3)]
      fixed top-0 left-0 right-0 z-50 shadow-xl backdrop-blur-sm
    ">
      {/* Logo */}
      <div className="flex items-center">
        <Image 
          src="/logo/logo.png" 
          alt="Logo" 
          width={60} 
          height={60} 
          className="w-12 h-12 md:w-16 md:h-16 object-contain"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
        <Link 
          href="/" 
          className="
            text-[var(--text1)] font-medium transition-all duration-200
            hover:text-blue-400 hover:scale-105 active:scale-95
            px-3 py-2 rounded-md hover:bg-[var(--bg-dark2)]
          "
        >
          Home
        </Link>
        <Link 
          href="/profile" 
          className="
            text-[var(--text1)] font-medium transition-all duration-200
            hover:text-blue-400 hover:scale-105 active:scale-95
            px-3 py-2 rounded-md hover:bg-[var(--bg-dark2)]
          "
        >
          Profile
        </Link>
        <Link 
          href="/mod" 
          className="
            text-[var(--text1)] font-medium transition-all duration-200
            hover:text-blue-400 hover:scale-105 active:scale-95
            px-3 py-2 rounded-md hover:bg-[var(--bg-dark2)]
          "
        >
          Mod
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button 
          className="
            p-2 rounded-md text-[var(--text1)] hover:bg-[var(--bg-dark2)]
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          aria-label="Toggle mobile menu"
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="
          absolute top-full left-0 right-0 md:hidden
          bg-[var(--bg-dark1)] border-b border-[var(--bg-dark3)]
          shadow-xl backdrop-blur-sm
        ">
          <div className="flex flex-col space-y-1 p-4">
            <Link 
              href="/" 
              className="
                text-[var(--text1)] font-medium transition-all duration-200
                hover:text-blue-400 hover:bg-[var(--bg-dark2)]
                px-4 py-3 rounded-md block text-center
              "
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/profile" 
              className="
                text-[var(--text1)] font-medium transition-all duration-200
                hover:text-blue-400 hover:bg-[var(--bg-dark2)]
                px-4 py-3 rounded-md block text-center
              "
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link 
              href="/mod" 
              className="
                text-[var(--text1)] font-medium transition-all duration-200
                hover:text-blue-400 hover:bg-[var(--bg-dark2)]
                px-4 py-3 rounded-md block text-center
              "
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mod
            </Link>
          </div>
        </div>
      )}
      
    </nav>
  );
}