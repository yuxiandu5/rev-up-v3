"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-4"
      aria-labelledby="hero-title"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-dark1)] via-[var(--bg-dark2)] to-[var(--bg-dark3)] opacity-50" />

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1
            id="hero-title"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-[var(--text1)]">Rev Up Your</span>
            <br />
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] bg-clip-text text-transparent">
              Dream Machine
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-[var(--text2)] mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your car with precision modifications. Explore performance upgrades, calculate
            real-world specs, and build your ultimate ride.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link
            href="/mod"
            className="
              bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] 
              hover:from-[var(--accent)] hover:to-[var(--primary)]
              text-white font-semibold text-lg px-8 py-4 rounded-xl
              transition-all duration-300 transform hover:scale-105 hover:shadow-xl
              focus:outline-none
              inline-flex items-center gap-2 min-w-[200px] justify-center
            "
            aria-label="Start modifying your car"
          >
            Start Modifying
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            href="/profile"
            className="
              border-2 border-[var(--text2)] text-[var(--text1)] 
              hover:border-[var(--text1)] hover:bg-[var(--bg-dark3)]
              font-semibold text-lg px-8 py-4 rounded-xl
              transition-all duration-300 transform hover:scale-105
              focus:outline-none
              inline-flex items-center gap-2 min-w-[200px] justify-center
            "
            aria-label="View your profile"
          >
            My Profile
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Featured car image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="relative">
            <Image
              src="/car-sketch/porsche-gt3-rs-2021.png"
              alt="Featured Porsche GT3 RS showcasing performance modifications"
              width={800}
              height={400}
              className="w-full h-auto object-contain filter drop-shadow-2xl"
              priority
            />
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--highlight)]/20 blur-3xl -z-10" />
          </div>

          {/* Floating stats */}
          <div className="absolute top-1/4 left-[-100px] transform -translate-y-1/2 -translate-x-4 hidden lg:block animate-orbit-reverse">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="bg-[var(--bg-dark1)]/80 backdrop-blur-md rounded-lg p-4 border border-[var(--bg-dark3)]"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary)]">520</div>
                <div className="text-sm text-[var(--text2)]">Horsepower</div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-1/8 right-[-200px] transform -translate-y-1/2 translate-x-4 hidden lg:block animate-orbit">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="bg-[var(--bg-dark1)]/80 backdrop-blur-md rounded-lg p-4 border border-[var(--bg-dark3)]"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--highlight)]">3.2s</div>
                <div className="text-sm text-[var(--text2)]">0-100 km/h</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-[var(--text2)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
