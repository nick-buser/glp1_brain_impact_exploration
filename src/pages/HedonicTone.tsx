// Hedonic tone — the phenomenology mapper. The interlocutor surface: a reader
// picks a half-articulated subjective report and the mapper hands it back as a
// probabilistic component decomposition — wanting, liking, learning, effort,
// aversive interoception, nausea, mood — each with a likelihood and a
// rationale. The page exists to resist one move: collapsing a report onto a
// single mechanism ("food tastes flat" → "GLP-1 reduces liking"). The naive
// one-line reading is shown as the flattening it is; the decomposition, the
// discriminating question, and the caveats are the structure handed back. It
// is not a diagnosis and not a chatbot — the input is a guided picker, and the
// output is scaffolding for the reader's own reasoning.

import { useMemo, useState } from 'react'
import { Eyebrow, ModuleHeader } from '../components/atlas'
import { ComponentDecomposition } from '../components/ComponentDecomposition'
import {
  defaultReportId,
  phenomenologyModule,
  resolveReport,
} from '../lib/phenomenology'

export default function HedonicTone() {
  const { reports, components, openQuestions } = phenomenologyModule
  const [reportId, setReportId] = useState(defaultReportId)

  const resolved = useMemo(() => resolveReport(reportId), [reportId])
  if (!resolved) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="07 · Hedonic tone · Phenomenology mapper"
        title="A subjective report is not a mechanism. The mapper hands back structure, not an answer."
        oneSentence="Pick a half-articulated report — “food tastes flat”, “alcohol stopped calling to me” — and the mapper returns it as a decomposition across candidate components, each with a likelihood and a rationale. The standard one-line reading is shown as the flattening it is. This is the interlocutor surface: it makes the reader's reasoning about their own experience cheaper and more disciplined, and it never pretends to know what they are feeling."
        stewardship={{ date: '2026-05-21', fresh: true }}
      />

      <div
        className="page-col-2"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
        }}
      >
        {/* Left — the report picker and the decomposition vocabulary */}
        <section
          style={{
            padding: '22px 32px 56px',
            borderRight: '0.5px solid var(--rule)',
            overflow: 'auto',
          }}
        >
          <Eyebrow>Subjective reports · the picker</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
            Input is a guided pick from curated reports, not a free-text box — the mapper is
            a structured surface, not a chatbot. Each report is something a patient or
            clinician might actually say.
          </p>
          <div className="ph-reports">
            {reports.map((r) => (
              <button
                key={r.id}
                type="button"
                className={'ph-report' + (r.id === reportId ? ' on' : '')}
                onClick={() => setReportId(r.id)}
              >
                “{r.text}”
              </button>
            ))}
          </div>

          <hr className="hr" style={{ margin: '20px 0 0 0' }} />

          <div style={{ marginTop: 16 }}>
            <Eyebrow>The decomposition vocabulary</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12.5, margin: '4px 0 0 0' }}>
              Seven channels a report can decompose across. The Berridge four — wanting,
              liking, learning, effort — plus the interoceptive and affective channels GLP-1
              specifically engages. <em>Liking</em> and <em>effort</em> carry no backing
              claim: those are the genuinely unstudied channels, and the mapper says so.
            </p>
            <div className="ph-glossary">
              {components.map((c) => (
                <div key={c.id} className="ph-gloss-item">
                  <div className="ph-gloss-label">
                    {c.label}
                    {c.claimIds.length === 0 && (
                      <span className="ph-gloss-gap">unstudied</span>
                    )}
                  </div>
                  <p className="ph-gloss-text">{c.gloss}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right — the decomposition readout */}
        <section style={{ padding: '22px 32px 56px', overflow: 'auto' }}>
          {/* the report, verbatim */}
          <div className="ph-quote">
            <span className="micro" style={{ color: 'var(--ink-3)' }}>
              Report
            </span>
            <p className="ph-quote-text">“{resolved.text}”</p>
          </div>

          {/* the naive reading, marked as the flattening it is */}
          <div className="ph-naive">
            <span className="ph-naive-tag">The flattening read</span>
            <span className="ph-naive-text">{resolved.naiveReading}</span>
          </div>
          <p className="margin-note" style={{ fontSize: 12, margin: '8px 0 0 0' }}>
            That reading is not wrong so much as collapsed — it picks one channel and drops
            the rest. The decomposition below keeps the others in view.
          </p>

          {/* the decomposition */}
          <div style={{ marginTop: 16 }}>
            <Eyebrow>Component decomposition · candidate fits</Eyebrow>
            <p className="margin-note" style={{ fontSize: 12, margin: '4px 0 0 0' }}>
              Ordered by fit. The bar is a curated qualitative weight, not a probability;
              the likelihood label is the honest grade. An <em>uncertain</em> bar is hatched
              — the channel fits the words, but the magnitude is genuinely unknown.
            </p>
            <ComponentDecomposition report={resolved} />
          </div>

          {/* the discriminating question */}
          <div className="ph-discriminator">
            <Eyebrow accent>What would tell these apart</Eyebrow>
            <p className="ph-discriminator-text">{resolved.discriminator}</p>
          </div>

          {/* caveats */}
          <div style={{ marginTop: 18 }}>
            <Eyebrow>Caveats</Eyebrow>
            <ul className="ph-caveats">
              {resolved.caveats.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {/* open questions */}
          <div style={{ marginTop: 18 }}>
            <Eyebrow>Open questions · what the decomposition cannot yet resolve</Eyebrow>
            <ul className="ph-caveats">
              {openQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
