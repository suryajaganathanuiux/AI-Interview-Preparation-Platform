import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, ExternalLink, Target, FileText, Mic, Check, Circle, Info, Building2, Link2, X } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, scoreBar } from '../shared/components/ui'
import { jobs, jobDetail } from '../shared/data/career'

export const args = {
  tab: 'overview',
  applyDialog: false,
}

export const argTypes = {
  tab: { control: 'radio', options: ['overview', 'fit', 'company'] },
  applyDialog: { control: 'boolean' },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void }

export default function JobDetails(props: Props) {
  const p = { ...args, ...props }
  const job = jobs[0]
  const d = jobDetail
  const [tab, setTab] = useState(p.tab)
  const [saved, setSaved] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [apply, setApply] = useState(p.applyDialog)
  const [tracked, setTracked] = useState(false)
  const go = (k: NavKey) => p.onNavigate?.(k)

  const flash = (t: string) => {
    setToast(t)
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <AppShell active="job-detail" title={job.title} crumbs={['Jobs', 'Discover', job.company]} onNavigate={p.onNavigate}>
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <button onClick={() => go('jobs')} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </button>

        {/* Header */}
        <header className="mt-4 flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-line-soft text-base font-semibold text-muted">{job.initials}</span>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-semibold tracking-tight">{job.title}</h2>
            <p className="mt-1 text-muted">
              {job.company} · {job.location} · {job.mode}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span>{job.salary}</span>
              <span className="text-muted">{job.type}</span>
              <span className="text-muted">{job.experience}</span>
              <span className="text-muted">Posted {job.posted}</span>
              <span className="text-muted">Closes {d.closes}</span>
            </div>
            <p className="mt-3 text-xs text-subtle">
              Source: {job.source} · last verified {job.verified.toLowerCase()} · {d.applyMethod}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button onClick={() => setApply(true)}>
              Apply <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSaved(!saved)
                flash(saved ? 'Removed from saved jobs' : 'Saved — prep pipeline started')
              }}
              aria-pressed={saved}
            >
              {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />} {saved ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard?.writeText(`https://app.careercoach.example/jobs/${job.id}`).catch(() => {})
                flash('Link copied')
              }}
              aria-label="Share job"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Prep actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Target, t: 'Analyze my fit', d: `${d.fit.overall}% match · 2 skills missing`, on: () => setTab('fit') },
            { icon: FileText, t: 'Prepare my resume', d: 'Tailor a version for this job', on: () => go('resume') },
            { icon: Mic, t: 'Prepare for interview', d: 'Mock round from this description', on: () => go('studio') },
          ].map((a) => (
            <button key={a.t} onClick={a.on} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left transition-colors duration-150 hover:border-secondary">
              <a.icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{a.t}</span>
                <span className="block truncate text-xs text-muted">{a.d}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <div className="flex gap-6 border-b border-line" role="tablist">
              {(['overview', 'fit', 'company'] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm transition-colors duration-150 ${tab === t ? 'border-primary font-semibold' : 'border-transparent text-muted hover:text-ink'}`}
                >
                  {{ overview: 'Job description', fit: 'Fit analysis', company: 'Company' }[t]}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }} className="pt-6">
                {tab === 'overview' && (
                  <div className="space-y-8">
                    <p className="text-[15px] leading-relaxed">{d.about}</p>
                    <Section title="Responsibilities">
                      <ul className="space-y-2 text-sm">
                        {d.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2.5">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </Section>
                    <div className="grid gap-8 sm:grid-cols-2">
                      <Section title="Required skills">
                        <SkillList items={d.required} have={job.matching} />
                      </Section>
                      <Section title="Preferred">
                        <SkillList items={d.preferred} have={job.matching} />
                      </Section>
                    </div>
                    <Section title="Qualifications">
                      <p className="text-sm">{d.qualifications}</p>
                    </Section>
                    <Section title="Benefits">
                      <ul className="grid gap-2 text-sm sm:grid-cols-2">
                        {d.benefits.map((b) => (
                          <li key={b} className="flex gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {b}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  </div>
                )}

                {tab === 'fit' && (
                  <div className="space-y-8">
                    <div className="flex flex-wrap items-end gap-6">
                      <div>
                        <p className="text-sm text-muted">Overall match</p>
                        <p className="text-5xl font-semibold tracking-tight text-primary">{d.fit.overall}%</p>
                      </div>
                      <p className="max-w-md pb-1 text-sm text-muted">
                        How closely your confirmed profile matches what this listing asks for. It is not a prediction of whether you’ll be hired.
                      </p>
                    </div>

                    <Panel className="overflow-x-auto">
                      <table className="w-full min-w-[520px] text-sm">
                        <thead>
                          <tr className="border-b border-line text-left text-xs text-muted">
                            <th className="px-4 py-2.5 font-medium">Dimension</th>
                            <th className="px-4 py-2.5 font-medium">Weight</th>
                            <th className="px-4 py-2.5 font-medium">Score</th>
                            <th className="px-4 py-2.5 font-medium">Why</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {d.fit.dims.map((x) => (
                            <tr key={x.name}>
                              <td className="px-4 py-3 font-medium">{x.name}</td>
                              <td className="px-4 py-3 text-muted">{x.weight}%</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-16 rounded-full bg-line-soft">
                                    <div className={`h-full rounded-full ${scoreBar(x.score)}`} style={{ width: `${x.score}%` }} />
                                  </div>
                                  <span className="tabular-nums">{x.score}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted">{x.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Panel>

                    <div className="grid gap-6 sm:grid-cols-3">
                      <SkillGroup title="Matching" items={job.matching} tone="bg-success-soft text-success-ink" />
                      <SkillGroup title="Partial" items={job.partial} tone="bg-primary-soft text-primary" />
                      <SkillGroup title="Missing" items={job.missing} tone="bg-warning-soft text-warning" />
                    </div>

                    <Section title="Your relevant experience">
                      <ul className="space-y-2 text-sm">
                        {d.fit.experience.map((e) => (
                          <li key={e} className="flex gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {e}
                          </li>
                        ))}
                      </ul>
                    </Section>
                    <Section title="Recommendations">
                      <ol className="space-y-2.5 text-sm">
                        {d.fit.recommendations.map((r, i) => (
                          <li key={r} className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">{i + 1}</span>
                            {r}
                          </li>
                        ))}
                      </ol>
                    </Section>
                  </div>
                )}

                {tab === 'company' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
                      <p className="text-[15px] leading-relaxed">{d.about.split('.')[0]}.</p>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
                      {[
                        ['Industry', d.company.industry],
                        ['Founded', d.company.founded],
                        ['Size', d.company.size],
                        ['Headquarters', d.company.hq],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-xs text-muted">{k}</dt>
                          <dd className="mt-0.5 font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="flex items-center gap-1.5 text-sm">
                      <Link2 className="h-4 w-4 text-muted" />
                      <span className="text-muted">Official website:</span>
                      <span className="font-medium text-primary">{d.company.website}</span>
                    </p>
                    <Section title="Likely interview topics">
                      <div className="flex flex-wrap gap-2">
                        {d.company.topics.map((t) => (
                          <span key={t} className="rounded-md bg-line-soft px-2.5 py-1 text-sm">
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted">AI-generated from the job description, not from reports of past interviews.</p>
                    </Section>
                    <Section title="Sources">
                      <ul className="divide-y divide-line rounded-lg border border-line text-sm">
                        {d.company.sources.map((s) => (
                          <li key={s.label} className="flex flex-wrap justify-between gap-2 px-4 py-2.5">
                            <span>{s.label}</span>
                            <span className="text-muted">
                              {s.source} · {s.date}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-xs text-muted">Salary data for this company isn’t available from a verified source, so we don’t show any.</p>
                    </Section>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pipeline */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Panel className="p-5">
              <h3 className="text-sm font-semibold">Prep pipeline for this job</h3>
              <p className="mt-0.5 text-xs text-muted">Started when you saved it on May 6</p>
              <ol className="mt-5">
                {PIPELINE.map((s, i) => {
                  const done = i < 4
                  const current = i === 4
                  return (
                    <li key={s.t} className="relative flex gap-3 pb-5 last:pb-0">
                      {i < PIPELINE.length - 1 && <span className={`absolute left-[9px] top-6 h-[calc(100%-20px)] w-px ${done ? 'bg-success' : 'bg-line'}`} />}
                      <span className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${done ? 'bg-success text-white' : current ? 'border-2 border-primary bg-surface' : 'border border-line bg-surface'}`}>
                        {done ? <Check className="h-3 w-3" /> : current ? <Circle className="h-1.5 w-1.5 fill-primary text-primary" /> : null}
                      </span>
                      <div className="min-w-0 -mt-0.5">
                        <p className={`text-sm ${done ? 'text-muted' : current ? 'font-semibold' : ''}`}>{s.t}</p>
                        {current && (
                          <button onClick={() => go('studio')} className="mt-1 text-xs font-medium text-primary hover:underline">
                            Start mock interview →
                          </button>
                        )}
                        {s.note && !current && <p className="text-xs text-subtle">{s.note}</p>}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </Panel>
          </aside>
        </div>
      </div>

      {/* Apply dialog */}
      <AnimatePresence>
        {apply && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold">Apply on {job.company}’s site</h2>
                <button onClick={() => setApply(false)} className="rounded p-1 text-subtle hover:text-ink" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted">
                You’ll leave AI Career Coach for <span className="font-medium text-ink">{d.applyUrl}</span>. We don’t submit anything for you.
              </p>
              <div className="mt-4 flex gap-2.5 rounded-lg bg-canvas p-3 text-sm">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                Resume to attach: <span className="font-medium">Lumen Labs – Frontend (v4)</span>
              </div>
              <label className="mt-4 flex items-start gap-2.5 text-sm">
                <input type="checkbox" checked={tracked} onChange={(e) => setTracked(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
                Mark as <b>Applied</b> in my tracker once I’ve submitted
              </label>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={() => setApply(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setApply(false)
                    flash(tracked ? 'Opened careers site · tracker updated to Applied' : 'Opened careers site')
                  }}
                >
                  Continue to site <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-navy px-4 py-2.5 text-sm text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function SkillList({ items, have }: { items: string[]; have: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((s) => {
        const ok = have.some((h) => s.toLowerCase().includes(h.toLowerCase()))
        return (
          <li key={s} className="flex items-center justify-between gap-3">
            {s}
            {ok ? <Badge tone="success">You have this</Badge> : <Badge tone="warning">Not in profile</Badge>}
          </li>
        )
      })}
    </ul>
  )
}

function SkillGroup({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">
        {title} · {items.length}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((s) => (
            <span key={s} className={`rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}>
              {s}
            </span>
          ))
        ) : (
          <span className="text-sm text-subtle">None</span>
        )}
      </div>
    </div>
  )
}

const PIPELINE = [
  { t: 'Job saved', note: 'May 6' },
  { t: 'Fit analysed', note: '82% · 2 gaps' },
  { t: 'Tailored resume saved', note: 'v4, approved by you' },
  { t: 'Applied and tracked', note: 'May 8 · interview scheduled' },
  { t: 'Mock interview for this job', note: '' },
  { t: 'Preparation report', note: 'After the mock interview' },
  { t: 'Real interview', note: 'Fri May 16, 10:30' },
]
