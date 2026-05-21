// Cross-Reward Craving — the evidence-graded radial map. The radial and the
// matrix are the same data in two registers: the radial shows the gestalt,
// the matrix shows the per-tier grading the radial is a projection of. The
// page exists to keep the gradient visible so it cannot be read as
// "GLP-1 cures addiction".

import { useState } from 'react'
import { ClaimCard, Confidence, Eyebrow, ModuleHeader } from '../components/atlas'
import { CrossRewardRadial } from '../components/CrossRewardRadial'
import { EvidenceMatrix } from '../components/EvidenceMatrix'
import { claimsForDomain, crossRewardModule } from '../lib/cross-reward'
import type { Confidence as ConfidenceLevel } from '../lib/schemas'

const LEGEND: ConfidenceLevel[] = ['strong', 'moderate', 'speculative', 'open']

export default function CrossReward() {
  const [selectedId, setSelectedId] = useState('alcohol')
  const domain =
    crossRewardModule.domains.find((d) => d.id === selectedId) ??
    crossRewardModule.domains[0]
  const claims = claimsForDomain(domain.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="05 · Cross-reward craving"
        title="Why a metabolic drug touches alcohol — and why that reach is graded, not universal."
        oneSentence="GLP-1RAs down-weight incentive salience through shared mesolimbic and central-amygdala substrate, so the effect spreads from food to other rewards. But the evidence thins fast: strong for food and alcohol, moderate for nicotine, preclinical-only for opioids and stimulants, anecdotal for gambling. The radial keeps that gradient on screen."
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
        {/* Left — the radial map */}
        <section
          style={{
            padding: '22px 32px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <Eyebrow>Evidence-graded radial · click a domain</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            Each domain sits on the confidence ring its <em>best available</em> evidence
            earns. Ring radius, spoke weight, and the node's bars all encode the same grade
            — the closer to the hub, the firmer the case.
          </p>

          <CrossRewardRadial selectedId={domain.id} onSelect={setSelectedId} />

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 16px',
              marginTop: 4,
              paddingTop: 10,
              borderTop: '0.5px solid var(--rule-soft)',
            }}
          >
            {LEGEND.map((c) => (
              <Confidence key={c} level={c} />
            ))}
          </div>
          <p className="margin-note" style={{ fontSize: 11.5, margin: '8px 0 0 0' }}>
            Hub — {crossRewardModule.hub.note}
          </p>

          <div
            style={{
              marginTop: 16,
              padding: '10px 13px',
              background: 'var(--accent-bg)',
              borderLeft: '1.5px solid var(--accent)',
              borderRadius: 2,
            }}
          >
            <Eyebrow accent>Reading the radial · two failure modes</Eyebrow>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 12.5,
                lineHeight: 1.55,
                color: 'var(--ink-1)',
                margin: '6px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {crossRewardModule.caution}
            </p>
          </div>
        </section>

        {/* Right — the matrix and the selected-domain detail */}
        <section style={{ padding: '22px 32px', overflow: 'auto' }}>
          <Eyebrow>Evidence matrix · domain × evidence tier</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 14px 0' }}>
            The matrix the radial is a projection of. A domain is only as strong as its
            strongest column — and an outer domain reads as firm only by borrowing an inner
            domain's columns.
          </p>

          <EvidenceMatrix selectedId={domain.id} onSelect={setSelectedId} />

          <hr className="hr" style={{ margin: '22px 0 0 0' }} />

          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <Eyebrow>{domain.label} · synthesis</Eyebrow>
              <Confidence level={domain.confidence} />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--ink-1)',
                margin: '8px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {domain.synthesis}
            </p>

            <div style={{ marginTop: 16 }}>
              <Eyebrow>Backing claims · full scope and provenance</Eyebrow>
              <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
                {claims.map((r) => (
                  <ClaimCard key={r.claim.id} resolved={r} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
