import React from 'react';
import { Menu } from 'lucide-react';

/**
 * Navigation Bar
 *
 * Fixed top navigation with your name/brand, page links, and a menu button.
 * Uses a solid dark background. Customize the name and links as needed.
 */
interface NavigationProps {
  onMenuClick: () => void;
  onNavigateHome: () => void;
  onNavigateToResume?: () => void;
}

export function Navigation({ onMenuClick, onNavigateHome, onNavigateToResume }: NavigationProps) {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A24]/90 backdrop-blur-md border-b border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Site title / your name — click to go home */}
        <h1
          className="text-lg tracking-[-0.02em] font-heading font-semibold cursor-pointer text-gray-100 hover:text-cyan-400 transition-colors duration-200"
          onClick={onNavigateHome}
        >
          Jane Doe
        </h1>

        <div className="flex items-center gap-8">
          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8">
            <button
              onClick={onNavigateHome}
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 tracking-wide uppercase font-heading"
            >
              Portfolio
            </button>
            <button
              onClick={onNavigateToResume || onNavigateHome}
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 tracking-wide uppercase font-heading"
            >
              Resume
            </button>
          </div>

          {/* Hamburger menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-cyan-400/10 rounded-lg transition-all duration-200 group"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors duration-200" />
          </button>
        </div>
      </div>
    </nav>
  );
}
