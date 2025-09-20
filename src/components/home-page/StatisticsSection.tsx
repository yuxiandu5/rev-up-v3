"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatisticProps {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ end, label, suffix = "", prefix = "", duration = 2 }: StatisticProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const increment = end / (duration * 60); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      }}
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={() => setIsVisible(true)}
      className="text-center group"
    >
      <div
        className="
        bg-[var(--bg-dark3)]/30 backdrop-blur-sm rounded-2xl p-8
        border border-[var(--bg-dark3)] transition-all duration-300
        hover:bg-[var(--bg-dark3)]/50 hover:border-[var(--primary)]/30
        hover:shadow-xl hover:shadow-[var(--primary)]/10
        group-hover:transform group-hover:scale-105
      "
      >
        <div
          className="
          text-4xl md:text-5xl lg:text-6xl font-bold mb-4
          bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] bg-clip-text text-transparent
        "
        >
          {prefix}
          {count.toLocaleString()}
          {suffix}
        </div>
        <div className="text-lg md:text-xl text-[var(--text1)] font-semibold">{label}</div>
      </div>
    </motion.div>
  );
}

const statistics = [
  {
    end: 25,
    label: "Car Models Supported",
    suffix: "+",
    duration: 2.5,
  },
  {
    end: 150,
    label: "Performance Modifications",
    suffix: "+",
    duration: 2.8,
  },
  {
    end: 6,
    label: "Modification Categories",
    duration: 1.5,
  },
  {
    end: 99,
    label: "Calculation Accuracy",
    suffix: "%",
    duration: 2.2,
  },
];

export default function StatisticsSection() {
  return (
    <section
      className="py-20 px-4 bg-gradient-to-b from-[var(--bg-dark2)] to-[var(--bg-dark1)]"
      aria-labelledby="statistics-title"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            id="statistics-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--text1)]"
          >
            Built for
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] bg-clip-text text-transparent block">
              Performance Enthusiasts
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text2)] max-w-3xl mx-auto leading-relaxed">
            Our platform combines extensive automotive knowledge with precise calculations to
            deliver the most accurate modification planning experience available.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {statistics.map((stat, index) => (
            <AnimatedCounter
              key={index}
              end={stat.end}
              label={stat.label}
              suffix={stat.suffix}
              duration={stat.duration}
            />
          ))}
        </div>

        {/* Additional metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            className="
            bg-[var(--bg-dark1)]/80 backdrop-blur-sm rounded-2xl p-6
            border border-[var(--bg-dark3)] text-center
            hover:bg-[var(--bg-dark1)] hover:border-[var(--primary)]/30
            transition-all duration-300
          "
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--highlight)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text1)] mb-2">Verified Data</h3>
            <p className="text-sm text-[var(--text2)]">
              All specifications verified against manufacturer data and real-world testing
            </p>
          </div>

          <div
            className="
            bg-[var(--bg-dark1)]/80 backdrop-blur-sm rounded-2xl p-6
            border border-[var(--bg-dark3)] text-center
            hover:bg-[var(--bg-dark1)] hover:border-[var(--primary)]/30
            transition-all duration-300
          "
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text1)] mb-2">Real-Time Updates</h3>
            <p className="text-sm text-[var(--text2)]">
              Performance calculations update instantly as you add or remove modifications
            </p>
          </div>

          <div
            className="
            bg-[var(--bg-dark1)]/80 backdrop-blur-sm rounded-2xl p-6
            border border-[var(--bg-dark3)] text-center
            hover:bg-[var(--bg-dark1)] hover:border-[var(--primary)]/30
            transition-all duration-300
          "
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--highlight)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text1)] mb-2">Expert Insights</h3>
            <p className="text-sm text-[var(--text2)]">
              Modification data curated by automotive professionals and enthusiasts
            </p>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div
            className="
            bg-gradient-to-r from-[var(--primary)]/10 to-[var(--highlight)]/10 
            backdrop-blur-sm rounded-2xl p-8 border border-[var(--primary)]/20
            max-w-4xl mx-auto
          "
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--text1)] mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-[var(--text2)] mb-6 leading-relaxed">
              Join thousands of car enthusiasts who trust our platform for their modification
              planning. Start building your dream car today with confidence and precision.
            </p>
            <motion.a
              href="/mod"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] 
                hover:from-[var(--accent)] hover:to-[var(--primary)] text-white font-semibold text-lg 
                px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl
                focus:outline-none
              "
              aria-label="Start planning your car modifications"
            >
              Start Planning Your Build
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
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
