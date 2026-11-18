import React, { useState } from 'react'
import { SquarePen, MessageSquare, Briefcase, FileText, Mic, Target, KanbanSquare, GraduationCap, Compass } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { NovaChat } from '../shared/components/nova/NovaChat'

export const args = {
  seedPrompt: '',
}

export const argTypes = {
  seedPrompt: {
    control: 'select',
    options: [
      '',
      'Find fresher frontend developer jobs in Chennai with React',
      'Improve my resume for the Lumen Labs job',
      'Prepare me for my interview on Friday',
      'What skills am I missing for frontend roles?',
      'Draft a follow-up to Northwind Fintech',
    ],
  },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void }

export default function NovaCareerAgent(props: Props) {
  const p = { ...args, ...props }
  const [session, setSession] = useState(0)
  const [seed, setSeed] = useState(p.seedPrompt)
  const [active, setActive] = useState<string | null>(null)

  const open = (h: (typeof HISTORY)[number]) => {
    setActive(h.id)
    setSeed(h.prompt)
    setSession((s) => s + 1)
  }

  return (
    <AppShell active="nova" title="AI Career Agent" onNavigate={p.onNavigate} hideNova>
      <div className="flex h-full min-h-0">
        {/* History + capabilities */}
        <aside className="hidden w-72 shrink-0 flex-col border-r border-line bg-surface lg:flex">
          <div className="p-4">
            <button
              onClick={() => {
                setActive(null)
                setSeed('')
                setSession((s) => s + 1)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2 text-sm font-medium hover:bg-canvas"
            >
              <SquarePen className="h-4 w-4" /> New conversation
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3">
            <p className="px-2 text-[11px] font-medium text-subtle">Recent</p>
            <ul className="mt-1.5 space-y-0.5">
              {HISTORY.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => open(h)}
                    className={`flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-150 ${
                      active === h.id ? 'bg-primary-soft text-primary' : 'text-ink hover:bg-canvas'
                    }`}
                  >
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                    <span className="min-w-0">
                      <span className="block truncate">{h.title}</span>
                      <span className="text-xs text-subtle">{h.when}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-6 px-2 text-[11px] font-medium text-subtle">What NOVA can do</p>
            <ul className="mt-1.5 space-y-2 px-2 pb-4 text-xs text-muted">
              {CAPABILITIES.map((c) => {
                const Icon = c.icon
                return (
                  <li key={c.name} className="flex gap-2.5">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      <span className="font-medium text-ink">{c.name}</span> — {c.d}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
          <p className="border-t border-line p-4 text-[11px] text-subtle">
            Conversations are kept for 90 days. Change this in the Trust Center.
          </p>
        </aside>

        <section className="min-w-0 flex-1 bg-canvas">
          <NovaChat key={session} seed={seed || undefined} onNavigate={p.onNavigate} />
        </section>
      </div>
    </AppShell>
  )
}

const HISTORY = [
  { id: 'h1', title: 'Fresher React jobs in Chennai', when: 'Today', prompt: 'Find fresher frontend developer jobs in Chennai with React' },
  { id: 'h2', title: 'Tailor resume for Lumen Labs', when: 'Yesterday', prompt: 'Improve my resume for the Lumen Labs job' },
  { id: 'h3', title: 'Lumen Labs interview prep', when: 'Yesterday', prompt: 'Prepare me for my interview on Friday' },
  { id: 'h4', title: 'Skill gaps for frontend roles', when: 'May 10', prompt: 'What skills am I missing for frontend roles?' },
  { id: 'h5', title: 'Follow-up to Northwind', when: 'May 09', prompt: 'Draft a follow-up to Northwind Fintech' },
]

const CAPABILITIES = [
  { name: 'Career advice', d: 'roles, transitions, plans', icon: Compass },
  { name: 'Job search', d: 'plain-language search with fit reasons', icon: Briefcase },
  { name: 'Resume', d: 'tailored versions, never invented claims', icon: FileText },
  { name: 'Interviews', d: 'mock rounds and readiness', icon: Mic },
  { name: 'Skill gaps', d: 'what’s missing and why it matters', icon: Target },
  { name: 'Applications', d: 'tracking and drafts, with your approval', icon: KanbanSquare },
  { name: 'Learning', d: 'verified, clearly-linked resources', icon: GraduationCap },
]
