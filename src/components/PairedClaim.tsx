// Paired-claim tension node — a contradiction rendered as structure rather
// than hedged in prose. Two claims, each with full confidence and provenance,
// bridged by a marked tension band; the reconciliation note sits below as an
// open question, not a disclaimer.

import type { ResolvedClaim } from '../lib/data'
import { ClaimCard, Eyebrow } from './atlas'

export function PairedClaim({
  left,
  right,
  label,
  note,
}: {
  left: ResolvedClaim
  right: ResolvedClaim
  label: string
  note: string
}) {
  return (
    <div>
      <div className="tension">
        <ClaimCard resolved={left} />
        <div className="tension-bridge">
          <span className="tension-bridge-label">⇄</span>
        </div>
        <ClaimCard resolved={right} />
      </div>
      <div
        style={{
          marginTop: 10,
          padding: '9px 12px',
          background: 'var(--accent-bg)',
          borderLeft: '1.5px solid var(--accent)',
          borderRadius: 2,
        }}
      >
        <Eyebrow accent>{label} · reconciliation open</Eyebrow>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 12.5,
            lineHeight: 1.55,
            color: 'var(--ink-1)',
            margin: '6px 0 0 0',
            textWrap: 'pretty',
          }}
        >
          {note}
        </p>
      </div>
    </div>
  )
}
