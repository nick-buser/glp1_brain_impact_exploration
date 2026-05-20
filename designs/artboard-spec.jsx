// artboard-spec.jsx — visual language canon for the GLP-1 atlas.
// Lives in the design canvas as a hand-off doc to Claude Code.

const { useState: useStateSpec } = React;

function SpecArtboard({ width = 1280 }) {
  return (
    <div className="atlas atlas-light" style={{
      width,
      background: "var(--bg)",
      padding: "48px 72px 72px 72px",
      color: "var(--ink-1)",
      fontFamily: "var(--font-serif)",
    }}>
      <SpecMasthead />
      <SpecTypography />
      <SpecColor />
      <SpecLenses />
      <SpecConfidence />
      <SpecScope />
      <SpecComponents />
      <SpecAntiPatterns />
      <SpecFooter />
    </div>
  );
}

function SpecMasthead() {
  return (
    <div style={{ marginBottom: 64, borderBottom: "0.5px solid var(--rule-strong)", paddingBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="eyebrow">GLP-1 Brain Mechanism Atlas · Visual Language v0.1</div>
        <div className="micro">For hand-off · {new Date().toISOString().slice(0, 10)}</div>
      </div>
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: 56,
        fontWeight: 300,
        margin: "12px 0 0 0",
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        maxWidth: 900,
      }}>A workbench over a contested literature, not a review article.</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginTop: 28 }}>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, textWrap: "pretty" }}>
          The atlas exists to make a particular literature <em>cognitively inhabitable</em> — a substrate over which
          a sophisticated reader can navigate, interrogate, and update on the GLP-1 receptor agonist evidence. The
          dominant register is <strong>workbench</strong>; the orientation moments are <strong>atlas</strong>; the
          epistemic posture is <strong>field guide</strong>; the long-arc honesty cue is <strong>garden</strong>.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, textWrap: "pretty" }}>
          The design's central job: make <strong>lens-switching explicit</strong>, <strong>evidence interrogable</strong>,
          <strong> scope conditions visible</strong>, and <strong>contradictions first-class structure</strong>. Polish
          that signals settledness is actively misleading — the literature is not settled, and the atlas's job is to
          convey <em>honest unsettledness without losing aesthetic discipline</em>.
        </p>
      </div>
    </div>
  );
}

function SpecTypography() {
  return (
    <SpecSection
      eyebrow="01 · Typography"
      title="Editorial serif, technical sans, mono for chips"
      body="Source Serif 4 carries claim text and prose. IBM Plex Sans handles lens labels and UI. IBM Plex Mono is reserved for scope chips and evidence stamps — the bibliographic register."
    >
      <div style={{ display: "grid", gap: 20 }}>
        <TypeSpec label="Display · Source Serif 4 · 300/56" size={56} weight={300} family="serif" sample="A workbench, not a review article." />
        <TypeSpec label="Atlas head · Source Serif 4 · 400/28" size={28} weight={400} family="serif" sample="Mesolimbic wanting" />
        <TypeSpec label="Mechanism title · Source Serif 4 · 400/22" size={22} weight={400} family="serif" sample="PPG-NTS · the native central GLP-1 system" />
        <TypeSpec label="Claim · Source Serif 4 · 400/14.5" size={14.5} weight={400} family="serif" sample="Semaglutide reduces incentive salience for high-energy palatable rewards without robustly degrading the orofacial liking response." />
        <TypeSpec label="UI · IBM Plex Sans · 500/11 · 0.10em" size={11} weight={500} family="sans" sample="MECHANISTIC · ANATOMICAL · EVIDENCE · UNCERTAINTY" tracked />
        <TypeSpec label="Chip · IBM Plex Mono · 400/9.5 · 0.08em" size={9.5} weight={400} family="mono" sample="HUM · PERIPH·TX · CHRONIC · n=108 · SEMALCO 2026" tracked />
      </div>
    </SpecSection>
  );
}

function TypeSpec({ label, size, weight, family, sample, tracked }) {
  const fam = family === "serif" ? "var(--font-serif)" : family === "sans" ? "var(--font-sans)" : "var(--font-mono)";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "baseline", borderBottom: "0.5px solid var(--rule-soft)", paddingBottom: 16 }}>
      <div className="micro" style={{ color: "var(--ink-3)" }}>{label}</div>
      <div style={{
        fontFamily: fam,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: tracked ? "0.08em" : (size > 30 ? "-0.01em" : 0),
        textTransform: tracked ? "uppercase" : "none",
        lineHeight: 1.2,
        color: "var(--ink-1)",
        textWrap: "pretty",
      }}>{sample}</div>
    </div>
  );
}

function SpecColor() {
  const swatches = [
    { name: "bg",         light: "#f4f0e6", dark: "#15171b" },
    { name: "bg-paper",   light: "#faf6ec", dark: "#1a1d22" },
    { name: "ink-1",      light: "#1c1814", dark: "#ece6d8" },
    { name: "ink-2",      light: "#5a5247", dark: "#b1a99a" },
    { name: "ink-3",      light: "#8a8175", dark: "#7d7569" },
    { name: "rule",       light: "#d4ccb8", dark: "#2d3138" },
    { name: "accent",     light: "#9a3a18", dark: "#d68260" },
  ];
  return (
    <SpecSection
      eyebrow="02 · Color"
      title="Dual-mode, warm-paper / cool-ink"
      body="Light mode is warm paper-white; dark mode is a cool deep ink. Single accent (oxide sienna) reserved for contradiction edges, anchor states, and the rare attention call. Confidence is never carried by color alone."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <ColorMode mode="atlas-light" swatches={swatches} modeLabel="Light · paper" />
        <ColorMode mode="atlas-dark"  swatches={swatches} modeLabel="Dark · ink" />
      </div>
    </SpecSection>
  );
}

function ColorMode({ mode, swatches, modeLabel }) {
  return (
    <div className={"atlas " + mode} style={{
      background: "var(--bg)",
      border: "0.5px solid var(--rule)",
      borderRadius: 4,
      padding: 18,
    }}>
      <div className="eyebrow" style={{ marginBottom: 12, color: "var(--ink-3)" }}>{modeLabel}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {swatches.map(s => (
          <div key={s.name} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 8px",
            background: "var(--bg-paper)",
            border: "0.5px solid var(--rule-soft)",
            borderRadius: 2,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 2,
              background: `var(--${s.name})`,
              border: "0.5px solid var(--rule)",
            }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span className="micro" style={{ color: "var(--ink-2)" }}>{s.name}</span>
              <span className="micro" style={{ color: "var(--ink-3)", textTransform: "none", letterSpacing: 0 }}>
                {mode === "atlas-light" ? s.light : s.dark}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecLenses() {
  return (
    <SpecSection
      eyebrow="03 · Lens system"
      title="Six projections of the claim graph"
      body="Lenses are not tabs. They are pure functions from (graph, context) → projection. The same visualisation transforms — it is not replaced. Switching is cheap, keyboard 1–6, URL-shareable."
    >
      <div style={{ marginBottom: 18, border: "0.5px solid var(--rule)", borderRadius: 4, overflow: "hidden" }}>
        <LensSwitcher value="mechanistic" onChange={() => {}} />
      </div>
      <table className="data" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            <th style={{ width: 140 }}>Lens</th>
            <th style={{ width: 160 }}>Foregrounds</th>
            <th style={{ width: 160 }}>Dims</th>
            <th>When to reach for it</th>
          </tr>
        </thead>
        <tbody>
          <LensRow lens="Mechanistic" fg="Circuits, directions, neurotransmitter relations" dim="Confidence weighting" use="Default explanatory view — 'how does this work?'" />
          <LensRow lens="Anatomical"  fg="Regions, projections, receptor density" dim="Behavioural readouts" use="'Where in the brain?' — pairs with sagittal/coronal SVGs" />
          <LensRow lens="Evidence"    fg="Edge weights by replication; species/route badges" dim="Speculative edges, prose decoration" use="Auditing — 'what actually backs this arrow?'" />
          <LensRow lens="Uncertainty" fg="Contradictions, open questions, paired-claim nodes" dim="Settled edges (visible but muted)" use="'Where are the active fights?' — the field-guide lens" />
          <LensRow lens="Phenomenology" fg="Subjective-report mapping to component mechanisms" dim="Anatomical edges" use="From patient experience back to circuit" />
          <LensRow lens="Moderator" fg="Edges that flip with dose/route/chronicity/species" dim="Mode-independent edges" use="'Does this hold in chronic peripheral humans?'" />
        </tbody>
      </table>
    </SpecSection>
  );
}

function LensRow({ lens, fg, dim, use }) {
  return (
    <tr>
      <td style={{ fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>{lens}</td>
      <td>{fg}</td>
      <td style={{ color: "var(--ink-3)" }}>{dim}</td>
      <td style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-2)" }}>{use}</td>
    </tr>
  );
}

function SpecConfidence() {
  return (
    <SpecSection
      eyebrow="04 · Confidence vocabulary"
      title="Two channels: glyph and weight"
      body="Confidence rides on every claim. Bar-glyph on cards is learnable in two minutes; line weight on diagram edges carries the same signal without label clutter. Confidence and evidence-type are independent — a strong-rodent claim is not the same as a strong-human claim."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="panel" style={{ padding: 18 }}>
          <Eyebrow>Glyph · for claim cards</Eyebrow>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {Object.entries(CONF_LEVEL).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 140 }}><Confidence level={k} /></div>
                <div style={{ fontSize: 12.5, color: "var(--ink-2)", fontFamily: "var(--font-serif)" }}>
                  {confDesc(k)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel" style={{ padding: 18 }}>
          <Eyebrow>Edge weight · for graphs</Eyebrow>
          <svg width="100%" height="200" viewBox="0 0 360 200">
            <ArrowDefs />
            <EdgeSample y={28} confidence="strong" label="strong" />
            <EdgeSample y={64} confidence="moderate" label="moderate" />
            <EdgeSample y={100} confidence="speculative" label="speculative" />
            <EdgeSample y={136} confidence="contradicted" label="contradicted" contradiction />
            <EdgeSample y={172} confidence="open" label="open question" />
          </svg>
          <p className="margin-note" style={{ marginTop: 4 }}>
            Strong: solid 1.5px. Moderate: solid 1.0px. Speculative: dashed 0.6px. Contradicted: sienna, ⇄ marker. Open: dotted 0.6px, ◇ marker.
          </p>
        </div>
      </div>
    </SpecSection>
  );
}

function confDesc(k) {
  return ({
    strong: "Replicated across ≥2 high-quality designs incl. human; or one large RCT.",
    moderate: "Multiple converging preclinical + one human signal, or one well-powered human study.",
    speculative: "Mechanistically plausible; preclinical only or single observational signal.",
    contradicted: "Two non-trivial findings in active tension. Renders as paired-claim node.",
    open: "First-class open question — surfaced on relevant pages, aggregated globally.",
  })[k];
}

function EdgeSample({ y, confidence, label, contradiction }) {
  return (
    <g>
      <Edge from={{ x: 24, y }} to={{ x: 240, y }} confidence={confidence} contradiction={contradiction} />
      <text x={252} y={y + 3} style={{
        fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase",
        fill: contradiction ? "var(--accent)" : "var(--ink-2)",
      }}>{label}</text>
    </g>
  );
}

function SpecScope() {
  return (
    <SpecSection
      eyebrow="05 · Scope vocabulary"
      title="Species · route · chronicity, always visible"
      body="Rodent central acute and human peripheral chronic must look visibly different. The single most important anti-hype protection in the system. Translation-fragile chips carry the accent; clinical-register chips weight darker."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="panel" style={{ padding: 18 }}>
          <Eyebrow>Default (rodent, peripheral, chronic)</Eyebrow>
          <div style={{ marginTop: 14 }}>
            <ScopeChips species="rat" route="periph_tx" chronicity="chronic" drug="liraglutide" assay="PR" n={24} />
          </div>
          <p className="margin-note" style={{ marginTop: 14 }}>
            Hairline mono chips. No alarm — this is the typical preclinical translation register.
          </p>
        </div>
        <div className="panel" style={{ padding: 18, background: "var(--accent-bg)", borderColor: "var(--accent-rule)" }}>
          <Eyebrow accent>Translation-fragile · rodent · central · acute</Eyebrow>
          <div style={{ marginTop: 14 }}>
            <ScopeChips species="rat" route="icv" chronicity="acute" drug="exendin-4" assay="EPM" n={12} />
          </div>
          <p className="margin-note" style={{ marginTop: 14, fontStyle: "normal" }}>
            <strong>Always</strong> sienna-tinted. Acute ICV exendin-4 in lean male rats is <em>not</em> chronic peripheral semaglutide in obese humans — the chip itself refuses the elision.
          </p>
        </div>
        <div className="panel" style={{ padding: 18 }}>
          <Eyebrow>Clinical translation · human · chronic · peripheral therapeutic</Eyebrow>
          <div style={{ marginTop: 14 }}>
            <ScopeChips species="human" route="periph_tx" chronicity="chronic" drug="semaglutide" assay="RCT" n={108} />
          </div>
          <p className="margin-note" style={{ marginTop: 14 }}>
            Slightly weightier ink — flags the register a clinician or patient cares about most.
          </p>
        </div>
        <div className="panel" style={{ padding: 18 }}>
          <Eyebrow>Inline scope strip</Eyebrow>
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            <ScopeChips species="human" route="periph_tx" chronicity="chronic" drug="liraglutide" assay="fMRI" n={32} compact />
            <ScopeChips species="rat"   route="parenchymal" chronicity="acute" drug="GLP-1(7-36)" />
            <ScopeChips species="mouse" route="periph_tx" chronicity="subacute" drug="semaglutide" assay="PHOTOMETRY" />
            <ScopeChips species="nhp"   route="periph_tx" chronicity="chronic" drug="liraglutide" />
            <ScopeChips species="cell"  route="ex_vivo" chronicity="acute" drug="exendin-4" />
          </div>
        </div>
      </div>
    </SpecSection>
  );
}

function SpecComponents() {
  const claimStrong = {
    statement: "Semaglutide reduces alcohol consumption, craving, and laboratory self-administration in adults with AUD over 26 weeks.",
    confidence: "strong",
    scope: { species: "human", route: "periph_tx", chronicity: "chronic", drug: "semaglutide", assay: "RCT", n: 108 },
    papers: [
      { cite: "Klausen / SEMALCO · Lancet 2026", year: 2026 },
      { cite: "Hendershot · JAMA Psych 2025" },
    ],
  };
  const claimSpec = {
    statement: "GLP-1RA reduces gambling and compulsive shopping behaviours via shared incentive-salience circuitry.",
    confidence: "speculative",
    scope: { species: "human", route: "periph_tx", chronicity: "chronic", drug: "semaglutide", assay: "EHR", n: null },
    papers: [{ cite: "case reports & clinician anecdote" }],
  };

  const koojiL = {
    statement: "Peripheral exendin-4 and liraglutide reduce NAc dopamine elevations evoked by alcohol, nicotine, and cocaine.",
    confidence: "strong",
    scope: { species: "rat", route: "periph_tx", chronicity: "subacute", drug: "exendin-4", assay: "MICRODIAL" },
    papers: [
      { cite: "Egecioglu / Jerlhag 2013–2016" },
      { cite: "Sørensen 2015" },
    ],
  };
  const koojiR = {
    statement: "Semaglutide preserved or enhanced VTA dopamine during reward collection while reducing licks and rewards earned in Pavlovian sucrose conditioning.",
    confidence: "moderate",
    scope: { species: "mouse", route: "periph_tx", chronicity: "subacute", drug: "semaglutide", assay: "PHOTOMETRY" },
    papers: [{ cite: "Kooji et al. 2024–25" }],
  };

  return (
    <SpecSection
      eyebrow="06 · Components"
      title="Claim card, paired-claim, evidence chips"
      body="A claim card is the atomic unit. Confidence and scope sit at the meta line; provenance is one click away. The paired-claim node renders contradictions as structure, not as prose hedging."
    >
      <div style={{ display: "grid", gap: 28 }}>
        <div>
          <Eyebrow>Claim card · strong + speculative</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
            <ClaimCard claim={claimStrong} />
            <ClaimCard claim={claimSpec} />
          </div>
        </div>
        <div>
          <Eyebrow>Paired-claim · the Kooji vs canonical tension</Eyebrow>
          <p className="margin-note" style={{ margin: "8px 0 12px 0" }}>
            Two cards visibly joined by a TENSION bridge. Neither is hidden in a footnote.
            Each carries its own confidence and provenance.
          </p>
          <PairedClaim
            left={koojiL}
            right={koojiR}
            label="dopamine blunting · vs preserved-enhanced"
            note="Reconciliation candidates: temporal redistribution of dopamine signal (anticipatory ↓, consummatory ↑); paradigm-specific; cumulative consumption falls through brainstem aversive channels rather than mesolimbic flattening. Open."
          />
        </div>
        <div>
          <Eyebrow>Stewardship pip · garden cue</Eyebrow>
          <div style={{ display: "flex", gap: 24, marginTop: 12, alignItems: "center" }}>
            <StewardshipPip date="2026-04-12" fresh />
            <StewardshipPip date="2025-11-28" />
            <StewardshipPip date="2024-03-15" />
            <span className="margin-note">Newly planted (sienna pip) · reviewed · stale (no pip on hairline)</span>
          </div>
        </div>
      </div>
    </SpecSection>
  );
}

function SpecAntiPatterns() {
  const items = [
    ["Dashboard slip", "Tiles, charts, summary stats. Reader skims. Atlas optimises for engaged minutes, not at-a-glance."],
    ["Polish-as-authority", "Magazine-resolved aesthetic signals settledness the field doesn't have."],
    ["Generic AI chat bubble", "Phenomenology mapper is the structured AI surface. No free-form chat."],
    ["Hedge-as-disclaimer", "“Note: results vary by species.” → scope chips on the claim, not footnotes."],
    ["Everything-is-a-graph", "Wanting/liking/learning/effort is bars. Translation ladder is a stack. PPG-NTS is a dial."],
    ["Dopamine-down surrender", "Berridge decomposition is the default frame on any reward surface."],
    ["Emoji confidence markers", "The atlas is sophisticated, not playful."],
    ["Gamification", "No streaks, no badges. Especially gross given the subject matter."],
  ];
  return (
    <SpecSection
      eyebrow="07 · Anti-patterns"
      title="Moves the design refuses"
      body="A short list of failures to recognise on sight. If the design starts drifting toward any of these, we have stopped building a workbench and started building something else."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {items.map(([h, d]) => (
          <div key={h} style={{
            padding: "10px 14px",
            borderLeft: "1.5px solid var(--accent)",
            background: "var(--accent-bg)",
          }}>
            <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 4 }}>✗ {h}</div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-2)", fontFamily: "var(--font-serif)", textWrap: "pretty" }}>{d}</div>
          </div>
        ))}
      </div>
    </SpecSection>
  );
}

function SpecFooter() {
  return (
    <div style={{
      borderTop: "0.5px solid var(--rule-strong)",
      paddingTop: 24,
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 32,
    }}>
      <div>
        <Eyebrow>Single sharpest test</Eyebrow>
        <p className="margin-note" style={{ marginTop: 8, color: "var(--ink-2)", fontStyle: "normal" }}>
          A thoughtful reader three sessions in describes the atlas as a thing they trust more than the average
          review article and less than a finished textbook — and feels that calibration is exactly right.
        </p>
      </div>
      <div>
        <Eyebrow>Failure mode</Eyebrow>
        <p className="margin-note" style={{ marginTop: 8, color: "var(--ink-2)", fontStyle: "normal" }}>
          A reader skims a pretty review article, learns nothing they could not have learned from a podcast,
          and never returns.
        </p>
      </div>
      <div>
        <Eyebrow>Success mode</Eyebrow>
        <p className="margin-note" style={{ marginTop: 8, color: "var(--ink-2)", fontStyle: "normal" }}>
          A substrate the reader returns to as new evidence accumulates; the lens-switching habit installed;
          pop-science misinterpretations become <em>recognisably</em> wrong.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { SpecArtboard });
