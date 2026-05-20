// Mesolimbic wanting / hedonic tone — Slice 3. The Berridge decomposition is
// the corrective to "dopamine goes down"; the Kooji contradiction sits on the
// page as structure; the toy model is clearly labelled a toy.

import { BerridgeBars } from '../components/BerridgeBars'
import { CircuitDiagram } from '../components/CircuitDiagram'
import { PairedClaim } from '../components/PairedClaim'
import { PhenomenologySnippet } from '../components/PhenomenologySnippet'
import { ToyMotivationalModel } from '../components/ToyMotivationalModel'
import { Eyebrow, ModuleHeader } from '../components/atlas'
import { tension, wantingModule } from '../lib/wanting'

export default function Wanting() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="04 · Mesolimbic wanting · Hedonic tone"
        title="Rebalancing, not blunting. Wanting falls; liking and effort stay mostly uncharted."
        oneSentence="The defensible synthesis is that GLP-1RAs reduce incentive salience for high-energy palatable rewards. The behavioural case is strong; the cellular case is more nuanced than 'dopamine goes down' — recent photometry warns the simple picture is wrong."
        stewardship={{ date: '2026-02-14', fresh: true }}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        {/* Top-left — Berridge decomposition */}
        <section
          style={{
            padding: '22px 32px',
            borderRight: '0.5px solid var(--rule)',
            borderBottom: '0.5px solid var(--rule)',
          }}
        >
          <Eyebrow>Berridge decomposition</Eyebrow>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              fontWeight: 400,
              margin: '4px 0 6px 0',
            }}
          >
            Reduced <em>wanting</em> ≠ damaged hedonic capacity.
          </h3>
          <p className="margin-note" style={{ fontSize: 12.5, margin: 0 }}>
            The components are dissociable. A subjective “food tastes flat” is most likely
            reduced wanting and reduced motivational engagement — not loss of the orofacial
            liking response.
          </p>
          <BerridgeBars />
        </section>

        {/* Top-right — circuit */}
        <section style={{ padding: '22px 32px', borderBottom: '0.5px solid var(--rule)' }}>
          <Eyebrow>Circuit · VTA → NAc → VP → PFC</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '2px 0 0 0' }}>
            The VTA expresses GLP-1R on a subset of TH⁺ neurons; the NAc shell and ventral
            pallidum host the μ-opioid and CB1 hedonic hotspots that mediate liking — where
            GLP-1R is only modest.
          </p>
          <CircuitDiagram />
        </section>

        {/* Bottom-left — Kooji contradiction */}
        <section
          style={{
            padding: '22px 32px',
            borderRight: '0.5px solid var(--rule)',
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          <Eyebrow accent>⇄ Kooji tension · contradiction as structure</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 14px 0' }}>
            Two non-trivial findings. Neither is hidden in a footnote; both carry full scope
            and provenance. The reconciliation is an open question on the page.
          </p>
          <PairedClaim
            left={tension.left}
            right={tension.right}
            label={tension.label}
            note={tension.note}
          />
        </section>

        {/* Bottom-right — phenomenology, toy model, open questions */}
        <section
          style={{
            padding: '22px 32px',
            minHeight: 0,
            overflow: 'auto',
            display: 'grid',
            gap: 22,
            alignContent: 'start',
          }}
        >
          <div>
            <Eyebrow>Phenomenology mapping · from report to component</Eyebrow>
            <PhenomenologySnippet />
          </div>

          <ToyMotivationalModel />

          <div>
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
              {wantingModule.openQuestions.map((q) => (
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
