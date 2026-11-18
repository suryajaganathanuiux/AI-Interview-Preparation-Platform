export type SectionKey = 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications'

export type Entry = { title: string; meta: string; bullets: string[] }

export type ResumeData = {
  order: SectionKey[]
  summary: string
  skills: string[]
  experience: Entry[]
  projects: Entry[]
  education: string
  certifications: string
}

export const initialResume: ResumeData = {
  order: ['summary', 'skills', 'education', 'experience', 'projects', 'certifications'],
  summary: 'Computer Science graduate (2024) with hands-on React experience from an internship and two shipped projects. Looking for a frontend developer role.',
  skills: ['React', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Git', 'Figma', 'Firebase'],
  experience: [
    {
      title: 'Frontend Intern · Tessel Web',
      meta: 'Chennai · Jun–Aug 2023',
      bullets: ['Built form components in React for the client portal', 'Worked on error states for the dashboard'],
    },
  ],
  projects: [
    {
      title: 'Campus Events App',
      meta: 'React, Firebase · 2024',
      bullets: ['Built a campus events app using React and Firebase'],
    },
    {
      title: 'Weather Dashboard',
      meta: 'JavaScript, OpenWeather API · 2023',
      bullets: ['Responsive dashboard showing 5-day forecasts from a public API'],
    },
  ],
  education: 'B.Tech, Computer Science — Anna University (CEG), 2024 · 8.1 CGPA',
  certifications: 'Meta Front-End Developer — Coursera, 2023',
}

export const SUGGESTIONS: {
  id: string
  target: SectionKey
  title: string
  why: string
  before?: string
  after: string
  apply: (d: ResumeData) => ResumeData
}[] = [
  {
    id: 's1',
    target: 'experience',
    title: 'Name the API work in your internship',
    why: 'The job lists “REST APIs” as required. You confirmed this in your profile, but your resume doesn’t say it.',
    before: 'Worked on error states for the dashboard',
    after: 'Integrated REST APIs into the client dashboard and built loading and error states for 6 data views',
    apply: (d) => ({
      ...d,
      experience: d.experience.map((e, i) =>
        i === 0 ? { ...e, bullets: [e.bullets[0], 'Integrated REST APIs into the client dashboard and built loading and error states for 6 data views'] } : e
      ),
    }),
  },
  {
    id: 's2',
    target: 'projects',
    title: 'Show your role and the result',
    why: 'Uses details from your confirmed project description (organiser dashboard, 40+ events). Replace any number you can’t stand behind.',
    before: 'Built a campus events app using React and Firebase',
    after: 'Built the organiser dashboard in React; live seat counts via Firebase replaced spreadsheet booking for 40+ tech-fest events',
    apply: (d) => ({
      ...d,
      projects: d.projects.map((p, i) =>
        i === 0 ? { ...p, bullets: ['Built the organiser dashboard in React; live seat counts via Firebase replaced spreadsheet booking for 40+ tech-fest events'] } : p
      ),
    }),
  },
  {
    id: 's3',
    target: 'projects',
    title: 'Move Projects above Education',
    why: 'This listing weights hands-on work. Recruiters for fresher roles scan projects first.',
    after: 'Section order: Summary → Skills → Projects → Experience → Education',
    apply: (d) => ({ ...d, order: ['summary', 'skills', 'projects', 'experience', 'education', 'certifications'] }),
  },
]

export const ATS_CHECKS = [
  { ok: true, t: 'Single-column layout', d: 'Parses cleanly in common ATS systems.' },
  { ok: true, t: 'Standard section headings', d: 'Summary, Skills, Experience, Projects, Education.' },
  { ok: true, t: 'Contact details in body text', d: 'Not hidden in a header or image.' },
  { ok: false, t: 'Bullets without results', d: '3 of 4 bullets describe tasks but not outcomes.' },
  { ok: false, t: 'Summary is generic', d: 'Mention the role type and one specific strength.' },
  { ok: true, t: 'File type and size', d: 'PDF, 184 KB, text-selectable.' },
]
