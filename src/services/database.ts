/**
 * Data Service — Portfolio Content
 *
 * This service provides all portfolio data to the React components.
 *
 * How it works:
 * 1. You edit CSV files in /src/data/ (projects.csv, resume_header.csv, etc.)
 * 2. Run `npm run build:data` to convert CSVs into JSON files
 * 3. This service imports the generated JSON and exposes it via async functions
 *
 * The async interface makes it easy to swap in a real API later if needed.
 */
import projectsRaw from "../data/projects.json";
import focusAreasRaw from "../data/focus-areas.json";
import caseStudiesRaw from "../data/case-studies.json";

// ---------------------------------------------------------------------------
// Types — these mirror the structure of the CSV/JSON data
// ---------------------------------------------------------------------------

export interface ProjectDetail {
  heading: string;
  text: string;
  image?: string;
  caseStudyLink?: string;
}

export interface CaseStudySection {
  image: string;
  text: string;
  sectionTitle?: string | null;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  reversed: boolean;
  hasDetailPage: boolean;
  details: ProjectDetail[];
  image?: string;
  images?: string[];
  caseStudy?: CaseStudySection[];
  displayOrder?: number;
}

export interface FocusAreaSection {
  image: string;
  text: string;
  sectionTitle?: string | null;
}

export interface FocusArea {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sections: FocusAreaSection[];
  displayOrder?: number;
}

// ---------------------------------------------------------------------------
// Typed views over the raw imported JSON
// ---------------------------------------------------------------------------

const projectsData = projectsRaw as Project[];
const focusAreasData = focusAreasRaw as FocusArea[];
const standaloneCaseStudies = (caseStudiesRaw as { id: string; caseStudy: CaseStudySection[] }[]) || [];

// ---------------------------------------------------------------------------
// Data-fetching functions
// ---------------------------------------------------------------------------

/** Fetch all projects. */
export async function fetchProjects(): Promise<Project[]> {
  return projectsData;
}

/** Fetch all focus areas. */
export async function fetchFocusAreas(): Promise<FocusArea[]> {
  return focusAreasData;
}

/** Fetch a single focus area by id. */
export async function fetchFocusAreaById(focusAreaId: string): Promise<FocusArea | undefined> {
  const id = focusAreaId?.trim();
  return focusAreasData.find((area) => area.id === id);
}

/** Fetch a single project by id. */
export async function fetchProjectById(projectId: string): Promise<Project | undefined> {
  const id = projectId?.trim();
  return projectsData.find((project) => project.id === id);
}

/**
 * Find the project/detail entry that links to a given case study id.
 * Useful when navigating directly via a caseStudyLink instead of the project id.
 */
export function findProjectDetailByCaseStudyLink(caseStudyId: string): { project: Project; detail: ProjectDetail } | undefined {
  const match = projectsData.find((project) =>
    project.details?.some((detail) => (detail.caseStudyLink || '').trim() === caseStudyId?.trim())
  );
  if (!match) return undefined;

  const detail = match.details.find((d) => (d.caseStudyLink || '').trim() === caseStudyId?.trim());
  if (!detail) return undefined;

  return { project: match, detail };
}

/**
 * Fetch case study sections for a specific project.
 * Looks first for sections embedded in the project data, then falls back
 * to standalone case studies (for projects linked via caseStudyLink).
 */
export async function fetchCaseStudy(projectId: string): Promise<CaseStudySection[]> {
  try {
    const id = projectId?.trim();

    const project = projectsData.find((p) => p.id === id);
    if (project?.caseStudy?.length) {
      return project.caseStudy;
    }

    const standalone = standaloneCaseStudies.find((cs) => cs.id === id);
    if (standalone?.caseStudy?.length) {
      return standalone.caseStudy;
    }

    return [];
  } catch (error) {
    console.error('Error fetching case study:', error);
    throw error;
  }
}
