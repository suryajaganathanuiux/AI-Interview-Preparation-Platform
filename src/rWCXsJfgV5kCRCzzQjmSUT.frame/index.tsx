import React, { useState } from 'react'
import { Lock, Play, Loader2, CheckCircle2, AlertCircle, History } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, DevModeNote } from '../shared/components/ui'
import { DIMENSIONS, DEFAULT_WEIGHTS, Dimension, promptVersions } from '../shared/data/coach'

export const args = {
  category: 'Behavioral',
  testState: 'idle',
}

export const argTypes = {
  category: { control: 'select', options: ['Technical', 'Behavioral', 'HR', 'Mixed'] },
  testState: { control: 'radio', options: ['idle', 'passed', 'failed'] },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void }

export default function AdminAIConfig(props: Props) {
  const p = { ...args, ...props }
  const [category, setCategory] = useState(p.category)
  const [weights, setWeights] = useState<Record<string, Record<Dimension, number>>>(PRESETS)
  const [prompt, setPrompt] = useState(PROMPT)
  const [test, setTest] = useState(p.testState)
  const [temperature, setTemperature] = useState(0.2)
  const [published, setPublished] = useState(false)

  const w = weights[category]
  const total = DIMENSIONS.reduce((s, d) => s + w[d], 0)
  const valid = total === 100
  const setW = (d: Dimension, v: number) => {
    setWeights({ ...weights, [category]: { ...w, [d]: v } })
    setTest('idle')
    setPublished(false)
  }

  const runTest = () => {
    setTest('running')
    setTimeout(() => setTest('passed'), 900)
  }

  return (
    <AppShell
      variant="admin"
      active="admin-ai"
      title="AI configuration"
      onNavigate={(k) => p.onNavigate?.(k === 'admin-ai' ? 'admin-ai' : k)}
      actions={
        <Button size="sm" disabled={!valid || test !== 'passed' || published} onClick={() => setPublished(true)}>
          {published ? 'Published v3.3' : 'Publish v3.3'}
        </Button>
      }
    >
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Answer evaluation</h2>
            <p className="mt-1 text-sm text-muted">Editing draft v3.3. Candidates keep seeing v3.2 until you publish; past evaluations keep the version they were scored with.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Lock className="h-3.5 w-3.5" /> API keys are stored server-side and never sent to the browser.
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Prompt + test */}
          <div className="min-w-0 space-y-6">
            <Panel className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Evaluation prompt</h3>
                  <Badge tone="warning">Draft</Badge>
                </div>
                <span className="text-xs text-muted">Output schema: evaluation.v3.json</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  setTest('idle')
                  setPublished(false)
                }}
                spellCheck={false}
                rows={14}
                className="block w-full resize-y bg-canvas/40 p-5 font-mono text-[13px] leading-relaxed text-ink focus:outline-none"
                aria-label="Evaluation prompt"
              />
            </Panel>

            <Panel className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Test before publishing</h3>
                  <p className="text-xs text-muted">Runs the draft against 12 benchmark answers: relevant, partial, incorrect, empty, padded, short-but-correct.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={runTest} disabled={test === 'running' || !valid}>
                  {test === 'running' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  {test === 'running' ? 'Running…' : 'Run test suite'}
                </Button>
              </div>
              {test === 'passed' && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[440px] text-sm">
                    <tbody className="divide-y divide-line">
                      {BENCH.map((b) => (
                        <tr key={b.c}>
                          <td className="py-2 pr-4">{b.c}</td>
                          <td className="py-2 pr-4 text-right tabular-nums text-muted">{b.v32}</td>
                          <td className="py-2 pr-4 text-right font-semibold tabular-nums">{b.v33}</td>
                          <td className="py-2 text-right">
                            <span className="inline-flex items-center gap-1 text-xs text-success-ink">
                              <CheckCircle2 className="h-3.5 w-3.5" /> within range
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 text-xs text-muted">Columns: case · v3.2 score · v3.3 score. Schema valid on 12/12. Avg 1,840 tokens · est. $0.004 per answer.</p>
                </div>
              )}
              {test === 'failed' && (
                <p role="alert" className="mt-4 flex gap-2 rounded-lg bg-danger-soft p-3 text-sm text-danger">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  2 of 12 outputs failed schema validation (missing “evidence” field). Fix the prompt and run again.
                </p>
              )}
            </Panel>

            <DevModeNote>Development mode: tests run against a simulated provider. Connect OPENAI_API_KEY on the server to run real evaluations.</DevModeNote>
          </div>

          {/* Weights + model + history */}
          <div className="space-y-6">
            <Panel className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Scoring weights</h3>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-8 rounded-md border border-line bg-surface px-2 text-xs" aria-label="Interview category">
                  {Object.keys(PRESETS).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <ul className="mt-4 space-y-4">
                {DIMENSIONS.map((d) => (
                  <li key={d}>
                    <div className="flex justify-between text-sm">
                      <label htmlFor={`w-${d}`}>{d}</label>
                      <span className="font-semibold tabular-nums">{w[d]}%</span>
                    </div>
                    <input
                      id={`w-${d}`}
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={w[d]}
                      onChange={(e) => setW(d, Number(e.target.value))}
                      className="mt-1 w-full accent-primary"
                    />
                  </li>
                ))}
              </ul>
              <p className={`mt-3 text-sm font-medium ${valid ? 'text-success-ink' : 'text-danger'}`}>
                Total {total}% {valid ? '' : `— must equal 100%`}
              </p>
            </Panel>

            <Panel className="space-y-4 p-5">
              <h3 className="text-sm font-semibold">Model</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <label className="block">
                  <span className="text-xs text-muted">Provider</span>
                  <select className="mt-1 h-9 w-full rounded-md border border-line bg-surface px-2">
                    <option>OpenAI</option>
                    <option>Azure OpenAI</option>
                    <option>Anthropic</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-muted">Model</span>
                  <select className="mt-1 h-9 w-full rounded-md border border-line bg-surface px-2">
                    <option>gpt-4.1</option>
                    <option>gpt-4.1-mini</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-muted">Max output tokens</span>
                  <input type="number" defaultValue={1200} className="mt-1 h-9 w-full rounded-md border border-line px-2" />
                </label>
                <label className="block">
                  <span className="text-xs text-muted">Temperature · {temperature.toFixed(1)}</span>
                  <input type="range" min={0} max={1} step={0.1} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="mt-3 w-full accent-primary" />
                </label>
              </div>
              <p className="text-xs text-muted">Low temperature keeps scores consistent between identical answers.</p>
            </Panel>

            <Panel className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <History className="h-4 w-4 text-muted" /> Version history
              </h3>
              <ol className="mt-3 space-y-3">
                {promptVersions.map((v) => (
                  <li key={v.version} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {v.version} <span className="font-normal text-muted">· {v.date} · {v.author}</span>
                      </p>
                      <p className="truncate text-xs text-muted">{v.note}</p>
                    </div>
                    <Badge tone={v.status === 'Published' ? (published ? 'neutral' : 'success') : v.status === 'Draft' ? (published ? 'success' : 'warning') : 'neutral'}>
                      {v.status === 'Draft' && published ? 'Published' : v.status === 'Published' && published ? 'Archived' : v.status}
                    </Badge>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

const PRESETS: Record<string, Record<Dimension, number>> = {
  Technical: { Relevance: 20, Accuracy: 35, Structure: 15, Completeness: 20, Communication: 10 },
  Behavioral: { ...DEFAULT_WEIGHTS, Accuracy: 15, Structure: 30 },
  HR: { Relevance: 30, Accuracy: 10, Structure: 20, Completeness: 15, Communication: 25 },
  Mixed: { ...DEFAULT_WEIGHTS },
}

const BENCH = [
  { c: 'Relevant, complete', v32: 84, v33: 83 },
  { c: 'Partially correct', v32: 63, v33: 61 },
  { c: 'Factually incorrect', v32: 34, v33: 31 },
  { c: 'Long but padded', v32: 71, v33: 58 },
  { c: 'Short but correct', v32: 78, v33: 80 },
  { c: 'Empty answer', v32: 0, v33: 0 },
]

const PROMPT = `You are evaluating a candidate's interview answer for practice purposes.

Inputs: {question}, {category}, {experience_level}, {reference_criteria}, {answer}

Score each dimension 0-100: relevance, accuracy, structure, completeness, communication.

Rules:
- Do not reward length. Penalise repetition or padding that adds no content.
- Do not penalise a concise answer that is correct and complete.
- Distinguish factual errors from missing details.
- Quote evidence from the answer for every weakness.
- Never infer personality, intelligence or employability from style.
- If the criteria cannot be verified from the answer, set confidence to "low".

Return JSON matching evaluation.v3 only.`
