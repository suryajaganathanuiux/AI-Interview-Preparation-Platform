import React from 'react'
import type { ResumeData, SectionKey } from './resume'

// The resume is a printed document, so it keeps paper colours in both themes.
export function ResumePreview({ data, template, highlight }: { data: ResumeData; template: string; highlight: SectionKey[] }) {
  const accent = template === 'Creative' ? '#1E40AF' : template === 'Technical' ? '#0F172A' : '#1E40AF'
  const heading = (t: string) => (
    <h3
      className="mb-1.5 text-[11px] font-bold uppercase tracking-wider"
      style={{ color: template === 'ATS Classic' ? '#0F172A' : accent, borderBottom: template === 'ATS Classic' ? '1px solid #CBD5E1' : 'none', paddingBottom: 2 }}
    >
      {t}
    </h3>
  )
  const wrap = (k: SectionKey, children: React.ReactNode) => (
    <section
      key={k}
      className="rounded-sm transition-colors duration-200"
      style={highlight.includes(k) ? { background: '#ECFDF3', boxShadow: '0 0 0 4px #ECFDF3' } : undefined}
    >
      {children}
    </section>
  )
  const render: Record<SectionKey, () => React.ReactNode> = {
    summary: () => wrap('summary', <>{heading('Summary')}<p>{data.summary}</p></>),
    skills: () =>
      wrap(
        'skills',
        <>
          {heading('Skills')}
          {template === 'Technical' ? (
            <div className="grid grid-cols-3 gap-x-3 gap-y-0.5">
              {data.skills.map((s) => (
                <span key={s}>▪ {s}</span>
              ))}
            </div>
          ) : (
            <p>{data.skills.join(' · ')}</p>
          )}
        </>
      ),
    experience: () => wrap('experience', <>{heading('Experience')}{data.experience.map((e) => <Item key={e.title} {...e} />)}</>),
    projects: () => wrap('projects', <>{heading('Projects')}{data.projects.map((e) => <Item key={e.title} {...e} />)}</>),
    education: () => wrap('education', <>{heading('Education')}<p>{data.education}</p></>),
    certifications: () => wrap('certifications', <>{heading('Certifications')}<p>{data.certifications}</p></>),
  }

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
      <div className="flex" style={{ color: '#1E293B' }}>
        {template === 'Creative' && <div className="w-2 shrink-0" style={{ background: accent }} />}
        <div className="min-w-0 flex-1 space-y-4 p-6 text-[12px] leading-relaxed sm:p-8">
          <header>
            <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>
              Riya Raman
            </h2>
            <p style={{ color: '#475569' }}>Chennai, India · Riya.raman@outlook.com · github.com/Riyaraman</p>
          </header>
          {data.order.map((k) => (
            <React.Fragment key={k}>{render[k]()}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function Item({ title, meta, bullets }: { title: string; meta: string; bullets: string[] }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex flex-wrap justify-between gap-x-3">
        <p className="font-semibold" style={{ color: '#0F172A' }}>
          {title}
        </p>
        <p style={{ color: '#64748B' }}>{meta}</p>
      </div>
      <ul className="mt-0.5 list-disc pl-4">
        {bullets.filter(Boolean).map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  )
}
