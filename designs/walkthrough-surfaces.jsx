// walkthrough-surfaces.jsx — per-surface specifications, ordered 00–12 plus
// global spec page. Each surface follows the same shape: head + wireframe +
// region notes + fact grid + lens-behaviour matrix + build notes.

// ─────────────────────────────────────────────────────────────────────────────
// 00 · Overview Atlas (BUILT)

function SurfaceOverview() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="00"
        code="OVERVIEW · /atlas"
        title="The territory, at a glance."
        purpose="A landing surface that doubles as the central index. Three-region layout: module rail, atlas graph, provenance panel. Lens switching is the central interaction — the same graph re-projects in place, never replaced."
        status="built"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas (default)" },
        { label: "Primary interaction", value: "Lens switch · node select" },
        { label: "Data", value: "All claim & edge nodes" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="00 · Overview · region map" width={1100} height={560}>
        <WFRegion x={0}   y={0}   w={1100} h={64}  label="Brand · Atlas head · stewardship pip" kind="header" n="1" />
        <WFRegion x={0}   y={64}  w={1100} h={40}  label="Lens switcher (6 lenses · keys 1–6)" kind="control" n="2" />
        <WFRegion x={0}   y={104} w={200}  h={416} label="Module rail · 13 modules" kind="rail" n="3" />
        <WFRegion x={200} y={104} w={620}  h={416} label="Atlas graph · SVG · 6 lanes" kind="graph" n="4" />
        <WFRegion x={820} y={104} w={280}  h={416} label="Provenance panel · follows selection" kind="panel" n="5" />
        <WFRegion x={0}   y={520} w={1100} h={40}  label="Stewardship strip · keyboard hints" kind="footer" n="6" />
        {/* lens bar glyph */}
        <WFGlyph x={20} y={86} kind="lensbar" />
        {/* atlas mini layout — lane labels + scattered nodes */}
        <g transform="translate(220, 130)">
          {["Periphery","Access","Brainstem","Limbic","Cortex","Outcome"].map((l, i) => (
            <text key={i} x={i*100} y={0} style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</text>
          ))}
          {[[0,80],[1,90],[2,70],[2,130],[3,80],[3,140],[4,70],[5,90],[5,170]].map(([lx, ly], i) => (
            <circle key={i} cx={lx*100} cy={ly+30} r="14" fill="var(--bg-paper)" stroke="var(--rule-strong)" strokeWidth="0.5" />
          ))}
          {/* edges */}
          {[[0,80,1,90],[1,90,2,70],[2,70,3,80],[3,80,4,70],[4,70,5,90],[2,130,3,140],[3,140,5,170]].map(([a,b,c,d], i) => (
            <line key={i} x1={a*100} y1={b+30} x2={c*100} y2={d+30} stroke="var(--ink-3)" strokeWidth="0.6" />
          ))}
          {/* BBB diaphragm */}
          <rect x={130} y={20} width={6} height={300} fill="url(#wf-hatch)" />
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Atlas head", text: "Eyebrow + display serif title + one-paragraph stance. Right: build version, claim/paper counts, stewardship pip. Never carries marketing language." },
        { n: "2", label: "Lens switcher", text: "Six segmented buttons; active gets a 1.5px sienna underline. Keyboard 1–6 binds globally except when focus is in an editable field. Hint strip on the right shows the active lens's tagline." },
        { n: "3", label: "Module rail", text: "13 mechanism modules numbered 00–12. Status glyphs: ● primary slice, ◇ open frontier. Module rows are click targets that route to /atlas/:moduleId." },
        { n: "4", label: "Atlas graph", text: "Single SVG, 6 vertical lanes top-labelled (Periphery → Access → Brainstem/hypothalamus → Limbic/mesolimbic → Cortex → Outcome). BBB diaphragm rendered as a vertical hatch band when lens ∈ {mechanistic, anatomical}." },
        { n: "5", label: "Provenance panel", text: "Default state: 'Recently updated' list. Selected state: node header + claim cards (confidence-grouped) + lens-aware ordering note. Persists across lens switches." },
        { n: "6", label: "Stewardship strip", text: "Garden cues: count of fresh-since-last-visit, reviewed-this-quarter, stale-90d. Right side surfaces keyboard hints (1–6 lens, / search, ? help)." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "All edges, direction labels", dim: "—", behaviour: "Default. Labels show neurotransmitter or relation (DA, GABA, PPG)." },
        { lens: "Anatomical",  foreground: "Region nodes, BBB diaphragm", dim: "Outcome lane", behaviour: "BBB rendered at full opacity. Outcome nodes dim to 0.35." },
        { lens: "Evidence",    foreground: "Edge weight by confidence", dim: "Speculative · open edges", behaviour: "Strong edges 1.5px; speculative/open drop to ~0.55 opacity." },
        { lens: "Uncertainty", foreground: "Contradicted / open nodes & edges (sienna)", dim: "Settled edges", behaviour: "Paired-claim nodes are interactive — click expands tension card inline in right rail." },
        { lens: "Phenomenology", foreground: "Outcome lane (accent stroke)", dim: "Deep anatomy", behaviour: "Outcome nodes get sienna stroke; deep regions dim to 0.3." },
        { lens: "Moderator",   foreground: "Edges with contextNote", dim: "Mode-independent edges", behaviour: "Edges flipping with route/chronicity show their context label inline." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 01 · Brain access & relay (UNBUILT)

function SurfaceAccess() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="01"
        code="ACCESS · /atlas/access"
        title="How a peripheral drug reaches deep targets."
        purpose="A cross-section diagram of the relay system: plasma → AP/ME (CVOs) → tanycytes → vagal relay → slow transcytosis → brain. The first surface that visibly rejects 'GLP-1 crosses the BBB' as a working model."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/access" },
        { label: "Primary interaction", value: "Toggle timescale (hours/weeks)" },
        { label: "Data", value: "Access-layer subgraph + per-pathway claims" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="01 · Access · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head · one-sentence stance" kind="header" n="1" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={760}  h={372} label="Sagittal cross-section · 4 entry pathways" kind="graph" n="2" />
        <WFRegion x={760} y={128} w={340}  h={186} label="Pathway detail card · selected entry" kind="card" n="3" />
        <WFRegion x={760} y={314} w={340}  h={186} label="Timescale toggle · acute hours / chronic weeks" kind="control" n="4" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* schematic skull/brain */}
        <g transform="translate(60, 150)">
          <path d="M 20 180 Q 20 40 200 30 Q 380 30 500 90 Q 600 130 600 200 Q 580 280 400 290 Q 200 290 60 260 Q 20 230 20 180 Z"
                fill="url(#wf-image)" stroke="var(--rule-strong)" strokeWidth="0.6" />
          {/* CVO ring */}
          <circle cx="380" cy="180" r="22" fill="var(--bg)" stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="2 2" />
          <text x="380" y="183" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>AP/ME</text>
          {/* tanycytes */}
          <ellipse cx="320" cy="160" rx="30" ry="8" fill="var(--bg)" stroke="var(--rule-strong)" strokeWidth="0.5" />
          <text x="320" y="163" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tanycytes</text>
          {/* vagus arrow */}
          <line x1="0" y1="220" x2="280" y2="200" stroke="var(--ink-3)" strokeWidth="0.7" markerEnd="url(#arrow)" />
          <text x="60" y="232" style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vagal afferents</text>
          {/* plasma source */}
          <text x="-40" y="100" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Plasma</text>
          <line x1="-20" y1="105" x2="350" y2="170" stroke="var(--ink-3)" strokeWidth="0.7" markerEnd="url(#arrow)" />
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Stance, not summary", text: "One-sentence orientation: 'GLP-1RAs do not cross the intact BBB; they reach deep targets through sparse, circumferential entry plus vagal relay.' Subtitled with build status and stewardship pip." },
        { n: "2", label: "Cross-section diagram", text: "Sagittal-leaning schematic, hand-rendered. Four entry pathways are visually distinct annotations (CVO, tanycytes, vagus, slow transcytosis). Each is a clickable region. No micro-anatomy detail — pathway topology only." },
        { n: "3", label: "Pathway detail card", text: "Selected pathway surfaces a claim card stack: kinetics, evidence (Gabery/Knudsen IHC, Banks transcytosis screen), scope chips, and a one-line caveat (e.g. 'tanycyte route slow, weeks-scale')." },
        { n: "4", label: "Timescale toggle", text: "Acute (hours) vs Chronic (weeks). Re-weights the edges in (2): acute foregrounds CVOs + vagus; chronic foregrounds transcytosis + tanycytes. Persists in URL hash." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "All four pathways", dim: "—", behaviour: "Direction arrows labelled with mechanism (saturable transport, paracellular, etc.)." },
        { lens: "Anatomical",  foreground: "CVO ring · tanycyte zone", dim: "Behavioural outcomes (n/a here)", behaviour: "Anatomy nomenclature surfaced (AP, ME, OVLT, SFO)." },
        { lens: "Evidence",    foreground: "Pathway with replicated IHC/PET data", dim: "Speculative kinetics", behaviour: "Pathway label gets a scope-chip strip. Single-paper pathways drop to 0.55 opacity." },
        { lens: "Uncertainty", foreground: "Tanycyte route (contested kinetics)", dim: "Settled CVO route", behaviour: "Sienna ring around contested entries. Open question: parenchymal penetration at clinical doses." },
        { lens: "Phenomenology", foreground: "—", dim: "Whole surface", behaviour: "Renders a 'no projection' state — phenomenology lens isn't meaningful here; suggests the Wanting or Phenom mapper instead." },
        { lens: "Moderator",   foreground: "Pathway × dose, route × chronicity", dim: "Single-condition findings", behaviour: "Adds a moderator strip below each pathway: oral vs SC vs ICV." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 02 · PPG-NTS (BUILT)

function SurfacePPGNTS() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="02"
        code="PPG-NTS · /atlas/ppg-nts"
        title="State dial. The phasic-aversive shape of native central GLP-1."
        purpose="A draggable state register (Fasted · Fed · Large meal · Stress · Pharmacologic agonism) drives a circuit visualisation. Pharmacologic state lives outside the natural envelope — visibly sienna — so the anti-hype anchor is the interaction itself."
        status="built"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/ppg-nts" },
        { label: "Primary interaction", value: "State scrubber (5 detents)" },
        { label: "Data", value: "PPG target activations × state matrix" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="02 · PPG-NTS · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={520}  h={372} label="State controls · scrubber + state explainer card" kind="control" n="1" />
        <WFRegion x={520} y={128} w={580}  h={372} label="Circuit view · NTS → targets, per-state activation" kind="graph" n="2" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* dial */}
        <WFGlyph x={50} y={200} kind="dial" />
        {/* state explainer card */}
        <WFRegion x={40} y={260} w={460} h={220} kind="card" label="State explainer · current state highlighted" sub="Plus phasic vs sustained note for pharmacologic state" />
        {/* circuit */}
        <g transform="translate(540, 160)">
          <circle cx="280" cy="280" r="36" fill="var(--bg-paper)" stroke="var(--rule-strong)" strokeWidth="0.7" />
          <text x="280" y="284" textAnchor="middle" style={{ fontFamily: "var(--font-serif)", fontSize: 12, fill: "var(--ink-1)" }}>NTS</text>
          {[["PVN", 60, 60], ["ARC", 180, 60], ["CeA", 380, 60], ["BNST", 60, 180], ["NAc", 380, 180], ["DMH", 180, 180]].map(([l, x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="22" fill={i === 2 ? "var(--accent-bg)" : "var(--bg-paper)"} stroke={i === 2 ? "var(--accent)" : "var(--rule-strong)"} strokeWidth="0.5" />
              <text x={x} y={y+3} textAnchor="middle" style={{ fontFamily: "var(--font-serif)", fontSize: 10, fill: "var(--ink-1)" }}>{l}</text>
              <line x1={x} y1={y+10} x2={280} y2={270} stroke="var(--ink-3)" strokeWidth="0.5" />
            </g>
          ))}
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "State scrubber & explainer", text: "Five detents, draggable + arrow-key navigable. Explainer card below mirrors the dial state: name, glyph (phase moon ○→●), one-sentence physiology, key paper. Pharmacologic state's card carries sienna background — the only place in the system pharmacology is visually flagged as outside-envelope." },
        { n: "2", label: "Circuit view", text: "NTS at the bottom-center; six targets (PVN, ARC, CeA, BNST, NAc, DMH) above with their sublabels. Edge stroke-width interpolates between state activations (0..1) via byState[stateIdx]. Targets crossing >0.8 ring sienna." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "All targets, edge weights from state", dim: "—", behaviour: "Default. Edges labelled with neurotransmitter where canonical (e.g. PPG, GABA)." },
        { lens: "Anatomical",  foreground: "Brainstem/hypothalamus anatomy", dim: "Outcome inferences", behaviour: "Renders an inset showing dorsomedial brainstem anatomy at higher fidelity." },
        { lens: "Evidence",    foreground: "Targets with replicated activation data", dim: "Single-paper targets", behaviour: "Each target gets a small confidence-bar; speculative ones go translucent." },
        { lens: "Uncertainty", foreground: "Pharmacologic state's deviation from native envelope", dim: "Settled physiological states", behaviour: "Overlays a 'departure band' on the dial — the sienna gap between Stress and Pharmacologic." },
        { lens: "Phenomenology", foreground: "Targets gated to subjective channels (nausea, satiety, anxiety)", dim: "Anatomy-only targets", behaviour: "Each target carries a one-word felt-state badge (e.g. CeA → 'aversive')." },
        { lens: "Moderator",   foreground: "State × dose × route table", dim: "State-agnostic edges", behaviour: "A small moderator strip appears under the dial; shows how peripheral chronic differs from ICV acute." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 · Appetite · meal end (UNBUILT)

function SurfaceAppetite() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="03"
        code="APPETITE · /atlas/appetite"
        title="Meal end, not appetite suppression."
        purpose="Why intake falls: ARC POMC/AgRP rebalancing + NTS satiation channels + gastric distension input. Decomposes anorectic effect from nausea threshold — they are adjacent but separable, and the dose response makes this visible."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/appetite" },
        { label: "Primary interaction", value: "Dose scrubber" },
        { label: "Data", value: "Anorectic + nausea dose curves" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="03 · Appetite · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={440}  h={372} label="Energy balance loop · circuit" kind="graph" n="1" />
        <WFRegion x={440} y={128} w={420}  h={186} label="Anorectic vs nausea · paired dose curves" kind="card" n="2" />
        <WFRegion x={440} y={314} w={420}  h={186} label="Meal-end timeline · seconds-to-hours" kind="card" n="3" />
        <WFRegion x={860} y={128} w={240}  h={372} label="Claim stack · grouped by tissue" kind="panel" n="4" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* dual curves sketch */}
        <g transform="translate(460, 160)">
          <line x1="0" y1="110" x2="380" y2="110" stroke="var(--rule)" strokeWidth="0.4" />
          <line x1="0" y1="10" x2="0" y2="110" stroke="var(--rule)" strokeWidth="0.4" />
          <path d="M 0 105 Q 60 90 120 60 Q 200 30 320 25" fill="none" stroke="var(--ink-2)" strokeWidth="0.8" />
          <path d="M 0 108 Q 100 105 180 95 Q 260 70 320 30" fill="none" stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="270" y="22" style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Anorectic</text>
          <text x="270" y="42" style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Nausea</text>
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Energy balance loop", text: "ARC POMC↑ / AgRP↓, NTS satiation, vagal gastric distension. Loop closes through PVN to autonomic output. Lens governs which arrows label." },
        { n: "2", label: "Dose-curve pair", text: "Two curves on shared axes: anorectic effect and nausea threshold. Therapeutic window is the band between them, narrowing at high dose. Dose scrubber drives a moving readout." },
        { n: "3", label: "Meal-end timeline", text: "Seconds-to-hours strip showing gastric distension → vagal afferent → NTS PPG burst → hypothalamic loop closure → reported satiety. Useful for grounding pharmacology against physiology." },
        { n: "4", label: "Claim stack", text: "Right-rail claims grouped by tissue (gut, brainstem, hypothalamus). Scope chips visible by default. Standard ClaimCard component." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Loop + curves", dim: "—", behaviour: "Default state." },
        { lens: "Anatomical",  foreground: "ARC · NTS · vagal nuclei", dim: "Dose curves", behaviour: "Curves dim; anatomy detail comes up." },
        { lens: "Evidence",    foreground: "Curves with replication shading", dim: "Single-study points", behaviour: "Bands of uncertainty drawn around each curve." },
        { lens: "Uncertainty", foreground: "Dose-window narrowing", dim: "Settled physiology", behaviour: "Foregrounds the question of where anorexia ends and aversion begins." },
        { lens: "Phenomenology", foreground: "Felt satiety vs nausea reports", dim: "Anatomy", behaviour: "Curves relabel as 'fullness' / 'queasy' — patient-facing register." },
        { lens: "Moderator",   foreground: "Dose × titration speed", dim: "Steady-state-only data", behaviour: "Reveals titration moderator — fast titration narrows the therapeutic window." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 04 · Mesolimbic wanting (BUILT)

function SurfaceWanting() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="04"
        code="WANTING · /atlas/wanting"
        title="Rebalancing, not blunting."
        purpose="The Berridge decomposition is the default frame. Bars for wanting/liking/learning/effort; the VTA→NAc→VP→PFC circuit beside them; the Kooji-vs-canonical contradiction rendered as a paired-claim node, not as hedged prose."
        status="built"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/wanting" },
        { label: "Primary interaction", value: "Hover/click on Berridge bars · expand paired-claim" },
        { label: "Data", value: "Berridge components, paired claims (Kooji vs canonical), scope grid" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="04 · Wanting · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher (default = uncertainty)" kind="control" />
        <WFRegion x={0}   y={128} w={550}  h={200} label="Berridge decomposition · bars" kind="card" n="1" />
        <WFRegion x={550} y={128} w={550}  h={200} label="Circuit · VTA → NAc → VP → PFC" kind="graph" n="2" />
        <WFRegion x={0}   y={328} w={760}  h={172} label="Kooji paired-claim · tension node" kind="card" n="3" />
        <WFRegion x={760} y={328} w={340}  h={172} label="Scope grid · species × route × chronicity" kind="panel" n="4" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        <WFGlyph x={40} y={240} kind="barchart" />
        <WFGlyph x={650} y={358} kind="tensionpair" />
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Berridge bars", text: "Four bars: wanting (strong↓), liking (open), learning (moderate↓), effort (moderate↓). Each labelled with confidence glyph beside the bar tip. Hover surfaces the canonical paper(s)." },
        { n: "2", label: "Circuit", text: "VTA → NAc → VP → PFC with hedonic-hotspot annotations on NAc shell and VP. Edge weights confidence-encoded. PFC has a top-down regulatory arrow returning to VTA." },
        { n: "3", label: "Kooji paired-claim", text: "PairedClaim node — left card: canonical dopamine-blunting (Egecioglu/Jerlhag); right card: Kooji photometry preserved/enhanced consummatory DA. Bridge label: 'dopamine blunting · vs preserved-enhanced.' Reconciliation note below." },
        { n: "4", label: "Scope grid", text: "Small species × route × chronicity grid showing which cells have evidence and which are blank. Rodent central acute and human chronic peripheral visibly weighted differently." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Circuit + bars", dim: "—", behaviour: "Default." },
        { lens: "Anatomical",  foreground: "Circuit", dim: "Berridge bars", behaviour: "Bars compress to a strip; circuit gets full canvas." },
        { lens: "Evidence",    foreground: "Bars with replication shading", dim: "Speculative annotations", behaviour: "Liking bar grays out (no clean evidence)." },
        { lens: "Uncertainty", foreground: "Kooji paired-claim", dim: "Settled wanting↓ claim", behaviour: "Tension node pulses; canonical-arrow weight reduced to communicate active dispute." },
        { lens: "Phenomenology", foreground: "Liking vs wanting components labelled in patient register", dim: "Circuit detail", behaviour: "Bars relabel: wanting → 'pull', liking → 'enjoyment when it starts'." },
        { lens: "Moderator",   foreground: "Scope grid", dim: "Bars", behaviour: "Scope grid becomes the central panel; clicking a cell filters the bars to that subgrid." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 05 · Cross-reward (UNBUILT)

function SurfaceCrossReward() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="05"
        code="CROSS-REWARD · /atlas/cross-reward"
        title="Shared incentive-salience circuitry, substrate by substrate."
        purpose="A small-multiples panel: alcohol, nicotine, opioids, gambling, compulsive shopping. Each cell has human and rodent evidence on a vertical confidence axis. SEMALCO and Hendershot foregrounded on alcohol; the rest live on speculative-to-moderate ground."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/cross-reward" },
        { label: "Primary interaction", value: "Substrate select · human/rodent toggle" },
        { label: "Data", value: "Substrate-claim matrix with paper refs" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="05 · Cross-reward · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={1100} h={232} label="Small-multiples grid · substrate × evidence-type" kind="graph" n="1" />
        <WFRegion x={0}   y={360} w={680}  h={140} label="Selected substrate · claim cards" kind="panel" n="2" />
        <WFRegion x={680} y={360} w={420}  h={140} label="Shared-circuit overlay · what mesolimbic in common" kind="card" n="3" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* small multiples sketch */}
        <g transform="translate(40, 150)">
          {["Alcohol","Nicotine","Opioids","Gambling","Shopping"].map((l, i) => (
            <g key={i} transform={`translate(${i*200},0)`}>
              <rect width="170" height="190" fill="var(--bg)" stroke="var(--rule)" strokeWidth="0.4" />
              <text x="10" y="18" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</text>
              <line x1="10" y1="160" x2="160" y2="160" stroke="var(--rule)" strokeWidth="0.3" />
              {/* two stacks: human + rodent */}
              <rect x="30"  y={160 - (i === 0 ? 100 : i < 3 ? 36 : 18)} width="36" height={i === 0 ? 100 : i < 3 ? 36 : 18} fill="var(--ink-2)" opacity="0.6" />
              <rect x="80"  y={160 - (i < 3 ? 80 : 30)} width="36" height={i < 3 ? 80 : 30} fill="var(--ink-3)" opacity="0.4" />
              <text x="48"  y="174" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, fill: "var(--ink-3)" }}>HUM</text>
              <text x="98"  y="174" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, fill: "var(--ink-3)" }}>RAT/MUS</text>
            </g>
          ))}
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Small-multiples grid", text: "Five substrate cells in a row. Each cell shows two stacked bars: human evidence height + rodent evidence height. Bar height encodes count × confidence; color stays neutral, opacity encodes confidence. Cell click selects the substrate." },
        { n: "2", label: "Selected substrate", text: "Claim cards for the selected substrate, default-sorted by confidence. Alcohol shows SEMALCO and Hendershot at the top; gambling shows case reports and a moderator-aware caveat." },
        { n: "3", label: "Shared-circuit overlay", text: "A simplified version of the mesolimbic circuit showing the nodes implicated for the selected substrate. Hover a node to see the substrate-specific edge confidence." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Shared-circuit overlay", dim: "—", behaviour: "Default." },
        { lens: "Anatomical",  foreground: "Mesolimbic nodes per substrate", dim: "Behavioural metrics", behaviour: "Overlay (3) takes the canvas." },
        { lens: "Evidence",    foreground: "Per-substrate stacks", dim: "—", behaviour: "Stacks scale by N studies; tooltips show top paper." },
        { lens: "Uncertainty", foreground: "Gambling, shopping (case-report only)", dim: "Alcohol", behaviour: "Speculative cells get sienna outline — visibly less-supported." },
        { lens: "Phenomenology", foreground: "Patient-report quotes per substrate", dim: "Counts", behaviour: "Bars compress; quote strip appears under each cell." },
        { lens: "Moderator",   foreground: "Dose × baseline craving severity", dim: "Average-effect bars", behaviour: "Filters: switches stacks to subgroup means." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 06 · Amygdala · GABA · aversive (UNBUILT)

function SurfaceAmygdala() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="06"
        code="AMYGDALA · /atlas/amygdala"
        title="Aversive interoception is doing more work than dopamine alone."
        purpose="The CeA-GABA channel. Chuong/Farokhnia/Khom is the anchor — semaglutide's alcohol effect goes through CeA GABA, not solely dopaminergic suppression. Acute-central versus chronic-peripheral contrast is the surface's main visual."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/amygdala" },
        { label: "Primary interaction", value: "Channel toggle (DA · GABA) · acute/chronic toggle" },
        { label: "Data", value: "CeA + BNST edges, anxiogenic ICV claims" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="06 · Amygdala · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={700}  h={372} label="CeA / BNST circuit · two channels (DA, GABA)" kind="graph" n="1" />
        <WFRegion x={700} y={128} w={400}  h={186} label="Acute ICV vs chronic peripheral · split panel" kind="card" n="2" />
        <WFRegion x={700} y={314} w={400}  h={186} label="Claim stack · anxiogenic vs aversive-channel" kind="panel" n="3" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* circuit sketch */}
        <g transform="translate(80, 170)">
          {[["CeA", 200, 60], ["BNST", 350, 130], ["NAc", 480, 60], ["NTS", 80, 200], ["VTA", 200, 220]].map(([l, x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="24" fill={l === "CeA" ? "var(--accent-bg)" : "var(--bg-paper)"} stroke={l === "CeA" ? "var(--accent)" : "var(--rule-strong)"} strokeWidth="0.6" />
              <text x={x} y={y+3} textAnchor="middle" style={{ fontFamily: "var(--font-serif)", fontSize: 11, fill: "var(--ink-1)" }}>{l}</text>
            </g>
          ))}
          {/* GABA arrow CeA → NAc */}
          <line x1="220" y1="60" x2="460" y2="60" stroke="var(--accent)" strokeWidth="1.2" markerEnd="url(#arrow-accent)" />
          <text x="340" y="50" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>GABA</text>
          {/* DA arrow VTA → NAc */}
          <line x1="220" y1="200" x2="460" y2="80" stroke="var(--ink-3)" strokeWidth="0.6" strokeDasharray="3 2" markerEnd="url(#arrow)" />
          <text x="340" y="170" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>DA (dimmed)</text>
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Two-channel circuit", text: "Same nodes, two arrows: GABA from CeA→NAc and DA from VTA→NAc. Channel toggle in (2) raises/dims each. Visible answer to 'is this dopamine?' lives in the toggle itself." },
        { n: "2", label: "Acute vs chronic split", text: "Two thumb-cards side by side. Acute ICV: anxiogenic (Kinzig 2003). Chronic peripheral: alcohol reduction via CeA GABA (Chuong/Farokhnia/Khom 2023). Scope chips on both — the rodent-central-acute chip wears its translation-fragile sienna." },
        { n: "3", label: "Claim stack", text: "Right-rail claims, default-sorted by Anxiogenic vs Aversive-channel. Filter pill at top toggles between them." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Both channels", dim: "—", behaviour: "Default." },
        { lens: "Anatomical",  foreground: "CeA subnuclei (CeL/CeM/CeC) detail", dim: "Distant nodes", behaviour: "Zooms inset showing CeA microanatomy." },
        { lens: "Evidence",    foreground: "GABA channel (better replicated)", dim: "DA channel", behaviour: "Confidence-weighted strokes." },
        { lens: "Uncertainty", foreground: "Acute-ICV vs chronic-peripheral split (2)", dim: "—", behaviour: "Surfaces this surface's central translation question." },
        { lens: "Phenomenology", foreground: "Anxious / aversive felt reports", dim: "Circuit detail", behaviour: "Nodes carry felt-state badges." },
        { lens: "Moderator",   foreground: "Route × chronicity", dim: "—", behaviour: "Channel toggle becomes a 2×2 grid." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 07 · HPA · stress · anxiety (UNBUILT)

function SurfaceHPA() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="07"
        code="HPA · /atlas/hpa"
        title="Bidirectional anxiety effect. Acute up, chronic peripheral neutral."
        purpose="The clearest moderator surface in the atlas. Same drug, opposite signs depending on route and chronicity. Acute central GLP-1 is anxiogenic (Kinzig); chronic peripheral therapeutic is approximately neutral-to-favourable on anxiety (Wang Nat Med 2024)."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/hpa" },
        { label: "Primary interaction", value: "Route × chronicity matrix · cell select" },
        { label: "Data", value: "Anxiety + HPA tone claims, scope-conditioned" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="07 · HPA · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={520}  h={372} label="Route × chronicity matrix · sign-encoded cells" kind="graph" n="1" />
        <WFRegion x={520} y={128} w={580}  h={186} label="Loop diagram · PVN-CRH-HPA" kind="graph" n="2" />
        <WFRegion x={520} y={314} w={580}  h={186} label="Claim stack · for selected cell" kind="panel" n="3" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* matrix sketch */}
        <g transform="translate(60, 170)">
          <text x="100" y="0" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Acute</text>
          <text x="240" y="0" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Subacute</text>
          <text x="380" y="0" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Chronic</text>
          {["Periph TX", "Periph EXP", "ICV", "Parench"].map((r, ri) => (
            <g key={ri} transform={`translate(0,${30 + ri*70})`}>
              <text x="-10" y="36" textAnchor="end" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{r}</text>
              {[0,1,2].map(ci => {
                const sign = (ri >= 2 && ci === 0) ? "+" : (ri === 0 && ci === 2) ? "·" : (ri >= 2 && ci > 0) ? "+" : "·";
                const accent = sign === "+";
                return (
                  <g key={ci}>
                    <rect x={20 + ci*140} y={0} width="120" height="60" fill={accent ? "var(--accent-bg)" : "var(--bg)"} stroke={accent ? "var(--accent)" : "var(--rule)"} strokeWidth="0.5" />
                    <text x={80 + ci*140} y={36} textAnchor="middle" style={{ fontFamily: "var(--font-serif)", fontSize: 18, fill: accent ? "var(--accent)" : "var(--ink-3)" }}>{sign}</text>
                  </g>
                );
              })}
            </g>
          ))}
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Route × chronicity matrix", text: "4 rows (peripheral TX, peripheral experimental, ICV, parenchymal) × 3 columns (acute, subacute, chronic). Cells: sienna '+' = anxiogenic, neutral '·' = no robust signal, ink '–' = anxiolytic. Empty cells visibly empty — gaps are first-class." },
        { n: "2", label: "PVN-CRH loop", text: "PPG-NTS → PVN-CRH → ACTH → cortisol → feedback. Edge weights driven by selected cell — acute-ICV lights up the loop; chronic-peripheral leaves it nearly flat." },
        { n: "3", label: "Claim stack", text: "Default: top three claims for selected cell. If cell empty, displays an explicit 'No claims · open question.'" },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Loop", dim: "—", behaviour: "Default." },
        { lens: "Anatomical",  foreground: "PVN-CRH detail", dim: "Matrix", behaviour: "Matrix compresses to a strip." },
        { lens: "Evidence",    foreground: "Cells with replicated data", dim: "—", behaviour: "Cell opacity encodes replication count." },
        { lens: "Uncertainty", foreground: "Cells with conflicting findings", dim: "—", behaviour: "Conflicting cells get ⇄; click expands a paired-claim." },
        { lens: "Phenomenology", foreground: "Patient-anxiety reports", dim: "Loop detail", behaviour: "Loop replaced by a felt-state strip." },
        { lens: "Moderator",   foreground: "Matrix itself", dim: "—", behaviour: "Default matrix becomes the canvas; cells become navigable as moderators." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 08 · Hedonic tone (UNBUILT)

function SurfaceHedonic() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="08"
        code="HEDONIC · /atlas/hedonic"
        title="Liking is mostly uncharted. That has to be the headline."
        purpose="A deeper Berridge surface. Hedonic-hotspot map (NAc shell, VP, parabrachial) on the left; 'what we don't know' panel on the right, given equal weight. Refuses the dopamine-down collapse."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/hedonic" },
        { label: "Primary interaction", value: "Hotspot select · open-question expand" },
        { label: "Data", value: "Hotspot map + open-question registry" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="08 · Hedonic · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={600}  h={372} label="Hedonic-hotspot map · NAc shell, VP, parabrachial" kind="graph" n="1" />
        <WFRegion x={600} y={128} w={500}  h={372} label="Open-question registry · equal-weight panel" kind="panel" n="2" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Hotspot map", text: "Anatomical inset (NAc shell, VP, parabrachial); each hotspot click expands an evidence panel showing whether GLP-1R has been shown to modulate it. Mostly: not shown either way. Honest blanks." },
        { n: "2", label: "Open-question registry", text: "Three to six open questions, each rendered as a card with ◇ glyph: 'Does chronic peripheral semaglutide degrade orofacial liking?', 'Are NAc shell μ-opioid hotspots modulated by GLP-1R?', etc. Same visual weight as a claim card. The honest unsettledness." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Hotspot circuit", dim: "—", behaviour: "Default." },
        { lens: "Anatomical",  foreground: "Hotspot anatomy", dim: "Open questions", behaviour: "Hotspot map zooms; registry compresses." },
        { lens: "Evidence",    foreground: "—", dim: "Whole map dims", behaviour: "Renders the 'mostly absent' state as a deliberate visual silence." },
        { lens: "Uncertainty", foreground: "Open-question registry", dim: "Hotspot map", behaviour: "Registry takes the canvas; this is the lens that pays off." },
        { lens: "Phenomenology", foreground: "Anhedonia reports vs liking-loss reports", dim: "Anatomy", behaviour: "Registry relabels in patient register." },
        { lens: "Moderator",   foreground: "Subgroup vulnerability questions", dim: "Population averages", behaviour: "Registry filters to subgroup-sensitive opens." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 09 · Neuroimmune · cognition (OPEN FRONTIER)

function SurfaceCognition() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="09"
        code="COGNITION · /atlas/cognition"
        title="EVOKE was negative. The rodent story was strong. The atlas must hold both."
        purpose="The flagship tension surface. Two-column paired-claim writ large: human RCT (EVOKE / EVOKE+) on the left, rodent neuroimmune mechanism (BDNF↑, microglia↓, LTP) on the right. The bridge carries the actual reconciliation candidates."
        status="open"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/cognition" },
        { label: "Primary interaction", value: "Reconciliation-candidate expand" },
        { label: "Data", value: "EVOKE/EVOKE+ + Hölscher rodent stack" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="09 · Cognition · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher (default = uncertainty)" kind="control" />
        <WFRegion x={0}   y={128} w={1100} h={220} label="Hero paired-claim · EVOKE vs rodent neuroimmune" kind="card" n="1" />
        <WFRegion x={0}   y={348} w={680}  h={152} label="Reconciliation candidates · cards" kind="panel" n="2" />
        <WFRegion x={680} y={348} w={420}  h={152} label="Open-question registry · cognition" kind="panel" n="3" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* big tension pair */}
        <g transform="translate(60, 160)">
          <rect width="440" height="170" fill="var(--bg-paper)" stroke="var(--rule)" strokeWidth="0.5" />
          <text x="20" y="28" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Human · EVOKE / EVOKE+</text>
          <text x="20" y="56" style={{ fontFamily: "var(--font-serif)", fontSize: 13, fill: "var(--ink-1)" }}>Oral semaglutide did not benefit CDR-SB</text>
          <text x="20" y="74" style={{ fontFamily: "var(--font-serif)", fontSize: 13, fill: "var(--ink-1)" }}>over 2y in mild AD (n=3808).</text>
          <rect x="450" y="0" width="60" height="170" fill="var(--accent-bg)" stroke="var(--accent-rule)" strokeWidth="0.5" strokeDasharray="2 2" />
          <text x="480" y="92" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 16, fill: "var(--accent)" }}>⇄</text>
          <rect x="520" width="440" height="170" fill="var(--bg-paper)" stroke="var(--rule)" strokeWidth="0.5" />
          <text x="540" y="28" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Rodent · Hölscher et al.</text>
          <text x="540" y="56" style={{ fontFamily: "var(--font-serif)", fontSize: 13, fill: "var(--ink-1)" }}>Liraglutide ↑ BDNF, ↑ hippocampal LTP,</text>
          <text x="540" y="74" style={{ fontFamily: "var(--font-serif)", fontSize: 13, fill: "var(--ink-1)" }}>↓ microglial activation, multiple models.</text>
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Hero paired-claim", text: "Two PairedClaim cards at large scale. Left card carries the human RCT, scope chips weighted (human · oral · chronic). Right card carries the rodent stack — chips visibly preclinical. Tension bridge is wider than usual to communicate the magnitude of the gap." },
        { n: "2", label: "Reconciliation candidates", text: "Cards listing live hypotheses: 'wrong drug', 'wrong route (oral PK)', 'wrong stage (already MCI/AD)', 'mechanism real but effect size below detection', 'rodent endpoint not equivalent to clinical endpoint'. Each carries its own confidence and any supporting paper." },
        { n: "3", label: "Open-question registry", text: "What's still open: prevention vs treatment; injectable vs oral; subgroup responder analyses; longer follow-up. Each ◇ card. Surface accepts honest 'we don't know yet.'" },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Both columns + reconciliation", dim: "—", behaviour: "Default." },
        { lens: "Anatomical",  foreground: "Hippocampal/microglial detail (rodent column)", dim: "RCT design summary (human column)", behaviour: "Right column foregrounds anatomy." },
        { lens: "Evidence",    foreground: "RCT N · power · endpoint", dim: "Rodent preclinical stack", behaviour: "Confidence-bars dominate; human RCT becomes a single 3-bar card." },
        { lens: "Uncertainty", foreground: "Hero tension + reconciliation", dim: "—", behaviour: "Default-recommended lens for this surface." },
        { lens: "Phenomenology", foreground: "Patient-reported cognition", dim: "Biomarker detail", behaviour: "Adds patient-quote micro-strip under the tension." },
        { lens: "Moderator",   foreground: "Drug × route × stage", dim: "Pooled effect", behaviour: "Reconciliation cards become moderators." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10 · Moderator dashboard (UNBUILT)

function SurfaceModerator() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="10"
        code="MODERATOR · /atlas/moderator"
        title="Edges that flip with dose, route, chronicity, species."
        purpose="Global table of moderator-sensitive edges. Filters: species × route × chronicity × drug × assay. Each row is an edge with two states ('default' and 'when moderator applied'). The atlas's most explicitly auditory surface."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/moderator" },
        { label: "Primary interaction", value: "Filter chips · row expand" },
        { label: "Data", value: "All edges where contextNote ≠ ∅" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="10 · Moderator · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher (default = moderator)" kind="control" />
        <WFRegion x={0}   y={128} w={1100} h={56}  label="Filter strip · species · route · chronicity · drug · assay" kind="control" n="1" />
        <WFRegion x={0}   y={184} w={1100} h={316} label="Edge table · grouped by mechanism module" kind="graph" n="2" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
        {/* table sketch */}
        <g transform="translate(20, 200)">
          {[0,1,2,3,4,5,6,7].map(i => (
            <g key={i} transform={`translate(0,${i*36})`}>
              <line x1="0" y1="34" x2="1060" y2="34" stroke="var(--rule-soft)" strokeWidth="0.4" />
              <rect x="0" y="6" width="220" height="24" fill="var(--bg)" stroke="var(--rule)" strokeWidth="0.3" />
              <rect x="240" y="6" width="80" height="24" fill="var(--bg)" stroke="var(--rule)" strokeWidth="0.3" />
              <rect x="340" y="6" width="80" height="24" fill="var(--bg)" stroke="var(--rule)" strokeWidth="0.3" />
              <rect x="440" y="6" width="160" height="24" fill={i % 2 ? "var(--accent-bg)" : "var(--bg)"} stroke={i % 2 ? "var(--accent)" : "var(--rule)"} strokeWidth="0.3" />
              <rect x="620" y="6" width="160" height="24" fill="var(--bg)" stroke="var(--rule)" strokeWidth="0.3" />
              <rect x="800" y="6" width="260" height="24" fill="var(--bg-tint)" stroke="var(--rule)" strokeWidth="0.3" />
            </g>
          ))}
        </g>
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Filter strip", text: "Chips that compose a query: species ∈ {hum, rat, mus, nhp, cell}, route ∈ {…}, chronicity, drug, assay. URL-shareable. Default selection makes 'human · peripheral · chronic' the comparison baseline." },
        { n: "2", label: "Edge table", text: "Columns: Edge (from→to) · Mechanism module · Default direction · Direction when moderator applied · Confidence · Source. Rows where the moderator FLIPS the sign get sienna fill. Click expands a row to a mini paired-claim card." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Default-direction column", dim: "Moderator column", behaviour: "Reveals the 'normal' graph reading." },
        { lens: "Anatomical",  foreground: "Mechanism module column", dim: "Source column", behaviour: "Groups visually by module." },
        { lens: "Evidence",    foreground: "Confidence + source columns", dim: "Direction columns", behaviour: "Sortable by confidence ↓." },
        { lens: "Uncertainty", foreground: "Flipping rows", dim: "Stable rows", behaviour: "Flipping rows pulse on hover; non-flipping rows fade to 0.4." },
        { lens: "Phenomenology", foreground: "—", dim: "Whole surface", behaviour: "Renders 'no projection' state with link to /atlas/phenom." },
        { lens: "Moderator",   foreground: "Whole table", dim: "—", behaviour: "Default-recommended lens." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11 · Evidence workbench (UNBUILT)

function SurfaceEvidence() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="11"
        code="EVIDENCE · /atlas/evidence"
        title="Paper-level register. The bibliographic backstop."
        purpose="Source-of-truth view at the paper level. Each row: paper, year, design, N, claims it supports, replication status. Searchable, scope-filterable. The surface that lets a sceptical reader audit any single edge end-to-end."
        status="unbuilt"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/evidence" },
        { label: "Primary interaction", value: "Search · scope filter · row expand" },
        { label: "Data", value: "Paper registry × claim graph (reverse index)" },
        { label: "Width target", value: "≥ 1280px" },
      ]} />
      <Wireframe label="11 · Evidence · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head" kind="header" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher" kind="control" />
        <WFRegion x={0}   y={128} w={780}  h={56}  label="Search · sort · scope filter strip" kind="control" n="1" />
        <WFRegion x={780} y={128} w={320}  h={56}  label="Replication summary · counts" kind="control" n="2" />
        <WFRegion x={0}   y={184} w={780}  h={316} label="Paper table · scope chips inline" kind="graph" n="3" />
        <WFRegion x={780} y={184} w={320}  h={316} label="Paper detail · selected row" kind="panel" n="4" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Search / sort / filter strip", text: "Single-input search (citation, author, drug, assay) + scope chips. Slash-key globally focuses search. Sort: year · N · replication count · confidence carried." },
        { n: "2", label: "Replication summary", text: "Three pips: 'replicated' (≥2 independent), 'single' (one trial), 'contradicted'. Click a pip to filter the table." },
        { n: "3", label: "Paper table", text: "Columns: Author · Year · Design · N · Scope chips · Claims supported (count) · Replication status. Row click selects." },
        { n: "4", label: "Paper detail", text: "Selected paper's claims listed with the canonical statement, scope, confidence, and the edges they back. From here a user can jump straight to any mechanism module via the edge link." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Claims-supported column", dim: "Design column", behaviour: "Default." },
        { lens: "Anatomical",  foreground: "Region tags on each paper", dim: "—", behaviour: "Adds a region-tag column." },
        { lens: "Evidence",    foreground: "Whole surface", dim: "—", behaviour: "Default-recommended lens." },
        { lens: "Uncertainty", foreground: "Contradicting / paired papers", dim: "Independent confirmations", behaviour: "Group rows by their tension partner." },
        { lens: "Phenomenology", foreground: "Patient-report-derived rows", dim: "Mechanistic papers", behaviour: "Filters to qualitative / EHR papers." },
        { lens: "Moderator",   foreground: "Scope chips column", dim: "—", behaviour: "Highlights chips that vary across the supported claims." },
      ]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12 · Phenomenology mapper (BUILT · sketch)

function SurfacePhenom() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="12"
        code="PHENOM · /atlas/phenom"
        title="Structured decomposition. Never an answer."
        purpose="Patient-report input → component decomposition with weights, confidences, and mechanism links. The riskiest surface — the contract is that we hand back structure, not diagnosis. Pre-set example reports are the primary affordance; free input is gated and explicit."
        status="partial"
      />
      <FactGrid items={[
        { label: "Route", value: "/atlas/phenom" },
        { label: "Primary interaction", value: "Pick example · submit text · expand component" },
        { label: "Data", value: "Component decomposition (curated)" },
        { label: "Width target", value: "≥ 1140px" },
      ]} />
      <Wireframe label="12 · Phenom · region map" width={1100} height={540}>
        <WFRegion x={0}   y={0}   w={1100} h={88}  label="Artboard head · explicit framing" kind="header" n="1" />
        <WFRegion x={0}   y={88}  w={1100} h={40}  label="Lens switcher (default = phenomenology)" kind="control" />
        <WFRegion x={0}   y={128} w={420}  h={372} label="Input panel · example reports + textarea" kind="control" n="2" />
        <WFRegion x={420} y={128} w={680}  h={372} label="Decomposition panel · component cards" kind="card" n="3" />
        <WFRegion x={0}   y={500} w={1100} h={40}  label="Stewardship strip" kind="footer" />
      </Wireframe>
      <WFNotes notes={[
        { n: "1", label: "Framing", text: "Explicit copy on the head: 'Structure handed back, not an answer.' The atlas's most important register guard — phenomenology lives behind a deliberate framing layer." },
        { n: "2", label: "Input panel", text: "Six curated example reports above the textarea. Submission gated by an explicit toggle ('I understand this is not diagnostic'). No free chat affordance — this is structured AI, not a chat surface." },
        { n: "3", label: "Decomposition", text: "Component cards: weight (bar), confidence (glyph), mechanism links (chips), rationale (1-2 sentences). Order by weight. Below: 'caveats' block with multi-component co-activation reminder. Mechanism chips deep-link to /atlas/:moduleId." },
      ]} />
      <SubHead>Lens behaviour</SubHead>
      <LensMatrix rows={[
        { lens: "Mechanistic", foreground: "Mechanism-link chips on each component", dim: "Patient quotation", behaviour: "Pivots toward circuit explanation." },
        { lens: "Anatomical",  foreground: "Region tags on components", dim: "Phenomenology rationale prose", behaviour: "Each component carries an anatomical badge." },
        { lens: "Evidence",    foreground: "Confidence glyphs · backing papers", dim: "Weight bars", behaviour: "Rationale text expands with citations." },
        { lens: "Uncertainty", foreground: "Caveats block", dim: "Component bars", behaviour: "Caveats block becomes the primary panel." },
        { lens: "Phenomenology", foreground: "Whole surface", dim: "—", behaviour: "Default-recommended lens. Bars and quotes in patient register." },
        { lens: "Moderator",   foreground: "Subgroup vulnerability per component", dim: "Population-average weights", behaviour: "Adds 'modifies in' badge to components likely subgroup-sensitive." },
      ]} />
      <Callout kind="warn" title="Anti-pattern guard">
        <strong>Do not</strong> render a chat thread under any circumstance. The phenomenology surface is structured-AI:
        input → decomposition. Even a single open-ended free-input affordance without the example-first scaffold
        breaks the register and is the most likely failure mode of this entire build.
      </Callout>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Spec page (BUILT)

function SurfaceSpec() {
  return (
    <article style={{ marginTop: 48 }}>
      <SurfaceHead
        n="—"
        code="SPEC · /system"
        title="Visual language canon."
        purpose="Type · color · lens vocabulary · confidence · scope · components · anti-patterns. The reference doc that earlier work froze; this Implementation Spec extends it with build instructions per surface."
        status="built"
      />
      <Prose>
        Tokens are defined in <Code>tokens.css</Code>. Component primitives live in <Code>shared.jsx</Code> and are
        consumed by every surface. The spec page (rendered as an artboard at <Code>id="spec"</Code> on the Atlas
        canvas tab) is the canonical reference for type ramp, color, confidence vocabulary, scope chips, and the
        anti-patterns list. This walkthrough does not duplicate it — it builds on it.
      </Prose>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

Object.assign(window, {
  SurfaceOverview, SurfaceAccess, SurfacePPGNTS, SurfaceAppetite,
  SurfaceWanting, SurfaceCrossReward, SurfaceAmygdala, SurfaceHPA,
  SurfaceHedonic, SurfaceCognition, SurfaceModerator, SurfaceEvidence,
  SurfacePhenom, SurfaceSpec,
});
