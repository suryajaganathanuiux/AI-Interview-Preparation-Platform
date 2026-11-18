import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Play, ChevronRight, Check, CalendarClock, SkipForward, Undo2, Sparkles, Briefcase, Mic, FileText } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, Delta, scoreBar } from '../shared/components/ui'
import { candidate, weaknesses, sessions } from '../shared/data/coach'
import { readiness, missions, jobs, upcoming, applications } from '../shared/data/career'

export const args = {
  state: 'default',
}

export const argTypes = {
  state: { control: 'select', options: ['default', 'new', 'loading'] },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void }

export default function Dashboard(props: Props) {
  const { state, onNavigate } = { ...args, ...props }
  const go = (k: NavKey) => onNavigate?.(k)

  if (state === 'loading') {
    return (
      <AppShell active="dashboard" title="Dashboard" onNavigate={onNavigate}>
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8" aria-busy>
          <div className="h-8 w-64 animate-pulse rounded bg-line" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-72 animate-pulse rounded-xl bg-line/70 lg:col-span-2" />
            <div className="h-72 animate-pulse rounded-xl bg-line/70" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-48 animate-pulse rounded-xl bg-line/70" />
            <div className="h-48 animate-pulse rounded-xl bg-line/70" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (state === 'new') {
    return (
      <AppShell active="dashboard" title="Dashboard" onNavigate={onNavigate}>
        <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-10">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome, {candidate.firstName}. Your profile is ready.</h2>
          <p className="mt-1 text-muted">Your readiness score, trends and weaknesses appear once you’ve practised. Start with any of these.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Mic, t: 'Take a baseline interview', d: '5 Frontend questions, about 20 minutes. Sets your starting scores.', k: 'studio' as NavKey, cta: 'Start interview' },
              { icon: Briefcase, t: 'Review your job matches', d: '3 fresher-friendly roles in Chennai match your confirmed skills.', k: 'jobs-recommended' as NavKey, cta: 'See matches' },
              { icon: FileText, t: 'Strengthen your resume', d: 'Your resume is 72% complete. Add a summary and project results.', k: 'resume' as NavKey, cta: 'Open Resume Studio' },
            ].map((c) => (
              <Panel key={c.t} className="flex flex-col p-5">
                <c.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-semibold">{c.t}</h3>
                <p className="mt-1 text-sm text-muted">{c.d}</p>
                <Button variant="secondary" size="sm" className="mt-auto self-start" style={{ marginTop: 20 }} onClick={() => go(c.k)}>
                  {c.cta}
                </Button>
              </Panel>
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  const focus = weaknesses[0]
  const latest = sessions[sessions.length - 1]
  const topJobs = jobs.filter((j) => !j.expired).sort((a, b) => b.fit - a.fit).slice(0, 3)
  const pipeline = [
    { label: 'Saved / ready', n: applications.filter((a) => ['Saved', 'Ready to Apply', 'Interested'].includes(a.stage)).length },
    { label: 'Applied', n: applications.filter((a) => ['Applied', 'Application Viewed'].includes(a.stage)).length },
    { label: 'Shortlisted', n: applications.filter((a) => a.stage === 'Shortlisted').length },
    { label: 'Interviewing', n: applications.filter((a) => a.stage.startsWith('Interview')).length },
  ]

  return (
    <AppShell
      active="dashboard"
      title="Dashboard"
      onNavigate={onNavigate}
      actions={
        <Button size="sm" onClick={() => go('studio')}>
          <Play className="h-3.5 w-3.5" /> New interview
        </Button>
      }
    >
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Good morning, {candidate.firstName}</h2>
          <p className="mt-1 text-sm text-muted">
            Your Lumen Labs interview is in {upcoming.inDays} days. Today’s mission is built around it.
          </p>
        </div>

        {/* Primary row */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Panel className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">Career readiness</h3>
                <p className="mt-0.5 text-xs text-muted">For Frontend Developer roles · updated after every activity</p>
              </div>
              <button onClick={() => go('progress')} className="text-sm font-medium text-primary hover:underline">
                How it’s calculated
              </button>
            </div>
            <div className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr]">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-6xl font-semibold tracking-tight">{readiness.overall}</span>
                  <span className="text-muted">/ 100</span>
                </div>
                <p className="mt-1 text-sm">
                  <Delta value={readiness.overall - readiness.previous} /> <span className="text-muted">in 30 days</span>
                </p>
              </div>
              <ul className="space-y-3.5">
                {readiness.dims.map((d) => (
                  <li key={d.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1">
                    <span className="text-sm">{d.name}</span>
                    <span className="text-sm font-semibold tabular-nums">{d.score}</span>
                    <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-line-soft">
                      <div className={`h-full rounded-full ${scoreBar(d.score)}`} style={{ width: `${d.score}%` }} />
                    </div>
                    <span className="col-span-2 text-xs text-muted">{d.tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <DailyMission onGo={go} />
        </div>

        {/* Secondary row */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <Panel className="flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-medium text-muted">
              <CalendarClock className="h-4 w-4" /> Upcoming interview
            </div>
            <p className="mt-3 text-lg font-semibold">{upcoming.company}</p>
            <p className="text-sm text-muted">
              {upcoming.round} · {upcoming.when}
            </p>
            <div className="mt-5">
              <div className="flex justify-between text-xs">
                <span className="text-muted">Prep plan</span>
                <span className="font-medium">
                  {upcoming.prep} of {upcoming.prepTotal} done
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-line-soft">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(upcoming.prep / upcoming.prepTotal) * 100}%` }} />
              </div>
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <Button size="sm" onClick={() => go('studio')}>
                Practise for this job
              </Button>
              <Button size="sm" variant="secondary" onClick={() => go('job-detail')}>
                View job
              </Button>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
              <div>
                <h3 className="font-semibold">Top matches for you</h3>
                <p className="text-xs text-muted">Sample listings · ranked by job fit, not hiring likelihood</p>
              </div>
              <button onClick={() => go('jobs-recommended')} className="text-sm font-medium text-primary hover:underline">
                All matches
              </button>
            </div>
            <ul className="divide-y divide-line border-t border-line">
              {topJobs.map((j) => (
                <li key={j.id}>
                  <button onClick={() => go('job-detail')} className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-canvas sm:px-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-line-soft text-xs font-semibold text-muted">{j.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{j.title}</p>
                      <p className="truncate text-xs text-muted">
                        {j.company} · {j.location} · {j.mode} · {j.posted}
                      </p>
                    </div>
                    <span className="hidden text-xs text-muted sm:block">Missing {j.missing[0]}</span>
                    <Badge tone="blue">{j.fit}%</Badge>
                    <ChevronRight className="h-4 w-4 text-subtle" />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Tertiary row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning">Priority weakness</Badge>
              <span className="text-xs text-muted">Seen in {focus.occurrences} answers</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{focus.name}</h3>
            <p className="mt-1 text-sm text-muted">{focus.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span>
                <span className="text-muted">{focus.previous}</span> → <span className="font-semibold">{focus.latest}</span>
              </span>
              <span className="text-muted">Latest interview: {latest.score}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => go('studio')}>
                Start {focus.exercise} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => go('feedback')}>
                Latest feedback
              </Button>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Applications</h3>
              <button onClick={() => go('applications')} className="text-sm font-medium text-primary hover:underline">
                Open tracker
              </button>
            </div>
            <dl className="mt-5 grid grid-cols-4 gap-2">
              {pipeline.map((s) => (
                <div key={s.label} className="rounded-lg bg-canvas p-3">
                  <dd className="text-2xl font-semibold">{s.n}</dd>
                  <dt className="mt-0.5 truncate text-xs text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
            <button onClick={() => go('nova')} className="mt-5 flex w-full items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:border-secondary">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate">Northwind Fintech: follow-up due Fri. Ask NOVA to draft it?</span>
              <ChevronRight className="h-4 w-4 text-subtle" />
            </button>
          </Panel>
        </div>
      </div>
    </AppShell>
  )
}

function DailyMission({ onGo }: { onGo: (k: NavKey) => void }) {
  const [status, setStatus] = useState<Record<string, 'done' | 'skipped' | 'tomorrow'>>({ m1: 'done' })
  const doneCount = Object.values(status).filter((s) => s === 'done').length
  return (
    <Panel className="flex flex-col p-5 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">Today’s mission</h3>
        <span className="text-xs text-muted">{doneCount} of 3 done</span>
      </div>
      <ul className="mt-4 flex-1 space-y-2">
        {missions.map((m) => {
          const s = status[m.id]
          return (
            <li key={m.id} className="rounded-lg border border-line p-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() =>
                    setStatus((x) => {
                      const n = { ...x }
                      if (s === 'done') delete n[m.id]
                      else n[m.id] = 'done'
                      return n
                    })
                  }
                  disabled={s === 'skipped' || s === 'tomorrow'}
                  aria-label={s === 'done' ? 'Mark not done' : 'Mark done'}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
                    s === 'done' ? 'border-success bg-success text-white' : 'border-line hover:border-primary'
                  }`}
                >
                  <AnimatePresence>
                    {s === 'done' && (
                      <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
                        <Check className="h-3 w-3" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => m.target !== 'learning' && onGo(m.target as NavKey)}
                    className={`text-left text-sm font-medium ${s === 'done' ? 'text-muted line-through' : s ? 'text-subtle' : 'hover:text-primary'}`}
                  >
                    {m.title}
                  </button>
                  <p className="text-xs text-muted">
                    {s === 'skipped' ? 'Skipped today' : s === 'tomorrow' ? 'Moved to tomorrow' : m.meta}
                  </p>
                </div>
              </div>
              {s !== 'done' && (
                <div className="mt-2 flex gap-3 pl-8 text-xs">
                  {s ? (
                    <button
                      onClick={() =>
                        setStatus((x) => {
                          const n = { ...x }
                          delete n[m.id]
                          return n
                        })
                      }
                      className="flex items-center gap-1 text-muted hover:text-ink"
                    >
                      <Undo2 className="h-3 w-3" /> Undo
                    </button>
                  ) : (
                    <>
                      <button onClick={() => setStatus((x) => ({ ...x, [m.id]: 'tomorrow' }))} className="flex items-center gap-1 text-muted hover:text-ink">
                        <CalendarClock className="h-3 w-3" /> Tomorrow
                      </button>
                      <button onClick={() => setStatus((x) => ({ ...x, [m.id]: 'skipped' }))} className="flex items-center gap-1 text-muted hover:text-ink">
                        <SkipForward className="h-3 w-3" /> Skip
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-muted">Missions are picked from your weaknesses, resume gaps and upcoming interviews.</p>
    </Panel>
  )
}
