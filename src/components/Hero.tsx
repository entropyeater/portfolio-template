import React from 'react';
import { motion } from 'motion/react';

/**
 * Hero Section
 *
 * The full-screen intro that appears at the top of the homepage.
 * Customize the role label, name, and tagline below to make it yours.
 */
export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Subtle gradient glow behind hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-400/[0.04] blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Role label — staggered blur-in */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 tracking-[0.35em] text-xs font-heading uppercase">
            YOUR ROLE HERE
          </div>
        </motion.div>

        {/* Your name — dramatic scale + blur entrance */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(16px)', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-[4.5rem] md:text-[6.5rem] lg:text-[8rem] mb-4 custom-hero-text tracking-[-0.04em] leading-[0.9]"
        >
          Jane Doe
        </motion.h1>

        {/* Tagline — slides up after name */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-snug"
        >
          Your tagline goes here
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-gray-600 mx-auto flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-cyan-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
