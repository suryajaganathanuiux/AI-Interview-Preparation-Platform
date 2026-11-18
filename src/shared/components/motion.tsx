import React, { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'

/** The one curve the whole product moves on: fast out, soft landing. */
export const EASE = [0.23, 1, 0.32, 1] as const

/** Fades content up into place once, the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.28, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

/** Parent for a staggered list: children marked <StaggerItem> arrive 45ms apart. */
export function Stagger({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' | 'dl' }) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  return (
    <M
      className={className}
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } } }}
    >
      {children}
    </M>
  )
}

export function StaggerItem({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'li' }) {
  const M = motion[as] as typeof motion.div
  return (
    <M
      className={className}
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE } } }}
    >
      {children}
    </M>
  )
}

/** Counts a number up from zero when it first comes into view. */
export function CountUp({ value, duration = 0.9, className }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? value : 0)
  useEffect(() => {
    if (!inView || reduce) return setShown(value)
    const c = animate(0, value, { duration, ease: EASE, onUpdate: (v) => setShown(Math.round(v)) })
    return () => c.stop()
  }, [inView, value, duration, reduce])
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {shown}
    </span>
  )
}

/** A progress bar that fills to its value when it first comes into view. */
export function GrowBar({ value, className, track = 'bg-line-soft', delay = 0, height = 'h-1.5' }: { value: number; className?: string; track?: string; delay?: number; height?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={`${height} overflow-hidden rounded-full ${track}`}>
      <motion.div
        className={`h-full rounded-full ${className ?? 'bg-primary'}`}
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE, delay }}
      />
    </div>
  )
}

/** A circular score gauge whose arc draws in once. */
export function Ring({ value, size = 132, stroke = 10, children }: { value: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const reduce = useReducedMotion()
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line-soft)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}
