"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

const brands = [
  {
    name: "BMW",
    logo: "/logo/bmw-logo.png",
    models: ["320i", "420i", "520i"],
    description: "Ultimate driving machines with precision engineering",
  },
  {
    name: "Mercedes",
    logo: "/logo/mercedes-logo.png",
    models: ["C300"],
    description: "Luxury performance with German craftsmanship",
  },
  {
    name: "Audi",
    logo: "/logo/audi-logo.png",
    models: ["A5-45", "A7-45", "RS3"],
    description: "Vorsprung durch Technik - Progress through technology",
  },
  {
    name: "Porsche",
    logo: "/logo/porsche-logo.png",
    models: ["911-GT3-RS"],
    description: "There is no substitute for pure performance",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function SupportedBrandsSection() {
  return (
    <section className="py-20 px-4 bg-[var(--bg-dark1)]" aria-labelledby="brands-title">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            id="brands-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--text1)]"
          >
            Supported
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] bg-clip-text text-transparent block">
              Premium Brands
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text2)] max-w-3xl mx-auto leading-relaxed">
            We support the most popular performance car brands with accurate specifications and
            comprehensive modification data for each model and year range.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {brands.map((brand) => (
            <motion.div key={brand.name} variants={cardVariants} className="group relative">
              <div
                className="
                bg-[var(--bg-dark2)]/80 backdrop-blur-sm rounded-2xl p-8 h-full
                border border-[var(--bg-dark3)] transition-all duration-300
                hover:bg-[var(--bg-dark2)] hover:border-[var(--primary)]/30
                hover:shadow-xl hover:shadow-[var(--primary)]/10
                flex flex-col items-center text-center
              "
              >
                {/* Logo */}
                <div
                  className="
                  w-20 h-20 mb-6 rounded-full bg-white/10 backdrop-blur-sm
                  flex items-center justify-center transition-all duration-300
                  group-hover:bg-white/20
                "
                >
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain filter brightness-110"
                  />
                </div>

                {/* Brand name */}
                <h3 className="text-xl md:text-2xl font-bold text-[var(--text1)] mb-3">
                  {brand.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--text2)] mb-6 leading-relaxed">
                  {brand.description}
                </p>

                {/* Models */}
                <div className="mt-auto w-full">
                  <h4 className="text-sm font-semibold text-[var(--text1)] mb-3">
                    Supported Models:
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {brand.models.map((model, modelIndex) => (
                      <span
                        key={modelIndex}
                        className="
                          px-3 py-1 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--highlight)]/20
                          border border-[var(--primary)]/30 rounded-full text-xs text-[var(--text1)]
                          transition-all duration-300
                        "
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>

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

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div
            className="
            bg-[var(--bg-dark3)]/30 backdrop-blur-sm rounded-2xl p-8
            border border-[var(--bg-dark3)] max-w-4xl mx-auto
          "
          >
            <h3 className="text-xl md:text-2xl font-bold text-[var(--text1)] mb-4">
              Expanding Our Database
            </h3>
            <p className="text-[var(--text2)] leading-relaxed mb-4">
              We&apos;re constantly adding new models and brands to our database. Each car includes
              accurate baseline specifications including horsepower, torque, acceleration times, and
              handling ratings to ensure precise modification calculations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-[var(--text2)]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--primary)]"
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
                <span>Year-specific data</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--primary)]"
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
                <span>Factory specifications</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--primary)]"
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
                <span>Performance baselines</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
