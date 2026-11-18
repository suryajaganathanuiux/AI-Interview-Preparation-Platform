import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, MailCheck, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '../shared/components/ui'

export const args = {
  state: 'pending',
  email: 'priya.raman@outlook.com',
}

export const argTypes = {
  state: { control: 'select', options: ['pending', 'success', 'failure'] },
  email: { control: 'text' },
}

type Props = Partial<typeof args> & { onVerified?: () => void; onBack?: () => void }

export default function VerifyEmail(props: Props) {
  const p = { ...args, ...props }
  const [state, setState] = useState(p.state)
  const [email, setEmail] = useState(p.email)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(p.email)
  const [cooldown, setCooldown] = useState(0)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!cooldown) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft)

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <header className="flex h-16 items-center px-6">
        <button onClick={p.onBack} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Compass className="h-4 w-4" />
          </span>
          <span className="font-semibold">AI Career Coach</span>
        </button>
      </header>
      <main className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-sm"
        >
          {state === 'pending' && (
            <>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <MailCheck className="h-6 w-6" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted">
                We sent a verification link to <span className="font-medium text-ink">{email}</span>. It expires in 24 hours. Check spam if you don’t see it in a minute.
              </p>

              {editing ? (
                <form
                  className="mt-6 text-left"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!valid) return
                    setEmail(draft)
                    setEditing(false)
                    setCooldown(30)
                  }}
                >
                  <label className="text-sm font-medium" htmlFor="new-email">
                    New email address
                  </label>
                  <input
                    id="new-email"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${valid ? 'border-line focus:border-primary' : 'border-danger'}`}
                    aria-invalid={!valid}
                  />
                  {!valid && <p className="mt-1 text-xs text-danger">Enter a valid email address.</p>}
                  <div className="mt-4 flex gap-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={!valid}>
                      Update & resend
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="mt-7 w-full"
                    disabled={checking}
                    onClick={() => {
                      setChecking(true)
                      setTimeout(() => {
                        setChecking(false)
                        setState('success')
                      }, 700)
                    }}
                  >
                    {checking && <Loader2 className="h-4 w-4 animate-spin" />}
                    {checking ? 'Checking…' : 'I’ve clicked the link'}
                  </Button>
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                    <button onClick={() => setCooldown(30)} disabled={cooldown > 0} className="font-medium text-primary hover:underline disabled:text-subtle disabled:no-underline">
                      {cooldown ? `Resend in ${cooldown}s` : 'Resend email'}
                    </button>
                    <span className="text-line">|</span>
                    <button onClick={() => setEditing(true)} className="font-medium text-primary hover:underline">
                      Change email
                    </button>
                  </div>
                  {cooldown > 0 && <p className="mt-3 text-xs text-success-ink">A new link is on its way to {email}.</p>}
                </>
              )}
            </>
          )}

          {state === 'success' && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
              <h1 className="mt-5 text-2xl font-semibold tracking-tight">Email verified</h1>
              <p className="mt-2 text-sm text-muted">Your account is active. Next, a few questions so NOVA can personalise your job matches and practice.</p>
              <Button size="lg" className="mt-7 w-full" onClick={p.onVerified}>
                Set up my career profile <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {state === 'failure' && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-danger" />
              <h1 className="mt-5 text-2xl font-semibold tracking-tight">This link has expired</h1>
              <p className="mt-2 text-sm text-muted">Verification links last 24 hours and work once. Request a new one and use the latest email.</p>
              <Button
                size="lg"
                className="mt-7 w-full"
                onClick={() => {
                  setState('pending')
                  setCooldown(30)
                }}
              >
                Send a new link
              </Button>
              <button onClick={p.onBack} className="mt-3 text-sm font-medium text-muted hover:text-ink">
                Back to sign in
              </button>
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}
