// walkthrough.jsx — Implementation Spec tab.
// Single non-interactive document. Synthesises the visual-language canon and
// the surface gallery into a Claude-Code-ready hand-off doc.

const { useState: useStateWalk } = React;

function Walkthrough({ mode = "atlas-light" }) {
  return (
    <div className={"atlas " + mode} style={{
      background: "var(--bg)",
      color: "var(--ink-1)",
      minHeight: "100vh",
    }}>
      <WalkthroughInner />
    </div>
  );
}

function WalkthroughInner() {
  return (
    <div style={{
      maxWidth: 1280,
      margin: "0 auto",
      padding: "64px 72px 96px 72px",
      fontFamily: "var(--font-serif)",
    }}>
      <Cover />
      <TOC />
      <Posture />
      <InfoArchitecture />
      <GlobalChrome />
      <LensContract />
      <DataModel />
      <Routes />
      <KeyboardSurface />
      <InteractionPatterns />
      <SurfaceGallery />
      <BuildOrder />
      <Acceptance />
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover masthead

function Cover() {
  return (
    <header style={{ marginBottom: 56 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="eyebrow">GLP-1 Brain Mechanism Atlas · Implementation Spec v0.1</div>
        <div className="micro">For Claude Code · {new Date().toISOString().slice(0, 10)}</div>
      </div>
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: 64,
        fontWeight: 300,
        margin: "16px 0 0 0",
        lineHeight: 1.02,
        letterSpacing: "-0.025em",
        maxWidth: 1100,
        textWrap: "pretty",
      }}>End-to-end screen implementation, page by page.</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, marginTop: 32 }}>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, textWrap: "pretty" }}>
          This document is the hand-off from design exploration to implementation. It is non-interactive on
          purpose — Figma-style, not a prototype. Each surface is specified as a region map, a numbered notes
          list, a lens-behaviour matrix, and a fact strip of data dependencies. A reader who has not seen the
          canvas should be able to build the unbuilt surfaces from this doc alone, using
          <span> </span><Code>tokens.css</Code>, <Code>shared.jsx</Code>, and the design-canvas spec.
        </p>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, textWrap: "pretty" }}>
          The design is anchored in four invariants: <strong>workbench</strong> as dominant register,
          <strong> atlas</strong> as orientation moments, <strong>field-guide</strong> as epistemic posture, and
          <strong> garden</strong> as long-arc honesty cue. Lens switching is the central interaction; confidence
          and scope are first-class; contradictions are structure, not hedged prose. The atlas refuses
          dashboard-y polish and refuses dopamine-down collapse.
        </p>
      </div>
      <div style={{
        marginTop: 28,
        padding: "16px 20px",
        background: "var(--bg-elev)",
        border: "0.5px solid var(--rule)",
        borderRadius: 4,
        display: "flex",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}>
        <FactItem k="Surfaces" v="13 mechanism modules + spec" />
        <FactItem k="Built" v="4 of 13 (00, 02, 04, 12)" />
        <FactItem k="Open frontier" v="09 · cognition (EVOKE tension)" />
        <FactItem k="Lenses" v="6 · keyboard 1–6" />
        <FactItem k="Modes" v="atlas-light · atlas-dark" />
        <FactItem k="Min canvas" v="≥ 1280px width" />
      </div>
    </header>
  );
}

function FactItem({ k, v }) {
  return (
    <div>
      <div className="eyebrow">{k}</div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--ink-1)", marginTop: 4 }}>{v}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOC

function TOC() {
  const sections = [
    ["01", "Posture", "Anti-patterns and axioms the design refuses to violate"],
    ["02", "Information architecture", "Sitemap, route table, navigation model"],
    ["03", "Global chrome", "Top bar, lens switcher, module rail, provenance, footer"],
    ["04", "Lens contract", "Formal definition; per-lens rules"],
    ["05", "Data model", "Claim, Edge, Node, Paper, Lens schemas"],
    ["06", "Routes & deep-linking", "URL structure, hash, sharing"],
    ["07", "Keyboard surface", "Global bindings, ⌘K, slash"],
    ["08", "Interaction patterns", "Selection, hover, expand, scope filter"],
    ["09", "Surface gallery", "13 surfaces, region-mapped"],
    ["10", "Build order", "Milestones M0–M4"],
    ["11", "Acceptance criteria", "Pass/fail conditions"],
  ];
  return (
    <nav style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "4px 32px",
      borderTop: "0.5px solid var(--rule-strong)",
      borderBottom: "0.5px solid var(--rule-strong)",
      padding: "20px 0",
      marginBottom: 24,
    }}>
      {sections.map(([n, label, sub]) => (
        <div key={n} style={{
          display: "grid",
          gridTemplateColumns: "44px 1fr",
          gap: 12,
          padding: "8px 0",
          borderBottom: "0.5px solid var(--rule-soft)",
        }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em" }}>{n}</span>
          <div>
            <div style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 12.5,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink-1)",
            }}>{label}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, color: "var(--ink-3)", fontStyle: "italic", lineHeight: 1.4 }}>
              {sub}
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 01 · Posture

function Posture() {
  const axioms = [
    ["Lens-switching is structural", "Lenses are pure functions (graph, context) → projection. The visualisation transforms; it is never replaced."],
    ["Confidence rides every claim", "Bar-glyph on cards, line-weight on edges. Confidence and evidence-type are independent dimensions."],
    ["Scope is visible by default", "Species · route · chronicity chips on every claim. Rodent-central-acute is sienna; human-chronic-peripheral is weighted darker. No exceptions."],
    ["Contradictions are first-class", "Paired-claim node renders tension as structure. Reconciliation candidates live next to it. Footnoted hedging is forbidden."],
    ["Open questions are claims too", "◇ glyph; same card weight; surfaced on relevant surfaces and aggregated globally."],
    ["The atlas keeps its garden", "Stewardship pip on every page. Stale entries are visible, not hidden. Updates show as fresh-since-last-visit cues."],
  ];
  const refused = [
    ["Dashboard slip", "Tiles, summary stats, magazine-resolved layouts. The atlas optimises for engaged minutes, not at-a-glance."],
    ["Polish-as-authority", "Settled-looking aesthetic for an unsettled field is dishonest."],
    ["Chat bubble", "Phenomenology is structured-AI, not chat. There is no free-form thread anywhere in the build."],
    ["Hedge-as-disclaimer", "'Note: results vary by species' is replaced by scope chips. Always."],
    ["Everything is a graph", "Wanting/liking/learning/effort is bars. PPG-NTS is a dial. Translation ladder is a stack. Pick the form that fits the claim."],
    ["Dopamine-down surrender", "The Berridge decomposition is the default frame on any reward surface."],
    ["Emoji confidence", "✓ ⭐ 🔥 are out. Bar-glyphs, ⇄, ◇ in."],
    ["Gamification", "No streaks, badges, XP. Especially gross given the subject matter."],
  ];
  return (
    <DocSection
      id="posture"
      n="01"
      eyebrow="Posture"
      title="Axioms the design holds. Moves it refuses."
      body="The visual language canon (atlas-canvas tab · spec artboard) defines tokens and components. This section restates the posture in implementation register: what the build must hold, and what it must not drift into."
    >
      <SubHead>Axioms</SubHead>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {axioms.map(([h, d]) => (
          <div key={h} style={{
            padding: "12px 16px",
            background: "var(--bg-paper)",
            border: "0.5px solid var(--rule)",
            borderLeft: "1.5px solid var(--ink-1)",
            borderRadius: 0,
          }}>
            <div className="eyebrow" style={{ color: "var(--ink-1)", marginBottom: 4 }}>{h}</div>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontSize: 13.5, lineHeight: 1.5,
              color: "var(--ink-2)", textWrap: "pretty",
            }}>{d}</div>
          </div>
        ))}
      </div>
      <SubHead accent>Refused moves</SubHead>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {refused.map(([h, d]) => (
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
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 02 · Information architecture

function InfoArchitecture() {
  return (
    <DocSection
      id="ia"
      n="02"
      eyebrow="Information architecture"
      title="Sitemap, single shell, lens-projected within."
      body="One app shell, 13 mechanism modules, plus an evidence workbench, moderator dashboard, and phenomenology mapper. Lens switching lives at the shell level — it transforms whichever surface is currently open, never the navigation."
    >
      <Wireframe label="Sitemap" width={1100} height={520} bg="var(--bg)">
        {/* Root */}
        <WFRegion x={420} y={20} w={260} h={56} kind="header" label="App shell · /atlas/*" sub="Top bar · lens · search · ⌘K" />
        <WFLine x1={550} y1={76} x2={550} y2={112} />
        {/* Module rail represented */}
        <WFRegion x={120} y={112} w={860} h={48} kind="control" label="Module rail (persistent across modules)" />
        {/* Module grid */}
        {[
          ["00", "Overview"], ["01", "Access"], ["02", "PPG-NTS"], ["03", "Appetite"],
          ["04", "Wanting"], ["05", "Cross-reward"], ["06", "Amygdala"], ["07", "HPA"],
          ["08", "Hedonic"], ["09", "Cognition"], ["10", "Moderator"], ["11", "Evidence"],
          ["12", "Phenom"], ["—", "Spec"],
        ].map(([n, l], i) => {
          const col = i % 7, row = Math.floor(i / 7);
          return (
            <g key={n}>
              <rect x={60 + col*135} y={200 + row*100} width={120} height={80}
                    fill="var(--bg-paper)" stroke="var(--rule-strong)" strokeWidth="0.5" />
              <text x={70 + col*135} y={222 + row*100} style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--accent)", letterSpacing: "0.1em" }}>{n}</text>
              <text x={70 + col*135} y={246 + row*100} style={{ fontFamily: "var(--font-serif)", fontSize: 12, fill: "var(--ink-1)" }}>{l}</text>
              <text x={70 + col*135} y={266 + row*100} style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {n === "00" ? "atlas" : n === "—" ? "system" : `atlas/${l.toLowerCase()}`}
              </text>
            </g>
          );
        })}
        {/* Cross-cutting surfaces */}
        <WFRegion x={60}  y={420} w={310} h={68} kind="inset" label="Cross-cutting · provenance" sub="Right rail follows selection across modules" />
        <WFRegion x={395} y={420} w={310} h={68} kind="inset" label="Cross-cutting · stewardship" sub="Footer strip persists across modules" />
        <WFRegion x={730} y={420} w={310} h={68} kind="inset" label="Cross-cutting · ⌘K command palette" sub="Reachable from any surface" />
      </Wireframe>
      <SubHead>Navigation model</SubHead>
      <Prose>
        A single persistent shell hosts all 13 modules plus the spec page. Module rail is always visible. Provenance
        panel (right rail) is contextual but its <em>selection</em> persists across module routes — clicking a node
        in Overview and then navigating to Wanting keeps the node's claim stack in view. Lens state also persists
        globally; the URL <Code>?lens=uncertainty</Code> is shareable.
      </Prose>
      <Callout title="Implementation note">
        The Atlas-Canvas tab in this very prototype is a designer's <em>workbench</em>, not the production shell.
        The production app collapses to a single route per module — Overview <Code>/atlas</Code>, modules
        <Code> /atlas/:moduleId</Code>, spec <Code>/system</Code>. The design canvas is for hand-off only.
      </Callout>
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 · Global chrome

function GlobalChrome() {
  return (
    <DocSection
      id="global"
      n="03"
      eyebrow="Global chrome"
      title="Persistent shell. Five regions, all the time."
      body="The chrome is identical on every module. The only thing that changes between modules is the contents of the centre canvas and the contextual provenance. Lens and stewardship are shell-level."
    >
      <Wireframe label="Global chrome · region map" width={1100} height={520}>
        <WFRegion x={0}   y={0}   w={1100} h={60}  kind="header" label="Top bar · brand · search · ⌘K · mode" n="1" />
        <WFRegion x={0}   y={60}  w={1100} h={40}  kind="control" label="Lens switcher · 6 buttons · keyboard 1–6" n="2" />
        <WFRegion x={0}   y={100} w={220}  h={380} kind="rail" label="Module rail · 13 + spec" n="3" />
        <WFRegion x={220} y={100} w={580}  h={380} kind="graph" label="Centre canvas · current module" n="4" />
        <WFRegion x={800} y={100} w={300}  h={380} kind="panel" label="Provenance panel" n="5" />
        <WFRegion x={0}   y={480} w={1100} h={40}  kind="footer" label="Stewardship strip · keyboard hints" n="6" />
        <WFGlyph x={20} y={82} kind="lensbar" />
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Top bar", text: "Left: 'GLP-1 Brain Mechanism Atlas · v0.x'. Right: search input (slash to focus), ⌘K command palette trigger, light/dark mode toggle. No marketing copy ever appears here." },
        { n: "2", label: "Lens switcher", text: "Six segmented buttons with keyboard hint pills (1–6). Active gets sienna underline. Right-aligned hint strip showing the active lens's tagline. The switch is instant — lens transforms in place." },
        { n: "3", label: "Module rail", text: "13 modules + Spec. Each row: nn · label · status glyph (● primary, ◇ open). Active row in ink-1 bold; others ink-2. Footer micro-legend reminds the user what the glyphs mean." },
        { n: "4", label: "Centre canvas", text: "The current module's surface. Width target: ≥ 580px after the rails. Surfaces own their internal layout, but must use the same head primitive (ArtboardHead) and the same lens switcher position." },
        { n: "5", label: "Provenance", text: "Default state: 'Recently updated' list (≤4 items, fresh sienna pip). Selected state: node header + claim cards + lens-aware ordering note. Persists across module routes when the selection refers to a globally-known node." },
        { n: "6", label: "Stewardship strip", text: "Garden cues (fresh / reviewed / stale counts) on the left; keyboard hints on the right. Subtle — bottom-edge information, not a CTA." },
      ]} />
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 04 · Lens contract

function LensContract() {
  return (
    <DocSection
      id="lens"
      n="04"
      eyebrow="Lens contract"
      title="Six pure projections of the same graph."
      body="Lenses are not view modes that swap components. They are projection rules applied to a shared claim graph: edges and nodes carry baseline confidence, scope, and tags; the lens decides which to foreground, dim, or relabel."
    >
      <SubHead>Formal contract</SubHead>
      <Prose>
        For each surface, implement <Code>projectGraph(graph, lens, context) → {`{nodes, edges, overlays}`}</Code>.
        The function must be pure — given the same inputs it returns the same output, with no side effects on the
        underlying data. The lens is a parameter; switching is cheap.
      </Prose>
      <PropTable rows={[
        { key: "lens", type: '"mechanistic" | "anatomical" | "evidence" | "uncertainty" | "phenomenology" | "moderator"', default: '"mechanistic"', note: "Persistent in URL; keyboard 1–6 swaps." },
        { key: "context", type: "{ moduleId, selectedNodeId?, moderator? }", default: "{}", note: "Per-surface state — selection, filter chips." },
        { key: "node.dim", type: "boolean", default: "false", note: "Visually muted by the active lens (opacity ≤ 0.35)." },
        { key: "node.accent", type: "boolean", default: "false", note: "Stroked sienna by the active lens." },
        { key: "edge.dim", type: "boolean", default: "false", note: "Reduced opacity / weight." },
        { key: "edge.label", type: "string | null", default: "null", note: "Lens-specific label (mechanistic shows neurotransmitter; moderator shows context-note)." },
        { key: "overlays", type: "{ legend, bbb, lanes, banner }", default: "{}", note: "Lens-specific decoration on top of the graph (e.g. BBB hatch on anatomical)." },
      ]} />
      <SubHead>Default lens by module</SubHead>
      <table className="data" style={{ marginTop: 4 }}>
        <thead>
          <tr><th style={{ width: 160 }}>Module</th><th style={{ width: 160 }}>Default lens</th><th>Why</th></tr>
        </thead>
        <tbody>
          <DefaultLensRow m="00 · Overview"     l="Mechanistic"   why="The first read should be 'what connects to what.'" />
          <DefaultLensRow m="01 · Access"       l="Anatomical"    why="Surface is fundamentally an anatomy question." />
          <DefaultLensRow m="02 · PPG-NTS"      l="Mechanistic"   why="State dial is the centrepiece; mech labels matter most." />
          <DefaultLensRow m="03 · Appetite"     l="Mechanistic"   why="Loop is what most users want first." />
          <DefaultLensRow m="04 · Wanting"      l="Uncertainty"   why="Kooji paired-claim is the surface's point." />
          <DefaultLensRow m="05 · Cross-reward" l="Evidence"      why="Per-substrate stacks ARE the evidence story." />
          <DefaultLensRow m="06 · Amygdala"     l="Mechanistic"   why="Two-channel circuit is the central read." />
          <DefaultLensRow m="07 · HPA"          l="Moderator"     why="Bidirectional matrix is moderator-shaped." />
          <DefaultLensRow m="08 · Hedonic"      l="Uncertainty"   why="Open-question registry is the headline." />
          <DefaultLensRow m="09 · Cognition"    l="Uncertainty"   why="EVOKE tension is the surface." />
          <DefaultLensRow m="10 · Moderator"    l="Moderator"     why="Self-evidently." />
          <DefaultLensRow m="11 · Evidence"     l="Evidence"      why="Self-evidently." />
          <DefaultLensRow m="12 · Phenom"       l="Phenomenology" why="Self-evidently." />
        </tbody>
      </table>
    </DocSection>
  );
}

function DefaultLensRow({ m, l, why }) {
  return (
    <tr>
      <td style={{ fontFamily: "var(--font-serif)" }}>{m}</td>
      <td style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</td>
      <td style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-2)" }}>{why}</td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 05 · Data model

function DataModel() {
  return (
    <DocSection
      id="data"
      n="05"
      eyebrow="Data model"
      title="Claim graph. Confidence, scope, papers, lenses are first-class."
      body="Implementation should treat claims as the atomic unit. Edges are claim-bearing. Nodes are claim-bearing. Lenses read tags on claims; they do not store their own data."
    >
      <SubHead>Claim</SubHead>
      <PropTable rows={[
        { key: "id", type: "string", default: "—", note: "Stable, kebab-cased. URL-safe." },
        { key: "statement", type: "string (sentence)", default: "—", note: "One declarative claim sentence. Source-of-truth wording." },
        { key: "confidence", type: '"strong" | "moderate" | "speculative" | "contradicted" | "open"', default: '"speculative"', note: "Drives both glyph and edge weight." },
        { key: "scope", type: "{ species, route, chronicity, drug?, assay?, n? }", default: "—", note: "All four primary keys required for non-open claims." },
        { key: "papers", type: "Paper[]", default: "[]", note: "Ordered most-canonical first." },
        { key: "tags", type: "{ moduleIds: string[], pairedWith?: claimId, opensModerator?: string }", default: "{}", note: "Tags drive lens projections without coupling to UI." },
        { key: "reviewedAt", type: "ISO date", default: "—", note: "Drives stewardship pip — fresh < 30d, reviewed < 90d, stale > 90d." },
      ]} />
      <SubHead>Edge</SubHead>
      <PropTable rows={[
        { key: "from / to", type: "nodeId", default: "—", note: "Directed by default; bidirectional flag for HPA-style ↕." },
        { key: "confidence", type: "Claim['confidence']", default: '"moderate"', note: "Same enum as Claim. Maps to stroke-width × dash pattern." },
        { key: "label", type: "string", default: "null", note: "Surfaced by Mechanistic and Moderator lenses." },
        { key: "contextNote", type: "string", default: "null", note: "Moderator hint — 'hours timescale', 'acute · central'. Triggers moderator-lens emphasis." },
        { key: "claims", type: "claimId[]", default: "[]", note: "Edge is the visual aggregate of one or more claims." },
        { key: "contradiction", type: "boolean", default: "false", note: "Renders sienna; pairs with a partner edge through claim.tags.pairedWith." },
      ]} />
      <SubHead>Node</SubHead>
      <PropTable rows={[
        { key: "id", type: "string", default: "—", note: "Stable. Used as URL anchor." },
        { key: "kind", type: '"drug" | "endogenous" | "access" | "region" | "outcome"', default: "—", note: "Drives default visual." },
        { key: "label / sub", type: "string", default: "—", note: "Display only." },
        { key: "moduleIds", type: "string[]", default: "[]", note: "Which mechanism modules surface this node prominently." },
        { key: "bidirectional", type: "boolean", default: "false", note: "Outcome that flips with moderator (e.g. anxiety)." },
        { key: "contradiction", type: "boolean", default: "false", note: "Outcome that has a paired-claim core (e.g. wanting, cognition)." },
      ]} />
      <SubHead>Paper</SubHead>
      <PropTable rows={[
        { key: "cite", type: "string", default: "—", note: "Display citation. 'Author · Journal Year'." },
        { key: "year", type: "number", default: "—", note: "Year only." },
        { key: "design", type: '"RCT" | "Open-label" | "Microdial" | "Photometry" | "fMRI" | "IHC" | "EHR" | "Case report" | …', default: "—", note: "Drives Evidence-lens column." },
        { key: "n", type: "number | null", default: "null", note: "Sample size where meaningful." },
        { key: "url", type: "string", default: "null", note: "Doi / PubMed link." },
        { key: "supports", type: "claimId[]", default: "[]", note: "Reverse index from paper → claims." },
      ]} />
      <Callout title="One source of truth">
        The same Claim object is rendered as a card on Surface X, as an edge on Surface Y, and as a row on the
        Evidence workbench. Three views of one object, never three copies. Lens-driven UI variants are
        view-layer concerns, not data layer concerns.
      </Callout>
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 06 · Routes

function Routes() {
  return (
    <DocSection
      id="routes"
      n="06"
      eyebrow="Routes & deep-linking"
      title="Every state is a URL."
      body="Lens, module, selected node, moderator filter all serialise to the URL. The atlas is sharable down to the cell — a clinician sending a colleague a contradicted edge sends a link that opens exactly that view."
    >
      <table className="data" style={{ marginTop: 4 }}>
        <thead>
          <tr><th style={{ width: 360 }}>URL</th><th>Opens</th></tr>
        </thead>
        <tbody>
          <RouteRow url="/atlas" desc="Overview · default lens (mechanistic) · no selection" />
          <RouteRow url="/atlas?lens=uncertainty" desc="Overview · uncertainty lens applied to the graph" />
          <RouteRow url="/atlas/wanting" desc="Module 04 · default lens (uncertainty)" />
          <RouteRow url="/atlas/wanting?lens=moderator&moderator=route" desc="Module 04 · moderator lens · route as the filter axis" />
          <RouteRow url="/atlas/cognition#evoke-vs-rodent" desc="Module 09 · scrolls to paired-claim anchor" />
          <RouteRow url="/atlas/moderator?species=human&chronicity=chronic&route=periph_tx" desc="Moderator dashboard filtered to clinical translation register" />
          <RouteRow url="/atlas/evidence?q=Klausen" desc="Evidence workbench · search query" />
          <RouteRow url="/atlas?node=out_wanting" desc="Overview with wanting outcome selected (provenance panel populated)" />
          <RouteRow url="/system" desc="Spec page · visual language canon" />
        </tbody>
      </table>
      <Callout title="State precedence">
        URL is the source of truth. App boot reads URL → state. Any interaction that changes state pushes
        history (debounced for sliders / scrubbers — coalesce to one entry per interaction settle).
      </Callout>
    </DocSection>
  );
}

function RouteRow({ url, desc }) {
  return (
    <tr>
      <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-1)" }}>{url}</td>
      <td style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-2)" }}>{desc}</td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 07 · Keyboard surface

function KeyboardSurface() {
  const bindings = [
    ["1–6", "Lens switch", "Mechanistic / Anatomical / Evidence / Uncertainty / Phenomenology / Moderator. Inactive when focus is in an editable field."],
    ["/", "Focus global search", "Top-bar search input. Escapes back to the surface."],
    ["⌘K", "Command palette", "Cross-surface navigation, claim lookup, module jump. Future build — wire as no-op placeholder."],
    ["?", "Show keyboard help", "Modal listing all bindings. Dismiss on Esc."],
    ["Esc", "Clear selection / close palette", "Returns provenance to default state."],
    ["←/→", "Step through module rail", "Up/down also works; respects current focus."],
    ["[ / ]", "Cycle stewardship freshness filter", "Fresh-only / All / Stale-only."],
  ];
  return (
    <DocSection
      id="kb"
      n="07"
      eyebrow="Keyboard surface"
      title="Global bindings. Mouse-optional for the power user."
      body="The atlas's preferred user is a clinician or researcher who will read it for hours. Keyboard must be a first-class navigation surface. All bindings are global and persistent across module routes."
    >
      <table className="data" style={{ marginTop: 4 }}>
        <thead>
          <tr>
            <th style={{ width: 80 }}>Key</th>
            <th style={{ width: 200 }}>Action</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {bindings.map(([k, a, n], i) => (
            <tr key={i}>
              <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-1)" }}>{k}</td>
              <td style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 12 }}>{a}</td>
              <td style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-2)" }}>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 08 · Interaction patterns

function InteractionPatterns() {
  return (
    <DocSection
      id="interactions"
      n="08"
      eyebrow="Interaction patterns"
      title="Selection, hover, expand, scope filter, tension expand."
      body="Five repeatable interaction grammars. Every surface uses one or more. The grammar is consistent across surfaces so the user learns it once."
    >
      <SubHead>Selection</SubHead>
      <Prose>
        Single-click any node, row, or claim card selects it. Selection is sticky across lens switches (the
        provenance panel keeps showing the selected entity, re-projected by the new lens). Esc clears. Selection
        is reflected in the URL via <Code>?node=</Code> or <Code>?claim=</Code>.
      </Prose>
      <SubHead>Hover</SubHead>
      <Prose>
        Hover surfaces the canonical paper citation, the confidence label (if not shown), and any moderator
        notes. Hover never opens a popover that obscures other claims. The interaction is for orientation, not
        for primary content delivery.
      </Prose>
      <SubHead>Expand</SubHead>
      <Prose>
        Claim cards with multi-paper provenance show a <Code>+N</Code> indicator. Click expands inline (not in a
        modal) to reveal the paper list with their scope chips and design types. The expanded state is part of
        the URL <Code>?expanded=&lt;claimId&gt;</Code>.
      </Prose>
      <SubHead>Scope filter</SubHead>
      <Prose>
        Any surface with a scope dimension (Moderator, Evidence, Cross-reward) exposes a chip strip at the top of
        the central canvas. Chips compose AND. Active chips show their canonical visual (translation-fragile
        sienna for rodent-central-acute, weighted dark for human-chronic-peripheral) so the filter itself
        teaches the vocabulary.
      </Prose>
      <SubHead>Tension expand</SubHead>
      <Prose>
        Paired-claim nodes (contradiction outcomes) reveal three layers on click: the two side-by-side claim
        cards, the bridge label, and the reconciliation-candidate strip beneath. Reconciliation cards each carry
        their own confidence — they are not editorial guesses but live hypotheses with provenance. Tension
        nodes <em>never</em> resolve themselves visually; the contradiction stays visible after expand.
      </Prose>
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 09 · Surface gallery

function SurfaceGallery() {
  return (
    <DocSection
      id="surfaces"
      n="09"
      eyebrow="Surface gallery"
      title="Thirteen surfaces, page by page."
      body="Each surface section follows the same shape: head + region-mapped wireframe + numbered notes + fact strip + lens-behaviour matrix. Status pill at the top right of each head: built, partial, unbuilt, or open frontier."
    >
      <SurfaceOverview />
      <SurfaceAccess />
      <SurfacePPGNTS />
      <SurfaceAppetite />
      <SurfaceWanting />
      <SurfaceCrossReward />
      <SurfaceAmygdala />
      <SurfaceHPA />
      <SurfaceHedonic />
      <SurfaceCognition />
      <SurfaceModerator />
      <SurfaceEvidence />
      <SurfacePhenom />
      <SurfaceSpec />
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10 · Build order

function BuildOrder() {
  const milestones = [
    {
      id: "M0", label: "Tokens · primitives · shell",
      blurb: "Stand up tokens.css, claim/edge/node/paper schemas, App shell with top bar + lens switcher + module rail + provenance + stewardship strip. Light & dark modes. No surfaces yet.",
      blocks: ["tokens.css", "shared.jsx primitives", "AppShell.tsx", "LensProvider", "URL state hook"],
      depends: "—",
      done: "Empty centre canvas renders, lens switcher works, mode toggle works, URL state round-trips.",
    },
    {
      id: "M1", label: "Overview Atlas (00) + Spec (system)",
      blurb: "First navigable surface plus the canon page. Two surfaces, no module dependencies. Overview is the spine the rest hang off.",
      blocks: ["AtlasGraph.tsx (SVG)", "ProvenancePanel.tsx", "ModuleRail.tsx with status pips", "Spec page"],
      depends: "M0",
      done: "Lens switcher transforms the atlas graph in place; node click populates provenance; spec page renders with type/color/components.",
    },
    {
      id: "M2", label: "Three high-signal modules: 02 · PPG-NTS, 04 · Wanting, 09 · Cognition",
      blurb: "The three surfaces that establish the lens-switching, contradiction-as-structure, and open-frontier registers. Cognition before others because EVOKE is the field's biggest live tension.",
      blocks: ["StateDial.tsx", "BerridgeBars.tsx", "PairedClaim.tsx (already in shared.jsx)", "Reconciliation cards"],
      depends: "M1",
      done: "All three surfaces fully lens-aware. Paired-claim and tension expand work. Cognition's hero tension reads correctly even with no other modules visible.",
    },
    {
      id: "M3", label: "Workhorse modules: 01 Access · 03 Appetite · 05 Cross-reward · 06 Amygdala · 07 HPA · 08 Hedonic",
      blurb: "Six modules in parallel. Reuse Atlas-graph subgraph rendering plus the wireframe-spec'd central visualisations (cross-section, dose curves, small-multiples, channel toggle, matrix, hotspot map).",
      blocks: ["AnatomySection.svg", "DoseCurves.tsx", "SubstrateGrid.tsx", "ChannelToggle.tsx", "ModeratorMatrix.tsx", "HotspotMap.tsx"],
      depends: "M2",
      done: "All thirteen mechanism modules navigable. Status pips on rail accurate. Provenance panel works for all node ids.",
    },
    {
      id: "M4", label: "Aggregator surfaces: 10 Moderator · 11 Evidence · 12 Phenom (full)",
      blurb: "The cross-cutting surfaces. Moderator and Evidence rely on the full claim/paper graph; Phenom upgrades the current sketch to fully wired component decomposition (still curated content, not free-form generation).",
      blocks: ["ModeratorTable.tsx", "EvidenceTable.tsx", "PhenomDecomposer.tsx (curated dictionary)"],
      depends: "M3",
      done: "All URL routes resolve; filter chips work; phenom guardrails (example-first, gated submit) intact.",
    },
  ];
  return (
    <DocSection
      id="build"
      n="10"
      eyebrow="Build order"
      title="Five milestones. Spine first, then high-signal modules, then workhorse, then aggregators."
      body="Each milestone delivers a navigable artefact. The order is chosen so the visual language gets tested early on three surfaces that exercise different parts of it before the rest of the build commits to it."
    >
      <div style={{ display: "grid", gap: 14 }}>
        {milestones.map(m => (
          <div key={m.id} style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr",
            gap: 24,
            padding: "18px 0",
            borderTop: "0.5px solid var(--rule)",
            alignItems: "start",
          }}>
            <div>
              <div className="mono" style={{ fontSize: 14, color: "var(--accent)", letterSpacing: "0.08em", fontWeight: 500 }}>{m.id}</div>
              <div className="micro" style={{ marginTop: 6, color: "var(--ink-3)" }}>Depends: {m.depends}</div>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, margin: "0 0 6px 0", letterSpacing: "-0.005em" }}>
                {m.label}
              </h3>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 10px 0", maxWidth: 820, textWrap: "pretty" }}>
                {m.blurb}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                {m.blocks.map(b => (
                  <span key={b} className="chip">{b}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 8, marginTop: 8 }}>
                <span className="eyebrow" style={{ color: "var(--ink-3)" }}>Done when</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 13, fontStyle: "italic", color: "var(--ink-1)", textWrap: "pretty" }}>{m.done}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11 · Acceptance criteria

function Acceptance() {
  const passes = [
    "Lens switching is instant (<100ms) and visibly transforms the same surface; no full-component remount.",
    "A first-time reader, given no prior context, infers within 90 seconds that scope chips encode species/route/chronicity.",
    "A clinician opening the cognition module immediately sees both EVOKE and the rodent stack at equal visual weight.",
    "Every claim card carries a confidence glyph and a scope strip without exception.",
    "The phenomenology surface refuses free-form input by design; the example reports are the primary affordance.",
    "Light and dark modes both pass; dark is cool ink, not just inverted light.",
    "Keyboard navigation alone is sufficient to traverse all 13 modules and switch lenses.",
    "Any state visible in the UI is reachable by URL alone — share-and-resume works.",
    "Stewardship pip is present on every module head and reflects last-reviewed date.",
  ];
  const fails = [
    "A tile dashboard view appears anywhere.",
    "Confidence is encoded by colour alone (sienna ≠ low confidence; sienna means contradiction or accent).",
    "Rodent-central-acute chips render in the same visual weight as human-chronic-peripheral chips.",
    "A paired-claim node visually resolves the tension (e.g. one card becomes 'right', other becomes 'wrong').",
    "Lens switching causes a layout shift, scroll jump, or selection loss.",
    "The phenomenology surface accepts free user input and returns chat-bubble reply text.",
    "Open-question cards are footnote-styled; they must use first-class claim-card weight.",
    "Stale-90d entries are hidden by default. They must remain visible — staleness is information.",
  ];
  return (
    <DocSection
      id="accept"
      n="11"
      eyebrow="Acceptance criteria"
      title="Pass conditions and the failures to refuse."
      body="If a build passes the left column and avoids the right column, it is the atlas we set out to build. Either side is binary — there is no partial credit on the failures."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <SubHead>Pass when</SubHead>
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            {passes.map((p, i) => (
              <li key={i} style={{
                fontFamily: "var(--font-serif)",
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "var(--ink-1)",
                marginBottom: 10,
                textWrap: "pretty",
              }}>{p}</li>
            ))}
          </ol>
        </div>
        <div>
          <SubHead accent>Fails when (any of)</SubHead>
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            {fails.map((p, i) => (
              <li key={i} style={{
                fontFamily: "var(--font-serif)",
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "var(--ink-2)",
                marginBottom: 10,
                textWrap: "pretty",
              }}>{p}</li>
            ))}
          </ol>
        </div>
      </div>
    </DocSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer

function Footer() {
  return (
    <footer style={{
      marginTop: 72,
      paddingTop: 32,
      borderTop: "0.5px solid var(--rule-strong)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 32,
    }}>
      <div>
        <div className="eyebrow">Single sharpest test</div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)", margin: "8px 0 0 0", textWrap: "pretty" }}>
          A thoughtful reader, three sessions in, describes the atlas as a thing they trust more than the average
          review article and less than a finished textbook — and feels that calibration is exactly right.
        </p>
      </div>
      <div>
        <div className="eyebrow">Failure mode</div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)", margin: "8px 0 0 0", textWrap: "pretty" }}>
          A reader skims a pretty review article, learns nothing they could not have learned from a podcast,
          and never returns.
        </p>
      </div>
      <div>
        <div className="eyebrow">Success mode</div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)", margin: "8px 0 0 0", textWrap: "pretty" }}>
          A substrate the reader returns to as new evidence accumulates; the lens-switching habit installed;
          pop-science misinterpretations become <em>recognisably</em> wrong.
        </p>
      </div>
      <div style={{
        gridColumn: "1 / -1",
        marginTop: 24,
        paddingTop: 16,
        borderTop: "0.5px solid var(--rule-soft)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}>
        <span className="micro" style={{ color: "var(--ink-3)" }}>
          Implementation Spec v0.1 · prepared for Claude Code · companion to the Atlas Canvas tab
        </span>
        <span className="micro" style={{ color: "var(--ink-3)" }}>
          Tokens: tokens.css · Primitives: shared.jsx · Spec page: /system
        </span>
      </div>
    </footer>
  );
}

Object.assign(window, { Walkthrough });
