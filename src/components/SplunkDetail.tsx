import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { fetchCaseStudy, fetchProjectById, findProjectDetailByCaseStudyLink, type CaseStudySection, type Project } from '../services/database';
import { resolveImagePath } from '../utils/imageResolver';
import { MediaDisplay } from './MediaDisplay';

/**
 * SplunkDetail — Case Study Detail Page
 *
 * Displays a full case study with a hero section and content sections
 * (image + text pairs). Data is loaded from the generated JSON files
 * via the database service.
 *
 * Press 'k' to toggle theater mode (hides text, shows images only).
 */

interface SplunkDetailProps {
  projectId: string | null;
  onBack: () => void;
}

export function SplunkDetail({ projectId, onBack }: SplunkDetailProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [theaterMode, setTheaterMode] = useState(false);
  const [caseStudyContent, setCaseStudyContent] = useState<CaseStudySection[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedDetailText, setMatchedDetailText] = useState<string | null>(null);

  // Keyboard shortcuts: Escape closes expanded image, Backspace goes back, k toggles theater mode
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

  // Load case study data
  useEffect(() => {
    async function loadCaseStudy() {
      try {
        setLoading(true);
        if (!projectId) {
          setError('No project selected.');
          return;
        }

        const [projectData, data] = await Promise.all([
          fetchProjectById(projectId),
          fetchCaseStudy(projectId)
        ]);

        if (projectData) {
          setProject(projectData);
        } else {
          const linked = findProjectDetailByCaseStudyLink(projectId);
          if (linked) {
            setProject({
              ...linked.project,
              title: linked.detail.heading || linked.detail.caseStudyLink || linked.project.title,
            });
            setMatchedDetailText(linked.detail.text || null);
          } else {
            setProject({
              id: projectId,
              title: projectId,
              subtitle: '',
              description: '',
              reversed: false,
              hasDetailPage: true,
              details: []
            } as Project);
          }
        }
        setCaseStudyContent(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load case study:', err);
        setError('Failed to load case study content.');
      } finally {
        setLoading(false);
      }
    }
    loadCaseStudy();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-heading">Loading case study...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 hover:border-cyan-400 rounded-xl transition-all font-heading text-sm"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const heroSubtitle =
    matchedDetailText && matchedDetailText.trim().length
      ? matchedDetailText
      : project?.details && project.details.length > 0 && project.details[0]?.text?.trim().length
        ? project.details[0].text
        : 'Case study details and visuals.';

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Back button */}
      <motion.div
        className={`max-w-7xl mx-auto mb-12 px-6 transition-all duration-500 ${theaterMode ? 'opacity-0 max-h-0 overflow-hidden m-0 p-0' : 'opacity-100 max-h-[200px]'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: theaterMode ? 0 : 1 }}
      >
        <button
          onClick={onBack}
          className="group flex items-center gap-3 text-gray-500 hover:text-cyan-400 transition-colors"
          aria-label="Back to portfolio"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-heading">Back to Portfolio</span>
        </button>
      </motion.div>

      {/* Hero section */}
      <motion.div
        className={`max-w-7xl mx-auto mb-24 px-6 transition-all duration-500 ${theaterMode ? 'opacity-0 max-h-0 overflow-hidden m-0 p-0' : 'opacity-100 max-h-[1000px]'}`}
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: theaterMode ? 0 : 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-[11px] tracking-[0.4em] text-cyan-400 mb-4 uppercase font-heading font-medium">CASE STUDY</div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] mb-6 leading-[1.0] font-heading font-bold">{project?.title || 'Case Study'}</h1>
        <p
          className="text-lg text-gray-400 max-w-3xl font-light richtext leading-relaxed"
          dangerouslySetInnerHTML={{ __html: heroSubtitle }}
        />
      </motion.div>

      {/* Content sections — each is an image + text pair */}
      <div className="space-y-40">
        {caseStudyContent.map((section, index) => (
          <div key={index} className="relative">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                className={theaterMode ? 'grid grid-cols-1 gap-10 items-center max-w-5xl mx-auto' : 'grid lg:grid-cols-3 gap-12 items-start'}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-80px" }}
              >
                {/* Image */}
                <motion.div
                  className={theaterMode ? '' : 'lg:col-span-2'}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-80px" }}
                >
                  <div
                    className="group relative overflow-hidden rounded-xl bg-gray-900/50 cursor-pointer hover-lift"
                    onClick={() => setExpandedImage(section.image)}
                  >
                    <MediaDisplay
                      src={section.image}
                      alt={`${project?.title || 'Case study'} image ${index + 1}`}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-white">
                        <Maximize2 className="w-5 h-5" />
                        <span className="text-sm font-heading border-b-2 border-transparent group-hover:border-[#C8FF00] transition-colors duration-200">View Full Size</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  className={`transition-[max-height] duration-500 ${theaterMode ? 'max-h-0 overflow-hidden m-0 p-0' : 'max-h-[1000px]'}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: theaterMode ? 0 : 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-80px" }}
                >
                  <div className="relative space-y-4">
                    <p
                      className="text-gray-300 leading-relaxed text-lg font-light richtext"
                      dangerouslySetInnerHTML={{ __html: section.text }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded image modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <div className="max-w-7xl max-h-full">
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
                <MediaDisplay
                  src={expandedImage || ''}
                  alt="Expanded view"
                  className="w-full h-auto max-h-[90vh] object-contain rounded-xl"
                  controls
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
