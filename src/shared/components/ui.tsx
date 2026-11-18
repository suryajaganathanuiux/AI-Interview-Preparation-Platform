import React from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  const v = {
    primary: 'bg-primary text-white shadow-[0_1px_2px_rgb(15_23_42/0.12),inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-primary-600 hover:shadow-[0_6px_16px_-4px_color-mix(in_srgb,var(--color-primary)_45%,transparent)] disabled:bg-primary/50 disabled:shadow-none',
    secondary: 'border border-line bg-surface text-ink shadow-[0_1px_2px_rgb(15_23_42/0.04)] hover:border-subtle/60 hover:bg-canvas disabled:text-subtle',
    ghost: 'text-muted hover:bg-canvas hover:text-ink',
    danger: 'bg-danger text-white hover:bg-danger/90',
  }[variant]
  const s = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-5 text-sm' }[size]
  return (
    <button
      className={twMerge(
        'group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,color,transform,box-shadow,border-color] duration-150 ease-out-strong active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100',
        v,
        s,
        className
      )}
      {...rest}
    />
  )
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  const t = {
    neutral: 'bg-line-soft text-muted',
    blue: 'bg-primary-soft text-primary-600',
    success: 'bg-success-soft text-success-ink',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    navy: 'bg-navy text-white',
  }[tone]
  return (
    <span className={twMerge('inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium', t, className)}>
      {children}
    </span>
  )
}

export type Tone = 'neutral' | 'blue' | 'success' | 'warning' | 'danger' | 'navy'

export function scoreTone(score: number): Tone {
  if (score >= 75) return 'success'
  if (score >= 60) return 'blue'
  return 'warning'
}

export function scoreText(score: number) {
  if (score >= 75) return 'text-success-ink'
  if (score >= 60) return 'text-primary-600'
  return 'text-warning'
}

export function scoreBar(score: number) {
  if (score >= 75) return 'bg-success'
  if (score >= 60) return 'bg-primary'
  return 'bg-warning-base'
}

export function Delta({ value, suffix = '' }: { value: number; suffix?: string }) {
  const up = value > 0
  const flat = value === 0
  return (
    <span className={`text-xs font-semibold ${flat ? 'text-muted' : up ? 'text-success-ink' : 'text-danger'}`}>
      {flat ? '±0' : up ? `+${value}` : value}
      {suffix}
    </span>
  )
}

export function Panel({ className, children, interactive }: { className?: string; children: React.ReactNode; interactive?: boolean }) {
  return (
    <section className={twMerge('rounded-2xl border border-line bg-surface shadow-[var(--shadow-soft)]', interactive && 'lift', className)}>
      {children}
    </section>
  )
}

export function DevModeNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-xs text-muted">
      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning-base" />
      <span>{children}</span>
    </p>
  )
}
