import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, ArrowUp, Paperclip, Mic, Flag, Bookmark, BookmarkCheck, ExternalLink, Check, Undo2, Copy, Info, Play } from 'lucide-react'
import { jobs, applications } from '../../data/career'
import type { NavKey } from '../AppShell'

type Msg =
  | { id: number; from: 'user'; text: string }
  | { id: number; from: 'nova'; kind: Kind; text: string }

type Kind = 'text' | 'jobs' | 'resume' | 'prep' | 'skills' | 'draft' | 'fallback'

export const SUGGESTIONS = [
  'Find fresher frontend developer jobs in Chennai with React',
  'Improve my resume for the Lumen Labs job',
  'Prepare me for my interview on Friday',
  'What skills am I missing for frontend roles?',
  'Draft a follow-up to Northwind Fintech',
]

export function NovaChat({
  onNavigate,
  compact = false,
  seed,
}: {
  onNavigate?: (k: NavKey) => void
  compact?: boolean
  seed?: string
}) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  const idRef = useRef(1)

  const send = (text: string) => {
    if (!text.trim() || thinking) return
    const id = idRef.current++
    setMsgs((m) => [...m, { id, from: 'user', text }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const r = respond(text)
      setMsgs((m) => [...m, { id: idRef.current++, from: 'nova', ...r }])
      setThinking(false)
    }, 700)
  }

  const seeded = useRef(false)
  useEffect(() => {
    if (seed && !seeded.current) {
      seeded.current = true
      send(seed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [msgs, thinking])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {msgs.length === 0 ? (
          <div className={compact ? '' : 'mx-auto max-w-2xl pt-6'}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className={`mt-4 font-semibold tracking-tight ${compact ? 'text-lg' : 'text-2xl'}`}>Hi Priya, what are we working on?</h2>
            <p className="mt-1 text-sm text-muted">
              I know your confirmed profile, resume, saved jobs, applications and interview history. I’ll always ask before saving or sending anything.
            </p>
            <div className={`mt-6 grid gap-2 ${compact ? '' : 'sm:grid-cols-2'}`}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm transition-colors duration-150 hover:border-secondary hover:bg-primary-soft"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`space-y-5 ${compact ? '' : 'mx-auto max-w-3xl'}`}>
            {msgs.map((m) =>
              m.from === 'user' ? (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="flex justify-end"
                >
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white">{m.text}</p>
                </motion.div>
              ) : (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                >
                  <NovaMessage kind={m.kind} text={m.text} compact={compact} onNavigate={onNavigate} onSend={send} />
                </motion.div>
              )
            )}
            {thinking && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Sparkles className="h-4 w-4 animate-pulse text-primary" /> NOVA is checking your profile…
              </div>
            )}
            <div ref={end} />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="border-t border-line bg-surface p-3 sm:p-4"
      >
        <div className={`flex items-end gap-2 rounded-xl border border-line bg-canvas p-2 focus-within:border-secondary ${compact ? '' : 'mx-auto max-w-3xl'}`}>
          <button type="button" className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink" aria-label="Attach a file">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            rows={1}
            placeholder="Ask about jobs, your resume or interviews…"
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm placeholder:text-subtle focus:outline-none"
            aria-label="Message NOVA"
          />
          <button type="button" className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink" aria-label="Voice input">
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors duration-150 hover:bg-primary-600 disabled:bg-line disabled:text-subtle"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <p className={`mt-2 text-[11px] text-subtle ${compact ? '' : 'mx-auto max-w-3xl'}`}>
          NOVA is AI and can be wrong. It never submits applications or sends messages without your approval.
        </p>
      </form>
    </div>
  )
}

function NovaMessage({
  kind,
  text,
  compact,
  onNavigate,
  onSend,
}: {
  kind: Kind
  text: string
  compact: boolean
  onNavigate?: (k: NavKey) => void
  onSend: (t: string) => void
}) {
  const [reported, setReported] = useState(false)
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed">{text}</p>
        <div className="mt-3">
          {kind === 'jobs' && <JobResults compact={compact} onNavigate={onNavigate} />}
          {kind === 'resume' && <ResumeProposal onNavigate={onNavigate} />}
          {kind === 'prep' && <PrepPlan onNavigate={onNavigate} />}
          {kind === 'skills' && <SkillGap onSend={onSend} />}
          {kind === 'draft' && <Draft />}
          {kind === 'fallback' && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button key={s} onClick={() => onSend(s)} className="rounded-full border border-line px-3 py-1 text-xs hover:border-secondary">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-subtle">
          <span>AI-generated</span>
          <button onClick={() => setReported(true)} disabled={reported} className="flex items-center gap-1 hover:text-ink disabled:hover:text-subtle">
            <Flag className="h-3 w-3" /> {reported ? 'Reported' : 'Report'}
          </button>
        </div>
      </div>
    </div>
  )
}

function JobResults({ compact, onNavigate }: { compact: boolean; onNavigate?: (k: NavKey) => void }) {
  const list = jobs.filter((j) => j.location === 'Chennai' && !j.expired).slice(0, 3)
  const [saved, setSaved] = useState<string[]>(['j1'])
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {['Frontend Developer', 'Fresher', 'Chennai', 'React', 'JavaScript'].map((c) => (
          <span key={c} className="rounded-md bg-line-soft px-2 py-0.5 text-xs text-muted">
            {c}
          </span>
        ))}
      </div>
      <div className={`grid gap-2 ${compact ? '' : 'md:grid-cols-3'}`}>
        {list.map((j) => (
          <div key={j.id} className="flex flex-col rounded-xl border border-line bg-surface p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{j.title}</p>
                <p className="truncate text-xs text-muted">
                  {j.company} · {j.mode}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-primary-soft px-1.5 py-0.5 text-xs font-semibold text-primary">{j.fit}%</span>
            </div>
            <p className="mt-2 text-xs text-muted">
              <span className="text-ink">Why:</span> you have {j.matching.slice(0, 3).join(', ')}
              {j.missing.length ? `; missing ${j.missing[0]}` : ''}.
            </p>
            <p className="mt-2 text-[11px] text-subtle">
              {j.source} · verified {j.verified.toLowerCase()} · {j.salary ?? 'Salary not listed'}
            </p>
            <div className="mt-auto flex gap-2 pt-3">
              <button onClick={() => onNavigate?.('job-detail')} className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-medium text-white hover:bg-primary-600">
                View job
              </button>
              <button
                onClick={() => setSaved((s) => (s.includes(j.id) ? s.filter((x) => x !== j.id) : [...s, j.id]))}
                className="rounded-lg border border-line px-2 text-muted hover:text-ink"
                aria-label={saved.includes(j.id) ? 'Unsave job' : 'Save job'}
              >
                {saved.includes(j.id) ? <BookmarkCheck className="h-3.5 w-3.5 text-primary" /> : <Bookmark className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="flex gap-1.5 text-[11px] text-subtle">
        <Info className="mt-px h-3 w-3 shrink-0" /> Sample listings in development mode. Live results come only from authorised job sources.
      </p>
    </div>
  )
}

function ResumeProposal({ onNavigate }: { onNavigate?: (k: NavKey) => void }) {
  const [state, setState] = useState<'pending' | 'saved' | 'discarded'>('pending')
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <ul className="divide-y divide-line text-sm">
        <li className="flex gap-2.5 px-4 py-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span>Reword your intern bullet to mention <b>REST API integration</b> — you confirmed this in your profile.</span>
        </li>
        <li className="flex gap-2.5 px-4 py-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span>Move <b>Projects</b> above Education; this job weights hands-on work.</span>
        </li>
        <li className="flex gap-2.5 bg-warning-soft px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span>
            <b>TypeScript</b> and <b>Jest</b> appear in the job but not in your profile, so I didn’t add them. Add them to your skills only if you’ve used them.
          </span>
        </li>
      </ul>
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-canvas px-4 py-3">
        {state === 'pending' && (
          <>
            <p className="mr-auto text-xs text-muted">Save as a new version? Your active resume stays unchanged.</p>
            <button onClick={() => setState('discarded')} className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-ink">
              Discard
            </button>
            <button onClick={() => onNavigate?.('resume')} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium hover:bg-canvas">
              Review in Resume Studio
            </button>
            <button onClick={() => setState('saved')} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600">
              Approve & save
            </button>
          </>
        )}
        {state === 'saved' && (
          <>
            <p className="mr-auto flex items-center gap-1.5 text-xs text-success-ink">
              <Check className="h-3.5 w-3.5" /> Saved as “Lumen Labs – Frontend” (v4)
            </p>
            <button onClick={() => setState('pending')} className="flex items-center gap-1 text-xs font-medium text-muted hover:text-ink">
              <Undo2 className="h-3.5 w-3.5" /> Undo
            </button>
          </>
        )}
        {state === 'discarded' && <p className="text-xs text-muted">Discarded. Nothing was saved.</p>}
      </div>
    </div>
  )
}

function PrepPlan({ onNavigate }: { onNavigate?: (k: NavKey) => void }) {
  const app = applications[0]
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-xs text-muted">From your tracker</p>
      <p className="text-sm font-semibold">
        {app.company} · {app.next}
      </p>
      <ol className="mt-4 space-y-3 text-sm">
        {[
          ['Today', 'Read the job description again; list 3 things you built that match it', '20 min'],
          ['Thu', 'Mock interview: React fundamentals + your capstone (5 questions)', '30 min'],
          ['Thu', 'Retry your weakest answer and compare', '10 min'],
          ['Fri 9:00', 'Quick review of likely topics; no new material', '15 min'],
        ].map(([d, t, m]) => (
          <li key={t} className="grid grid-cols-[64px_1fr] gap-2">
            <span className="text-xs font-semibold text-muted">{d}</span>
            <span>
              {t} <span className="text-xs text-subtle">· {m}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onNavigate?.('studio')} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600">
          <Play className="h-3.5 w-3.5" /> Start the mock interview
        </button>
        <button onClick={() => onNavigate?.('job-detail')} className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium hover:bg-canvas">
          Open job details
        </button>
      </div>
    </div>
  )
}

function SkillGap({ onSend }: { onSend: (t: string) => void }) {
  const rows = [
    { s: 'TypeScript', p: 'High', n: '4 of 7 matches' },
    { s: 'Testing (Jest / RTL)', p: 'High', n: '3 of 7 matches' },
    { s: 'Next.js', p: 'Medium', n: '2 of 7 matches' },
    { s: 'Redux', p: 'Low', n: '1 of 7 matches' },
  ]
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs text-muted">
            <th className="px-4 py-2 font-medium">Missing skill</th>
            <th className="px-4 py-2 font-medium">Priority</th>
            <th className="hidden px-4 py-2 font-medium sm:table-cell">Asked for in</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.s}>
              <td className="px-4 py-2 font-medium">{r.s}</td>
              <td className={`px-4 py-2 text-xs font-medium ${r.p === 'High' ? 'text-warning' : 'text-muted'}`}>{r.p}</td>
              <td className="hidden px-4 py-2 text-muted sm:table-cell">{r.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-canvas px-4 py-3 text-xs">
        <a className="flex items-center gap-1 font-medium text-primary hover:underline" href="https://www.typescriptlang.org/docs/handbook/intro.html" target="_blank" rel="noreferrer">
          TypeScript Handbook <ExternalLink className="h-3 w-3" />
        </a>
        <span className="text-subtle">· official docs, external</span>
        <button onClick={() => onSend('Prepare me for my interview on Friday')} className="ml-auto font-medium text-muted hover:text-ink">
          Build a plan around this
        </button>
      </div>
    </div>
  )
}

function Draft() {
  const [copied, setCopied] = useState(false)
  const text =
    'Hi Northwind Fintech team,\n\nI applied for the Junior React Developer role on May 9 and wanted to check whether there’s an update on next steps. I’m still very interested — the team’s work on payment dashboards lines up with the React projects on my resume.\n\nThank you for your time,\nPriya Raman'
  return (
    <div className="rounded-xl border border-line bg-surface">
      <pre className="whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed">{text}</pre>
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-canvas px-4 py-3">
        <p className="mr-auto text-xs text-muted">Draft only. NOVA won’t send this — copy it into your email.</p>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(text).catch(() => {})
            setCopied(true)
          }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Copied' : 'Copy draft'}
        </button>
      </div>
    </div>
  )
}

function respond(text: string): { kind: Kind; text: string } {
  const t = text.toLowerCase()
  if (t.includes('job') && (t.includes('find') || t.includes('search') || t.includes('show')))
    return { kind: 'jobs', text: 'I found 3 open listings in Chennai that match your confirmed skills. Here’s why each one fits, ranked by job fit:' }
  if (t.includes('resume'))
    return {
      kind: 'resume',
      text: 'I compared the Lumen Labs description with your active resume (v3). Two changes use things you’ve already confirmed; one gap I can’t fill for you:',
    }
  if (t.includes('interview') || t.includes('prepare'))
    return { kind: 'prep', text: 'Your next real interview is with Lumen Labs. Based on the job description and your weak spot in answer structure, here’s a plan:' }
  if (t.includes('skill') || t.includes('missing') || t.includes('gap'))
    return { kind: 'skills', text: 'Across your 7 matched jobs, these skills come up that aren’t in your profile. Priority is how often they’re required:' }
  if (t.includes('follow') || t.includes('draft') || t.includes('message'))
    return { kind: 'draft', text: 'It’s been 5 days since you applied to Northwind Fintech. Here’s a short, polite follow-up:' }
  return {
    kind: 'fallback',
    text: 'In this preview I can only act on a few career tasks. Try one of these — in production I’d answer from your profile and authorised job sources.',
  }
}
