// The translation ladder — the honest centre of the neuroimmune module.
// A hypothesis climbs four rungs: cell → rodent → human-observational → RCT.
// Each rung is graded independently, because evidence at a lower rung does not
// propagate up. Two things are drawn as structure, not prose: a *refuted* top
// rung breaks the rail beneath it, and an *untested* rung is a hollow, dashed
// ghost — empty because no one has tested it, not because a test failed.

import type { LadderGrade, LadderRung, NeuroimmuneTrack } from '../lib/schemas'
import { GRADE_META } from '../lib/neuroimmune'

const W = 452
const TM = 30 // top margin (room for the CLINIC cap)
const RH = 50 // rung height
const GAP = 30 // vertical gap between rungs
const RX0 = 66 // left rail x
const RX1 = 406 // right rail x

type GradeStyle = {
  stroke: string
  fill: string
  width: number
  dashed?: boolean
  faint?: boolean
}

const GRADE_STYLE: Record<LadderGrade, GradeStyle> = {
  supportive: { stroke: 'var(--ink-1)', fill: 'var(--bg-elev)', width: 1.3 },
  mixed: { stroke: 'var(--ink-2)', fill: 'var(--bg-paper)', width: 1.1 },
  preliminary: { stroke: 'var(--ink-3)', fill: 'var(--bg-paper)', width: 1 },
  untested: {
    stroke: 'var(--rule-strong)',
    fill: 'transparent',
    width: 1,
    dashed: true,
    faint: true,
  },
  refuted: { stroke: 'var(--accent)', fill: 'var(--accent-bg)', width: 1.5 },
}

/** Top edge y of the rung at ladder position i (0 = bottom rung). */
const rungTop = (i: number, n: number) => TM + (n - 1 - i) * (RH + GAP)

export function TranslationLadder({
  rungs,
  track,
  activeRungId,
  onSelectRung,
}: {
  rungs: LadderRung[]
  track: NeuroimmuneTrack
  activeRungId: string | null
  onSelectRung: (id: string) => void
}) {
  const n = rungs.length
  const H = rungTop(0, n) + RH + 30
  const axisTop = TM
  const axisBot = rungTop(0, n) + RH

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`Translation ladder for the hypothesis: ${track.hypothesis}`}
      style={{ display: 'block', marginTop: 10, maxWidth: W }}
    >
      {/* climb axis — bench at the foot, clinic at the head */}
      <defs>
        <marker
          id="ladder-arrow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-3)" />
        </marker>
      </defs>
      <line
        x1={28}
        y1={axisBot}
        x2={28}
        y2={axisTop - 4}
        stroke="var(--ink-3)"
        strokeWidth="0.75"
        markerEnd="url(#ladder-arrow)"
      />
      <text
        x={20}
        y={(axisTop + axisBot) / 2}
        transform={`rotate(-90 20 ${(axisTop + axisBot) / 2})`}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        bench → clinic · stringency rises
      </text>
      <text
        x={RX0}
        y={axisTop - 12}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        ▲ clinic — where the hypothesis is adjudicated
      </text>
      <text
        x={RX0}
        y={axisBot + 20}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        ▼ bench — where the mechanism is shown
      </text>

      {/* rails between consecutive rungs — broken under a refuted rung,
          ghosted under an untested one */}
      {rungs.slice(0, n - 1).map((_, i) => {
        const upper = track.steps[i + 1].grade
        const yTop = rungTop(i + 1, n) + RH // bottom edge of the upper rung
        const yBot = rungTop(i, n) // top edge of the lower rung
        const key = `rail-${i}`

        if (upper === 'refuted') {
          const midY = (yTop + yBot) / 2
          return (
            <g key={key}>
              {[RX0, RX1].map((x) => (
                <g key={x}>
                  <line
                    x1={x}
                    y1={yTop}
                    x2={x}
                    y2={midY - 7}
                    stroke="var(--accent)"
                    strokeWidth="1"
                  />
                  <line
                    x1={x}
                    y1={midY + 7}
                    x2={x}
                    y2={yBot}
                    stroke="var(--accent)"
                    strokeWidth="1"
                  />
                </g>
              ))}
              <text
                x={(RX0 + RX1) / 2}
                y={midY + 3}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fill: 'var(--accent)',
                }}
              >
                ✕ the rung above did not hold
              </text>
            </g>
          )
        }

        const ghost = upper === 'untested'
        return (
          <g key={key}>
            {[RX0, RX1].map((x) => (
              <line
                key={x}
                x1={x}
                y1={yTop}
                x2={x}
                y2={yBot}
                stroke={ghost ? 'var(--rule)' : 'var(--rule-strong)'}
                strokeWidth="1"
                strokeDasharray={ghost ? '2 3' : undefined}
              />
            ))}
          </g>
        )
      })}

      {/* rungs — bottom (cell) to top (RCT) */}
      {rungs.map((rung, i) => {
        const step = track.steps[i]
        const meta = GRADE_META[step.grade]
        const style = GRADE_STYLE[step.grade]
        const top = rungTop(i, n)
        const active = activeRungId === rung.id

        return (
          <g
            key={rung.id}
            role="button"
            tabIndex={0}
            aria-label={`${rung.label}: ${meta.label} — ${step.note}`}
            className="node-hit"
            onClick={() => onSelectRung(rung.id)}
            onMouseEnter={() => onSelectRung(rung.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectRung(rung.id)
              }
            }}
          >
            {active && (
              <rect
                x={RX0 - 4}
                y={top - 4}
                width={RX1 - RX0 + 8}
                height={RH + 8}
                rx={6}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.75"
                strokeDasharray="2 2"
              />
            )}
            <rect
              x={RX0}
              y={top}
              width={RX1 - RX0}
              height={RH}
              rx={4}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={style.width}
              strokeDasharray={style.dashed ? '4 3' : undefined}
              opacity={style.faint ? 0.85 : 1}
            />
            {/* tier ordinal */}
            <text
              x={RX0 + 16}
              y={top + 19}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                letterSpacing: '0.06em',
                fill: 'var(--ink-4)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </text>
            {/* rung label + sub */}
            <text
              x={RX0 + 40}
              y={top + 20}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12.5,
                fontWeight: 600,
                fill: 'var(--ink-1)',
              }}
            >
              {rung.label}
            </text>
            <text
              x={RX0 + 40}
              y={top + 34}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                fill: 'var(--ink-3)',
              }}
            >
              {rung.sub}
            </text>
            {/* grade label + glyph */}
            <text
              x={RX1 - 30}
              y={top + RH / 2 - 5}
              textAnchor="end"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fill: style.stroke,
              }}
            >
              {meta.label}
            </text>
            <text
              x={RX1 - 30}
              y={top + RH / 2 + 11}
              textAnchor="end"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 7.5,
                letterSpacing: '0.04em',
                fill: 'var(--ink-3)',
              }}
            >
              {step.claimIds.length > 0
                ? `${step.claimIds.length} claim${step.claimIds.length > 1 ? 's' : ''}`
                : 'no study'}
            </text>
            <text
              x={RX1 - 14}
              y={top + RH / 2 + 5}
              textAnchor="end"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                fill: style.stroke,
              }}
            >
              {meta.glyph}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** The grade chip — shared by the ladder's right-column rung detail. */
export function GradeTag({ grade }: { grade: LadderGrade }) {
  const meta = GRADE_META[grade]
  return (
    <span className={'ni-grade ni-grade--' + grade}>
      <span aria-hidden="true">{meta.glyph}</span>
      {meta.label}
    </span>
  )
}
