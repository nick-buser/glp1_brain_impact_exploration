// artboard-ppg-nts.jsx — PPG-NTS / native central GLP-1 system.
// Centrepiece interaction: the state scrubber. Drag through FASTED → FED →
// LARGE MEAL → STRESS → PHARMACOLOGIC AGONISM and the projections recompose.

const { useState: useStatePPG, useRef: useRefPPG, useEffect: useEffectPPG } = React;

const STATES = [
  { id: "fasted",   label: "Fasted",          glyph: "○",   note: "PPG-NTS suppressed — Rinaman et al.",       activity: 0.05 },
  { id: "fed",      label: "Fed",             glyph: "◔",   note: "Mild postprandial recruitment.",           activity: 0.25 },
  { id: "large",    label: "Large meal",      glyph: "◑",   note: "Phasic burst; gastric distension.",        activity: 0.78 },
  { id: "stress",   label: "Psychogenic stress", glyph: "◕", note: "Restraint, LiCl malaise, social stress.", activity: 0.85 },
  { id: "pharm",    label: "Pharmacologic agonism", glyph: "●", note: "Chronic, sustained — nature never sees this.", activity: 1.0, pharm: true },
];

// Targets of PPG-NTS — each gets per-state activation
// Activity per state, 0..1
const PPG_TARGETS = [
  // pos relative to a 380x440 canvas, NTS at center bottom
  { id: "pvn", label: "PVN",   sub: "CRH · HPA",       x: 260, y: 90,  byState: [0.02, 0.1, 0.55, 0.95, 0.7] },
  { id: "arc", label: "ARC",   sub: "POMC",            x: 130, y: 90,  byState: [0.02, 0.2, 0.55, 0.20, 0.55] },
  { id: "cea", label: "CeA",   sub: "GABA · aversive", x: 320, y: 200, byState: [0.02, 0.05, 0.40, 0.95, 0.60] },
  { id: "bnst",label: "BNST",  sub: "neg affect",      x: 60,  y: 200, byState: [0.02, 0.05, 0.30, 0.80, 0.55] },
  { id: "nac", label: "NAc",   sub: "salience",        x: 320, y: 280, byState: [0.02, 0.15, 0.45, 0.30, 0.55] },
  { id: "dmh", label: "DMH",   sub: "autonomic",       x: 60,  y: 280, byState: [0.02, 0.2, 0.40, 0.55, 0.45] },
];

function PPGNTSArtboard({ width = 1400, height = 900, mode = "atlas-light" }) {
  const [stateIdx, setStateIdx] = useStatePPG(2); // start on Large meal
  const [lens, setLens] = useStatePPG("mechanistic");
  const s = STATES[stateIdx];

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
        eyebrow="02 · PPG-NTS · Native central GLP-1 system"
        title="A secondary satiation and aversive-interoceptive signal, recruited phasically."
        oneSentence="Brain PPG-NTS neurons are not a tonic appetite regulator. They are deployed by nature for large meals and visceral / psychogenic stress, and suppressed by fasting. Pharmacological GLP-1RAs sustain chronically a signal nature deploys phasically and aversively."
        stewardship={{ date: "2026-02-14", fresh: false }}
      />
      <LensSwitcher value={lens} onChange={setLens} />

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, minHeight: 0 }}>
        {/* Left — controls + state explainer */}
        <div style={{ padding: "28px 36px 28px 36px", borderRight: "0.5px solid var(--rule)", overflow: "auto" }}>
          <Eyebrow>Physiologic state · drag the dial</Eyebrow>
          <StateDial value={stateIdx} onChange={setStateIdx} />

          <div style={{
            marginTop: 24,
            padding: "18px 20px",
            background: s.pharm ? "var(--accent-bg)" : "var(--bg-paper)",
            border: "0.5px solid " + (s.pharm ? "var(--accent-rule)" : "var(--rule)"),
            borderRadius: 4,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: s.pharm ? "var(--accent)" : "var(--ink-1)" }}>{s.glyph}</span>
              <h3 style={{
                fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, margin: 0,
                color: s.pharm ? "var(--accent)" : "var(--ink-1)", letterSpacing: "-0.005em",
              }}>{s.label}</h3>
            </div>
            <p style={{
              fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.55, color: "var(--ink-1)",
              margin: "10px 0 0 0", textWrap: "pretty",
            }}>
              {stateProse(s.id)}
            </p>
            {s.pharm && (
              <p style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: 13, color: "var(--accent)", margin: "10px 0 0 0",
              }}>
                The system is being asked to communicate satiety and aversive interoception <strong>continuously</strong>.
                Whether the brain treats this as supranormal satiety or as chronic mild aversive interoception is the
                mechanistic question downstream of every neuropsychiatric side-effect debate.
              </p>
            )}
          </div>

          {/* Phasic vs tonic mini-chart */}
          <div style={{ marginTop: 28 }}>
            <Eyebrow>Recruitment over time</Eyebrow>
            <PhasicVsTonicChart stateIdx={stateIdx} />
            <p className="margin-note" style={{ marginTop: 6 }}>
              Native recruitment is <em>phasic</em>: bursts on the timescale of minutes to an hour. Pharmacologic
              agonism flattens to a chronically elevated tonic line — a shape the system has no evolved response to.
            </p>
          </div>
        </div>

        {/* Right — pathway diagram */}
        <div style={{ padding: "28px 36px 28px 36px", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <Eyebrow>PPG-NTS recruitment & projections</Eyebrow>
          <p className="margin-note" style={{ marginTop: 6, fontSize: 12.5 }}>
            Node fill encodes recruitment strength. Acute peripheral GLP-1 (state 5) bypasses PPG, acting via AP/NTS sensing
            and second-order projections — note the <em>different</em> pattern.
          </p>
          <PathwayDiagram stateIdx={stateIdx} />

          <Eyebrow style={{ marginTop: 18 }}>Active claims · this state</Eyebrow>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {claimsForState(s.id).map((c, i) => <ClaimCard key={i} claim={c} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// State dial — horizontal scrubber w/ 5 snap positions

function StateDial({ value, onChange }) {
  const ref = useRefPPG(null);
  const [dragging, setDragging] = useStatePPG(false);

  const w = 460;
  const padX = 24;
  const trackY = 40;
  const innerW = w - padX * 2;
  const step = innerW / (STATES.length - 1);

  const positionFromX = (clientX) => {
    const rect = ref.current.getBoundingClientRect();
    const x = clientX - rect.left - padX;
    const i = Math.max(0, Math.min(STATES.length - 1, Math.round(x / step)));
    return i;
  };

  const handleDown = (e) => {
    setDragging(true);
    onChange(positionFromX(e.clientX));
  };

  useEffectPPG(() => {
    if (!dragging) return;
    const onMove = (e) => onChange(positionFromX(e.clientX));
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const handleX = padX + value * step;

  return (
    <div style={{ marginTop: 12 }}>
      <svg
        ref={ref}
        width={w} height={104}
        style={{
          display: "block",
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={handleDown}
      >
        {/* track */}
        <line x1={padX} y1={trackY} x2={w - padX} y2={trackY} stroke="var(--rule-strong)" strokeWidth="0.75" />
        {/* phasic vs pharmacologic shading band */}
        <rect x={padX + 3.5 * step} y={trackY - 6} width={step + 6} height={12}
              fill="var(--accent-bg)" stroke="var(--accent-rule)" strokeWidth="0.5" />

        {/* ticks + labels */}
        {STATES.map((s, i) => {
          const x = padX + i * step;
          const active = i === value;
          return (
            <g key={s.id}>
              <line x1={x} y1={trackY - 6} x2={x} y2={trackY + 6} stroke={active ? "var(--ink-1)" : "var(--rule-strong)"} strokeWidth={active ? 1 : 0.5} />
              <text x={x} y={trackY + 22} textAnchor="middle" style={{
                fontFamily: "var(--font-mono)", fontSize: 9.5,
                letterSpacing: "0.08em", textTransform: "uppercase",
                fill: active ? "var(--ink-1)" : "var(--ink-3)",
              }}>{s.label}</text>
              <text x={x} y={trackY + 36} textAnchor="middle" style={{
                fontFamily: "var(--font-mono)", fontSize: 13,
                fill: active ? (s.pharm ? "var(--accent)" : "var(--ink-1)") : "var(--ink-4)",
              }}>{s.glyph}</text>
            </g>
          );
        })}

        {/* handle */}
        <g transform={`translate(${handleX},${trackY})`}>
          <circle r={10} fill="var(--bg-paper)" stroke="var(--ink-1)" strokeWidth="1" />
          <circle r={3.5} fill={STATES[value].pharm ? "var(--accent)" : "var(--ink-1)"} />
        </g>

        {/* small "phasic / tonic" rail label */}
        <text x={padX} y={92} style={{
          fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.1em",
          textTransform: "uppercase", fill: "var(--ink-3)",
        }}>Phasic / natural</text>
        <text x={padX + 3.5 * step + step / 2 + 3} y={92} style={{
          fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.1em",
          textTransform: "uppercase", fill: "var(--accent)",
        }}>Tonic / pharmacologic →</text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pathway diagram — projections from PPG-NTS, lit by current state

function PathwayDiagram({ stateIdx }) {
  const s = STATES[stateIdx];
  const ntsActivity = s.activity;

  return (
    <svg width="100%" viewBox="0 0 460 380" style={{ marginTop: 10, maxHeight: 400 }}>
      <ArrowDefs />

      {/* faint anatomy frame */}
      <rect x="2" y="2" width="456" height="376" fill="none" stroke="var(--rule-soft)" strokeWidth="0.5" />

      {/* NTS at center */}
      <g transform="translate(190, 320)">
        <circle r="34" fill="var(--bg-paper)" stroke="var(--ink-1)" strokeWidth="1" />
        <circle r={6 + ntsActivity * 22}
                fill={s.pharm ? "var(--accent)" : "var(--ink-1)"}
                opacity={0.15 + ntsActivity * 0.5} />
        <text textAnchor="middle" dy={-2} style={{
          fontFamily: "var(--font-serif)", fontSize: 13, fill: "var(--ink-1)",
        }}>PPG-NTS</text>
        <text textAnchor="middle" dy={12} style={{
          fontFamily: "var(--font-mono)", fontSize: 8.5,
          letterSpacing: "0.08em", textTransform: "uppercase", fill: "var(--ink-3)",
        }}>caudal medulla</text>
      </g>

      {/* Peripheral input arrow (state 5 only — pharmacologic comes from periphery, partially bypassing PPG) */}
      {s.pharm && (
        <g>
          <text x="20" y="364" style={{
            fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em",
            textTransform: "uppercase", fill: "var(--accent)",
          }}>peripheral GLP-1RA</text>
          <path d="M 90 358 Q 130 340 158 332" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-accent)" />
          <text x="90" y="350" style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--accent)" }}>via AP / NTS</text>
        </g>
      )}

      {/* Target nodes + projections */}
      {PPG_TARGETS.map(t => {
        const a = t.byState[stateIdx];
        return (
          <g key={t.id}>
            <line
              x1={190} y1={320 - 34}
              x2={t.x + 22} y2={t.y + 22}
              stroke={s.pharm ? "var(--accent)" : "var(--ink-2)"}
              strokeWidth={0.5 + a * 1.5}
              opacity={0.25 + a * 0.65}
              strokeDasharray={s.pharm ? "2 3" : undefined}
            />
            <g transform={`translate(${t.x}, ${t.y})`}>
              <circle cx={22} cy={22} r="22"
                      fill="var(--bg-paper)"
                      stroke={a > 0.4 ? "var(--ink-1)" : "var(--rule-strong)"}
                      strokeWidth={a > 0.4 ? 1 : 0.5} />
              <circle cx={22} cy={22} r={a * 18}
                      fill={s.pharm ? "var(--accent)" : "var(--ink-1)"}
                      opacity={0.15 + a * 0.5} />
              <text x={22} y={20} textAnchor="middle" style={{
                fontFamily: "var(--font-serif)", fontSize: 11, fill: "var(--ink-1)",
              }}>{t.label}</text>
              <text x={22} y={32} textAnchor="middle" style={{
                fontFamily: "var(--font-mono)", fontSize: 7.5,
                letterSpacing: "0.06em", textTransform: "uppercase", fill: "var(--ink-3)",
              }}>{t.sub}</text>
            </g>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(310, 14)">
        <text style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em",
          textTransform: "uppercase", fill: "var(--ink-3)",
        }}>Recruitment</text>
        <circle cx={8} cy={20} r={3} fill="var(--ink-1)" opacity="0.15" />
        <circle cx={32} cy={20} r={8} fill="var(--ink-1)" opacity="0.4" />
        <circle cx={64} cy={20} r={12} fill="var(--ink-1)" opacity="0.6" />
        <text y={42} style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-3)" }}>quiet</text>
        <text x={56} y={42} style={{ fontFamily: "var(--font-mono)", fontSize: 8, fill: "var(--ink-3)" }}>recruited</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phasic vs tonic time chart

function PhasicVsTonicChart({ stateIdx }) {
  const s = STATES[stateIdx];
  const w = 460, h = 90;
  const baseY = 60;

  // Build a state-specific trace
  const points = [];
  const N = 120;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    let y = 0;
    if (s.pharm) {
      // tonic: rises and stays
      y = 0.85 - Math.exp(-t * 3) * 0.6;
    } else if (s.id === "fasted") {
      y = 0.06;
    } else if (s.id === "fed") {
      y = 0.18 + Math.exp(-Math.pow((t - 0.3) * 5, 2)) * 0.18;
    } else if (s.id === "large") {
      y = 0.08 + Math.exp(-Math.pow((t - 0.25) * 6, 2)) * 0.7
              + Math.exp(-Math.pow((t - 0.5) * 9, 2)) * 0.25;
    } else if (s.id === "stress") {
      y = 0.06 + Math.exp(-Math.pow((t - 0.18) * 8, 2)) * 0.8
              + Math.exp(-Math.pow((t - 0.45) * 6, 2)) * 0.45;
    }
    points.push([t * (w - 40) + 30, baseY - y * 50]);
  }
  const d = points.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");

  return (
    <svg width={w} height={h} style={{ display: "block", marginTop: 8 }}>
      {/* y axis line */}
      <line x1={30} y1={10} x2={30} y2={baseY} stroke="var(--rule-strong)" strokeWidth="0.5" />
      <line x1={30} y1={baseY} x2={w - 10} y2={baseY} stroke="var(--rule-strong)" strokeWidth="0.5" />
      {/* tonic reference */}
      <line x1={30} y1={baseY - 50} x2={w - 10} y2={baseY - 50} stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="2 3" />
      {/* trace */}
      <path d={d} fill="none" stroke={s.pharm ? "var(--accent)" : "var(--ink-1)"} strokeWidth="1.2" />
      {/* labels */}
      <text x={28} y={14} textAnchor="end" style={{
        fontFamily: "var(--font-mono)", fontSize: 8.5,
        letterSpacing: "0.08em", textTransform: "uppercase", fill: "var(--ink-3)",
      }}>max</text>
      <text x={28} y={baseY + 3} textAnchor="end" style={{
        fontFamily: "var(--font-mono)", fontSize: 8.5,
        letterSpacing: "0.08em", textTransform: "uppercase", fill: "var(--ink-3)",
      }}>0</text>
      <text x={w / 2 + 10} y={h - 4} textAnchor="middle" style={{
        fontFamily: "var(--font-mono)", fontSize: 8.5,
        letterSpacing: "0.08em", textTransform: "uppercase", fill: "var(--ink-3)",
      }}>time · minutes → hours</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function stateProse(id) {
  switch (id) {
    case "fasted":
      return (
        <span>
          PPG-NTS neurons are <strong>suppressed</strong> during negative energy balance.
          Their quiescence lifts inhibition on food-seeking, drug self-administration, and exploratory behaviour
          (Rinaman et al.). Ablation of these neurons does not alter ad libitum chow intake — they are not
          a tonic appetite regulator.
        </span>
      );
    case "fed":
      return (
        <span>
          Mild postprandial recruitment. The endogenous central GLP-1 signal is small under ordinary meal sizes;
          the heavy lifting is done by gut hormones acting at vagal afferents and by the ARC homeostatic loop.
        </span>
      );
    case "large":
      return (
        <span>
          Gastric distension drives a <strong>phasic burst</strong> of PPG-NTS activity that projects to PVN, ARC, and
          CeA. Chemogenetic activation of these neurons potently suppresses eating; their ablation produces hyperphagia
          specifically after a preload. This is the canonical &quot;stop, this is too much&quot; signal.
        </span>
      );
    case "stress":
      return (
        <span>
          Restraint stress, LiCl-induced visceral malaise, and psychogenic stressors recruit PPG-NTS strongly,
          projecting onto CeA and BNST — the anxiogenic / aversive-affect arm. Ablating PPG-NTS neurons <strong>blocks
          stress-induced hypophagia</strong>. The neurons are doing double duty: secondary satiation <em>and</em>
          aversive interoception.
        </span>
      );
    case "pharm":
      return (
        <span>
          Peripheral semaglutide / liraglutide does not act primarily through PPG-NTS — it acts at AP / NTS sensing
          and via tanycytes / slow transcytosis, partially bypassing the endogenous PPG loop. The downstream
          targets, however, overlap: PVN, CeA, BNST, ARC — and the engagement is <strong>chronic</strong>,
          not phasic. A signal that nature uses to mean &quot;something has just happened&quot; is being sustained
          to mean &quot;something is continuously the case&quot;.
        </span>
      );
  }
}

function claimsForState(id) {
  // 2 claims per state with the most relevant scope flags
  switch (id) {
    case "fasted":
      return [
        {
          statement: "PPG-NTS neurons are suppressed in negative energy balance; suppression lifts inhibition on appetitive and drug-seeking behaviour.",
          confidence: "strong",
          scope: { species: "rat", route: "ex_vivo", chronicity: "acute", drug: "endogenous GLP-1", assay: "EP" },
          papers: [{ cite: "Rinaman group, multiple" }],
        },
      ];
    case "fed":
      return [
        {
          statement: "Vagal input to PPG-NTS comes from oxytocin-receptor-expressing afferents, not GLP-1R afferents — peripheral GLP-1 does not 'talk to PPG via the vagus'.",
          confidence: "moderate",
          scope: { species: "mouse", route: "ex_vivo", chronicity: "acute", drug: "endogenous", assay: "circuit dissection" },
          papers: [{ cite: "Brierley & Trapp bioRxiv 2020/22" }],
        },
      ];
    case "large":
      return [
        {
          statement: "Gastric distension produces a phasic PPG-NTS burst; chemogenetic activation suppresses eating; ablation produces hyperphagia after preload but not ad libitum.",
          confidence: "strong",
          scope: { species: "mouse", route: "parenchymal", chronicity: "acute", drug: "DREADD", assay: "behavioural" },
          papers: [{ cite: "Holt / Trapp 2019" }, { cite: "Hayes group, multiple" }],
        },
      ];
    case "stress":
      return [
        {
          statement: "Restraint and visceral malaise (LiCl) recruit PPG-NTS; PPG ablation blocks stress-induced hypophagia.",
          confidence: "strong",
          scope: { species: "rat", route: "parenchymal", chronicity: "acute", drug: "lesion", assay: "behavioural" },
          papers: [{ cite: "Maniscalco / Rinaman 2015" }],
        },
        {
          statement: "Acute ICV GLP-1 in CeA is anxiogenic without robust HPA engagement; in PVN it raises corticosterone without anxiety-like behaviour.",
          confidence: "moderate",
          scope: { species: "rat", route: "icv", chronicity: "acute", drug: "GLP-1(7-36)", assay: "EPM" },
          papers: [{ cite: "Kinzig 2003" }],
        },
      ];
    case "pharm":
      return [
        {
          statement: "Peripheral semaglutide does not principally engage PPG-NTS; central effects route via CVO sensing, tanycytes, and slow transcytosis onto AP/NTS/ARC then projections.",
          confidence: "strong",
          scope: { species: "rat", route: "periph_tx", chronicity: "chronic", drug: "semaglutide", assay: "fluor-IHC" },
          papers: [{ cite: "Gabery / Knudsen" }, { cite: "Brierley & Trapp" }],
        },
        {
          statement: "Chronic peripheral therapeutic dosing in humans appears neutral-to-mildly-favourable on mood / anxiety, despite the same downstream pathways being engaged.",
          confidence: "moderate",
          scope: { species: "human", route: "periph_tx", chronicity: "chronic", drug: "semaglutide", assay: "RCT / cohort" },
          papers: [{ cite: "Wang Nat Med 2024" }, { cite: "EMA PRAC 2024" }],
        },
      ];
  }
  return [];
}

Object.assign(window, { PPGNTSArtboard });
