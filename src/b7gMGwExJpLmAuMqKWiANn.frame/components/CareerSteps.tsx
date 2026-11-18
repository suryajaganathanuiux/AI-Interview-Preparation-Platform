import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, FileText, Check, Pencil, RefreshCw, Sparkles, Info, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '../../shared/components/ui'
import { Field, inputCls, textareaCls, Chips, TagInput } from './fields'
import type { OnboardingData } from './data'

type StepProps = { d: OnboardingData; set: (p: Partial<OnboardingData>) => void }

export function ResumeStep({ initial }: StepProps & { initial: string }) {
  const [state, setState] = useState(initial)
  const [progress, setProgress] = useState(initial === 'uploading' ? 45 : 0)
  const [dragging, setDragging] = useState(false)
  const [confirmed, setConfirmed] = useState<string[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [values, setValues] = useState(EXTRACTED)

  useEffect(() => {
    if (state !== 'uploading') return
    if (progress >= 100) {
      const t = setTimeout(() => setState('extracted'), 300)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setProgress((p) => Math.min(p + 18, 100)), 220)
    return () => clearTimeout(t)
  }, [state, progress])

  const start = () => {
    setProgress(0)
    setState('uploading')
  }

  if (state === 'empty') {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          start()
        }}
        className={`flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors duration-150 ${
          dragging ? 'border-primary bg-primary-soft' : 'border-line bg-surface'
        }`}
      >
        <UploadCloud className="h-9 w-9 text-primary" />
        <p className="mt-4 font-semibold">Drag your resume here</p>
        <p className="mt-1 text-sm text-muted">PDF or DOCX, up to 5 MB</p>
        <Button className="mt-5" onClick={start}>
          Browse files
        </Button>
        <p className="mt-6 max-w-sm text-xs text-muted">Stored encrypted. Only you can see it. You can delete it any time from the Trust Center.</p>
      </div>
    )
  }

  if (state === 'uploading') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Priya_Raman_Resume_v3.pdf</p>
            <p className="text-xs text-muted">{progress < 100 ? `Uploading… ${progress}%` : 'Reading your resume…'}</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out-strong" style={{ width: `${progress}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4">
        <FileText className="h-8 w-8 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">Priya_Raman_Resume_v3.pdf</p>
          <p className="text-xs text-muted">2 pages · 184 KB · uploaded just now</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setState('empty')}>
          <RefreshCw className="h-3.5 w-3.5" /> Replace
        </Button>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg bg-primary-soft p-3 text-sm text-primary">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        AI extraction can misread layouts. Confirm each section, or edit it first. Unconfirmed sections won’t be used for job matching or interview questions.
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {Object.entries(values).map(([k, v]) => {
          const ok = confirmed.includes(k)
          return (
            <li key={k} className="px-4 py-4 sm:px-5">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted">{k}</p>
                  {editing === k ? (
                    <textarea
                      autoFocus
                      rows={2}
                      value={v}
                      onChange={(e) => setValues({ ...values, [k]: e.target.value })}
                      className={`${textareaCls} mt-1.5`}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{v}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {editing === k ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditing(null)
                        setConfirmed((c) => (c.includes(k) ? c : [...c, k]))
                      }}
                    >
                      Save
                    </Button>
                  ) : ok ? (
                    <span className="flex h-8 items-center gap-1 px-2 text-xs font-medium text-success-ink">
                      <Check className="h-3.5 w-3.5" /> Confirmed
                    </span>
                  ) : (
                    <>
                      <button onClick={() => setEditing(k)} className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-ink" aria-label={`Edit ${k}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <Button size="sm" variant="secondary" onClick={() => setConfirmed((c) => [...c, k])}>
                        Confirm
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          {confirmed.length} of {Object.keys(values).length} confirmed
        </span>
        {confirmed.length < Object.keys(values).length && (
          <button onClick={() => setConfirmed(Object.keys(values))} className="font-medium text-primary hover:underline">
            Confirm all
          </button>
        )}
      </div>
    </div>
  )
}

export function PreferencesStep({ d, set }: StepProps) {
  return (
    <div className="space-y-7">
      <Field label="Preferred job titles">
        <TagInput value={d.titles} onChange={(v) => set({ titles: v })} placeholder="e.g. Frontend Developer" suggestions={['React Developer', 'Web Developer']} />
      </Field>
      <Field label="Preferred locations">
        <TagInput value={d.locations} onChange={(v) => set({ locations: v })} placeholder="Add a city" suggestions={['Hyderabad', 'Coimbatore']} />
      </Field>
      <div>
        <p className="mb-2 text-sm font-medium">Work mode</p>
        <Chips options={['Office', 'Hybrid', 'Remote']} value={d.modes} onChange={(v) => set({ modes: v })} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Employment type</p>
        <Chips options={['Full-time', 'Internship', 'Contract', 'Part-time']} value={d.employment} onChange={(v) => set({ employment: v })} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Expected salary (LPA)" hint="Only used to filter. Never shown to employers.">
          <div className="flex items-center gap-2">
            <input type="number" min={0} value={d.salaryMin} onChange={(e) => set({ salaryMin: Number(e.target.value) })} className={inputCls} aria-label="Minimum" />
            <span className="text-muted">to</span>
            <input type="number" min={0} value={d.salaryMax} onChange={(e) => set({ salaryMax: Number(e.target.value) })} className={inputCls} aria-label="Maximum" />
          </div>
        </Field>
        <Field label="Willing to relocate?">
          <select value={d.relocate} onChange={(e) => set({ relocate: e.target.value })} className={inputCls}>
            {['No', 'Within my state', 'Within South India', 'Anywhere in India', 'Internationally'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Job search status" className="sm:col-span-2">
          <select value={d.status} onChange={(e) => set({ status: e.target.value })} className={inputCls}>
            {['Actively looking', 'Open to offers', 'Just exploring', 'Not looking right now'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  )
}

export function InterviewStep({ d, set }: StepProps) {
  return (
    <div className="space-y-7">
      <div>
        <p className="mb-2 text-sm font-medium">Have you attended job interviews?</p>
        <Chips options={['Yes', 'Not yet']} value={[d.attended]} onChange={(v) => set({ attended: v[0] })} multi={false} />
      </div>
      {d.attended === 'Yes' && (
        <>
          <div>
            <p className="mb-2 text-sm font-medium">How many?</p>
            <Chips options={['1–2', '3–5', '6–10', 'More than 10']} value={[d.interviewCount]} onChange={(v) => set({ interviewCount: v[0] })} multi={false} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Which rounds have you faced?</p>
            <Chips options={['Aptitude', 'HR', 'Technical', 'Coding test', 'Group discussion', 'Managerial']} value={d.rounds} onChange={(v) => set({ rounds: v })} />
          </div>
          <Field label="What was difficult?" optional>
            <textarea rows={3} value={d.difficult} onChange={(e) => set({ difficult: e.target.value })} className={textareaCls} />
          </Field>
        </>
      )}
      <div>
        <p className="mb-2 text-sm font-medium">What do you want to improve?</p>
        <Chips options={['Answer structure', 'Technical depth', 'Project explanation', 'Confidence', 'HR questions', 'Communication']} value={d.improve} onChange={(v) => set({ improve: v })} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Preferred practice mode</p>
        <Chips options={['Text', 'Voice', 'Video']} value={[d.practiceMode]} onChange={(v) => set({ practiceMode: v[0] })} multi={false} />
        {d.practiceMode !== 'Text' && <p className="mt-2 text-xs text-muted">We’ll ask for recording consent before your first {d.practiceMode.toLowerCase()} session. Text practice is always available.</p>}
      </div>
    </div>
  )
}

export function AssessmentStep({ d }: { d: OnboardingData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI-generated from your confirmed details
        </div>
        <p className="mt-3 text-lg font-semibold leading-snug">
          {d.level} {d.titles[0] ?? 'candidate'} in {d.location}, with hands-on React project work and one frontend internship.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <List title="Strengths we can see" tone="bg-success" items={['Core frontend stack: React, JavaScript, CSS', 'Real project used by others (campus events app)', 'Internship with API integration work']} />
          <List title="Possible skill gaps" tone="bg-warning-base" items={['TypeScript — common in frontend listings', 'Testing (Jest) — no mention yet', 'Behavioral answer structure — you flagged this']} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-sm font-semibold">Job categories worth exploring</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Frontend Developer', 'UI Developer', 'React Developer', 'Web Developer'].map((c) => (
              <span key={c} className="rounded-md bg-line-soft px-2.5 py-1 text-sm">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-sm font-semibold">Resume completeness</p>
          <p className="mt-2 text-3xl font-semibold">72%</p>
          <p className="text-xs text-muted">Missing: summary, project results</p>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="text-sm font-semibold">Recommended first steps</p>
        <ol className="mt-3 space-y-2.5 text-sm">
          {['Take a 5-question Frontend mock interview to set your baseline', 'Add results to your two project bullets in Resume Studio', 'Review 3 fresher-friendly matches in Chennai'].map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      <p className="flex gap-2 text-xs text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This is an AI summary of what you told us, not a verified assessment of your suitability for any job. Edit anything in your profile and it updates.
      </p>
    </div>
  )
}

export function DoneStep({ d, onFinish }: { d: OnboardingData; onFinish?: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} className="mx-auto max-w-lg py-6 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Your career profile is ready!</h1>
      <p className="mt-2 text-muted">NOVA now knows enough to match jobs and personalise your practice.</p>

      <div className="mt-8 rounded-xl border border-line bg-surface p-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Profile completion</span>
          <span className="font-semibold">86%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-line">
          <div className="h-full w-[86%] rounded-full bg-success" />
        </div>
        <p className="mt-2 text-xs text-muted">Add a phone number and a profile summary to reach 100% — both optional.</p>

        <p className="mt-5 text-xs font-medium text-muted">Your goals</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {d.goals.map((g) => (
            <span key={g} className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
              {g}
            </span>
          ))}
        </div>

        <p className="mt-5 text-xs font-medium text-muted">Next actions</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li>· Take your baseline mock interview (20 min)</li>
          <li>· Review 3 job matches in Chennai</li>
          <li>· Tailor your resume for your top match</li>
        </ul>
      </div>
      <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={onFinish}>
        Go to My Dashboard <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

function List({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((s) => (
          <li key={s} className="flex gap-2">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone}`} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}

const EXTRACTED: Record<string, string> = {
  'Candidate name': 'Priya Raman',
  Education: 'B.Tech Computer Science, Anna University – CEG, 2024 · 8.1 CGPA',
  Experience: 'Frontend Intern, Tessel Web · Jun–Aug 2023 · Built forms and API error states in React',
  Skills: 'React, JavaScript, HTML, CSS, REST APIs, Git, Figma, Firebase',
  Projects: 'Campus events app (React, Firebase) · Weather dashboard (JavaScript, OpenWeather API)',
  Certifications: 'Meta Front-End Developer — Coursera, 2023',
}
