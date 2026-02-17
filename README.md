# Portfolio Template

A customizable portfolio website built with React, TypeScript, Vite, and Tailwind CSS. Designed for designers and developers who want a clean, dark-themed portfolio with case study pages, a resume section, and focus area deep-dives.

Preview at https://entropyeater.github.io/portfolio-template/index.html

## How It Works

Content is managed through **CSV files** in `src/data/`. A build script converts them into JSON that the React app imports at build time.

```
CSV files (you edit these)
    ↓  npm run build:data
JSON files (auto-generated)
    ↓  imported by React components
Live site
```

### CSV Files

| File | Purpose |
|------|---------|
| `projects.csv` | Portfolio projects shown on the homepage |
| `project_details.csv` | Detail items displayed under each project |
| `case_study_sections.csv` | Image + text sections for case study pages |
| `focus_areas.csv` | Deep-dive topic pages |
| `focus_area_sections.csv` | Image + text sections for focus area pages |
| `resume_header.csv` | Your name, title, intro text, PDF link |
| `resume_experience.csv` | Work experience entries |
| `resume_education.csv` | Education entries |
| `resume_skills.csv` | Skill categories |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (auto-builds CSV data)
npm run dev
```

The site will be available at `http://localhost:5173`.

## Customizing

### 1. Update Your Info

- Edit `src/data/resume_header.csv` with your name, title, and intro
- Edit `src/components/Hero.tsx` to change the hero section name and tagline
- Edit `src/components/Navigation.tsx` to update the nav bar name

### 2. Add Your Projects

1. Add a row to `src/data/projects.csv` with your project info
2. Optionally add detail items in `project_details.csv`
3. For projects with `hasDetailPage=TRUE`, add sections in `case_study_sections.csv`
4. Place project images in `public/images/` and reference them in the CSV

### 3. Replace Placeholder Images

The template includes SVG placeholder images in `public/images/`. Replace these with your own project screenshots and reference the new paths in the CSV files.

### 4. Rebuild Data

After editing CSV files, rebuild the JSON:

```bash
npm run build:data
```

This runs automatically before `npm run dev` and `npm run build`.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents of that folder to any static hosting service.

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — type safety
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling
- **Motion** (Framer Motion) — page transitions and scroll animations
- **Lucide React** — icon library

## Project Structure

```
src/
├── components/       # React components
│   ├── Hero.tsx            # Homepage hero section
│   ├── Navigation.tsx      # Top navigation bar
│   ├── GlobalMenu.tsx      # Slide-out menu
│   ├── Portfolio.tsx        # Homepage project list
│   ├── ProjectSection.tsx   # Individual project wrapper
│   ├── ProjectCard.tsx      # Project content card
│   ├── SplunkDetail.tsx     # Case study detail page
│   ├── FocusAreaDetail.tsx  # Focus area detail page
│   ├── ResumeDetail.tsx     # Resume page
│   └── MediaDisplay.tsx     # Image/video display helper
├── data/             # CSV source files and generated JSON
├── scripts/          # Build scripts (CSV → JSON)
├── services/         # Data service layer
├── utils/            # Utility functions
├── App.tsx           # Root component with routing
└── index.css         # Global styles
```

## URL Parameters

The site uses URL parameters for navigation (no router library needed):

- `?project=<id>` — Opens a case study detail page
- `?focus=<id>` — Opens a focus area page
- `?resume=1` — Opens the resume page

## Placeholder Images

This template ships with placeholder SVG images. Replace them with your actual project screenshots for a complete portfolio. Images referenced in the CSV files should be placed in the `public/images/` directory.
