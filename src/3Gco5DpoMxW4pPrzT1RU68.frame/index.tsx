import React, { useState } from 'react'
import { ArrowLeft, Clock, FileText, Keyboard, Mic, Video, Check, Info } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel } from '../shared/components/ui'
import { candidate } from '../shared/data/coach'

export const args = {
  state: 'configure',
  role: 'Frontend Developer',
  category: 'Mixed',
  difficulty: 'Medium',
  questions: 5,
}

export const argTypes = {
  state: { control: 'radio', options: ['configure', 'instructions'] },
  role: { control: 'select', options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'Software Tester', 'HR Executive'] },
  category: { control: 'select', options: ['HR', 'Technical', 'Behavioral', 'Situational', 'Resume-Based', 'Mixed'] },
  difficulty: { control: 'radio', options: ['Easy', 'Medium', 'Hard'] },
  questions: { control: 'select', options: [5, 10, 15] },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void; onStart?: () => void }

export default function InterviewStudio(props: Props) {
  const p = { ...args, ...props }
  const [step, setStep] = useState(p.state)
  const [role, setRole] = useState(p.role)
  const [experience, setExperience] = useState('Fresher')
  const [category, setCategory] = useState(p.category)
  const [difficulty, setDifficulty] = useState(p.difficulty)
  const [count, setCount] = useState(p.questions)
  const [duration, setDuration] = useState(30)
  const [mode, setMode] = useState('Text')
  const [opts, setOpts] = useState({ resume: true, skills: true, followUps: false, learning: false })
  const minutes = Math.max(duration, count * 4)

  if (step === 'instructions') {
    return (
      <AppShell active="studio" title="Interview Studio" onNavigate={p.onNavigate}>
        <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-10">
          <button onClick={() => setStep('configure')} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back to setup
          </button>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">Before you begin</h2>
          <p className="mt-1 text-muted">Treat this like the real thing. You can pause and come back — progress is saved after every answer.</p>

          <Panel className="mt-6 divide-y divide-line">
            {[
              ['Job role', `${role} · ${experience}`],
              ['Interview type', `${category} interview · ${difficulty}`],
              ['Questions', `${count}${opts.followUps ? ' + follow-ups' : ''}`],
              ['Estimated time', `${minutes} minutes`],
              ['Mode', `${mode} answers · ${opts.learning ? 'Learning mode (feedback after each answer)' : 'Practice mode (feedback at the end)'}`],
              ['Personalised from', opts.resume ? `${candidate.resume} (confirmed)` : 'Role only — resume not used'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 px-5 py-3.5 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="w-36 shrink-0 text-sm text-muted">{k}</span>
                <span className="text-sm font-medium">{v}</span>
              </div>
            ))}
          </Panel>

          <h3 className="mt-8 font-semibold">How it works</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-muted">
            {[
              'Questions appear one at a time. There’s a suggested time per question, but no hard cut-off.',
              'Answer in your own words. Length doesn’t raise your score — relevance and structure do.',
              'Your answers are private to you. Scores are AI estimates to guide practice, not a hiring verdict.',
              'If you leave, you can resume from the question you were on.',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => p.onNavigate?.('dashboard')}>
              Cancel
            </Button>
            <Button size="lg" onClick={p.onStart}>
              Start interview
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell active="studio" title="Interview Studio" onNavigate={p.onNavigate}>
      <div className="mx-auto grid max-w-7xl gap-8 p-4 sm:p-6 lg:grid-cols-[1fr_320px] lg:p-8">
        <div className="min-w-0 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Set up a mock interview</h2>
            <p className="mt-1 text-sm text-muted">Questions are generated for this role and level. Nothing is invented about your experience — only confirmed resume details are used.</p>
          </div>

          <Section title="Role and level">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Job role</span>
                <select value={role} onChange={(e) => setRole(e.target.value)} className={SELECT}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <div>
                <span className="mb-1.5 block text-sm font-medium">Experience level</span>
                <Segmented options={['Fresher', '0–1 yr', '1–3 yrs', '3–5 yrs']} value={experience} onChange={setExperience} />
              </div>
            </div>
          </Section>

          <Section title="Interview type">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCategory(c.name)}
                  aria-pressed={category === c.name}
                  className={`rounded-lg border p-3 text-left transition-colors duration-150 ${
                    category === c.name ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-subtle'
                  }`}
                >
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{c.d}</p>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Length and difficulty">
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <span className="mb-1.5 block text-sm font-medium">Difficulty</span>
                <Segmented options={['Easy', 'Medium', 'Hard']} value={difficulty} onChange={setDifficulty} />
              </div>
              <div>
                <span className="mb-1.5 block text-sm font-medium">Questions</span>
                <Segmented options={['5', '10', '15']} value={String(count)} onChange={(v) => setCount(Number(v))} />
              </div>
              <div>
                <span className="mb-1.5 block text-sm font-medium">Duration</span>
                <Segmented options={['15', '30', '45', '60']} value={String(duration)} onChange={(v) => setDuration(Number(v))} suffix="m" />
              </div>
            </div>
          </Section>

          <Section title="Answer mode">
            <div className="grid gap-2 sm:grid-cols-3">
              {MODES.map((m) => {
                const Icon = m.icon
                const selected = mode === m.name
                return (
                  <button
                    key={m.name}
                    disabled={!!m.soon}
                    onClick={() => setMode(m.name)}
                    aria-pressed={selected}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected ? 'border-primary bg-primary-soft' : 'border-line bg-surface enabled:hover:border-subtle'
                    }`}
                  >
                    <Icon className={`mt-0.5 h-4 w-4 ${selected ? 'text-primary' : 'text-muted'}`} />
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {m.name} {m.soon && <Badge tone="neutral">{m.soon}</Badge>}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{m.d}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="Options">
            <div className="divide-y divide-line rounded-lg border border-line bg-surface">
              <Toggle checked={opts.resume} onChange={(v) => setOpts({ ...opts, resume: v })} label="Use my resume" hint={`${candidate.resume} · confirmed Apr 28`} />
              <Toggle checked={opts.skills} onChange={(v) => setOpts({ ...opts, skills: v })} label="Focus on my selected skills" hint="React, JavaScript, CSS, REST APIs" />
              <Toggle checked={opts.followUps} onChange={(v) => setOpts({ ...opts, followUps: v })} label="Include follow-up questions" hint="The interviewer may probe one answer further" />
              <Toggle checked={opts.learning} onChange={(v) => setOpts({ ...opts, learning: v })} label="Learning mode" hint="See feedback after each answer instead of at the end" />
            </div>
          </Section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Panel className="p-5">
            <h3 className="font-semibold">Your interview</h3>
            <p className="mt-3 text-lg font-semibold leading-snug">{role}</p>
            <p className="text-sm text-muted">
              {category} · {difficulty} · {experience}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-canvas p-3">
                <FileText className="h-4 w-4 text-muted" />
                <p className="mt-2 font-semibold">{count} questions</p>
              </div>
              <div className="rounded-lg bg-canvas p-3">
                <Clock className="h-4 w-4 text-muted" />
                <p className="mt-2 font-semibold">~{minutes} min</p>
              </div>
            </div>
            {count * 4 > duration && (
              <p className="mt-3 flex gap-2 text-xs text-muted">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {count} questions usually need about {count * 4} minutes, so we’ve extended the estimate.
              </p>
            )}
            <Button size="lg" className="mt-5 w-full" onClick={() => setStep('instructions')}>
              Continue
            </Button>
            <button className="mt-2 w-full rounded-lg py-2 text-sm font-medium text-muted hover:text-ink">Save as template</button>
          </Panel>
        </aside>
      </div>
    </AppShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </section>
  )
}

function Segmented({ options, value, onChange, suffix = '' }: { options: string[]; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <div className="flex rounded-lg border border-line bg-surface p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-sm transition-colors duration-150 ${
            value === o ? 'bg-navy font-medium text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {o}
          {suffix}
        </button>
      ))}
    </div>
  )
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted">{hint}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150 ${checked ? 'bg-primary' : 'bg-line'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out-strong ${checked ? 'translate-x-4' : ''}`}
        />
      </button>
    </label>
  )
}

const SELECT =
  'h-[42px] w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Data Analyst',
  'Software Tester',
  'Java Developer',
  'Python Developer',
  'Digital Marketing Executive',
  'HR Executive',
]

const CATEGORIES = [
  { name: 'HR', d: 'Motivation, fit, expectations' },
  { name: 'Technical', d: 'Concepts for your role' },
  { name: 'Behavioral', d: 'Past situations, STAR' },
  { name: 'Situational', d: 'What would you do if…' },
  { name: 'Resume-Based', d: 'Your projects and choices' },
  { name: 'Mixed', d: 'A realistic blend' },
]

const MODES = [
  { name: 'Text', d: 'Type your answers', icon: Keyboard, soon: '' },
  { name: 'Voice', d: 'Speak, with transcript', icon: Mic, soon: 'Release 2' },
  { name: 'Video', d: 'Camera + voice', icon: Video, soon: 'Release 3' },
]
