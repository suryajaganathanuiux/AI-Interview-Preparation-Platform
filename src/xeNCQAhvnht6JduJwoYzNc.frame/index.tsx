import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Search, LayoutList, LayoutGrid, Bookmark, BookmarkCheck, ExternalLink, SlidersHorizontal, BellRing, X, SearchX, Clock } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, DevModeNote } from '../shared/components/ui'
import { jobs as allJobs, Job } from '../shared/data/career'

export const args = {
  tab: 'recommended',
  view: 'list',
  query: '',
}

export const argTypes = {
  tab: { control: 'radio', options: ['recommended', 'search', 'saved'] },
  view: { control: 'radio', options: ['list', 'grid'] },
  query: { control: 'text' },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void; onOpenJob?: (id: string) => void }

export default function DiscoverJobs(props: Props) {
  const p = { ...args, ...props }
  const [tab, setTab] = useState(p.tab)
  const [view, setView] = useState(p.view)
  const [query, setQuery] = useState(p.query)
  const [parsed, setParsed] = useState<string[]>([])
  const [saved, setSaved] = useState<string[]>(allJobs.filter((j) => j.saved).map((j) => j.id))
  const [f, setF] = useState<Filters>(DEFAULT_FILTERS)
  const [drawer, setDrawer] = useState(false)
  const [alertOn, setAlertOn] = useState(true)
  const [searchSaved, setSearchSaved] = useState(false)

  const runQuery = (q: string) => {
    const t = q.toLowerCase()
    const chips: string[] = []
    const next = { ...DEFAULT_FILTERS }
    for (const c of ['chennai', 'bengaluru', 'hyderabad', 'coimbatore', 'remote'])
      if (t.includes(c)) {
        const city = c[0].toUpperCase() + c.slice(1)
        chips.push(city)
        if (c === 'remote') next.modes = ['Remote']
        else next.location = city
      }
    if (t.includes('fresher')) {
      chips.push('Fresher-friendly')
      next.fresher = true
    }
    if (t.includes('intern')) {
      chips.push('Internship')
      next.types = ['Internship']
    }
    for (const s of ['react', 'javascript', 'css', 'figma']) if (t.includes(s)) chips.push(s === 'css' ? 'CSS' : s[0].toUpperCase() + s.slice(1))
    if (t.includes('frontend') || t.includes('front-end')) chips.unshift('Frontend roles')
    setParsed(chips)
    setF(next)
    setTab('search')
    setSearchSaved(false)
  }

  const list = useMemo(() => {
    let xs = allJobs.filter((j) => {
      if (tab === 'saved') return saved.includes(j.id)
      if (f.location !== 'Any' && j.location !== f.location) return false
      if (f.modes.length && !f.modes.includes(j.mode)) return false
      if (f.types.length && !f.types.includes(j.type)) return false
      if (f.fresher && !j.fresherFriendly) return false
      if (f.salaryListed && !j.salary) return false
      if (f.posted !== 'Any' && j.postedDays > Number(f.posted)) return false
      if (!f.showExpired && j.expired) return false
      return true
    })
    if (tab === 'recommended') xs = xs.filter((j) => j.fit >= 65)
    return [...xs].sort((a, b) => (tab === 'search' ? a.postedDays - b.postedDays : b.fit - a.fit))
  }, [tab, f, saved])

  const toggleSave = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const filtersActive = JSON.stringify(f) !== JSON.stringify(DEFAULT_FILTERS)

  return (
    <AppShell active={tab === 'saved' ? 'jobs-saved' : tab === 'recommended' ? 'jobs-recommended' : 'jobs'} title="Discover Jobs" onNavigate={p.onNavigate}>
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* NL search */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (query.trim()) runQuery(query)
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe the job — e.g. fresher React jobs in Chennai, hybrid"
              className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-4 text-[15px] placeholder:text-subtle focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15"
              aria-label="Search jobs in plain language"
            />
          </div>
          <Button size="lg" type="submit">
            <Search className="h-4 w-4" /> Search
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {parsed.length ? (
            <>
              <span className="text-muted">Understood:</span>
              {parsed.map((c) => (
                <span key={c} className="rounded-md bg-primary-soft px-2 py-0.5 font-medium text-primary">
                  {c}
                </span>
              ))}
              <button
                onClick={() => {
                  setParsed([])
                  setQuery('')
                  setF(DEFAULT_FILTERS)
                }}
                className="text-muted hover:text-ink"
              >
                Clear
              </button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 text-muted">
                <Clock className="h-3 w-3" /> Recent:
              </span>
              {RECENT.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setQuery(r)
                    runQuery(r)
                  }}
                  className="rounded-full border border-line px-2.5 py-0.5 text-muted hover:border-secondary hover:text-ink"
                >
                  {r}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Tabs + view */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-line">
          <div className="-mb-px flex gap-5" role="tablist">
            {(['recommended', 'search', 'saved'] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap border-b-2 pb-3 text-sm transition-colors duration-150 ${tab === t ? 'border-primary font-semibold text-ink' : 'border-transparent text-muted hover:text-ink'}`}
              >
                {{ recommended: 'Recommended', search: 'All jobs', saved: `Saved (${saved.length})` }[t]}
              </button>
            ))}
          </div>
          <div className="mb-2 ml-auto flex items-center gap-2">
            <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setDrawer(true)}>
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </Button>
            <div className="flex rounded-lg border border-line bg-surface p-0.5">
              {(['list', 'grid'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  aria-label={`${v} view`}
                  className={`rounded-md p-1.5 ${view === v ? 'bg-canvas text-ink' : 'text-subtle hover:text-ink'}`}
                >
                  {v === 'list' ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel f={f} setF={setF} active={filtersActive} />
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-xs font-medium text-muted">Saved searches</p>
              <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                <span className="truncate">Fresher React · Chennai</span>
                <button
                  onClick={() => setAlertOn(!alertOn)}
                  role="switch"
                  aria-checked={alertOn}
                  className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs ${alertOn ? 'bg-primary-soft text-primary' : 'text-muted'}`}
                >
                  <BellRing className="h-3 w-3" /> {alertOn ? 'Daily alert' : 'Alert off'}
                </button>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted">
                {list.length} {list.length === 1 ? 'job' : 'jobs'}
                {tab === 'recommended' && ' with fit of 65% or more'}
              </p>
              {tab === 'search' && (parsed.length > 0 || filtersActive) && (
                <button onClick={() => setSearchSaved(true)} disabled={searchSaved} className="text-sm font-medium text-primary hover:underline disabled:text-success-ink disabled:no-underline">
                  {searchSaved ? 'Search saved · alert on' : 'Save search & get alerts'}
                </button>
              )}
            </div>

            {list.length ? (
              <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
                {list.map((j) => (
                  <JobCard key={j.id} j={j} grid={view === 'grid'} saved={saved.includes(j.id)} onSave={() => toggleSave(j.id)} onOpen={() => p.onNavigate?.('job-detail')} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface py-16 text-center">
                <SearchX className="h-6 w-6 text-subtle" />
                <p className="mt-3 font-medium">{tab === 'saved' ? 'No saved jobs yet' : 'No jobs match these filters'}</p>
                <p className="mt-1 max-w-sm text-sm text-muted">
                  {tab === 'saved' ? 'Bookmark a job to keep it here and start its prep pipeline.' : 'Try a wider location or remove the salary filter — many fresher listings don’t publish pay.'}
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => (tab === 'saved' ? setTab('recommended') : setF(DEFAULT_FILTERS))}>
                  {tab === 'saved' ? 'See recommended jobs' : 'Reset filters'}
                </Button>
              </div>
            )}
            <div className="mt-6">
              <DevModeNote>Sample listings for fictional companies (development mode). Live results come only from authorised job APIs, approved partner feeds and admin-managed listings.</DevModeNote>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-50 bg-navy/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setDrawer(false)}>
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[85%] overflow-y-auto rounded-t-2xl bg-surface p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold">Filters</p>
                <button onClick={() => setDrawer(false)} className="rounded p-1 text-muted" aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel f={f} setF={setF} active={filtersActive} />
              <Button className="mt-6 w-full" onClick={() => setDrawer(false)}>
                Show {list.length} jobs
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}

function JobCard({ j, grid, saved, onSave, onOpen }: { j: Job; grid: boolean; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return (
    <Panel className={`group flex flex-col p-4 transition-[border-color,box-shadow] duration-150 hover:border-subtle hover:shadow-sm sm:p-5 ${j.expired ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-line-soft text-xs font-semibold text-muted">{j.initials}</span>
        <div className="min-w-0 flex-1">
          <button onClick={onOpen} className="text-left font-semibold hover:text-primary">
            {j.title}
          </button>
          <p className="text-sm text-muted">
            {j.company} · {j.location}
          </p>
        </div>
        {j.expired ? <Badge tone="danger">Expired</Badge> : <FitBadge fit={j.fit} />}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span>{j.mode}</span>
        <span>{j.type}</span>
        <span>{j.experience}</span>
        <span className={j.salary ? 'text-ink' : ''}>{j.salary ?? 'Salary not disclosed'}</span>
        <span>{j.posted}</span>
        {j.fresherFriendly && <span className="text-success-ink">Fresher-friendly</span>}
      </div>

      <div className={`mt-3 flex flex-wrap gap-1.5 ${grid ? '' : 'sm:max-w-[80%]'}`}>
        {j.matching.slice(0, grid ? 3 : 5).map((s) => (
          <span key={s} className="rounded-md bg-success-soft px-2 py-0.5 text-xs text-success-ink">
            {s}
          </span>
        ))}
        {j.missing.map((s) => (
          <span key={s} className="rounded-md bg-warning-soft px-2 py-0.5 text-xs text-warning">
            Missing: {s}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <span className="mr-auto text-[11px] text-subtle">
          {j.source} · {j.expired ? j.verified : `verified ${j.verified.toLowerCase()}`}
        </span>
        <button onClick={onSave} aria-pressed={saved} aria-label={saved ? 'Unsave job' : 'Save job'} className={`rounded-lg border border-line p-2 ${saved ? 'text-primary' : 'text-muted hover:text-ink'}`}>
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
        {j.expired ? (
          <Button size="sm" variant="secondary" disabled>
            No longer accepting
          </Button>
        ) : (
          <>
            <Button size="sm" variant="secondary" onClick={onOpen}>
              Details
            </Button>
            <Button size="sm" onClick={onOpen}>
              Apply <ExternalLink className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </Panel>
  )
}

function FitBadge({ fit }: { fit: number }) {
  return (
    <span className="shrink-0 text-right">
      <span className="block text-lg font-semibold leading-none text-primary">{fit}%</span>
      <span className="text-[11px] text-muted">job fit</span>
    </span>
  )
}

type Filters = { location: string; modes: string[]; types: string[]; fresher: boolean; salaryListed: boolean; posted: string; showExpired: boolean }

const DEFAULT_FILTERS: Filters = { location: 'Any', modes: [], types: [], fresher: false, salaryListed: false, posted: 'Any', showExpired: true }

function FilterPanel({ f, setF, active }: { f: Filters; setF: (f: Filters) => void; active: boolean }) {
  const toggle = (key: 'modes' | 'types', v: string) => setF({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] })
  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Filters</p>
        {active && (
          <button onClick={() => setF(DEFAULT_FILTERS)} className="text-xs font-medium text-primary hover:underline">
            Reset
          </button>
        )}
      </div>
      <label className="block">
        <span className="text-xs font-medium text-muted">Location</span>
        <select value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} className="mt-1.5 h-9 w-full rounded-lg border border-line bg-surface px-2">
          {['Any', 'Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore', 'Remote'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <Group label="Work mode">
        {['Remote', 'Hybrid', 'Office'].map((m) => (
          <Check key={m} label={m} on={f.modes.includes(m)} onChange={() => toggle('modes', m)} />
        ))}
      </Group>
      <Group label="Job type">
        {['Full-time', 'Internship', 'Contract'].map((m) => (
          <Check key={m} label={m} on={f.types.includes(m)} onChange={() => toggle('types', m)} />
        ))}
      </Group>
      <label className="block">
        <span className="text-xs font-medium text-muted">Date posted</span>
        <select value={f.posted} onChange={(e) => setF({ ...f, posted: e.target.value })} className="mt-1.5 h-9 w-full rounded-lg border border-line bg-surface px-2">
          <option value="Any">Any time</option>
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
        </select>
      </label>
      <Group label="More">
        <Check label="Fresher-friendly only" on={f.fresher} onChange={() => setF({ ...f, fresher: !f.fresher })} />
        <Check label="Salary listed" on={f.salaryListed} onChange={() => setF({ ...f, salaryListed: !f.salaryListed })} />
        <Check label="Show expired listings" on={f.showExpired} onChange={() => setF({ ...f, showExpired: !f.showExpired })} />
      </Group>
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-xs font-medium text-muted">{label}</legend>
      <div className="mt-1.5 space-y-1.5">{children}</div>
    </fieldset>
  )
}

function Check({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input type="checkbox" checked={on} onChange={onChange} className="h-4 w-4 rounded accent-primary" />
      {label}
    </label>
  )
}

const RECENT = ['fresher React jobs in Chennai', 'remote frontend internship', 'UI developer Coimbatore']
