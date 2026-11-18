import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Check, Clock, Save, ArrowRight, Loader2, CheckCircle2, RotateCcw } from 'lucide-react'
import { Button, Badge } from '../shared/components/ui'
import { interviewQuestions, report, AVATAR_INTERVIEWER } from '../shared/data/coach'

export const args = {
  state: 'answering',
  question: 3,
}

export const argTypes = {
  state: { control: 'select', options: ['answering', 'exit-confirm', 'complete', 'retry'] },
  question: { control: 'range', min: 1, max: 5, step: 1 },
}

type Props = Partial<typeof args> & { onExit?: () => void; onComplete?: () => void }

export default function MockInterview(props: Props) {
  const p = { ...args, ...props }
  const retry = p.state === 'retry'
  const questions = retry ? [interviewQuestions[3]] : interviewQuestions
  const [index, setIndex] = useState(retry ? 0 : Math.min(p.question, questions.length) - 1)
  const [answer, setAnswer] = useState(!retry && p.question === 3 ? DRAFT : '')
  const [done, setDone] = useState<number[]>(() => (retry ? [] : Array.from({ length: index }, (_, i) => i)))
  const [confirmExit, setConfirmExit] = useState(p.state === 'exit-confirm')
  const [finished, setFinished] = useState(p.state === 'complete')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(retry ? 0 : 9 * 60 + 42)
  const [showPrev, setShowPrev] = useState(false)

  useEffect(() => {
    if (finished) return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [finished])

  const current = questions[index]
  const isLast = index === questions.length - 1
  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0
  const budget = questions.reduce((s, q) => s + q.minutes, 0) * 60
  const remaining = Math.max(budget - elapsed, 0)

  const submit = () => {
    if (!answer.trim()) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setDone((d) => [...d, index])
      setAnswer('')
      setSavedAt(null)
      if (isLast) setFinished(true)
      else setIndex(index + 1)
    }, 500)
  }

  if (finished) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas p-6 text-ink">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md text-center"
        >
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">{retry ? 'Retry submitted' : 'Interview complete'}</h1>
          <p className="mt-2 text-muted">
            {retry
              ? 'Your new answer has been evaluated. Your earlier attempt is kept, so you can see exactly what changed.'
              : `You answered ${questions.length} of ${questions.length} questions in ${fmt(elapsed)}. Your report is ready.`}
          </p>
          <div className="mt-6 rounded-xl border border-line bg-surface p-4 text-left text-sm">
            <p className="text-muted">Before you look — how confident did you feel?</p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} className="h-9 flex-1 rounded-lg border border-line text-sm font-medium hover:border-primary hover:text-primary">
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-subtle">
              <span>Not at all</span>
              <span>Very</span>
            </div>
          </div>
          <Button size="lg" className="mt-6 w-full" onClick={p.onComplete}>
            {retry ? 'Compare with previous answer' : 'View feedback report'} <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6">
        <p className="min-w-0 flex-1 truncate text-sm font-medium">
          {retry ? 'Retry · Behavioral question' : `${report.role} · Mixed interview`}
        </p>
        <span className="flex items-center gap-1.5 text-sm tabular-nums text-muted">
          <Clock className="h-4 w-4" /> {fmt(remaining)} left
        </span>
        <Button variant="ghost" size="sm" onClick={() => setConfirmExit(true)}>
          <X className="h-4 w-4" /> <span className="hidden sm:inline">Exit</span>
        </Button>
      </header>
      <div className="h-1 bg-line">
        <div className="h-full bg-primary transition-[width] duration-300 ease-out-strong" style={{ width: `${(done.length / questions.length) * 100}%` }} />
      </div>

      <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,380px)_1fr_240px] lg:overflow-hidden">
        {/* Question */}
        <section className="border-b border-line bg-surface p-5 sm:p-8 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <img src={AVATAR_INTERVIEWER} alt="" className="h-11 w-11 rounded-full" />
            <div>
              <p className="text-sm font-medium">Interviewer</p>
              <p className="text-xs text-muted">
                {retry ? 'Attempt 2' : `Question ${index + 1} of ${questions.length}`}
              </p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1 className="mt-6 text-xl font-semibold leading-snug sm:text-2xl">{current.q}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="blue">{current.category}</Badge>
                <Badge>{current.difficulty}</Badge>
                <Badge>~{current.minutes} min</Badge>
              </div>
            </motion.div>
          </AnimatePresence>
          {retry && (
            <div className="mt-8 border-t border-line pt-5">
              <button onClick={() => setShowPrev(!showPrev)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                <RotateCcw className="h-3.5 w-3.5" /> {showPrev ? 'Hide' : 'Show'} what to work on
              </button>
              {showPrev && (
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {report.questions[3].missing.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Answer */}
        <section className="flex min-h-[420px] flex-col p-4 sm:p-6 lg:min-h-0">
          <label htmlFor="answer" className="text-sm font-medium">
            Your answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Take a breath, then answer as you would out loud…"
            className="mt-2 min-h-60 flex-1 resize-none rounded-xl border border-line bg-surface p-4 text-[15px] leading-relaxed placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs tabular-nums text-muted">
              {words} words · {answer.length} characters
            </span>
            {savedAt && <span className="text-xs text-success-ink">Draft saved {savedAt}</span>}
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" disabled={!answer.trim()} onClick={() => setSavedAt('just now')}>
                <Save className="h-4 w-4" /> Save draft
              </Button>
              <Button disabled={!answer.trim() || saving} onClick={submit}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? 'Saving…' : isLast ? 'Submit & finish' : 'Submit answer'}
              </Button>
            </div>
          </div>
        </section>

        {/* Overview */}
        <aside className="hidden border-l border-line bg-surface p-5 lg:block lg:overflow-y-auto">
          <h2 className="text-sm font-semibold">Overview</h2>
          <p className="mt-1 text-xs text-muted">
            {done.length} done · {questions.length - done.length} remaining
          </p>
          <ol className="mt-4 space-y-1">
            {questions.map((q, i) => {
              const isDone = done.includes(i)
              const isCurrent = i === index
              return (
                <li key={q.q} className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm ${isCurrent ? 'bg-primary-soft' : ''}`}>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isDone ? 'bg-success text-white' : isCurrent ? 'bg-primary text-white' : 'border border-line text-muted'
                    }`}
                  >
                    {isDone ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className={`truncate ${isCurrent ? 'font-medium text-ink' : 'text-muted'}`}>{q.category}</span>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 border-t border-line pt-4 text-xs text-muted">
            <p className="flex justify-between">
              <span>Session time</span>
              <span className="tabular-nums text-ink">{fmt(elapsed)}</span>
            </p>
            <p className="mt-2">Feedback appears when you finish. Answers save as you submit them.</p>
          </div>
        </aside>
      </div>

      {/* Exit confirmation */}
      <AnimatePresence>
        {confirmExit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="exit-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-xl"
            >
              <h2 id="exit-title" className="text-lg font-semibold">
                Leave this interview?
              </h2>
              <p className="mt-2 text-sm text-muted">
                {done.length} of {questions.length} answers are saved. You can resume from question {index + 1} later from your dashboard. Your unsent draft will be kept.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={() => setConfirmExit(false)}>
                  Keep going
                </Button>
                <Button variant="danger" onClick={p.onExit}>
                  Save & exit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

const DRAFT =
  'I would check the bundle size and use lazy loading for routes. I’d also use React.memo and useMemo to stop re-renders, and compress the images.'
