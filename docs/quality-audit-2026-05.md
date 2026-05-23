# Quality Audit — 2026-05-23

Findings from a four-axis sweep (visual/layout, content/copy, data/stewardship, code-quality/a11y) of the atlas as of commit on `main` after PR #9. Organised into seven PR-shaped batches; each batch is independently mergeable.

Severity legend: **P0** user-visible or credibility-affecting · **P1** should-fix · **P2** nit.

---

## Batch 1 — Content correctness

High-credibility content fixes. All edits land in `src/data/*.json`, `src/pages/*.tsx`, and a few prose locations. No code logic touched.

- **P0 · "Kooji" → "Kooij" everywhere.** The author is `Kooij KL` per `papers.json:41` `authors`, but ~20 sites (ids, evidence rows, claim ids, the visible eyebrow `⇄ Kooji tension` on `/mechanisms/wanting`, `wanting.ts:2,30`, `schemas.ts:290`, `atlas.json:15,26,52`, `moderators.json:259`, README, three docs files) say Kooji. This is the central worked-example contradiction of the atlas. Rename `c_kooji → c_kooij`, `ev_kooji_photometry → ev_kooij_photometry`, `kooji_2024 → kooij_2024`, and all call sites.
- **P0 · "circumferential" → "circumventricular".** `src/pages/Overview.tsx:77` — landing-page hero; the word carries the meaning of the sentence.
- **P0 · `c_dls` cites the wrong paper.** `claims.json:156-164` lists `evidenceIds: ["ev_dickson_vta"]`, but the Dickson VTA paper says nothing about the dorsolateral septum or LH. Either re-source or rescope the claim.
- **P0 · `c_bnst` cites a tangential paper.** `claims.json:175-183` lists `evidenceIds: ["ev_kinzig_cea"]`, a CeA anxiogenesis paper, not a CeA→BNST projection paper. Same fix.
- **P1 · EVOKE id/cite/year/date inconsistencies.** `papers.json:120-126` has `id: evoke_2025`, `cite: EVOKE 2026`, `year: 2026`; prose says "December 2025" (`papers.json:126`) in one place and "November 2025" (`neuroimmune.json:169`) in another. Pick one date and harmonise the id slug.
- **P1 · `ev_evoke_biomarker` direction inconsistent with claim.** `evidence.json:415` has `direction: no_change`, but the row's own note says "no biomarker-outcome results have been published as of this review". Either add `unreported` to the `Direction` enum or rephrase the note.
- **P1 · `c_cog_rodent` polarity bug.** `claims.json:145` is `polarity: supports` but `contradicts: ["c_cog_evoke"]`. A supporting claim shouldn't list contradictions. Either flip polarity to `weakens` or drop the contradicts entry.
- **P2 · Wanting page eyebrow.** `Wanting.tsx:17` reads `04 · Mesolimbic wanting · Hedonic tone` — "Hedonic tone" is the title of section 07. Drop the suffix.
- **P2 · Spelling drift in otherwise-British copy.** `moderators.json:149` "estrogen" → "oestrogen"; `neuroimmune.json:83` "ischemia" → "ischaemia"; `AccessRouteDiagram.tsx:243` "blood–brain barrier" (en-dash) → hyphen (matches 20+ other instances); `Wanting.tsx:93` "TH⁺" → "TH+" (or normalise the other direction across `evidence.json:57`, `claims.json:72`, `CircuitDiagram.tsx:10`).
- **P2 · "AUD" used unexpanded.** `evidence.json:265` — expand to "alcohol use disorder" inline; the term isn't introduced elsewhere.

---

## Batch 2 — README corrections

Self-contained doc fixes; all in `README.md` (my errors from the rewrite in PR #8).

- **P1 · Data-model field names are wrong.** README documents fields that don't exist on the schemas:
  - `Claim` has `scope`, not `scopeConditions`.
  - `Paper` has `note` (not `notes`) and no `title` field.
  - `EvidenceObservation` does **not** have `magnitude`, `scopeNote`, or `lastReviewed`. Real fields include `dose`, `population`, `n`, `caveats`, `note`, `chronicity`, `direction`.
- **P1 · Mol\* bundle size.** README says "~3MB"; code consistently says "~600 kB" (`MolstarViewer.tsx:3`, `BrainAccess.tsx:7,384`).
- **P1 · "Atlas force layout" is wrong.** Two places (`README:110`, `README:302`). The atlas is hand-laid SVG with static coords in `atlas.json` — no `d3-force` / `forceSimulation` / force-graph dependency. Change to "hand-laid atlas SVG".
- **P2 · "eslint over `src/`" is wrong.** Script is `eslint .` (`package.json:12`) — lints the whole repo.

---

## Batch 3 — Visual layout

SVG geometric and sizing fixes. All in `src/components/*.tsx`.

- **P0 · `StateDial` clips on narrow viewports.** `StateDial.tsx:108` — root SVG has `width={W} height={H}` and `maxWidth: 100%` but no `viewBox`. Children draw to x=480 in absolute pixels; on ~1024px laptops the right side of the dial vanishes. Add `viewBox="0 0 480 104"`.
- **P0 · `AccessRouteDiagram` node overlap.** Nodes `ls` (Lateral septum, x=320 y=120) and `hpc` (Hippocampus, x=392 y=84) at `NODE_W=80 / NODE_H=38` overlap by 8×2px. Bump `hpc.y` to ≥106 in `access.json` or shift `hpc.x` right by ≥8.
- **P0 · `AccessRouteDiagram` label overflow.** Labels like "Nucleus accumbens" (~110px), "Median eminence", "Arcuate nucleus" (~95-100px) overflow the 80px node box. Widen `NODE_W` to ~108 (rebalance coords), shorten labels, or split onto two lines.
- **P1 · `BerridgeBars` and `ToyMotivationalModel.ResultBar` clip the same way as StateDial.** Both use literal `width={w}` (268, 264) with `maxWidth: 100%` and no `viewBox`. Add `viewBox="0 0 {w} {h+18}"`.
- **P1 · `PathwayDiagram` spoke lines bleed into nodes.** `PathwayDiagram.tsx:57-66` — lines go to target *centre* (`t.x+22, t.y+22`), not boundary. At `opacity 0.22..0.87` the line is visible inside the node. Trim to circle edge (subtract `r=22` along direction vector).
- **P1 · `MealTerminationCurve` threshold legend can collide with the curve.** `MealTerminationCurve.tsx:116-141` — `<text>` labels at `y = fy(threshold) - 4` with no max-x constraint sit on top of the bold selected curve during the regime tween. Push to right-anchor on the right edge, or clip against the curve.
- **P1 · `Overview` mobile rail is inconsistent.** `Overview.tsx:89-100` uses `<main>`/`<aside>` as direct children of `.page-col-2`, but the mobile CSS (`index.css:1764, 1695`) only targets `> section`. The Overview right rail skips the mobile padding/border swap. Either change to `<section>` semantics or widen the selector to `> section, > main, > aside`.
- **P1 · `AtlasGraph` BBB rect is hardcoded.** `AtlasGraph.tsx:139-141` — `x="305" y="100" width="18" height="600"`. Fine today, but fragile: any future node in `x ∈ [296, 332]` will be visually pierced by the hatch band. Derive from lane geometry.
- **P2 · `CrossRewardRadial` square viewBox on tall containers.** `CrossRewardRadial.tsx:67` — `maxHeight: 520` with 540×540 viewBox; on portrait containers the bottom row renders at smaller scale than intended. Mostly cosmetic.
- **P2 · `PhasicChart` no `maxHeight`.** `PhasicChart.tsx:54-55` — stretches taller than intended on extreme aspect ratios. Inconsistent with siblings.
- **P2 · `CircuitDiagram` caption is barely-fitting.** `CircuitDiagram.tsx:149-162` — italic caption at ~360px wide center-anchored at x=230 within `viewBox 460 wide`. Any longer string clips both sides.
- **P2 · `DissociationDiagram` HPA bar overlaps sub label.** `DissociationDiagram.tsx:60-66` — 7px between sub label (y=253) and HPA bar (y=246). Readable but tight.
- **P2 · `.claim-cites` class has no CSS rule.** `atlas.tsx:278` — only `.claim-cite` (singular) is styled. Name implies intent.

---

## Batch 4 — Accessibility

Keyboard, headings, labels, contrast. Mostly small targeted fixes.

- **P0 · `CrossRewardRadial` clickable nodes have no keyboard support.** `CrossRewardRadial.tsx:149-156` has `role="button"` + `aria-label` but no `tabIndex` and no `onKeyDown`. Add `tabIndex={0}` and Enter/Space handlers. Pattern to copy: `TranslationLadder.tsx:213-218`.
- **P0 · `AtlasGraph` clickable nodes same problem.** `AtlasGraph.tsx:319-329` and `378-388`. The main mechanism graph is keyboard-inaccessible.
- **P1 · Heading-level skips.** `PpgNts.tsx:75` and `Wanting.tsx:46` jump h1 → h3. Change to `<h2>`.
- **P1 · `EvidenceWorkbench` search input has no accessible name.** `EvidenceWorkbench.tsx:117-123` — `placeholder="Search claim text…"` is not a label. Add `aria-label="Search claim text"`.
- **P1 · Color-only signalling for `contradicted` in radial.** `CrossRewardRadial.tsx:28, 95, 164` — only `var(--accent)` differentiates contradicted nodes. Add a glyph (e.g., the `⇄` already used in `AtlasGraph.tsx:360`).
- **P1 · `BerridgeBars` SVG lacks `role="img"` / `aria-label`.** `BerridgeBars.tsx:93`. Every other figure SVG has one.
- **P1 · `ToyMotivationalModel` uses `--ink-3` for primary output text.** `ToyMotivationalModel.tsx:72-75`. `--ink-3` is secondary/caption ink. Move primary output to `--ink-1` or `--ink-2`.
- **P2 · `AtlasGraph` `⇄` contradiction glyph reads as a codepoint to screen readers.** `AtlasGraph.tsx:360` — wrap with `<title>contradiction</title>`.
- **P2 · `EffectChannelBars` adverse-vs-therapeutic uses color alone** (line 27). Confirm row text label is adjacent; if not, add one.
- **P2 · `prefers-reduced-motion` coverage check.** `useReducedMotion` is wired in `StateDial` and AtlasGraph; verify the rAF tween in `MealTerminationCurve.tsx:64-74` and the `transition: 'opacity .25s'` lines in `AtlasGraph.tsx:252, 322, 382` all respect the preference.

---

## Batch 5 — Build hygiene

Quick chore. Should be a 20-minute PR.

- **P0 · `pnpm lint` is failing.** `App.tsx:155` — `setNavOpen(false)` called synchronously inside `useEffect` (`react-hooks/set-state-in-effect`). Move the setter into `NavLink onClick` or use a cleanup pattern.
- **P1 · Unused production dependencies.** `clsx` and `@xyflow/react` are in `package.json` deps with zero imports under `src/`. Drop both. (`@xyflow/react` especially — it's large.)
- **P1 · Unsafe `as Theme` cast on localStorage.** `App.tsx:144` — `localStorage.getItem('atlas-theme') as Theme || 'atlas-light'`. Validate against a `THEMES` const before assigning.
- **P2 · TanStack Table compiler hint.** `EvidenceWorkbench.tsx:48` — `react-hooks/incompatible-library` warning. Informational; not actionable today.

---

## Batch 6 — Data integrity + build-gate hardening

The meaty one. Two phases: data fixes (Phase A) then build-gate rules that would have caught them (Phase B). Reviewable as one PR or two; recommend one.

### Phase A — data fixes

- **P1 · Asymmetric contradictions.** `claims.json` has three "A contradicts B" edges with no reciprocal entry on B:
  - `c_kooij` (L60) → `c_da_blunting` (L50) — reverse missing.
  - `c_cog_rodent` (L145) → `c_cog_evoke` (L135) — reverse missing.
  - `c_cross_opioids_null` (L391) → `c_cross_opioids` (L232) — reverse missing.
- **P1 · Seven `strong` claims rest on a single evidence row.** Not strong by any operational definition. Either downgrade to `moderate` or add a corroborating row: `c_ppg_phasic` (L22), `c_ppg_fasted` (L185), `c_ppg_large_burst` (L204), `c_ppg_stress` (L213), `c_appetite_meal_size` (L311), `c_neuro_microglia` (L340), `c_cog_evoke` (L135) — the last is defensible as an adjudicating trial but should note that explicitly.
- **P1 · Four `strong`/universal-sounding claims with single-species evidence.** Tighten scope clauses on `c_appetite_meal_size`, `c_anx_neutral`, `c_amyg_primate`, `c_neuro_healthy_cog`.
- **P1 · Zero evidence rows record subject sex** (0/36). The `moderators` UI exposes `sex` as a dimension but the evidence graph cannot back it. Either backfill `sex` on `EvidenceObservation` (and add to schema as required) or promote sex stratification to a first-class open question.
- **P2 · Four stale claims** (>90d since `lastReviewed`, against 2026-05-23): `c_kooij` (2026-02-14), `c_cog_rodent` (2026-01-30), `c_pfc` (2026-02-10), `c_ppg_fasted` (2026-02-14). Bulk of corpus is on 2026-05-21 — these missed the sweep.
- **P2 · Tirzepatide absent from the corpus** (semaglutide 12, exendin-4 6, liraglutide 4, tirzepatide 0). Either add coverage or document the mono-agonist scope in a README/scope note.

### Phase B — build-gate additions (`scripts/validate-graph.ts` + `lib/schemas.ts`)

- Enforce **symmetric `contradicts[]`**.
- Enforce **polarity-vs-contradicts consistency** (a `supports` claim cannot list `contradicts`).
- **Warn** when `confidence: strong` has `< 2` evidence rows or single-species coverage.
- Add optional `lastReviewed` to `EvidenceObservation` and module sections; warn at `> 90d`.
- **Warn on orphan papers** (would be a no-op today — clean — but worth wiring).

### Domain-expert second-look list (advisory, not in scope for the PR)

Findings I'd want a domain-literate reviewer to check before sign-off; not fact-checked here:
- `c_appetite` (L33) scope is `mouse / liraglutide / cFos` but the statement reads general.
- `c_cross_alcohol` (L80) scope `n: 156` is a sum across two trials; no single trial has this n.
- `aversive.json:14` "GLP-1R sits on PVN CRH neurons" — confident phrasing; human anatomical case is thinner than the rodent one.
- `phenomenology.json:131` mood candidate for "alcohol stopped calling to me" — rationale reads more uncertain than the low-grade weight suggests.
- `moderators.json:149` "estrogen interacts" — vague claim; no evidence row stratifies on sex.

---

## Batch 7 — Code consolidation (optional)

Internal refactor only; no user-visible change. Defer if Batches 1-6 absorb the budget.

- **P1 · Confidence-style logic duplicated across files.** `CrossRewardRadial.tsx:24` (COLOR map), `AtlasGraph.tsx:24, 236` (EDGE_WIDTH + contradiction ternary), `claim-table.ts:44` (CONFIDENCE_RANK), `BerridgeBars.tsx:11`, `ClaimDetail.tsx:20-31` — already diverged (contradiction color handled three different ways). Centralise a `confidenceMeta` map in `lib/schemas.ts` or `lib/claim-table.ts`.
- **P1 · `POLARITY_LABEL` map drift.** `ClaimDetail.tsx:26` defines a map; `claim-columns.tsx:71` renders the raw enum value for the same column. Pick one.
- **P2 · `Confidence as ConfidenceLevel` alias** repeated in `atlas.tsx:8`, `CrossRewardRadial.tsx:7`, `CrossReward.tsx:12`. Rename the export once in `schemas.ts` or drop the alias.
- **P2 · Magic-number font sizes** (12.5, 13, 14.5, 21, 27) repeated across components. Promote to a typography scale in `index.css`.

---

## Suggested PR order

1. **Batch 5 (build hygiene)** — small, unblocks everyone.
2. **Batch 2 (README)** — small, self-contained, my errors.
3. **Batch 1 (content correctness)** — high-credibility, single sweep.
4. **Batch 3 (visual layout)** — independent of code refactors.
5. **Batch 4 (accessibility)** — small, additive.
6. **Batch 6 (data + build-gate)** — biggest; lands the durable improvements.
7. **Batch 7 (code consolidation)** — optional cleanup.
