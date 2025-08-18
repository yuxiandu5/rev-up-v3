"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Marcus Chen",
    role: "BMW 320i Owner",
    avatar: "MC",
    content: "The performance calculator is incredibly accurate! I was able to plan my entire build and the real-world results matched the predictions perfectly. Saved me thousands by choosing the right mods.",
    rating: 5,
    build: "Stage 2 Tune + Exhaust"
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Audi RS3 Enthusiast",
    avatar: "SW",
    content: "This platform made modification planning so much easier. Being able to see how each mod affects the overall performance helped me prioritize my upgrades and stay within budget.",
    rating: 5,
    build: "Turbo + Internals Build"
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "Mercedes C300 Tuner",
    avatar: "DR",
    content: "The visual progress tracking and detailed specs are game-changers. I love how I can experiment with different combinations before making any purchases. Highly recommend!",
    rating: 5,
    build: "Suspension + Wheels Setup"
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Porsche GT3 RS Track Driver",
    avatar: "AT",
    content: "As someone who tracks their car regularly, having accurate performance predictions is crucial. This tool has become essential for planning my track-focused modifications.",
    rating: 5,
    build: "Aero + Weight Reduction"
  },
  {
    id: 5,
    name: "Emily Chang",
    role: "BMW 420i Owner",
    avatar: "EC",
    content: "Perfect for beginners like me! The detailed descriptions and price comparisons helped me understand each modification and make informed decisions for my first build.",
    rating: 5,
    build: "Stage 1 Build"
  },
  {
    id: 6,
    name: "James Miller",
    role: "Audi A7 Modifier",
    avatar: "JM",
    content: "The database is comprehensive and the calculations are spot-on. I've used it for multiple builds and it's never let me down. The interface is clean and intuitive too.",
    rating: 5,
    build: "Supercharger Kit + Supporting Mods"
  }
];

function TestimonialCard({ testimonial, isActive }: { testimonial: typeof testimonials[0], isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isActive ? 1 : 0.6, 
        y: isActive ? 0 : 20
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`
        bg-[var(--bg-dark3)]/50 backdrop-blur-sm rounded-2xl p-8 h-full
      `}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="
          w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--highlight)] 
          flex items-center justify-center text-white font-bold text-lg mr-4
        ">
          {testimonial.avatar}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text1)]">
            {testimonial.name}
          </h3>
          <p className="text-sm text-[var(--text2)]">
            {testimonial.role}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Content */}
      <blockquote className="text-[var(--text2)] leading-relaxed mb-6 italic">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Build info */}
      <div className="mt-auto">
        <div className="
          bg-gradient-to-r from-[var(--primary)]/20 to-[var(--highlight)]/20 
          border border-[var(--primary)]/30 rounded-lg p-3 text-center
        ">
          <span className="text-sm text-[var(--text1)] font-semibold">
            Build: {testimonial.build}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleTestimonials = testimonials.slice(currentIndex * 3, (currentIndex + 1) * 3);

  return (
    <section 
      className="py-20 px-4 bg-[var(--bg-dark1)]"
      aria-labelledby="testimonials-title"
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
            id="testimonials-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--text1)]"
          >
            What
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] bg-clip-text text-transparent block">
              Enthusiasts Say
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text2)] max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied car enthusiasts who have transformed their rides 
            using our precision modification platform.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 min-h-[400px]">
          {visibleTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isActive={true}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4">
          {/* Navigation dots */}
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentIndex(dotIndex)}
                className={`
                  cursor-pointer
                  w-3 h-3 rounded-full transition-all duration-300
                  ${dotIndex === currentIndex 
                    ? 'bg-[var(--primary)] scale-125' 
                    : 'bg-[var(--bg-dark3)] hover:bg-[var(--primary)]/50'
                  }
                `}
                aria-label={`View testimonials page ${dotIndex + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setCurrentIndex((prev) => 
                prev === 0 ? Math.ceil(testimonials.length / 3) - 1 : prev - 1
              )}
              className="
                p-2 rounded-full bg-[var(--bg-dark3)] hover:bg-[var(--primary)]/20 
                text-[var(--text1)] transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-red-500/50
                cursor-pointer
              "
              aria-label="Previous testimonials"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => 
                (prev + 1) % Math.ceil(testimonials.length / 3)
              )}
              className="
                p-2 rounded-full bg-[var(--bg-dark3)] hover:bg-[var(--primary)]/20 
                text-[var(--text1)] transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-red-500/50
                cursor-pointer
              "
              aria-label="Next testimonials"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Community stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
                      <div className="
              bg-gradient-to-r from-[var(--primary)]/10 to-[var(--highlight)]/10 
              backdrop-blur-sm rounded-2xl p-8 border border-[var(--primary)]/20
              max-w-4xl mx-auto
            ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">5,000+</div>
                <div className="text-[var(--text2)]">Successful Builds</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--highlight)] mb-2">4.9★</div>
                <div className="text-[var(--text2)]">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)] mb-2">98%</div>
                <div className="text-[var(--text2)]">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
