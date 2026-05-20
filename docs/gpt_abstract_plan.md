My take: this should become a **mechanism atlas for reasoning under biological uncertainty**, not merely an “interactive Ozempic explainer.”

The uploaded app notes already point in the right direction: the core should be a mechanism atlas that lets the reader move between isolated mechanism panels, overlay mode, and evidence mode, with each arrow grounded in papers, confidence, species, route, and assay. The stated spine is also good: GLP-1RAs as amplifying a **satiety / visceral-aversion / interoceptive signal** that spills into appetite, wanting, stress, affect, and neuroimmune-metabolic pathways.

## 1. The cognitive-ecology role

Within the larger ecosystem, this project is a specialized hybrid of:

| Ecological role                  | What it means here                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| **Atlas / map room**             | Orient the reader in the whole mechanism space before details.                           |
| **Workbench**                    | Let the reader manipulate mechanisms, routes, states, and evidence filters.              |
| **Laboratory**                   | Let claims be tested against dose, route, species, assay, and chronicity.                |
| **Courtroom / forum**            | Make claims contestable: what supports this arrow, what weakens it, what contradicts it? |
| **Foundry**                      | Forge better representational primitives for messy neuroendocrine literature.            |
| **Library / archive**            | Preserve the underlying papers, claims, annotations, and provenance.                     |
| **Observatory**                  | Track the evolving state of the literature as evidence accumulates or collapses.         |
| **Studio / publication surface** | Produce something polished enough to teach, share, and revisit.                          |

The “workbench” metaphor is useful because it emphasizes active manipulation rather than passive consumption: the user should arrange materials, compare alternatives, annotate, test, and refine rather than merely read a summary. Your framework already frames a cognitive workbench as a surface where attention, external representations, computational transforms, and AI-mediated interpretation make a hard domain more inspectable and improvable.

So the project’s telos is:

> **Make the GLP-1 / Ozempic literature cognitively inhabitable: visible enough to orient, manipulable enough to reason with, grounded enough to resist hype, and structured enough to keep improving as the literature changes.**

## 2. The governing metaphor stack

I would not choose a single metaphor. This project wants a **controlled metaphor ecology**:

### Atlas

The landing experience is a map room. The uploaded plan already sketches the global graph: peripheral GLP-1RA → access/relay layer → mechanism modules such as appetite, mesolimbic wanting, cross-reward craving, amygdala-GABA aversion, HPA stress, hedonic tone, and neuroimmune-metabolic plasticity. It also suggests toggles for drug, route, state, and evidence layer.

This gives the user the “where am I?” function.

### Laboratory

Each mechanism page should behave like a controlled conceptual experiment. What changes if route is central vs peripheral? Acute vs chronic? Rodent vs human? High dose vs therapeutic dose? Obesity vs AUD vs baseline? The point is not numerical prediction; it is **mechanistic sensitivity training**.

### Courtroom

Every arrow should be interrogable. The app should ask: what evidence licenses this? What assay measured it? Is the evidence rodent, human fMRI, RCT, observational, case report? What is the opposing evidence? The uploaded notes explicitly call for evidence mode where arrows are grounded by paper count, confidence, species, route, and assay.

### Foundry

This is where the project becomes more than a webpage. You are forging reusable primitives for biological literature:

```text
Mechanism
Claim
EvidenceObservation
Assay
Species
Drug
Route
Dose
Chronicity
BrainRegion
CircuitEdge
Outcome
Phenomenology
Moderator
Uncertainty
Contradiction
OpenQuestion
```

That makes it a prototype for other literature-atlas projects later: sleep, HRV, creatine, exercise adaptation, neuroimmune cognition, hippocampal grid cells, etc.

### Observatory

A good version should show the state of the literature over time: which claims are becoming more credible, which are stuck in rodent models, which have human signals but no mechanism, which are popular but weak. This aligns with your broader “observatory” metaphor: seeing slow-moving patterns invisible in a single reading session.

## 3. The central design move: lenses over facts

The uploaded notes phrase this well: the app should not be primarily “about GLP-1 facts,” but about **different lenses over the same system**: anatomical, mechanistic, phenomenological, evidence, uncertainty, and moderator lenses.

That should become the core product doctrine.

The problem with this literature is not just complexity. It is **lens confusion**. A paper might be about a rodent central injection, but someone implicitly reads it as peripheral therapeutic semaglutide. A dopamine paper might measure progressive-ratio effort, but someone interprets it as “pleasure is reduced.” A nausea/aversion mechanism might be conflated with satiety. A population-level mood outcome might be read against acute central amygdala findings.

The app should make those lens switches impossible to miss.

A useful page skeleton:

```text
1. One-sentence mechanism claim
2. Visual circuit
3. Lens switcher
   - anatomy
   - mechanism
   - phenomenology
   - evidence
   - uncertainty
   - moderators
4. Interactive controls
5. Evidence panel
6. Caveats / contradictions
7. Links to adjacent mechanisms
```

## 4. The domain ontology

At a high level, I would model the project around five core aggregates.

### A. Literature aggregate

```ts
Paper;
Author;
Year;
Species;
StudyType;
Assay;
Drug;
Dose;
Route;
Chronicity;
Population;
```

This is the archive layer.

### B. Claim aggregate

```ts
Claim {
  id
  statement
  mechanismId
  polarity // activates, inhibits, modulates, associated_with, contradictory
  confidence
  evidenceIds
  caveats
  scopeConditions
}
```

This is the courtroom layer. A claim is not a free-floating sentence; it has scope.

### C. Mechanism aggregate

```ts
Mechanism {
  id
  title
  shortClaim
  nodes
  edges
  outputs
  moderators
  coupledMechanisms
  openQuestions
}
```

This is the atlas/workbench layer.

### D. Evidence aggregate

```ts
EvidenceObservation {
  claimId
  paperId
  species
  assay
  drug
  route
  dose
  chronicity
  direction
  strength
  caveat
}
```

This prevents the “one paper says X” collapse. You want claim evidence to remain multidimensional.

### E. Phenomenology aggregate

```ts
PhenomenologyMapping {
  report // "I don't crave alcohol", "food tastes worse", "I feel flat"
  candidateMechanisms
  likelyComponents // wanting, liking, aversion, nausea, effort, learning
  confidence
  caveats
}
```

This matters because the public salience of GLP-1 drugs is phenomenological: people report food noise reduction, alcohol indifference, nausea, flattening, mood changes, compulsion reduction. The app should map these reports into mechanisms without pretending the mapping is settled.

## 5. The important invariants

These are the rules that keep the system honest.

**Every visual edge must be backed by at least one claim.** No decorative arrows.

**Every claim must expose scope conditions.** Species, route, dose, chronicity, molecule, baseline state, and assay should never be buried.

**Rodent central dosing and human peripheral therapy must remain visibly distinct.** This is probably one of the most important anti-hype protections.

**“Dopamine down” should be disallowed as a final explanation.** The uploaded review notes already emphasize the more nuanced “wanting reweighting” account: reduced tonic incentive salience with some phasic responses preserved or context-dependent.

**Phenomenology must be mapped probabilistically, not asserted.** “Food tastes worse” might mean reduced wanting, nausea, true liking change, changed salience, or aversive interoception.

**Evidence strength must be mode-specific.** A claim can be strong preclinically but weak clinically, strong for food but weak for gambling, strong mechanistically but weak phenomenologically.

**Open questions should be first-class.** The app should not merely end with conclusions; it should show the holes.

## 6. The main views

### 1. Overview Atlas

Global graph with relay/access layer, mechanism modules, and evidence filters. This is the “map room” already described in the uploaded notes.

### 2. Brain Access / Relay

This tab should teach one hard correction:

> Brain effect does not imply broad brain penetration.

The uploaded plan highlights CVOs, AP/NTS, median eminence/tanycytes, vagal afferents, and sparse or indirect limbic access as the key route distinctions.

### 3. PPG-NTS / Native GLP-1 State Machine

This is probably the conceptual heart. A state dial from fasted → normal fed → large meal → nausea/stress → pharmacologic agonism is exactly the right kind of interaction.

This page should make the core metaphor visible: GLP-1 is not just “fullness juice.” It is closer to an interoceptive stop/aversion/satiation signal whose meaning depends on state and recruitment pattern.

### 4. Appetite / Meal Termination

The public-facing simplest page. Gut, gastric emptying, vagus, AP/NTS, hypothalamus, meal size, satiety, nausea threshold.

This is the “standard explainer” surface, but it should be visibly incomplete: a gateway into deeper mechanisms, not the whole story.

### 5. Mesolimbic Wanting

This should be one of the polished centerpieces. Use the decomposition:

```text
cue pull
seeking / effort
consumption
learning / prediction update
```

The toy model from the notes is useful:

```text
Motivational Drive =
Cue Salience × Reward Value × State Gain − Satiety/Aversion
```

It should be clearly labeled as a conceptual toy, not a biological equation.

### 6. Cross-Reward Craving

This is where the app prevents overgeneralization. Food and alcohol should appear as high-confidence or medium-high-confidence relative to other domains; nicotine, opioids/cocaine, gambling/shopping should be more visibly uncertain. The uploaded notes already propose an evidence matrix for exactly this.

### 7. Amygdala / GABA / Aversive Affect

This page prevents dopamine monoculture. The key UX contrast:

```text
Dopamine / wanting:
"less pull toward"

Amygdala-GABA / aversion:
"more stop / avoid / malaise"
```

Both reduce intake, but they feel different.

### 8. HPA / Stress / Anxiety

This should be a bidirectionality page, not an answer page. Route, dose, timing, and baseline state need to remain on screen. The uploaded notes emphasize the distinction between acute central rodent dosing and chronic peripheral therapeutic dosing.

### 9. Hedonic Tone

This page should decompose:

```text
wanting
liking
learning
effort
aversion
mood
```

It should map subjective reports to uncertain mechanisms. Example:

```text
"I don't think about food"
→ wanting ↓ likely
→ cue salience ↓ likely
→ liking change unknown
→ nausea/aversion possible but not necessary
```

### 10. Neuroimmune / Insulin / Cognition

This should be the hype-control page. It can show plausible positive mood/cognition/neuroprotection mechanisms, but with a “translation ladder” from cell → rodent → observational human → RCT disease modification.

### 11. Moderators

A qualitative simulator:

```text
Effect = mechanism × dose × route × chronicity × species × sex × baseline state × molecule × assay
```

This is not a prediction engine. It is a guardrail against universal claims.

### 12. Evidence Workbench

A table + graph hybrid:

```text
claim | mechanism | paper | species | assay | drug | route | dose | direction | confidence | caveat
```

This is the archive/courtroom layer.

## 7. AI as participant, not explainer-god

The broader AI-integrated cognitive ecology document makes a useful distinction: AI should be deployed as **participation**, not delegation. Participation means the AI helps the worker think better by surfacing framings, tensions, and counterarguments; delegation means the AI produces answers for passive acceptance.

For this project, AI should not be “ask the Ozempic bot.” That is too close to a medical oracle.

Better AI roles:

```text
"Show me the strongest and weakest support for this edge."

"What scope conditions would make this claim misleading?"

"Compare the dopamine-wanting lens to the aversive-interoception lens."

"Which papers are being overused as support?"

"Generate an alternate mechanism decomposition, but mark every unsupported edge."

"What changed in my interpretation since the last version?"
```

The AI becomes a **claim critic, lens switcher, evidence clerk, and synthesis partner**, not an authority.

## 8. Build strategy

I would build exactly the three slices the uploaded notes recommend:

1. **Overview Atlas**
   - global graph
   - mechanism modules
   - confidence badges
   - evidence hover cards

2. **PPG-NTS / Satiety-Aversion**
   - state dial
   - native phasic vs pharmacologic chronic signal
   - animated pathway
   - explanation cards

3. **Wanting / Hedonic Tone**
   - VTA/NAc circuit
   - wanting/liking/learning/effort decomposition
   - toy motivational model
   - contradictory dopamine evidence caveat

Those slices prove the central affordance before you build the full atlas. The uploaded notes explicitly identify those as the first vertical slices and defer cross-reward, HPA/amygdala, neuroimmune, CodeMirror authoring, and Manim videos until after the core affordance is proven.

That also fits your own “avoid cathedrals of representation” rule: thin vertical slices before full ontology perfection. Your workbench notes warn that one failure mode is modeling the perfect ontology before the system helps with anything.

## 9. What this becomes in the larger ecosystem

This is not only a GLP-1 website. It is a prototype for a **literature-to-mechanism atlas pattern**.

Reusable substrate:

```text
Paper ingestion
→ claim extraction
→ evidence typing
→ mechanism graph
→ lens-specific visualizations
→ uncertainty overlays
→ phenomenology mapping
→ open-question tracker
→ public explanatory surface
```

That pattern could later apply to:

```text
HRV and autonomic regulation
zone 2 / mitochondrial adaptation
sleep architecture
creatine physiology
neurotransmitter systems
pathology perceptual training
grid cells / cognitive maps
interoception and affect
```

This is where the cognitive-ecology payoff is larger than the project itself. You are not just making a polished literature review. You are forging a reusable cognitive fixture for domains where linear prose collapses under multi-mechanism causal entanglement.

## 10. The sharpest product statement

> **GLP-1 Brain Mechanism Atlas is an interactive cognitive workbench for understanding how GLP-1 receptor agonists couple satiety, interoception, aversion, reward, stress, affect, and metabolic-neuroimmune pathways. It lets readers switch between clean mechanism views, coupled-system overlays, evidence-grounded claim graphs, uncertainty modes, and phenomenology mappings, so the literature becomes something they can inspect and reason with rather than merely read.**

The anti-goal is equally important:

> It should not become a dashboard, PubMed clone, medical advice bot, hype explainer, or “Ozempic makes dopamine go down” infographic.
