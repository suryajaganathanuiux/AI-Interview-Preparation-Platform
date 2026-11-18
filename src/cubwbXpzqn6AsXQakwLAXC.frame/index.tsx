import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, RotateCcw, Download, Flag, Eye, AlertTriangle, Loader2, GitCompare, Info } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, Delta, scoreText, scoreTone, scoreBar } from '../shared/components/ui'
import { report, weaknesses, DIMENSIONS, DEFAULT_WEIGHTS, ReportQuestion } from '../shared/data/coach'

export const args = {
  state: 'ready',
  openQuestion: 4,
}

export const argTypes = {
  state: { control: 'select', options: ['ready', 'evaluating', 'partial-failure'] },
  openQuestion: { control: 'range', min: 0, max: 5, step: 1 },
}

type Props = Partial<typeof args> & {
  onNavigate?: (k: NavKey) => void
  onRetry?: () => void
  onCompare?: () => void
}

export default function FeedbackReport(props: Props) {
  const p = { ...args, ...props }
  const [open, setOpen] = useState<number | null>(p.openQuestion ? p.openQuestion - 1 : null)

  if (p.state === 'evaluating') {
    return (
      <AppShell active="feedback" title="AI Feedback" onNavigate={p.onNavigate}>
        <div className="mx-auto flex max-w-md flex-col items-center p-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h2 className="mt-4 text-lg font-semibold">Evaluating your answers</h2>
          <p className="mt-1 text-sm text-muted">3 of 5 evaluated. This usually takes under a minute — you can leave and we’ll notify you.</p>
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full w-3/5 bg-primary" />
          </div>
        </div>
      </AppShell>
    )
  }

  const failedIndex = p.state === 'partial-failure' ? 2 : -1

  return (
    <AppShell
      active="feedback"
      title="AI Feedback"
      onNavigate={p.onNavigate}
      actions={
        <Button variant="secondary" size="sm">
          <Download className="h-3.5 w-3.5" /> Download PDF
        </Button>
      }
    >
      <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header + overall */}
        <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <Badge tone="success">Completed</Badge>
              <span>{report.date}</span>
              <span>·</span>
              <span>{report.duration}</span>
              <span>·</span>
              <span>{report.role}</span>
              <span>·</span>
              <span>{report.category}</span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{report.title}</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/80">{report.summary}</p>
          </div>
          <div className="flex items-end gap-3 lg:flex-col lg:items-end lg:gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-6xl font-semibold tracking-tight ${scoreText(report.score)}`}>{report.score}</span>
              <span className="text-muted">/ 100</span>
            </div>
            <p className="pb-2 text-sm text-muted lg:pb-0">
              <Delta value={report.score - report.previousScore} /> vs last interview
            </p>
          </div>
        </header>

        {p.state === 'partial-failure' && (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-warning-base/40 bg-warning-soft p-4 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <p className="min-w-0 flex-1 text-ink">
              Question 3 couldn’t be evaluated — the AI service timed out. Your overall score excludes it until it’s re-run. Your answer is saved.
            </p>
            <Button size="sm" variant="secondary">
              Re-run evaluation
            </Button>
          </div>
        )}

        {/* Strengths / improvements / dimensions */}
        <div className="grid gap-6 lg:grid-cols-5">
          <Panel className="p-5 sm:p-6 lg:col-span-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">Skill breakdown</h3>
              <span className="text-xs text-muted">Weighted for a mixed interview</span>
            </div>
            <ul className="mt-5 space-y-4">
              {DIMENSIONS.map((d) => (
                <li key={d} className="grid grid-cols-[110px_1fr_36px] items-center gap-3 sm:grid-cols-[130px_1fr_40px]">
                  <span className="text-sm">
                    {d} <span className="text-xs text-subtle">{DEFAULT_WEIGHTS[d]}%</span>
                  </span>
                  <div className="h-2 overflow-hidden rounded-full bg-line-soft">
                    <div className={`h-full rounded-full ${scoreBar(report.dims[d])}`} style={{ width: `${report.dims[d]}%` }} />
                  </div>
                  <span className={`text-right text-sm font-semibold tabular-nums ${scoreText(report.dims[d])}`}>{report.dims[d]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex gap-2 text-xs text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Technical accuracy is scored separately from delivery. Scores are AI estimates ({report.model}), not an objective measure of employability.
            </p>
          </Panel>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            <Panel className="p-5 sm:p-6">
              <h3 className="font-semibold">What worked</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {report.strengths.map((s) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel className="p-5 sm:p-6">
              <h3 className="font-semibold">What held the score back</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {report.improvements.map((s) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning-base" />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>

        {/* Question by question */}
        <section>
          <h3 className="text-lg font-semibold">Question by question</h3>
          <p className="mt-0.5 text-sm text-muted">Open a question to see the evidence behind its score and retry it.</p>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {report.questions.map((q, i) => (
              <QuestionRow
                key={q.id}
                q={q}
                n={i + 1}
                open={open === i}
                failed={i === failedIndex}
                onToggle={() => setOpen(open === i ? null : i)}
                onRetry={p.onRetry}
                onCompare={p.onCompare}
              />
            ))}
          </ul>
        </section>

        {/* Plan */}
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Panel className="p-5 sm:p-6">
            <h3 className="font-semibold">Your plan for this week</h3>
            <p className="mt-0.5 text-sm text-muted">Built from your two highest-priority recurring weaknesses.</p>
            <ol className="mt-5 space-y-5">
              {PLAN.map((d, i) => (
                <li key={d.day} className="grid grid-cols-[56px_1fr] gap-3">
                  <span className="text-sm font-semibold text-muted">{d.day}</span>
                  <div className={i < PLAN.length - 1 ? 'border-b border-line pb-5' : ''}>
                    <p className="text-sm font-medium">{d.task}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {d.target} · {d.time}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
          <div className="space-y-3">
            {weaknesses.slice(0, 2).map((w) => (
              <Panel key={w.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{w.name}</p>
                  <Badge tone={w.severity === 'High' ? 'warning' : 'neutral'}>{w.severity}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {w.previous} → {w.latest} · {w.status}
                </p>
              </Panel>
            ))}
            <Button className="w-full" onClick={p.onRetry}>
              <RotateCcw className="h-4 w-4" /> Retry question 4 now
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => p.onNavigate?.('studio')}>
              Retake full interview
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => p.onNavigate?.('dashboard')}>
              Back to dashboard
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  )
}

function QuestionRow({
    q,
    n,
    open,
    failed,
    onToggle,
    onRetry,
    onCompare,
  }: {
    q: ReportQuestion
    n: number
    open: boolean
    failed: boolean
    onToggle: () => void
    onRetry?: () => void
    onCompare?: () => void
  }) {
    const [reveal, setReveal] = useState(false)
    const [reported, setReported] = useState(false)
    return (
      <li>
        <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 hover:bg-canvas sm:px-6">
          <span className="w-5 shrink-0 text-sm font-semibold text-subtle">{n}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium sm:text-[15px]">{q.question}</p>
            <p className="mt-0.5 text-xs text-muted">
              {q.category} · {q.difficulty}
              {q.confidence !== 'High' && ` · ${q.confidence} evaluation confidence`}
            </p>
          </div>
          {failed ? <Badge tone="warning">Not evaluated</Badge> : <Badge tone={scoreTone(q.score)}>{q.score}</Badge>}
          <ChevronDown className={`h-4 w-4 shrink-0 text-subtle transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-6 border-t border-line bg-canvas/50 px-4 py-5 sm:px-6 lg:grid-cols-2 lg:pl-15">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-medium text-muted">Your answer</h4>
                    <blockquote className="mt-1.5 border-l-2 border-line pl-3 text-sm leading-relaxed">{q.answer}</blockquote>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted">Feedback</h4>
                    <p className="mt-1.5 text-sm leading-relaxed">{q.feedback}</p>
                  </div>
                  {q.confidence !== 'High' && (
                    <p className="flex gap-2 rounded-lg bg-warning-soft p-3 text-xs text-warning">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Medium confidence: this answer depends on context the AI can’t verify. Treat the score as a guide.
                    </p>
                  )}
                </div>
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <List title="Strengths" items={q.strengths} dot="bg-success" empty="—" />
                    <List title="Weaknesses" items={q.weaknesses} dot="bg-warning-base" empty="None flagged" />
                  </div>
                  <List title="Missing" items={q.missing} dot="bg-subtle" empty="—" />
                  <div>
                    {reveal ? (
                      <div className="rounded-lg border border-line bg-surface p-4">
                        <h4 className="text-xs font-medium text-muted">Suggested direction</h4>
                        <p className="mt-1.5 text-sm leading-relaxed">{q.suggested}</p>
                      </div>
                    ) : (
                      <button onClick={() => setReveal(true)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                        <Eye className="h-4 w-4" /> Show suggested answer
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button size="sm" onClick={onRetry}>
                      <RotateCcw className="h-3.5 w-3.5" /> Retry this question
                    </Button>
                    {n === 4 && (
                      <Button size="sm" variant="secondary" onClick={onCompare}>
                        <GitCompare className="h-3.5 w-3.5" /> Compare attempts
                      </Button>
                    )}
                    <button
                      onClick={() => setReported(true)}
                      disabled={reported}
                      className="ml-auto flex items-center gap-1.5 text-xs text-muted hover:text-ink disabled:hover:text-muted"
                    >
                      <Flag className="h-3.5 w-3.5" /> {reported ? 'Reported — thanks' : 'Report inaccurate feedback'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    )
}

function List({ title, items, dot, empty }: { title: string; items: string[]; dot: string; empty: string }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-muted">{title}</h4>
      {items.length ? (
        <ul className="mt-1.5 space-y-1.5 text-sm">
          {items.map((s) => (
            <li key={s} className="flex gap-2">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              {s}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-subtle">{empty}</p>
      )}
    </div>
  )
}

const PLAN = [
  { day: 'Mon', task: 'STAR drill: 2 behavioral questions, answered out loud', target: 'Answer structure', time: '20 min' },
  { day: 'Wed', task: 'Rewrite your campus events app story: problem → your part → result', target: 'Project explanation', time: '25 min' },
  { day: 'Fri', task: 'Retry Q2 and Q4 and compare against this report', target: 'Both', time: '15 min' },
  { day: 'Sun', task: 'Mixed interview, 5 questions', target: 'Check progress', time: '25 min' },
]
