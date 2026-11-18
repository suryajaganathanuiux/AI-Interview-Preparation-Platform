import React, { useState } from 'react'
import { Compass, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '../shared/components/ui'

export const args = {
  mode: 'signin',
  state: 'default',
  email: 'priya.raman@outlook.com',
}

export const argTypes = {
  mode: { control: 'radio', options: ['signin', 'register'] },
  state: { control: 'select', options: ['default', 'error', 'loading'] },
  email: { control: 'text' },
}

type Props = Partial<typeof args> & { onSubmit?: (mode: string) => void; onHome?: () => void }

export default function SignIn(props: Props) {
  const { mode: initialMode, state, email, onSubmit, onHome } = { ...args, ...props }
  const [remember, setRemember] = useState(true)
  const [mode, setMode] = useState(initialMode)
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState(initialMode === 'register' ? 'Interview24' : '')
  const [agreed, setAgreed] = useState(false)
  const register = mode === 'register'
  const strength = passwordStrength(password)
  const loading = state === 'loading'

  return (
    <div className="flex h-screen bg-canvas text-ink">
      {/* Story panel */}
      <aside className="hidden w-[44%] max-w-xl flex-col justify-between bg-primary p-10 text-white lg:flex">
        <button onClick={onHome} className="flex items-center gap-2.5 self-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-semibold">AI Career Coach</span>
        </button>

        <div>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            From first search to first offer, with an AI agent in your corner.
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            Find roles that fit, tailor your resume honestly, practise interviews for the real job, and track every application in one place.
          </p>

          <ol className="mt-10 space-y-4">
            {LOOP.map((step, i) => (
              <li key={step.t} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/35 text-xs font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.t}</p>
                  <p className="text-sm text-white/70">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-xs text-white/65">NOVA never applies or sends messages without your approval.</p>
      </aside>

      {/* Form */}
      <main className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        <div className="w-full max-w-sm">
          <button onClick={onHome} className="mb-8 flex items-center gap-1.5 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>

          <h1 className="text-2xl font-semibold tracking-tight">{register ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-1.5 text-sm text-muted">
            {register ? 'Free. Profile setup takes about 8 minutes, and you can pause any time.' : 'Pick up where you left off.'}
          </p>

          <button
            type="button"
            onClick={() => onSubmit?.(mode === 'register' ? 'google-register' : 'google')}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-surface text-sm font-medium transition-colors duration-150 hover:bg-canvas"
          >
            <GoogleMark /> Continue with Google
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-subtle">
            <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
          </div>

          {state === 'error' && (
            <div role="alert" className="mt-5 flex gap-2.5 rounded-lg bg-danger-soft p-3 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {register ? 'An account with this email already exists. Sign in instead?' : 'That email and password don’t match. Try again or reset your password.'}
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit?.(mode)
            }}
          >
            {register && (
              <Field label="Full name">
                <input defaultValue="Priya Raman" className={INPUT} autoComplete="name" />
              </Field>
            )}
            <Field label="Email address">
              <input type="email" defaultValue={email} className={INPUT} autoComplete="email" />
            </Field>
            <Field
              label="Password"
              aside={!register && <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot password?</button>}
            >
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={register ? 'At least 8 characters' : ''}
                  className={`${INPUT} pr-10`}
                  autoComplete={register ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-subtle hover:text-ink"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {register && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={`h-1 flex-1 rounded-full ${i < strength.level ? strength.bar : 'bg-line'}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted">{strength.label}</p>
                </div>
              )}
            </Field>
            {!register && (
              <label className="flex items-center gap-2.5 text-sm text-muted">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
                Remember me on this device
              </label>
            )}
            {register && (
              <>
                <Field label="Confirm password">
                  <input type="password" defaultValue={password} className={INPUT} autoComplete="new-password" />
                </Field>
                <label className="flex items-start gap-2.5 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-line accent-primary"
                  />
                  <span>
                    I agree to the <a className="font-medium text-primary hover:underline">Terms</a> and{' '}
                    <a className="font-medium text-primary hover:underline">Privacy Policy</a>. My answers are never used to train AI models without separate consent.
                  </span>
                </label>
              </>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading || (register && !agreed)}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? (register ? 'Creating account…' : 'Signing in…') : register ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {register ? 'Already have an account? ' : 'New here? '}
            <button onClick={() => setMode(register ? 'signin' : 'register')} className="font-medium text-primary hover:underline">
              {register ? 'Log in' : 'Create an account'}
            </button>
          </p>
          <p className="mt-2 text-center text-xs text-subtle">
            {register ? 'We’ll send a verification link to your email.' : 'We’ll take you to onboarding if your profile isn’t finished.'}
          </p>
        </div>
      </main>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  )
}

function Field({ label, aside, children }: { label: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {aside}
      </div>
      {children}
    </div>
  )
}

const INPUT =
  'h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const LOOP = [
  { t: 'Discover', d: 'Jobs from authorised sources, with fit explained.' },
  { t: 'Prepare', d: 'Tailored resumes and mock interviews for the real job.' },
  { t: 'Improve', d: 'Feedback that shows your weak spots and how to fix them.' },
  { t: 'Apply and track', d: 'Every application and interview in one place.' },
]

function passwordStrength(p: string) {
  let level = 0
  if (p.length >= 8) level++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) level++
  if (/\d/.test(p)) level++
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) level++
  const map = [
    { label: 'Too short', bar: 'bg-danger' },
    { label: 'Weak — add more characters', bar: 'bg-danger' },
    { label: 'Fair — add a number or symbol', bar: 'bg-warning-base' },
    { label: 'Good', bar: 'bg-primary' },
    { label: 'Strong', bar: 'bg-success' },
  ]
  return { level, ...map[level] }
}
