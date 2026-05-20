// artboard-phenom.jsx — Phenomenology mapper, sketch fidelity.
// The riskiest surface. The contract: structure handed back, never an answer.

const { useState: useStatePh } = React;

const EXAMPLE_REPORTS = [
  "food tastes flat",
  "alcohol stopped calling to me",
  "I feel emotionally blunted",
  "I still enjoy things when I start",
  "I'm just not hungry — at all",
  "social events feel less appealing",
];

const CANNED = {
  "alcohol stopped calling to me": {
    components: [
      { label: "Wanting↓ · cue-salience reduction",   weight: 0.82, conf: "strong",     mechs: ["wanting", "cross"], rationale: "Cross-reward mesolimbic gain reduction. SEMALCO 26w (Klausen 2026) and Hendershot 2025 (JAMA Psych) both show reduced craving and lab self-administration." },
      { label: "Aversive interoception · CeA GABA",   weight: 0.54, conf: "moderate",   mechs: ["amygdala"], rationale: "Chuong/Farokhnia/Khom (JCI Insight 2023) — semaglutide's alcohol effect engages CeA GABA, not solely DA." },
      { label: "Liking change",                        weight: 0.18, conf: "open",       mechs: ["hedonic"], rationale: "No clean orofacial-liking assay for alcohol under GLP-1RA. Hedonic-hotspot machinery presumed intact." },
      { label: "Mood / anhedonia spread",              weight: 0.12, conf: "speculative",mechs: ["hpa", "hedonic"], rationale: "Possible in subgroup; population-level signals are neutral-to-favourable (Wang Nat Med 2024)." },
    ],
    caveats: [
      "Multiple components likely co-active. Decomposition is structural, not diagnostic.",
      "Patient may be reporting any combination of relief, neutrality, or worry — the report is compatible with several internal states.",
    ],
  },
  "food tastes flat": {
    components: [
      { label: "Wanting↓ for high-energy palatable",   weight: 0.75, conf: "strong",     mechs: ["wanting"], rationale: "Lower PR breakpoints; reduced cue-elicited striatal activation; reduced motivational engagement before consumption." },
      { label: "Mild nausea / aversive interoception", weight: 0.42, conf: "moderate",   mechs: ["amygdala", "ppg_nts"], rationale: "Therapeutic dose adjacent to nausea threshold; CeA / BNST aversive engagement." },
      { label: "Salience reweighting",                  weight: 0.35, conf: "moderate",   mechs: ["wanting"], rationale: "Lower predicted value of energy-dense cues; relative reweighting toward neutral or non-food cues." },
      { label: "True liking change",                    weight: 0.22, conf: "open",       mechs: ["hedonic"], rationale: "No rodent evidence for degraded orofacial liking. Possible in humans but underdetermined." },
    ],
    caveats: [
      "&quot;Tastes flat&quot; can reflect changed motivational engagement with the food rather than altered taste perception per se.",
      "Liking and wanting are dissociable; conflating them is the classic pop-science collapse.",
    ],
  },
  "I feel emotionally blunted": {
    components: [
      { label: "Wanting↓ generalising · non-consummatory motivation", weight: 0.58, conf: "speculative", mechs: ["wanting","hedonic"], rationale: "Plausible spread to social, sexual, achievement-related reward. Case reports & 'Ozempic personality' phenomenology (Singh & Singh, 2024)." },
      { label: "HPA / aversive set-point shift",       weight: 0.38, conf: "speculative", mechs: ["hpa","amygdala"], rationale: "Chronic engagement of CeA/BNST aversive circuitry — therapeutically subclinical, individually variable." },
      { label: "Secondary to weight loss / body change", weight: 0.30, conf: "open",        mechs: ["mod"], rationale: "Confounder, not a mechanism — but a real source of phenomenology that the mapper must not absorb into 'drug effect'." },
      { label: "True anhedonia · liking damage",       weight: 0.14, conf: "speculative", mechs: ["hedonic"], rationale: "Mechanistically less likely — hedonic hotspots largely unaddressed by GLP-1R. But not ruled out, especially in susceptible subgroups." },
    ],
    caveats: [
      "Subgroup vulnerability is real but uncharacterised. Genetic GLP-1R variants, baseline reward sensitivity, titration speed — none formally examined as moderators.",
      "Population-level psychiatric signal is neutral-to-favourable; the subgroup story is not the population story.",
    ],
  },
};

function PhenomArtboard({ width = 1140, height = 760, mode = "atlas-light" }) {
  const [text, setText] = useStatePh(EXAMPLE_REPORTS[1]);
  const [lens, setLens] = useStatePh("phenomenology");

  const result = CANNED[text] || null;

  return (
    <div className={"atlas " + mode} style={{
      width, height,
      background: "var(--bg)",
      color: "var(--ink-1)",
      fontFamily: "var(--font-serif)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <ArtboardHead
        eyebrow="12 · Phenomenology mapper · sketch fidelity"
        title="From a half-articulated subjective report to structure to think with."
        oneSentence="The mapper does not return a diagnosis. It returns a probabilistic decomposition into candidate component mechanisms with confidences and brief rationales, each linked to the relevant mechanism module. Participation, not delegation."
        right={
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9.5,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--accent)", border: "0.5px dashed var(--accent-rule)",
            padding: "3px 6px", borderRadius: 2, background: "var(--accent-bg)",
          }}>↳ sketch · LLM-touched bits intentionally absent</span>
        }
      />

      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1.1fr 1.3fr",
        gap: 0, minHeight: 0,
      }}>
        {/* Left — input + example chips + "what this is not" */}
        <section style={{
          padding: "24px 32px",
          borderRight: "0.5px solid var(--rule)",
          display: "flex", flexDirection: "column", gap: 18, overflow: "auto",
        }}>
          <div>
            <Eyebrow>Report</Eyebrow>
            <div style={{
              marginTop: 8,
              padding: "14px 16px",
              background: "var(--bg-paper)",
              border: "0.5px solid var(--rule-strong)",
              borderRadius: 4,
            }}>
              <div style={{
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                lineHeight: 1.3,
                color: "var(--ink-1)",
                fontStyle: "italic",
                textWrap: "pretty",
              }}>&ldquo;{text}&rdquo;</div>
              <div style={{ marginTop: 8 }}>
                <span className="micro">tag selection · or freeform · or guided picker</span>
              </div>
            </div>
          </div>

          <div>
            <Eyebrow>Examples · click to load</Eyebrow>
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXAMPLE_REPORTS.map(r => {
                const has = !!CANNED[r];
                const active = r === text;
                return (
                  <button
                    key={r}
                    onClick={() => setText(r)}
                    disabled={!has}
                    title={has ? "load decomposition" : "decomposition not yet authored"}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 12.5,
                      padding: "4px 10px",
                      border: "0.5px solid " + (active ? "var(--ink-1)" : "var(--rule-strong)"),
                      background: active ? "var(--bg-paper)" : "transparent",
                      color: has ? "var(--ink-1)" : "var(--ink-3)",
                      borderRadius: 2,
                      cursor: has ? "pointer" : "not-allowed",
                      fontStyle: "italic",
                      textWrap: "pretty",
                      opacity: has ? 1 : 0.6,
                    }}
                  >&ldquo;{r}&rdquo;</button>
                );
              })}
            </div>
          </div>

          <div>
            <Eyebrow accent>What this is not</Eyebrow>
            <ul style={{
              margin: "8px 0 0 0", padding: "0 0 0 18px",
              fontFamily: "var(--font-serif)", fontSize: 12.5,
              lineHeight: 1.55, color: "var(--ink-2)", textWrap: "pretty",
            }}>
              <li>Not a chatbot. The mapper does not converse, advise, or speculate beyond curated mappings.</li>
              <li>Not a diagnosis. The decomposition is structural, not clinical.</li>
              <li>Not exhaustive. The list of components is curated; the open-question registry is the honest tail.</li>
              <li>Not stable. As evidence moves, the mappings move. <em>lastReviewed</em> rides on every component.</li>
            </ul>
          </div>

          <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "0.5px dashed var(--rule)" }}>
            <Eyebrow>Authoring surface · build-out</Eyebrow>
            <p className="margin-note" style={{ marginTop: 6 }}>
              v1: hand-curated mappings shipped as <code className="mono">phenomenology.json</code>.
              v2: structured LLM-assisted candidate surfacer feeding a steward-approval queue, never the reader directly.
            </p>
          </div>
        </section>

        {/* Right — decomposition */}
        <section style={{
          padding: "24px 32px",
          overflow: "auto",
          display: "flex", flexDirection: "column", gap: 18,
        }}>
          {result ? (
            <>
              <div>
                <Eyebrow>Component decomposition</Eyebrow>
                <p className="margin-note" style={{ margin: "4px 0 12px 0" }}>
                  Each row is a candidate component with weight (illustrative, not predictive), confidence,
                  rationale, and links to the mechanism modules where the substrate lives.
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {result.components.map((c, i) => (
                    <ComponentRow key={i} c={c} />
                  ))}
                </div>
              </div>

              <div>
                <Eyebrow accent>Caveats · always on screen</Eyebrow>
                <ul style={{
                  margin: "8px 0 0 0", padding: "0 0 0 18px",
                  fontFamily: "var(--font-serif)", fontSize: 12.5,
                  lineHeight: 1.55, color: "var(--ink-1)",
                  background: "var(--accent-bg)",
                  borderLeft: "1.5px solid var(--accent)",
                  borderRadius: 0,
                  paddingLeft: 22, paddingTop: 10, paddingBottom: 10, paddingRight: 14,
                }}>
                  {result.caveats.map((c, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
                  ))}
                </ul>
              </div>

              <div>
                <Eyebrow>Where to read next</Eyebrow>
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Array.from(new Set(result.components.flatMap(c => c.mechs))).map(m => (
                    <span key={m} className="chip" style={{ cursor: "pointer" }}>↗ {m.toUpperCase()}</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="margin-note">No decomposition authored for this report yet. Stewardship queue.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function ComponentRow({ c }) {
  return (
    <div style={{
      padding: "12px 14px",
      background: "var(--bg-paper)",
      border: "0.5px solid var(--rule)",
      borderRadius: 4,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "baseline" }}>
        <div style={{
          fontFamily: "var(--font-serif)", fontSize: 14.5, color: "var(--ink-1)",
          textWrap: "pretty",
        }}>{c.label}</div>
        <Confidence level={c.conf} />
      </div>
      <div style={{
        marginTop: 8,
        display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, alignItems: "center",
      }}>
        <div style={{ position: "relative", height: 6, background: "var(--bg-sunk)", borderRadius: 1 }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: (c.weight * 100) + "%",
            background: c.weight > 0.5 ? "var(--ink-1)" : c.conf === "open" ? "var(--ink-3)" : "var(--ink-2)",
          }} />
        </div>
        <div className="margin-note" style={{ fontSize: 11.5 }}>{c.rationale}</div>
      </div>
    </div>
  );
}

Object.assign(window, { PhenomArtboard });
