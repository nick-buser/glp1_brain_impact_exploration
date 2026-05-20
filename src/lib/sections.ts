// Information architecture for the GLP-1 Brain Mechanism Atlas.
// See docs/04-vision-statement.md and docs/02-engineering-design.md.

export type Section = {
  path: string
  title: string
  claim: string
}

export const sections: Section[] = [
  {
    path: '/',
    title: 'Overview Atlas',
    claim: 'The whole GLP-1 brain system at once, with progressive disclosure.',
  },
  {
    path: '/mechanisms/access',
    title: 'Brain Access',
    claim: 'How a peripheral peptide drug reaches the brain at all.',
  },
  {
    path: '/mechanisms/ppg-nts',
    title: 'Native GLP-1 / PPG-NTS',
    claim: 'What central GLP-1 is normally doing — a phasic satiety/aversion signal.',
  },
  {
    path: '/mechanisms/appetite',
    title: 'Appetite & Meal Termination',
    claim: 'The gut-brain-hypothalamus satiety pathway.',
  },
  {
    path: '/mechanisms/wanting',
    title: 'Mesolimbic Wanting',
    claim: 'Reduced cue-driven wanting more than core liking.',
  },
  {
    path: '/mechanisms/cross-reward',
    title: 'Cross-Reward Craving',
    claim: 'Why a metabolic drug touches alcohol, nicotine, and other rewards.',
  },
  {
    path: '/mechanisms/amygdala-gaba',
    title: 'Amygdala / GABA / Aversion',
    claim: 'The aversive-affect branch — not purely dopaminergic.',
  },
  {
    path: '/mechanisms/hpa',
    title: 'HPA / Stress / Anxiety',
    claim: 'Dissociating HPA activation from anxiety-like behavior.',
  },
  {
    path: '/mechanisms/hedonic-tone',
    title: 'Hedonic Tone',
    claim: 'Wanting vs liking vs learning vs effort.',
  },
  {
    path: '/mechanisms/neuroimmune',
    title: 'Neuroimmune / Insulin / Cognition',
    claim: 'Inflammation, central insulin signaling, and plasticity.',
  },
  {
    path: '/moderators',
    title: 'Moderators',
    claim: 'Dose, route, chronicity, species, sex, molecule, baseline state.',
  },
  {
    path: '/evidence',
    title: 'Evidence',
    claim: 'The paper table and claim graph.',
  },
  {
    path: '/open-questions',
    title: 'Open Questions',
    claim: 'What is still unknown.',
  },
]
