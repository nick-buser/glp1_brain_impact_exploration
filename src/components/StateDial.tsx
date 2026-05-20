// The PPG-NTS state dial — the centrepiece interaction. Drag (or arrow-key)
// through fasted → fed → large meal → stress → pharmacologic agonism. The
// handle follows the pointer directly while dragging, then springs to the
// nearest snap on release — the physical settle that makes the recruitment
// pattern felt rather than read.

import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import type { PpgNtsState } from '../lib/schemas'

const W = 480
const H = 104
const PAD_X = 30
const TRACK_Y = 40

const SPRING = { type: 'spring', stiffness: 280, damping: 26 } as const

/** Split a label into at most two lines for the tick caption. */
function twoLines(label: string): string[] {
  const words = label.split(' ')
  if (words.length === 1) return words
  return [words[0], words.slice(1).join(' ')]
}

export function StateDial({
  states,
  initial,
  onChange,
}: {
  states: PpgNtsState[]
  initial: number
  onChange: (pos: number) => void
}) {
  const last = states.length - 1
  const step = (W - PAD_X * 2) / last
  const pos = useMotionValue(initial)
  const handleX = useTransform(pos, (p) => PAD_X + p * step)
  const reduce = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const [active, setActive] = useState(Math.round(initial))

  useMotionValueEvent(pos, 'change', (v) => {
    onChange(v)
    setActive(Math.round(v))
  })

  const posFromClientX = (clientX: number) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const scale = W / rect.width
    const x = (clientX - rect.left) * scale - PAD_X
    return Math.max(0, Math.min(last, x / step))
  }

  const moveTo = (target: number) => {
    const t = Math.max(0, Math.min(last, target))
    if (reduce) pos.set(t)
    else animate(pos, t, SPRING)
  }

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    dragging.current = true
    svgRef.current?.setPointerCapture(e.pointerId)
    pos.set(posFromClientX(e.clientX))
  }
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (dragging.current) pos.set(posFromClientX(e.clientX))
  }
  const onPointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return
    dragging.current = false
    svgRef.current?.releasePointerCapture(e.pointerId)
    moveTo(Math.round(pos.get())) // settle to nearest snap
  }
  const onKeyDown = (e: ReactKeyboardEvent<SVGSVGElement>) => {
    const here = Math.round(pos.get())
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      moveTo(here - 1)
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      moveTo(here + 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      moveTo(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      moveTo(last)
    }
  }

  const activeState = states[active]
  const bandX = PAD_X + (last - 1) * step

  return (
    <svg
      ref={svgRef}
      width={W}
      height={H}
      role="slider"
      tabIndex={0}
      aria-label="Physiologic state"
      aria-valuemin={0}
      aria-valuemax={last}
      aria-valuenow={active}
      aria-valuetext={activeState.label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      style={{
        display: 'block',
        maxWidth: '100%',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        outline: 'none',
      }}
    >
      {/* pharmacologic band — a regime nature never produces */}
      <rect
        x={bandX}
        y={TRACK_Y - 7}
        width={step}
        height={14}
        fill="var(--accent-bg)"
        stroke="var(--accent-rule)"
        strokeWidth="0.5"
      />

      {/* track */}
      <line
        x1={PAD_X}
        y1={TRACK_Y}
        x2={W - PAD_X}
        y2={TRACK_Y}
        stroke="var(--rule-strong)"
        strokeWidth="0.75"
      />

      {/* ticks + labels */}
      {states.map((s, i) => {
        const x = PAD_X + i * step
        const isActive = i === active
        const lines = twoLines(s.label)
        return (
          <g key={s.id}>
            <line
              x1={x}
              y1={TRACK_Y - 6}
              x2={x}
              y2={TRACK_Y + 6}
              stroke={isActive ? 'var(--ink-1)' : 'var(--rule-strong)'}
              strokeWidth={isActive ? 1 : 0.5}
            />
            {lines.map((ln, li) => (
              <text
                key={li}
                x={x}
                y={TRACK_Y + 20 + li * 10}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fill: isActive ? 'var(--ink-1)' : 'var(--ink-3)',
                }}
              >
                {ln}
              </text>
            ))}
            <text
              x={x}
              y={TRACK_Y + 48}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fill: isActive
                  ? s.pharm
                    ? 'var(--accent)'
                    : 'var(--ink-1)'
                  : 'var(--ink-4)',
              }}
            >
              {s.glyph}
            </text>
          </g>
        )
      })}

      {/* handle */}
      <motion.g style={{ x: handleX, y: TRACK_Y }}>
        <circle r={10} fill="var(--bg-paper)" stroke="var(--ink-1)" strokeWidth="1" />
        <circle
          r={3.5}
          fill={activeState.pharm ? 'var(--accent)' : 'var(--ink-1)'}
        />
      </motion.g>
    </svg>
  )
}
