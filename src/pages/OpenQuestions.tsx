// Open questions — the aggregate tracker. A thin surface over questions that
// already live in the validated modules and claims: it collects them, groups
// them, and links each back to where it is load-bearing. Two registers are
// kept visibly distinct — questions a module raises in general, and questions
// pinned to a single claim, where the evidence that would settle them is
// already scoped. The atlas decays silently if no one tends it; this page is
// the stewardship queue made legible.

import { Link } from 'react-router-dom'
import { ClaimCard, Eyebrow, ModuleHeader } from '../components/atlas'
import {
  claimQuestions,
  moduleQuestionCount,
  moduleQuestionGroups,
  totalOpenQuestions,
} from '../lib/open-questions'

export default function OpenQuestions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="11 · Open questions"
        title="What the atlas does not yet know — and, where it can be named, what would settle it."
        oneSentence="An honest atlas tracks its own gaps. Every question here is collected from a mechanism module or a claim — nothing is authored on this page. Module-level questions mark where a mechanism is genuinely unresolved; claim-level questions are sharper, each pinned to one claim whose scope already names the evidence that would move it."
        stewardship={{ date: '2026-05-21', fresh: true }}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <div style={{ maxWidth: 840, padding: '24px 36px 48px 36px' }}>
          {/* count strip */}
          <div className="oq-tally">
            <span className="oq-tally-n">{totalOpenQuestions}</span>
            <span className="oq-tally-text">
              open questions ·{' '}
              <strong>{moduleQuestionCount}</strong> raised across{' '}
              {moduleQuestionGroups.length} modules ·{' '}
              <strong>{claimQuestions.length}</strong> pinned to a specific claim
            </span>
          </div>

          {/* module-level questions */}
          <section style={{ marginTop: 26 }}>
            <Eyebrow>Raised by the modules</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
              What each mechanism module flags as unresolved. PPG-NTS and Cross-Reward
              raise none at the module level — Cross-Reward's open thread is carried on a
              claim instead, below.
            </p>

            <div style={{ display: 'grid', gap: 18, marginTop: 16 }}>
              {moduleQuestionGroups.map((g) => (
                <div key={g.id} className="oq-group">
                  <div className="oq-group-head">
                    <span className="oq-group-title">{g.title}</span>
                    <span className="oq-group-count">
                      {g.questions.length} open
                    </span>
                    <Link to={g.path} className="oq-group-link">
                      open module ↗
                    </Link>
                  </div>
                  <ul className="oq-list">
                    {g.questions.map((q) => (
                      <li key={q} className="oq-item">
                        <span className="oq-glyph" aria-hidden="true">
                          ◇
                        </span>
                        <span className="oq-text">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* claim-level questions */}
          <section style={{ marginTop: 32 }}>
            <Eyebrow accent>Pinned to a specific claim</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
              These are sharper. Each hangs on one claim, so the species, route, chronicity
              and assay that would resolve it are already on the record — the question is
              not “is this true?” but “what evidence, in what regime, would move it?”
            </p>

            <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
              {claimQuestions.map(({ question, claim }) => (
                <div key={claim.claim.id} className="oq-claim-q">
                  <div className="oq-question-lead">
                    <span className="oq-glyph" aria-hidden="true">
                      ◇
                    </span>
                    <p className="oq-question">{question}</p>
                  </div>
                  <ClaimCard resolved={claim} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
