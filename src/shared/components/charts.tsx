import React from 'react'

/** Score trend line, 0–100 y-axis. Drawn in SVG so it scales with its container. */
export function LineChart({
  points,
  height = 220,
  compare,
}: {
  points: { label: string; value: number }[]
  height?: number
  compare?: number
}) {
  const W = 640
  const H = height
  const pad = { l: 32, r: 12, t: 12, b: 28 }
  const min = 30
  const max = 90
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(points.length - 1, 1)
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b)
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ')
  const grid = [40, 60, 80]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Score trend">
      {grid.map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke="var(--color-line)" strokeDasharray="3 4" />
          <text x={pad.l - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="var(--color-subtle)">
            {g}
          </text>
        </g>
      ))}
      {compare !== undefined && (
        <line x1={pad.l} x2={W - pad.r} y1={y(compare)} y2={y(compare)} stroke="var(--color-warning-base)" strokeWidth="1.5" />
      )}
      <path d={d} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={x(i)} cy={y(p.value)} r={i === points.length - 1 ? 5 : 3.5} fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />
          {i === points.length - 1 && (
            <text x={x(i)} y={y(p.value) - 12} textAnchor="end" fontSize="12" fontWeight="600" fill="var(--color-ink)">
              {p.value}
            </text>
          )}
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--color-subtle)">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function BarChart({ bars, unit = 'min' }: { bars: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(...bars.map((b) => b.value))
  return (
    <div className="flex h-40 items-end gap-2 sm:gap-3">
      {bars.map((b, i) => (
        <div key={b.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted">
            {b.value}
            <span className="hidden sm:inline"> {unit}</span>
          </span>
          <div
            className={`w-full max-w-10 rounded-t-md ${i === bars.length - 1 ? 'bg-primary' : 'bg-sky/50'}`}
            style={{ height: `${(b.value / max) * 100}px` }}
          />
          <span className="truncate text-[11px] text-subtle">{b.label}</span>
        </div>
      ))}
    </div>
  )
}

export function Sparkline({ values, tone = 'primary' }: { values: number[]; tone?: 'primary' | 'success' | 'warning' }) {
  const W = 96
  const H = 28
  const min = Math.min(...values) - 4
  const max = Math.max(...values) + 4
  const d = values
    .map((v, i) => `${i ? 'L' : 'M'}${(i * W) / Math.max(values.length - 1, 1)},${H - ((v - min) / (max - min)) * H}`)
    .join(' ')
  const color = { primary: 'var(--color-primary)', success: 'var(--color-success)', warning: 'var(--color-warning-base)' }[tone]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-24 overflow-visible" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
