// The lens system. A lens is a projection of the same claim graph — it never
// replaces the graph, it re-weights it. Per docs/03-ui-ux-designer-guide.md:
// "When the lens changes, the same visualisation should transform, not be
// replaced. The transformation itself carries information."

import type { AtlasEdge, AtlasNode } from './schemas'

export type LensId =
  | 'mechanistic'
  | 'anatomical'
  | 'evidence'
  | 'uncertainty'
  | 'phenomenology'
  | 'moderator'

export type Lens = {
  id: LensId
  label: string
  hint: string
  /** What the projection does, shown in the in-graph legend. */
  legend: string
}

export const LENSES: Lens[] = [
  {
    id: 'mechanistic',
    label: 'Mechanistic',
    hint: 'Circuits, molecules, directions',
    legend: 'All edges shown. Direction and relation labels emphasised.',
  },
  {
    id: 'anatomical',
    label: 'Anatomical',
    hint: 'Regions, projections, receptors',
    legend: 'Outcome and phenomenology nodes dimmed; the BBB diaphragm foregrounded.',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    hint: 'Edges weighted by what backs them',
    legend: 'Edges weighted by replication. Speculative and open claims dim.',
  },
  {
    id: 'uncertainty',
    label: 'Uncertainty',
    hint: 'Contradictions and open questions foregrounded',
    legend: 'Contradictions and open questions in sienna; settled edges dim.',
  },
  {
    id: 'phenomenology',
    label: 'Phenomenology',
    hint: 'What it might feel like',
    legend: 'Outcome and experience nodes accentuated; deep anatomy dim.',
  },
  {
    id: 'moderator',
    label: 'Moderator',
    hint: 'Dose × route × chronicity × species',
    legend: 'Edges that flip with dose/route/chronicity foregrounded; context labels show the modifier.',
  },
]

export const lensById = new Map(LENSES.map((l) => [l.id, l]))

export type NodeProjection = { dim: boolean; accent: boolean }
export type EdgeProjection = { dim: boolean; showLabel: boolean; showContext: boolean }

const isOutcome = (n: AtlasNode) => n.kind === 'outcome'

/** Project a node through the active lens. */
export function projectNode(node: AtlasNode, lens: LensId): NodeProjection {
  let dim = false
  let accent = Boolean(node.contradiction || node.bidirectional)

  switch (lens) {
    case 'anatomical':
      if (isOutcome(node)) dim = true
      break
    case 'uncertainty':
      if (node.contradiction) accent = true
      else if (isOutcome(node) && !node.bidirectional) dim = true
      break
    case 'phenomenology':
      if (isOutcome(node)) accent = true
      else if (node.kind === 'region') dim = true
      break
    case 'moderator':
      if (['cea', 'pvn', 'drug', 'vag', 'trans'].includes(node.id)) accent = true
      else if (isOutcome(node)) dim = true
      break
    case 'mechanistic':
    case 'evidence':
      break
  }

  return { dim, accent }
}

/** Project an edge through the active lens. */
export function projectEdge(edge: AtlasEdge, lens: LensId): EdgeProjection {
  let dim = false
  const touchesOutcome = edge.from.startsWith('out_') || edge.to.startsWith('out_')

  switch (lens) {
    case 'anatomical':
      if (touchesOutcome) dim = true
      break
    case 'evidence':
      if (edge.confidence === 'speculative' || edge.confidence === 'open') dim = true
      break
    case 'uncertainty':
      if (!edge.contradiction && edge.confidence === 'strong') dim = true
      break
    case 'phenomenology':
      if (!touchesOutcome) dim = true
      break
    case 'moderator':
      if (!edge.contextNote) dim = true
      break
    case 'mechanistic':
      break
  }

  return {
    dim,
    showLabel: lens === 'mechanistic' || lens === 'moderator',
    showContext: lens === 'moderator',
  }
}

/** Whether to draw the BBB diaphragm for this lens. */
export function showBBB(lens: LensId): boolean {
  return lens === 'anatomical' || lens === 'mechanistic'
}
