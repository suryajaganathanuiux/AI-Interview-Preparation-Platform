import React, { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'

export function Field({ label, hint, optional, children, className }: { label: string; hint?: string; optional?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1.5 flex items-baseline gap-2 text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-subtle">optional</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export const inputCls =
  'h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export const textareaCls =
  'w-full resize-none rounded-lg border border-line bg-surface p-3 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function Chips({ options, value, onChange, multi = true }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : [o])}
            className={`flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm transition-colors duration-150 ${
              on ? 'border-primary bg-primary-soft font-medium text-primary' : 'border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            {on && <Check className="h-3.5 w-3.5" />}
            {o}
          </button>
        )
      })}
    </div>
  )
}

export function TagInput({ value, onChange, placeholder, suggestions = [] }: { value: string[]; onChange: (v: string[]) => void; placeholder: string; suggestions?: string[] }) {
  const [draft, setDraft] = useState('')
  const add = (t: string) => {
    const v = t.trim()
    if (v && !value.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...value, v])
    setDraft('')
  }
  const remaining = suggestions.filter((s) => !value.includes(s))
  return (
    <div>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-line bg-surface p-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {value.map((t) => (
          <span key={t} className="flex items-center gap-1 rounded-md bg-primary-soft py-1 pl-2.5 pr-1 text-sm font-medium text-primary">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="rounded p-0.5 hover:bg-primary/10" aria-label={`Remove ${t}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add(draft)
            }
            if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
          }}
          placeholder={value.length ? '' : placeholder}
          className="h-8 min-w-32 flex-1 bg-transparent px-1.5 text-sm placeholder:text-subtle focus:outline-none"
        />
      </div>
      {remaining.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted">Suggested:</span>
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="flex items-center gap-1 rounded-md border border-dashed border-line px-2 py-1 text-xs text-muted transition-colors duration-150 hover:border-primary hover:text-primary"
            >
              <Plus className="h-3 w-3" /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
