// The lens switcher — per the UI/UX guide, "probably the single most
// important shared control in the system". Keyboard 1–6 switches lenses.

import { useEffect } from 'react'
import { LENSES, lensById, type LensId } from '../lib/lens'

export function LensSwitcher({
  value,
  onChange,
}: {
  value: LensId
  onChange: (id: LensId) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && target.matches('input, textarea, [contenteditable]')) return
      const n = Number.parseInt(e.key, 10)
      if (n >= 1 && n <= LENSES.length) onChange(LENSES[n - 1].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onChange])

  return (
    <div className="lens" role="tablist" aria-label="Lens">
      {LENSES.map((l, i) => (
        <button
          key={l.id}
          type="button"
          className={'lens-btn' + (value === l.id ? ' active' : '')}
          onClick={() => onChange(l.id)}
          title={l.hint}
          role="tab"
          aria-selected={value === l.id}
        >
          <span className="lens-key">{i + 1}</span>
          <span>{l.label}</span>
        </button>
      ))}
      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
        }}
      >
        <span className="micro">Lens</span>
        <span className="micro" style={{ color: 'var(--ink-2)' }}>
          {lensById.get(value)?.hint}
        </span>
      </div>
    </div>
  )
}
