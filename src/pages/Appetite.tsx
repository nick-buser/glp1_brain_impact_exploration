// Appetite & meal termination — the standard-explainer surface, built to be
// visibly incomplete. The left column renders the conventional gut-brain-
// hypothalamus cascade most accounts stop at, then names, as structure, the
// three things it leaves out. The right column reframes meal termination as a
// threshold on an accumulating signal — and shows that the same curve, pushed
// harder, crosses a second threshold into aversion.

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ClaimCard, Eyebrow, ModuleHeader, ScopeChips } from '../components/atlas'
import { MealTerminationCurve } from '../components/MealTerminationCurve'
import { SatietyCascade } from '../components/SatietyCascade'
import { appetiteModule, claimsForRegime, mealFraction } from '../lib/appetite'

const INITIAL = 'semaglutide'

export default function Appetite() {
  const [regimeId, setRegimeId] = useState(INITIAL)
  const regime =
    appetiteModule.regimes.find((r) => r.id === regimeId) ?? appetiteModule.regimes[0]
  const claims = claimsForRegime(regime.id)
  const { thresholds, baseline, gaps, openQuestions } = appetiteModule

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="03 · Appetite & meal termination"
        title="The satiety cascade — the standard explainer, and where it runs out."
        oneSentence="The gut-brain-hypothalamus satiety pathway is real, and it is most of what GLP-1 explainers describe: slowed gastric emptying, vagal and area-postrema relay, arcuate melanocortin balance, a smaller meal. But meal termination is a threshold on an accumulating signal — and the same signal pushed harder crosses a second threshold into nausea and aversion. The cascade is the floor, not the ceiling."
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
        {/* Left — the standard explainer, and what it omits */}
        <section
          style={{
            padding: '22px 32px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <Eyebrow>The standard explainer · gut → brainstem → hypothalamus</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            This is the cascade most accounts of GLP-1 weight loss stop at. Every node is
            real and evidenced — hover for the claim behind it. It is the floor of the
            explanation, not the whole of it.
          </p>
          <SatietyCascade />

          <hr className="hr" style={{ margin: '20px 0 0 0' }} />

          <div style={{ marginTop: 16 }}>
            <Eyebrow>What this surface leaves out</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 10px 0' }}>
              Incompleteness made visible. Each gap is a real limit of the cascade above,
              and a pointer to the module that takes it up.
            </p>
            <div style={{ display: 'grid', gap: 6 }}>
              {gaps.map((g) => (
                <NavLink key={g.id} to={g.path} className="ap-gap">
                  <span className="ap-gap-head">
                    <span className="ap-gap-label">{g.label}</span>
                    <span className="ap-gap-sub">{g.sub} →</span>
                  </span>
                  <p className="ap-gap-note">{g.note}</p>
                </NavLink>
              ))}
            </div>
          </div>
        </section>

        {/* Right — meal termination as a threshold */}
        <section style={{ padding: '22px 32px', overflow: 'auto' }}>
          <Eyebrow>Meal termination as a threshold · select a regime</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            A satiation signal builds over a meal; the meal ends when it crosses the satiety
            threshold. A stronger agonist regime makes it build faster — a smaller meal —
            and steep enough, the same curve crosses the aversion threshold. The percentage
            is meal size against an unrestrained meal. The curve is a qualitative model; the
            claims below are the evidence.
          </p>

          <div className="ap-regimes">
            {appetiteModule.regimes.map((r) => (
              <button
                key={r.id}
                type="button"
                className={'ap-regime' + (r.id === regime.id ? ' on' : '')}
                onClick={() => setRegimeId(r.id)}
              >
                <span className="ap-regime-label">{r.label}</span>
                <span className="ap-regime-gain">
                  meal ≈ {Math.round(mealFraction(r.gain) * 100)}%
                </span>
              </button>
            ))}
          </div>

          <MealTerminationCurve
            regime={regime}
            baselineGain={baseline.gain}
            baselineLabel={baseline.label}
            satiety={thresholds.satiety}
            aversion={thresholds.aversion}
          />

          <div
            style={{
              marginTop: 12,
              padding: '14px 16px',
              background: 'var(--bg-paper)',
              border: '0.5px solid var(--rule)',
              borderRadius: 4,
            }}
          >
            <ScopeChips scope={regime.scope} />
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 13.5,
                lineHeight: 1.55,
                color: 'var(--ink-1)',
                margin: '11px 0 0 0',
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
