import React, { useEffect, useState } from 'react';
import { Hero } from './Hero';
import { ProjectSection } from './ProjectSection';
import { fetchProjects, type Project } from '../services/database';

/**
 * Portfolio — Homepage
 *
 * Renders the Hero section followed by a list of project sections.
 * Projects are loaded from the generated JSON data (originally from CSVs).
 */

interface PortfolioProps {
  onNavigateToDetail: (projectId: string) => void | Promise<void>;
}

export function Portfolio({ onNavigateToDetail }: PortfolioProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load portfolio projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="pt-16">
        <Hero />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm font-heading">Loading portfolio projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16">
        <Hero />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 hover:border-cyan-400 rounded-xl transition-all font-heading text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <Hero />
      {/* Each project renders as its own section on the page */}
      {projects.map((project, index) => (
        <ProjectSection
          key={project.id}
          project={project}
          index={index}
          onNavigateToDetail={onNavigateToDetail}
        />
      ))}
    </div>
  );
}
