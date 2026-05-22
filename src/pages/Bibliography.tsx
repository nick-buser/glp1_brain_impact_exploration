// Bibliography — the reference shelf. Every paper, cohort and trial that any
// claim or evidence observation cites, collected once in one alphabetical
// list. Nothing is authored here: the entries are exactly the `papers`
// records, so this page cannot drift from what the claim graph actually
// leans on. Each entry carries a stable anchor id, so a citation elsewhere
// can deep-link to /bibliography#<paperId>.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ModuleHeader } from '../components/atlas'
import { dataset } from '../lib/data'
import type { Paper } from '../lib/schemas'

// ── Usage index: how load-bearing each paper is ─────────────────────────────
// Walk evidence → paper and claim → evidence → paper, so each entry can show
// what it actually underwrites rather than sitting as an inert citation.

const observationsByPaper = new Map<string, number>()
for (const e of dataset.evidence) {
  observationsByPaper.set(e.paperId, (observationsByPaper.get(e.paperId) ?? 0) + 1)
}

const paperOfEvidence = new Map(dataset.evidence.map((e) => [e.id, e.paperId]))
const claimsByPaper = new Map<string, Set<string>>()
for (const c of dataset.claims) {
  for (const eid of c.evidenceIds) {
    const pid = paperOfEvidence.get(eid)
    if (!pid) continue
    const set = claimsByPaper.get(pid) ?? new Set<string>()
    set.add(c.id)
    claimsByPaper.set(pid, set)
  }
}

// Alphabetical by first-author surname, then year — standard reference order.
const surnameKey = (p: Paper) => (p.authors[0] ?? p.cite).toLowerCase()
const orderedPapers = [...dataset.papers].sort(
  (a, b) => surnameKey(a).localeCompare(surnameKey(b)) || a.year - b.year,
)
const withDoi = orderedPapers.filter((p) => p.doi).length

function usageLabel(paperId: string): string {
  const claims = claimsByPaper.get(paperId)?.size ?? 0
  const obs = observationsByPaper.get(paperId) ?? 0
  if (claims === 0 && obs === 0) return 'not yet cited'
  const parts: string[] = []
  if (claims > 0) parts.push(`${claims} claim${claims === 1 ? '' : 's'}`)
  if (obs > 0) parts.push(`${obs} observation${obs === 1 ? '' : 's'}`)
  return `cited by ${parts.join(' · ')}`
}

export default function Bibliography() {
  const { hash } = useLocation()

  // Deep-link support: /bibliography#<paperId> scrolls to that entry.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="12 · Bibliography · The reference shelf"
        title="Every source the atlas leans on, gathered in one place."
        oneSentence="The full reference list behind the atlas — every paper, cohort and trial that any claim or evidence observation cites, in one alphabetical list. Nothing is authored on this page; the entries are the citation records themselves. Each links out to its DOI where one is registered; the remainder are project-curated aggregate entries or sources without a registered DOI."
        stewardship={{ date: '2026-05-21', fresh: true }}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <div style={{ maxWidth: 820, padding: '24px 36px 64px 36px' }}>
          {/* count strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--bg-tint)',
              border: '0.5px solid var(--rule)',
              borderRadius: 3,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 26,
                lineHeight: 1,
                color: 'var(--ink-1)',
              }}
            >
              {orderedPapers.length}
            </span>
            <span className="micro" style={{ color: 'var(--ink-2)' }}>
              references · <strong>{withDoi}</strong> link out to a registered DOI ·{' '}
              {orderedPapers.length - withDoi} project-curated or without a DOI
            </span>
          </div>

          {/* reference list */}
          <ol style={{ listStyle: 'none', margin: '20px 0 0 0', padding: 0 }}>
            {orderedPapers.map((p, i) => (
              <li
                key={p.id}
                id={p.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '34px 1fr',
                  gap: 14,
                  padding: '15px 0',
                  borderBottom: '0.5px solid var(--rule)',
                  scrollMarginTop: 14,
                }}
              >
                <span className="micro" style={{ color: 'var(--ink-3)', paddingTop: 3 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div style={{ minWidth: 0 }}>
                  {/* citation line + cite-key handle */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 14.5,
                        lineHeight: 1.4,
                        color: 'var(--ink-1)',
                      }}
                    >
                      {p.authors.join(', ')}{' '}
                      <span style={{ color: 'var(--ink-3)' }}>({p.year})</span>
                    </span>
                    <span
                      className="micro"
                      style={{ color: 'var(--ink-3)', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      {p.cite}
                    </span>
                  </div>

                  {p.journal && (
                    <div
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontSize: 13,
                        color: 'var(--ink-2)',
                        marginTop: 2,
                      }}
                    >
                      {p.journal}
                    </div>
                  )}

                  {p.note && (
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        color: 'var(--ink-2)',
                        margin: '7px 0 0 0',
                        textWrap: 'pretty',
                      }}
                    >
                      {p.note}
                    </p>
                  )}

                  {/* footer: DOI link + usage */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 8,
                      marginTop: 8,
                      flexWrap: 'wrap',
                    }}
                  >
                    {p.doi ? (
                      <a
                        className="micro"
                        href={`https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent)', textTransform: 'none' }}
                      >
                        doi.org/{p.doi} ↗
                      </a>
                    ) : (
                      <span className="micro" style={{ color: 'var(--ink-4)' }}>
                        no registered DOI
                      </span>
                    )}
                    <span className="micro" style={{ color: 'var(--ink-3)' }}>
                      ·
                    </span>
                    <span className="micro" style={{ color: 'var(--ink-3)' }}>
                      {usageLabel(p.id)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
