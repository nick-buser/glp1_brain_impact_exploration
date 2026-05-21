// Build-time gate. Validates data/*.json against the Zod schemas and the
// referential-integrity rules before the app is built. A claim without
// confidence, an edge without a backing claim, or a dangling id fails the
// build here — not in the browser.
//
// Runs on Node's native TypeScript support (Node 23.6+/24); no extra runner.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  CrossRewardModule,
  Dataset,
  PpgNtsModule,
  WantingModule,
  validateCrossReward,
  validateGraph,
  validatePpgNts,
  validateWanting,
} from '../src/lib/schemas.ts'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')

function read(file: string): unknown {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf8'))
}

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

const parsed = Dataset.safeParse({
  papers: read('papers.json'),
  evidence: read('evidence.json'),
  claims: read('claims.json'),
  atlas: read('atlas.json'),
})

if (!parsed.success) {
  for (const issue of parsed.error.issues) {
    console.error(`  · ${issue.path.join('.')}: ${issue.message}`)
  }
  fail('Dataset failed schema validation.')
}

const errors = validateGraph(parsed.data)
if (errors.length > 0) {
  for (const e of errors) console.error(`  · ${e}`)
  fail(`Dataset has ${errors.length} referential-integrity error(s).`)
}

const { papers, evidence, claims, atlas } = parsed.data
console.log(
  `✓ atlas graph valid — ${papers.length} papers · ${evidence.length} evidence · ` +
    `${claims.length} claims · ${atlas.nodes.length} nodes · ${atlas.edges.length} edges`,
)

// ── PPG-NTS module ──────────────────────────────────────────────────────────

const ppg = PpgNtsModule.safeParse(read('ppg-nts.json'))
if (!ppg.success) {
  for (const issue of ppg.error.issues) {
    console.error(`  · ${issue.path.join('.')}: ${issue.message}`)
  }
  fail('PPG-NTS module failed schema validation.')
}

const ppgErrors = validatePpgNts(ppg.data, new Set(claims.map((c) => c.id)))
if (ppgErrors.length > 0) {
  for (const e of ppgErrors) console.error(`  · ${e}`)
  fail(`PPG-NTS module has ${ppgErrors.length} integrity error(s).`)
}

console.log(
  `✓ ppg-nts module valid — ${ppg.data.states.length} states · ${ppg.data.targets.length} targets`,
)

// ── Wanting module ──────────────────────────────────────────────────────────

const wanting = WantingModule.safeParse(read('wanting.json'))
if (!wanting.success) {
  for (const issue of wanting.error.issues) {
    console.error(`  · ${issue.path.join('.')}: ${issue.message}`)
  }
  fail('Wanting module failed schema validation.')
}

const wantingErrors = validateWanting(wanting.data, new Set(claims.map((c) => c.id)))
if (wantingErrors.length > 0) {
  for (const e of wantingErrors) console.error(`  · ${e}`)
  fail(`Wanting module has ${wantingErrors.length} integrity error(s).`)
}

console.log(
  `✓ wanting module valid — ${wanting.data.berridge.length} Berridge rows · ` +
    `${wanting.data.phenomenology.fits.length} phenomenology fits`,
)

// ── Cross-reward module ─────────────────────────────────────────────────────

const crossReward = CrossRewardModule.safeParse(read('cross-reward.json'))
if (!crossReward.success) {
  for (const issue of crossReward.error.issues) {
    console.error(`  · ${issue.path.join('.')}: ${issue.message}`)
  }
  fail('Cross-reward module failed schema validation.')
}

const crossRewardErrors = validateCrossReward(
  crossReward.data,
  new Set(claims.map((c) => c.id)),
)
if (crossRewardErrors.length > 0) {
  for (const e of crossRewardErrors) console.error(`  · ${e}`)
  fail(`Cross-reward module has ${crossRewardErrors.length} integrity error(s).`)
}

console.log(
  `✓ cross-reward module valid — ${crossReward.data.domains.length} reward domains`,
)
