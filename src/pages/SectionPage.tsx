import type { Section } from '../lib/sections'

// Generic placeholder page. Each section will graduate into its own
// component (MechanismFlow graph, controls, evidence panel) per the
// per-tab skeleton in docs/04-vision-statement.md.
export default function SectionPage({ section }: { section: Section }) {
  return (
    <article className="mx-auto max-w-3xl px-8 py-12">
      <p className="text-xs uppercase tracking-widest text-violet-400">
        Mechanism Atlas
      </p>
      <h1 className="mt-2 text-3xl font-medium text-neutral-100">
        {section.title}
      </h1>
      <p className="mt-4 text-lg text-neutral-400">{section.claim}</p>

      <div className="mt-10 rounded-lg border border-dashed border-neutral-700 p-8 text-sm text-neutral-500">
        Scaffold placeholder. This page will hold: one-sentence claim → visual
        circuit → mechanism controls → evidence panel → caveats → couplings.
      </div>
    </article>
  )
}
