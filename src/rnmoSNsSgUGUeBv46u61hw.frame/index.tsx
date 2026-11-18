import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { KanbanSquare, Table2, X, CalendarClock, Sparkles, Trash2, User, Plus, ShieldCheck } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Badge, Panel, Tone } from '../shared/components/ui'
import { applications as seed, Application, AppStage, STAGES } from '../shared/data/career'

export const args = {
  view: 'kanban',
  openId: '',
}

export const argTypes = {
  view: { control: 'radio', options: ['kanban', 'table'] },
  openId: { control: 'select', options: ['', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'] },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void }

export default function ApplicationTracker(props: Props) {
  const p = { ...args, ...props }
  const [apps, setApps] = useState<Application[]>(seed)
  const [view, setView] = useState(p.view)
  const [openId, setOpenId] = useState(p.openId)
  const open = apps.find((a) => a.id === openId)
  const update = (id: string, patch: Partial<Application>) => setApps((xs) => xs.map((a) => (a.id === id ? { ...a, ...patch } : a)))

  return (
    <AppShell active="applications" title="My Applications" onNavigate={p.onNavigate}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-wrap items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
          <div className="mr-auto">
            <h2 className="text-xl font-semibold tracking-tight">Applications</h2>
            <p className="text-sm text-muted">Statuses change only when you update them or we receive verified confirmation.</p>
          </div>
          <div className="flex rounded-lg border border-line bg-surface p-0.5">
            {(['kanban', 'table'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${view === v ? 'bg-canvas font-medium text-ink' : 'text-muted hover:text-ink'}`}
              >
                {v === 'kanban' ? <KanbanSquare className="h-4 w-4" /> : <Table2 className="h-4 w-4" />}
                {v === 'kanban' ? 'Board' : 'Table'}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => p.onNavigate?.('jobs')}>
            <Plus className="h-3.5 w-3.5" /> Add from jobs
          </Button>
        </div>

        {view === 'kanban' ? (
          <div className="min-h-0 flex-1 overflow-x-auto px-4 pb-6 pt-5 sm:px-6 lg:px-8">
            <div className="flex h-full min-w-max gap-4">
              {COLUMNS.map((col) => {
                const items = apps.filter((a) => col.stages.includes(a.stage))
                return (
                  <section key={col.name} className="flex w-64 shrink-0 flex-col rounded-xl bg-line-soft/70 p-2">
                    <header className="flex items-center justify-between px-2 py-1.5">
                      <h3 className="text-sm font-semibold">{col.name}</h3>
                      <span className="text-xs text-muted">{items.length}</span>
                    </header>
                    <ul className="mt-1 min-h-0 flex-1 space-y-2 overflow-y-auto">
                      {items.map((a) => (
                        <li key={a.id}>
                          <button
                            onClick={() => setOpenId(a.id)}
                            className={`lift w-full rounded-xl border bg-surface p-3 text-left hover:border-subtle ${openId === a.id ? 'border-primary' : 'border-line'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-line-soft text-[10px] font-semibold text-muted">{a.initials}</span>
                              <span className="truncate text-sm font-semibold">{a.company}</span>
                            </div>
                            <p className="mt-1.5 line-clamp-2 text-sm">{a.role}</p>
                            {col.stages.length > 1 && (
                              <Badge tone={STAGE_TONE[a.stage]} className="mt-2">
                                {a.stage}
                              </Badge>
                            )}
                            {(a.next || a.followUp) && (
                              <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                                <CalendarClock className="h-3 w-3" /> {a.next ?? `Follow up ${a.followUp}`}
                              </p>
                            )}
                          </button>
                        </li>
                      ))}
                      {!items.length && <li className="px-2 py-6 text-center text-xs text-subtle">Nothing here</li>}
                    </ul>
                  </section>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto px-4 pb-6 pt-5 sm:px-6 lg:px-8">
            <Panel className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs text-muted">
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium">Applied / added</th>
                    <th className="px-4 py-3 font-medium">Next</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {apps.map((a) => (
                    <tr key={a.id} onClick={() => setOpenId(a.id)} className="cursor-pointer transition-colors duration-150 hover:bg-canvas">
                      <td className="px-4 py-3 font-medium">{a.company}</td>
                      <td className="px-4 py-3">{a.role}</td>
                      <td className="px-4 py-3">
                        <Badge tone={STAGE_TONE[a.stage]}>{a.stage}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted">{a.date}</td>
                      <td className="px-4 py-3 text-muted">{a.next ?? (a.followUp ? `Follow up ${a.followUp}` : '—')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <Drawer
            key={open.id}
            app={open}
            onClose={() => setOpenId('')}
            onUpdate={(patch) => update(open.id, patch)}
            onRemove={() => {
              setApps((xs) => xs.filter((a) => a.id !== open.id))
              setOpenId('')
            }}
            onNova={() => p.onNavigate?.('nova')}
          />
        )}
      </AnimatePresence>
    </AppShell>
  )
}

function Drawer({ app, onClose, onUpdate, onRemove, onNova }: { app: Application; onClose: () => void; onUpdate: (p: Partial<Application>) => void; onRemove: () => void; onNova: () => void }) {
  const [confirm, setConfirm] = useState(false)
  const [stage, setStage] = useState<AppStage>(app.stage)
  const changed = stage !== app.stage

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-navy/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-label={`${app.company} application`}
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 24, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-surface shadow-2xl sm:w-[440px]"
      >
        <header className="flex items-start gap-3 border-b border-line p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-line-soft text-xs font-semibold text-muted">{app.initials}</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{app.role}</p>
            <p className="text-sm text-muted">
              {app.company} · {app.location}
            </p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
          <div>
            <label className="text-xs font-medium text-muted" htmlFor="stage">
              Stage
            </label>
            <div className="mt-1.5 flex gap-2">
              <select id="stage" value={stage} onChange={(e) => setStage(e.target.value as AppStage)} className="h-10 flex-1 rounded-lg border border-line bg-surface px-3 text-sm">
                {STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <Button
                disabled={!changed}
                onClick={() => onUpdate({ stage, history: [...app.history, { stage, date: 'May 14', by: 'You' }] })}
              >
                Update
              </Button>
            </div>
            {['Application Viewed', 'Shortlisted', 'Rejected'].includes(stage) && changed && (
              <p className="mt-2 flex gap-1.5 text-xs text-muted">
                <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0" /> Only set this if the employer told you. We never infer it.
              </p>
            )}
          </div>

          {app.next && (
            <div className="rounded-lg bg-primary-soft p-3 text-sm">
              <p className="font-medium text-primary">{app.next}</p>
              <button onClick={onNova} className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                <Sparkles className="h-3 w-3" /> Build a prep plan with NOVA
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="block">
              <span className="text-xs font-medium text-muted">Follow-up date</span>
              <input type="date" defaultValue={app.followUp ? '2025-05-16' : ''} className="mt-1.5 h-10 w-full rounded-lg border border-line bg-surface px-2" />
            </label>
            <div>
              <span className="text-xs font-medium text-muted">Contact</span>
              <p className="mt-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted" /> {app.contact ?? '—'}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-muted">Notes</span>
            <textarea
              rows={3}
              defaultValue={app.notes}
              onBlur={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Who you spoke to, what they asked, next steps…"
              className="mt-1.5 w-full resize-none rounded-lg border border-line bg-surface p-3 text-sm focus:border-primary focus:outline-none"
            />
          </label>

          {app.stage === 'Applied' && (
            <button onClick={onNova} className="flex w-full items-center gap-2.5 rounded-lg border border-line p-3 text-left text-sm hover:border-secondary">
              <Sparkles className="h-4 w-4 text-primary" /> Draft a follow-up message (you send it)
            </button>
          )}

          <div>
            <p className="text-xs font-medium text-muted">Status history</p>
            <ol className="mt-3 space-y-3">
              {[...app.history].reverse().map((h, i) => (
                <li key={`${h.stage}-${i}`} className="flex gap-3 text-sm">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === 0 ? 'bg-primary' : 'bg-line'}`} />
                  <div className="flex-1">
                    <p className={i === 0 ? 'font-medium' : ''}>{h.stage}</p>
                    <p className="text-xs text-muted">
                      {h.date} · {h.by === 'You' ? 'updated by you' : h.by === 'Verified email' ? 'from a verified employer email' : 'from partner API'}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <footer className="border-t border-line p-4">
          {confirm ? (
            <div className="flex flex-wrap items-center gap-2">
              <p className="mr-auto text-sm">Remove this application and its notes?</p>
              <Button size="sm" variant="secondary" onClick={() => setConfirm(false)}>
                Keep
              </Button>
              <Button size="sm" variant="danger" onClick={onRemove}>
                Remove
              </Button>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)} className="flex items-center gap-1.5 text-sm text-muted hover:text-danger">
              <Trash2 className="h-4 w-4" /> Remove from tracker
            </button>
          )}
        </footer>
      </motion.aside>
    </>
  )
}

const COLUMNS: { name: string; stages: AppStage[] }[] = [
  { name: 'Saved', stages: ['Interested', 'Saved'] },
  { name: 'Ready to apply', stages: ['Ready to Apply'] },
  { name: 'Applied', stages: ['Applied', 'Application Viewed'] },
  { name: 'Shortlisted', stages: ['Shortlisted'] },
  { name: 'Interviewing', stages: ['Interview Scheduled', 'Interview Completed'] },
  { name: 'Offer', stages: ['Offer Received'] },
  { name: 'Closed', stages: ['Rejected', 'Withdrawn'] },
]

const STAGE_TONE: Record<AppStage, Tone> = {
  Interested: 'neutral',
  Saved: 'neutral',
  'Ready to Apply': 'blue',
  Applied: 'blue',
  'Application Viewed': 'blue',
  Shortlisted: 'success',
  'Interview Scheduled': 'warning',
  'Interview Completed': 'warning',
  'Offer Received': 'success',
  Rejected: 'danger',
  Withdrawn: 'neutral',
}
