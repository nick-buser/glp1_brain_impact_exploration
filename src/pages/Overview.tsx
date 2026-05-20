// Overview Atlas — the map-room landing. Per the UI/UX guide, "the hardest
// single page in the project": orient without overwhelming, and let the lens
// re-project the same graph rather than swapping pages.

import { useMemo, useState } from 'react'
import { AtlasGraph } from '../components/AtlasGraph'
import { LensSwitcher } from '../components/LensSwitcher'
import { ProvenancePanel } from '../components/ProvenancePanel'
import { StewardshipPip } from '../components/atlas'
import { dataset, daysSinceReviewed, nodesById } from '../lib/data'
import type { LensId } from '../lib/lens'

export default function Overview() {
  const [lens, setLens] = useState<LensId>('mechanistic')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedNode = selectedId ? (nodesById.get(selectedId) ?? null) : null

  const stats = useMemo(() => {
    let fresh = 0
    let stale = 0
    let contradicted = 0
    for (const c of dataset.claims) {
      if (daysSinceReviewed(c) > 90) stale++
      else fresh++
      if (c.confidence === 'contradicted' || c.contradicts.length > 0) contradicted++
    }
    return { fresh, stale, contradicted }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <header style={{ padding: '18px 28px 14px 28px', borderBottom: '0.5px solid var(--rule)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow">GLP-1 Brain Mechanism Atlas · Overview</div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 30,
                fontWeight: 300,
                margin: '4px 0 0 0',
                letterSpacing: '-0.015em',
                lineHeight: 1.1,
              }}
            >
              The territory, at a glance.
            </h1>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div className="micro" style={{ marginBottom: 6 }}>
              v0.1 · {dataset.claims.length} claims · {dataset.papers.length} papers
            </div>
            <StewardshipPip date="2026-04-12" fresh />
          </div>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 14,
            lineHeight: 1.5,
            color: 'var(--ink-2)',
            margin: '12px 0 0 0',
            maxWidth: 940,
            textWrap: 'pretty',
          }}
        >
          A chronic, peripheral, pharmacological agonist of a normally phasic, aversive
          interoceptive system. Brain access is sparse and circumferential, not parenchymal.
          The effect on motivation is best described as <em>rebalancing</em>, not blunting.{' '}
          <span style={{ color: 'var(--accent)' }}>
            Switch lenses to re-project the same graph
          </span>{' '}
          — the structure does not change, the weighting and emphasis do.
        </p>
      </header>

      <LensSwitcher value={lens} onChange={setLens} />

      {/* Graph + provenance rail */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 300px' }}>
        <main
          style={{
            position: 'relative',
            background: 'var(--bg-paper)',
            minWidth: 0,
          }}
        >
          <AtlasGraph lens={lens} selectedId={selectedId} onSelect={setSelectedId} />
        </main>
        <ProvenancePanel node={selectedNode} lens={lens} />
      </div>

      {/* Stewardship strip */}
      <div
        style={{
          borderTop: '0.5px solid var(--rule)',
          padding: '10px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg)',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span className="micro" style={{ color: 'var(--ink-3)' }}>
            Garden
          </span>
          <span className="pip">
            <span className="pip-dot fresh" /> {stats.fresh} reviewed ≤90d
          </span>
          <span className="pip">
            <span className="pip-dot" style={{ background: 'var(--ink-4)' }} /> {stats.stale}{' '}
            stale &gt;90d
          </span>
          <span className="pip">
            <span className="pip-dot" style={{ background: 'var(--accent)' }} />{' '}
            {stats.contradicted} in contradiction
          </span>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span className="micro" style={{ color: 'var(--ink-3)' }}>
            Keyboard
          </span>
          <span className="micro">1–6 lens</span>
        </div>
      </div>
    </div>
  )
}
