import React from 'react'
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Minus, Sparkles, RotateCcw } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, scoreText } from '../shared/components/ui'
import { report, retryOfQ4, DIMENSIONS } from '../shared/data/coach'

export const args = {
  showDimensions: true,
}

export const argTypes = {
  showDimensions: { control: 'boolean' },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void; onBack?: () => void }

export default function AnswerComparison(props: Props) {
  const p = { ...args, ...props }
  const before = report.questions[3]
  const after = retryOfQ4
  const diff = after.score - before.score

  return (
    <AppShell active="feedback" title="Answer comparison" onNavigate={p.onNavigate}>
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        <button onClick={p.onBack} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to report
        </button>

        <header>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{before.category}</Badge>
            <span className="text-xs text-muted">Same question · same evaluation criteria (eval-prompt v3.2)</span>
          </div>
          <h2 className="mt-2 max-w-3xl text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{before.question}</h2>
        </header>

        {/* Score change — the answer to "did I improve?" */}
        <Panel className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
          <div className="flex items-center gap-5">
            <ScoreBlock label="Attempt 1" sub={report.date} score={before.score} muted />
            <span className="text-subtle">→</span>
            <ScoreBlock label="Attempt 2" sub={after.date} score={after.score} />
            <span className="flex items-center gap-1 rounded-lg bg-success-soft px-2.5 py-1.5 text-sm font-semibold text-success-ink">
              <ArrowUp className="h-4 w-4" />
              {diff}
            </span>
          </div>
          <div className="flex gap-3 border-t border-line pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed">{after.summary}</p>
          </div>
        </Panel>

        {p.showDimensions && (
          <Panel className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Dimension</th>
                  <th className="px-5 py-3 text-right font-medium">Attempt 1</th>
                  <th className="px-5 py-3 text-right font-medium">Attempt 2</th>
                  <th className="px-5 py-3 text-right font-medium">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {DIMENSIONS.map((d) => {
                  const a = before.dims[d]
                  const b = after.dims[d]
                  const c = b - a
                  return (
                    <tr key={d}>
                      <td className="px-5 py-3 font-medium">{d}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted">{a}</td>
                      <td className={`px-5 py-3 text-right font-semibold tabular-nums ${scoreText(b)}`}>{b}</td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
                            c > 0 ? 'text-success-ink' : c < 0 ? 'text-danger' : 'text-muted'
                          }`}
                        >
                          {c > 0 ? <ArrowUp className="h-3 w-3" /> : c < 0 ? <ArrowDown className="h-3 w-3" /> : null}
                          {c > 0 ? `+${c}` : c}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Panel>
        )}

        {/* Side by side answers */}
        <div className="grid gap-6 md:grid-cols-2">
          <Panel className="flex flex-col p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-muted">Previous answer</h3>
              <span className="text-xs text-subtle">{report.date}</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{before.answer}</p>
            <div className="mt-auto pt-5">
              <h4 className="text-xs font-medium text-muted">Flagged then</h4>
              <ul className="mt-2 space-y-1.5 text-sm">
                {before.weaknesses.map((w) => (
                  <li key={w} className="flex gap-2 text-muted">
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel className="flex flex-col border-primary/40 p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-primary-600">Latest answer</h3>
              <span className="text-xs text-subtle">{after.date}</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">{after.answer}</p>
            <div className="mt-auto pt-5">
              <h4 className="text-xs font-medium text-muted">Newly included</h4>
              <ul className="mt-2 space-y-1.5 text-sm">
                {after.added.map((w) => (
                  <li key={w} className="flex gap-2">
                    <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <h3 className="font-semibold">What improved</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {after.improved.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {s}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-semibold">Still to work on</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {after.remaining.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning-base" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              “Answer structure” moves toward Resolved only after consistent scores across several behavioral questions — one good retry isn’t enough.
            </p>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => p.onNavigate?.('progress')}>
            See weakness progress
          </Button>
          <Button onClick={() => p.onNavigate?.('questions')}>
            <RotateCcw className="h-4 w-4" /> Practise a similar question
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

function ScoreBlock({ label, sub, score, muted }: { label: string; sub: string; score: number; muted?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl ${muted ? 'text-subtle' : scoreText(score)}`}>{score}</p>
      <p className="text-[11px] text-subtle">{sub}</p>
    </div>
  )
}
