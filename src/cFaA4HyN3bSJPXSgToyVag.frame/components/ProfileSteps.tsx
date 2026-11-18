import React from 'react'
import { Briefcase, FileText, Mic, Compass, Check, Plus, Trash2, Camera } from 'lucide-react'
import { candidate } from '../../shared/data/coach'
import { Field, inputCls, textareaCls, Chips, TagInput } from './fields'
import type { OnboardingData } from './data'

type StepProps = { d: OnboardingData; set: (p: Partial<OnboardingData>) => void }

export function GoalsStep({ d, set }: StepProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {GOALS.map((g) => {
        const Icon = g.icon
        const on = d.goals.includes(g.name)
        return (
          <button
            key={g.name}
            type="button"
            aria-pressed={on}
            onClick={() => set({ goals: on ? d.goals.filter((x) => x !== g.name) : [...d.goals, g.name] })}
            className={`relative flex flex-col rounded-xl border p-5 text-left transition-[border-color,background-color,transform] duration-150 ease-out-strong active:scale-[0.99] ${
              on ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-subtle'
            }`}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${on ? 'bg-primary text-white' : 'bg-canvas text-muted'}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="mt-4 font-semibold">{g.name}</span>
            <span className="mt-1 text-sm text-muted">{g.d}</span>
            <span
              className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border ${on ? 'border-primary bg-primary text-white' : 'border-line'}`}
              aria-hidden
            >
              {on && <Check className="h-3 w-3" />}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function PersonalStep({ d, set }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img src={candidate.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
        <div>
          <button type="button" className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium hover:bg-canvas">
            <Camera className="h-4 w-4" /> Change photo
          </button>
          <p className="mt-1 text-xs text-muted">Optional. JPG or PNG, up to 2 MB.</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name">
          <input value={d.name} onChange={(e) => set({ name: e.target.value })} className={`${inputCls} ${!d.name.trim() ? 'border-danger' : ''}`} />
        </Field>
        <Field label="Phone" optional>
          <input value={d.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+91 98xxx xxxxx" className={inputCls} />
        </Field>
        <Field label="City / location">
          <input value={d.location} onChange={(e) => set({ location: e.target.value })} className={`${inputCls} ${!d.location.trim() ? 'border-danger' : ''}`} />
        </Field>
        <Field label="Country">
          <select value={d.country} onChange={(e) => set({ country: e.target.value })} className={inputCls}>
            {['India', 'Sri Lanka', 'Singapore', 'United Arab Emirates', 'Other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred language" hint="Used for NOVA and feedback.">
          <select value={d.language} onChange={(e) => set({ language: e.target.value })} className={inputCls}>
            {['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  )
}

export function EducationStep({ d, set }: StepProps) {
  const update = (id: string, patch: Partial<OnboardingData['education'][number]>) =>
    set({ education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) })
  return (
    <div className="space-y-4">
      {d.education.map((e, i) => (
        <div key={e.id} className="rounded-xl border border-line bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">{e.degree || `Education ${i + 1}`}</p>
            {d.education.length > 1 && (
              <button type="button" onClick={() => set({ education: d.education.filter((x) => x.id !== e.id) })} className="flex items-center gap-1 text-xs text-muted hover:text-danger">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Education level">
              <select value={e.level} onChange={(x) => update(e.id, { level: x.target.value })} className={inputCls}>
                {['Higher secondary', 'Diploma', 'Bachelor’s', 'Master’s', 'Other'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="Degree">
              <input value={e.degree} onChange={(x) => update(e.id, { degree: x.target.value })} placeholder="e.g. B.Sc" className={inputCls} />
            </Field>
            <Field label="Specialization">
              <input value={e.specialization} onChange={(x) => update(e.id, { specialization: x.target.value })} className={inputCls} />
            </Field>
            <Field label="College / university">
              <input value={e.college} onChange={(x) => update(e.id, { college: x.target.value })} className={inputCls} />
            </Field>
            <Field label="Graduation year">
              <input value={e.year} onChange={(x) => update(e.id, { year: x.target.value })} inputMode="numeric" className={inputCls} />
            </Field>
            <Field label="CGPA / percentage" optional>
              <input value={e.score} onChange={(x) => update(e.id, { score: x.target.value })} className={inputCls} />
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => set({ education: [...d.education, { id: `e${Date.now()}`, level: 'Higher secondary', degree: '', specialization: '', college: '', year: '', score: '' }] })}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-3 text-sm font-medium text-muted hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" /> Add another qualification
      </button>
    </div>
  )
}

export function ExperienceStep({ d, set }: StepProps) {
  const early = ['Student', 'Fresher'].includes(d.level)
  return (
    <div className="space-y-8">
      <Chips options={['Student', 'Fresher', '0–1 year', '1–3 years', '3–5 years', '5+ years']} value={d.level ? [d.level] : []} onChange={(v) => set({ level: v[0] })} multi={false} />
      {early ? (
        <div className="space-y-5">
          <p className="text-sm text-muted">No work history needed. These count as real experience — list what you’ve done.</p>
          <Field label="Internships" optional>
            <textarea rows={2} value={d.internships} onChange={(e) => set({ internships: e.target.value })} className={textareaCls} />
          </Field>
          <Field label="Academic and personal projects" optional hint="One per line or separated by semicolons.">
            <textarea rows={3} value={d.projects} onChange={(e) => set({ projects: e.target.value })} className={textareaCls} />
          </Field>
          <Field label="Certifications" optional>
            <input value={d.certifications} onChange={(e) => set({ certifications: e.target.value })} className={inputCls} />
          </Field>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company">
            <input value={d.company} onChange={(e) => set({ company: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Job title">
            <input value={d.jobTitle} onChange={(e) => set({ jobTitle: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Employment period" className="sm:col-span-2">
            <input value={d.period} onChange={(e) => set({ period: e.target.value })} placeholder="e.g. Jul 2022 – present" className={inputCls} />
          </Field>
          <Field label="Responsibilities and achievements" className="sm:col-span-2">
            <textarea rows={4} value={d.responsibilities} onChange={(e) => set({ responsibilities: e.target.value })} className={textareaCls} />
          </Field>
        </div>
      )}
    </div>
  )
}

export function SkillsStep({ d, set }: StepProps) {
  return (
    <div className="space-y-6">
      <TagInput value={d.skills} onChange={(v) => set({ skills: v })} placeholder="Type a skill and press Enter" suggestions={SUGGESTED} />
      <p className="text-xs text-muted">
        {d.skills.length} skills. Tip: include tools (Git, Figma) and soft skills (team communication) — interviews ask about both.
      </p>
    </div>
  )
}

const GOALS = [
  { name: 'Find a job', d: 'Matches from authorised sources, ranked by fit.', icon: Briefcase },
  { name: 'Improve my resume', d: 'ATS checks and job-specific versions.', icon: FileText },
  { name: 'Prepare for interviews', d: 'Mock interviews with detailed feedback.', icon: Mic },
  { name: 'Explore career opportunities', d: 'Roles that fit your skills and interests.', icon: Compass },
]

const SUGGESTED = ['TypeScript', 'Responsive design', 'Accessibility', 'Tailwind CSS', 'Jest', 'Next.js', 'Team communication', 'Problem solving']
