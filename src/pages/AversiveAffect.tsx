// Aversive Affect & the Stress Axis — the amygdala-GABA branch. Two structural
// claims carry the page: the PVN/CeA dissociation (stress hormones and the
// felt state come apart), and the regime-dependent affective sign (acute
// central rodent dosing is anxiogenic; chronic peripheral human dosing is
// neutral-to-favourable). The regime selector drives the diagram — the
// circuit evidence only renders "live" in the regime it was mapped in.

import { useState } from 'react'
import { ClaimCard, Eyebrow, ModuleHeader, ScopeChips } from '../components/atlas'
import { ChannelContrast } from '../components/ChannelContrast'
import { DissociationDiagram } from '../components/DissociationDiagram'
import { aversiveModule, claimsForRegime } from '../lib/aversive'
import type { AffectiveSign, Scope } from '../lib/schemas'

const SIGN: Record<AffectiveSign, { glyph: string; color: string }> = {
  anxiogenic: { glyph: '▲', color: 'var(--accent)' },
  mixed: { glyph: '◆', color: 'var(--ink-3)' },
  favourable: { glyph: '▽', color: 'var(--cool)' },
}

/** The translation-fragile triad — the regime the circuit evidence was mapped in. */
function isFragile(scope: Scope): boolean {
  return (
    (scope.species === 'rat' || scope.species === 'mouse') &&
    (scope.route === 'icv' || scope.route === 'parenchymal') &&
    scope.chronicity === 'acute'
  )
}

function SignBadge({ sign, note }: { sign: AffectiveSign; note: string }) {
  const s = SIGN[sign]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: s.color,
      }}
    >
      <span style={{ fontSize: 11 }}>{s.glyph}</span>
      {note}
    </span>
  )
}

export default function AversiveAffect() {
  const [regimeId, setRegimeId] = useState('acute-central')
  const regime =
    aversiveModule.regimes.find((r) => r.id === regimeId) ?? aversiveModule.regimes[0]
  const claims = claimsForRegime(regime.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="06 · Amygdala · GABA · aversive affect"
        title="The aversive branch — and it splits in two."
        oneSentence="GLP-1RAs reduce intake through a second channel beside dopamine: an amygdala-GABA aversive signal. That branch dissociates — the PVN drives the HPA axis without anxiety, the CeA drives anxiety without the HPA axis — and its affective sign depends on regime: anxiogenic in acute central rodent dosing, neutral-to-favourable in chronic peripheral human therapy."
        stewardship={{ date: '2026-05-21', fresh: true }}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* Left — the contrast and the dissociation */}
        <section
          style={{
            padding: '22px 32px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <Eyebrow>Not a dopamine story · two channels reduce intake</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            Reducing intake is not one mechanism. The wanting channel and the aversive
            channel both lower consumption — and they feel different.
          </p>
          <ChannelContrast />

          <hr className="hr" style={{ margin: '20px 0 0 0' }} />

          <div style={{ marginTop: 16 }}>
            <Eyebrow>PVN and CeA dissociate · stress hormones vs the felt state</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
              PPG-NTS reaches both nodes, but they come apart. Bars show each node's
              qualitative drive on the HPA axis (<span style={{ color: 'var(--cool)' }}>
                cool
              </span>
              ) and on anxiety-like behaviour (
              <span style={{ color: 'var(--accent)' }}>accent</span>) — the dissociation is
              the near-mirror between the PVN and the CeA.
            </p>
            <DissociationDiagram live={isFragile(regime.scope)} />
            <p className="margin-note" style={{ fontSize: 11.5, margin: '6px 0 0 0' }}>
              {aversiveModule.source.note}
            </p>
          </div>
        </section>

        {/* Right — the regime selector and its evidence */}
        <section style={{ padding: '22px 32px', overflow: 'auto' }}>
          <Eyebrow>Same drug, opposite sign · dose · route · timing</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            The affective sign is not a property of the drug — it is a property of the
            regime. Select one; the dissociation diagram renders live only in the regime
            its circuit evidence was mapped in.
          </p>

          <div className="av-regimes">
            {aversiveModule.regimes.map((r) => (
              <button
                key={r.id}
                type="button"
                className={'av-regime' + (r.id === regime.id ? ' on' : '')}
                onClick={() => setRegimeId(r.id)}
              >
                <span className="av-regime-label">{r.label}</span>
                <SignBadge sign={r.sign} note={r.signNote} />
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: '16px 18px',
              background: 'var(--bg-paper)',
              border: '0.5px solid var(--rule)',
              borderRadius: 4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <ScopeChips scope={regime.scope} />
              <SignBadge sign={regime.sign} note={regime.signNote} />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--ink-1)',
                margin: '12px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {regime.prose}
            </p>
          </div>

          <div style={{ marginTop: 18 }}>
            <Eyebrow>Active claims · this regime</Eyebrow>
            <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
              {claims.map((r) => (
                <ClaimCard key={r.claim.id} resolved={r} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Eyebrow>Open questions</Eyebrow>
            <ul
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 13,
                lineHeight: 1.5,
                margin: '8px 0 0 0',
                padding: '0 0 0 18px',
                color: 'var(--ink-2)',
              }}
            >
              {aversiveModule.openQuestions.map((q) => (
                <li key={q} style={{ marginBottom: 5 }}>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
