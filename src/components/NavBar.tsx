"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { LogOut } from "lucide-react";

export default function NavBar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuthStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };
  return (
    <nav className="
      flex justify-between items-center px-4 py-0 md:px-6 lg:px-8 lg:py-3
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

      {/* Desktop Center Navigation */}
      <div className="hidden md:flex items-center space-x-8 lg:space-x-12 flex-1 justify-center">
        <Link 
          href="/" 
          className="
            text-[var(--text1)] font-medium transition-all duration-200
            hover:text-[var(--highlight)] hover:scale-105 active:scale-95
            px-3 py-2 rounded-md hover:bg-[var(--bg-dark2)]
          "
        >
          Home
        </Link>
        <Link 
          href="/profile" 
          className="
            text-[var(--text1)] font-medium transition-all duration-200
            hover:text-[var(--highlight)] hover:scale-105 active:scale-95
            px-3 py-2 rounded-md hover:bg-[var(--bg-dark2)]
          "
        >
          Profile
        </Link>
        <Link 
          href="/mod" 
          className="
            text-[var(--text1)] font-medium transition-all duration-200
            hover:text-[var(--highlight)] hover:scale-105 active:scale-95
            px-3 py-2 rounded-md hover:bg-[var(--bg-dark2)]
          "
        >
          Mod
        </Link>
      </div>

      {/* Desktop Auth Links */}
      <div className="hidden md:flex items-center space-x-4">
        {isLoading ? (
          // Loading state
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        ) : user ? (
          // Authenticated user
          <div className="flex items-center space-x-3">
            <Link 
              href="/profile"
              className="
                w-8 h-8 bg-blue-500 rounded-full transition-all duration-200
                hover:bg-blue-600 hover:scale-105 active:scale-95
                flex items-center justify-center cursor-pointer
              "
              title={`Profile - ${user.userName}`}
            >
              <span className="text-white text-sm font-medium">
                {user.userName.charAt(0).toUpperCase()}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="
                p-2 text-[var(--text1)] hover:text-red-500 transition-all duration-200
                hover:bg-[var(--bg-dark2)] rounded-md hover:scale-105 active:scale-95
                cursor-pointer
              "
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          // Guest user
          <>
            <Link 
              href="/login" 
              className="
                text-[var(--text1)] font-medium transition-all duration-200
                hover:text-[var(--highlight)] hover:scale-105 active:scale-95
                px-4 py-2 rounded-md hover:bg-[var(--bg-dark2)]
                cursor-pointer
              "
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="
                bg-[var(--accent)] text-white font-medium transition-all duration-200
                hover:bg-[var(--highlight)] hover:scale-105 active:scale-95
                px-4 py-2 rounded-md
                cursor-pointer
              "
            >
              Sign Up
            </Link>
          </>
        )}
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
                hover:text-[var(--highlight)] hover:bg-[var(--bg-dark2)]
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
                hover:text-[var(--highlight)] hover:bg-[var(--bg-dark2)]
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
                hover:text-[var(--highlight)] hover:bg-[var(--bg-dark2)]
                px-4 py-3 rounded-md block text-center
              "
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mod
            </Link>
            
            {/* Mobile Auth Links */}
            <div className="border-t border-[var(--bg-dark3)] pt-4 mt-4 space-y-1">
              {isLoading ? (
                // Loading state
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              ) : user ? (
                // Authenticated user
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-3 px-4 py-2">
                    <Link 
                      href="/profile"
                      className="
                        w-10 h-10 bg-blue-500 rounded-full transition-all duration-200
                        hover:bg-blue-600 flex items-center justify-center
                      "
                      onClick={() => setIsMobileMenuOpen(false)}
                      title={`Profile - ${user.userName}`}
                    >
                      <span className="text-white font-medium">
                        {user.userName.charAt(0).toUpperCase()}
                      </span>
                    </Link>
                    <span className="text-[var(--text1)] text-sm">{user.userName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="
                      w-full flex items-center justify-center space-x-2
                      text-red-500 font-medium transition-all duration-200
                      hover:bg-[var(--bg-dark2)] px-4 py-3 rounded-md
                    "
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                // Guest user
                <>
                  <Link 
                    href="/login" 
                    className="
                      text-[var(--text1)] font-medium transition-all duration-200
                      hover:text-[var(--highlight)] hover:bg-[var(--bg-dark2)]
                      px-4 py-3 rounded-md block text-center
                    "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="
                      bg-[var(--accent)] text-white font-medium transition-all duration-200
                      hover:bg-[var(--highlight)]
                      px-4 py-3 rounded-md block text-center
                    "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
    </nav>
  );
}