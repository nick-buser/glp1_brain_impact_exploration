// walkthrough-primitives.jsx — annotated-wireframe + doc primitives for the
// Implementation Spec tab. All components exposed to window for use by
// walkthrough-surfaces.jsx and walkthrough.jsx.

const { useState: useStateWP } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Doc layout primitives

function DocSection({ id, eyebrow, n, title, body, children, tight }) {
  return (
    <section id={id} style={{
      marginTop: tight ? 32 : 72,
      paddingTop: tight ? 16 : 32,
      borderTop: tight ? "0.5px solid var(--rule-soft)" : "0.5px solid var(--rule-strong)",
    }}>
      <header style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 36, alignItems: "start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.12em" }}>
              {n}
            </span>
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: 28,
            fontWeight: 300,
            margin: "10px 0 0 0",
            lineHeight: 1.12,
            letterSpacing: "-0.015em",
            textWrap: "pretty",
          }}>{title}</h2>
        </div>
        <div>
          {body && (
            <p style={{
              fontFamily: "var(--font-serif)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              margin: 0,
              maxWidth: 760,
              textWrap: "pretty",
            }}>{body}</p>
          )}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}

function SubHead({ children, accent }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-serif)",
      fontSize: 17,
      fontWeight: 500,
      margin: "0 0 10px 0",
      color: accent ? "var(--accent)" : "var(--ink-1)",
      letterSpacing: "-0.005em",
    }}>{children}</h3>
  );
}

function Prose({ children, narrow }) {
  return (
    <p style={{
      fontFamily: "var(--font-serif)",
      fontSize: 14,
      lineHeight: 1.6,
      color: "var(--ink-2)",
      margin: "0 0 12px 0",
      maxWidth: narrow ? 620 : 820,
      textWrap: "pretty",
    }}>{children}</p>
  );
}

function Callout({ kind = "note", title, children }) {
  // kind: note | warn | open | success
  const isWarn = kind === "warn";
  const isOpen = kind === "open";
  const accent = isWarn || isOpen;
  return (
    <aside style={{
      borderLeft: "1.5px solid " + (accent ? "var(--accent)" : "var(--rule-strong)"),
      background: accent ? "var(--accent-bg)" : "var(--bg-tint)",
      padding: "12px 16px",
      margin: "16px 0",
    }}>
      {title && (
        <div className="eyebrow" style={{ color: accent ? "var(--accent)" : "var(--ink-3)", marginBottom: 6 }}>
          {isWarn ? "✗ " : isOpen ? "◇ " : ""}{title}
        </div>
      )}
      <div style={{
        fontFamily: "var(--font-serif)", fontSize: 13.5, lineHeight: 1.55,
        color: "var(--ink-1)", textWrap: "pretty",
      }}>
        {children}
      </div>
    </aside>
  );
}

function PropTable({ rows }) {
  // rows: [{ key, type, default, note }]
  return (
    <table className="data" style={{ marginTop: 4 }}>
      <thead>
        <tr>
          <th style={{ width: 200 }}>Prop / key</th>
          <th style={{ width: 220 }}>Type</th>
          <th style={{ width: 140 }}>Default</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-1)" }}>{r.key}</td>
            <td className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>{r.type}</td>
            <td className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{r.default ?? "—"}</td>
            <td style={{ color: "var(--ink-2)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>{r.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LensMatrix({ rows }) {
  // rows: [{ lens, foreground, dim, behaviour }]
  return (
    <table className="data" style={{ marginTop: 4 }}>
      <thead>
        <tr>
          <th style={{ width: 130 }}>Lens</th>
          <th style={{ width: 180 }}>Foregrounds</th>
          <th style={{ width: 160 }}>Dims</th>
          <th>Behaviour on this surface</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={{ fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>
              {r.lens}
            </td>
            <td style={{ color: "var(--ink-1)" }}>{r.foreground}</td>
            <td style={{ color: "var(--ink-3)" }}>{r.dim}</td>
            <td style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-2)" }}>
              {r.behaviour}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wireframe primitives

function Wireframe({ width = 1100, height = 540, label, children, bg = "var(--bg-paper)" }) {
  return (
    <figure style={{
      margin: "12px 0 16px 0",
      border: "0.5px solid var(--rule-strong)",
      borderRadius: 4,
      background: bg,
      overflow: "hidden",
      position: "relative",
    }}>
      {label && (
        <div style={{
          position: "absolute",
          top: 8, left: 12,
          zIndex: 2,
          padding: "2px 6px",
          background: "var(--bg)",
          border: "0.5px solid var(--rule)",
          borderRadius: 2,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}>{label}</div>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ display: "block" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="wf-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--rule-soft)" strokeWidth="0.25" />
          </pattern>
          <pattern id="wf-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--rule)" strokeWidth="0.5" />
          </pattern>
          <pattern id="wf-image" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="var(--rule-strong)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#wf-grid)" opacity="0.55" />
        {children}
      </svg>
    </figure>
  );
}

function WFRegion({ x, y, w, h, label, sub, kind = "panel", n }) {
  // kind: panel | rail | header | footer | graph | card | control | image | inset
  const fill = {
    panel:   "var(--bg-elev)",
    rail:    "var(--bg-sunk)",
    header:  "var(--bg)",
    footer:  "var(--bg)",
    graph:   "var(--bg-paper)",
    card:    "var(--bg-paper)",
    control: "var(--bg-elev)",
    image:   "url(#wf-image)",
    inset:   "url(#wf-hatch)",
  }[kind] || "var(--bg-paper)";
  const stroke = kind === "inset" ? "var(--rule)" : "var(--rule-strong)";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth="0.5"
            strokeDasharray={kind === "image" || kind === "inset" ? "3 2" : undefined} />
      {label && (
        <text x={x + 8} y={y + 14} style={{
          fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.1em",
          textTransform: "uppercase", fill: "var(--ink-3)",
        }}>{label}</text>
      )}
      {sub && (
        <text x={x + 8} y={y + h - 8} style={{
          fontFamily: "var(--font-serif)", fontSize: 10, fontStyle: "italic",
          fill: "var(--ink-3)",
        }}>{sub}</text>
      )}
      {n && <WFCallout n={n} x={x + w - 14} y={y + 14} />}
    </g>
  );
}

function WFCallout({ n, x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="9" fill="var(--accent)" stroke="var(--bg-paper)" strokeWidth="1.5" />
      <text textAnchor="middle" dy="3.2" style={{
        fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 9.5, fill: "var(--bg-paper)",
      }}>{n}</text>
    </g>
  );
}

function WFLine({ x1, y1, x2, y2, dashed }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--rule-strong)" strokeWidth="0.5"
               strokeDasharray={dashed ? "3 3" : undefined} />;
}

function WFText({ x, y, children, size = 10, family = "mono", color = "var(--ink-3)", anchor = "start", italic, upper }) {
  const fam = family === "serif" ? "var(--font-serif)" : family === "sans" ? "var(--font-sans)" : "var(--font-mono)";
  return (
    <text x={x} y={y} textAnchor={anchor} style={{
      fontFamily: fam, fontSize: size, fill: color,
      letterSpacing: upper ? "0.1em" : 0,
      textTransform: upper ? "uppercase" : "none",
      fontStyle: italic ? "italic" : "normal",
    }}>{children}</text>
  );
}

function WFGlyph({ x, y, kind }) {
  // tiny visual stand-ins
  if (kind === "lensbar") {
    return (
      <g transform={`translate(${x},${y})`}>
        {[0,1,2,3,4,5].map(i => (
          <g key={i} transform={`translate(${i*78},0)`}>
            <rect width="8" height="11" y="-9" rx="1" fill="var(--bg)" stroke="var(--rule)" strokeWidth="0.5" />
            <text x="14" y="0" style={{ fontFamily: "var(--font-sans)", fontSize: 9, fill: "var(--ink-2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {["Mech","Anat","Evid","Uncert","Phenom","Mod"][i]}
            </text>
            {i === 0 && <rect x="0" y="6" width="60" height="1.5" fill="var(--accent)" />}
          </g>
        ))}
      </g>
    );
  }
  if (kind === "chiprow") {
    return (
      <g transform={`translate(${x},${y})`}>
        {[0,1,2,3].map(i => (
          <rect key={i} x={i*46} y={-6} width="38" height="12" rx="1.5"
                fill="var(--bg)" stroke="var(--rule-strong)" strokeWidth="0.4" />
        ))}
      </g>
    );
  }
  if (kind === "barchart") {
    const bars = [0.85, 0.42, 0.55, 0.30];
    return (
      <g transform={`translate(${x},${y})`}>
        <line x1="0" y1="80" x2="240" y2="80" stroke="var(--rule)" strokeWidth="0.4" />
        {bars.map((b, i) => (
          <g key={i}>
            <rect x={i*60+8} y={80 - b*70} width="34" height={b*70} fill="var(--ink-2)" opacity="0.7" />
            <text x={i*60+25} y={94} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {["Want","Like","Learn","Effort"][i]}
            </text>
          </g>
        ))}
      </g>
    );
  }
  if (kind === "dial") {
    return (
      <g transform={`translate(${x},${y})`}>
        <line x1="0" y1="0" x2="220" y2="0" stroke="var(--rule-strong)" strokeWidth="0.5" />
        {[0,1,2,3,4].map(i => (
          <g key={i} transform={`translate(${i*55},0)`}>
            <circle r="6" fill={i === 2 ? "var(--accent)" : "var(--bg-paper)"} stroke={i === 2 ? "var(--accent)" : "var(--rule-strong)"} strokeWidth="0.6" />
            <text y="20" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {["Fast","Fed","Meal","Stress","Pharm"][i]}
            </text>
          </g>
        ))}
      </g>
    );
  }
  if (kind === "tensionpair") {
    return (
      <g transform={`translate(${x},${y})`}>
        <rect width="130" height="60" fill="var(--bg-paper)" stroke="var(--rule)" strokeWidth="0.5" />
        <rect x="160" width="130" height="60" fill="var(--bg-paper)" stroke="var(--rule)" strokeWidth="0.5" />
        <rect x="130" y="0" width="30" height="60" fill="var(--accent-bg)" stroke="var(--accent-rule)" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="145" y="34" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "var(--accent)" }}>⇄</text>
      </g>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Notes list — paired with WFCallouts

function WFNotes({ notes }) {
  return (
    <ol style={{
      listStyle: "none",
      counterReset: "wfn",
      padding: 0,
      margin: "8px 0 0 0",
      display: "grid",
      gap: 10,
    }}>
      {notes.map((nNote, i) => (
        <li key={i} style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr",
          gap: 12,
          alignItems: "start",
        }}>
          <span style={{
            display: "inline-block",
            width: 22, height: 22, borderRadius: 11,
            background: "var(--accent)",
            color: "var(--bg-paper)",
            fontFamily: "var(--font-mono)",
            fontWeight: 600, fontSize: 11,
            textAlign: "center",
            lineHeight: "22px",
          }}>{nNote.n}</span>
          <div>
            <div style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--ink-1)",
              marginBottom: 2,
            }}>{nNote.label}</div>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontSize: 13,
              lineHeight: 1.55,
              color: "var(--ink-2)",
              textWrap: "pretty",
            }}>{nNote.text}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status pill

function StatusPill({ state }) {
  // state: built | partial | unbuilt | open
  const cfg = {
    built:   { label: "Built", color: "var(--ink-1)", bg: "var(--bg-elev)", dot: "var(--ink-1)" },
    partial: { label: "Partial", color: "var(--ink-1)", bg: "var(--bg-elev)", dot: "var(--ink-3)" },
    unbuilt: { label: "Unbuilt", color: "var(--accent)", bg: "var(--accent-bg)", dot: "var(--accent)" },
    open:    { label: "Open frontier", color: "var(--accent)", bg: "var(--accent-bg)", dot: "var(--accent)" },
  }[state] || { label: state, color: "var(--ink-2)", bg: "var(--bg-tint)", dot: "var(--ink-3)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px",
      background: cfg.bg,
      border: "0.5px solid var(--rule)",
      borderRadius: 2,
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: cfg.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section header for a surface in the surface gallery

function SurfaceHead({ n, code, title, purpose, status, stewardship }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.12em" }}>
          {n}
        </span>
        <span className="eyebrow">{code}</span>
        <span style={{ marginLeft: "auto" }}><StatusPill state={status} /></span>
      </div>
      <h3 style={{
        fontFamily: "var(--font-serif)",
        fontSize: 22,
        fontWeight: 400,
        margin: "6px 0 0 0",
        letterSpacing: "-0.01em",
        lineHeight: 1.18,
        textWrap: "pretty",
      }}>{title}</h3>
      {purpose && (
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--ink-2)",
          margin: "8px 0 0 0",
          maxWidth: 920,
          textWrap: "pretty",
        }}>{purpose}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Two-column row for "On this surface · Built status" + "Data dependencies"

function FactGrid({ items }) {
  // items: [{ label, value }]
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
      gap: 0,
      borderTop: "0.5px solid var(--rule)",
      borderBottom: "0.5px solid var(--rule)",
      margin: "12px 0",
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: "10px 14px",
          borderRight: i < items.length - 1 ? "0.5px solid var(--rule-soft)" : 0,
        }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>{it.label}</div>
          <div style={{
            fontFamily: "var(--font-serif)",
            fontSize: 13,
            color: "var(--ink-1)",
            lineHeight: 1.4,
            textWrap: "pretty",
          }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tiny inline "code" type for prop refs

function Code({ children }) {
  return (
    <code style={{
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      padding: "1px 4px",
      background: "var(--bg-sunk)",
      border: "0.5px solid var(--rule-soft)",
      borderRadius: 2,
      color: "var(--ink-1)",
      letterSpacing: 0,
    }}>{children}</code>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

Object.assign(window, {
  DocSection, SubHead, Prose, Callout, PropTable, LensMatrix,
  Wireframe, WFRegion, WFCallout, WFLine, WFText, WFGlyph, WFNotes,
  StatusPill, SurfaceHead, FactGrid, Code,
});
