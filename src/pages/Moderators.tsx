// Moderators — the qualitative sensitivity simulator. Seven moderator
// dimensions set a regime; the dashboard projects that regime onto five effect
// channels and onto a translation-confidence score, and scores the claim graph
// for fit. The page exists to make one PRD sentence operable: "acute ICV
// exendin-4 in lean male rats is not chronic peripheral semaglutide in obese
// humans." Those two regimes are presets — flip between them and every bar,
// the regime banner, and the matched evidence reconfigure at once. Dose, sex
// and baseline state are marked ungrounded: they move the model, but the claim
// graph does not stratify on them, and the dashboard says so.

import { useMemo, useState } from 'react'
import { ClaimCard, Eyebrow, ModuleHeader } from '../components/atlas'
import { EffectChannelBars } from '../components/EffectChannelBars'
import {
  defaultSelection,
  matchedClaims,
  moderatorsModule,
  simulate,
  type RegimeTone,
  type Selection,
} from '../lib/moderators'

const TONE_COLOR: Record<RegimeTone, string> = {
  clinical: 'var(--ink-1)',
  mixed: 'var(--ink-2)',
  experimental: 'var(--accent-soft)',
  fragile: 'var(--accent)',
}

const GROUNDED_DIM_LABELS: Record<string, string> = {
  route: 'route',
  chronicity: 'chronicity',
  species: 'species',
  molecule: 'molecule',
}

export default function Moderators() {
  const { dimensions, presets, openQuestions } = moderatorsModule
  const [sel, setSel] = useState<Selection>(defaultSelection)

  const sim = useMemo(() => simulate(sel), [sel])
  const matches = useMemo(() => matchedClaims(sel), [sel])
  const activePreset = presets.find((p) =>
    dimensions.every((d) => p.set[d.id] === sel[d.id]),
  )
  const toneColor = TONE_COLOR[sim.regime.tone]
  const topMatches = matches.slice(0, 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="10 · Moderators"
        title="The qualitative simulator — how the same molecule reconfigures across regimes."
        oneSentence="Dose, route, chronicity, species, sex, baseline state and molecule are not footnotes on a claim — they are the claim's load-bearing structure. Set a regime here and the dashboard projects it onto five effect channels and a translation-confidence score. It is a qualitative sensitivity model, not a quantitative predictor: the bars are a curated reading, the matched claims below are the real evidence."
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
        {/* Left — the moderator controls */}
        <section
          style={{
            padding: '22px 32px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <Eyebrow>Regime presets · the teaching cases</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            Three regimes worth holding side by side. Flip between the clinical register and
            the fragile paradigm — they are the same drug class, and almost nothing else
            survives the move.
          </p>
          <div className="mod-presets">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={'mod-preset' + (activePreset?.id === p.id ? ' on' : '')}
                onClick={() => setSel({ ...p.set })}
              >
                <span className="mod-preset-label">{p.label}</span>
                <span className="mod-preset-note">{p.note}</span>
              </button>
            ))}
          </div>

          <hr className="hr" style={{ margin: '18px 0 0 0' }} />

          <div style={{ marginTop: 14 }}>
            <Eyebrow>Moderator dimensions · set the regime</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
              Seven axes. Four are <em>grounded</em> — the claim graph encodes them, so the
              matched evidence responds. Three are <em>ungrounded</em>: they move the model,
              but no claim in the graph is stratified on them. That gap is itself a finding.
            </p>

            <div style={{ marginTop: 12, display: 'grid', gap: 14 }}>
              {dimensions.map((dim) => {
                const chosen =
                  dim.options.find((o) => o.id === sel[dim.id]) ?? dim.options[0]
                return (
                  <div key={dim.id}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--ink-1)',
                        }}
                      >
                        {dim.label}
                      </span>
                      <span className="micro" style={{ fontSize: 9 }}>
                        {dim.sub}
                      </span>
                      <span
                        className={
                          'mod-ground' + (dim.grounded ? ' grounded' : ' ungrounded')
                        }
                      >
                        {dim.grounded ? 'in the graph' : 'model only'}
                      </span>
                    </div>
                    <div className="mod-opts">
                      {dim.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={
                            'facet-chip' + (opt.id === chosen.id ? ' on' : '')
                          }
                          onClick={() => setSel((s) => ({ ...s, [dim.id]: opt.id }))}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="mod-opt-note">{chosen.note}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Right — the simulated readout */}
        <section style={{ padding: '22px 32px', overflow: 'auto' }}>
          {/* regime banner */}
          <div
            className="mod-regime"
            style={{ borderColor: toneColor, background: 'var(--bg-paper)' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 16,
              }}
            >
              <div>
                <div className="eyebrow" style={{ color: toneColor }}>
                  Regime
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 19,
                    color: 'var(--ink-1)',
                    marginTop: 2,
                  }}
                >
                  {sim.regime.label}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="micro" style={{ fontSize: 9 }}>
                  Translation confidence
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 20,
                    color: toneColor,
                  }}
                >
                  {Math.round(sim.translation * 100)}
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>/100</span>
                </div>
              </div>
            </div>
            <div className="mod-meter" style={{ marginTop: 8 }}>
              <div
                className="mod-meter-fill"
                style={{
                  width: `${sim.translation * 100}%`,
                  background: toneColor,
                }}
              />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 12.5,
                lineHeight: 1.5,
                color: 'var(--ink-2)',
                margin: '9px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {sim.regime.note}
            </p>
          </div>

          {/* effect channels */}
          <div style={{ marginTop: 18 }}>
            <Eyebrow>Predicted effect channels · qualitative model</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12, margin: '4px 0 0 0' }}>
              The bar is a curated reading of direction and magnitude, not a measured
              quantity. Treat it as the simulator's hypothesis — and check it against the
              matched evidence below.
            </p>
            <EffectChannelBars sim={sim} />
          </div>

          {/* matched evidence */}
          <div style={{ marginTop: 20 }}>
            <Eyebrow>Matched evidence · the claim graph at this regime</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12, margin: '4px 0 8px 0' }}>
              Each claim is scored on the four grounded dimensions — route, chronicity,
              species, molecule. A claim matching all four is direct evidence for this
              regime; a low score means the regime above is running ahead of its evidence.
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {topMatches.map((m) => (
                <div key={m.resolved.claim.id}>
                  <div className="mod-match-head">
                    <span className={'mod-match-score s' + m.score}>
                      scope match {m.score}/4
                    </span>
                    {m.matched.length > 0 ? (
                      <span className="mod-match-dims">
                        {m.matched.map((d) => GROUNDED_DIM_LABELS[d] ?? d).join(' · ')}
                      </span>
                    ) : (
                      <span className="mod-match-dims" style={{ color: 'var(--accent)' }}>
                        no grounded dimension matches this regime
                      </span>
                    )}
                  </div>
                  <ClaimCard resolved={m.resolved} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Eyebrow>Open questions · the unstratified moderators</Eyebrow>
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
              {openQuestions.map((q) => (
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
