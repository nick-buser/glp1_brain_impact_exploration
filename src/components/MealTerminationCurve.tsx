// The meal-termination curve — the honest centre of the appetite module.
// A satiation signal accumulates over a single meal; the meal ends where the
// curve crosses the satiety threshold. The same curve, pushed steeper by a
// stronger agonist regime, crosses a second threshold into aversion — so
// "ends the meal" and "produces malaise" are one curve read at two heights.
// The faint reference curve is an unrestrained (no-drug) meal. The bold curve
// tweens between regimes so the reframe is felt, not just switched.

import { useEffect, useRef, useState } from 'react'
import { crossing, mealFraction, satiationSignal } from '../lib/appetite'
import type { AppetiteRegime } from '../lib/schemas'

const W = 488
const H = 252
const PX0 = 46 // plot left
const PX1 = 458 // plot right
const PYT = 26 // plot top (signal = 1)
const PYB = 196 // plot bottom (signal = 0)

const fx = (x: number) => PX0 + Math.max(0, Math.min(1, x)) * (PX1 - PX0)
const fy = (s: number) => PYB - Math.max(0, Math.min(1, s)) * (PYB - PYT)

/** Sampled SVG path for a regime's accumulation curve. */
function curvePath(gain: number): string {
  const N = 120
  let d = ''
  for (let i = 0; i < N; i++) {
    const x = i / (N - 1)
    d += (i === 0 ? 'M' : 'L') + fx(x).toFixed(1) + ',' + fy(satiationSignal(gain, x)).toFixed(1) + ' '
  }
  return d
}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function MealTerminationCurve({
  regime,
  baselineGain,
  baselineLabel,
  satiety,
  aversion,
}: {
  regime: AppetiteRegime
  baselineGain: number
  baselineLabel: string
  satiety: number
  aversion: number
}) {
  // The displayed gain tweens toward the selected regime's gain.
  const [gain, setGain] = useState(regime.gain)
  const curRef = useRef(regime.gain)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const target = regime.gain
    const start = curRef.current
    if (reducedMotion() || start === target) {
      curRef.current = target
      setGain(target)
      return
    }
    const t0 = performance.now()
    const DUR = 440
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DUR)
      const eased = 1 - Math.pow(1 - p, 3)
      const g = start + (target - start) * eased
      curRef.current = g
      setGain(g)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [regime.gain])

  const xSat = crossing(gain, satiety)
  const xAv = crossing(gain, aversion)
  const aversionInMeal = xAv <= 1
  const pct = Math.round(mealFraction(gain) * 100)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`Meal-termination curve for the ${regime.label} regime: meal ends at roughly ${pct} percent of an unrestrained meal`}
      style={{ display: 'block', marginTop: 8, maxWidth: W }}
    >
      {/* plot frame */}
      <line x1={PX0} y1={PYT} x2={PX0} y2={PYB} stroke="var(--rule-strong)" strokeWidth="0.5" />
      <line x1={PX0} y1={PYB} x2={PX1} y2={PYB} stroke="var(--rule-strong)" strokeWidth="0.5" />

      {/* threshold lines */}
      <line
        x1={PX0}
        y1={fy(aversion)}
        x2={PX1}
        y2={fy(aversion)}
        stroke="var(--accent)"
        strokeWidth="0.75"
        strokeDasharray="3 3"
      />
      <line
        x1={PX0}
        y1={fy(satiety)}
        x2={PX1}
        y2={fy(satiety)}
        stroke="var(--ink-2)"
        strokeWidth="0.75"
        strokeDasharray="3 3"
      />
      <text
        x={PX0 + 3}
        y={fy(aversion) - 4}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fill: 'var(--accent)',
        }}
      >
        aversion threshold — malaise
      </text>
      <text
        x={PX0 + 3}
        y={fy(satiety) - 4}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fill: 'var(--ink-2)',
        }}
      >
        satiety threshold — meal ends
      </text>

      {/* baseline reference curve */}
      <path
        d={curvePath(baselineGain)}
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity={0.7}
      />
      <text
        x={fx(1) - 2}
        y={fy(satiationSignal(baselineGain, 1)) - 5}
        textAnchor="end"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, fill: 'var(--ink-3)' }}
      >
        {baselineLabel}
      </text>

      {/* selected regime curve */}
      <path d={curvePath(gain)} fill="none" stroke="var(--ink-1)" strokeWidth="1.6" />

      {/* meal-termination marker */}
      {xSat <= 1 && (
        <g>
          <line
            x1={fx(xSat)}
            y1={fy(satiety)}
            x2={fx(xSat)}
            y2={PYB}
            stroke="var(--ink-2)"
            strokeWidth="0.75"
          />
          <circle cx={fx(xSat)} cy={fy(satiety)} r={3.4} fill="var(--ink-1)" />
          <text
            x={fx(xSat) + (fx(xSat) > (PX0 + PX1) / 2 ? -7 : 7)}
            y={fy(satiety) + 14}
            textAnchor={fx(xSat) > (PX0 + PX1) / 2 ? 'end' : 'start'}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--ink-1)' }}
          >
            meal ends · ≈{pct}%
          </text>
        </g>
      )}

      {/* aversion-crossing marker — only when reached within a single meal */}
      {aversionInMeal && (
        <g>
          <circle
            cx={fx(xAv)}
            cy={fy(aversion)}
            r={3.6}
            fill="var(--bg-paper)"
            stroke="var(--accent)"
            strokeWidth="1.4"
          />
          <text
            x={fx(xAv) + (fx(xAv) > (PX0 + PX1) / 2 ? -7 : 7)}
            y={fy(aversion) + 14}
            textAnchor={fx(xAv) > (PX0 + PX1) / 2 ? 'end' : 'start'}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--accent)' }}
          >
            crosses into malaise
          </text>
        </g>
      )}

      {/* axis labels */}
      <text
        x={(PX0 + PX1) / 2}
        y={H - 6}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        food consumed in one meal →
      </text>
      <text
        x={PX0 - 4}
        y={PYT - 12}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        ↑ accumulated satiation signal
      </text>
    </svg>
  )
}
