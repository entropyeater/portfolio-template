# Portfolio Data (CSV Files)

This directory contains all portfolio content in CSV format. These files are automatically converted to JSON during the build process.

## How It Works

1. **Edit CSV files** - Use Excel, Google Sheets, Numbers, or any text editor
2. **Run build** - The build script (`scripts/build-data.js`) reads these CSVs
3. **JSON generated** - Creates `/src/data/projects.json` and `/src/data/focus-areas.json`
4. **React imports** - Components import the generated JSON files directly

## CSV Files

### Projects

**projects.csv** - Main project metadata
- `id` - Unique identifier (e.g., "splunk")
- `title` - Project title
- `subtitle` - Company or context
- `description` - Full description
- `reversed` - Layout direction (true/false)
- `hasDetailPage` - Whether project has a case study (true/false)
- `display_order` - Order on page (0, 1, 2...)

**project_details.csv** - Detail bullets for each project
- `project_id` - Links to project
- `heading` - Detail heading
- `text` - Detail content
- `detail_order` - Order within project (0, 1, 2...)

**project_images.csv** - Images for each project
- `project_id` - Links to project
- `image_url` - Image path or URL (see Image Path Formats below)
- `image_order` - Order within project (0, 1, 2...)

**case_study_sections.csv** - Full case study pages
- `project_id` - Links to project
- `image_url` - Section image (see Image Path Formats below)
- `text` - Section content
- `section_order` - Order within case study (0, 1, 2...)

### Focus Areas

**focus_areas.csv** - Focus area deep dives (not shown on main page)
- `id` - Unique identifier
- `title` - Focus area title
- `subtitle` - Context
- `description` - Full description
- `display_order` - Order in menu (0, 1, 2...)

**focus_area_sections.csv** - Sections for focus area pages
- `focus_area_id` - Links to focus area
- `image_url` - Section image (see Image Path Formats below)
- `text` - Section content
- `section_order` - Order within focus area (0, 1, 2...)

## Editing Data

### Option 1: Spreadsheet Software

1. Open any CSV file in Excel, Google Sheets, or Numbers
2. Edit the data (keep the header row!)
3. Save as CSV
4. Run `npm run dev` or `npm run build`

### Option 2: Text Editor

1. Open CSV file in VS Code, Sublime, etc.
2. Edit carefully (use quotes around text with commas)
3. Save
4. Run `npm run dev` or `npm run build`

## Image Path Formats

The `image_url` field in CSV files supports several formats:

### 1. Full URLs (External Images)
Use complete URLs for images hosted elsewhere:
```csv
project-id,https://example.com/images/photo.png,0
project-id,https://cdn.example.com/assets/image.jpg,1
```
✅ **Best for**: Images hosted on CDNs, external servers, or different domains

### 2. Public Directory Paths (Static Assets)
Use absolute paths starting with `/` for images in the `public/` directory:
```csv
project-id,/images/portfolio/photo.png,0
project-id,/assets/case-studies/screenshot.jpg,1
```
**How it works**: 
- Create a `public/` folder in your project root (same level as `src/`)
- Place images in subdirectories, e.g., `public/images/portfolio/photo.png`
- In production, these are served from the root URL (e.g., `/images/portfolio/photo.png`)
- Not processed by Vite (no optimization/hashing, copied as-is)
- ✅ **Best for**: Large images, images that change frequently, or images shared across multiple pages

**Setup**: Create the directory structure:
```bash
mkdir -p public/images
# Then place your images in public/images/
```

### 3. Build Assets (Processed by Vite)
For images in `src/assets/` that need Vite processing:
```csv
project-id,/assets/image.png,0
project-id,figma:asset/image.png,1
```
**Note**: These paths must be added to `src/utils/imageResolver.ts` to work properly.
✅ **Best for**: Small images that benefit from optimization and hashing

### Examples in CSV Files

```csv
# External URL
splunk,https://images.unsplash.com/photo-123.jpg,0

# Public directory (create public/images/ folder)
splunk,/images/splunk-dashboard.png,0

# Build asset (must be in src/assets/ and mapped in imageResolver.ts)
splunk,/assets/5f6895c480439aafd8f8cd64ae886cfa5a1be551.png,0
```

## CSV Format Tips

- **Headers required** - First row must be column names
- **Quotes for commas** - If text contains commas, wrap in quotes: `"text, with, commas"`
- **Boolean values** - Use `true` or `false` (lowercase)
- **Order matters** - Use `display_order` and `section_order` columns
- **Image paths** - Use full URLs or absolute paths starting with `/` for best compatibility

## Examples

### Adding a New Project

1. Add row to `projects.csv`:
```csv
new-project,"New Project","Company Name","Description text",false,false,2
```

2. Add details to `project_details.csv`:
```csv
new-project,"Detail 1","Detail text here",0
new-project,"Detail 2","More detail text",1
```

3. Add images to `project_images.csv`:
```csv
new-project,/path/to/image.png,0
```

4. Run `npm run build:data`

### Adding a Focus Area

1. Add row to `focus_areas.csv`:
```csv
new-focus,"Focus Title","Subtitle","Description",1
```

2. Add sections to `focus_area_sections.csv`:
```csv
new-focus,/path/to/image.png,"Section text",0
new-focus,/path/to/image.png,"More text",1
```

3. Run `npm run build:data`

## Build Commands

```bash
# Build data only
npm run build:data

# Dev server (builds data first)
npm run dev

# Production build (builds data first)
npm run build
```

## Generated Files

The build script creates:
- `/src/data/projects.json` - All projects with nested details, images, and case studies
- `/src/data/focus-areas.json` - All focus areas with nested sections

These files are imported directly by React components:
```typescript
import projectsData from '../data/projects.json';
import focusAreasData from '../data/focus-areas.json';
```

## Troubleshooting

**"Cannot find module" error**
- Run `npm run build:data` to generate JSON files

**CSV parsing errors**
- Check for unquoted commas in text fields
- Ensure header row exists
- Verify CSV is saved in UTF-8 encoding

**Data not updating**
- Run `npm run build:data` after editing CSVs
- Restart dev server if needed

## Backup Your Data

CSV files are easy to backup:
```bash
# Create backup
cp -r data/ data-backup-$(date +%Y%m%d)/

# Restore from backup
cp -r data-backup-20240101/ data/
```

## Version Control

CSV files work great with Git:
- Easy to see changes in diffs
- Merge conflicts are manageable
- Track history of content changes
