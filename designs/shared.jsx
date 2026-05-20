// shared.jsx — Atlas component primitives.
// Exported to window at end of file. All consumed by artboards.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Lens system

const LENSES = [
  { id: "mechanistic",    label: "Mechanistic",      hint: "Circuits, molecules, directions" },
  { id: "anatomical",     label: "Anatomical",       hint: "Regions, projections, receptors" },
  { id: "evidence",       label: "Evidence",         hint: "Edges weighted by what backs them" },
  { id: "uncertainty",    label: "Uncertainty",      hint: "Contradictions and open questions foregrounded" },
  { id: "phenomenology",  label: "Phenomenology",    hint: "What it might feel like" },
  { id: "moderator",      label: "Moderator",        hint: "Dose × route × chronicity × species" },
];

function LensSwitcher({ value, onChange, compact = false }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches("input, textarea, [contenteditable]")) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= LENSES.length) {
        onChange(LENSES[n - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <div className="lens" role="tablist" aria-label="Lens">
      {LENSES.map((l, i) => (
        <button
          key={l.id}
          className={"lens-btn" + (value === l.id ? " active" : "")}
          onClick={() => onChange(l.id)}
          title={l.hint}
          role="tab"
          aria-selected={value === l.id}
        >
          <span className="lens-key">{i + 1}</span>
          <span>{l.label}</span>
        </button>
      ))}
      {!compact && (
        <div style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
        }}>
          <span className="micro">Lens</span>
          <span className="micro" style={{ color: "var(--ink-2)" }}>
            {LENSES.find(l => l.id === value)?.hint}
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scope chips

// Map species/route/chronicity → display + translation-fragile flag
const SPECIES = {
  human:   { short: "HUM", glyph: "filled", longish: "human" },
  rat:     { short: "RAT", glyph: "empty",  longish: "rat" },
  mouse:   { short: "MUS", glyph: "empty",  longish: "mouse" },
  nhp:     { short: "NHP", glyph: "filled", longish: "primate" },
  cell:    { short: "CELL",glyph: "empty",  longish: "cell" },
};
const ROUTES = {
  periph_tx: "PERIPH·TX",
  periph_ex: "PERIPH·EXP",
  icv:       "ICV",
  parenchymal: "PARENCH",
  ex_vivo:   "EX-VIVO",
  oral:      "ORAL",
};
const CHRONICITY = {
  acute:    "ACUTE",
  subacute: "SUBACUTE",
  chronic:  "CHRONIC",
};

function Chip({ children, kind, mode }) {
  // mode: "translation-fragile" | "human-chronic" | undefined
  return (
    <span className={"chip" + (mode ? " " + mode : "")}>
      {kind && <span className={"chip-glyph" + (kind === "empty" ? " glyph-empty" : "")} />}
      <span>{children}</span>
    </span>
  );
}

function ScopeChips({ species, route, chronicity, drug, assay, n, compact = false }) {
  const sp = SPECIES[species];
  // Translation-fragility heuristic: rodent · central · acute  → flag
  const fragile = (species === "rat" || species === "mouse")
                && (route === "icv" || route === "parenchymal")
                && chronicity === "acute";
  // Clinical register: human · chronic · peripheral therapeutic
  const clinical = species === "human" && chronicity === "chronic" && route === "periph_tx";
  const mode = fragile ? "translation-fragile" : clinical ? "human-chronic" : undefined;

  return (
    <div className="scope-strip">
      {sp && <Chip kind={sp.glyph} mode={mode}>{sp.short}</Chip>}
      {route && <Chip mode={mode}>{ROUTES[route]}</Chip>}
      {chronicity && <Chip mode={mode}>{CHRONICITY[chronicity]}</Chip>}
      {drug && !compact && <Chip>{drug}</Chip>}
      {assay && !compact && <Chip>{assay}</Chip>}
      {n != null && !compact && <Chip>n={n}</Chip>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confidence

const CONF_LEVEL = {
  strong:        { bars: 3, label: "Strong",         cls: "" },
  moderate:      { bars: 2, label: "Moderate",       cls: "" },
  speculative:   { bars: 1, label: "Speculative",    cls: "" },
  contradicted:  { bars: 0, label: "Contradicted",   cls: "contradicted", glyph: "⇄" },
  open:          { bars: 0, label: "Open question",  cls: "open",         glyph: "◇" },
};

function Confidence({ level, hideLabel = false }) {
  const c = CONF_LEVEL[level] || CONF_LEVEL.speculative;
  if (c.glyph) {
    return (
      <span className={"conf " + c.cls}>
        <span style={{ fontSize: 12, lineHeight: 1, fontFamily: "var(--font-mono)" }}>{c.glyph}</span>
        {!hideLabel && <span>{c.label}</span>}
      </span>
    );
  }
  return (
    <span className="conf">
      <span className="conf-bars" aria-hidden="true">
        {[0, 1, 2].map(i => (
          <span key={i} className={i < c.bars ? "on" : ""} />
        ))}
      </span>
      {!hideLabel && <span>{c.label}</span>}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Claim card

function ClaimCard({ claim, onCite, compact = false, style }) {
  // claim: { statement, confidence, scope: {species, route, chronicity, drug, assay, n}, papers: [{cite, year}], polarity? }
  return (
    <div className="claim" style={style}>
      <p className="claim-statement">{claim.statement}</p>
      <div className="claim-meta">
        <Confidence level={claim.confidence} />
        <span className="sep" />
        {claim.scope && <ScopeChips {...claim.scope} compact />}
      </div>
      {claim.papers && (
        <div className="claim-foot">
          <span>{claim.papers.length} evidence</span>
          <span className="claim-cite" onClick={onCite}>
            {claim.papers[0].cite}{claim.papers.length > 1 ? ` +${claim.papers.length - 1}` : ""}
          </span>
        </div>
      )}
    </div>
  );
}

// Paired-claim tension node — the contradiction-as-structure surface
function PairedClaim({ left, right, label = "tension", note }) {
  return (
    <div>
      <div className="tension">
        <ClaimCard claim={left} />
        <div className="tension-bridge">
          <div className="tension-bridge-label">⇄ {label}</div>
        </div>
        <ClaimCard claim={right} />
      </div>
      {note && (
        <div className="margin-note" style={{
          marginTop: 10,
          padding: "8px 12px",
          background: "var(--accent-bg)",
          borderLeft: "1.5px solid var(--accent)",
          fontStyle: "normal",
          color: "var(--ink-1)",
        }}>
          <span className="eyebrow" style={{ color: "var(--accent)", marginRight: 6 }}>Tension ·</span>
          {note}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Eyebrow / labels

function Eyebrow({ children, accent }) {
  return (
    <div className="eyebrow" style={accent ? { color: "var(--accent)" } : undefined}>
      {children}
    </div>
  );
}

function MarginNote({ children, title }) {
  return (
    <aside className="margin-note margin-rule">
      {title && (
        <div className="eyebrow" style={{ marginBottom: 4 }}>{title}</div>
      )}
      <div>{children}</div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stewardship pip — "last reviewed" indicator

function StewardshipPip({ date, fresh }) {
  return (
    <span className="pip">
      <span className={"pip-dot" + (fresh ? " fresh" : "")} />
      {fresh ? "Updated" : "Reviewed"} {date}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section header for spec page

function SpecSection({ eyebrow, title, children, body }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, alignItems: "start" }}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            fontWeight: 400,
            margin: "6px 0 0 0",
            lineHeight: 1.2,
          }}>{title}</h2>
          {body && (
            <p style={{
              fontFamily: "var(--font-serif)",
              fontSize: 13,
              lineHeight: 1.55,
              color: "var(--ink-2)",
              marginTop: 10,
              maxWidth: 180,
              textWrap: "pretty",
            }}>{body}</p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Anatomy node — used in atlas graphs

function AnatomyNode({ x, y, label, sub, size = 60, glyph, dim, accent, onClick, selected }) {
  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: onClick ? "pointer" : "default", opacity: dim ? 0.35 : 1 }}
      onClick={onClick}
    >
      <circle
        r={size / 2}
        fill="var(--bg-paper)"
        stroke={accent ? "var(--accent)" : selected ? "var(--ink-1)" : "var(--rule-strong)"}
        strokeWidth={selected ? 1.5 : accent ? 1.25 : 0.75}
      />
      {glyph && (
        <text
          textAnchor="middle"
          dy={-2}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fill: "var(--ink-3)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >{glyph}</text>
      )}
      <text
        textAnchor="middle"
        dy={glyph ? 10 : 4}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 12.5,
          fill: "var(--ink-1)",
        }}
      >{label}</text>
      {sub && (
        <text
          textAnchor="middle"
          dy={size / 2 + 14}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fill: "var(--ink-3)",
          }}
        >{sub}</text>
      )}
    </g>
  );
}

// SVG edge between two points, with confidence-encoded weight and direction marker.
function Edge({ from, to, confidence = "moderate", dashed = false, label, dim, contextNote, contradiction }) {
  const c = CONF_LEVEL[confidence];
  const widthMap = { strong: 1.5, moderate: 1.0, speculative: 0.6, contradicted: 1.0, open: 0.6 };
  const w = widthMap[confidence] ?? 1.0;
  const op = dim ? 0.2 : (confidence === "speculative" || confidence === "open" ? 0.55 : 1);
  const stroke = contradiction ? "var(--accent)" : "var(--ink-2)";
  const dashArr = dashed || confidence === "speculative" ? "3 3" : confidence === "open" ? "1 4" : undefined;
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return (
    <g style={{ opacity: op }}>
      <line
        x1={from.x} y1={from.y}
        x2={to.x} y2={to.y}
        stroke={stroke}
        strokeWidth={w}
        strokeDasharray={dashArr}
        markerEnd="url(#arrow)"
      />
      {label && (
        <text
          x={mid.x} y={mid.y - 4}
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fill: stroke,
          }}
        >{label}</text>
      )}
      {contextNote && (
        <text
          x={mid.x} y={mid.y + 10}
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8.5,
            fill: "var(--ink-3)",
            fontStyle: "italic",
          }}
        >{contextNote}</text>
      )}
    </g>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-2)" />
      </marker>
      <marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
      </marker>
      <marker id="inhibit" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 9 0 L 9 10" stroke="var(--ink-2)" strokeWidth="2" />
      </marker>
    </defs>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Artboard header — used at top of every mechanism artboard

function ArtboardHead({ eyebrow, title, oneSentence, stewardship, right }) {
  return (
    <header style={{ padding: "20px 28px 16px 28px", borderBottom: "0.5px solid var(--rule)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 24 }}>
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: 28,
            fontWeight: 400,
            margin: "4px 0 0 0",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}>{title}</h1>
          {oneSentence && (
            <p style={{
              fontFamily: "var(--font-serif)",
              fontSize: 15,
              lineHeight: 1.5,
              color: "var(--ink-2)",
              margin: "10px 0 0 0",
              maxWidth: 720,
              textWrap: "pretty",
            }}>{oneSentence}</p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          {stewardship && <StewardshipPip {...stewardship} />}
          {right}
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Build-out marker — for static surfaces, flag what would be wired up

function BuildoutMarker({ children, style }) {
  return (
    <div style={{
      position: "absolute",
      ...style,
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--accent)",
      background: "var(--bg-paper)",
      border: "0.5px dashed var(--accent-rule)",
      padding: "3px 6px",
      borderRadius: 2,
      whiteSpace: "nowrap",
    }}>
      <span style={{ marginRight: 4 }}>↳</span>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Expose to other Babel scripts

Object.assign(window, {
  // Constants
  LENSES, SPECIES, ROUTES, CHRONICITY, CONF_LEVEL,
  // Components
  LensSwitcher, Chip, ScopeChips, Confidence,
  ClaimCard, PairedClaim, Eyebrow, MarginNote,
  StewardshipPip, SpecSection,
  AnatomyNode, Edge, ArrowDefs,
  ArtboardHead, BuildoutMarker,
});
