# GLP-1 Brain Mechanism Atlas — UI/UX Designer Guide

A note on the scope of this document. This is not a layout spec. It does not tell you where the navigation goes, what the colour palette is, or how the cards stack. The right designer working on this needs latitude on those decisions, and the engineering and product documents already over-determine plenty of structure. What this document does is name what we are trying to achieve experientially, what failures we already know how to recognise, and what the underlying constraints are that the design must honour. The rest is your room.

Think of this as a brief written by someone who has lived with the problem, articulating the symptoms to treat rather than prescribing the medicine.

## The telos

The atlas exists to make a particular literature *cognitively inhabitable*. That phrase carries real content. A literature is inhabitable when a reader can find their bearings in it, when they can carry a structure of it in their head, when a new paper can be placed against that structure rather than re-engaged from scratch, when they catch themselves recognising lens confusion in pop-science write-ups, when they leave better at the *kind* of reasoning the domain requires rather than just freighted with facts.

The atlas is failing if the reader walks away with a tidier set of conclusions and the same reasoning habits they arrived with. The atlas is succeeding if they walk away with sharper lens discipline, an updated sense of what is contested versus settled, and a substrate they want to return to as new evidence arrives.

The cleanest single statement: *we are not building a review article, we are building a workbench over a literature.* The aesthetic difference matters. A review article asks to be read. A workbench asks to be used.

## The reader, when they arrive

The implicit user is intelligent, motivated, and probably tired of two failure modes they have encountered repeatedly: pop-science flatness ("Ozempic makes dopamine go down, that's why it works for addiction") and review-article fog (forty pages of hedged prose with no structural anchor). They are sophisticated enough to mistrust both. They have probably tried to learn this material from a podcast or two and come away with a sense that the picture is more interesting than the podcast made it sound, but they cannot say exactly how.

They arrive in one of three states, and the design should accommodate all of them without forcing a single onboarding flow:

- **The orienter** wants to see the whole system before drilling in. They want a map room. They will be unhappy if the first surface they hit demands a question or a search.
- **The hunter** has a specific question. "Why does semaglutide reduce alcohol craving?" "Is the AD story dead after EVOKE?" "Is emotional blunting real?" They will be unhappy if they have to traverse three levels of navigation to reach mechanism content.
- **The returner** has been here before, knows the territory, and wants the latest. They will be unhappy if returning means re-orienting from scratch and the atlas has no memory of what has been added or revised.

A reasonable design accommodates all three. None of them should be the privileged user.

## Symptoms to treat

These are the frictions in the current literature-consumption experience that the atlas exists to resolve. Each one is a felt failure the reader has probably experienced, and the design should be tested against whether it makes the friction go away.

**Lens confusion**, in all its forms. A paper is about acute ICV exendin-4 in lean male rats and someone reads it as if it were about chronic peripheral semaglutide in obese humans. A dopamine-photometry finding gets read as a hedonic-tone finding. A nausea/aversion mechanism is conflated with satiety. A population-level mood signal gets argued against an acute central amygdala finding. The reader cannot tell which lens a given claim is making, and worse, they often cannot tell which lens *they* are reading through. The atlas should make the lens always present, always switchable, never invisible.

**Confidence flatness.** In conventional prose, "a recent study showed X" and "this is a robust finding across thirty papers and two RCTs" read the same. The reader has no fingertip-feel for which claims are load-bearing and which are speculative. The atlas should make confidence visually present at the point of claim, not relegated to a methods section.

**The "settled by polish" problem.** A well-designed website conveys authority. If the GLP-1 literature were settled, polish would be appropriate. It is not settled, and polish that signals settledness is actively misleading. The design needs to convey *honest unsettledness without losing aesthetic discipline*. This is the hardest single design challenge. Field-guide entailments (asterisks for "rare", notes about variants, willingness to say "this is what we see in the wild and here is what is ambiguous") are closer to the target than encyclopedia entailments.

**Contradiction-as-footnote.** Real contradictions exist in this literature — Kooji et al.'s photometry vs the canonical dopamine-blunting story; EVOKE's failure against the observational AD signal; cross-reward EHR effect sizes that are too large to be pure pharmacology. Prose handles these by hedging. The atlas should handle them as structure: visible, locatable, interrogable. A contradiction that the reader can *see* is a feature; one that is buried in hedging is a bug.

**The pop-science collapse.** "Dopamine down → less craving" is satisfying and wrong-enough-to-matter. Every page touching mesolimbic reward should resist this collapse without lecturing the reader about why.

**Decision fatigue at the wrong layer.** The reader should not be making layout-navigation decisions. They should be making lens-and-evidence decisions. If they are spending cognitive budget on where to click, that budget is being stolen from the actual reasoning. Navigation should be cheap; the atlas should feel like the cognitive effort goes into the mechanisms, not into the chrome.

**The "skim and move on" failure.** A pretty review article is read once and not returned to. The atlas should reward return visits. Re-engagement is a truer success metric than time-on-first-visit. Design choices that optimise for "wow on arrival" at the cost of "useful on return" are net negative.

**Phenomenology mis-mapping.** A patient says "food tastes flat" and the standard reading is "GLP-1 reduces liking". The honest reading is "this could be reduced wanting, mild nausea, true liking change, salience reweighting, or aversive interoception — and we don't have data to confidently distinguish." The phenomenology mapper needs to communicate this without becoming exhausting; it should feel like being handed a useful frame, not like being denied an answer.

## What good looks like experientially

**The moment of orientation.** A reader arrives at the overview atlas and within thirty seconds has a felt sense of "this is the territory; there is a peripheral drug, an access layer, a set of mechanism modules, a stress arm, a reward arm, a metabolic-neuroimmune arm, an evidence layer." Not memorised, not understood in depth — just *located*. The territory has shape.

**The moment of recognition.** A reader is reading a journalism piece about Ozempic and a side effect and they think "wait — that's the central amygdala / aversive interoception mechanism, the same one that suppresses alcohol consumption — these are the same thing seen from different sides." That recognition is the atlas working on the reader's reasoning, not just their knowledge.

**The lens-switching habit.** A reader, three weeks in, is reading a new GLP-1 paper and their first instinctive question is "what species, what route, what chronicity?" That instinct was not there before. It was installed by the atlas refusing to let those questions stay invisible.

**The contradiction-as-structure feeling.** A reader hits the wanting tab, sees the dopamine-rebalancing story, and *also sees* the Kooji photometry contradiction sitting right there as a node in the graph with its own provenance and confidence. They don't feel that the atlas is hiding something or making things tidy. They feel that the atlas is honest in a way that prose rarely manages.

**The state-dial moment.** A reader on the PPG-NTS page drags the state dial from fasted through fed through large-meal through stress through pharmacologic-agonism, and *feels* what the system is doing — the recruitment is phasic, the same circuit fires in radically different contexts, the pharmacology is sustaining a normally transient signal. That somatic-cognitive understanding does not come from prose. It comes from the dial.

**The phenomenology mapper's grace.** A reader types "alcohol stopped calling to me" and the mapper returns a thoughtful decomposition — strong fit with wanting reduction, cue-salience reduction, cross-reward pathway likely engaged, liking change unknown — with confidences and brief rationales. They feel that they have been handed a framework for thinking about their own (or a patient's) experience, not a diagnosis.

**The substrate feeling on return.** A reader who came three weeks ago comes back, notices that two claims have been updated since their last visit and a new piece of evidence has been added to the cross-reward matrix, and feels that the atlas is *maintained* — that it is a living thing they can trust to age well.

## What bad looks like experientially

**The dashboard slip.** The atlas starts feeling like a dashboard. Tiles, charts, numbers, summary statistics. The reader skims. They learn nothing. They do not return. Dashboards optimise for at-a-glance comprehension; the atlas's value is *not* at-a-glance — it is the structure that emerges from a few minutes of attentive engagement.

**Polish-as-authority.** The aesthetic becomes too resolved, too definitive-feeling, too magazine-like. The reader concludes the field is more settled than it is. They become more confident in claims that should remain provisional. The atlas has become misinformation by aesthetic.

**The medical-advice tone.** Helpful, friendly, reassuring language creeps in. "If you're experiencing emotional flattening on semaglutide, you should..." No. The atlas does not give advice. The atlas surfaces structure. The voice should be the voice of a careful, sophisticated colleague describing a literature, not the voice of a clinical decision-support tool.

**The chatbot collapse.** The phenomenology mapper or any LLM-touched surface starts feeling like a chatbot. The reader asks free-form questions, the system answers them, the reader stops doing cognitive work. Delegation, not participation. The mapper's outputs should *always* feel like scaffolding for further thought, never like answers.

**The interactive-for-its-own-sake trap.** Animations that don't carry information. Sliders that exist because sliders are fun. Toggles whose effect is decorative. Every interactive element should be doing real work; if it doesn't, it's stealing cognitive budget for nothing.

**The "everything is a graph" failure.** Not every mechanism is best shown as a node-edge graph. The wanting/liking/learning/effort decomposition is bars, not arrows. The translation ladder is a stack, not a network. The satiety-aversion threshold is a curve. The PPG-NTS state dial is a dial. Forcing graph aesthetics on everything degrades comprehension.

**The "dopamine goes down" surrender.** Any surface that ends up with "GLP-1 reduces dopamine, this reduces craving" as its takeaway has failed. The wanting/liking/learning/effort decomposition is not optional; it is the corrective, and it must be visually present on the relevant pages.

**The hedge-as-disclaimer pattern.** "Note: results vary by species/dose/route." That is hedge-as-disclaimer. The atlas's job is to make species/dose/route *visible as structure*, not to apologise for the variation in a footnote. If the scope conditions only appear as caveats, the design has not done its job.

**The stewardship blindness.** Months pass, the literature moves, the atlas does not. New EVOKE-class results land and the surface still reflects pre-2025 enthusiasm. This is not a content problem, it is a design problem — the design should make staleness visible, the steward's queue obvious, and the cost of updating low.

## Hard constraints — the invariants the design cannot break

These are the courtroom invariants from the product spec, translated into design language.

**Every claim must carry its confidence and its provenance, visibly, at the point where it appears.** This is non-negotiable. The exact treatment (badge, marker, micro-tooltip, dotted underline, hover panel) is yours. The fact of the visibility is not.

**Every claim must expose its scope conditions.** Species, route, chronicity, drug, baseline state. Always within one interaction of the claim. Buried scope is a design failure.

**Rodent central acute and human peripheral chronic must look visibly different.** This is the most important anti-hype protection in the system. Find the design device — chip, colour layer, glyph, label band — that makes the distinction unmissable.

**Lens switching must be cheap, visible, and stateful.** A reader should be able to flip between mechanistic and evidence and uncertainty views of the same page in under a second, with the lens state preserved as they move between mechanisms. The lens is the spine of the atlas's epistemic posture; it cannot be hidden in a settings menu.

**Contradictions must render as structure, not prose.** The Kooji vs canonical dopamine tension on the wanting tab is a worked example. Find the design device that makes a contradiction a *thing on the page* — a marked edge, a paired-claim node, a tension panel — rather than a sentence buried in body text.

**Confidence and evidence-type are independent dimensions and must remain so.** A claim can be high-confidence-rodent-only or low-confidence-human-RCT. The visual treatment must not collapse these into a single "trust score".

**Open questions are first-class surfaces, not the end of the article.** They appear on mechanism pages where relevant and aggregate to a top-level surface. Their visual treatment should signal "live frontier" not "to-do list".

**Stewardship metadata is visible without being noisy.** `lastReviewed` dates, version markers, recent-update indicators. Visible to a reader who looks, invisible to a reader who doesn't. Probably a quiet treatment — a date stamp, a small "updated" pip, an unobtrusive activity indicator on the navigation.

## Metaphor stack — what to lean on, what to lean away from

The product is named an atlas, but atlas is doing partial work and partially mis-signalling. The metaphor entailments worth holding consciously:

**Atlas (the named metaphor).** Strengths: implies a real territory being mapped, gives the reader a sense of comprehensive coverage, supports the map-room landing experience. Weaknesses: signals authoritative completeness, which the GLP-1 literature does not have. Lean on atlas for orientation moments. Lean away from atlas-as-finished-reference aesthetics.

**Field guide.** A field guide acknowledges that what you're identifying in the wild is sometimes ambiguous, that distinguishing features matter, that some specimens are clearly one thing and others are intermediate. Sibley's bird guide has asterisks for "rare" and notes about plumage variants. *Field-guide entailments are usually closer to the honest epistemic state than atlas entailments.* Use field-guide moves liberally: the asterisk, the note-about-variants, the willingness to say "ambiguous, here is how to think about it".

**Workbench.** A workbench implies the artifact is for *doing work on* the literature, not for *receiving information from* it. The reader is the worker; the atlas is the surface they manipulate. This entailment supports the most important participation-vs-delegation distinction and should govern the design of the interactive surfaces (lens switcher, state dial, moderator sliders, phenomenology mapper).

**Garden.** A garden makes stewardship visible: planted things, things that have died back, things that have spread. If you find a small surface for surfacing "recently planted" (newly added claims), "weeded" (retired claims), "spreading" (claims appearing across more mechanism modules) — that's a garden move, and it would carry the right entailments for the long-arc honesty of the artifact.

The atlas does not need to commit to any one metaphor. It needs to hold a controlled metaphor ecology in which the dominant register is workbench, the orientation moments are atlas, the epistemic posture is field-guide, and the long-arc stewardship feel is garden.

## The lens system, as an architectural sensibility

The lenses are not tabs within a tab. They are not a separate view mode. They are the way the atlas *thinks* about its content. Every visualisation in the system is some projection of the underlying claim graph through some lens.

This has design implications:

- The lens switcher is probably the single most important shared control in the system. It deserves visual prominence, but also visual restraint — it is a workhorse, not a feature. Find the treatment that makes lens-switching habitual.
- When the lens changes, the same visualisation should *transform*, not be replaced. The transformation itself carries information ("oh, that edge that looked confident under mechanistic-mode is faint under evidence-mode — because the evidence is rodent-only"). React Flow and Cytoscape both support smooth re-layout; lean into that.
- Some lenses dim things, some highlight things, some change what is shown entirely. The visual vocabulary for "this content is present but de-emphasised under this lens" needs to be consistent across the system.

## Uncertainty as visual presence

The hardest single design problem in this project is making uncertainty *aesthetically present without becoming visual noise*. A surface drowning in caveats and confidence markers is unreadable. A surface with no uncertainty markers is dishonest. The right balance is somewhere in the middle, and finding it is your art.

Some directions worth exploring:

- **Confidence as line weight or edge opacity** rather than as a separate label. The graph itself carries the epistemic weight; the reader's eye learns to read thickness as confidence.
- **Sketch-rendering for low-confidence claims** (roughjs-style hand-drawn aesthetic) and clean-rendering for high-confidence claims. This is risky — it could feel gimmicky — but it carries genuinely good entailments if executed well.
- **Confidence as a separate, small, persistent badge** on every claim card. Cheap, learnable, low cognitive overhead.
- **A dedicated "uncertainty lens"** that flattens content into a confidence-coded view and surfaces the contradictions and open questions as the visual centre of the page.

The product spec mandates *that* uncertainty is visible; it leaves *how* to you. Prototype several treatments. The right answer is the one that a sophisticated reader, three minutes in, has stopped consciously decoding because it has become legible.

## Notes on specific surfaces

These are not requirements. They are observations about specific surfaces where the design problem has a particular shape worth flagging.

**The overview atlas / landing.** The hardest single page in the project. It must orient without overwhelming, provide entry points without dictating a flow, signal what kind of artifact this is, and accommodate all three reader states (orienter, hunter, returner). Resist the temptation to make it a feature-tour. The orienter wants the map; the hunter wants the search/jump-to; the returner wants to know what is new. Three different needs, one page.

**The PPG-NTS state dial.** This is probably the most important single interaction in the entire atlas. It is where the central reframe — GLP-1 as a phasic interoceptive-aversive signal, not a tonic appetite signal — becomes felt rather than read. The dial has to feel *physical*. react-spring exists for exactly this kind of moment. Sloppy execution here costs the whole atlas.

**The wanting tab.** This is where the dopamine-monoculture failure is most likely. The four-component decomposition (wanting / liking / learning / effort) must be visually present, not hidden behind a click. The Kooji contradiction must be on the page, not in a footnote. The toy motivational model must be *visibly labelled as a toy*; readers will take the equation literally if not.

**The cross-reward radial.** The temptation is to make all spokes look equivalent. The honest treatment is to make confidence track domain — food and alcohol look bold and clean, gambling and shopping look faint and dotted. If a designer cannot bring themselves to make the gambling spoke look weaker, they have not internalised the epistemic posture.

**The HPA / amygdala split.** This page exists to teach bidirectionality. A simple "anxiogenic vs anxiolytic?" treatment will fail. The visual must hold dose, route, chronicity, and species as simultaneously present axes. The reader should leave understanding that the same molecule can be anxiogenic in one paradigm and neutral in another, and the design should make that feel non-paradoxical.

**The phenomenology mapper.** Input modality is open — a typed report, a tag-selection, a guided picker. The output must feel like *structure handed back*, not an answer. Probabilistic component decomposition with confidence levels and brief rationales. The mapper should not pretend to know what the reader is experiencing; it should make the reader's reasoning about their own experience cheaper and more disciplined.

**The evidence workbench.** The risk here is becoming a literature-search clone. The atlas is curated; the workbench is the courtroom layer. It should feel like a structured table of claims with evidence as their backing, not a PubMed-style results page. The integration with the graph (claim → mechanism → evidence flow) should be lateral, not hierarchical.

## Anti-patterns to refuse

A short list of moves to refuse even when they are easy or tempting.

- **The expert-friendly "developer mode" toggle** that reveals scope conditions and confidence "for the sophisticated reader". Wrong. Scope and confidence are not advanced features. They are always-visible features.
- **Smart defaults that hide complexity by default.** No. The atlas's job is to make complexity navigable, not to hide it.
- **Onboarding flows / coach marks / tooltip tours.** A well-designed atlas does not need a guided tour. The first surface should be self-explanatory enough that a sophisticated reader knows what to do within seconds.
- **Generic AI helper chat bubble in the corner.** The phenomenology mapper is the structured AI surface. There is no general-purpose chat. A free-form chat invites delegation; the atlas is participation.
- **Emoji confidence markers.** The atlas is sophisticated, not playful.
- **Animation-as-decoration.** Every animation must carry information. State changes, transitions between lenses, signal propagation through circuits — yes. Decorative motion — no.
- **The "share to social" button on mechanism pages.** This is not that kind of product. Sharing is supported via URL-synced state (nuqs) for a reason; the URL is the share unit, not a tweet template.
- **Gamification of any kind.** No streaks, no badges, no progress bars on reading. The atlas earns engagement by being useful, not by manipulating reward loops — which would be especially gross given the subject matter.

## Open design questions for you to explore

These are real and unresolved. The right answers may not exist yet; they should be prototyped and tested.

- What does the lens switcher look like as an always-present, low-noise control? A floating panel? A persistent strip? A keyboard-modal? A page-margin element?
- What is the visual vocabulary for "this edge is context-dependent — active under chronic peripheral dosing but not acute central"? An animated dashed line? A scope-condition badge on hover? A multi-state edge that the moderator dashboard toggles?
- How does the reader feel the *passage of time* on the artifact? Is there a recent-changes ticker? A "since you last visited" panel? A subtle aging cue on claims that have not been reviewed in months?
- What is the right onboarding for a first-time reader who arrives without context? A worked-example walk-through? A "start here" anchor? Nothing — and trust the overview atlas to do its work?
- How does the design accommodate dark mode and high-contrast modes without losing the confidence-visual-vocabulary?
- Is there a print stylesheet that lets a reader hand a clean version of a mechanism page to a colleague? Probably yes; this is the kind of artifact people will want to share offline.
- Where does the artifact's stewardship history live? A changelog? A per-claim history view? A repo-style activity stream?

## A closing posture

The atlas is a serious artifact about a literature that is moving fast and that has real-world consequences. The design should match. Not cold, not academic-dry, not corporate-blue — but *grown-up*. It should feel like a tool built by someone who respects the reader's intelligence, takes the science seriously, and is honest about what is known and what is not.

The single sharpest test: a thoughtful reader, three sessions in, should describe the atlas as a thing they trust more than the average review article and less than they would trust a finished textbook — and feel that this calibration is exactly right.

If they describe it as "a really cool Ozempic site", we have failed. If they describe it as "a substrate I keep returning to as I try to think about this literature honestly", we have succeeded.
