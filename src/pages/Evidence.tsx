// Evidence workbench — Slice 4, the courtroom layer. The same claims that
// weight the overview graph, laid flat as a sortable, faceted table; each row
// opens into its evidence observations, papers, and the atlas edges it
// underwrites. Contradictions stay visible as ⇄ rows rather than hedged away.
// It is a curated archive, not a literature search.

import { ModuleHeader } from '../components/atlas'
import { EvidenceWorkbench } from '../components/EvidenceWorkbench'

export default function Evidence() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModuleHeader
        eyebrow="10 · Evidence workbench · The courtroom layer"
        title="Every drawn edge, put on trial."
        oneSentence="The claim graph laid flat — sort and facet to interrogate it, open any row for the evidence observations, papers, and atlas connections behind it. Selecting a claim lights up its graph neighbours; contradictions stay visible as ⇄ rows, not buried in prose."
        stewardship={{ date: '2026-05-21', fresh: true }}
      />
      <EvidenceWorkbench />
    </div>
  )
}
