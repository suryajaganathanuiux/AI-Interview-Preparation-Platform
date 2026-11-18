import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Check, Cloud, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '../shared/components/ui'
import { GoalsStep, PersonalStep, EducationStep, ExperienceStep, SkillsStep } from './components/ProfileSteps'
import { ResumeStep, PreferencesStep, InterviewStep, AssessmentStep, DoneStep } from './components/CareerSteps'
import { initialData, OnboardingData } from './components/data'

export const args = {
  step: 1,
  resumeState: 'extracted',
}

export const argTypes = {
  step: { control: 'range', min: 1, max: 10, step: 1 },
  resumeState: { control: 'radio', options: ['empty', 'uploading', 'extracted'] },
}

type Props = Partial<typeof args> & { onFinish?: () => void; onExit?: () => void }

export default function Onboarding(props: Props) {
  const p = { ...args, ...props }
  const [step, setStep] = useState(Math.min(Math.max(p.step, 1), STEPS.length))
  const [data, setData] = useState<OnboardingData>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState('just now')
  const [done, setDone] = useState<number[]>(() => Array.from({ length: Math.max(p.step - 1, 0) }, (_, i) => i + 1))
  const meta = STEPS[step - 1]
  const set = (patch: Partial<OnboardingData>) => {
    setData((d) => ({ ...d, ...patch }))
    setError(null)
    setSavedAt('just now')
  }

  const validate = (): string | null => {
    if (step === 1 && data.goals.length === 0) return 'Choose at least one goal so we know where to start.'
    if (step === 2 && (!data.name.trim() || !data.location.trim())) return 'Full name and location are required.'
    if (step === 4 && !data.level) return 'Choose your experience level.'
    if (step === 5 && data.skills.length < 3) return 'Add at least 3 skills — job matching needs them.'
    return null
  }

  const next = () => {
    const e = validate()
    if (e) return setError(e)
    setDone((d) => (d.includes(step) ? d : [...d, step]))
    if (step === STEPS.length) return p.onFinish?.()
    setStep(step + 1)
  }
  const back = () => {
    setError(null)
    setStep(Math.max(1, step - 1))
  }

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-surface px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Compass className="h-4 w-4" />
          </span>
          <span className="hidden font-semibold sm:inline">AI Career Coach</span>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted">
          <Cloud className="h-3.5 w-3.5" /> Saved {savedAt}
        </span>
        {step < STEPS.length && (
          <Button variant="ghost" size="sm" onClick={p.onExit}>
            Save & finish later
          </Button>
        )}
      </header>

      {/* Mobile progress */}
      <div className="border-b border-line bg-surface px-4 py-3 lg:hidden">
        <div className="flex justify-between text-xs">
          <span className="font-medium">{meta.label}</span>
          <span className="text-muted">
            {step} / {STEPS.length}
          </span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-line">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out-strong" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Step rail */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-line bg-surface p-5 lg:block">
          <p className="text-xs font-medium text-muted">Your career profile</p>
          <ol className="mt-4 space-y-1">
            {STEPS.map((s, i) => {
              const n = i + 1
              const isDone = done.includes(n) && n !== step
              const current = n === step
              const reachable = isDone || current || done.includes(n - 1)
              return (
                <li key={s.label}>
                  <button
                    disabled={!reachable}
                    onClick={() => {
                      setError(null)
                      setStep(n)
                    }}
                    aria-current={current ? 'step' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors duration-150 disabled:cursor-default ${
                      current ? 'bg-primary-soft font-medium text-primary' : reachable ? 'text-ink hover:bg-canvas' : 'text-subtle'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        isDone ? 'bg-success text-white' : current ? 'bg-primary text-white' : 'border border-line'
                      }`}
                    >
                      {isDone ? <Check className="h-3 w-3" /> : n}
                    </span>
                    <span className="truncate">{s.label}</span>
                    {s.optional && !isDone && !current && <span className="ml-auto text-[10px] text-subtle">optional</span>}
                  </button>
                </li>
              )
            })}
          </ol>
        </aside>

        {/* Step */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10"
              >
                {step !== STEPS.length && (
                  <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{meta.title}</h1>
                    <p className="mt-2 text-muted">{meta.description}</p>
                  </div>
                )}
                {step === 1 && <GoalsStep d={data} set={set} />}
                {step === 2 && <PersonalStep d={data} set={set} />}
                {step === 3 && <EducationStep d={data} set={set} />}
                {step === 4 && <ExperienceStep d={data} set={set} />}
                {step === 5 && <SkillsStep d={data} set={set} />}
                {step === 6 && <ResumeStep d={data} set={set} initial={p.resumeState} />}
                {step === 7 && <PreferencesStep d={data} set={set} />}
                {step === 8 && <InterviewStep d={data} set={set} />}
                {step === 9 && <AssessmentStep d={data} />}
                {step === 10 && <DoneStep d={data} onFinish={p.onFinish} />}
                {error && (
                  <p role="alert" className="mt-6 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
                    {error}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < STEPS.length && (
            <footer className="flex shrink-0 items-center gap-2 border-t border-line bg-surface px-4 py-3 sm:px-8">
              <Button variant="ghost" onClick={back} disabled={step === 1}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <div className="ml-auto flex gap-2">
                {meta.optional && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setError(null)
                      setStep(step + 1)
                    }}
                  >
                    Skip for now
                  </Button>
                )}
                <Button onClick={next}>
                  {step === 9 ? 'Looks right' : 'Continue'} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  )
}

const STEPS = [
  { label: 'Goals', title: 'Welcome! Let’s build your career journey.', description: 'Your AI Career Agent will help you find opportunities, improve your profile and prepare for interviews. What do you want help with? Pick any.' },
  { label: 'Personal info', title: 'About you', description: 'Pre-filled from your Google account where possible. Phone and photo are optional.' },
  { label: 'Education', title: 'Education', description: 'Add every degree or diploma you want employers to see.', optional: true },
  { label: 'Experience', title: 'Experience', description: 'This sets which jobs and interview questions are realistic for you.' },
  { label: 'Skills', title: 'Your skills', description: 'Suggestions are based on Frontend Developer. Keep only the ones you can talk about in an interview.' },
  { label: 'Resume', title: 'Upload your resume', description: 'We’ll extract details for you to check. Nothing is used until you confirm it.', optional: true },
  { label: 'Job preferences', title: 'What are you looking for?', description: 'Used to rank job matches. You can change these any time.', optional: true },
  { label: 'Interview experience', title: 'Your interview experience so far', description: 'Helps us start your practice at the right level.', optional: true },
  { label: 'AI assessment', title: 'Your initial career assessment', description: 'Generated by AI from what you confirmed. It’s a starting point to discuss, not a verdict.' },
  { label: 'Done', title: '', description: '' },
]
