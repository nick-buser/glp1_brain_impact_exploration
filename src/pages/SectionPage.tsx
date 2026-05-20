import type { Section } from '../lib/sections'

// Placeholder mechanism page. Per docs/02-engineering-design.md the build
// proceeds in vertical slices: the Overview Atlas (Slice 1) is live; each of
// these graduates into its own surface — claim graph, controls, evidence
// panel, caveats, couplings — in subsequent slices.
export default function SectionPage({ section }: { section: Section }) {
  return (
    <article style={{ maxWidth: 760, margin: '0 auto', padding: '56px 32px' }}>
      <div className="eyebrow">Mechanism module · forthcoming slice</div>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 30,
          fontWeight: 300,
          margin: '6px 0 0 0',
          letterSpacing: '-0.015em',
          lineHeight: 1.15,
        }}
      >
        {section.title}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 16,
          lineHeight: 1.55,
          color: 'var(--ink-2)',
          marginTop: 14,
          textWrap: 'pretty',
        }}
      >
        {section.claim}
      </p>

      <div
        className="panel-sunk"
        style={{
          marginTop: 32,
          padding: '24px 24px',
          fontFamily: 'var(--font-serif)',
          fontSize: 13.5,
          lineHeight: 1.6,
          color: 'var(--ink-3)',
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Per-module skeleton
        </div>
        This surface will follow the shared skeleton: one-sentence claim → primary visual →
        mechanism controls → evidence panel → caveats → couplings. The claim/evidence graph
        and lens system that drive the{' '}
        <a href="/" style={{ color: 'var(--accent)' }}>
          Overview Atlas
        </a>{' '}
        are already in place; this module wires its mechanism-specific visual onto them.
      </div>
    </article>
  )
}
