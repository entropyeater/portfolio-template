import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Target, ChevronDown } from 'lucide-react';
import { fetchFocusAreas, fetchProjects, type FocusArea, type Project } from '../services/database';

/**
 * Global Slide-Out Menu
 *
 * A full-height panel that slides in from the right. Lists projects with
 * detail pages, focus areas (in a collapsible section), and a resume link.
 * Hover over an item to reveal its description.
 */

interface MenuItem {
  id: string;
  title: string;
  description: string;
  summary: string;
  icon?: React.ReactNode;
  type?: 'project' | 'focus-area';
}

interface GlobalMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
  onNavigateToFocusArea: (focusAreaId: string) => void | Promise<void>;
  onNavigateToResume?: () => void;
  onNavigateToDetail?: (projectId: string) => void | Promise<void>;
}

export function GlobalMenu({ isOpen, onClose, onNavigate, onNavigateToFocusArea, onNavigateToResume, onNavigateToDetail }: GlobalMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [showDeepDives, setShowDeepDives] = useState(false);

  const sortByDisplayOrder = <T extends { displayOrder?: number }>(items: T[]) =>
    [...items].sort((a, b) => (a.displayOrder ?? Number.POSITIVE_INFINITY) - (b.displayOrder ?? Number.POSITIVE_INFINITY));

  // Load project and focus area data for the menu
  useEffect(() => {
    async function loadMenuData() {
      try {
        const [projectData, focusAreaData] = await Promise.all([
          fetchProjects(),
          fetchFocusAreas()
        ]);
        setProjects(sortByDisplayOrder(projectData));
        setFocusAreas(sortByDisplayOrder(focusAreaData));
      } catch (error) {
        console.error('Failed to load menu data', error);
      }
    }
    loadMenuData();
  }, []);

  // Only show projects that have a detail page
  const projectItems: MenuItem[] = projects
    .filter((project) => project.hasDetailPage)
    .map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      summary: project.subtitle,
      type: 'project',
    }));

  // Only show focus areas that have sections
  const focusAreaItems: MenuItem[] = focusAreas
    .filter((area) => area.sections && area.sections.length > 0)
    .map((area) => ({
      id: area.id,
      title: area.title,
      description: area.description,
      summary: area.subtitle,
      icon: <Target className="w-6 h-6" />,
      type: 'focus-area'
    }));

  const handleItemClick = (item: MenuItem) => {
    if (item.type === 'focus-area') {
      onNavigateToFocusArea(item.id);
      onClose();
      return;
    }
    if (item.type === 'project') {
      if (onNavigateToDetail) {
        onNavigateToDetail(item.id);
      }
      onClose();
      return;
    }
    if (item.id === 'resume' && onNavigateToResume) {
      onNavigateToResume();
      onClose();
      return;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-[#0A0A24] border-l border-white/[0.06] z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0A0A24] border-b border-white/[0.06] p-6 flex justify-between items-center">
              <h2 className="text-xl tracking-[-0.02em] font-heading font-semibold">Navigation</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cyan-400/10 rounded-lg transition-colors group"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-6">
              {/* Projects */}
              <div className="space-y-1">
                {projectItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <button
                        onClick={() => handleItemClick(item)}
                        className="w-full text-left py-3 px-3 rounded-lg transition-all duration-200 group relative hover:bg-white/[0.03]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-2 min-w-0">
                            <h3 className="text-base text-gray-100 group-hover:text-cyan-400 transition-colors mb-1 font-heading font-medium tracking-tight">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">{item.summary}</p>
                            {/* Show description on hover */}
                            <AnimatePresence>
                              {hoveredItem === item.id && (
                                <motion.p
                                  className="text-sm text-gray-400 mt-2"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                >
                                  {item.description}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </button>
                    </div>
                    {index < projectItems.length - 1 && (
                      <div className="h-[1px] bg-white/[0.04] mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Focus Areas — collapsible section */}
              {focusAreaItems.length > 0 && (
                <div className="border-t border-b border-white/[0.06] py-4">
                  <button
                    className="w-full flex items-center justify-between text-left px-3"
                    onClick={() => setShowDeepDives((open) => !open)}
                  >
                    <div className="text-xs font-heading font-medium text-gray-300 uppercase tracking-widest">Deep dives</div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${showDeepDives ? 'rotate-180' : ''} text-gray-500`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {showDeepDives && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 space-y-1"
                      >
                        {focusAreaItems.map((item) => (
                          <div
                            key={item.id}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <button
                              onClick={() => handleItemClick(item)}
                              className="w-full text-left py-3 px-3 rounded-lg transition-all duration-200 group relative hover:bg-white/[0.03]"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400/20 transition-colors">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm text-gray-100 group-hover:text-cyan-400 transition-colors font-heading font-medium">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">{item.summary}</p>
                                  <AnimatePresence>
                                    {hoveredItem === item.id && (
                                      <motion.p
                                        className="text-sm text-gray-400 mt-1"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                      >
                                        {item.description}
                                      </motion.p>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Resume link */}
              <div className="pt-2">
                <button
                  onClick={() => handleItemClick({ id: 'resume', title: 'Resume', description: '', summary: '', icon: null })}
                  className="w-full text-left py-3 px-3 rounded-lg transition-all duration-200 group relative flex items-center gap-4 hover:bg-white/[0.03]"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400/20 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-100 group-hover:text-cyan-400 transition-colors font-heading font-medium">
                      Resume
                    </h4>
                    <p className="text-sm text-gray-500">Experience and skills</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
