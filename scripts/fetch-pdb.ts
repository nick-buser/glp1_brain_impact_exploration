// Build-time structure fetcher for the brain-access module's Mol* viewer.
//
// Per docs/02-engineering-design.md the data pipeline fetches external
// references once, at author time, and commits the result — no runtime API
// calls. This script pulls the PDB structures the atlas renders and writes
// them to public/structures/. It is intentionally NOT wired into `pnpm build`:
// the .cif files are committed, so builds stay offline and reproducible. Re-run
// it by hand (`node scripts/fetch-pdb.ts`) only when the structure set changes.
//
// Runs on Node's native TypeScript support (Node 23.6+/24); no extra runner.

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// pdbId → output filename under public/structures/
const STRUCTURES: Record<string, string> = {
  // GLP-1 peptide bound in the GLP-1R extracellular domain — Underwood 2010.
  '3IOL': 'glp1r-ecd.cif',
}

const outDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'structures',
)
mkdirSync(outDir, { recursive: true })

let failed = false

for (const [pdbId, file] of Object.entries(STRUCTURES)) {
  const url = `https://files.rcsb.org/download/${pdbId}.cif`
  process.stdout.write(`fetching ${pdbId} → public/structures/${file} … `)
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = await res.text()
    if (!body.startsWith('data_')) throw new Error('response is not a CIF file')
    writeFileSync(join(outDir, file), body)
    console.log(`ok (${(body.length / 1024).toFixed(0)} kB)`)
  } catch (err) {
    failed = true
    console.log('FAILED')
    console.error(`  · ${err instanceof Error ? err.message : String(err)}`)
  }
}

if (failed) {
  console.error('\n✗ one or more structures failed to fetch\n')
  process.exit(1)
}
console.log(`\n✓ ${Object.keys(STRUCTURES).length} structure(s) up to date`)
