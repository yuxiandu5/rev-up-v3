"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-[var(--bg-dark1)] border-t border-[var(--bg-dark3)] py-12 px-4"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/logo/logo.png"
                alt="Rev Up logo"
                width={60}
                height={60}
                className="w-16 h-16 object-contain mr-3"
              />
              <span className="text-2xl font-bold text-[var(--text1)]">Rev Up</span>
            </div>
            <p className="text-[var(--text2)] leading-relaxed mb-6 max-w-md">
              Transform your car with precision modifications. The ultimate platform for performance
              enthusiasts to plan, calculate, and track their builds.
            </p>
            <div className="flex gap-4">
              {/* Social links (placeholder) */}
              <a
                href="#"
                className="
                  w-10 h-10 rounded-full bg-[var(--bg-dark3)] hover:bg-blue-500/20 
                  flex items-center justify-center text-[var(--text2)] hover:text-blue-400
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                "
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="
                  w-10 h-10 rounded-full bg-[var(--bg-dark3)] hover:bg-blue-500/20 
                  flex items-center justify-center text-[var(--text2)] hover:text-blue-400
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                "
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.243 14.814 3.752 13.662 3.752 12.365s.49-2.449 1.369-3.328c.88-.88 2.031-1.297 3.328-1.297s2.449.417 3.328 1.297c.88.88 1.297 2.031 1.297 3.328s-.417 2.449-1.297 3.328c-.879.807-2.031 1.297-3.328 1.297zm7.718 0c-1.297 0-2.449-.49-3.328-1.297-.88-.88-1.297-2.031-1.297-3.328s.417-2.449 1.297-3.328c.88-.88 2.031-1.297 3.328-1.297s2.449.417 3.328 1.297c.88.88 1.297 2.031 1.297 3.328s-.417 2.449-1.297 3.328c-.879.807-2.031 1.297-3.328 1.297z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="
                  w-10 h-10 rounded-full bg-[var(--bg-dark3)] hover:bg-blue-500/20 
                  flex items-center justify-center text-[var(--text2)] hover:text-blue-400
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                "
                aria-label="Join our Discord community"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text1)] mb-4">Navigation</h3>
            <nav>
              <ul className="space-y-3" role="list">
                <li>
                  <Link
                    href="/"
                    className="
                      text-[var(--text2)] hover:text-[var(--text1)] 
                      transition-colors duration-200 block
                    "
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mod"
                    className="
                      text-[var(--text2)] hover:text-[var(--text1)] 
                      transition-colors duration-200 block
                    "
                  >
                    Modifications
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="
                      text-[var(--text2)] hover:text-[var(--text1)] 
                      transition-colors duration-200 block
                    "
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text1)] mb-4">Support</h3>
            <ul className="space-y-3" role="list">
              <li>
                <a
                  href="#"
                  className="
                    text-[var(--text2)] hover:text-[var(--text1)] 
                    transition-colors duration-200 block
                  "
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-[var(--text2)] hover:text-[var(--text1)] 
                    transition-colors duration-200 block
                  "
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-[var(--text2)] hover:text-[var(--text1)] 
                    transition-colors duration-200 block
                  "
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-[var(--text2)] hover:text-[var(--text1)] 
                    transition-colors duration-200 block
                  "
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div
          className="
          border-t border-[var(--bg-dark3)] pt-8
          flex flex-col md:flex-row justify-between items-center gap-4
        "
        >
          <p className="text-[var(--text2)] text-sm">© 2025 RevUp · Built by Yushi Du</p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="
                text-[var(--text2)] hover:text-[var(--text1)] 
                transition-colors duration-200
              "
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="
                text-[var(--text2)] hover:text-[var(--text1)] 
                transition-colors duration-200
              "
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="
                text-[var(--text2)] hover:text-[var(--text1)] 
                transition-colors duration-200
              "
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
