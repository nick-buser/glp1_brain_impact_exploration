// Custom-SVG peptide primary-structure track — the 2D molecular register the
// library plan flags as mattering more day-to-day than the 3D view. Each
// agonist is drawn as a residue track, tinted by side-chain property, with its
// engineering modifications branching off the residues they sit on. The track
// is what makes the access story legible: semaglutide's C18 diacid is the same
// mark that explains why it stays out of the brain.

import type { AccessDrug } from '../lib/schemas'

const RESIDUE_NAME: Record<string, string> = {
  A: 'Alanine',
  R: 'Arginine',
  N: 'Asparagine',
  D: 'Aspartate',
  C: 'Cysteine',
  E: 'Glutamate',
  Q: 'Glutamine',
  G: 'Glycine',
  H: 'Histidine',
  I: 'Isoleucine',
  L: 'Leucine',
  K: 'Lysine',
  M: 'Methionine',
  F: 'Phenylalanine',
  P: 'Proline',
  S: 'Serine',
  T: 'Threonine',
  W: 'Tryptophan',
  Y: 'Tyrosine',
  V: 'Valine',
  Aib: '2-aminoisobutyric acid (non-standard)',
}

type ResidueClass = 'basic' | 'acidic' | 'special' | 'neutral'

function classOf(code: string): ResidueClass {
  if (code === 'Aib') return 'special'
  if (code === 'H' || code === 'K' || code === 'R') return 'basic'
  if (code === 'D' || code === 'E') return 'acidic'
  return 'neutral'
}

const FILL: Record<ResidueClass, string> = {
  basic: 'var(--accent-bg)',
  acidic: 'var(--bg-sunk)',
  special: 'var(--accent)',
  neutral: 'var(--bg-paper)',
}

const KIND_GLYPH: Record<AccessDrug['mods'][number]['kind'], string> = {
  acylation: '▒ acylation',
  substitution: '◇ substitution',
  extension: '⋯ extension',
}

const STEP = 14
const CHIP = 11
const PAD = 8
const TRACK_Y = 20

export function PeptideTrack({ drug }: { drug: AccessDrug }) {
  const n = drug.sequence.length
  const width = PAD * 2 + n * STEP
  const height = TRACK_Y + CHIP + 30
  // Stable numbering: mods sorted by residue index get 1..k.
  const mods = [...drug.mods].sort((a, b) => a.at - b.at)
  const modNumber = new Map(mods.map((m, i) => [m.at, i + 1]))

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label={`Primary structure of ${drug.label}: ${n} residues, ${mods.length} engineering modifications`}
        style={{ display: 'block', maxHeight: 96 }}
      >
        {/* N / C terminus labels */}
        <text
          x={PAD}
          y={12}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, fill: 'var(--ink-3)' }}
        >
          N · {drug.backbone}
        </text>
        <text
          x={width - PAD}
          y={12}
          textAnchor="end"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, fill: 'var(--ink-3)' }}
        >
          {n} aa · C
        </text>

        {drug.sequence.map((code, i) => {
          const x = PAD + i * STEP
          const cls = classOf(code)
          const mod = modNumber.get(i)
          const isModified = mod != null
          return (
            <g key={i}>
              <title>
                {`${code === 'Aib' ? 'Aib' : code}${i + 1} — ${
                  RESIDUE_NAME[code] ?? code
                }`}
              </title>
              <rect
                x={x}
                y={TRACK_Y}
                width={CHIP}
                height={CHIP}
                rx={1.5}
                fill={FILL[cls]}
                stroke={isModified ? 'var(--accent)' : 'var(--rule-strong)'}
                strokeWidth={isModified ? 1.1 : 0.5}
              />
              <text
                x={x + CHIP / 2}
                y={TRACK_Y + CHIP / 2 + 2.6}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: code === 'Aib' ? 4.6 : 7,
                  fill: cls === 'special' ? 'var(--bg-paper)' : 'var(--ink-1)',
                }}
              >
                {code}
              </text>
              {isModified && (
                <>
                  <line
                    x1={x + CHIP / 2}
                    y1={TRACK_Y + CHIP}
                    x2={x + CHIP / 2}
                    y2={TRACK_Y + CHIP + 9}
                    stroke="var(--accent)"
                    strokeWidth={0.75}
                  />
                  <circle
                    cx={x + CHIP / 2}
                    cy={TRACK_Y + CHIP + 13.5}
                    r={4.5}
                    fill="var(--accent)"
                  />
                  <text
                    x={x + CHIP / 2}
                    y={TRACK_Y + CHIP + 16}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 6.5,
                      fontWeight: 600,
                      fill: 'var(--bg-paper)',
                    }}
                  >
                    {mod}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* Property legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px 12px',
          marginTop: 4,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
        }}
      >
        {(
          [
            ['basic', 'basic H·K·R'],
            ['acidic', 'acidic D·E'],
            ['neutral', 'other'],
            ['special', 'non-standard'],
          ] as const
        ).map(([cls, label]) => (
          <span key={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 1.5,
                background: FILL[cls],
                border: '0.5px solid var(--rule-strong)',
              }}
            />
            {label}
          </span>
        ))}
      </div>

      {/* Modification detail — the numbered branches explained */}
      {mods.length > 0 && (
        <ul style={{ listStyle: 'none', margin: '12px 0 0 0', padding: 0, display: 'grid', gap: 7 }}>
          {mods.map((m, i) => (
            <li
              key={m.at}
              style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 8 }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'var(--bg-paper)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--ink-1)',
                      fontWeight: 600,
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    className="micro"
                    style={{ fontSize: 8.5, color: 'var(--ink-3)' }}
                  >
                    {KIND_GLYPH[m.kind]}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: 'var(--ink-2)',
                    margin: '2px 0 0 0',
                    textWrap: 'pretty',
                  }}
                >
                  {m.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
