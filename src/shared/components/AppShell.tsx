import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Sparkles,
  Search,
  Briefcase,
  Star,
  Bookmark,
  KanbanSquare,
  FileText,
  Mic,
  Library,
  MessageSquareText,
  TrendingUp,
  ShieldCheck,
  Bell,
  Menu,
  X,
  Settings2,
  LogOut,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Compass,
} from 'lucide-react'
import { candidate } from '../data/coach'
import { NovaPanel } from './nova/NovaPanel'

export type NavKey =
  | 'dashboard'
  | 'nova'
  | 'jobs'
  | 'jobs-recommended'
  | 'jobs-saved'
  | 'job-detail'
  | 'applications'
  | 'resume'
  | 'studio'
  | 'questions'
  | 'feedback'
  | 'progress'
  | 'trust'
  | 'admin-ai'
  | 'signout'

type Props = {
  active: NavKey
  onNavigate?: (key: NavKey) => void
  variant?: 'candidate' | 'admin'
  title: string
  crumbs?: string[]
  actions?: React.ReactNode
  hideNova?: boolean
  children: React.ReactNode
}

export function AppShell({ active, onNavigate, variant = 'candidate', title, crumbs, actions, hideNova, children }: Props) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark] = useState(() => readTheme())
  const [nova, setNova] = useState(false)
  const [menu, setMenu] = useState<'none' | 'notifications' | 'profile' | 'search'>('none')
  const groups = variant === 'admin' ? ADMIN_NAV : CANDIDATE_NAV
  const trail = crumbs ?? [groupOf(active), title].filter(Boolean)

  const go = (k: NavKey) => {
    setOpen(false)
    setMenu('none')
    onNavigate?.(k)
  }
  const toggleDark = () => {
    const next = !dark
    setDark(next)
    try {
      localStorage.setItem('acc-theme', next ? 'dark' : 'light')
    } catch {}
  }

  return (
    <div className={`${dark ? 'dark' : ''} flex h-screen bg-canvas text-ink`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-[transform,width] duration-200 ease-out-strong lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[68px]' : 'lg:w-64'}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Compass className="h-[18px] w-[18px]" />
            </div>
            <div className={`min-w-0 leading-tight ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-sm font-semibold">AI Career Coach</p>
              <p className="text-[11px] text-muted">{variant === 'admin' ? 'Admin console' : 'Candidate'}</p>
            </div>
          </div>
          <button className="rounded-md p-1 text-muted hover:text-ink lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
          {groups.map((g) => (
            <div key={g.label || 'top'}>
              {g.label && <p className={`mb-1.5 px-3 text-[11px] font-medium text-subtle ${collapsed ? 'lg:hidden' : ''}`}>{g.label}</p>}
              <div className="space-y-0.5">
                {g.items.map((it) => {
                  const Icon = it.icon
                  const isActive = it.key === active || (active === 'job-detail' && it.key === 'jobs')
                  return (
                    <button
                      key={it.key}
                      onClick={() => go(it.key)}
                      title={collapsed ? it.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                        isActive ? 'bg-primary-soft font-semibold text-primary' : 'text-muted hover:bg-canvas hover:text-ink'
                      } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className={collapsed ? 'lg:hidden' : ''}>{it.label}</span>
                      {it.badge && !collapsed && (
                        <span className="ml-auto rounded-md bg-line-soft px-1.5 text-[11px] font-medium text-muted">{it.badge}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden border-t border-line p-3 lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink ${collapsed ? 'justify-center px-0' : ''}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-navy/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-20 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-surface px-3 sm:gap-3 sm:px-6">
          <button className="rounded-md p-1.5 text-muted hover:bg-canvas lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-muted sm:flex">
              {trail.slice(0, -1).map((c) => (
                <React.Fragment key={c}>
                  <span>{c}</span>
                  <ChevronRight className="h-3 w-3" />
                </React.Fragment>
              ))}
            </nav>
            <h1 className="truncate text-base font-semibold leading-tight">{title}</h1>
          </div>

          {variant === 'candidate' && (
            <GlobalSearch open={menu === 'search'} setOpen={(v) => setMenu(v ? 'search' : 'none')} onGo={go} />
          )}
          <div className="hidden items-center gap-2 xl:flex">{actions}</div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setMenu(menu === 'notifications' ? 'none' : 'notifications')}
              className="relative rounded-full p-2 text-muted hover:bg-canvas hover:text-ink"
              aria-label="Notifications"
              aria-expanded={menu === 'notifications'}
            >
              <Bell className="h-5 w-5" />
              <NotificationDot />
            </button>
            <Popover show={menu === 'notifications'} className="right-0 w-[min(360px,calc(100vw-24px))]">
              <Notifications onGo={go} />
            </Popover>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setMenu(menu === 'profile' ? 'none' : 'profile')}
              className="flex items-center gap-2 rounded-full p-0.5 hover:bg-canvas sm:pr-2"
              aria-label="Account menu"
              aria-expanded={menu === 'profile'}
            >
              <img src={candidate.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              <span className="hidden text-sm font-medium md:block">{variant === 'admin' ? 'Ops Admin' : candidate.firstName}</span>
            </button>
            <Popover show={menu === 'profile'} className="right-0 w-64">
              <div className="border-b border-line px-4 py-3">
                <p className="text-sm font-medium">{variant === 'admin' ? 'Ops Admin' : candidate.name}</p>
                <p className="truncate text-xs text-muted">{candidate.email}</p>
              </div>
              <div className="p-1.5">
                <MenuItem icon={dark ? Sun : Moon} onClick={toggleDark}>
                  {dark ? 'Light theme' : 'Dark theme'}
                </MenuItem>
                {variant === 'candidate' && (
                  <MenuItem icon={ShieldCheck} onClick={() => go('trust')}>
                    Trust Center
                  </MenuItem>
                )}
                <MenuItem icon={Settings2} onClick={() => go(variant === 'admin' ? 'dashboard' : 'admin-ai')}>
                  {variant === 'admin' ? 'Candidate view' : 'Admin console'}
                </MenuItem>
                <MenuItem icon={LogOut} onClick={() => go('signout')}>
                  Sign out
                </MenuItem>
              </div>
            </Popover>
          </div>
        </header>

        {menu !== 'none' && menu !== 'search' && <div className="fixed inset-0 z-10" onClick={() => setMenu('none')} />}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* NOVA */}
      {variant === 'candidate' && !hideNova && (
        <>
          <button
            onClick={() => setNova(true)}
            className={`fixed bottom-5 right-5 z-30 flex h-12 items-center gap-2 rounded-full bg-primary pl-4 pr-5 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-[transform,opacity] duration-200 ease-out-strong hover:bg-primary-600 active:scale-[0.97] ${
              nova ? 'pointer-events-none scale-95 opacity-0' : ''
            }`}
            aria-label="Ask NOVA, your AI career agent"
          >
            <Sparkles className="h-4 w-4" /> Ask NOVA
          </button>
          <NovaPanel open={nova} onClose={() => setNova(false)} onNavigate={go} onExpand={() => go('nova')} />
        </>
      )}
    </div>
  )
}

function GlobalSearch({ open, setOpen, onGo }: { open: boolean; setOpen: (v: boolean) => void; onGo: (k: NavKey) => void }) {
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const results = useMemo(() => SEARCH.filter((s) => !q || `${s.label} ${s.kind}`.toLowerCase().includes(q.toLowerCase())).slice(0, 7), [q])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => ref.current?.focus(), 0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} className="rounded-full p-2 text-muted hover:bg-canvas md:hidden" aria-label="Search">
        <Search className="h-5 w-5" />
      </button>
      <div
        className={`${open ? 'fixed inset-x-3 top-3 md:static' : 'hidden md:block'} z-30 md:w-64 lg:w-72`}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
        }}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Search jobs, pages, questions"
            className="h-9 w-full rounded-lg border border-line bg-canvas pl-9 pr-12 text-sm placeholder:text-subtle focus:border-secondary focus:bg-surface focus:outline-none"
            aria-label="Global search"
          />
          <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 text-[10px] text-subtle md:block">⌘K</kbd>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-x-0 top-11 overflow-hidden rounded-xl border border-line bg-surface shadow-xl"
            >
              {results.length ? (
                <ul className="p-1.5">
                  {results.map((r) => (
                    <li key={r.label}>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setQ('')
                          onGo(r.key)
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-canvas focus:bg-canvas focus:outline-none"
                      >
                        <span className="truncate">{r.label}</span>
                        <span className="shrink-0 text-xs text-subtle">{r.kind}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-5 text-center text-sm text-muted">No results for “{q}”. Try asking NOVA.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const noteStore = { read: new Set<string>(), removed: new Set<string>() }

function NotificationDot() {
  const unread = NOTES.filter((n) => !noteStore.read.has(n.id) && !noteStore.removed.has(n.id)).length
  return unread ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" /> : null
}

function Notifications({ onGo }: { onGo: (k: NavKey) => void }) {
  const [, force] = useState(0)
  const list = NOTES.filter((n) => !noteStore.removed.has(n.id))
  const refresh = () => force((x) => x + 1)
  return (
    <div>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-sm font-semibold">Notifications</p>
        <button
          onClick={() => {
            NOTES.forEach((n) => noteStore.read.add(n.id))
            refresh()
          }}
          className="text-xs font-medium text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>
      {list.length ? (
        <ul className="max-h-80 divide-y divide-line overflow-y-auto">
          {list.map((n) => {
            const unread = !noteStore.read.has(n.id)
            return (
              <li key={n.id} className="group flex gap-3 px-4 py-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${unread ? 'bg-secondary' : 'bg-transparent'}`} />
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    noteStore.read.add(n.id)
                    onGo(n.key)
                  }}
                >
                  <p className={`text-sm ${unread ? 'font-medium' : 'text-muted'}`}>{n.title}</p>
                  <p className="text-xs text-subtle">{n.time}</p>
                </button>
                <button
                  onClick={() => {
                    noteStore.removed.add(n.id)
                    refresh()
                  }}
                  className="self-start rounded p-1 text-subtle opacity-0 hover:text-ink focus:opacity-100 group-hover:opacity-100"
                  aria-label="Delete notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="px-4 py-8 text-center text-sm text-muted">You’re all caught up.</p>
      )}
    </div>
  )
}

function Popover({ show, className, children }: { show: boolean; className?: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: 'top right' }}
          className={`absolute top-12 z-20 overflow-hidden rounded-xl border border-line bg-surface shadow-xl ${className ?? ''}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MenuItem({ icon: Icon, onClick, children }: { icon: typeof Bell; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-canvas">
      <Icon className="h-4 w-4 text-muted" />
      {children}
    </button>
  )
}

function readTheme() {
  try {
    return localStorage.getItem('acc-theme') === 'dark'
  } catch {
    return false
  }
}

function groupOf(k: NavKey) {
  for (const g of [...CANDIDATE_NAV, ...ADMIN_NAV]) if (g.items.some((i) => i.key === k)) return g.label || 'Home'
  if (k === 'job-detail') return 'Jobs'
  return ''
}

type Item = { key: NavKey; label: string; icon: typeof Bell; badge?: string }

const CANDIDATE_NAV: { label: string; items: Item[] }[] = [
  {
    label: '',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { key: 'nova', label: 'AI Career Agent', icon: Sparkles },
    ],
  },
  {
    label: 'Jobs',
    items: [
      { key: 'jobs', label: 'Discover Jobs', icon: Briefcase },
      { key: 'jobs-recommended', label: 'Recommended', icon: Star },
      { key: 'jobs-saved', label: 'Saved Jobs', icon: Bookmark, badge: '2' },
      { key: 'applications', label: 'My Applications', icon: KanbanSquare },
    ],
  },
  {
    label: 'Prepare',
    items: [
      { key: 'resume', label: 'Resume Studio', icon: FileText },
      { key: 'studio', label: 'Interview Studio', icon: Mic },
      { key: 'questions', label: 'Question Bank', icon: Library },
      { key: 'feedback', label: 'AI Feedback', icon: MessageSquareText },
      { key: 'progress', label: 'My Progress', icon: TrendingUp },
    ],
  },
  {
    label: 'Account',
    items: [{ key: 'trust', label: 'Trust Center', icon: ShieldCheck }],
  },
]

const ADMIN_NAV: { label: string; items: Item[] }[] = [
  { label: 'AI', items: [{ key: 'admin-ai', label: 'AI Evaluation Settings', icon: Settings2 }] },
]

const SEARCH: { label: string; kind: string; key: NavKey }[] = [
  { label: 'Frontend Developer (Fresher) · Lumen Labs', kind: 'Job', key: 'job-detail' },
  { label: 'Discover jobs', kind: 'Page', key: 'jobs' },
  { label: 'My applications', kind: 'Page', key: 'applications' },
  { label: 'Resume Studio', kind: 'Page', key: 'resume' },
  { label: 'Start a mock interview', kind: 'Action', key: 'studio' },
  { label: 'Question bank', kind: 'Page', key: 'questions' },
  { label: 'Latest feedback report', kind: 'Report', key: 'feedback' },
  { label: 'Weaknesses and progress', kind: 'Page', key: 'progress' },
  { label: 'Ask NOVA', kind: 'Agent', key: 'nova' },
  { label: 'Privacy and data', kind: 'Trust Center', key: 'trust' },
]

const NOTES: { id: string; title: string; time: string; key: NavKey }[] = [
  { id: 'n1', title: 'Lumen Labs technical round is in 2 days — your prep plan is ready', time: '1 h ago', key: 'job-detail' },
  { id: 'n2', title: 'Feedback ready: Frontend mixed round (71)', time: 'Yesterday', key: 'feedback' },
  { id: 'n3', title: '3 new fresher frontend jobs match your preferences', time: 'Yesterday', key: 'jobs-recommended' },
  { id: 'n4', title: 'Follow up with Northwind Fintech on May 16?', time: '2 days ago', key: 'applications' },
]
