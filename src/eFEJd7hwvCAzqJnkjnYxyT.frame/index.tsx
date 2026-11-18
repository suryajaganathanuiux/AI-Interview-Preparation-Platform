import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Sparkles, ArrowRight, Menu, X, ChevronDown, Lock, EyeOff, Trash2, UserCheck, ShieldCheck, Check, Info } from 'lucide-react'
import { Button } from '../shared/components/ui'
import { readiness, jobs } from '../shared/data/career'

export const args = {
  openFaq: 0,
}

export const argTypes = {
  openFaq: { control: 'range', min: -1, max: 4, step: 1 },
}

type Props = Partial<typeof args> & { onGetStarted?: () => void; onLogin?: () => void }

export default function LandingPage(props: Props) {
  const p = { ...args, ...props }
  const [menu, setMenu] = useState(false)
  const [faq, setFaq] = useState(p.openFaq)
  const [prep, setPrep] = useState(0)

  return (
    <div className="h-screen overflow-y-auto scroll-smooth bg-surface text-ink">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Compass className="h-4 w-4" />
            </span>
            <span className="font-semibold">AI Career Coach</span>
          </a>
          <nav className="hidden flex-1 items-center gap-6 text-sm text-muted md:flex">
            {NAV.map(([label, href]) => (
              <a key={label} href={href} className="transition-colors duration-150 hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={p.onLogin}>
              Log in
            </Button>
            <Button onClick={p.onGetStarted}>Get started</Button>
          </div>
          <button className="ml-auto rounded-md p-2 text-muted md:hidden" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}>
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menu && (
          <div className="border-t border-line px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm">
              {NAV.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenu(false)}>
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={p.onLogin}>
                Log in
              </Button>
              <Button onClick={p.onGetStarted}>Get started</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="border-b border-line bg-canvas">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-24">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]">Your Career Journey, Powered by AI.</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Discover opportunities, build a stronger resume, practice interviews and become career-ready with your personal AI Career Coach.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={p.onGetStarted}>
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
              <a href="#features" className="inline-flex h-12 items-center rounded-lg border border-line bg-surface px-5 text-sm font-medium hover:bg-canvas">
                Explore Features
              </a>
            </div>
            <p className="mt-6 text-sm text-muted">Built for students, freshers and early-career professionals.</p>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight">One profile. Every step from search to offer.</h2>
        <p className="mt-3 max-w-xl text-muted">You set up your profile once. Job matching, your resume, interview practice and progress tracking all work from it.</p>
        <ol className="mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative md:pr-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{i + 1}</span>
                {i < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-line md:block" />}
              </div>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* NOVA */}
      <section id="features" className="border-y border-line bg-canvas">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium text-primary">AI Career Agent</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Meet NOVA. It does the work, you make the calls.</h2>
            <p className="mt-4 text-muted">
              Ask in plain language. NOVA searches authorised job sources, tailors your resume from what you’ve confirmed, builds interview prep around a real job — and asks before it saves or sends anything.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {['Explains why each job matches you', 'Never invents experience, vacancies or salaries', 'Every action needs your approval and can be undone'].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white">Find fresher UI/UX designer jobs in Chennai</p>
            </div>
            <div className="mt-4 flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p>I found 4 open roles. The top match uses Figma and user research — both in your profile. You’re missing a portfolio link, which 3 of them ask for.</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['UI/UX Designer', 'Fresher', 'Chennai', 'Figma'].map((c) => (
                    <span key={c} className="rounded-md bg-line-soft px-2 py-0.5 text-xs text-muted">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-line p-2.5 text-xs text-muted">
                  <Info className="h-3.5 w-3.5 shrink-0" /> Source and last-verified time shown on every job card.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs + Resume */}
      <section id="jobs" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 space-y-3 lg:order-1">
            {jobs.slice(0, 2).map((j) => (
              <div key={j.id} className="rounded-xl border border-line bg-surface p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{j.title}</p>
                    <p className="text-sm text-muted">
                      {j.company} · {j.location} · {j.mode}
                    </p>
                  </div>
                  <span className="rounded-md bg-primary-soft px-2 py-1 text-sm font-semibold text-primary">{j.fit}% fit</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  {j.matching.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-md bg-success-soft px-2 py-0.5 text-success-ink">
                      {s}
                    </span>
                  ))}
                  {j.missing.slice(0, 1).map((s) => (
                    <span key={s} className="rounded-md bg-warning-soft px-2 py-0.5 text-warning">
                      Missing: {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted">Illustrative example. Fit scores show how well your profile matches a listing — not your chance of being hired.</p>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-medium text-primary">Smart Job Matching</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">See why a job fits — and what’s missing.</h2>
            <p className="mt-4 text-muted">
              Every match shows the skills you have, the ones you partly have and the ones you don’t, with the scoring method one click away. Fresher-friendly roles are labelled, and expired listings are marked, never hidden.
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium text-primary">AI Resume Builder</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">A version of your resume for every job, without the made-up keywords.</h2>
            <p className="mt-4 text-muted">
              Pick an ATS-friendly template, then tailor it to a job. Suggestions only use what you’ve confirmed. If the job wants a skill you don’t have, we tell you instead of adding it.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
            <p className="text-xs font-medium text-muted">Suggested change · Projects</p>
            <p className="mt-3 rounded-md bg-danger-soft px-3 py-2 text-sm text-ink/70 line-through decoration-danger/50">
              Built a campus events app using React and Firebase.
            </p>
            <p className="mt-2 rounded-md bg-success-soft px-3 py-2 text-sm">
              Built the organiser dashboard for a campus events app in React; live seat counts via Firebase replaced spreadsheet booking for 40+ events.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white">Accept</span>
              <span className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted">Reject</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prepare */}
      <section id="interview" className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight">Practise like it’s real. Improve where it counts.</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr]">
            <div className="flex flex-col gap-2" role="tablist">
              {PREP.map((x, i) => (
                <button
                  key={x.t}
                  role="tab"
                  aria-selected={prep === i}
                  onClick={() => setPrep(i)}
                  className={`rounded-xl border p-4 text-left transition-colors duration-150 ${prep === i ? 'border-secondary bg-surface' : 'border-transparent hover:bg-surface/70'}`}
                >
                  <p className="font-semibold">{x.t}</p>
                  <p className="mt-1 text-sm text-muted">{x.d}</p>
                </button>
              ))}
            </div>
            <div className="min-h-72 rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={prep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  {prep === 0 && <InterviewPreview />}
                  {prep === 1 && <SkillGapPreview />}
                  {prep === 2 && <TrackingPreview />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Your data, your career, your decisions.</h2>
            <p className="mt-4 text-muted">AI should support your judgement, not replace it. These commitments are built into how the product works.</p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {TRUST.map((t) => {
              const Icon = t.icon
              return (
                <li key={t.t} className="flex gap-4 py-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
                  <div>
                    <p className="font-semibold">{t.t}</p>
                    <p className="mt-1 text-sm text-muted">{t.d}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="about" className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Questions</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {FAQ.map((f, i) => (
              <li key={f.q}>
                <button onClick={() => setFaq(faq === i ? -1 : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium">
                  {f.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${faq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {faq === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <span className="block pb-5 text-sm leading-relaxed text-muted">{f.a}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA + footer */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-lg text-2xl font-semibold text-white sm:text-3xl">Set up your career profile in about 8 minutes.</h2>
          <button onClick={p.onGetStarted} className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-primary hover:bg-primary-soft">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-muted md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" /> <span className="font-medium text-ink">AI Career Coach</span> · © 2025
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#trust" className="hover:text-ink">Trust & privacy</a>
            <a href="#about" className="hover:text-ink">FAQ</a>
            <a className="hover:text-ink">Terms</a>
            <a className="hover:text-ink">Contact support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-xl shadow-navy/5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Career readiness</p>
          <span className="text-xs text-success-ink">+6 this month</span>
        </div>
        <div className="mt-4 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-semibold tracking-tight">{readiness.overall}</span>
            <span className="text-sm text-muted">/100</span>
          </div>
          <ul className="space-y-2">
            {readiness.dims.slice(0, 4).map((d) => (
              <li key={d.name} className="grid grid-cols-[1fr_90px] items-center gap-3 text-xs">
                <span className="truncate text-muted">{d.name}</span>
                <span className="h-1.5 rounded-full bg-line-soft">
                  <span className="block h-full rounded-full bg-secondary" style={{ width: `${d.score}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-xs font-medium text-muted">Today’s mission</p>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center gap-2.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-white">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-muted line-through">Answer one STAR question</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-4 w-4 rounded-full border border-line" /> Rewrite one project bullet
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-line bg-surface p-4 shadow-lg shadow-navy/5 lg:absolute lg:-bottom-10 lg:-left-10 lg:mt-0 lg:w-72">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> NOVA
        </div>
        <p className="mt-1.5 text-sm">Your Lumen Labs interview is Friday. Want a 3-day prep plan built from the job description?</p>
      </div>
    </div>
  )
}

function InterviewPreview() {
  return (
    <div>
      <p className="text-xs text-muted">Question 4 of 5 · Behavioral</p>
      <p className="mt-2 text-lg font-semibold">Describe a time you disagreed with a teammate. How did you handle it?</p>
      <div className="mt-5 grid grid-cols-5 gap-2 text-center text-xs">
        {[
          ['Relevance', 86],
          ['Accuracy', 74],
          ['Structure', 78],
          ['Complete', 70],
          ['Clarity', 72],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-lg bg-canvas p-2">
            <p className="text-base font-semibold">{v}</p>
            <p className="truncate text-muted">{k}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">Structure rose from 42 to 78 on retry — the answer now follows Situation, Task, Action, Result.</p>
    </div>
  )
}

function SkillGapPreview() {
  return (
    <div>
      <p className="text-sm font-semibold">Frontend Developer · 7 matched jobs</p>
      <ul className="mt-4 space-y-3 text-sm">
        {[
          ['React', 'Have', 'success'],
          ['REST APIs', 'Have', 'success'],
          ['Testing', 'Partial', 'warning'],
          ['TypeScript', 'Missing · high priority', 'danger'],
        ].map(([s, st, tone]) => (
          <li key={s} className="flex items-center justify-between border-b border-line pb-2">
            <span>{s}</span>
            <span className={`text-xs font-medium ${tone === 'success' ? 'text-success-ink' : tone === 'warning' ? 'text-warning' : 'text-danger'}`}>{st}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">Each gap links to a learning step and practice questions.</p>
    </div>
  )
}

function TrackingPreview() {
  const pts = [52, 55, 58, 61, 60, 66, 71]
  return (
    <div>
      <p className="text-sm font-semibold">Interview score across 7 sessions</p>
      <svg viewBox="0 0 300 100" className="mt-4 h-40 w-full" preserveAspectRatio="none" aria-hidden>
        <path
          d={pts.map((v, i) => `${i ? 'L' : 'M'}${i * 50},${100 - (v - 45) * 3}`).join(' ')}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="mt-2 text-sm text-muted">Recurring weaknesses are tracked too, and only marked resolved after consistent improvement.</p>
    </div>
  )
}

const NAV = [
  ['Home', '#top'],
  ['Features', '#features'],
  ['AI Interview', '#interview'],
  ['Job Search', '#jobs'],
  ['About', '#about'],
] as const

const STEPS = [
  { t: 'Build your profile', d: 'Goals, education, skills and resume — confirmed by you, so nothing is assumed.' },
  { t: 'Find the right roles', d: 'Matches from authorised sources, with fit explained and gaps called out.' },
  { t: 'Prepare with AI', d: 'Tailor your resume and practise interviews for the specific job.' },
  { t: 'Apply and grow', d: 'Track every application and watch your readiness improve.' },
]

const PREP = [
  { t: 'Mock interviews', d: 'Role-specific questions with evidence-based feedback on every answer.' },
  { t: 'Skill gap analysis', d: 'Compare your skills with the jobs you want, ranked by priority.' },
  { t: 'Performance tracking', d: 'Scores, weaknesses and readiness over time.' },
]

const TRUST = [
  { icon: UserCheck, t: 'You approve every action', d: 'NOVA never applies to jobs or sends messages for you without explicit approval.' },
  { icon: EyeOff, t: 'No judging who you are', d: 'We don’t score personality, accent, appearance or intelligence. Recording is always optional.' },
  { icon: Lock, t: 'Private by default', d: 'Resumes and recordings are encrypted, and are never used to train AI without your separate consent.' },
  { icon: Trash2, t: 'Leave with your data', d: 'Export everything or delete your account from the Trust Center at any time.' },
]

const FAQ = [
  { q: 'Is it free?', a: 'Profile setup, job matching and a weekly set of mock interviews are free. Paid plans are not available yet.' },
  { q: 'Where do the job listings come from?', a: 'Only from authorised job APIs, approved partner feeds and employer listings managed by our team. Every listing shows its source and when it was last verified.' },
  { q: 'Will the AI apply to jobs for me?', a: 'Not unless you turn on assisted applications and approve each one. By default you apply on the employer’s site and record it in your tracker.' },
  { q: 'How accurate are the interview scores?', a: 'They are AI estimates against published criteria, with the evidence shown. They guide practice; they don’t predict hiring outcomes. You can report any feedback you think is wrong.' },
  { q: 'Can I delete my data?', a: 'Yes. Export or delete your resume, recordings, conversations or whole account from the Trust Center.' },
]
