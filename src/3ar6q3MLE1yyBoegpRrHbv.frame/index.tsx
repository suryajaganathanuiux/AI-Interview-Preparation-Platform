import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Bookmark, BookmarkCheck, Play, Plus, CheckCircle2, Clock, Eye, X, SearchX } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel } from '../shared/components/ui'
import { questionBank, BankQuestion } from '../shared/data/coach'

export const args = {
  category: 'All',
  query: '',
  selected: 'b2',
}

export const argTypes = {
  category: { control: 'select', options: ['All', 'Technical', 'HR', 'Behavioral', 'Situational', 'Resume-Based', 'Communication'] },
  query: { control: 'text' },
  selected: { control: 'select', options: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'] },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void; onPractice?: () => void }

export default function QuestionBank(props: Props) {
  const p = { ...args, ...props }
  const [items, setItems] = useState<BankQuestion[]>(questionBank)
  const [query, setQuery] = useState(p.query)
  const [category, setCategory] = useState(p.category)
  const [difficulty, setDifficulty] = useState('Any')
  const [onlySaved, setOnlySaved] = useState(false)
  const [onlyUnanswered, setOnlyUnanswered] = useState(false)
  const [selectedId, setSelectedId] = useState(p.selected)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const list = useMemo(
    () =>
      items.filter(
        (q) =>
          (category === 'All' || q.category === category) &&
          (difficulty === 'Any' || q.difficulty === difficulty) &&
          (!onlySaved || q.saved) &&
          (!onlyUnanswered || !q.answered) &&
          (!query || `${q.question} ${q.topic}`.toLowerCase().includes(query.toLowerCase()))
      ),
    [items, category, difficulty, onlySaved, onlyUnanswered, query]
  )
  const selected = items.find((q) => q.id === selectedId)
  const toggleSave = (id: string) => setItems((xs) => xs.map((q) => (q.id === id ? { ...q, saved: !q.saved } : q)))

  return (
    <AppShell
      active="questions"
      title="Question Bank"
      onNavigate={p.onNavigate}
      actions={
        <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
          <Plus className="h-3.5 w-3.5" /> Add custom question
        </Button>
      }
    >
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Search + filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions or topics"
              className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Difficulty" className="h-10 rounded-lg border border-line bg-surface px-3 text-sm">
              {['Any', 'Easy', 'Medium', 'Hard'].map((d) => (
                <option key={d} value={d}>
                  {d === 'Any' ? 'Any difficulty' : d}
                </option>
              ))}
            </select>
            <FilterChip active={onlySaved} onClick={() => setOnlySaved(!onlySaved)}>
              Saved
            </FilterChip>
            <FilterChip active={onlyUnanswered} onClick={() => setOnlyUnanswered(!onlyUnanswered)}>
              Unanswered
            </FilterChip>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {CATS.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c === 'All' ? 'All categories' : c}
            </FilterChip>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* List */}
          <div className="min-w-0">
            <p className="mb-2 text-xs text-muted">
              {list.length} of {items.length} questions
            </p>
            {list.length ? (
              <Panel className="overflow-hidden">
                <ul className="divide-y divide-line">
                  {list.map((q) => (
                    <li key={q.id} className={`flex items-start gap-3 px-4 py-3.5 transition-colors duration-150 sm:px-5 ${selectedId === q.id ? 'bg-primary-soft' : 'hover:bg-canvas'}`}>
                      <button onClick={() => setSelectedId(q.id)} className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium">{q.question}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                          <span>{q.category}</span>
                          <span>{q.topic}</span>
                          <span className={q.difficulty === 'Hard' ? 'text-danger' : ''}>{q.difficulty}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {q.minutes} min
                          </span>
                          {q.answered && (
                            <span className="flex items-center gap-1 text-success-ink">
                              <CheckCircle2 className="h-3 w-3" /> Answered
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        onClick={() => toggleSave(q.id)}
                        aria-label={q.saved ? 'Remove bookmark' : 'Bookmark question'}
                        aria-pressed={q.saved}
                        className={`rounded-md p-1.5 ${q.saved ? 'text-primary' : 'text-subtle hover:text-ink'}`}
                      >
                        {q.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </Panel>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface py-14 text-center">
                <SearchX className="h-6 w-6 text-subtle" />
                <p className="mt-3 text-sm font-medium">No questions match</p>
                <p className="mt-1 text-xs text-muted">Try clearing a filter, or add your own question.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setQuery('')
                    setCategory('All')
                    setDifficulty('Any')
                    setOnlySaved(false)
                    setOnlyUnanswered(false)
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Detail */}
          <aside className="lg:sticky lg:top-6 lg:self-start">{selected ? <Detail key={selected.id} q={selected} onPractice={p.onPractice} onSave={() => toggleSave(selected.id)} /> : null}</aside>
        </div>
      </div>

      {/* Add custom question */}
      <AnimatePresence>
        {adding && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add a custom question</h2>
                <button onClick={() => setAdding(false)} className="rounded p-1 text-subtle hover:text-ink" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted">Something you were asked in a real interview? Add it and practise it here. Only you can see it.</p>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                placeholder="e.g. Why should we hire a fresher over someone with experience?"
                className="mt-4 w-full resize-none rounded-lg border border-line p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={draft.trim().length < 10}
                  onClick={() => {
                    const id = `c${Date.now()}`
                    setItems((xs) => [
                      {
                        id,
                        question: draft.trim(),
                        category: 'HR',
                        difficulty: 'Medium',
                        topic: 'Custom',
                        minutes: 3,
                        answered: false,
                        saved: true,
                        why: 'Added by you from a real interview.',
                        skills: ['Evaluated with the HR criteria'],
                        concepts: [],
                      },
                      ...xs,
                    ])
                    setSelectedId(id)
                    setDraft('')
                    setAdding(false)
                  }}
                >
                  Add question
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}

function Detail({ q, onPractice, onSave }: { q: BankQuestion; onPractice?: () => void; onSave: () => void }) {
  const [reveal, setReveal] = useState(false)
  const showConcepts = q.answered || reveal
  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        <Badge tone="blue">{q.category}</Badge>
        <Badge>{q.difficulty}</Badge>
        <Badge>~{q.minutes} min</Badge>
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-snug">{q.question}</h2>

      <h3 className="mt-5 text-xs font-medium text-muted">Why interviewers ask this</h3>
      <p className="mt-1 text-sm">{q.why}</p>

      <h3 className="mt-5 text-xs font-medium text-muted">What’s being evaluated</h3>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {q.skills.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>

      {q.concepts.length > 0 && (
        <>
          <h3 className="mt-5 text-xs font-medium text-muted">Strong answers usually cover</h3>
          {showConcepts ? (
            <ul className="mt-1.5 space-y-1.5 text-sm">
              {q.concepts.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-1.5 rounded-lg bg-canvas p-3 text-sm text-muted">
              Hidden until you’ve tried it, so your first answer is your own.
              <button onClick={() => setReveal(true)} className="mt-1 flex items-center gap-1.5 font-medium text-primary hover:underline">
                <Eye className="h-3.5 w-3.5" /> Reveal anyway
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-6 flex gap-2">
        <Button className="flex-1" onClick={onPractice}>
          <Play className="h-4 w-4" /> {q.answered ? 'Practise again' : 'Practise this question'}
        </Button>
        <Button variant="secondary" onClick={onSave} aria-label={q.saved ? 'Remove bookmark' : 'Bookmark'}>
          {q.saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
        </Button>
      </div>
    </Panel>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`h-8 shrink-0 whitespace-nowrap rounded-full border px-3 text-sm transition-colors duration-150 ${
        active ? 'border-navy bg-navy text-white' : 'border-line bg-surface text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

const CATS = ['All', 'Technical', 'HR', 'Behavioral', 'Situational', 'Resume-Based', 'Communication']
