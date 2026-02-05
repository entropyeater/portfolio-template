import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import resumeDataRaw from '../data/resume.json';

/**
 * ResumeDetail — Resume Page
 *
 * Displays resume data (header, experience, education, skills) loaded
 * from the generated resume.json file. Edit the CSV files in src/data/
 * to update content, then run `npm run build:data` to regenerate JSON.
 */

interface ResumeHeader {
  name: string;
  title: string;
  intro_text: string;
  pdf_url: string;
}

interface ResumeExperience {
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  role: string;
  description: string;
}

interface ResumeEducation {
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  degree: string;
  details: string;
}

interface ResumeSkill {
  category: string;
  items: string;
}

interface ResumeData {
  header: ResumeHeader;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
}

interface ResumeDetailProps {
  onBack: () => void;
}

const resumeData = resumeDataRaw as ResumeData;

export function ResumeDetail({ onBack }: ResumeDetailProps) {
  return (
    <div className="resume-page resume-dark min-h-screen pt-24 bg-[#0A0A24] text-gray-100">
      <motion.div
        className="max-w-7xl mx-auto px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={onBack}
          className="group flex items-center gap-3 text-gray-500 hover:text-cyan-400 transition-colors"
          aria-label="Back to portfolio"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-heading">Back to Portfolio</span>
        </button>
      </motion.div>

      <div className="resume-shell">
        {/* Intro */}
        <AnimatedRow delay={0.05}>
          <div className="resume-textbox">
            <span className="resume_header text-white">resume</span>
          </div>
          <div className="resume-element">
            <span className="resume_title text-white">{resumeData.header.title}</span>
            <p className="resume_set text-gray-200">{resumeData.header.intro_text}</p>
            {resumeData.header.pdf_url && (
              <p className="mt-2">
                <a
                  className="text-cyan-400 hover:text-cyan-300 underline decoration-2 underline-offset-2 resume-download-link font-heading text-sm"
                  href={resumeData.header.pdf_url}
                  download
                >
                  Download PDF Resume
                </a>
              </p>
            )}
          </div>
        </AnimatedRow>

        {/* Experience Heading */}
        <AnimatedRow delay={0.05}>
          <div className="resume-textbox" />
          <div className="resume-element">
            <span className="resume_set text-gray-200">experience</span>
          </div>
        </AnimatedRow>

        {/* Experience Rows */}
        {resumeData.experience.map((exp, index) => (
          <AnimatedRow key={`${exp.company}-${exp.startDate}-${index}`} delay={index * 0.07}>
            <div className="resume-textbox">
              <span className="resume_project text-white">{exp.company}</span>
              <span className="resume_place text-gray-300">{exp.location}</span>
              <span className="resume_place text-gray-300">
                {exp.startDate} – {exp.endDate}
              </span>
            </div>
            <div className="resume-element">
              <span className="resume_title text-white">{exp.role}</span>
              <p className="resume_set text-gray-100">{exp.description}</p>
            </div>
          </AnimatedRow>
        ))}

        {/* Education Heading */}
        <AnimatedRow delay={0.05}>
          <div className="resume-textbox" />
          <div className="resume-element">
            <span className="resume_set text-gray-200">education</span>
          </div>
        </AnimatedRow>

        {/* Education Rows */}
        {resumeData.education.map((edu, index) => (
          <AnimatedRow key={`${edu.school}-${index}`} delay={index * 0.07}>
            <div className="resume-textbox">
              <span className="resume_project text-white">{edu.school}</span>
              <span className="resume_place text-gray-300">{edu.location}</span>
              <span className="resume_place text-gray-300">
                {edu.startDate} – {edu.endDate}
              </span>
            </div>
            <div className="resume-element">
              <span className="resume_title text-white">{edu.degree}</span>
              <p className="text-gray-200">{edu.details}</p>
            </div>
          </AnimatedRow>
        ))}

        {/* Skills */}
        <AnimatedRow delay={0.05}>
          <div className="resume-textbox" />
          <div className="resume-element">
            <span className="resume_set text-gray-200">skills & interests</span>
            <div className="mt-3 space-y-3">
              {resumeData.skills.map((skill, index) => (
                <AnimatedParagraph key={`${skill.category}-${index}`} delay={0.05 * index}>
                  <span className="resume_skill_heading text-white">
                    {skill.category}
                  </span>{' '}
                  – <span className="text-gray-200">{skill.items}</span>
                </AnimatedParagraph>
              ))}
            </div>
          </div>
        </AnimatedRow>
      </div>
    </div>
  );
}

/* Simple fade-in animation wrapper for resume rows */
interface AnimatedRowProps {
  children: React.ReactNode;
  delay?: number;
}

function AnimatedRow({ children, delay = 0 }: AnimatedRowProps) {
  return (
    <motion.div
      className="resume-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedParagraphProps {
  children: React.ReactNode;
  delay?: number;
}

function AnimatedParagraph({ children, delay = 0 }: AnimatedParagraphProps) {
  return (
    <motion.p
      className="resume-skill"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.p>
  );
}
