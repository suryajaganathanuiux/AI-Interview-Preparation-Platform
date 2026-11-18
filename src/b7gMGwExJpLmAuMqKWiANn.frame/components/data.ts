export type Education = { id: string; level: string; degree: string; specialization: string; college: string; year: string; score: string }

export type OnboardingData = {
  goals: string[]
  name: string
  phone: string
  location: string
  country: string
  language: string
  education: Education[]
  level: string
  internships: string
  projects: string
  certifications: string
  company: string
  jobTitle: string
  period: string
  responsibilities: string
  skills: string[]
  titles: string[]
  locations: string[]
  modes: string[]
  salaryMin: number
  salaryMax: number
  employment: string[]
  relocate: string
  status: string
  attended: string
  interviewCount: string
  rounds: string[]
  difficult: string
  improve: string[]
  practiceMode: string
}

export const initialData: OnboardingData = {
  goals: ['Find a job', 'Prepare for interviews'],
  name: 'Riya Raman',
  phone: '',
  location: 'Chennai',
  country: 'India',
  language: 'English',
  education: [
    { id: 'e1', level: 'Bachelor’s', degree: 'B.Tech', specialization: 'Computer Science', college: 'Anna University – CEG', year: '2024', score: '8.1 CGPA' },
  ],
  level: 'Fresher',
  internships: 'Frontend intern, Tessel Web (Jun–Aug 2023)',
  projects: 'Campus events app (React, Firebase); Weather dashboard (JavaScript, REST API)',
  certifications: 'Meta Front-End Developer (Coursera)',
  company: '',
  jobTitle: '',
  period: '',
  responsibilities: '',
  skills: ['React', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Git', 'Figma'],
  titles: ['Frontend Developer', 'UI Developer'],
  locations: ['Chennai', 'Bengaluru', 'Remote'],
  modes: ['Hybrid', 'Remote'],
  salaryMin: 4,
  salaryMax: 7,
  employment: ['Full-time'],
  relocate: 'Within South India',
  status: 'Actively looking',
  attended: 'Yes',
  interviewCount: '3–5',
  rounds: ['HR', 'Technical'],
  difficult: 'Explaining my projects clearly and structuring behavioral answers.',
  improve: ['Answer structure', 'Project explanation'],
  practiceMode: 'Text',
}
