// Aggregates the open questions scattered across the atlas into one tracker.
// This module owns no data of its own — every question already lives in a
// validated mechanism module or on a claim. There are two kinds, and the
// distinction matters: module-level questions are what a mechanism module
// flags as unresolved; claim-level questions are sharper — each is pinned to
// one claim, so the evidence that would move it is already named and scoped.

import { dataset, resolveClaim, type ResolvedClaim } from './data'
import { accessModule } from './access'
import { appetiteModule } from './appetite'
import { aversiveModule } from './aversive'
import { neuroimmuneModule } from './neuroimmune'
import { moderatorsModule } from './moderators'
import { wantingModule } from './wanting'
import { phenomenologyModule } from './phenomenology'

export type ModuleQuestionGroup = {
  id: string
  title: string
  path: string
  questions: string[]
}

// Ordered to follow the nav. PPG-NTS and Cross-Reward raise no module-level
// questions — Cross-Reward's open thread is carried on a claim instead.
export const moduleQuestionGroups: ModuleQuestionGroup[] = [
  {
    id: 'access',
    title: 'Brain Access',
    path: '/mechanisms/access',
    questions: accessModule.openQuestions,
  },
  {
    id: 'appetite',
    title: 'Appetite & Meal Termination',
    path: '/mechanisms/appetite',
    questions: appetiteModule.openQuestions,
  },
  {
    id: 'wanting',
    title: 'Mesolimbic Wanting',
    path: '/mechanisms/wanting',
    questions: wantingModule.openQuestions,
  },
  {
    id: 'aversive',
    title: 'Amygdala / GABA / Aversion',
    path: '/mechanisms/amygdala-gaba',
    questions: aversiveModule.openQuestions,
  },
  {
    id: 'hedonic',
    title: 'Hedonic Tone',
    path: '/mechanisms/hedonic-tone',
    questions: phenomenologyModule.openQuestions,
  },
  {
    id: 'neuroimmune',
    title: 'Neuroimmune / Insulin / Cognition',
    path: '/mechanisms/neuroimmune',
    questions: neuroimmuneModule.openQuestions,
  },
  {
    id: 'moderators',
    title: 'Moderators',
    path: '/moderators',
    questions: moderatorsModule.openQuestions,
  },
]

export type ClaimQuestion = {
  question: string
  claim: ResolvedClaim
}

// Every claim that carries an `openQuestion`, resolved to its evidence so the
// tracker can show the provenance the question hangs on.
export const claimQuestions: ClaimQuestion[] = dataset.claims
  .flatMap((c) => {
    if (!c.openQuestion) return []
    const resolved = resolveClaim(c.id)
    return resolved ? [{ question: c.openQuestion, claim: resolved }] : []
  })

export const moduleQuestionCount = moduleQuestionGroups.reduce(
  (n, g) => n + g.questions.length,
  0,
)

export const totalOpenQuestions = moduleQuestionCount + claimQuestions.length
