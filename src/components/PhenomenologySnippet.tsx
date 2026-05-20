// Phenomenology mapping — a snippet of the eventual mapper. A subjective
// report is decomposed into candidate component mechanisms with weights and
// rationales. Structure handed back, not an answer: it makes the reader's
// reasoning cheaper, it does not claim to know what they are experiencing.

import { wantingModule } from '../lib/wanting'

export function PhenomenologySnippet() {
  const { report, fits } = wantingModule.phenomenology

  return (
    <div
      style={{
        marginTop: 8,
        border: '0.5px solid var(--rule)',
        borderRadius: 4,
        padding: 14,
        background: 'var(--bg-paper)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11.5,
          background: 'var(--bg-sunk)',
          border: '0.5px solid var(--rule-soft)',
          padding: '6px 10px',
          borderRadius: 2,
          color: 'var(--ink-1)',
        }}
      >
        <span className="micro" style={{ color: 'var(--ink-3)', marginRight: 8 }}>
          Report
        </span>
        “{report}”
      </div>

      <div className="micro" style={{ margin: '12px 0 8px 0' }}>
        Component decomposition · candidate fits
      </div>
      <div style={{ display: 'grid', gap: 7 }}>
        {fits.map((f) => (
          <div
            key={f.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '168px 72px 1fr',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <div
              style={{ fontFamily: 'var(--font-serif)', fontSize: 12.5, color: 'var(--ink-1)' }}
            >
              {f.label}
            </div>
            <div
              style={{
                position: 'relative',
                height: 8,
                background: 'var(--bg-sunk)',
                borderRadius: 1,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '0 auto 0 0',
                  width: f.weight * 100 + '%',
                  background: f.weight > 0.5 ? 'var(--ink-1)' : 'var(--ink-3)',
                  borderRadius: 1,
                }}
              />
            </div>
            <div
              className="margin-note"
              style={{ fontSize: 11, lineHeight: 1.45, fontStyle: 'normal' }}
            >
              {f.note}
            </div>
          </div>
        ))}
      </div>
      <p className="margin-note" style={{ marginTop: 12 }}>
        Structure handed back, not an answer. The mapper does not pretend to know what the
        reader is experiencing — it makes their reasoning cheaper and more disciplined.
      </p>
    </div>
  )
}
