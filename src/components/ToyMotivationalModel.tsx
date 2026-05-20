// Toy motivational model — a reader-facing intuition pump, clearly labelled as
// a toy. The Berridge form is real (motivation ≈ wanting · liking − effort);
// the parameters are illustrative. It exists to be argued with, not memorised.

import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { wantingModule } from '../lib/wanting'
import { Eyebrow } from './atlas'

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

export function ToyMotivationalModel() {
  const [wanting, setWanting] = useState(wantingModule.toyModel.wanting)
  const [liking, setLiking] = useState(wantingModule.toyModel.liking)
  const [effort, setEffort] = useState(wantingModule.toyModel.effort)

  // motivation ∈ [−1, 1]
  const motivation = wanting * liking - effort

  return (
    <div style={{ position: 'relative' }}>
      <Eyebrow>Toy motivational model</Eyebrow>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          border: '0.5px solid var(--accent-rule)',
          padding: '2px 6px',
          borderRadius: 2,
          background: 'var(--accent-bg)',
        }}
      >
        ↳ toy · not predictive
      </div>
      <p className="margin-note" style={{ margin: '4px 0 10px 0', fontSize: 12 }}>
        The form is real (Berridge); the parameters are illustrative. Drag wanting down
        — as a GLP-1RA would for high-energy palatable rewards — and watch motivation
        follow. Learning bias is omitted: it is genuinely unknown.
      </p>

      <div
        style={{
          padding: 14,
          background: 'var(--bg-paper)',
          border: '0.5px solid var(--rule)',
          borderRadius: 2,
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <Slider label="wanting" value={wanting} onChange={(v) => setWanting(v)} />
          <Slider label="liking" value={liking} onChange={(v) => setLiking(v)} />
          <Slider label="effort" value={effort} onChange={(v) => setEffort(v)} />
        </div>

        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '0.5px dashed var(--rule)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--ink-3)',
          }}
        >
          <span style={{ color: 'var(--ink-3)' }}>motivation</span> ={' '}
          <span style={{ color: 'var(--ink-1)' }}>{wanting.toFixed(2)}</span> ·{' '}
          <span style={{ color: 'var(--ink-2)' }}>{liking.toFixed(2)}</span> −{' '}
          <span style={{ color: 'var(--ink-2)' }}>{effort.toFixed(2)}</span>
        </div>

        <ResultBar value={motivation} />
      </div>
    </div>
  )
}

function ResultBar({ value }: { value: number }) {
  // value ∈ [−1, 1]; bar grows from the centre.
  const w = 264
  const h = 16
  const mid = w / 2
  const reach = mid - 6
  const filled = Math.min(1, Math.abs(value)) * reach
  const positive = value >= 0

  return (
    <div style={{ marginTop: 10 }}>
      <svg width={w} height={h + 16} style={{ display: 'block', maxWidth: '100%' }}>
        <line
          x1={4}
          y1={h / 2}
          x2={w - 4}
          y2={h / 2}
          stroke="var(--rule)"
          strokeWidth="0.5"
        />
        <line
          x1={mid}
          y1={1}
          x2={mid}
          y2={h - 1}
          stroke="var(--rule-strong)"
          strokeWidth="0.5"
        />
        <rect
          x={positive ? mid : mid - filled}
          y={h / 2 - 5}
          width={filled}
          height={10}
          fill={positive ? 'var(--ink-1)' : 'var(--accent)'}
        />
        <text
          x={4}
          y={h + 12}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--ink-3)' }}
        >
          ← no pursuit
        </text>
        <text
          x={w - 4}
          y={h + 12}
          textAnchor="end"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--ink-3)' }}
        >
          pursuit →
        </text>
      </svg>
      <div
        className="micro"
        style={{ marginTop: 2, color: positive ? 'var(--ink-2)' : 'var(--accent)' }}
      >
        motivation = {value.toFixed(2)}
      </div>
    </div>
  )
}

// ── Mini slider ─────────────────────────────────────────────────────────────

const SW = 168
const SH = 22
const SPAD = 9

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const ref = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const innerW = SW - SPAD * 2

  const fromClientX = (clientX: number) => {
    const rect = ref.current!.getBoundingClientRect()
    const scale = SW / rect.width
    return clamp01(((clientX - rect.left) * scale - SPAD) / innerW)
  }

  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    dragging.current = true
    ref.current?.setPointerCapture(e.pointerId)
    onChange(fromClientX(e.clientX))
  }
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (dragging.current) onChange(fromClientX(e.clientX))
  }
  const onUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    dragging.current = false
    ref.current?.releasePointerCapture(e.pointerId)
  }
  const onKey = (e: ReactKeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(clamp01(value - 0.05))
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(clamp01(value + 0.05))
    }
  }

  const handleX = SPAD + value * innerW

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '62px 1fr 32px', alignItems: 'center', gap: 8 }}
    >
      <span className="micro" style={{ color: 'var(--ink-2)' }}>
        {label}
      </span>
      <svg
        ref={ref}
        width={SW}
        height={SH}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={Number(value.toFixed(2))}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onKeyDown={onKey}
        style={{
          display: 'block',
          maxWidth: '100%',
          cursor: 'grab',
          touchAction: 'none',
          outline: 'none',
        }}
      >
        <line
          x1={SPAD}
          y1={SH / 2}
          x2={SW - SPAD}
          y2={SH / 2}
          stroke="var(--rule-strong)"
          strokeWidth="0.75"
        />
        <line
          x1={SPAD}
          y1={SH / 2}
          x2={handleX}
          y2={SH / 2}
          stroke="var(--ink-1)"
          strokeWidth="1.5"
        />
        <circle
          cx={handleX}
          cy={SH / 2}
          r={6}
          fill="var(--bg-paper)"
          stroke="var(--ink-1)"
          strokeWidth="1"
        />
      </svg>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>
        {value.toFixed(2)}
      </span>
    </div>
  )
}
