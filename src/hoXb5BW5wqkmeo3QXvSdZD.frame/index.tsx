import React, { useMemo, useState } from 'react'
import { BarChart3, Play, Quote } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, Tone, scoreTone } from '../shared/components/ui'
import { LineChart, Sparkline } from '../shared/components/charts'
import { sessions, skillScores, weaknesses, WeaknessStatus } from '../shared/data/coach'

export const args = {
  state: 'default',
  range: '3m',
  selectedWeakness: 'w1',
}

export const argTypes = {
  state: { control: 'radio', options: ['default', 'insufficient'] },
  range: { control: 'radio', options: ['7d', '30d', '3m'] },
  selectedWeakness: { control: 'select', options: ['w1', 'w2', 'w3', 'w4', 'w5'] },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void; onPractice?: () => void }

export default function ProgressWeaknesses(props: Props) {
  const p = { ...args, ...props }
  const [range, setRange] = useState(p.range)
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(p.selectedWeakness)

  const filtered = useMemo(() => {
    const cutoff = { '7d': 6, '30d': 2, '3m': 0 }[range as '7d' | '30d' | '3m'] ?? 0
    return sessions.slice(cutoff).filter((s) => category === 'All' || s.category === category)
  }, [range, category])

  if (p.state === 'insufficient') {
    return (
      <AppShell active="progress" title="My Progress" onNavigate={p.onNavigate}>
        <div className="mx-auto max-w-2xl p-4 text-center sm:p-10">
          <BarChart3 className="mx-auto h-8 w-8 text-subtle" />
          <h2 className="mt-4 text-xl font-semibold">Not enough practice to show trends yet</h2>
          <p className="mt-2 text-sm text-muted">
            We need at least 2 completed interviews to plot your score, and 3 evaluated answers on the same skill before calling something a recurring weakness. We won’t guess before then.
          </p>
          <div className="mx-auto mt-6 max-w-xs">
            <div className="flex justify-between text-xs text-muted">
              <span>Interviews completed</span>
              <span>0 / 2</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-line" />
          </div>
          <Button className="mt-8" onClick={p.onPractice}>
            <Play className="h-4 w-4" /> Start an interview
          </Button>
        </div>
      </AppShell>
    )
  }

  const avg = filtered.length ? Math.round(filtered.reduce((s, x) => s + x.score, 0) / filtered.length) : 0
  const active = weaknesses.filter((w) => w.status !== 'Resolved').length
  const w = weaknesses.find((x) => x.id === selected) ?? weaknesses[0]

  return (
    <AppShell active="progress" title="My Progress" onNavigate={p.onNavigate}>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Progress & weaknesses</h2>
            <p className="mt-1 text-sm text-muted">Calculated from your evaluated answers. Weaknesses only appear once they recur.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg border border-line bg-surface p-1">
              {(['7d', '30d', '3m'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  aria-pressed={range === r}
                  className={`whitespace-nowrap rounded-md px-3 py-1 text-sm transition-colors duration-150 ${range === r ? 'bg-navy font-medium text-white' : 'text-muted hover:text-ink'}`}
                >
                  {{ '7d': '7 days', '30d': '30 days', '3m': '3 months' }[r]}
                </button>
              ))}
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-[38px] rounded-lg border border-line bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              aria-label="Interview category"
            >
              {['All', 'HR', 'Technical', 'Behavioral', 'Situational', 'Resume-Based', 'Mixed'].map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-y-5 rounded-xl border border-line bg-surface px-5 py-4 sm:grid-cols-4 sm:divide-x sm:divide-line sm:px-0">
          {[
            { k: 'Interviews in range', v: String(filtered.length) },
            { k: 'Average score', v: filtered.length ? String(avg) : '—' },
            { k: 'Practice frequency', v: '1.2 / week' },
            { k: 'Active weaknesses', v: String(active) },
          ].map((s) => (
            <div key={s.k} className="sm:px-5">
              <dt className="text-xs text-muted">{s.k}</dt>
              <dd className="mt-1 text-lg font-semibold">{s.v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-6 lg:grid-cols-3">
          <Panel className="p-5 sm:p-6 lg:col-span-2">
            <h3 className="font-semibold">Score trend</h3>
            <div className="mt-4">
              {filtered.length >= 2 ? (
                <LineChart points={filtered.map((s) => ({ label: s.date, value: s.score }))} />
              ) : (
                <div className="flex h-52 flex-col items-center justify-center rounded-lg border border-dashed border-line text-center">
                  <p className="text-sm font-medium">Only {filtered.length} interview in this range</p>
                  <p className="mt-1 text-xs text-muted">A trend needs at least 2. Widen the date range or category.</p>
                </div>
              )}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <h3 className="font-semibold">Skills: first vs latest</h3>
            <div className="mt-1 flex gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky/60" /> First 3 sessions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Latest 3
              </span>
            </div>
            <ul className="mt-5 space-y-4">
              {skillScores.map((s) => (
                <li key={s.dim}>
                  <div className="flex justify-between text-sm">
                    <span>{s.dim}</span>
                    <span className="tabular-nums">
                      <span className="text-muted">{s.first}</span> → <span className="font-semibold">{s.latest}</span>
                    </span>
                  </div>
                  <div className="relative mt-1.5 h-2 rounded-full bg-line-soft">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-sky/50" style={{ width: `${s.first}%` }} />
                    <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${s.latest}%`, clipPath: `inset(0 0 0 ${(s.first / s.latest) * 100}%)` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Weakness intelligence */}
        <section>
          <h3 className="text-lg font-semibold">Weakness intelligence</h3>
          <p className="mt-0.5 text-sm text-muted">Patterns across {sessions.length} interviews. Marked resolved only after consistent evidence over several attempts.</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
            <Panel className="overflow-hidden">
              <ul className="divide-y divide-line">
                {weaknesses.map((x) => (
                  <li key={x.id}>
                    <button
                      onClick={() => setSelected(x.id)}
                      aria-pressed={selected === x.id}
                      className={`grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3.5 text-left transition-colors duration-150 sm:grid-cols-[1fr_120px_96px_70px] sm:px-5 ${
                        selected === x.id ? 'bg-primary-soft' : 'hover:bg-canvas'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{x.name}</p>
                        <p className="text-xs text-muted">
                          {x.occurrences}× · {x.severity} severity
                        </p>
                      </div>
                      <div className="justify-self-end sm:justify-self-start">
                        <Badge tone={STATUS_TONE[x.status]}>{x.status}</Badge>
                      </div>
                      <div className="hidden sm:block">
                        <Sparkline values={x.history} tone={x.status === 'Resolved' || x.status === 'Improving' ? 'success' : 'warning'} />
                      </div>
                      <span className="hidden text-right text-sm tabular-nums sm:block">
                        <span className="text-muted">{x.previous}</span>→<span className="font-semibold">{x.latest}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel className="flex flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-lg font-semibold">{w.name}</h4>
                <Badge tone={STATUS_TONE[w.status]}>{w.status}</Badge>
              </div>
              <p className="mt-1.5 text-sm text-muted">{w.description}</p>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">First seen</dt>
                  <dd className="font-medium">{w.firstSeen}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Previous</dt>
                  <dd className="font-medium">{w.previous}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Latest</dt>
                  <dd className="font-medium">{w.latest}</dd>
                </div>
              </dl>
              <div className="mt-5 flex gap-2.5 rounded-lg bg-canvas p-3 text-sm">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
                <p className="text-ink/80">{w.evidence}</p>
              </div>
              <div className="mt-5">
                <h5 className="text-xs font-medium text-muted">Recommended</h5>
                <p className="mt-1 text-sm">{w.action}</p>
              </div>
              {w.status !== 'Resolved' && (
                <Button className="mt-6 w-full" onClick={p.onPractice}>
                  <Play className="h-4 w-4" /> Practise: {w.exercise}
                </Button>
              )}
            </Panel>
          </div>
        </section>

        {/* History */}
        <section>
          <h3 className="text-lg font-semibold">Interview history</h3>
          <Panel className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Interview</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[...filtered].reverse().map((s) => (
                  <tr key={s.id} className="cursor-pointer transition-colors duration-150 hover:bg-canvas" onClick={() => p.onNavigate?.('feedback')}>
                    <td className="px-5 py-3 text-muted">{s.date}</td>
                    <td className="px-5 py-3 font-medium">{s.title}</td>
                    <td className="px-5 py-3 text-muted">{s.category}</td>
                    <td className="px-5 py-3 text-muted">{s.minutes} min</td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={scoreTone(s.score)}>{s.score}</Badge>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted">
                      No interviews match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Panel>
        </section>
      </div>
    </AppShell>
  )
}

const STATUS_TONE: Record<WeaknessStatus, Tone> = {
  'Newly identified': 'neutral',
  'Needs improvement': 'warning',
  'In progress': 'blue',
  Improving: 'success',
  Resolved: 'navy',
}
