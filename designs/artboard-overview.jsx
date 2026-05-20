// artboard-overview.jsx — Overview Atlas. The map-room landing.
// Live lens switcher transforms the same graph rather than replacing it.

const { useState: useStateOv, useMemo: useMemoOv } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Atlas graph — nodes & edges, with lens behaviours baked in via 'roles'.

const ATLAS_NODES = [
  // Periphery
  { id: "drug",   label: "Semaglutide", sub: "peripheral · chronic", x: 80,   y: 450, kind: "drug",     size: 70 },
  { id: "gut",    label: "Gut L-cells", sub: "endogenous", x: 80,   y: 620, kind: "endogenous", size: 56 },

  // BBB access
  { id: "cvo",    label: "AP / ME",     sub: "circumventricular", x: 230, y: 360, kind: "access", size: 56 },
  { id: "tan",    label: "Tanycytes",   sub: "3V lining", x: 230, y: 450, kind: "access", size: 50 },
  { id: "vag",    label: "Vagus",       sub: "afferents", x: 230, y: 560, kind: "access", size: 50 },
  { id: "trans",  label: "Transcytosis",sub: "adsorptive · slow", x: 230, y: 660, kind: "access", size: 48 },

  // Brainstem & hypothalamus
  { id: "nts",    label: "NTS",         sub: "PPG · A2/C2", x: 410, y: 460, kind: "region", size: 64 },
  { id: "arc",    label: "ARC",         sub: "POMC / AgRP", x: 410, y: 310, kind: "region", size: 50 },
  { id: "pvn",    label: "PVN",         sub: "CRH · stress", x: 580, y: 360, kind: "region", size: 56 },

  // Limbic / mesolimbic
  { id: "vta",    label: "VTA",         sub: "dopamine", x: 750, y: 470, kind: "region", size: 58 },
  { id: "nac",    label: "NAc",         sub: "shell · core", x: 900, y: 430, kind: "region", size: 58 },
  { id: "vp",     label: "VP",          sub: "hedonic hotspot", x: 1040, y: 400, kind: "region", size: 50 },
  { id: "cea",    label: "CeA",         sub: "GABA · aversive", x: 750, y: 620, kind: "region", size: 56 },
  { id: "bnst",   label: "BNST",        sub: "sustained negative affect", x: 900, y: 600, kind: "region", size: 46 },

  // Cognition / cortex
  { id: "hipp",   label: "Hippocampus", sub: "plasticity · BDNF", x: 900, y: 240, kind: "region", size: 50 },
  { id: "dls",    label: "dlSeptum",    sub: "→ LHA", x: 750, y: 240, kind: "region", size: 46 },
  { id: "pfc",    label: "PFC",         sub: "top-down", x: 1040, y: 240, kind: "region", size: 46 },

  // Mechanism module endpoints (these are 'outcome' / experiential labels)
  { id: "out_appetite",  label: "Appetite ↓",  x: 1200, y: 310, kind: "outcome" },
  { id: "out_wanting",   label: "Wanting ↓",   x: 1220, y: 430, kind: "outcome", contradiction: true },
  { id: "out_cross",     label: "Cross-reward ↓", x: 1220, y: 540, kind: "outcome" },
  { id: "out_anx",       label: "Anxiety / HPA", x: 1220, y: 640, kind: "outcome", bidirectional: true },
  { id: "out_cog",       label: "Cognition · AD", x: 1200, y: 175, kind: "outcome", contradiction: true },
];

// Edges — every one backed by claim(s) in the imagined data layer.
const ATLAS_EDGES = [
  { from: "drug", to: "cvo",  confidence: "strong" },
  { from: "drug", to: "tan",  confidence: "moderate" },
  { from: "drug", to: "trans", confidence: "moderate", contextNote: "hours timescale" },
  { from: "drug", to: "vag",   confidence: "moderate", dashed: true, contextNote: "indirect · partial" },
  { from: "gut",  to: "vag",   confidence: "strong" },

  { from: "cvo",  to: "nts", confidence: "strong" },
  { from: "cvo",  to: "arc", confidence: "strong" },
  { from: "tan",  to: "arc", confidence: "moderate" },
  { from: "vag",  to: "nts", confidence: "strong" },

  { from: "nts",  to: "pvn", confidence: "strong", label: "PPG" },
  { from: "nts",  to: "cea", confidence: "moderate" },
  { from: "nts",  to: "vta", confidence: "moderate", dashed: true, contextNote: "indirect" },
  { from: "arc",  to: "pvn", confidence: "strong" },

  { from: "pvn",  to: "out_anx", confidence: "moderate", label: "HPA only" },

  { from: "vta",  to: "nac", confidence: "strong", label: "DA" },
  { from: "nac",  to: "vp",  confidence: "strong" },
  { from: "vta",  to: "out_wanting", confidence: "moderate", contradiction: true },
  { from: "nac",  to: "out_wanting", confidence: "strong" },
  { from: "vp",   to: "out_wanting", confidence: "speculative" },
  { from: "nac",  to: "out_cross",   confidence: "strong" },
  { from: "cea",  to: "out_cross",   confidence: "moderate", label: "GABA" },

  { from: "cea",  to: "bnst", confidence: "moderate" },
  { from: "cea",  to: "out_anx", confidence: "moderate", contextNote: "acute · central" },
  { from: "bnst", to: "out_anx", confidence: "moderate" },

  { from: "arc",  to: "out_appetite", confidence: "strong" },
  { from: "nts",  to: "out_appetite", confidence: "strong" },

  { from: "dls",  to: "out_appetite", confidence: "moderate", dashed: true },

  { from: "hipp", to: "out_cog", confidence: "speculative", contradiction: true, contextNote: "EVOKE failed" },
  { from: "pfc",  to: "out_cog", confidence: "speculative" },
];

const MECHANISM_MODULES = [
  { id: "overview",     n: "00", label: "Overview Atlas",           state: "active" },
  { id: "access",       n: "01", label: "Brain access · relay",     state: "" },
  { id: "ppg_nts",      n: "02", label: "PPG-NTS · native system",  state: "primary" },
  { id: "appetite",     n: "03", label: "Appetite · meal end",      state: "" },
  { id: "wanting",      n: "04", label: "Mesolimbic wanting",       state: "primary" },
  { id: "cross",        n: "05", label: "Cross-reward craving",     state: "" },
  { id: "amygdala",     n: "06", label: "Amygdala · GABA · aversive", state: "" },
  { id: "hpa",          n: "07", label: "HPA · stress · anxiety",   state: "" },
  { id: "hedonic",      n: "08", label: "Hedonic tone · Berridge",  state: "" },
  { id: "cog",          n: "09", label: "Neuroimmune · cognition",  state: "open" },
  { id: "mod",          n: "10", label: "Moderator dashboard",      state: "" },
  { id: "evidence",     n: "11", label: "Evidence workbench",       state: "" },
  { id: "phenom",       n: "12", label: "Phenomenology mapper",     state: "primary" },
];

// ─────────────────────────────────────────────────────────────────────────────

function OverviewArtboard({ width = 1400, height = 900, mode = "atlas-light" }) {
  const [lens, setLens] = useStateOv("mechanistic");
  const [selected, setSelected] = useStateOv(null); // node id

  const nodeMap = useMemoOv(() => Object.fromEntries(ATLAS_NODES.map(n => [n.id, n])), []);
  const sel = selected ? ATLAS_NODES.find(n => n.id === selected) : null;

  return (
    <div className={"atlas " + mode} style={{
      width, height,
      display: "grid",
      gridTemplateColumns: "200px 1fr 280px",
      gridTemplateRows: "auto 1fr auto",
      background: "var(--bg)",
      color: "var(--ink-1)",
      fontFamily: "var(--font-serif)",
      overflow: "hidden",
    }}>
      {/* Header row spans all */}
      <div style={{ gridColumn: "1 / -1" }}>
        <OverviewHead />
        <LensSwitcher value={lens} onChange={setLens} />
      </div>

      {/* Left rail — module navigation */}
      <ModuleRail modules={MECHANISM_MODULES} />

      {/* Center — the atlas */}
      <main style={{
        position: "relative",
        borderLeft: "0.5px solid var(--rule)",
        borderRight: "0.5px solid var(--rule)",
        background: "var(--bg-paper)",
      }}>
        <AtlasGraph
          lens={lens}
          selected={selected}
          onSelect={setSelected}
        />
      </main>

      {/* Right rail — provenance / evidence */}
      <ProvenancePanel selected={sel} lens={lens} />

      {/* Footer strip */}
      <div style={{ gridColumn: "1 / -1" }}>
        <StewardshipStrip />
      </div>
    </div>
  );
}

function OverviewHead() {
  return (
    <div style={{ padding: "18px 28px 14px 28px", borderBottom: "0.5px solid var(--rule)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24 }}>
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <Eyebrow>GLP-1 Brain Mechanism Atlas · Overview</Eyebrow>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: 30,
            fontWeight: 300,
            margin: "4px 0 0 0",
            letterSpacing: "-0.015em",
            lineHeight: 1.1,
          }}>
            The territory, at a glance.
          </h1>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="micro" style={{ marginBottom: 6 }}>v0.1 · 12 mechanism modules · 184 claims · 71 papers</div>
          <StewardshipPip date="2026-04-12" fresh />
        </div>
      </div>
      <p style={{
        fontFamily: "var(--font-serif)",
        fontSize: 14,
        lineHeight: 1.5,
        color: "var(--ink-2)",
        margin: "12px 0 0 0",
        maxWidth: 920,
        textWrap: "pretty",
      }}>
        A chronic, peripheral, pharmacological agonist of a normally phasic, aversive interoceptive system.
        Brain access is sparse and circumferential, not parenchymal. Effect on motivation is best described as
        <em> rebalancing</em>, not blunting. <span style={{ color: "var(--accent)" }}>Switch lenses to re-project the same graph</span> —
        the structure does not change, the weighting and emphasis do.
      </p>
    </div>
  );
}

function ModuleRail({ modules }) {
  return (
    <nav style={{ padding: "16px 4px 16px 20px", overflow: "auto" }}>
      <Eyebrow>Mechanism modules</Eyebrow>
      <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0, display: "grid", gap: 0 }}>
        {modules.map(m => (
          <li key={m.id} style={{
            padding: "8px 10px 8px 0",
            display: "grid",
            gridTemplateColumns: "22px 1fr auto",
            gap: 8,
            alignItems: "center",
            borderBottom: "0.5px solid var(--rule-soft)",
            cursor: "pointer",
            color: m.state === "active" ? "var(--ink-1)" : "var(--ink-2)",
          }}>
            <span className="micro" style={{ color: "var(--ink-3)" }}>{m.n}</span>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: 13,
              lineHeight: 1.3,
              fontWeight: m.state === "active" ? 500 : 400,
            }}>{m.label}</span>
            {m.state === "primary" && <span className="micro" style={{ color: "var(--accent)" }}>●</span>}
            {m.state === "open" && <span className="micro" style={{ color: "var(--ink-3)" }}>◇</span>}
          </li>
        ))}
      </ul>
      <div className="margin-note" style={{ marginTop: 14, fontSize: 11.5 }}>
        <span style={{ color: "var(--accent)" }}>●</span> primary slice ·
        <span style={{ color: "var(--ink-3)" }}> ◇</span> open frontier
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Atlas graph — the visualisation that lenses transform

function AtlasGraph({ lens, selected, onSelect }) {
  // Lens behaviour table — controls per-node and per-edge dim/emphasis
  const showOutcome = lens !== "anatomical";
  const showAnatomy = lens !== "phenomenology";

  // dim function for edges
  const edgeStyle = (e) => {
    const base = { dim: false, contradiction: e.contradiction };
    switch (lens) {
      case "anatomical":
        // dim outcome edges
        if (e.from.startsWith("out_") || e.to.startsWith("out_")) base.dim = true;
        break;
      case "evidence":
        // dim speculative/open dramatically
        if (e.confidence === "speculative" || e.confidence === "open") base.dim = true;
        break;
      case "uncertainty":
        // foreground contradictions/open; dim settled
        if (!e.contradiction && e.confidence === "strong") base.dim = true;
        break;
      case "phenomenology":
        // foreground outcome-touching; dim anatomy interior
        if (!(e.from.startsWith("out_") || e.to.startsWith("out_"))) base.dim = true;
        break;
      case "moderator":
        // foreground edges with contextNote (those flip with route/chronicity)
        if (!e.contextNote) base.dim = true;
        break;
    }
    return base;
  };

  const nodeStyle = (n) => {
    const base = { dim: false, accent: false };
    switch (lens) {
      case "anatomical":
        if (n.kind === "outcome") base.dim = true;
        break;
      case "evidence":
        // mild
        break;
      case "uncertainty":
        if (n.contradiction) base.accent = true;
        else if (n.kind === "outcome" && !n.bidirectional) base.dim = true;
        break;
      case "phenomenology":
        if (n.kind === "outcome") base.accent = true;
        else if (n.kind === "region") base.dim = true;
        break;
      case "moderator":
        // emphasize CeA, PVN, drug, vagus — moderator-sensitive
        if (["cea","pvn","drug","vag","trans"].includes(n.id)) base.accent = true;
        else if (n.kind === "outcome") base.dim = true;
        break;
    }
    if (selected && selected !== n.id) base.dim = base.dim || false;
    return base;
  };

  // BBB diaphragm — a sketchy vertical band between access layer and brain
  // Show only on anatomical lens
  const showBBB = lens === "anatomical" || lens === "mechanistic";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1380 720" style={{ display: "block" }}>
      <ArrowDefs />
      {/* faint background grid */}
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--rule-soft)" strokeWidth="0.25" />
        </pattern>
        <pattern id="bbb" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--rule-strong)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="1380" height="720" fill="url(#grid)" opacity="0.45" />

      {/* Lane labels */}
      <LaneLabel x={80}  y={64} text="Periphery" />
      <LaneLabel x={230} y={64} text="Access" />
      <LaneLabel x={410} y={64} text="Brainstem · hypothalamus" wide />
      <LaneLabel x={750} y={64} text="Limbic · mesolimbic" wide />
      <LaneLabel x={1040} y={64} text="Cortex" />
      <LaneLabel x={1220} y={64} text="Outcome · phenomenology" wide />

      {/* BBB diaphragm */}
      {showBBB && (
        <g opacity={lens === "anatomical" ? 0.8 : 0.4}>
          <rect x="305" y="100" width="18" height="600" fill="url(#bbb)" />
          <text x="314" y="108" textAnchor="middle" style={{
            fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.1em",
            textTransform: "uppercase", fill: "var(--ink-3)",
          }}>BBB</text>
        </g>
      )}

      {/* Edges first so they sit behind nodes */}
      {ATLAS_EDGES.map((e, i) => {
        const f = ATLAS_NODES.find(n => n.id === e.from);
        const t = ATLAS_NODES.find(n => n.id === e.to);
        if (!f || !t) return null;
        const st = edgeStyle(e);
        return (
          <Edge
            key={i}
            from={{ x: f.x, y: f.y }}
            to={{ x: t.x, y: t.y }}
            confidence={e.confidence}
            dashed={e.dashed}
            label={lens === "mechanistic" || lens === "moderator" ? e.label : null}
            contextNote={lens === "moderator" ? e.contextNote : null}
            contradiction={st.contradiction}
            dim={st.dim}
          />
        );
      })}

      {/* Nodes */}
      {ATLAS_NODES.map(n => {
        const st = nodeStyle(n);
        const isOut = n.kind === "outcome";
        if (isOut) {
          return (
            <OutcomeNode
              key={n.id}
              {...n}
              selected={selected === n.id}
              accent={st.accent}
              dim={st.dim}
              onClick={() => onSelect(selected === n.id ? null : n.id)}
            />
          );
        }
        return (
          <AnatomyNode
            key={n.id}
            x={n.x} y={n.y}
            label={n.label}
            sub={n.sub}
            size={n.size || 56}
            selected={selected === n.id}
            accent={st.accent || n.contradiction || n.bidirectional}
            dim={st.dim}
            onClick={() => onSelect(selected === n.id ? null : n.id)}
          />
        );
      })}

      {/* Lens-specific legend overlay */}
      <LensLegend lens={lens} />
    </svg>
  );
}

function LaneLabel({ x, y, text, wide }) {
  return (
    <text
      x={x} y={y}
      textAnchor={wide ? "start" : "middle"}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9.5,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fill: "var(--ink-3)",
      }}
    >{text}</text>
  );
}

function OutcomeNode({ id, x, y, label, contradiction, bidirectional, selected, dim, accent, onClick }) {
  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: "pointer", opacity: dim ? 0.3 : 1 }}
      onClick={onClick}
    >
      <rect
        x={-70} y={-14}
        width={140} height={28}
        rx={2}
        fill="var(--bg-paper)"
        stroke={contradiction || accent ? "var(--accent)" : selected ? "var(--ink-1)" : "var(--rule-strong)"}
        strokeWidth={selected ? 1.5 : contradiction || accent ? 1 : 0.5}
        strokeDasharray={bidirectional ? "3 2" : undefined}
      />
      <text
        x={0} y={4}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 12.5,
          fill: contradiction ? "var(--accent)" : "var(--ink-1)",
        }}
      >{label}</text>
      {contradiction && (
        <text x={64} y={-2} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fill: "var(--accent)" }}>⇄</text>
      )}
      {bidirectional && (
        <text x={64} y={-2} style={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--accent)" }}>↕</text>
      )}
    </g>
  );
}

function LensLegend({ lens }) {
  const text = {
    mechanistic: "All edges shown. Direction and relation labels emphasised.",
    anatomical:  "Outcome and phenomenology nodes dimmed; BBB diaphragm foregrounded.",
    evidence:    "Edges weighted by replication. Speculative & open dim.",
    uncertainty: "Contradictions and open questions in sienna; settled edges dim. ⇄ paired-claim available on hover.",
    phenomenology: "Outcome and experience nodes accentuated; deep anatomy dim.",
    moderator:   "Edges flipping with dose/route/chronicity foregrounded; others dim. Context labels show the modifier.",
  };
  return (
    <g transform="translate(28, 670)">
      <text style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9.5,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fill: "var(--ink-3)",
      }}>Lens projection</text>
      <text y={16} style={{
        fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 12.5, fill: "var(--ink-2)",
      }}>{text[lens]}</text>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Provenance panel — right rail

function ProvenancePanel({ selected, lens }) {
  if (!selected) {
    return (
      <aside style={{
        padding: "16px 20px",
        borderLeft: "0.5px solid var(--rule)",
        background: "var(--bg)",
        overflow: "auto",
      }}>
        <Eyebrow>No selection</Eyebrow>
        <p style={{
          fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)",
          margin: "12px 0", textWrap: "pretty",
        }}>
          Click any node to surface its claim list, confidence-grouped, with provenance.
          The right rail follows the selection across lens changes.
        </p>
        <hr className="hr" />
        <div style={{ marginTop: 16 }}>
          <Eyebrow>Recently updated</Eyebrow>
          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0 0", display: "grid", gap: 10 }}>
            {[
              { date: "2026-04-12", t: "EVOKE / EVOKE+ negative", l: "Neuroimmune · cognition", fresh: true },
              { date: "2026-03-30", t: "SEMALCO 26w · Klausen", l: "Cross-reward · alcohol", fresh: true },
              { date: "2026-02-14", t: "Kooji photometry replication", l: "Mesolimbic wanting", fresh: false },
              { date: "2025-12-08", t: "Hendershot · JAMA Psych", l: "Cross-reward · alcohol", fresh: false },
            ].map((r, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 8, fontFamily: "var(--font-serif)", fontSize: 12.5 }}>
                <span className="micro" style={{ color: r.fresh ? "var(--accent)" : "var(--ink-3)", paddingTop: 2 }}>
                  {r.fresh ? "●" : "○"}
                </span>
                <div>
                  <div style={{ color: "var(--ink-1)" }}>{r.t}</div>
                  <div className="micro" style={{ color: "var(--ink-3)" }}>{r.l} · {r.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    );
  }

  // Selected — show context for that node.
  const claims = selectedClaimsFor(selected);
  return (
    <aside style={{
      padding: "16px 20px",
      borderLeft: "0.5px solid var(--rule)",
      background: "var(--bg)",
      overflow: "auto",
    }}>
      <Eyebrow>{selected.kind === "outcome" ? "Outcome" : selected.kind === "region" ? "Region" : selected.kind === "access" ? "Access layer" : "Periphery"}</Eyebrow>
      <h3 style={{
        fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 400,
        margin: "4px 0 4px 0", letterSpacing: "-0.005em",
      }}>{selected.label}</h3>
      {selected.sub && <div className="micro" style={{ color: "var(--ink-3)", marginBottom: 12 }}>{selected.sub}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        {claims.map((c, i) => <ClaimCard key={i} claim={c} />)}
      </div>

      <hr className="hr" style={{ margin: "16px 0 12px 0" }} />
      <div className="margin-note">
        Lens currently set to <strong>{lens}</strong> — claim ordering and emphasis follow the lens.
      </div>
    </aside>
  );
}

function selectedClaimsFor(node) {
  // Tiny canned table for a few interesting nodes; falls back to a generic.
  if (node.id === "out_wanting") {
    return [
      {
        statement: "GLP-1RA reduces progressive-ratio breakpoints and cue-induced striatal activation for palatable food and alcohol.",
        confidence: "strong",
        scope: { species: "human", route: "periph_tx", chronicity: "chronic", drug: "semaglutide", assay: "fMRI" },
        papers: [{ cite: "Whittenburg syst rev 2026" }, { cite: "Hendershot 2025" }],
      },
      {
        statement: "Kooji photometry shows preserved/enhanced consummatory VTA DA under semaglutide, complicating 'dopamine down'.",
        confidence: "contradicted",
        scope: { species: "mouse", route: "periph_tx", chronicity: "subacute", drug: "semaglutide", assay: "PHOTOMETRY" },
        papers: [{ cite: "Kooji 2024–25" }],
      },
    ];
  }
  if (node.id === "vta") {
    return [
      {
        statement: "VTA expresses GLP-1R on a subset of TH+ neurons; local exendin-4 microinjection reduces palatable intake.",
        confidence: "moderate",
        scope: { species: "rat", route: "parenchymal", chronicity: "acute", drug: "exendin-4", assay: "behavioural" },
        papers: [{ cite: "Cork 2015 fate-map" }, { cite: "Dickson VTA inj" }],
      },
    ];
  }
  if (node.id === "cea") {
    return [
      {
        statement: "Semaglutide's alcohol suppression involves CeA GABA modulation, not solely dopaminergic effects.",
        confidence: "moderate",
        scope: { species: "rat", route: "periph_tx", chronicity: "subacute", drug: "semaglutide", assay: "EP / behaviour" },
        papers: [{ cite: "Chuong / Farokhnia / Khom · JCI Insight 2023" }],
      },
      {
        statement: "Acute central GLP-1 in CeA is anxiogenic without robust HPA engagement.",
        confidence: "moderate",
        scope: { species: "rat", route: "icv", chronicity: "acute", drug: "GLP-1(7-36)", assay: "EPM" },
        papers: [{ cite: "Kinzig 2003 et seq." }],
      },
    ];
  }
  if (node.id === "out_cog") {
    return [
      {
        statement: "EVOKE / EVOKE+ did not show benefit of oral semaglutide vs placebo on CDR-SB in mild AD over 2 years.",
        confidence: "strong",
        scope: { species: "human", route: "oral", chronicity: "chronic", drug: "semaglutide", assay: "RCT", n: 3808 },
        papers: [{ cite: "EVOKE · Novo Nordisk · CTAD Dec 2025" }],
      },
      {
        statement: "Rodent / cellular: BDNF↑, anti-inflammatory, hippocampal LTP, reduced microglial activation.",
        confidence: "moderate",
        scope: { species: "mouse", route: "periph_tx", chronicity: "chronic", drug: "liraglutide", assay: "histology" },
        papers: [{ cite: "Hölscher group, multiple" }],
      },
    ];
  }
  if (node.id === "drug") {
    return [
      {
        statement: "Semaglutide does not substantially cross intact BBB; reaches deep targets via CVOs, tanycytes, slow transcytosis, and vagal relay.",
        confidence: "strong",
        scope: { species: "rat", route: "periph_tx", chronicity: "acute", drug: "semaglutide", assay: "fluor-IHC" },
        papers: [{ cite: "Gabery / Knudsen · Novo Nordisk" }, { cite: "Banks transcytosis screen" }],
      },
    ];
  }
  // Generic
  return [
    {
      statement: `Mechanistic role of ${node.label} in the GLP-1 atlas (placeholder — wire to claim graph).`,
      confidence: "moderate",
      scope: { species: "rat", route: "periph_tx", chronicity: "chronic" },
      papers: [{ cite: "TBD" }],
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Stewardship strip

function StewardshipStrip() {
  return (
    <div style={{
      borderTop: "0.5px solid var(--rule)",
      padding: "10px 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "var(--bg)",
      gap: 16,
    }}>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <span className="micro" style={{ color: "var(--ink-3)" }}>Garden</span>
        <span className="pip"><span className="pip-dot fresh" /> 3 new since last visit</span>
        <span className="pip"><span className="pip-dot" /> 14 reviewed this quarter</span>
        <span className="pip"><span className="pip-dot" style={{ background: "var(--ink-4)" }} /> 2 stale &gt;90d</span>
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <span className="micro" style={{ color: "var(--ink-3)" }}>Keyboard</span>
        <span className="micro">1–6 LENS</span>
        <span className="micro">/ SEARCH</span>
        <span className="micro">? HELP</span>
      </div>
    </div>
  );
}

Object.assign(window, { OverviewArtboard });
