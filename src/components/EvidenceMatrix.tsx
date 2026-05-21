// The evidence matrix — the table the radial is a projection of. Rows are
// reward domains, columns are the four evidence tiers. A domain is only as
// strong as its strongest column; overgeneralisation is reading an outer
// domain as if it had an inner domain's columns. Clicking a row selects the
// domain, shared with the radial map.

import type { CrossRewardMatrix, MatrixGrade } from '../lib/schemas'
import { crossRewardModule } from '../lib/cross-reward'

const TIERS: { key: keyof CrossRewardMatrix; label: string }[] = [
  { key: 'preclinical', label: 'Preclinical' },
  { key: 'humanRct', label: 'Human RCT' },
  { key: 'observational', label: 'Observational' },
  { key: 'mechanism', label: 'Mechanism' },
]

const GRADE: Record<MatrixGrade, { bars: number; glyph?: string; label: string }> = {
  strong: { bars: 3, label: 'Strong' },
  moderate: { bars: 2, label: 'Moderate' },
  speculative: { bars: 1, label: 'Speculative' },
  open: { bars: 0, glyph: '◇', label: 'Studied — open' },
  absent: { bars: 0, glyph: '—', label: 'No evidence' },
}

function GradeCell({ grade }: { grade: MatrixGrade }) {
  const g = GRADE[grade]
  return (
    <div className="xr-cell" title={g.label}>
      {g.glyph ? (
        <span className="xr-cell-glyph">{g.glyph}</span>
      ) : (
        <span className="conf-bars" aria-label={g.label}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < g.bars ? 'on' : ''} />
          ))}
        </span>
      )}
    </div>
  )
}

export function EvidenceMatrix({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="xr-matrix">
      <div className="xr-matrix-head">
        <div className="xr-matrix-corner">Reward domain</div>
        {TIERS.map((t) => (
          <div key={t.key} className="xr-matrix-tier">
            {t.label}
          </div>
        ))}
      </div>
      {crossRewardModule.domains.map((d) => (
        <button
          key={d.id}
          type="button"
          className={'xr-matrix-row' + (d.id === selectedId ? ' on' : '')}
          onClick={() => onSelect(d.id)}
        >
          <div className="xr-matrix-domain">
            <span>{d.label}</span>
            <span className="xr-matrix-sub">{d.sub}</span>
          </div>
          {TIERS.map((t) => (
            <GradeCell key={t.key} grade={d.matrix[t.key]} />
          ))}
        </button>
      ))}
    </div>
  )
}
