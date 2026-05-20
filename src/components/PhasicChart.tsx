// Recruitment over time. Native states are phasic — bursts on the timescale of
// minutes to an hour. Pharmacologic agonism flattens to a chronically elevated
// tonic line: a shape the system has no evolved response to. The trace morphs
// between states as the dial is dragged.

import { lerp } from '../lib/ppg'

const W = 480
const H = 96
const X0 = 32
const BASE_Y = 64
const AMP = 52

const gauss = (t: number, c: number, k: number) => Math.exp(-(((t - c) * k) ** 2))

/** Per-state recruitment trace, evaluated at time t ∈ [0,1]. */
function traceAt(stateIdx: number, t: number): number {
  switch (stateIdx) {
    case 0: // fasted
      return 0.06
    case 1: // fed
      return 0.18 + gauss(t, 0.3, 5) * 0.18
    case 2: // large meal
      return 0.08 + gauss(t, 0.25, 6) * 0.7 + gauss(t, 0.5, 9) * 0.25
    case 3: // stress
      return 0.06 + gauss(t, 0.18, 8) * 0.8 + gauss(t, 0.45, 6) * 0.45
    case 4: // pharmacologic
      return 0.85 - Math.exp(-t * 3) * 0.6
    default:
      return 0.06
  }
}

export function PhasicChart({ pos }: { pos: number }) {
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  const frac = pos - lo
  const pharm = Math.round(pos) === 4
  const stroke = pharm ? 'var(--accent)' : 'var(--ink-1)'

  const N = 140
  let d = ''
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1)
    const y = lerp(traceAt(lo, t), traceAt(hi, t), frac)
    const px = X0 + t * (W - X0 - 12)
    const py = BASE_Y - Math.min(1, y) * AMP
    d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1) + ' '
  }

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', marginTop: 8, maxWidth: W }}
      role="img"
      aria-label="PPG-NTS recruitment over time for the selected state"
    >
      {/* axes */}
      <line x1={X0} y1={10} x2={X0} y2={BASE_Y} stroke="var(--rule-strong)" strokeWidth="0.5" />
      <line
        x1={X0}
        y1={BASE_Y}
        x2={W - 12}
        y2={BASE_Y}
        stroke="var(--rule-strong)"
        strokeWidth="0.5"
      />
      {/* tonic reference */}
      <line
        x1={X0}
        y1={BASE_Y - AMP}
        x2={W - 12}
        y2={BASE_Y - AMP}
        stroke="var(--rule)"
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />

      <path d={d} fill="none" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />

      <text
        x={X0 - 4}
        y={14}
        textAnchor="end"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        max
      </text>
      <text
        x={X0 - 4}
        y={BASE_Y + 3}
        textAnchor="end"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        0
      </text>
      <text
        x={(W + X0) / 2}
        y={H - 4}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        time · minutes → hours
      </text>
    </svg>
  )
}
