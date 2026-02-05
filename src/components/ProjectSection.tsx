import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ProjectCard } from './ProjectCard';

/**
 * ProjectSection
 *
 * Wraps a single project on the homepage with a title header, subtitle link,
 * and scroll-based opacity fade. Contains a ProjectCard for the main content.
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

interface ProjectSectionProps {
  project: Project;
  index: number;
  onNavigateToDetail: (projectId: string) => void | Promise<void>;
}

export function ProjectSection({ project, index, onNavigateToDetail }: ProjectSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // More dramatic fade + parallax as section scrolls through viewport
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [150, 0, 0, -150]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.97, 1, 1, 0.97]);

  return (
    <motion.section
      ref={ref}
      id={project.id}
      className="min-h-64 flex items-center py-32 relative"
      style={{ opacity }}
    >
      <motion.div
        className="max-w-7xl mx-auto w-full px-6"
        style={{ y, scale }}
      >
        {/* Project header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          {/* Company / project label */}
          <div className="text-[11px] tracking-[0.4em] text-cyan-400 mb-3 uppercase font-heading font-medium">
            {project.title}
          </div>
          {/* Project subtitle — links to detail page */}
          <h2 className="text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05]">
            <a
              href={`?project=${project.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToDetail(project.id);
              }}
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              {project.subtitle}
            </a>
          </h2>
        </motion.div>

        <ProjectCard
          project={project}
          index={index}
          onNavigateToDetail={onNavigateToDetail}
        />
      </motion.div>
    </motion.section>
  );
}
