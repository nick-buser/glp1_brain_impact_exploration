// PPG-NTS / native central GLP-1 system — Slice 2. The state dial is the
// centrepiece: dragging it makes the central reframe felt — GLP-1 as a phasic
// interoceptive-aversive signal, not a tonic appetite signal.

import { useState } from 'react'
import { ClaimCard, Eyebrow, ModuleHeader } from '../components/atlas'
import { PathwayDiagram } from '../components/PathwayDiagram'
import { PhasicChart } from '../components/PhasicChart'
import { StateDial } from '../components/StateDial'
import { claimsForState, ppgModule } from '../lib/ppg'

const INITIAL = 2 // start on "Large meal"

export default function PpgNts() {
  const [pos, setPos] = useState(INITIAL)
  const idx = Math.max(0, Math.min(ppgModule.states.length - 1, Math.round(pos)))
  const state = ppgModule.states[idx]
  const claims = claimsForState(idx)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="02 · PPG-NTS · Native central GLP-1 system"
        title="A secondary satiation and aversive-interoceptive signal, recruited phasically."
        oneSentence="Brain PPG-NTS neurons are not a tonic appetite regulator. Nature deploys them for large meals and visceral or psychogenic stress, and suppresses them in fasting. Pharmacological GLP-1RAs sustain chronically a signal nature deploys phasically and aversively."
        stewardship={{ date: '2026-02-14' }}
      />

      <div
        className="page-col-2"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* Left — the dial and the state explainer */}
        <section
          style={{
            padding: '24px 36px 56px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <Eyebrow>Physiologic state · drag the dial</Eyebrow>
          <div style={{ marginTop: 12 }}>
            <StateDial states={ppgModule.states} initial={INITIAL} onChange={setPos} />
          </div>
          <p className="margin-note" style={{ marginTop: 4 }}>
            Drag the handle or use ← →. The shaded segment is pharmacologic agonism — a
            regime nature never produces.
          </p>

          <div
            style={{
              marginTop: 22,
              padding: '18px 20px',
              background: state.pharm ? 'var(--accent-bg)' : 'var(--bg-paper)',
              border:
                '0.5px solid ' + (state.pharm ? 'var(--accent-rule)' : 'var(--rule)'),
              borderRadius: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 24,
                  color: state.pharm ? 'var(--accent)' : 'var(--ink-1)',
                }}
              >
                {state.glyph}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 21,
                  fontWeight: 400,
                  margin: 0,
                  color: state.pharm ? 'var(--accent)' : 'var(--ink-1)',
                  letterSpacing: '-0.005em',
                }}
              >
                {state.label}
              </h3>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--ink-1)',
                margin: '10px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {state.prose}
            </p>
            {state.aside && (
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: 'var(--accent)',
                  margin: '10px 0 0 0',
                  textWrap: 'pretty',
                }}
              >
                {state.aside}
              </p>
            )}
          </div>

          <div style={{ marginTop: 26 }}>
            <Eyebrow>Recruitment over time</Eyebrow>
            <PhasicChart pos={pos} />
            <p className="margin-note" style={{ marginTop: 6 }}>
              Native recruitment is <em>phasic</em>: bursts on the timescale of minutes to
              an hour. Pharmacologic agonism flattens to a chronically elevated tonic line —
              a shape the system has no evolved response to.
            </p>
          </div>
        </section>

        {/* Right — projections and active claims */}
        <section style={{ padding: '24px 36px 56px', overflow: 'auto' }}>
          <Eyebrow>PPG-NTS recruitment &amp; projections</Eyebrow>
          <p className="margin-note" style={{ marginTop: 6, fontSize: 12.5 }}>
            Node fill encodes recruitment strength. Peripheral GLP-1 (the pharmacologic
            state) bypasses PPG, acting via AP/NTS sensing and second-order projections —
            note the <em>different</em> pattern. The per-state values are a qualitative
            model; the claims below are the evidentiary backing.
          </p>
          <PathwayDiagram pos={pos} />

          <div style={{ marginTop: 18 }}>
            <Eyebrow>Active claims · this state</Eyebrow>
            <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
              {claims.map((r) => (
                <ClaimCard key={r.claim.id} resolved={r} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
