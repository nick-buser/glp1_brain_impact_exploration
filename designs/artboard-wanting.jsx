// artboard-wanting.jsx — Mesolimbic wanting & hedonic tone.
// The Berridge decomposition + Kooji-vs-canonical contradiction.

const { useState: useStateW } = React;

function WantingArtboard({ width = 1400, height = 900, mode = "atlas-light" }) {
  const [lens, setLens] = useStateW("uncertainty");

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
        eyebrow="04 · Mesolimbic wanting · Hedonic tone"
        title="Rebalancing, not blunting. Wanting falls; liking and effort remain mostly uncharted."
        oneSentence="The defensible synthesis is that GLP-1RAs reduce incentive salience for high-energy palatable rewards. The behavioural case is strong; the cellular case is more nuanced than 'dopamine goes down' — recent photometry warns the simple picture is wrong."
        stewardship={{ date: "2026-02-14", fresh: true }}
      />
      <LensSwitcher value={lens} onChange={setLens} />

      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto 1fr",
        gap: 0, minHeight: 0,
      }}>
        {/* Top-left: Berridge decomposition */}
        <section style={{
          padding: "24px 32px",
          borderRight: "0.5px solid var(--rule)",
          borderBottom: "0.5px solid var(--rule)",
        }}>
          <Eyebrow>Berridge decomposition</Eyebrow>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 400, margin: "4px 0 6px 0" }}>
            Reduced <em>wanting</em> ≠ damaged hedonic capacity.
          </h3>
          <p className="margin-note" style={{ fontSize: 12.5, margin: "0 0 14px 0" }}>
            Components are dissociable. Subjective &quot;food tastes flat&quot; is most likely reduced wanting and
            reduced motivational engagement, not loss of the orofacial liking response.
          </p>
          <BerridgeBars />
        </section>

        {/* Top-right: circuit + toy model */}
        <section style={{ padding: "24px 32px", borderBottom: "0.5px solid var(--rule)" }}>
          <Eyebrow>Circuit · VTA → NAc → VP → PFC</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: "2px 0 8px 0" }}>
            VTA expresses GLP-1R on a subset of TH<sup>+</sup> neurons; NAc shell and ventral pallidum contain
            <em> hedonic hotspots</em> (μ-opioid · anandamide) that mediate liking — modest GLP-1R there is
            mechanistically interesting.
          </p>
          <CircuitDiagram />
        </section>

        {/* Bottom-left: Kooji paired-claim */}
        <section style={{
          padding: "24px 32px",
          borderRight: "0.5px solid var(--rule)",
          minHeight: 0, overflow: "auto",
        }}>
          <Eyebrow accent>⇄ Kooji tension · contradiction as structure</Eyebrow>
          <p className="margin-note" style={{ fontSize: 12.5, margin: "4px 0 14px 0" }}>
            Two non-trivial findings. Neither is hidden in a footnote. Both carry full scope and provenance.
            The reconciliation is an <strong>open question</strong> on the page, not a hedge in the prose.
          </p>
          <PairedClaim
            left={{
              statement: "Peripheral exendin-4 and liraglutide reduce NAc dopamine elevations evoked by alcohol, nicotine, and cocaine; PR breakpoints fall; cue-elicited striatal activation falls in human fMRI.",
              confidence: "strong",
              scope: { species: "rat", route: "periph_tx", chronicity: "subacute", drug: "exendin-4", assay: "MICRODIAL" },
              papers: [{ cite: "Egecioglu / Jerlhag 2013–16" }, { cite: "Whittenburg sys rev 2026" }],
            }}
            right={{
              statement: "Semaglutide preserved or enhanced VTA dopamine during reward collection while reducing licks and rewards earned in Pavlovian sucrose conditioning.",
              confidence: "moderate",
              scope: { species: "mouse", route: "periph_tx", chronicity: "subacute", drug: "semaglutide", assay: "PHOTOMETRY" },
              papers: [{ cite: "Kooji 2024–25" }],
            }}
            label="canonical blunting · vs preserved-enhanced"
            note="Reconciliation candidates — none yet decisive: (a) temporal redistribution: anticipatory ↓, consummatory ↑; (b) cumulative consumption falls through brainstem aversive channels, not mesolimbic flattening; (c) pull-harder-for-the-remaining-reward in animals running out of food. A parallel preprint reports enhanced incentive value of small food rewards under chronic semaglutide — opposite to canonical. Open."
          />
        </section>

        {/* Bottom-right: phenomenology mapping + toy model + evidence margin */}
        <section style={{ padding: "24px 32px", minHeight: 0, overflow: "auto", display: "grid", gap: 20 }}>
          <div>
            <Eyebrow>Phenomenology mapping · from report to component</Eyebrow>
            <PhenomenologySnippet />
          </div>
          <ToyMotivationalModel />
          <div>
            <Eyebrow>Open questions</Eyebrow>
            <ul style={{
              fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.5,
              margin: "8px 0 0 0", padding: "0 0 0 18px", color: "var(--ink-2)",
            }}>
              <li>Does chronic exposure cause persistent recalibration of mesolimbic gain or RPE signalling?</li>
              <li>Effort-discounting under GLP-1RA — largely unstudied. Sucrose preference conflates appetite × hedonics.</li>
              <li>Does &quot;wanting↓&quot; spread to non-consummatory motivation (social, sexual, achievement)?</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Berridge bars — wanting / liking / learning / effort with confidence per

function BerridgeBars() {
  const rows = [
    {
      key: "wanting", label: "Wanting", direction: "↓",
      effect: 0.72,
      confidence: "strong",
      note: "Progressive-ratio breakpoint, cue-induced reinstatement, fMRI cue reactivity — all reduced.",
    },
    {
      key: "liking", label: "Liking", direction: "≈",
      effect: 0.12,
      confidence: "speculative",
      note: "No rodent demonstration of degraded orofacial liking response. μ-opioid / CB1 hotspots largely unprobed.",
    },
    {
      key: "learning", label: "Learning", direction: "?",
      effect: 0.0,
      confidence: "open",
      note: "Barely studied. RPE / learning-rate effects plausible given hippocampal & striatal changes — uncharacterised.",
    },
    {
      key: "effort", label: "Effort", direction: "?",
      effect: 0.0,
      confidence: "open",
      note: "Effort-discounting paradigms applied to GLP-1RAs essentially absent. The cleanest assay of motivational anhedonia — missing.",
    },
  ];

  return (
    <div style={{ display: "grid", gap: 0, marginTop: 12 }}>
      <div style={{
        display: "grid", gridTemplateColumns: "110px 1fr 1fr",
        gap: 16, alignItems: "center",
        padding: "6px 0 8px 0",
        borderBottom: "0.5px solid var(--rule-strong)",
      }}>
        <div className="micro">Component</div>
        <div className="micro">Direction of effect (under chronic peripheral therapeutic)</div>
        <div className="micro">Evidence</div>
      </div>
      {rows.map(r => (
        <div key={r.key} style={{
          display: "grid", gridTemplateColumns: "110px 1fr 1fr",
          gap: 16, alignItems: "start",
          padding: "12px 0",
          borderBottom: "0.5px solid var(--rule-soft)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{
                fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400,
              }}>{r.label}</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 18,
                color: r.direction === "↓" ? "var(--ink-1)" : r.direction === "≈" ? "var(--ink-2)" : "var(--accent)",
              }}>{r.direction}</span>
            </div>
            <div style={{ marginTop: 4 }}><Confidence level={r.confidence} /></div>
          </div>
          <div>
            <DirectionalBar effect={r.effect} confidence={r.confidence} direction={r.direction} />
          </div>
          <div className="margin-note" style={{ fontSize: 11.5, lineHeight: 1.5 }}>{r.note}</div>
        </div>
      ))}
    </div>
  );
}

function DirectionalBar({ effect, confidence, direction }) {
  // Horizontal bar from center; positive = reduce (left), unknown = ghost
  const w = 280, h = 22, mid = w / 2;
  const filled = effect * (w / 2 - 8);
  const isOpen = confidence === "open";

  return (
    <svg width={w} height={h + 18} style={{ display: "block" }}>
      {/* axis */}
      <line x1={4} y1={h / 2} x2={w - 4} y2={h / 2} stroke="var(--rule)" strokeWidth="0.5" />
      <line x1={mid} y1={2} x2={mid} y2={h - 2} stroke="var(--rule-strong)" strokeWidth="0.5" />
      {/* fill bar */}
      {!isOpen && filled > 0 && (
        <rect
          x={mid - filled} y={h / 2 - 5}
          width={filled} height={10}
          fill={confidence === "speculative" ? "var(--ink-3)" : "var(--ink-1)"}
        />
      )}
      {/* unknown region ghost */}
      {isOpen && (
        <rect
          x={mid - (w / 2 - 8)} y={h / 2 - 5}
          width={w - 16} height={10}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
      )}
      {/* axis labels */}
      <text x={4} y={h + 14} style={{
        fontFamily: "var(--font-mono)", fontSize: 8.5,
        letterSpacing: "0.06em", textTransform: "uppercase", fill: "var(--ink-3)",
      }}>← reduced</text>
      <text x={mid} y={h + 14} textAnchor="middle" style={{
        fontFamily: "var(--font-mono)", fontSize: 8.5,
        letterSpacing: "0.06em", textTransform: "uppercase", fill: "var(--ink-3)",
      }}>baseline</text>
      <text x={w - 4} y={h + 14} textAnchor="end" style={{
        fontFamily: "var(--font-mono)", fontSize: 8.5,
        letterSpacing: "0.06em", textTransform: "uppercase", fill: "var(--ink-3)",
      }}>increased →</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Circuit diagram — VTA → NAc → VP → PFC

function CircuitDiagram() {
  return (
    <svg width="100%" viewBox="0 0 460 220" style={{ marginTop: 8, maxHeight: 240 }}>
      <ArrowDefs />
      <rect x="2" y="2" width="456" height="216" fill="none" stroke="var(--rule-soft)" strokeWidth="0.5" />

      <AnatomyNode x={60} y={130} size={56} label="VTA" sub="GLP-1R · TH+" glyph="DA" />
      <AnatomyNode x={200} y={130} size={62} label="NAc" sub="shell · core" glyph="μ-OR" />
      <AnatomyNode x={340} y={110} size={52} label="VP" sub="hedonic hotspot" glyph="CB1" />
      <AnatomyNode x={400} y={50}  size={42} label="PFC" sub="top-down" />

      <Edge from={{ x: 88, y: 130 }}  to={{ x: 170, y: 130 }} confidence="strong" label="DA" />
      <Edge from={{ x: 230, y: 130 }} to={{ x: 314, y: 110 }} confidence="strong" />
      <Edge from={{ x: 340, y: 86 }}  to={{ x: 392, y: 64 }}  confidence="moderate" />
      <Edge from={{ x: 400, y: 70 }}  to={{ x: 230, y: 110 }} confidence="moderate" label="top-down" />

      {/* GLP-1R density legend */}
      <g transform="translate(20, 20)">
        <text style={{
          fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.08em",
          textTransform: "uppercase", fill: "var(--ink-3)",
        }}>GLP-1R · selective, sparse</text>
      </g>

      {/* Annotations */}
      <text x={200} y={196} textAnchor="middle" style={{
        fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 11,
        fill: "var(--ink-2)",
      }}>NAc shell + VP host the μ-opioid / CB1 hedonic hotspots — modest GLP-1R there is interesting.</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phenomenology mapper inline snippet — sketch only

function PhenomenologySnippet() {
  return (
    <div style={{
      marginTop: 8,
      border: "0.5px solid var(--rule)",
      borderRadius: 4,
      padding: 14,
      background: "var(--bg-paper)",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11.5,
        background: "var(--bg-sunk)",
        border: "0.5px solid var(--rule-soft)",
        padding: "6px 10px",
        borderRadius: 2,
        color: "var(--ink-1)",
      }}>
        <span className="micro" style={{ color: "var(--ink-3)", marginRight: 8 }}>Report</span>
        &quot;alcohol stopped calling to me&quot;
      </div>

      <div className="micro" style={{ margin: "12px 0 8px 0" }}>Component decomposition · candidate fits</div>
      <div style={{ display: "grid", gap: 6 }}>
        <PhenomFit label="Wanting↓ · cue-salience reduction" weight={0.78} note="Cross-reward mesolimbic gain reduction. Strong RCT support (SEMALCO 26w)." />
        <PhenomFit label="Aversive interoception" weight={0.52} note="CeA GABA arm; mild visceral malaise generalising to drink." />
        <PhenomFit label="Liking change" weight={0.18} note="Possible but uncharacterised. No rodent assay run." />
        <PhenomFit label="Mood / anhedonia" weight={0.12} note="Possible in subgroup; population-level signal neutral-to-favourable." />
      </div>
      <p className="margin-note" style={{ marginTop: 12 }}>
        Structure handed back, not an answer. The mapper does not pretend to know what the reader is experiencing —
        it makes their reasoning cheaper.
      </p>
    </div>
  );
}

function PhenomFit({ label, weight, note }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 80px 1fr", gap: 10, alignItems: "center" }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 12.5, color: "var(--ink-1)" }}>{label}</div>
      <div style={{ position: "relative", height: 8, background: "var(--bg-sunk)", borderRadius: 1 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: (weight * 100) + "%",
          background: weight > 0.5 ? "var(--ink-1)" : "var(--ink-3)",
        }} />
      </div>
      <div className="margin-note" style={{ fontSize: 11.5 }}>{note}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toy motivational model — clearly labelled

function ToyMotivationalModel() {
  return (
    <div style={{ position: "relative" }}>
      <Eyebrow>Toy motivational model</Eyebrow>
      <div style={{
        position: "absolute", top: 0, right: 0,
        fontFamily: "var(--font-mono)", fontSize: 9.5,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "var(--accent)", border: "0.5px solid var(--accent-rule)",
        padding: "2px 6px", borderRadius: 2, background: "var(--accent-bg)",
      }}>↳ toy · not predictive</div>
      <p className="margin-note" style={{ margin: "4px 0 8px 0", fontSize: 12 }}>
        A reader-facing intuition pump. The form is real (Berridge); the parameters are illustrative.
      </p>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 13,
        padding: 14,
        background: "var(--bg-paper)",
        border: "0.5px solid var(--rule)",
        borderRadius: 2,
        lineHeight: 1.6,
      }}>
        <div>
          <span style={{ color: "var(--ink-3)" }}>motivation</span>
          {" = "}
          <span style={{ color: "var(--ink-1)" }}>wanting</span>
          {" · "}
          <span style={{ color: "var(--ink-2)" }}>liking</span>
          {" − "}
          <span style={{ color: "var(--ink-2)" }}>effort</span>
          {" + "}
          <span style={{ color: "var(--ink-3)" }}>learning bias</span>
        </div>
        <div style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 11.5 }}>
          GLP-1RA pulls <span style={{ color: "var(--ink-1)" }}>wanting</span> down for high-energy palatable rewards.
          The other terms are mostly unknown; the equation is here to be argued with, not memorised.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WantingArtboard });
