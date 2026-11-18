import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Database, FileLock2, Video, ShieldCheck, Download, Trash2, LifeBuoy, Check, Loader2, Smartphone, Laptop } from 'lucide-react'
import { AppShell, NavKey } from '../shared/components/AppShell'
import { Button, Panel } from '../shared/components/ui'

export const args = {
  deleteDialog: false,
}

export const argTypes = {
  deleteDialog: { control: 'boolean' },
}

type Props = Partial<typeof args> & { onNavigate?: (k: NavKey) => void }

export default function TrustCenter(props: Props) {
  const p = { ...args, ...props }
  const [consent, setConsent] = useState({ voice: false, video: false, training: false, nova: true, emails: true })
  const [retention, setRetention] = useState('90 days')
  const [twoFactor, setTwoFactor] = useState(false)
  const [exportState, setExportState] = useState<'idle' | 'preparing' | 'ready'>('idle')
  const [del, setDel] = useState(p.deleteDialog)
  const [typed, setTyped] = useState('')
  const [deletedResume, setDeletedResume] = useState(false)

  return (
    <AppShell active="trust" title="Trust Center" onNavigate={p.onNavigate}>
      <div className="mx-auto grid max-w-6xl gap-10 p-4 sm:p-6 lg:grid-cols-[200px_1fr] lg:p-8">
        <nav className="hidden lg:block" aria-label="Trust Center sections">
          <ul className="sticky top-6 space-y-1 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2 py-1.5 text-muted hover:bg-surface hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-12">
          <header>
            <h2 className="text-2xl font-semibold tracking-tight">Your data and how our AI works</h2>
            <p className="mt-2 max-w-2xl text-muted">
              Plain answers to what we collect, what the AI does with it, and what it can’t do. Every setting here takes effect immediately.
            </p>
          </header>

          <Section id="ai" icon={Sparkles} title="How the AI works">
            <div className="grid gap-6 md:grid-cols-2">
              <Fact title="What gets evaluated" body="Only the text of your answer (or its transcript), the question, and the published criteria for that question’s category." />
              <Fact title="The criteria" body="Relevance, accuracy, structure, completeness and communication — weighted per interview type. Weights are visible on every report." />
              <Fact title="Evidence, always" body="Every weakness quotes the part of your answer it’s based on. If the AI can’t point to evidence, it marks the result as low confidence." />
              <Fact title="What it never judges" body="Personality, intelligence, accent, appearance, disability or demographic attributes. Video is never used to score you." />
            </div>
            <div className="mt-6 rounded-lg border border-line bg-surface p-4 text-sm">
              <p className="font-medium">Limitations</p>
              <p className="mt-1 text-muted">
                Scores are AI estimates to guide practice. They can be wrong, and they don’t predict hiring decisions. Job fit scores compare your profile with a listing; they aren’t a hiring probability. Use the Report button on any feedback you disagree with — a person reviews every report.
              </p>
            </div>
          </Section>

          <Section id="data" icon={Database} title="How your data is used">
            <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
              {[
                ['Profile, skills, resume', 'Job matching, resume suggestions and interview questions — only after you confirm them.'],
                ['Interview answers', 'Scoring, feedback and your weakness history. Visible only to you.'],
                ['NOVA conversations', `Context for future answers. Kept for ${retention.toLowerCase()}.`],
                ['Job activity', 'Saved jobs and applications power your tracker and recommendations.'],
              ].map(([k, v]) => (
                <li key={k} className="grid gap-1 px-4 py-3.5 text-sm sm:grid-cols-[200px_1fr] sm:gap-4">
                  <span className="font-medium">{k}</span>
                  <span className="text-muted">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">We never sell your data or share it with employers unless you apply and choose to attach it.</p>
          </Section>

          <Section id="consent" icon={Video} title="Recording and consent">
            <Panel className="divide-y divide-line">
              <Toggle label="Voice recordings" hint="Needed for voice practice. Audio is transcribed, then deleted after 30 days." on={consent.voice} set={(v) => setConsent({ ...consent, voice: v })} />
              <Toggle label="Video recordings" hint="Only for your own playback. Never analysed for appearance or used in scoring." on={consent.video} set={(v) => setConsent({ ...consent, video: v })} />
              <Toggle label="Use my anonymised answers to improve the AI" hint="Off by default. Separate from everything else. Withdraw any time." on={consent.training} set={(v) => setConsent({ ...consent, training: v })} />
              <Toggle label="Let NOVA use my application history" hint="Lets NOVA reference your tracker when you ask for help." on={consent.nova} set={(v) => setConsent({ ...consent, nova: v })} />
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium">Keep NOVA conversations for</p>
                  <p className="text-xs text-muted">Older conversations are deleted automatically.</p>
                </div>
                <select value={retention} onChange={(e) => setRetention(e.target.value)} className="h-9 rounded-lg border border-line bg-surface px-2 text-sm">
                  {['30 days', '90 days', '1 year', 'Until I delete them'].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </Panel>
            <p className="mt-3 text-sm text-muted">Text-only practice is always available — recording is never required.</p>
          </Section>

          <Section id="storage" icon={FileLock2} title="Resume and file storage">
            <Panel className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{deletedResume ? 'No resume stored' : 'Riya_Raman_Resume_v3.pdf + 1 tailored version'}</p>
                <p className="text-xs text-muted">Encrypted at rest. Opened only through short-lived signed links. Never visible to other users.</p>
              </div>
              {!deletedResume && (
                <Button variant="secondary" size="sm" onClick={() => setDeletedResume(true)}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete resumes
                </Button>
              )}
            </Panel>
          </Section>

          <Section id="security" icon={ShieldCheck} title="Account security">
            <Panel className="divide-y divide-line">
              <Toggle label="Two-step verification" hint="Ask for a code from your phone when signing in on a new device." on={twoFactor} set={setTwoFactor} />
              <div className="px-4 py-3.5">
                <p className="text-sm font-medium">Active sessions</p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center gap-2.5">
                    <Laptop className="h-4 w-4 text-muted" /> Chrome on Windows · Chennai <span className="text-xs text-success-ink">This device</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Smartphone className="h-4 w-4 text-muted" /> Safari on iPhone · Chennai · 2 days ago
                  </li>
                </ul>
              </div>
            </Panel>
          </Section>

          <Section id="your-data" icon={Download} title="Export or delete your data">
            <div className="grid gap-4 md:grid-cols-2">
              <Panel className="flex flex-col p-5">
                <p className="font-medium">Export everything</p>
                <p className="mt-1 text-sm text-muted">Profile, resumes, answers, reports, conversations and applications as a ZIP of JSON and PDF files.</p>
                <div className="mt-auto pt-4">
                  <Button
                    variant="secondary"
                    disabled={exportState === 'preparing'}
                    onClick={() => {
                      if (exportState === 'ready') return
                      setExportState('preparing')
                      setTimeout(() => setExportState('ready'), 1200)
                    }}
                  >
                    {exportState === 'preparing' ? <Loader2 className="h-4 w-4 animate-spin" /> : exportState === 'ready' ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    {exportState === 'idle' ? 'Request export' : exportState === 'preparing' ? 'Preparing…' : 'Download ready (link expires in 24 h)'}
                  </Button>
                </div>
              </Panel>
              <Panel className="flex flex-col border-danger/30 p-5">
                <p className="font-medium text-danger">Delete account</p>
                <p className="mt-1 text-sm text-muted">Permanently removes your account and all data within 30 days. This can’t be undone.</p>
                <div className="mt-auto pt-4">
                  <Button variant="danger" onClick={() => setDel(true)}>
                    <Trash2 className="h-4 w-4" /> Delete my account
                  </Button>
                </div>
              </Panel>
            </div>
          </Section>

          <Section id="support" icon={LifeBuoy} title="Contact and support">
            <p className="text-sm text-muted">
              Questions about privacy or an AI decision? Write to <span className="font-medium text-ink">privacy@careercoach.example</span>. We reply within 2 working days. Our Data Protection Officer can be reached at the same address.
            </p>
          </Section>
        </div>
      </div>

      <AnimatePresence>
        {del && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="del-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
            >
              <h2 id="del-title" className="text-lg font-semibold">
                Delete your account?
              </h2>
              <p className="mt-2 text-sm text-muted">
                This deletes your profile, 2 resumes, 36 answers, 7 reports, NOVA conversations and 8 tracked applications. Export first if you want a copy.
              </p>
              <label className="mt-4 block text-sm">
                Type <b>DELETE</b> to confirm
                <input value={typed} onChange={(e) => setTyped(e.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-danger focus:outline-none" />
              </label>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDel(false)
                    setTyped('')
                  }}
                >
                  Cancel
                </Button>
                <Button variant="danger" disabled={typed !== 'DELETE'} onClick={() => p.onNavigate?.('signout')}>
                  Delete permanently
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}

function Section({ id, icon: Icon, title, children }: { id: string; icon: typeof Sparkles; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <h3 className="mb-4 flex items-center gap-2.5 text-lg font-semibold">
        <Icon className="h-5 w-5 text-primary" /> {title}
      </h3>
      {children}
    </section>
  )
}

function Fact({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  )
}

function Toggle({ label, hint, on, set }: { label: string; hint: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => set(!on)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150 ${on ? 'bg-primary' : 'bg-line'}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out-strong ${on ? 'translate-x-4' : ''}`} />
      </button>
    </div>
  )
}

const SECTIONS = [
  { id: 'ai', label: 'How the AI works' },
  { id: 'data', label: 'How data is used' },
  { id: 'consent', label: 'Recording & consent' },
  { id: 'storage', label: 'Resume storage' },
  { id: 'security', label: 'Account security' },
  { id: 'your-data', label: 'Export or delete' },
  { id: 'support', label: 'Contact & support' },
]
