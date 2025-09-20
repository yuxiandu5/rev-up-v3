"use client";

import { motion, Variants } from "framer-motion";

const features = [
  {
    id: "performance-calculator",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Performance Calculator",
    description:
      "See real-time performance changes as you add modifications. Track horsepower, torque, acceleration, and handling improvements.",
    highlights: ["Real-time calculations", "Detailed spec changes", "Performance comparisons"],
  },
  {
    id: "extensive-catalog",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    title: "Extensive Mod Catalog",
    description:
      "Browse through hundreds of performance modifications across engine, suspension, brakes, and weight reduction categories.",
    highlights: ["6 major categories", "Detailed descriptions", "Price comparisons"],
  },
  {
    id: "car-database",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>
    ),
    title: "Comprehensive Car Database",
    description:
      "Support for popular performance cars from BMW, Mercedes, Audi, and Porsche with accurate baseline specifications.",
    highlights: ["Multiple brands", "Year-specific data", "Accurate specs"],
  },
  {
    id: "visual-feedback",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    title: "Visual Progress Tracking",
    description:
      "Watch your build progress with visual indicators and see how modifications impact your car's overall performance profile.",
    highlights: ["Progress visualization", "Performance charts", "Build summaries"],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function FeaturesSection() {
  return (
    <section
      className="py-20 px-4 bg-gradient-to-b from-[var(--bg-dark2)] to-[var(--bg-dark1)]"
      aria-labelledby="features-title"
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
            id="features-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--text1)]"
          >
            Everything You Need to
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] bg-clip-text text-transparent block">
              Build Your Dream Car
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text2)] max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform provides all the tools and data you need to plan, calculate,
            and track your car modifications with precision and confidence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants} className="group relative">
              <div
                className="
                bg-[var(--bg-dark3)]/50 backdrop-blur-sm rounded-2xl p-8 h-full
                border border-[var(--bg-dark3)] transition-all duration-300
                hover:bg-[var(--bg-dark3)]/70 hover:border-[var(--primary)]/30  
                hover:shadow-xl hover:shadow-[var(--primary)]/10
              "
              >
                {/* Icon */}
                <div
                  className="
                  w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--highlight)] 
                  flex items-center justify-center text-white mb-6
                  group-hover:from-[var(--accent)] group-hover:to-[var(--primary)] transition-all duration-300
                "
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-[var(--text1)] mb-4">
                  {feature.title}
                </h3>

                <p className="text-[var(--text2)] leading-relaxed mb-6">{feature.description}</p>

                {/* Highlights */}
                <ul className="space-y-2" role="list">
                  {feature.highlights.map((highlight, highlightIndex) => (
                    <li
                      key={highlightIndex}
                      className="flex items-center text-sm text-[var(--text2)]"
                    >
                      <svg
                        className="w-4 h-4 text-[var(--primary)] mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover effect overlay */}
                <div
                  className="
                  absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--highlight)]/5 
                  rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                "
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
