// Column definitions for the evidence workbench table. Kept in their own
// module: they are data, not a component, and react-refresh wants component
// files to export only components. The @tanstack/react-table engine consumes
// these; EvidenceTable renders whatever the engine hands back.

import { createColumnHelper, type FilterFn } from '@tanstack/react-table'
import { CONFIDENCE_RANK, POLARITY_ORDER, type ClaimRow } from '../lib/claim-table'
import type { Species } from '../lib/schemas'
import { Confidence, ScopeChips } from './atlas'

const SPECIES_SHORT: Record<Species, string> = {
  human: 'HUM',
  nhp: 'NHP',
  rat: 'RAT',
  mouse: 'MUS',
  cell: 'CELL',
}

// A facet's value is an array of allowed strings; a row passes if its scalar
// cell value is in that array. Empty array = facet inactive.
const includesOne: FilterFn<ClaimRow> = (row, columnId, filterValue) => {
  const allowed = filterValue as string[]
  if (!allowed?.length) return true
  return allowed.includes(row.getValue(columnId) as string)
}

// The species column is itself a list (the claim's evidence spread); a row
// passes if any of its species is selected.
const overlapsSelected: FilterFn<ClaimRow> = (row, columnId, filterValue) => {
  const allowed = filterValue as string[]
  if (!allowed?.length) return true
  const mix = row.getValue(columnId) as string[]
  return mix.some((s) => allowed.includes(s))
}

const col = createColumnHelper<ClaimRow>()

export const claimColumns = [
  col.display({
    id: 'tension',
    header: '',
    cell: ({ row }) =>
      row.original.inTension ? (
        <span
          className="wb-tension"
          title="In tension — contradicts or is contradicted"
        >
          ⇄
        </span>
      ) : null,
  }),
  col.accessor('statement', {
    header: 'Claim',
    enableSorting: false,
    cell: (info) => <div className="wb-statement">{info.getValue()}</div>,
  }),
  col.accessor('confidence', {
    header: 'Confidence',
    filterFn: includesOne,
    sortingFn: (a, b) =>
      CONFIDENCE_RANK[a.original.confidence] - CONFIDENCE_RANK[b.original.confidence],
    cell: (info) => <Confidence level={info.getValue()} />,
  }),
  col.accessor('polarity', {
    header: 'Polarity',
    filterFn: includesOne,
    sortingFn: (a, b) =>
      POLARITY_ORDER.indexOf(a.original.polarity) -
      POLARITY_ORDER.indexOf(b.original.polarity),
    cell: (info) => (
      <span className="micro" style={{ color: 'var(--ink-2)' }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.display({
    id: 'scope',
    header: 'Representative scope',
    cell: ({ row }) => <ScopeChips scope={row.original.scope} compact />,
  }),
  col.accessor('speciesMix', {
    id: 'species',
    header: 'Evidence base',
    enableSorting: false,
    filterFn: overlapsSelected,
    cell: (info) => (
      <span className="micro" style={{ color: 'var(--ink-2)' }}>
        {info.getValue().map((s) => SPECIES_SHORT[s]).join(' · ')}
      </span>
    ),
  }),
  col.accessor('evidenceCount', {
    header: 'Obs.',
    cell: (info) => <span className="wb-num">{info.getValue()}</span>,
  }),
  col.accessor('atlasRefCount', {
    header: 'Atlas',
    cell: (info) => (
      <span className="wb-num" title="Atlas nodes + edges this claim authorises">
        ↪ {info.getValue()}
      </span>
    ),
  }),
  col.accessor('lastReviewed', {
    header: 'Reviewed',
    cell: ({ row }) => (
      <span
        className="wb-num"
        style={{
          color: row.original.staleDays > 90 ? 'var(--accent)' : 'var(--ink-3)',
        }}
        title={
          row.original.staleDays > 90
            ? `Stale — ${row.original.staleDays} days since review`
            : undefined
        }
      >
        {row.original.lastReviewed}
      </span>
    ),
  }),
]
