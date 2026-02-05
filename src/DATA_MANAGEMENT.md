# Data Management Guide

## 🎯 How Data Works in This Portfolio

Your portfolio uses a **CSV → JSON → React** workflow:

1. **Edit CSV files** in `/data/` (use Excel, Google Sheets, or text editor)
2. **Run build script** that converts CSVs to JSON
3. **React imports JSON** directly (no server/API needed!)
4. **Deploy anywhere** as a fully static site

## 📁 File Structure

```
portfolio/
├── data/                          # CSV source files (edit these!)
│   ├── projects.csv
│   ├── project_details.csv
│   ├── project_images.csv
│   ├── case_study_sections.csv
│   ├── focus_areas.csv
│   └── focus_area_sections.csv
│
├── scripts/
│   └── build-data.js             # Converts CSV → JSON
│
├── src/
│   └── data/                     # Generated JSON (DO NOT EDIT!)
│       ├── projects.json
│       └── focus-areas.json
│
└── services/
    └── data.ts                   # Data access functions
```

## 🚀 Quick Start

### Edit Your Content

```bash
# Open CSV files in your favorite editor
open data/projects.csv              # Mac
start data/projects.csv             # Windows
xdg-open data/projects.csv          # Linux

# Or use Excel, Google Sheets, Numbers, etc.
```

### Build the Data

```bash
# Convert CSVs to JSON
npm run build:data

# Or run dev server (builds data automatically)
npm run dev

# Or build for production (builds data automatically)
npm run build
```

## 📝 Editing Projects

### Add a New Project

**1. Add to `projects.csv`:**
```csv
my-project,"My Amazing Project","Company Name","Full description here",false,true,2
```

**2. Add details to `project_details.csv`:**
```csv
my-project,"Challenge","Description of the challenge",0
my-project,"Solution","How we solved it",1
```

**3. Add images to `project_images.csv`:**
```csv
my-project,/path/to/image1.png,0
my-project,/path/to/image2.png,1
```

**4. Add case study to `case_study_sections.csv`:**
```csv
my-project,/path/to/hero.png,"First section text",0
my-project,/path/to/detail.png,"Second section text",1
```

**5. Rebuild:**
```bash
npm run build:data
```

### Edit Existing Project

1. Find the project row in `projects.csv`
2. Edit the text (keep quotes around text with commas!)
3. Save the file
4. Run `npm run build:data`

### Delete a Project

1. Remove the row from `projects.csv`
2. Remove related rows from:
   - `project_details.csv`
   - `project_images.csv`
   - `case_study_sections.csv`
3. Run `npm run build:data`

## 🎯 Editing Focus Areas

### Add a New Focus Area

**1. Add to `focus_areas.csv`:**
```csv
design-systems,"Design Systems","Scalable Design","Description of focus area",1
```

**2. Add sections to `focus_area_sections.csv`:**
```csv
design-systems,/path/to/image1.png,"First section text",0
design-systems,/path/to/image2.png,"Second section text",1
design-systems,/path/to/image3.png,"Third section text",2
```

**3. Rebuild:**
```bash
npm run build:data
```

Focus areas will appear in the menu but NOT on the main portfolio page.

## 💡 CSV Tips

### Use Quotes for Text with Commas

❌ **Wrong:**
```csv
splunk,Description with, commas in it,false
```

✅ **Correct:**
```csv
splunk,"Description with, commas in it",false
```

### Keep Headers Intact

Always keep the first row (headers) in each CSV file:
```csv
id,title,subtitle,description,reversed,hasDetailPage,display_order
```

### Boolean Values

Use lowercase `true` or `false`:
```csv
reversed,hasDetailPage
true,false
```

### Order Matters

Use `display_order` and `section_order` to control the sequence:
```csv
id,title,display_order
project-1,"First Project",0
project-2,"Second Project",1
project-3,"Third Project",2
```

## 🔄 Build Process

### What Happens When You Run `npm run build:data`

1. **Reads** all CSV files from `/data/`
2. **Parses** CSV into JavaScript objects
3. **Combines** related data (e.g., project + details + images)
4. **Sorts** by `display_order` and `section_order`
5. **Writes** JSON files to `/src/data/`
6. **React imports** the JSON directly

### Development Workflow

```bash
# Start dev server (auto-builds data)
npm run dev

# Edit CSV files in your editor
# Save changes

# Restart dev server or run:
npm run build:data

# Refresh browser to see changes
```

### Production Build

```bash
# Build data + build app
npm run build

# Preview production build
npm run preview

# Deploy /dist folder to your host
```

## 📦 Deployment

Your portfolio is now a **fully static site** that works anywhere:

✅ **GitHub Pages** - Just push `/dist` folder  
✅ **Netlify** - Drag and drop `/dist` folder  
✅ **Vercel** - Connect your repo  
✅ **AWS S3** - Upload `/dist` to bucket  
✅ **Any static host** - Upload `/dist` contents  

**No PHP, Node.js, or database server required!**

## 🛠️ Troubleshooting

### "Cannot find module '../data/projects.json'"

**Problem:** JSON files haven't been generated yet

**Solution:**
```bash
npm run build:data
```

### CSV parsing errors

**Problem:** Unquoted commas or malformed CSV

**Solution:**
- Put quotes around any text with commas
- Check for missing columns
- Verify header row exists

### Changes not showing up

**Problem:** JSON files not regenerated

**Solution:**
```bash
# Rebuild data
npm run build:data

# Restart dev server
npm run dev
```

### Image paths not working

**Problem:** Wrong image URL in CSV

**Solution:**
- Use full URLs: `https://...`
- Or Figma assets: `figma:asset/...`
- Or relative paths: `/images/...`

## 📊 Data Structure Reference

### Projects

```typescript
{
  id: string;              // Unique identifier
  title: string;           // Project title
  subtitle: string;        // Company/context
  description: string;     // Full description
  reversed: boolean;       // Layout direction
  hasDetailPage: boolean;  // Has case study?
  details: [               // Detail bullets
    { heading: string; text: string; }
  ];
  images: string[];        // Image URLs
  caseStudy: [            // Case study sections
    { image: string; text: string; }
  ];
}
```

### Focus Areas

```typescript
{
  id: string;             // Unique identifier
  title: string;          // Focus area title
  subtitle: string;       // Context
  description: string;    // Full description
  sections: [             // Content sections
    { image: string; text: string; }
  ];
}
```

## 🔐 Version Control

CSV files work great with Git:

```bash
# Track changes
git add data/
git commit -m "Updated project descriptions"

# See what changed
git diff data/projects.csv

# Revert changes
git checkout data/projects.csv
```

## 💾 Backup

Simple backups:

```bash
# Backup all data
cp -r data/ data-backup-$(date +%Y%m%d)/

# Restore from backup
cp -r data-backup-20240101/ data/
npm run build:data
```

## 🎨 Advanced: Custom Build Script

The build script (`scripts/build-data.js`) is just Node.js. You can customize it:

```javascript
// Add custom processing
const projectsData = projects.map(project => {
  return {
    ...project,
    slug: project.title.toLowerCase().replace(/\s/g, '-'),
    featured: project.display_order === 0
  };
});
```

## 📚 Need Help?

1. Check `/data/README.md` for CSV format details
2. Look at existing CSV files for examples
3. Run `npm run build:data` after any changes
4. Check browser console for errors

---

## ✅ Summary

**To update your portfolio:**

1. Edit CSV files in `/data/`
2. Run `npm run build:data`
3. Test with `npm run dev`
4. Deploy with `npm run build`

**No server, no database, no API - just simple CSV files!** 🎉
