import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X, Maximize2, SquarePen } from 'lucide-react'
import { NovaChat } from './NovaChat'
import type { NavKey } from '../AppShell'

export function NovaPanel({
  open,
  onClose,
  onNavigate,
  onExpand,
}: {
  open: boolean
  onClose: () => void
  onNavigate?: (k: NavKey) => void
  onExpand?: () => void
}) {
  const [session, setSession] = useState(0)
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-navy/20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label="NOVA, your AI career agent"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-line bg-canvas shadow-2xl sm:w-[440px]"
          >
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-sm font-semibold">NOVA</p>
                <p className="text-xs text-muted">Your AI career agent</p>
              </div>
              <button onClick={() => setSession((s) => s + 1)} className="rounded-md p-2 text-muted hover:bg-canvas hover:text-ink" aria-label="New conversation" title="New conversation">
                <SquarePen className="h-4 w-4" />
              </button>
              <button onClick={onExpand} className="rounded-md p-2 text-muted hover:bg-canvas hover:text-ink" aria-label="Open full screen" title="Open full screen">
                <Maximize2 className="h-4 w-4" />
              </button>
              <button onClick={onClose} className="rounded-md p-2 text-muted hover:bg-canvas hover:text-ink" aria-label="Close NOVA">
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="min-h-0 flex-1">
              <NovaChat key={session} compact onNavigate={onNavigate} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
