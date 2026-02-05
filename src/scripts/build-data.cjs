/**
 * build-data.cjs
 *
 * Node script to convert CSV content files in /src/data into JSON that the
 * React app can import at build time.
 *
 * Pipeline: CSV -> JS objects -> JSON files
 *
 * - Input CSV files:
 *     - projects.csv
 *     - project_details.csv
 *     - project_images.csv
 *     - case_study_sections.csv
 *     - focus_areas.csv
 *     - focus_area_sections.csv
 *     - resume_header.csv
 *     - resume_experience.csv
 *     - resume_education.csv
 *     - resume_skills.csv
 *
 * - Output JSON files:
 *     - projects.json
 *     - focus-areas.json
 *     - resume.json
 *
 * Usage:
 *   node src/scripts/build-data.cjs
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// CSV parsing helpers
// ---------------------------------------------------------------------------

/**
 * Parse a single CSV line into an array of raw string fields.
 * Handles:
 *   - quoted fields: "a,b"
 *   - escaped quotes inside fields: "" -> "
 *
 * Throws a descriptive error if the line has unbalanced quotes.
 */
function parseCSVLine(line, lineNumber) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = i + 1 < line.length ? line[i + 1] : "";

    if (char === '"') {
      if (inQuotes && next === '"') {
        // Escaped quote inside quoted field ("")
        current += '"';
        i++; // skip second quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // Field delimiter
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (inQuotes) {
    throw new Error(
      `Unterminated quote in CSV line ${lineNumber}: ${line.slice(0, 80)}…`
    );
  }

  result.push(current.trim());
  return result;
}

/**
 * Parse an entire CSV text into an array of objects, keyed by header row.
 *
 * - Empty lines are ignored.
 * - Missing fields are returned as empty strings.
 * - Extra fields beyond the header are dropped.
 */
function parseCSV(csvText, filename) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    console.warn(`⚠️  ${filename} is empty – returning []`);
    return [];
  }

  const headers = parseCSVLine(lines[0], 1);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];

    try {
      const fields = parseCSVLine(line, lineNumber);
      const record = {};

      headers.forEach((header, index) => {
        record[header] = fields[index] ?? "";
      });

      records.push(record);
    } catch (err) {
      console.error(
        `❌ Error parsing ${filename} at line ${lineNumber}: ${err.message}`
      );
      console.error("   → Skipping this row.");
    }
  }

  return records;
}

/**
 * Read a CSV file from ../data relative to this script and parse it.
 * Returns [] if the file is missing or cannot be parsed.
 */
function readCSV(filename) {
  const filepath = path.join(__dirname, "../data", filename);

  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  Warning: ${filename} not found at ${filepath}, using []`);
    return [];
  }

  const csvText = fs.readFileSync(filepath, "utf-8");
  return parseCSV(csvText, filename);
}

// ---------------------------------------------------------------------------
// Simple helpers
// ---------------------------------------------------------------------------

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

function toNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// ---------------------------------------------------------------------------
// Main build function
// ---------------------------------------------------------------------------

function buildData() {
  console.log("🔨 Building data from CSV files…\n");

  // Read all CSVs with basic error handling
  const projects = readCSV("projects.csv");
  const projectDetails = readCSV("project_details.csv");
  const caseStudySections = readCSV("case_study_sections.csv");
  const focusAreas = readCSV("focus_areas.csv");
  const focusAreaSections = readCSV("focus_area_sections.csv");
  const resumeHeader = readCSV("resume_header.csv");
  const resumeExperience = readCSV("resume_experience.csv");
  const resumeEducation = readCSV("resume_education.csv");
  const resumeSkills = readCSV("resume_skills.csv");

  console.log(`✓ Read ${projects.length} projects`);
  console.log(`✓ Read ${projectDetails.length} project details`);
  console.log(`✓ Read ${caseStudySections.length} case study sections`);
  console.log(`✓ Read ${focusAreas.length} focus areas`);
  console.log(`✓ Read ${focusAreaSections.length} focus area sections`);
  console.log(`✓ Read ${resumeHeader.length} resume header`);
  console.log(`✓ Read ${resumeExperience.length} resume experience entries`);
  console.log(`✓ Read ${resumeEducation.length} resume education entries`);
  console.log(`✓ Read ${resumeSkills.length} resume skills categories\n`);

  // Group case study sections by id (may include ids not present in projects)
  const caseStudyById = caseStudySections.reduce((acc, cs) => {
    const id = (cs.project_id || cs.projectId || "").trim();
    if (!id) return acc;
    const entry = acc.get(id) || [];
    entry.push({
      image: cs.image_url,
      text: cs.text,
      sectionTitle: cs.section_title || cs.sectionTitle || null,
      order: toNumber(cs.section_order ?? cs.sectionOrder),
    });
    acc.set(id, entry);
    return acc;
  }, new Map());

  // Build projects with nested details/images/caseStudy arrays
  const projectsData = projects
    .map((project) => {
      const id = (project.id || "").trim();

      const details = projectDetails
        .filter((d) => d.project_id === id)
        .sort(
          (a, b) =>
            toNumber(a.detail_order ?? a.detailOrder) -
            toNumber(b.detail_order ?? b.detailOrder)
        )
        .map((d) => ({
          heading: d.heading,
          text: d.text,
          image: d.image || d.image_url || "",
          caseStudyLink: d.case_study_link || d.caseStudyLink || "",
          password: d.password || "",
        }));

      const primaryImage = project.image || project.image_url || "";
      const images = primaryImage ? [primaryImage] : [];

      const caseStudy = (caseStudyById.get(id) || [])
        .sort((a, b) => a.order - b.order)
        .map(({ order, ...rest }) => rest);

      return {
        id,
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        reversed: toBoolean(project.reversed),
        hasDetailPage: toBoolean(project.hasDetailPage),
        details,
        image: primaryImage,
        images,
        caseStudy,
        displayOrder: toNumber(project.display_order ?? project.displayOrder),
        password: project.password || "",
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Build standalone case study map for ids not present as projects
  const caseStudyOnly = Array.from(caseStudyById.entries())
    .filter(([id]) => !projectsData.find((p) => p.id === id))
    .map(([id, sections]) => ({
      id,
      caseStudy: sections
        .sort((a, b) => a.order - b.order)
        .map(({ order, ...rest }) => rest),
    }));

  // Build focus areas with nested sections
  const focusAreasData = focusAreas
    .map((fa) => {
      const id = fa.id;

      const sections = focusAreaSections
        .filter((s) => s.focus_area_id === id)
        .sort(
          (a, b) =>
            toNumber(a.section_order ?? a.sectionOrder) -
            toNumber(b.section_order ?? b.sectionOrder)
        )
        .map((s) => ({
          image: s.image_url,
          text: s.text,
          // Optional per-section title from CSV
          sectionTitle: s.section_title || s.sectionTitle || null,
        }));

      return {
        id,
        title: fa.title,
        subtitle: fa.subtitle,
        description: fa.description,
        sections,
        displayOrder: toNumber(fa.display_order ?? fa.displayOrder),
        password: fa.password || "",
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Ensure output directory exists
  const outputDir = path.join(__dirname, "../data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Build resume data
  const resumeData = {
    header: resumeHeader.length > 0 ? resumeHeader[0] : {},
    experience: resumeExperience
      .sort(
        (a, b) =>
          toNumber(a.display_order ?? a.displayOrder) -
          toNumber(b.display_order ?? b.displayOrder)
      )
      .map((exp) => ({
        company: exp.company,
        location: exp.location,
        startDate: exp.start_date,
        endDate: exp.end_date,
        role: exp.role,
        description: exp.description,
      })),
    education: resumeEducation
      .sort(
        (a, b) =>
          toNumber(a.display_order ?? a.displayOrder) -
          toNumber(b.display_order ?? b.displayOrder)
      )
      .map((edu) => ({
        school: edu.school,
        location: edu.location,
        startDate: edu.start_date,
        endDate: edu.end_date,
        degree: edu.degree,
        details: edu.details,
      })),
    skills: resumeSkills
      .sort(
        (a, b) =>
          toNumber(a.display_order ?? a.displayOrder) -
          toNumber(b.display_order ?? b.displayOrder)
      )
      .map((skill) => ({
        category: skill.category,
        items: skill.items,
      })),
  };

  // Write JSON files
  fs.writeFileSync(
    path.join(outputDir, "projects.json"),
    JSON.stringify(projectsData, null, 2),
    "utf-8"
  );

  fs.writeFileSync(
    path.join(outputDir, "focus-areas.json"),
    JSON.stringify(focusAreasData, null, 2),
    "utf-8"
  );

  fs.writeFileSync(
    path.join(outputDir, "resume.json"),
    JSON.stringify(resumeData, null, 2),
    "utf-8"
  );

  fs.writeFileSync(
    path.join(outputDir, "case-studies.json"),
    JSON.stringify(caseStudyOnly, null, 2),
    "utf-8"
  );

  console.log("✅ Generated JSON files:");
  console.log(
    `   → /src/data/projects.json (${projectsData.length} projects)`
  );
  console.log(
    `   → /src/data/focus-areas.json (${focusAreasData.length} focus areas)`
  );
  console.log(
    `   → /src/data/resume.json (${resumeExperience.length} experience, ${resumeEducation.length} education, ${resumeSkills.length} skills)`
  );
  console.log(
    `   → /src/data/case-studies.json (${caseStudyOnly.length} standalone case study ids)\n`
  );
  console.log("🎉 Data build complete!\n");
}

// Run the build
try {
  buildData();
} catch (error) {
  console.error("❌ Error building data:", error.message);
  process.exit(1);
}
