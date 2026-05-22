// Brain Access & Relay — the slice that introduces Mol*. The page carries one
// correction: a peripheral peptide drug does not flood the brain. The left
// column is the route story — a circulation→barrier→portal→projection diagram
// with a three-way route selector. The right column is the molecular story —
// a custom-SVG peptide track and a lazy-loaded Mol* 3D viewer — making the
// point that which molecule reaches where is a question of peptide
// engineering. Mol* is code-split: its ~600 kB bundle ships only to this route.

import { Component, lazy, Suspense, useState } from 'react'
import type { ReactNode } from 'react'
import { ClaimCard, Eyebrow, ModuleHeader } from '../components/atlas'
import { AccessRouteDiagram } from '../components/AccessRouteDiagram'
import { PeptideTrack } from '../components/PeptideTrack'
import { accessModule, claimsForDrug, claimsForRoute } from '../lib/access'
import type { AccessDrug } from '../lib/schemas'

const MolstarViewer = lazy(() => import('../components/MolstarViewer'))

// ── Entry gauge — how far into the brain a molecule actually gets ───────────

const ENTRY: Record<AccessDrug['entry'], { rank: number; label: string }> = {
  native: { rank: 0, label: 'native ligand · degraded in minutes' },
  minimal: { rank: 1, label: 'minimal brain entry' },
  slow: { rank: 2, label: 'slow brain entry' },
  appreciable: { rank: 3, label: 'appreciable brain entry' },
  engineered: { rank: 4, label: 'engineered for entry' },
}

function EntryGauge({ entry }: { entry: AccessDrug['entry'] }) {
  const { rank, label } = ENTRY[entry]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', gap: 2 }} aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              width: 16,
              height: 5,
              borderRadius: 0.5,
              background: i <= rank ? 'var(--accent)' : 'var(--ink-4)',
            }}
          />
        ))}
      </span>
      <span
        className="micro"
        style={{ fontSize: 9, color: rank <= 1 ? 'var(--ink-2)' : 'var(--accent)' }}
      >
        {label}
      </span>
    </div>
  )
}

// ── Error boundary — a failed Mol* chunk must not take the page down ────────

class ViewerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return (
        <div
          className="panel-sunk"
          style={{ padding: '28px 22px', textAlign: 'center' }}
        >
          <span className="micro" style={{ color: 'var(--accent)' }}>
            3D viewer could not be loaded.
          </span>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function BrainAccess() {
  const [routeId, setRouteId] = useState('cvo')
  const [drugId, setDrugId] = useState('semaglutide')
  // The Mol* viewer is a ~600 kB chunk. Gate it behind an explicit action so
  // the chunk is only fetched when a reader actually wants the 3D structure.
  const [viewerOn, setViewerOn] = useState(false)

  const route =
    accessModule.routes.find((r) => r.id === routeId) ?? accessModule.routes[0]
  const drug = accessModule.drugs.find((d) => d.id === drugId) ?? accessModule.drugs[0]
  const routeClaims = claimsForRoute(route.id)
  const drugClaims = claimsForDrug(drug.id)
  const { correction, structure } = accessModule
  const structureUrl = import.meta.env.BASE_URL + structure.file

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="01 · Brain access & relay"
        title="A guarded brain — and a few unlocked doors."
        oneSentence="Peripheral GLP-1 receptor agonists barely cross the blood-brain barrier, yet they reshape appetite and reward. They reach a small set of GLP-1R-bearing nodes through three privileged routes — circumventricular windows, slow adsorptive transcytosis, and vagal relay — and the deep limbic structures are touched only second-hand. Which molecule reaches where is a question of peptide engineering: the modifications that buy a week-long half-life are the same ones that keep semaglutide out."
        stewardship={{ date: '2026-05-21', fresh: true }}
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
        {/* ── Left — the access routes ───────────────────────────────── */}
        <section
          style={{
            padding: '22px 32px 56px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              padding: '12px 15px',
              background: 'var(--accent-bg)',
              borderLeft: '1.5px solid var(--accent)',
              borderRadius: 2,
            }}
          >
            <Eyebrow accent>The blood-brain barrier correction</Eyebrow>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14.5,
                fontWeight: 500,
                lineHeight: 1.4,
                color: 'var(--ink-1)',
                margin: '6px 0 0 0',
              }}
            >
              {correction.headline}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 12.5,
                lineHeight: 1.55,
                color: 'var(--ink-2)',
                margin: '6px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {correction.prose}
            </p>
          </div>

          <div style={{ marginTop: 18 }}>
            <Eyebrow>Three routes in · one barrier · select to trace</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
              The barrier is the dashed seam. It opens only at the circumventricular
              windows; everything past them is reached slowly or second-hand. The deep
              limbic nodes stay dim under every route — that is the point.
            </p>
            <AccessRouteDiagram module={accessModule} activeRouteId={route.id} />
          </div>

          <div className="ba-routes">
            {accessModule.routes.map((r) => (
              <button
                key={r.id}
                type="button"
                className={'ba-route' + (r.id === route.id ? ' on' : '')}
                onClick={() => setRouteId(r.id)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 12,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5 }}>
                    {r.label}
                  </span>
                  <span
                    className="micro"
                    style={{ fontSize: 8.5, color: 'var(--ink-3)' }}
                  >
                    {r.drugEnters ? 'drug enters' : 'signal only'}
                  </span>
                </div>
                <div
                  className="micro"
                  style={{ fontSize: 8.5, color: 'var(--ink-3)' }}
                >
                  {r.sub}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      flex: 1,
                      height: 4,
                      background: 'var(--bg-sunk)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        width: `${Math.round(r.share * 100)}%`,
                        background:
                          r.id === route.id ? 'var(--accent)' : 'var(--ink-3)',
                      }}
                    />
                  </span>
                  <span
                    className="micro"
                    style={{ fontSize: 8.5, color: 'var(--ink-3)' }}
                  >
                    ~{Math.round(r.share * 100)}% of signal
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 13.5,
              lineHeight: 1.55,
              color: 'var(--ink-1)',
              margin: '14px 0 0 0',
              textWrap: 'pretty',
            }}
          >
            {route.prose}
          </p>

          <div style={{ marginTop: 16 }}>
            <Eyebrow>Backing claims · this route</Eyebrow>
            <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
              {routeClaims.map((r) => (
                <ClaimCard key={r.claim.id} resolved={r} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Right — the molecule ───────────────────────────────────── */}
        <section style={{ padding: '22px 32px 56px', overflow: 'auto' }}>
          <Eyebrow>What has to get in · select an agonist</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            Every marketed agonist is the GLP-1 peptide, re-engineered. The track shows
            its primary structure; the numbered branches are the modifications — and
            those modifications are what set how far the molecule travels.
          </p>

          <div className="ba-drugs">
            {accessModule.drugs.map((d) => (
              <button
                key={d.id}
                type="button"
                className={'ba-drug' + (d.id === drug.id ? ' on' : '')}
                onClick={() => setDrugId(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: '14px 16px',
              background: 'var(--bg-paper)',
              border: '0.5px solid var(--rule)',
              borderRadius: 4,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 16,
                    color: 'var(--ink-1)',
                  }}
                >
                  {drug.label}
                </span>
                <span
                  className="micro"
                  style={{ fontSize: 9, color: 'var(--ink-3)', marginLeft: 8 }}
                >
                  {drug.klass}
                </span>
              </div>
              <EntryGauge entry={drug.entry} />
            </div>

            <div style={{ marginTop: 14 }}>
              <PeptideTrack drug={drug} />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 12.5,
                lineHeight: 1.55,
                color: 'var(--ink-2)',
                margin: '12px 0 0 0',
                paddingTop: 10,
                borderTop: '0.5px dashed var(--rule)',
                textWrap: 'pretty',
              }}
            >
              {drug.entryNote}
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <Eyebrow>The peptide, bound · Mol* 3D structure</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 8px 0' }}>
              {structure.label}.
            </p>
            {viewerOn ? (
              <ViewerBoundary>
                <Suspense
                  fallback={
                    <div
                      className="panel-sunk"
                      style={{
                        height: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="micro" style={{ color: 'var(--ink-3)' }}>
                        Loading Mol* viewer…
                      </span>
                    </div>
                  }
                >
                  <MolstarViewer url={structureUrl} height={300} />
                </Suspense>
              </ViewerBoundary>
            ) : (
              <button
                type="button"
                className="panel-sunk"
                onClick={() => setViewerOn(true)}
                style={{
                  height: 300,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  border: '0.5px solid var(--rule-strong)',
                  borderRadius: 4,
                }}
              >
                <span style={{ fontSize: 22, color: 'var(--ink-3)' }}>⊕</span>
                <span style={{ color: 'var(--ink-1)', fontSize: 13 }}>
                  Load interactive 3D structure
                </span>
                <span className="micro" style={{ color: 'var(--ink-3)' }}>
                  Mol* viewer · ~600&nbsp;kB · loads on demand
                </span>
              </button>
            )}
            <p className="margin-note" style={{ fontSize: 11.5, margin: '8px 0 0 0' }}>
              {structure.caption}
            </p>
            <p
              className="micro"
              style={{ fontSize: 8.5, color: 'var(--ink-3)', marginTop: 6 }}
            >
              {structure.credit}
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <Eyebrow>Backing claims · this molecule</Eyebrow>
            <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
              {drugClaims.map((r) => (
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
              {accessModule.openQuestions.map((q) => (
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
