import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Maximize2, ArrowRight } from 'lucide-react';
import { resolveImagePath } from '../utils/imageResolver';
import { MediaDisplay } from './MediaDisplay';

/**
 * ProjectCard
 *
 * Renders a single project on the homepage. Supports two layouts:
 *   1. With details: 1/3 text + 2/3 media/details grid
 *   2. Without details: 1/3 text + 2/3 image gallery
 *
 * The `reversed` flag on the project data flips the column order.
 */

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: Array<{
    heading: string;
    text: string;
    image?: string;
    caseStudyLink?: string;
  }>;
  image?: string;
  images?: string[];
  reversed: boolean;
  hasDetailPage?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onNavigateToDetail: (projectId: string) => void | Promise<void>;
}

export function ProjectCard({ project, index, onNavigateToDetail }: ProjectCardProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const primaryImage = project.image || project.images?.[0] || null;
  const galleryImages = primaryImage ? [primaryImage] : project.images || [];
  const hasDetails = project.details && project.details.length > 0;
  const hasPrimaryImage = Boolean(primaryImage);

  // "View Case Study" link — only shown if the project has a detail page
  const renderCaseStudyCTA = () => {
    if (!project.hasDetailPage) return null;
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="cursor-pointer group flex items-center gap-3 transition-all duration-300 focus:outline-none"
        onClick={() => onNavigateToDetail(project.id)}
      >
        <span className="text-cyan-400 text-sm font-heading font-medium tracking-wide border-b-2 border-transparent group-hover:border-[#C8FF00] transition-colors duration-200 pb-0.5">View Case Study</span>
        <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
      </motion.button>
    );
  };

  // Primary image/media block
  const renderPrimaryMedia = () => {
    if (!hasPrimaryImage) return null;
    const isPdf = (src: string) => /\.pdf$/i.test(src);

    return (
      <motion.a
        href={`?project=${project.id}`}
        onClick={(e) => {
          e.preventDefault();
          onNavigateToDetail(project.id);
        }}
        className="group block cursor-pointer hover-lift rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        {isPdf(primaryImage!) ? (
          <object
            data={resolveImagePath(primaryImage!)}
            type="application/pdf"
            className="w-full rounded-xl"
            aria-label={`${project.subtitle} - PDF preview`}
          >
            <span className="text-cyan-400 underline">Open PDF</span>
          </object>
        ) : (
          <MediaDisplay
            src={primaryImage!}
            alt={`${project.subtitle} - Image 1`}
            className="w-full h-auto rounded-xl"
          />
        )}
      </motion.a>
    );
  };

  // Detail list (headings + descriptions under the image)
  const renderDetailList = () => {
    if (!hasDetails) return null;
    return (
      <div className="space-y-6">
        {project.details.map((detail, idx) => (
          <motion.div
            key={idx}
            className="group relative"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="relative pl-6 border-l-2 border-white/[0.08] hover:border-[#C8FF00] transition-colors duration-300">
              <div className="flex items-start gap-2">
                <div>
                  <h3 className="text-gray-100 mb-2 font-heading tracking-tight">{detail.heading}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light richtext" />
                  {detail.image && (
                    <button
                      type="button"
                      className="mt-3 block text-left cursor-pointer w-full"
                      onClick={() => onNavigateToDetail(project.id)}
                    >
                      <MediaDisplay
                        src={detail.image}
                        alt={`${project.subtitle} - ${detail.heading}`}
                        className="w-full max-w-none rounded-xl border border-white/[0.06]"
                      />
                    </button>
                  )}
                  {project.hasDetailPage && (
                    <div
                      onClick={() => onNavigateToDetail(project.id)}
                      className="mt-2 inline-flex items-center gap-2 whitespace-nowrap text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-sm font-heading"
                    >
                      <span className="border-b-2 border-transparent group-hover:border-[#C8FF00] transition-colors duration-200 pb-0.5">View case study</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      {hasDetails ? (
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Text column */}
          <motion.div
            className={`space-y-8 lg:col-span-1 ${project.reversed ? 'lg:order-2' : 'lg:order-1'}`}
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.p
              className="text-gray-300 leading-relaxed font-light richtext max-w-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
            {renderCaseStudyCTA()}
          </motion.div>

          {/* Media + details column */}
          <motion.div
            className={`space-y-6 lg:col-span-2 ${project.reversed ? 'lg:order-1' : 'lg:order-2'}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            {renderPrimaryMedia()}
            {renderDetailList()}
          </motion.div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Text content */}
          <motion.div
            className={`space-y-8 lg:col-span-1 ${project.reversed ? 'lg:order-2' : 'lg:order-1'}`}
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.p
              className="text-gray-300 leading-relaxed font-light richtext max-w-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
            {renderCaseStudyCTA()}
          </motion.div>

          {/* Images */}
          {hasPrimaryImage && (
            <motion.div
              className={`space-y-6 lg:col-span-2 ${project.reversed ? 'lg:order-1' : 'lg:order-2'}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              {galleryImages.map((image, idx) => (
                <a
                  key={idx}
                  href={`?project=${project.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToDetail(project.id);
                  }}
                  className="group block relative overflow-hidden rounded-xl bg-gray-900/50 cursor-pointer hover-lift"
                >
                  <MediaDisplay
                    src={image}
                    alt={`${project.subtitle} - Image ${idx + 1}`}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 text-white">
                      <Maximize2 className="w-5 h-5" />
                      <span className="text-sm font-heading border-b-2 border-transparent group-hover:border-[#C8FF00] transition-colors duration-200">View Case Study</span>
                    </div>
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Expanded image modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <div className="max-w-7xl max-h-full">
              <ImageWithFallback
                src={expandedImage ? resolveImagePath(expandedImage) : ''}
                alt="Expanded view"
                className="w-full h-auto max-h-[90vh] object-contain rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
