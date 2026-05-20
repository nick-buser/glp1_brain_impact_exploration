# GLP-1 Brain Mechanism Atlas — Product Requirements & Research Spec

## One-sentence product statement

An interactive mechanism atlas for the GLP-1 receptor agonist literature that makes the system *cognitively inhabitable* — visible enough to orient, manipulable enough to reason with, grounded enough to resist hype, and structured enough to keep improving as the evidence changes.

## Why this exists

The GLP-1RA literature has become unreasonably consequential and almost as quickly become unreasonably tangled. Semaglutide and its cousins are simultaneously metabolic drugs, mesolimbic modulators, interoceptive-aversive signal amplifiers, and — depending which paper you read — antidepressants, anxiogens, neuroprotectants, neuropsychiatric liabilities, and pan-addiction treatments. Coherently engaging the system requires holding at least six lenses at once: receptor neuroanatomy, pharmacokinetic access, native PPG-NTS physiology, mesolimbic reward (with the wanting/liking/learning decomposition intact), stress and aversive affect, and the metabolic-neuroimmune substrate. Each paper implicitly picks a lens. Each pop-science write-up confuses several. The result is a literature that looks more contested than it actually is and is more nuanced than its summaries admit.

This product treats lens confusion as the principal disease. The atlas's central design move is to make the lens explicit, the evidence interrogable, the scope conditions visible, and the contradictions first-class rather than hedged in prose.

## The reader we are building for

The implicit reader is mechanism-curious, evidence-aware, and frustrated by both pop-science flatness and review-article fog. They have at least undergraduate-level life-sciences fluency and may be a clinician, a researcher in an adjacent domain, a serious autodidact, or a thoughtful patient. They do not want a chatbot oracle. They want a substrate they can navigate, manipulate, and trust enough to update on. They are sophisticated enough to recognise when a tool is pretending to certainty it does not possess, and they will trust the artifact less, not more, if it polishes over uncertainty.

The atlas is not a medical advice tool, a triage system, a chatbot, or a literature-search interface. It does not replace primary reading. It is the substrate over which primary reading becomes cheaper.

## Trophic role

In the broader cognitive-ecology framing, this artifact plays four roles simultaneously, and the design should keep all four legible:

1. A **decomposer-by-shape** for the literature. New papers should be cheap to place against a structure the reader already holds, rather than expensive to engage from scratch each time.
2. A **pollinator** between specialist registers. Rodent neuropharmacology, human fMRI, RCT epidemiology, and clinical phenomenology each speak their own idioms. The atlas translates questions framed in one register into the substrate of another without forcing the reader to learn each specialty's language first.
3. An **apex consumer** at the highest-effort surfaces. The evidence-confidence overlays, contradiction views, and moderator dashboard perform population-level pattern recognition over the literature that no off-the-shelf tool produces.
4. An **interlocutor** at the most ambitious moments — the phenomenology mapper specifically, which takes a half-articulated subjective report ("food tastes flat", "alcohol stopped calling to me") and returns *structure to think with* rather than an answer to accept.

## Core claims the product must support (with appropriate confidence calibration)

The atlas must be able to convey, defend, and let the reader interrogate the following synthesis-level claims. Each is grounded in the deep-dive review and each carries scope conditions that the design must keep visible.

**On brain access.** Peripheral GLP-1RAs do not substantially cross the BBB. They reach brain targets through circumventricular organs (AP, median eminence), tanycytes, slow adsorptive transcytosis, and vagal/NTS relay. Deep limbic structures (VTA, NAc, amygdala, hippocampus) are accessed sparsely or via second-order projections. *Brain effect does not imply broad brain penetration* — this is one of the most important misconceptions to dissolve.

**On the native GLP-1 system.** Brain PPG-NTS neurons are not a tonic appetite regulator. They are recruited phasically by large meals, gastric distension, and psychogenic/visceral stress, and suppressed by fasting. They are best characterised as a secondary satiation and aversive-interoceptive signal. Pharmacological GLP-1RAs therefore sustain chronically a system nature deploys phasically and aversively — a framing essential to interpreting both intended effects and side-effect spectra.

**On mesolimbic reward.** The behavioural picture is reduced motivational salience for high-energy palatable rewards (lower progressive-ratio breakpoints, reduced cue-induced seeking, reduced food-cue striatal activation in human fMRI). The neurochemical picture is more nuanced than "dopamine goes down" — recent in vivo photometry shows preserved or even enhanced consummatory dopamine signals in some paradigms, alongside reduced cumulative consumption. The defensible synthesis is *rebalancing* of incentive salience, not blunting. The Berridge wanting/liking/learning/effort decomposition is the right framing; the strongest case is reduced wanting, with liking, learning, and effort comparatively understudied.

**On cross-reward generalisation.** Strongest evidence for food and alcohol (multiple human RCTs, including Hendershot 2025 and SEMALCO 2026, plus large preclinical literature). Medium for nicotine. Largely observational and confounding-vulnerable for opioids, cocaine, gambling, and shopping. The 85% odds-reduction signals from EHR cohorts are implausibly large as pure pharmacology and should be presented as suggestive, not definitive. Mechanistically the story is not purely dopaminergic — central amygdala GABA is implicated (Chuong/Farokhnia/Khom 2023 *JCI Insight*).

**On suicidality and affective tone.** Population-level signals (Wang et al. 2024 *Nature Medicine*, EMA PRAC 2024) do not support a causal link to increased suicidality and lean weakly protective. Anecdotal reports of emotional blunting, anhedonia, and "Ozempic personality" are mechanistically plausible as the same satiety/aversion circuitry working as advertised, and likely represent a small but real subgroup. The atlas must hold both signals simultaneously and resist collapsing to either.

**On stress and anxiety.** Dose-, route-, and timing-dependent bidirectionality. Acute high-dose central GLP-1 is reliably anxiogenic and HPA-activating in rodents. Chronic peripheral therapeutic dosing in humans appears neutral or mildly favourable. PVN and CeA dissociate: PVN drives HPA without anxiety-like behaviour, CeA drives anxiety-like behaviour without robust HPA engagement.

**On cognition and AD.** The cellular and rodent picture is encouraging (BDNF, anti-inflammatory, hippocampal plasticity). The human translation has been substantially sobered by the **EVOKE / EVOKE+ phase 3 failures (CTAD December 2025)** in mild cognitive impairment and mild AD. This is the cautionary precedent the atlas must keep visible: observational neuropsychiatric and neurocognitive signals from EHR data can fail to replicate in randomised trials. The atlas explicitly does not present GLP-1RAs as cognition-protective in humans.

**On translational caveats.** Species, dose, route, chronicity, sex, baseline state, and assay must remain on screen wherever a claim is made. Acute ICV exendin-4 in lean male rats is not chronic peripheral semaglutide in obese humans. These distinctions are the difference between honest and misleading communication.

## Functional scope — mechanism modules

The product surfaces twelve mechanism domains, each with its own primary visual idiom but a shared structural skeleton (claim, visual, controls, evidence, caveats, couplings). The exact module list is a working target, not a contract; the underlying claim/evidence graph must support flexible regrouping as the literature evolves.

1. **Overview atlas** — global mechanism graph with lens toggles, the map room.
2. **Brain access and relay** — pharmacokinetics, CVOs, tanycytes, vagal afferents, the BBB-penetration correction.
3. **PPG-NTS / native GLP-1 system** — the conceptual heart; state-dial interaction from fasted through pharmacologic agonism.
4. **Appetite and meal termination** — the standard-explainer surface, visibly incomplete.
5. **Mesolimbic wanting** — the wanting/liking/learning/effort decomposition; the dopamine-rebalancing rather than dopamine-blunting story; the Kooji contradiction.
6. **Cross-reward craving** — the evidence-graded radial map across food, alcohol, nicotine, opioids/cocaine, gambling, with confidence visibly tracking domain.
7. **Amygdala / GABA / aversive affect** — the prevention of dopamine monoculture; aversive-interoception as parallel mechanism.
8. **HPA / stress / anxiety** — explicit bidirectionality with dose/route/chronicity controls; PVN/CeA dissociation.
9. **Hedonic tone** — the Berridge decomposition and the phenomenology mapper from subjective reports to component mechanisms.
10. **Neuroimmune / insulin / cognition** — the translation ladder from cell to RCT; the EVOKE failure as anchor.
11. **Moderators** — the qualitative simulator: dose × route × chronicity × species × sex × baseline state × molecule × assay.
12. **Evidence workbench** — the claim/paper archive as table-and-graph hybrid; the courtroom layer.

## Functional scope — cross-cutting features

**The lens system.** Every mechanism page exposes the same set of viewing modes: anatomical, mechanistic, phenomenological, evidence-strength, uncertainty/contradiction, and moderator-aware. Lenses are not tabs within a tab; they are projections of the underlying claim graph and must be cheap to switch.

**The claim graph.** Every visual edge is backed by at least one Claim, which is backed by at least one EvidenceObservation, which has explicit species, assay, drug, dose, route, chronicity, direction, and caveats. The schema must enforce this at build time. No decorative arrows.

**The phenomenology mapper.** A reader-facing surface where subjective reports ("I don't crave food", "alcohol doesn't call to me", "I feel emotionally flat", "I still enjoy things when I start") are mapped probabilistically onto candidate component mechanisms with explicit uncertainty. This is the interlocutor surface; it returns structure to think with, not diagnoses.

**Moderator controls.** Sliders and toggles for dose, route, chronicity, species, sex, baseline state, and molecule that modulate which evidence is foregrounded and which edges are weighted. The moderator dashboard is a qualitative sensitivity simulator, not a quantitative predictor.

**Open-question tracker.** Open questions are first-class entities in the data model. They appear on the relevant mechanism pages and aggregate to a top-level surface. New evidence flows into open questions as it appears.

**Stewardship affordances.** Every Claim carries `last_reviewed` and `superseded_by` fields. The CodeMirror authoring layer (deferred but architecturally anticipated) is the stewardship surface, not a luxury feature.

## Mandatory invariants (the courtroom rules)

These are non-negotiable. Designers and engineers cannot break them without breaking the product's epistemic posture.

1. **Every claim has explicit confidence and provenance.** No naked assertions. Hover, click, or expand must reveal the supporting EvidenceObservations.
2. **Every claim has visible scope conditions.** Species, route, dose, chronicity, molecule, baseline state, and assay are never buried.
3. **Rodent central dosing and human peripheral therapy must remain visually distinct.** This is probably the most important anti-hype protection in the system.
4. **"Dopamine down" is not permitted as a final explanation.** The wanting/liking/learning/effort decomposition is the default frame.
5. **Phenomenology is mapped probabilistically, not asserted.** "Food tastes worse" → candidate component mechanisms with confidence, not a definitive cause.
6. **Evidence strength is mode-specific.** A claim can be strong preclinically and weak clinically, strong for food and weak for gambling, strong mechanistically and weak phenomenologically — the surface must reflect this without flattening.
7. **Contradictions are first-class structure, not prose hedging.** The Kooji photometry vs canonical blunting tension; EVOKE failure vs observational AD signals; CeA anxiogenic vs population-level neutral; cross-reward observational vs RCT. These appear as graph structure, not as caveats buried in body text.
8. **Open questions are not the end of the article.** They are part of the architecture, surfaced where they belong.

## Anti-goals — what this product is not

- A chatbot or oracle. The phenomenology mapper is structured probabilistic mapping, not a free-form Q&A.
- A medical advice tool. No dosing recommendations, no patient-specific guidance, no clinical decision support.
- A PubMed clone or literature search interface. Evidence is curated, not searched.
- A dashboard. Dashboards encourage skimming for numbers; the atlas asks for engagement with mechanisms.
- An "Ozempic explainer". Pop-science framing collapses the lens distinctions the atlas exists to preserve.
- A static review article. The whole point is interactive lens-switching and evidence interrogation.
- A definitive reference. The atlas is honest about the moving frontier and decays without stewardship; this is not a *Gray's Anatomy*.

## Out of scope (initial release)

- User accounts, saved filters, annotations, sync. Build-time JSON serves the v1; user state is deferred.
- Authoring DSL via CodeMirror. The schema-validated JSON pipeline is the v1 authoring surface; the DSL is anticipated but not built.
- Manim-rendered explanatory videos. Useful but deferred until the interactive substrate proves itself.
- Tirzepatide-specific mechanism deep dives beyond GIP receptor presence. The literature on central GIP is too thin to support a polished surface.
- Other GLP-1RA indications (heart failure, kidney disease, NASH). The brain story is the scope.
- Coupling to personal n=1 data. The Lab integration is an interesting future move and should not constrain v1.

## Open research questions the product surfaces (not answers)

The atlas treats these as first-class entities and resists pretending they are settled. From the deep-dive synthesis:

- Does chronic GLP-1RA exposure cause persistent recalibration of mesolimbic gain or reward-prediction-error signalling?
- Do effects spread to non-consummatory motivation (social, sexual, achievement-related)?
- What are the discontinuation trajectories for reward processing, craving, and affective tone?
- What is the central reward profile of tirzepatide and forthcoming triple agonists?
- Who is the subgroup vulnerable to clinically meaningful emotional blunting or anhedonia?
- Will the population-level psychiatric and cross-reward halo survive randomised-trial scrutiny? (EVOKE is the cautionary precedent.)

## Success criteria

The atlas is successful to the extent that:

- A sophisticated reader arriving cold can locate themselves in the mechanism space within minutes and identify which claims are strong, which are contested, and which are open.
- A new paper landing on the reader's queue is engaged through "where does this sit?" rather than "what does this say from scratch?"
- The reader leaves with the lens-switching habit installed — they catch themselves noticing when a claim is rodent-central-acute and a conclusion is being drawn for human-peripheral-chronic.
- Pop-science misinterpretations that the reader encounters elsewhere become *recognisably* wrong, not just unconvincing.
- The stewardship cadence holds: claims age visibly, contradictions accumulate as structure rather than mess, the artifact stays close to the territory as the literature moves.

It is *not* successful if it becomes a pretty review article that the reader skims once and never returns to. Re-engagement is the truer success metric than first-visit conversion.

## How we'd know

Qualitative: does the reader return? Do they cite the atlas the way they'd cite a substrate, or the way they'd cite a reference? Do they catch lens confusion in adjacent media after using it?

Quantitative (loose): time-on-mechanism, lens-toggle frequency, evidence-panel expansion rate, phenomenology-mapper engagement. These metrics matter only as proxies for engaged use; the atlas is *not* trying to maximise time-on-site for its own sake.
