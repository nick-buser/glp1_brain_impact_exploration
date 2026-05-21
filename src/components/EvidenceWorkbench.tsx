// The workbench container — it owns the table state (sort, filters, search)
// and the selected claim, wires the facet controls to @tanstack/react-table's
// filter model, and lays the table beside the claim record. Facets are the
// workbench's epistemic controls: the same role the lens switcher plays on a
// mechanism page, here expressed as a courtroom's filing system.

import { useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import {
  buildClaimRows,
  CONFIDENCE_ORDER,
  facetCounts,
  POLARITY_ORDER,
  SPECIES_ORDER,
  type ClaimRow,
} from '../lib/claim-table'
import { neighbourClaimIds } from '../lib/data'
import { ClaimDetail } from './ClaimDetail'
import { claimColumns } from './claim-columns'
import { EvidenceTable } from './EvidenceTable'

const SPECIES_LABEL: Record<string, string> = {
  human: 'Human',
  nhp: 'NHP',
  rat: 'Rat',
  mouse: 'Mouse',
  cell: 'Cell',
}

export function EvidenceWorkbench() {
  const rows = useMemo<ClaimRow[]>(() => buildClaimRows(), [])
  const counts = useMemo(() => facetCounts(rows), [rows])

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'confidence', desc: false },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const table = useReactTable({
    data: rows,
    columns: claimColumns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value) => {
      const q = String(value).trim().toLowerCase()
      if (!q) return true
      return row.original.statement.toLowerCase().includes(q)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const selectedRow = selectedId
    ? rows.find((r) => r.id === selectedId) ?? null
    : null
  const neighbourIds = useMemo(
    () => (selectedId ? neighbourClaimIds(selectedId) : new Set<string>()),
    [selectedId],
  )

  const facetValue = (id: string): string[] =>
    (columnFilters.find((f) => f.id === id)?.value as string[]) ?? []

  const toggleFacet = (id: string, value: string) => {
    setColumnFilters((prev) => {
      const current = (prev.find((f) => f.id === id)?.value as string[]) ?? []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      const others = prev.filter((f) => f.id !== id)
      return next.length ? [...others, { id, value: next }] : others
    })
  }

  const filtered = table.getRowModel().rows.length
  const dirty = columnFilters.length > 0 || globalFilter.trim() !== ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* ── Facet bar ── */}
      <div className="wb-facets">
        <FacetGroup
          label="Confidence"
          values={CONFIDENCE_ORDER}
          counts={counts.confidence}
          active={facetValue('confidence')}
          onToggle={(v) => toggleFacet('confidence', v)}
        />
        <FacetGroup
          label="Polarity"
          values={POLARITY_ORDER}
          counts={counts.polarity}
          active={facetValue('polarity')}
          onToggle={(v) => toggleFacet('polarity', v)}
        />
        <FacetGroup
          label="Evidence base"
          values={SPECIES_ORDER}
          counts={counts.species}
          labels={SPECIES_LABEL}
          active={facetValue('species')}
          onToggle={(v) => toggleFacet('species', v)}
        />

        <input
          className="wb-search"
          type="search"
          placeholder="Search claim text…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="wb-count">
            {filtered} of {rows.length} claims
          </span>
          {dirty && (
            <button
              type="button"
              className="wb-reset"
              onClick={() => {
                setColumnFilters([])
                setGlobalFilter('')
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Table + claim record ── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 384px',
        }}
      >
        <EvidenceTable
          table={table}
          selectedId={selectedId}
          neighbourIds={neighbourIds}
          onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
        />
        <ClaimDetail
          row={selectedRow}
          onSelectClaim={(id) => setSelectedId(id)}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  )
}

function FacetGroup({
  label,
  values,
  counts,
  labels,
  active,
  onToggle,
}: {
  label: string
  values: readonly string[]
  counts: Record<string, number>
  labels?: Record<string, string>
  active: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="wb-facet-group">
      <span className="wb-facet-label">{label}</span>
      {values.map((v) => {
        const n = counts[v] ?? 0
        if (n === 0) return null
        const on = active.includes(v)
        return (
          <button
            key={v}
            type="button"
            className={
              'facet-chip' +
              (on ? ' on' : '') +
              (v === 'contradicted' || v === 'contradicts' ? ' tension' : '')
            }
            onClick={() => onToggle(v)}
            aria-pressed={on}
          >
            {labels?.[v] ?? v}
            <span className="facet-n">{n}</span>
          </button>
        )
      })}
    </div>
  )
}
