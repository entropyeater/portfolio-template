import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Portfolio } from './components/Portfolio';
import { Navigation } from './components/Navigation';
import { GlobalMenu } from './components/GlobalMenu';
import { SplunkDetail } from './components/SplunkDetail';
import { FocusAreaDetail } from './components/FocusAreaDetail';
import { ResumeDetail } from './components/ResumeDetail';

/**
 * App — Root Component
 *
 * Manages page routing (home, case study detail, focus area, resume) and
 * the global slide-out menu. URL parameters (?project=, ?focus=, ?resume=1)
 * allow direct linking to any page.
 *
 * Dark mode is hardcoded. To change the color scheme, edit the className
 * on the root <div> and adjust Tailwind classes throughout.
 */
export default function App() {
  // Current page state — controls which view is rendered
  const [currentPage, setCurrentPage] = useState<'home' | 'splunk-detail' | 'focus-area' | 'resume'>('home');
  const [currentFocusAreaId, setCurrentFocusAreaId] = useState<string>('');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Always use dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Sync the URL with the current page so users can share links
  const syncUrl = useCallback((page: 'home' | 'splunk-detail' | 'focus-area' | 'resume', opts?: { projectId?: string | null; focusId?: string }) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    url.searchParams.delete('focus');
    url.searchParams.delete('resume');

    if (page === 'splunk-detail' && opts?.projectId) {
      url.searchParams.set('project', opts.projectId);
    } else if (page === 'focus-area' && opts?.focusId) {
      url.searchParams.set('focus', opts.focusId);
    } else if (page === 'resume') {
      url.searchParams.set('resume', '1');
    }

    window.history.pushState({}, '', url.toString());
  }, []);

  // Navigation helpers
  const navigateToDetail = useCallback((projectId: string) => {
    setCurrentProjectId(projectId);
    setCurrentFocusAreaId('');
    setCurrentPage('splunk-detail');
    syncUrl('splunk-detail', { projectId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [syncUrl]);

  const navigateToFocusArea = useCallback((focusAreaId: string) => {
    setCurrentFocusAreaId(focusAreaId);
    setCurrentProjectId(null);
    setCurrentPage('focus-area');
    syncUrl('focus-area', { focusId: focusAreaId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [syncUrl]);

  const navigateToHome = useCallback(() => {
    setCurrentProjectId(null);
    setCurrentPage('home');
    syncUrl('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [syncUrl]);

  const navigateToResume = useCallback(() => {
    setCurrentPage('resume');
    syncUrl('resume');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [syncUrl]);

  // Read URL parameters on load and on browser back/forward
  useEffect(() => {
    const applyUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      const projectParam = params.get('project');
      const focusParam = params.get('focus');
      const resumeParam = params.get('resume');

      if (projectParam) {
        navigateToDetail(projectParam);
        return;
      }
      if (focusParam) {
        navigateToFocusArea(focusParam);
        return;
      }
      if (resumeParam === '1') {
        setCurrentProjectId(null);
        setCurrentFocusAreaId('');
        setCurrentPage('resume');
        return;
      }
      setCurrentProjectId(null);
      setCurrentFocusAreaId('');
      setCurrentPage('home');
    };

    applyUrlState();

    const handlePopState = () => applyUrlState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateToDetail, navigateToFocusArea, navigateToHome]);

  // Keyboard back navigation (Backspace/Delete) when not typing in inputs
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (target as HTMLElement).isContentEditable);
      if (isTyping) return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        navigateToHome();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigateToHome]);

  return (
    <div className="dark-mode bg-[#0A0A24] text-gray-100 min-h-screen">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-[#C8FF00] origin-left z-50" />

      <Navigation
        onMenuClick={() => setMenuOpen(true)}
        onNavigateHome={navigateToHome}
        onNavigateToResume={navigateToResume}
      />
      <GlobalMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigateToHome}
        onNavigateToFocusArea={navigateToFocusArea}
        onNavigateToResume={navigateToResume}
        onNavigateToDetail={navigateToDetail}
      />

      {/* Page transitions — blur + slide between views */}
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Portfolio onNavigateToDetail={navigateToDetail} />
          </motion.div>
        ) : currentPage === 'splunk-detail' ? (
          <motion.div
            key="splunk-detail"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <SplunkDetail projectId={currentProjectId} onBack={navigateToHome} />
          </motion.div>
        ) : currentPage === 'resume' ? (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ResumeDetail onBack={navigateToHome} />
          </motion.div>
        ) : (
          <motion.div
            key="focus-area"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <FocusAreaDetail focusAreaId={currentFocusAreaId} onBack={navigateToHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
