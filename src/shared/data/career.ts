// Development-mode sample data for the career platform.
// Every job below is a SAMPLE listing for fictional companies. In production these come from
// authorised job APIs, partner feeds or admin-managed listings — never scraped, never invented.

export type Job = {
  id: string
  title: string
  company: string
  initials: string
  location: string
  mode: 'Remote' | 'Hybrid' | 'Office'
  type: 'Full-time' | 'Internship' | 'Contract'
  experience: string
  salary: string | null
  posted: string
  postedDays: number
  source: string
  verified: string
  fit: number
  matching: string[]
  partial: string[]
  missing: string[]
  fresherFriendly: boolean
  expired?: boolean
  saved?: boolean
  industry: string
}

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'Frontend Developer (Fresher)',
    company: 'Lumen Labs',
    initials: 'LL',
    location: 'Chennai',
    mode: 'Hybrid',
    type: 'Full-time',
    experience: '0–1 yrs',
    salary: '₹4.5–6 LPA',
    posted: '2 days ago',
    postedDays: 2,
    source: 'Partner feed',
    verified: 'Today, 09:12',
    fit: 82,
    matching: ['React', 'JavaScript', 'CSS', 'REST APIs', 'Git'],
    partial: ['Responsive design'],
    missing: ['TypeScript', 'Jest'],
    fresherFriendly: true,
    saved: true,
    industry: 'SaaS',
  },
  {
    id: 'j2',
    title: 'Junior React Developer',
    company: 'Northwind Fintech',
    initials: 'NF',
    location: 'Chennai',
    mode: 'Office',
    type: 'Full-time',
    experience: '0–2 yrs',
    salary: null,
    posted: '5 days ago',
    postedDays: 5,
    source: 'Employer listing',
    verified: 'Yesterday',
    fit: 74,
    matching: ['React', 'JavaScript', 'Git'],
    partial: ['REST APIs'],
    missing: ['Redux', 'TypeScript'],
    fresherFriendly: true,
    saved: true,
    industry: 'Fintech',
  },
  {
    id: 'j3',
    title: 'UI Developer Trainee',
    company: 'Kavi Software',
    initials: 'KS',
    location: 'Coimbatore',
    mode: 'Office',
    type: 'Full-time',
    experience: 'Fresher',
    salary: '₹3.6–4.2 LPA',
    posted: '1 day ago',
    postedDays: 1,
    source: 'Partner feed',
    verified: 'Today, 07:40',
    fit: 79,
    matching: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    partial: ['Accessibility'],
    missing: ['SASS'],
    fresherFriendly: true,
    industry: 'IT Services',
  },
  {
    id: 'j4',
    title: 'Frontend Engineer I',
    company: 'Brightpath Health',
    initials: 'BH',
    location: 'Bengaluru',
    mode: 'Remote',
    type: 'Full-time',
    experience: '0–1 yrs',
    salary: '₹6–8 LPA',
    posted: '6 days ago',
    postedDays: 6,
    source: 'Partner feed',
    verified: 'Today, 06:05',
    fit: 68,
    matching: ['React', 'JavaScript', 'CSS'],
    partial: ['Testing'],
    missing: ['Next.js', 'TypeScript'],
    fresherFriendly: true,
    industry: 'Healthcare',
  },
  {
    id: 'j5',
    title: 'Web Developer (Fresher)',
    company: 'Coastline Retail',
    initials: 'CR',
    location: 'Chennai',
    mode: 'Hybrid',
    type: 'Full-time',
    experience: 'Fresher',
    salary: null,
    posted: '9 days ago',
    postedDays: 9,
    source: 'Employer listing',
    verified: '3 days ago',
    fit: 71,
    matching: ['HTML', 'CSS', 'JavaScript'],
    partial: ['React'],
    missing: ['PHP', 'MySQL'],
    fresherFriendly: true,
    industry: 'Retail',
  },
  {
    id: 'j6',
    title: 'Associate Software Engineer – UI',
    company: 'Orbit Analytics',
    initials: 'OA',
    location: 'Hyderabad',
    mode: 'Hybrid',
    type: 'Full-time',
    experience: '0–2 yrs',
    salary: '₹5–7 LPA',
    posted: '12 days ago',
    postedDays: 12,
    source: 'Partner feed',
    verified: '2 days ago',
    fit: 63,
    matching: ['JavaScript', 'CSS'],
    partial: ['React', 'Data visualisation'],
    missing: ['Angular', 'TypeScript', 'D3.js'],
    fresherFriendly: false,
    industry: 'Analytics',
  },
  {
    id: 'j7',
    title: 'React Developer Intern',
    company: 'Pixelnest Studio',
    initials: 'PS',
    location: 'Remote',
    mode: 'Remote',
    type: 'Internship',
    experience: 'Student / Fresher',
    salary: '₹20,000 / month',
    posted: '24 days ago',
    postedDays: 24,
    source: 'Partner feed',
    verified: 'Listing closed May 10',
    fit: 76,
    matching: ['React', 'JavaScript', 'Figma'],
    partial: [],
    missing: ['Framer Motion'],
    fresherFriendly: true,
    expired: true,
    industry: 'Design agency',
  },
]

export const jobDetail = {
  id: 'j1',
  about:
    'Lumen Labs builds scheduling software for clinics and small hospitals. The frontend team of nine owns the web app used by 1,200+ clinics. This role is part of the 2025 graduate intake and includes a 6-week paired onboarding.',
  responsibilities: [
    'Build and maintain UI features in React with the design team',
    'Turn Figma designs into accessible, responsive components',
    'Integrate REST APIs and handle loading and error states',
    'Write unit tests for components you build',
    'Take part in code review and weekly demos',
  ],
  required: ['React', 'JavaScript (ES6+)', 'CSS / responsive design', 'REST APIs', 'Git'],
  preferred: ['TypeScript', 'Jest or React Testing Library'],
  qualifications: 'B.E./B.Tech/MCA (2024 or 2025 graduates). Portfolio or GitHub link preferred.',
  benefits: ['Health insurance (self + family)', 'Learning budget ₹25,000/yr', '2 days WFH per week', 'Laptop provided'],
  applyMethod: 'Company careers site (external)',
  applyUrl: 'careers.lumenlabs.example/jobs/fe-2025',
  closes: 'Jun 05, 2025',
  company: {
    industry: 'Healthcare SaaS',
    founded: '2016',
    size: '210 employees',
    hq: 'Chennai, India',
    website: 'lumenlabs.example',
    sources: [
      { label: 'Company profile', source: 'Company website', date: 'Checked May 12, 2025' },
      { label: 'Employee count', source: 'Public registry filing', date: 'Mar 2025' },
    ],
    topics: ['React state and props', 'Accessibility basics', 'Debugging an API error state', 'A project you built end-to-end'],
  },
  fit: {
    overall: 82,
    dims: [
      { name: 'Skill alignment', score: 70, weight: 40, note: '5 of 7 listed skills confirmed in your profile' },
      { name: 'Experience', score: 85, weight: 20, note: 'Fresher role; you have 1 internship + 3 projects' },
      { name: 'Education', score: 100, weight: 15, note: 'B.Tech CSE 2024 meets the requirement' },
      { name: 'Role alignment', score: 80, weight: 15, note: 'Matches your preferred title “Frontend Developer”' },
      { name: 'Location & mode', score: 100, weight: 10, note: 'Chennai, hybrid — both in your preferences' },
    ],
    experience: [
      'Campus events app — React dashboard used during the college tech fest',
      'Frontend intern, Tessel Web (3 months) — built forms and API error states',
    ],
    recommendations: [
      'Learn TypeScript basics — listed as preferred, and missing from 4 of your 7 matches',
      'Add a component test to your capstone repo to show Jest experience',
      'Rewrite your project bullet to mention the API integration explicitly',
    ],
  },
}

export type AppStage =
  | 'Interested'
  | 'Saved'
  | 'Ready to Apply'
  | 'Applied'
  | 'Application Viewed'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Offer Received'
  | 'Rejected'
  | 'Withdrawn'

export const STAGES: AppStage[] = [
  'Interested',
  'Saved',
  'Ready to Apply',
  'Applied',
  'Application Viewed',
  'Shortlisted',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Received',
  'Rejected',
  'Withdrawn',
]

export type Application = {
  id: string
  role: string
  company: string
  initials: string
  location: string
  stage: AppStage
  date: string
  followUp?: string
  next?: string
  contact?: string
  notes?: string
  history: { stage: AppStage; date: string; by: 'You' | 'Verified email' | 'Partner API' }[]
}

export const applications: Application[] = [
  {
    id: 'a1',
    role: 'Frontend Developer (Fresher)',
    company: 'Lumen Labs',
    initials: 'LL',
    location: 'Chennai · Hybrid',
    stage: 'Interview Scheduled',
    date: 'May 08',
    next: 'Technical round · Fri May 16, 10:30',
    contact: 'Divya S., Talent team',
    notes: 'Round 1 is 45 min with two engineers. Asked to bring my capstone repo.',
    history: [
      { stage: 'Saved', date: 'May 06', by: 'You' },
      { stage: 'Applied', date: 'May 08', by: 'You' },
      { stage: 'Shortlisted', date: 'May 12', by: 'Verified email' },
      { stage: 'Interview Scheduled', date: 'May 12', by: 'You' },
    ],
  },
  {
    id: 'a2',
    role: 'Junior React Developer',
    company: 'Northwind Fintech',
    initials: 'NF',
    location: 'Chennai · Office',
    stage: 'Applied',
    date: 'May 09',
    followUp: 'May 16',
    history: [
      { stage: 'Saved', date: 'May 07', by: 'You' },
      { stage: 'Applied', date: 'May 09', by: 'You' },
    ],
  },
  {
    id: 'a3',
    role: 'UI Developer Trainee',
    company: 'Kavi Software',
    initials: 'KS',
    location: 'Coimbatore · Office',
    stage: 'Shortlisted',
    date: 'May 05',
    contact: 'hr@kavi.example',
    history: [
      { stage: 'Applied', date: 'May 05', by: 'You' },
      { stage: 'Shortlisted', date: 'May 11', by: 'Verified email' },
    ],
  },
  {
    id: 'a4',
    role: 'Frontend Engineer I',
    company: 'Brightpath Health',
    initials: 'BH',
    location: 'Remote',
    stage: 'Ready to Apply',
    date: 'May 13',
    notes: 'Tailored resume v2 saved. Cover note drafted with NOVA — needs my review.',
    history: [
      { stage: 'Saved', date: 'May 12', by: 'You' },
      { stage: 'Ready to Apply', date: 'May 13', by: 'You' },
    ],
  },
  {
    id: 'a5',
    role: 'Web Developer (Fresher)',
    company: 'Coastline Retail',
    initials: 'CR',
    location: 'Chennai · Hybrid',
    stage: 'Saved',
    date: 'May 13',
    history: [{ stage: 'Saved', date: 'May 13', by: 'You' }],
  },
  {
    id: 'a6',
    role: 'Frontend Intern',
    company: 'Zenith Edtech',
    initials: 'ZE',
    location: 'Chennai · Office',
    stage: 'Interview Completed',
    date: 'Apr 24',
    followUp: 'May 15',
    history: [
      { stage: 'Applied', date: 'Apr 24', by: 'You' },
      { stage: 'Interview Scheduled', date: 'May 02', by: 'You' },
      { stage: 'Interview Completed', date: 'May 07', by: 'You' },
    ],
  },
  {
    id: 'a7',
    role: 'Associate Software Engineer – UI',
    company: 'Orbit Analytics',
    initials: 'OA',
    location: 'Hyderabad · Hybrid',
    stage: 'Rejected',
    date: 'Apr 18',
    history: [
      { stage: 'Applied', date: 'Apr 18', by: 'You' },
      { stage: 'Rejected', date: 'Apr 30', by: 'Verified email' },
    ],
  },
  {
    id: 'a8',
    role: 'React Developer Intern',
    company: 'Pixelnest Studio',
    initials: 'PS',
    location: 'Remote',
    stage: 'Withdrawn',
    date: 'Apr 20',
    history: [
      { stage: 'Applied', date: 'Apr 20', by: 'You' },
      { stage: 'Withdrawn', date: 'Apr 29', by: 'You' },
    ],
  },
]

export const readiness = {
  overall: 67,
  previous: 61,
  dims: [
    { name: 'Resume quality', score: 72, tip: 'Add results to 2 project bullets' },
    { name: 'Job skill alignment', score: 64, tip: 'TypeScript appears in 4 of 7 matches' },
    { name: 'Technical preparation', score: 70, tip: 'Strong fundamentals; practise performance questions' },
    { name: 'Communication practice', score: 58, tip: 'Behavioral answers need STAR structure' },
    { name: 'Interview performance', score: 71, tip: 'Up 19% across 7 mock interviews' },
  ],
}

export const missions = [
  { id: 'm1', title: 'Answer one behavioral question using STAR', meta: 'Interview · 10 min', target: 'studio' },
  { id: 'm2', title: 'Rewrite your campus events app bullet with a result', meta: 'Resume · 8 min', target: 'resume' },
  { id: 'm3', title: 'TypeScript basics: types and interfaces', meta: 'Learning · 20 min · external link', target: 'learning' },
]

export const upcoming = {
  company: 'Lumen Labs',
  role: 'Frontend Developer (Fresher)',
  round: 'Technical round',
  when: 'Fri, May 16 · 10:30',
  inDays: 2,
  prep: 3,
  prepTotal: 5,
}
