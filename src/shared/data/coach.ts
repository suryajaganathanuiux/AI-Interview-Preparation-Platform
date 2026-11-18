// Development-mode sample data. In production every value here comes from the
// API (sessions, evaluations, weaknesses) — the screens never compute scores themselves.

export const AVATAR_CANDIDATE =
  'https://cdn.magicpatterns.com/patterns/generated-images/a1f4992a-7a6b-49b9-8be1-6a4acb4b43fa.jpg'
export const AVATAR_INTERVIEWER =
  'https://cdn.magicpatterns.com/patterns/generated-images/a8c9befa-6fcd-498b-a149-48777db430be.jpg'

export const candidate = {
  name: 'Priya Raman',
  firstName: 'Priya',
  email: 'priya.raman@outlook.com',
  role: 'Frontend Developer · Fresher',
  avatar: AVATAR_CANDIDATE,
  degree: 'B.Tech Computer Science, 2024',
  resume: 'Priya_Raman_Resume_v3.pdf',
}

export type Dimension = 'Relevance' | 'Accuracy' | 'Structure' | 'Completeness' | 'Communication'
export const DIMENSIONS: Dimension[] = ['Relevance', 'Accuracy', 'Structure', 'Completeness', 'Communication']

export const DEFAULT_WEIGHTS: Record<Dimension, number> = {
  Relevance: 25,
  Accuracy: 25,
  Structure: 20,
  Completeness: 15,
  Communication: 15,
}

export const sessions = [
  { id: 's1', date: 'Apr 07', title: 'HR basics', category: 'HR', score: 52, questions: 5, minutes: 22 },
  { id: 's2', date: 'Apr 11', title: 'JavaScript fundamentals', category: 'Technical', score: 55, questions: 5, minutes: 26 },
  { id: 's3', date: 'Apr 16', title: 'Behavioral warm-up', category: 'Behavioral', score: 58, questions: 5, minutes: 24 },
  { id: 's4', date: 'Apr 22', title: 'React & the browser', category: 'Technical', score: 61, questions: 5, minutes: 31 },
  { id: 's5', date: 'Apr 29', title: 'Resume deep-dive', category: 'Resume-Based', score: 60, questions: 5, minutes: 27 },
  { id: 's6', date: 'May 06', title: 'Situational judgement', category: 'Situational', score: 66, questions: 5, minutes: 25 },
  { id: 's7', date: 'May 13', title: 'Frontend mixed round', category: 'Mixed', score: 71, questions: 5, minutes: 28 },
]

export const weeklyPractice = [
  { week: 'Apr 7', minutes: 48 },
  { week: 'Apr 14', minutes: 36 },
  { week: 'Apr 21', minutes: 74 },
  { week: 'Apr 28', minutes: 52 },
  { week: 'May 5', minutes: 61 },
  { week: 'May 12', minutes: 112 },
]

export const skillScores: { dim: Dimension; first: number; latest: number }[] = [
  { dim: 'Relevance', first: 64, latest: 78 },
  { dim: 'Accuracy', first: 58, latest: 70 },
  { dim: 'Structure', first: 41, latest: 54 },
  { dim: 'Completeness', first: 50, latest: 61 },
  { dim: 'Communication', first: 66, latest: 74 },
]

export type WeaknessStatus = 'Newly identified' | 'Needs improvement' | 'In progress' | 'Improving' | 'Resolved'

export const weaknesses: {
  id: string
  name: string
  description: string
  severity: 'High' | 'Medium' | 'Low'
  status: WeaknessStatus
  occurrences: number
  firstSeen: string
  previous: number
  latest: number
  history: number[]
  evidence: string
  action: string
  exercise: string
}[] = [
  {
    id: 'w1',
    name: 'Answer structure',
    description: 'Behavioral answers jump between situation and outcome without a clear sequence.',
    severity: 'High',
    status: 'In progress',
    occurrences: 9,
    firstSeen: 'Apr 07',
    previous: 41,
    latest: 54,
    history: [38, 41, 44, 40, 47, 51, 54],
    evidence: '“So basically we fixed it in the end, but before that there was the deadline and my teammate…”',
    action: 'Practise 3 behavioral questions using STAR, out loud, this week.',
    exercise: 'STAR method drill',
  },
  {
    id: 'w2',
    name: 'Weak project explanation',
    description: 'Project answers describe the tech stack but not your role, decisions, or result.',
    severity: 'Medium',
    status: 'Needs improvement',
    occurrences: 6,
    firstSeen: 'Apr 29',
    previous: 48,
    latest: 52,
    history: [46, 48, 52],
    evidence: '“It was built using React, Firebase and Tailwind and it had a dashboard.”',
    action: 'Rewrite your capstone story: problem → your decision → measurable result.',
    exercise: 'Project narrative builder',
  },
  {
    id: 'w3',
    name: 'Missing examples',
    description: 'Claims like “I’m a good team player” arrive without a concrete situation behind them.',
    severity: 'Medium',
    status: 'Improving',
    occurrences: 5,
    firstSeen: 'Apr 07',
    previous: 45,
    latest: 68,
    history: [42, 45, 58, 63, 68],
    evidence: 'Q4 latest attempt referenced the hackathon deadline — a real example.',
    action: 'Keep one specific example ready for each core competency.',
    exercise: 'Evidence bank',
  },
  {
    id: 'w4',
    name: 'Incomplete technical explanations',
    description: 'Performance answers list techniques without explaining when or why each helps.',
    severity: 'Low',
    status: 'Newly identified',
    occurrences: 2,
    firstSeen: 'May 13',
    previous: 66,
    latest: 69,
    history: [66, 69],
    evidence: 'Mentioned “lazy loading and memo” with no trade-offs.',
    action: 'For each technique, add one sentence on the problem it solves.',
    exercise: 'Explain-the-why drill',
  },
  {
    id: 'w5',
    name: 'Off-topic answers',
    description: 'Answers drifted away from what was asked. Consistently on-topic in the last 4 attempts.',
    severity: 'Low',
    status: 'Resolved',
    occurrences: 4,
    firstSeen: 'Apr 07',
    previous: 55,
    latest: 81,
    history: [55, 62, 76, 79, 80, 81],
    evidence: 'Relevance ≥ 76 across 4 consecutive relevant attempts.',
    action: 'No action needed — still monitored.',
    exercise: '—',
  },
]

export type ReportQuestion = {
  id: string
  question: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  score: number
  answer: string
  dims: Record<Dimension, number>
  strengths: string[]
  weaknesses: string[]
  missing: string[]
  feedback: string
  suggested: string
  confidence: 'High' | 'Medium' | 'Low'
}

export const report = {
  title: 'Frontend mixed round',
  role: 'Frontend Developer',
  category: 'Mixed interview',
  date: 'May 13, 2025',
  duration: '28 min',
  score: 71,
  previousScore: 66,
  model: 'gpt-4.1 · eval-prompt v3.2',
  summary:
    'Your technical fundamentals are solid and clearly explained. The score is held back by two answers about your own experience: the project question and the disagreement question both lacked a clear sequence and a concrete result.',
  strengths: ['Accurate JavaScript fundamentals', 'Clear, plain-language explanations', 'Stayed on-topic throughout'],
  improvements: ['Structure behavioral answers with STAR', 'Explain your own role and result in projects'],
  dims: { Relevance: 82, Accuracy: 76, Structure: 58, Completeness: 64, Communication: 74 } as Record<Dimension, number>,
  questions: [
    {
      id: 'q1',
      question: 'Explain the difference between let, const and var in JavaScript.',
      category: 'Technical',
      difficulty: 'Easy',
      score: 84,
      answer:
        'var is function scoped and gets hoisted, so you can access it before declaration and get undefined. let and const are block scoped. const can’t be reassigned but if it’s an object you can still change its properties. I generally use const by default and let when I need to reassign.',
      dims: { Relevance: 92, Accuracy: 88, Structure: 80, Completeness: 72, Communication: 86 },
      strengths: ['Correct scoping explanation', 'Good practical rule of thumb'],
      weaknesses: [],
      missing: ['Temporal dead zone for let/const'],
      feedback: 'A concise, correct answer. Mentioning the temporal dead zone would make it complete.',
      suggested:
        'Add: “let and const are also hoisted, but sit in a temporal dead zone until declared, so accessing them early throws a ReferenceError instead of returning undefined.”',
      confidence: 'High',
    },
    {
      id: 'q2',
      question: 'Tell me about a project you’re proud of and your role in it.',
      category: 'Resume-Based',
      difficulty: 'Medium',
      score: 58,
      answer:
        'My final year project was a campus events app. It was built using React, Firebase and Tailwind and it had a dashboard for organisers. We were a team of four and it was used for the tech fest.',
      dims: { Relevance: 78, Accuracy: 70, Structure: 50, Completeness: 42, Communication: 62 },
      strengths: ['Named a real, relevant project from your resume'],
      weaknesses: ['Your individual contribution is unclear', 'No outcome or impact given'],
      missing: ['What you personally built', 'A decision you made and why', 'Result (users, feedback, numbers)'],
      feedback:
        'The interviewer learns what the app is, but not what you did. Lead with the problem, then your part, then the result.',
      suggested:
        'Draw only from your verified resume: “Our tech fest relied on spreadsheets for 40+ events. In a team of four I owned the organiser dashboard in React — I chose Firebase listeners so seat counts updated live. It ran during the fest and organisers stopped double-booking rooms.” Replace details with your real ones.',
      confidence: 'Medium',
    },
    {
      id: 'q3',
      question: 'How would you improve the performance of a slow-loading React page?',
      category: 'Technical',
      difficulty: 'Medium',
      score: 69,
      answer:
        'I would check the bundle size and use lazy loading for routes. I’d also use React.memo and useMemo to stop re-renders, and compress the images.',
      dims: { Relevance: 84, Accuracy: 74, Structure: 62, Completeness: 58, Communication: 70 },
      strengths: ['Named appropriate techniques'],
      weaknesses: ['Jumped to fixes before measuring'],
      missing: ['Measuring first (Lighthouse, React Profiler)', 'When memoisation does not help'],
      feedback: 'Good toolbox; start by saying how you’d find the bottleneck, then match the fix to it.',
      suggested:
        '“First I’d measure — Lighthouse for load, the React Profiler for renders. If the bundle is large, split routes with lazy(). If renders are the problem, memoise the expensive components…”',
      confidence: 'High',
    },
    {
      id: 'q4',
      question: 'Describe a time you disagreed with a teammate. How did you handle it?',
      category: 'Behavioral',
      difficulty: 'Medium',
      score: 61,
      answer:
        'So basically we fixed it in the end, but before that there was the deadline and my teammate wanted to use a different library and I thought it would take too long. We talked about it and then we decided to go with mine and it worked out.',
      dims: { Relevance: 80, Accuracy: 66, Structure: 42, Completeness: 56, Communication: 64 },
      strengths: ['Real situation with real stakes'],
      weaknesses: ['Outcome told before the situation', 'How you resolved it is vague'],
      missing: ['Clear situation & task', 'Specific actions you took', 'What you learned'],
      feedback: 'The story is there but out of order. Use STAR: Situation, Task, Action, Result.',
      suggested:
        '“During a 36-hour hackathon (S), I was building the UI while a teammate wanted to switch charting libraries (T). I suggested we each spend 20 minutes prototyping and compare (A). Mine was ready sooner, so we kept it, and we submitted on time (R).”',
      confidence: 'Medium',
    },
    {
      id: 'q5',
      question: 'What happens when you type a URL into the browser and press Enter?',
      category: 'Technical',
      difficulty: 'Medium',
      score: 83,
      answer:
        'The browser looks up the domain through DNS to get the IP, opens a TCP connection and does the TLS handshake for HTTPS, then sends an HTTP request. The server responds with HTML, and the browser parses it, builds the DOM and CSSOM, fetches other resources and renders the page.',
      dims: { Relevance: 90, Accuracy: 86, Structure: 82, Completeness: 76, Communication: 80 },
      strengths: ['Correct order of steps', 'Covered rendering, not just networking'],
      weaknesses: [],
      missing: ['Browser/DNS caching'],
      feedback: 'Well-ordered and accurate. Mentioning caching at each layer would round it out.',
      suggested: 'Add a sentence noting that the browser, OS and resolver caches are checked before a full DNS lookup.',
      confidence: 'High',
    },
  ] as ReportQuestion[],
}

export const retryOfQ4 = {
  date: 'May 14, 2025',
  score: 76,
  answer:
    'During a 36-hour college hackathon, I was building the dashboard UI and a teammate wanted to switch to a different charting library halfway through. My concern was the deadline — we had about ten hours left. I suggested we each spend twenty minutes building the same chart and compare. Mine was working sooner and he agreed to keep it. We submitted on time, and I learned that proposing a quick test works better than arguing about opinions.',
  dims: { Relevance: 86, Accuracy: 74, Structure: 78, Completeness: 70, Communication: 72 } as Record<Dimension, number>,
  improved: ['Clear situation and stakes up front', 'Specific action: time-boxed prototype', 'Result and reflection included'],
  added: ['36-hour hackathon context', '“ten hours left” constraint', 'What you learned'],
  remaining: ['Your teammate’s perspective is still only implied'],
  summary:
    'Structure rose from 42 to 78 — the answer now follows Situation, Task, Action, Result in order. The concrete constraint (“ten hours left”) makes your reasoning credible. One thing left: show you understood why your teammate wanted the switch.',
}

export type BankQuestion = {
  id: string
  question: string
  category: 'Technical' | 'HR' | 'Behavioral' | 'Situational' | 'Resume-Based' | 'Communication'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
  minutes: number
  answered: boolean
  saved: boolean
  why: string
  skills: string[]
  concepts: string[]
}

export const questionBank: BankQuestion[] = [
  {
    id: 'b1',
    question: 'What is the virtual DOM and why does React use it?',
    category: 'Technical',
    difficulty: 'Easy',
    topic: 'React',
    minutes: 2,
    answered: true,
    saved: false,
    why: 'Checks whether you understand what React does for you, not just how to use it.',
    skills: ['Conceptual understanding', 'Clarity'],
    concepts: ['In-memory tree', 'Diffing / reconciliation', 'Batched DOM updates', 'Trade-offs'],
  },
  {
    id: 'b2',
    question: 'Describe a time you had to learn a new technology quickly.',
    category: 'Behavioral',
    difficulty: 'Medium',
    topic: 'Learning agility',
    minutes: 3,
    answered: false,
    saved: true,
    why: 'Freshers are hired on how fast they learn. Interviewers want a concrete, recent example.',
    skills: ['Learning agility', 'Structure (STAR)', 'Self-awareness'],
    concepts: ['Specific situation', 'How you learned', 'What you shipped', 'Reflection'],
  },
  {
    id: 'b3',
    question: 'How does CSS specificity work? Give an example of a conflict.',
    category: 'Technical',
    difficulty: 'Medium',
    topic: 'CSS',
    minutes: 3,
    answered: false,
    saved: false,
    why: 'Styling bugs are daily work for frontend roles; this shows you can debug them.',
    skills: ['Technical accuracy', 'Use of examples'],
    concepts: ['Inline > ID > class > element', 'Order of declaration', '!important', 'Worked example'],
  },
  {
    id: 'b4',
    question: 'Why do you want to work as a frontend developer?',
    category: 'HR',
    difficulty: 'Easy',
    topic: 'Motivation',
    minutes: 2,
    answered: true,
    saved: false,
    why: 'Tests genuine motivation and whether you understand the role.',
    skills: ['Motivation', 'Role understanding'],
    concepts: ['A real moment that sparked interest', 'What the role involves', 'Where you want to grow'],
  },
  {
    id: 'b5',
    question: 'Your deadline is tomorrow and a key API is down. What do you do?',
    category: 'Situational',
    difficulty: 'Medium',
    topic: 'Prioritisation',
    minutes: 3,
    answered: false,
    saved: true,
    why: 'Shows judgement under pressure and whether you communicate early.',
    skills: ['Judgement', 'Communication', 'Problem solving'],
    concepts: ['Inform stakeholders early', 'Mock / fallback data', 'Re-scope', 'Follow-up'],
  },
  {
    id: 'b6',
    question: 'Walk me through the architecture of your campus events app.',
    category: 'Resume-Based',
    difficulty: 'Medium',
    topic: 'Projects',
    minutes: 4,
    answered: true,
    saved: false,
    why: 'Generated from your confirmed resume. Interviewers probe projects to verify depth.',
    skills: ['Project explanation', 'Ownership', 'Technical depth'],
    concepts: ['Problem it solved', 'Your components', 'Data flow', 'A trade-off you made'],
  },
  {
    id: 'b7',
    question: 'Explain closures in JavaScript with a practical example.',
    category: 'Technical',
    difficulty: 'Hard',
    topic: 'JavaScript',
    minutes: 3,
    answered: false,
    saved: false,
    why: 'A classic depth check; a practical example separates memorised and understood.',
    skills: ['Technical accuracy', 'Use of examples'],
    concepts: ['Function + lexical scope', 'Outlives outer call', 'Practical use (counters, handlers)'],
  },
  {
    id: 'b8',
    question: 'How would you explain a technical bug to a non-technical manager?',
    category: 'Communication',
    difficulty: 'Medium',
    topic: 'Stakeholders',
    minutes: 2,
    answered: false,
    saved: false,
    why: 'Frontend developers work closely with design and product; translation matters.',
    skills: ['Clarity', 'Audience awareness'],
    concepts: ['Impact first', 'Avoid jargon', 'Timeline & next step'],
  },
  {
    id: 'b9',
    question: 'Tell me about a mistake you made and what you learned.',
    category: 'Behavioral',
    difficulty: 'Medium',
    topic: 'Self-awareness',
    minutes: 3,
    answered: false,
    saved: false,
    why: 'Tests honesty and growth, without asking you to disclose anything you’re not comfortable with.',
    skills: ['Self-awareness', 'Structure (STAR)'],
    concepts: ['Own the mistake', 'Fix you applied', 'Change in behaviour'],
  },
  {
    id: 'b10',
    question: 'What is the difference between == and === in JavaScript?',
    category: 'Technical',
    difficulty: 'Easy',
    topic: 'JavaScript',
    minutes: 1,
    answered: true,
    saved: false,
    why: 'Quick fundamentals check often used early in a screening round.',
    skills: ['Technical accuracy', 'Concision'],
    concepts: ['Type coercion', 'Strict equality', 'Recommended default'],
  },
]

export const interviewQuestions = [
  { q: 'Explain the difference between let, const and var in JavaScript.', category: 'Technical', difficulty: 'Easy', minutes: 3 },
  { q: 'Tell me about a project you’re proud of and your role in it.', category: 'Resume-Based', difficulty: 'Medium', minutes: 4 },
  { q: 'How would you improve the performance of a slow-loading React page?', category: 'Technical', difficulty: 'Medium', minutes: 4 },
  { q: 'Describe a time you disagreed with a teammate. How did you handle it?', category: 'Behavioral', difficulty: 'Medium', minutes: 4 },
  { q: 'What happens when you type a URL into the browser and press Enter?', category: 'Technical', difficulty: 'Medium', minutes: 4 },
]

export const promptVersions = [
  { version: 'v3.2', status: 'Published', author: 'A. Mehta', date: 'May 02', note: 'Separate factual errors from missing details' },
  { version: 'v3.3', status: 'Draft', author: 'You', date: 'May 14', note: 'Penalise length-padding explicitly' },
  { version: 'v3.1', status: 'Archived', author: 'A. Mehta', date: 'Apr 18', note: 'Add uncertainty indicator to output' },
  { version: 'v3.0', status: 'Archived', author: 'R. Iyer', date: 'Apr 02', note: 'Structured JSON output schema' },
]
