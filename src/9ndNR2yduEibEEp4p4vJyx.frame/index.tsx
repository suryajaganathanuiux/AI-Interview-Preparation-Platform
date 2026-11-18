import React, { useState } from 'react'
import { ArrowUp, ArrowDown, Download, Check, X, AlertTriangle, CheckCircle2, Info, Sparkles, ChevronDown } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel } from '../shared/components/ui'
import { ResumePreview } from './components/ResumePreview'
import { initialResume, SUGGESTIONS, ATS_CHECKS, ResumeData, SectionKey } from './components/resume'

export const args = {
  mode: 'tailor',
  template: 'ATS Classic',
}

export const argTypes = {
  mode: { control: 'radio', options: ['edit', 'tailor', 'ats'] },
  template: { control: 'select', options: ['ATS Classic', 'Fresher', 'Technical', 'Creative'] },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void }

export default function ResumeStudio(props: Props) {
  const p = { ...args, ...props }
  const [mode, setMode] = useState(p.mode)
  const [template, setTemplate] = useState(p.template)
  const [data, setData] = useState<ResumeData>(initialResume)
  const [open, setOpen] = useState<SectionKey | null>('summary')
  const [decisions, setDecisions] = useState<Record<string, 'accepted' | 'rejected'>>({})
  const [savedVersion, setSavedVersion] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const move = (i: number, dir: -1 | 1) => {
    const order = [...data.order]
    const j = i + dir
    if (j < 0 || j >= order.length) return
    ;[order[i], order[j]] = [order[j], order[i]]
    setData({ ...data, order })
  }

  const preview: ResumeData =
    mode === 'tailor'
      ? SUGGESTIONS.reduce((acc, s) => (decisions[s.id] === 'accepted' ? s.apply(acc) : acc), data)
      : data
  const highlighted = mode === 'tailor' ? SUGGESTIONS.filter((s) => decisions[s.id] === 'accepted').map((s) => s.target) : []
  const accepted = Object.values(decisions).filter((d) => d === 'accepted').length

  return (
    <AppShell
      active="resume"
      title="Resume Studio"
      onNavigate={p.onNavigate}
      actions={
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setDownloaded(true)
            setTimeout(() => setDownloaded(false), 2000)
          }}
        >
          {downloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />} {downloaded ? 'PDF ready' : 'Download PDF'}
        </Button>
      }
    >
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative">
            <span className="sr-only">Resume version</span>
            <select className="h-9 appearance-none rounded-lg border border-line bg-surface pl-3 pr-8 text-sm font-medium" defaultValue={mode === 'tailor' ? 'v3' : 'v3'}>
              <option value="v3">v3 · Base resume (active)</option>
              <option value="v4">v4 · Lumen Labs – Frontend</option>
              <option value="v2">v2 · Archived Apr 28</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </label>
          <div className="flex rounded-lg border border-line bg-surface p-0.5" role="tablist">
            {(['edit', 'tailor', 'ats'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ${mode === m ? 'bg-primary font-medium text-white' : 'text-muted hover:text-ink'}`}
              >
                {{ edit: 'Edit', tailor: 'Tailor for a job', ats: 'ATS check' }[m]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 sm:ml-auto">
            {['ATS Classic', 'Fresher', 'Technical', 'Creative'].map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                aria-pressed={template === t}
                className={`rounded-full border px-3 py-1 text-xs transition-colors duration-150 ${template === t ? 'border-primary bg-primary-soft font-medium text-primary' : 'border-line text-muted hover:text-ink'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Left panel */}
          <div className="min-w-0 space-y-4">
            {mode === 'edit' && (
              <Panel className="divide-y divide-line">
                {data.order.map((key, i) => (
                  <div key={key}>
                    <div className="flex items-center gap-2 px-4 py-3">
                      <button onClick={() => setOpen(open === key ? null : key)} aria-expanded={open === key} className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-semibold">
                        <ChevronDown className={`h-4 w-4 shrink-0 text-subtle transition-transform duration-200 ${open === key ? '' : '-rotate-90'}`} />
                        {LABELS[key]}
                      </button>
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-muted hover:text-ink disabled:opacity-30" aria-label={`Move ${LABELS[key]} up`}>
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === data.order.length - 1} className="rounded p-1 text-muted hover:text-ink disabled:opacity-30" aria-label={`Move ${LABELS[key]} down`}>
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    {open === key && (
                      <div className="px-4 pb-4">
                        <SectionEditor k={key} data={data} setData={setData} />
                      </div>
                    )}
                  </div>
                ))}
              </Panel>
            )}

            {mode === 'tailor' && (
              <>
                <Panel className="flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-line-soft text-xs font-semibold text-muted">LL</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">Frontend Developer (Fresher) · Lumen Labs</p>
                    <p className="text-xs text-muted">Compared with v3 · 5 of 7 job skills already in your resume</p>
                  </div>
                  <button onClick={() => p.onNavigate?.('jobs')} className="text-xs font-medium text-primary hover:underline">
                    Change job
                  </button>
                </Panel>
                <ul className="space-y-3">
                  {SUGGESTIONS.map((s) => {
                    const dcs = decisions[s.id]
                    return (
                      <li key={s.id}>
                        <Panel className={`p-4 ${dcs === 'rejected' ? 'opacity-60' : ''}`}>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">{s.title}</p>
                            <Badge tone="neutral">{LABELS[s.target]}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted">{s.why}</p>
                          {s.before && <p className="mt-3 rounded-md bg-danger-soft px-3 py-2 text-sm text-ink/70 line-through decoration-danger/40">{s.before}</p>}
                          <p className="mt-2 rounded-md bg-success-soft px-3 py-2 text-sm">{s.after}</p>
                          <div className="mt-3 flex items-center gap-2">
                            {dcs ? (
                              <>
                                <span className={`text-xs font-medium ${dcs === 'accepted' ? 'text-success-ink' : 'text-muted'}`}>{dcs === 'accepted' ? 'Accepted' : 'Rejected'}</span>
                                <button
                                  onClick={() => {
                                    const n = { ...decisions }
                                    delete n[s.id]
                                    setDecisions(n)
                                    setSavedVersion(false)
                                  }}
                                  className="text-xs text-muted hover:text-ink"
                                >
                                  Undo
                                </button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" onClick={() => setDecisions({ ...decisions, [s.id]: 'accepted' })}>
                                  <Check className="h-3.5 w-3.5" /> Accept
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setDecisions({ ...decisions, [s.id]: 'rejected' })}>
                                  <X className="h-3.5 w-3.5" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </Panel>
                      </li>
                    )
                  })}
                </ul>
                <div className="flex gap-2.5 rounded-lg border border-warning-base/40 bg-warning-soft p-4 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <p>
                    <b>Not added: TypeScript, Jest.</b> The job asks for them but they aren’t in your confirmed profile. If you’ve used them, add them to your skills first — we won’t add skills you haven’t claimed.
                  </p>
                </div>
                <Panel className="flex flex-wrap items-center gap-3 p-4">
                  <p className="mr-auto text-sm text-muted">
                    {savedVersion ? (
                      <span className="flex items-center gap-1.5 text-success-ink">
                        <CheckCircle2 className="h-4 w-4" /> Saved as v4 · Lumen Labs – Frontend. v3 stays active.
                      </span>
                    ) : (
                      `${accepted} change${accepted === 1 ? '' : 's'} accepted`
                    )}
                  </p>
                  <Button disabled={!accepted || savedVersion} onClick={() => setSavedVersion(true)}>
                    Save as new version
                  </Button>
                </Panel>
              </>
            )}

            {mode === 'ats' && (
              <Panel className="p-5">
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-sm text-muted">ATS readability</p>
                    <p className="text-5xl font-semibold tracking-tight">78</p>
                  </div>
                  <p className="pb-1.5 text-sm text-muted">Checks parsing and formatting for applicant tracking systems. It doesn’t predict whether a recruiter will shortlist you.</p>
                </div>
                <ul className="mt-6 divide-y divide-line">
                  {ATS_CHECKS.map((c) => (
                    <li key={c.t} className="flex gap-3 py-3">
                      {c.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-base" />}
                      <div>
                        <p className="text-sm font-medium">{c.t}</p>
                        <p className="text-xs text-muted">{c.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="mt-4 w-full" onClick={() => setMode('edit')}>
                  Fix in editor
                </Button>
              </Panel>
            )}
          </div>

          {/* Preview */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between text-xs text-muted">
              <span>Preview · {template}</span>
              {mode === 'tailor' && accepted > 0 && (
                <span className="flex items-center gap-1 text-primary">
                  <Sparkles className="h-3 w-3" /> Changed sections highlighted
                </span>
              )}
            </div>
            <ResumePreview data={preview} template={template} highlight={highlighted} />
            <p className="mt-3 flex gap-1.5 text-xs text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Every suggestion is AI-generated from your confirmed profile. Review before sending.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function SectionEditor({ k, data, setData }: { k: SectionKey; data: ResumeData; setData: (d: ResumeData) => void }) {
  const cls = 'w-full resize-none rounded-lg border border-line bg-surface p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
  if (k === 'summary') return <textarea rows={4} value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} className={cls} aria-label="Summary" />
  if (k === 'skills')
    return <textarea rows={2} value={data.skills.join(', ')} onChange={(e) => setData({ ...data, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className={cls} aria-label="Skills, comma separated" />
  if (k === 'education') return <textarea rows={2} value={data.education} onChange={(e) => setData({ ...data, education: e.target.value })} className={cls} aria-label="Education" />
  if (k === 'certifications') return <textarea rows={2} value={data.certifications} onChange={(e) => setData({ ...data, certifications: e.target.value })} className={cls} aria-label="Certifications" />
  const items = k === 'projects' ? data.projects : data.experience
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.title} className="space-y-1.5">
          <p className="text-xs font-medium text-muted">{it.title}</p>
          <textarea
            rows={3}
            value={it.bullets.join('\n')}
            onChange={(e) => {
              const next = items.map((x, j) => (j === i ? { ...x, bullets: e.target.value.split('\n') } : x))
              setData(k === 'projects' ? { ...data, projects: next } : { ...data, experience: next })
            }}
            className={cls}
            aria-label={`${it.title} bullets, one per line`}
          />
        </div>
      ))}
      <p className="text-xs text-subtle">One bullet per line. Start with a verb and end with a result.</p>
    </div>
  )
}

const LABELS: Record<SectionKey, string> = {
  summary: 'Summary',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
}
