// Neuroimmune / insulin / cognition — the hype-control surface. The page is
// built around the translation ladder: a hypothesis climbs cell → rodent →
// observational → RCT, and every rung must be re-earned. The left column is
// the ladder for the selected hypothesis; the right column grades it rung by
// rung, with the EVOKE failure held as the module's permanent anchor — the
// worked example of three encouraging rungs that the adjudicating trial did
// not confirm.

import { useState } from 'react'
import { ClaimCard, Eyebrow, ModuleHeader } from '../components/atlas'
import { GradeTag, TranslationLadder } from '../components/TranslationLadder'
import { GRADE_META, neuroimmuneModule, resolveClaims } from '../lib/neuroimmune'
import type { LadderGrade } from '../lib/schemas'

const LEGEND: LadderGrade[] = [
  'supportive',
  'mixed',
  'preliminary',
  'untested',
  'refuted',
]

export default function Neuroimmune() {
  const { rungs, tracks, anchor, unstudied, openQuestions } = neuroimmuneModule
  const [trackId, setTrackId] = useState(tracks[0].id)
  const [activeRungId, setActiveRungId] = useState<string | null>(null)
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0]

  const anchorClaims = resolveClaims(anchor.claimIds)
  const unstudiedClaim = resolveClaims([unstudied.claimId])[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="08 · Neuroimmune / insulin / cognition"
        title="The translation ladder — and why an encouraging mechanism is not yet a result."
        oneSentence="Reduced neuroinflammation, rescued central insulin signalling, and pro-plasticity effects are real and reproducible at the bench — and they are the rationale behind every claim that GLP-1 drugs protect the brain. This module grades each hypothesis rung by rung, from cell to randomised trial, because evidence does not propagate upward. The anchor is EVOKE: a cognition hypothesis with three encouraging rungs that the trial built to adjudicate it did not confirm."
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
        {/* Left — the translation ladder */}
        <section
          style={{
            padding: '22px 32px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <Eyebrow>The translation ladder · select a hypothesis</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            Each hypothesis climbs four rungs of evidence. A rung is graded on its own
            evidence alone — a firm cell or rodent rung does not lift the rungs above it.
            Hover a rung to read its grading on the right.
          </p>

          <div className="ni-tracks">
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                className={'ni-track' + (t.id === track.id ? ' on' : '')}
                onClick={() => {
                  setTrackId(t.id)
                  setActiveRungId(null)
                }}
              >
                <span>
                  <span className="ni-track-label">{t.label}</span>
                  <span className="ni-track-sub">{t.sub}</span>
                </span>
                {t.anchor && <span className="ni-track-tag">anchor</span>}
              </button>
            ))}
          </div>

          <TranslationLadder
            rungs={rungs}
            track={track}
            activeRungId={activeRungId}
            onSelectRung={setActiveRungId}
          />

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 14px',
              marginTop: 6,
              paddingTop: 10,
              borderTop: '0.5px solid var(--rule-soft)',
            }}
          >
            {LEGEND.map((g) => (
              <span key={g} title={GRADE_META[g].gloss}>
                <GradeTag grade={g} />
              </span>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              padding: '10px 13px',
              background: 'var(--accent-bg)',
              borderLeft: '1.5px solid var(--accent)',
              borderRadius: 2,
            }}
          >
            <Eyebrow accent>Reading the ladder · two ways to misread it</Eyebrow>
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
              <em>Borrowing optimism</em> — a firm cell or rodent rung says a mechanism is
              real, not that it helps a patient. <em>Reading an empty rung as a verdict</em>{' '}
              — an untested rung is a question no one has asked, not a hypothesis that
              failed. Only the randomised-trial rung adjudicates; EVOKE is what the top
              rung looks like when it does.
            </p>
          </div>
        </section>

        {/* Right — the rung-by-rung grading of the selected hypothesis */}
        <section style={{ padding: '22px 32px', overflow: 'auto' }}>
          <Eyebrow>{track.label} · where it stands</Eyebrow>

          <div
            style={{
              marginTop: 8,
              padding: '14px 16px',
              background: 'var(--bg-paper)',
              border: '0.5px solid var(--rule)',
              borderRadius: 4,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                lineHeight: 1.5,
                color: 'var(--ink-2)',
                margin: 0,
                textWrap: 'pretty',
              }}
            >
              HYPOTHESIS · {track.hypothesis}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 13.5,
                lineHeight: 1.55,
                color: 'var(--ink-1)',
                margin: '10px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {track.verdict}
            </p>
          </div>

          <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
            {rungs.map((rung, i) => {
              const step = track.steps[i]
              const claims = resolveClaims(step.claimIds)
              const active = activeRungId === rung.id
              return (
                <div
                  key={rung.id}
                  className={'ni-rung' + (active ? ' on' : '')}
                  onMouseEnter={() => setActiveRungId(rung.id)}
                >
                  <div className="ni-rung-head">
                    <span>
                      <span className="ni-tier">{rung.label}</span>
                      <span className="ni-tier-sub">{rung.sub}</span>
                    </span>
                    <GradeTag grade={step.grade} />
                  </div>
                  <p className="ni-register">
                    <span className="ni-register-key">Shows</span> {rung.establishes}{' '}
                    <span className="ni-register-key">Can't</span> {rung.limit}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: 'var(--ink-1)',
                      margin: '9px 0 0 0',
                      textWrap: 'pretty',
                    }}
                  >
                    {step.note}
                  </p>
                  {claims.length > 0 ? (
                    <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                      {claims.map((r) => (
                        <ClaimCard key={r.claim.id} resolved={r} />
                      ))}
                    </div>
                  ) : (
                    <p
                      className="margin-note"
                      style={{ fontSize: 12, margin: '9px 0 0 0' }}
                    >
                      No study occupies this rung — it is empty because untested, not
                      because tested and failed.
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* The module anchor — always present, regardless of track */}
          <div
            style={{
              marginTop: 20,
              padding: '14px 16px',
              background: 'var(--accent-bg)',
              border: '0.5px solid var(--accent-rule)',
              borderRadius: 4,
            }}
          >
            <Eyebrow accent>{anchor.headline}</Eyebrow>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 13,
                lineHeight: 1.6,
                color: 'var(--ink-1)',
                margin: '7px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {anchor.prose}
            </p>
            <div style={{ marginTop: 11, display: 'grid', gap: 8 }}>
              {anchorClaims.map((r) => (
                <ClaimCard key={r.claim.id} resolved={r} />
              ))}
            </div>
          </div>

          {/* The question with no rungs */}
          <div style={{ marginTop: 18 }}>
            <Eyebrow>{unstudied.headline}</Eyebrow>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 13,
                lineHeight: 1.55,
                color: 'var(--ink-2)',
                margin: '6px 0 0 0',
                textWrap: 'pretty',
              }}
            >
              {unstudied.prose}
            </p>
            {unstudiedClaim && (
              <div style={{ marginTop: 10 }}>
                <ClaimCard resolved={unstudiedClaim} />
              </div>
            )}
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
