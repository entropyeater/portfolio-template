import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, ZoomIn } from 'lucide-react';
import { MediaDisplay } from './MediaDisplay';
import { FocusArea, FocusAreaSection } from '../services/database';
import focusAreasRaw from '../data/focus-areas.json';
import { resolveImagePath } from '../utils/imageResolver';

/**
 * FocusAreaDetail — Deep-Dive Page
 *
 * Shows a focus area (e.g., "User Research Methods") with a title,
 * description, and a series of image + text sections. Data comes from
 * the generated focus-areas.json file.
 *
 * Press 'k' to toggle theater mode (images only).
 */

interface FocusAreaDetailProps {
  focusAreaId: string;
  onBack: () => void;
}

const focusAreas = focusAreasRaw as FocusArea[];

const toMarkup = (html?: string, fallback = ''): { __html: string } => ({
  __html: html && html.trim() ? html : fallback,
});

const getFocusAreaData = (id: string): FocusArea => {
  const found = focusAreas.find((fa) => fa.id === id);
  if (!found) {
    console.warn(`Unknown focus area id "${id}", falling back to first entry.`);
    if (focusAreas.length === 0) {
      throw new Error('No focus areas available in data');
    }
    return focusAreas[0];
  }
  return found;
};

export function FocusAreaDetail({ focusAreaId, onBack }: FocusAreaDetailProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [theaterMode, setTheaterMode] = useState(false);
  const focusAreaData = getFocusAreaData(focusAreaId);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Delete') {
        if (expandedImage) {
          e.preventDefault();
          setExpandedImage(null);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          onBack();
        }
      }
      if (e.key === 'k' || e.key === 'K') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
        if (expandedImage) return;
        if (e.metaKey) e.preventDefault();
        setTheaterMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expandedImage, onBack]);

  return (
    <div className="min-h-screen pt-24 bg-[#0A0A24] text-gray-100">
      {/* Back button */}
      <motion.div
        className={`max-w-7xl mx-auto px-6 pb-6 transition-all duration-500 ${theaterMode ? 'opacity-0 max-h-0 overflow-hidden m-0 p-0' : 'opacity-100 max-h-[200px]'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: theaterMode ? 0 : 1 }}
      >
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-heading">Back to Portfolio</span>
        </button>
      </motion.div>

      {/* Title Section */}
      <div className={`max-w-7xl mx-auto px-6 py-20 transition-all duration-500 ${theaterMode ? 'opacity-0 max-h-0 overflow-hidden m-0 p-0' : 'opacity-100 max-h-[1000px]'}`}>
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl tracking-[-0.03em] mb-5 leading-[1.0]">
            <span
              className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-[#C8FF00] bg-clip-text text-transparent font-heading font-bold"
              dangerouslySetInnerHTML={toMarkup(focusAreaData.title)}
            />
          </h1>
          <div
            className="text-lg text-gray-400 richtext leading-relaxed max-w-3xl"
            dangerouslySetInnerHTML={toMarkup(
              focusAreaData.description,
              'A deep dive into the methods and practices that drive exceptional design outcomes'
            )}
          />
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="pb-24">
        {focusAreaData.sections.map((section, index) => (
          <div key={index} className="mb-28 last:mb-0 relative">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={theaterMode ? 'grid grid-cols-1 gap-10 items-center max-w-5xl mx-auto' : 'grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 items-start'}>
                  {/* Image */}
                  <div className="relative">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 group cursor-pointer hover-lift">
                      <MediaDisplay
                        src={section.image}
                        alt={`Focus area section ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black/60 flex opacity-0 group-hover:opacity-100 transition-opacity"
                        role="button"
                        tabIndex={0}
                        aria-label="Expand image"
                        onClick={() => setExpandedImage(section.image)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setExpandedImage(section.image);
                          }
                        }}
                      >
                        <div className="bg-cyan-400/20 p-4 rounded-full">
                          <ZoomIn className="w-8 h-8 text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={`transition-all duration-500 ${theaterMode ? 'opacity-0 max-h-0 overflow-hidden m-0 p-0' : 'opacity-100 max-h-[1000px]'}`}>
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: theaterMode ? 0 : 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        className="text-base text-gray-300 leading-relaxed richtext"
                        dangerouslySetInnerHTML={toMarkup(section.text)}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 transition-colors group"
              onClick={() => setExpandedImage(null)}
              aria-label="Close expanded image"
            >
              <X className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
            </button>

            <div
              className="max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {expandedImage && /\.pdf$/i.test(expandedImage) ? (
                <object
                  data={resolveImagePath(expandedImage)}
                  type="application/pdf"
                  className="w-auto h-auto max-w-full max-h-full"
                  aria-label="Expanded PDF view"
                >
                  <a href={resolveImagePath(expandedImage)} target="_blank" rel="noreferrer" className="text-cyan-400 underline">
                    Open PDF
                  </a>
                </object>
              ) : (
                <img
                  src={expandedImage}
                  alt="Expanded view"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
