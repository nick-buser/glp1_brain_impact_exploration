// The workbench table proper — a headless @tanstack/react-table instance
// rendered into the atlas's Tufte register. The table engine owns sorting and
// filtering; the column definitions live in claim-columns. Row selection and
// graph-neighbour highlighting are passed in: the table stays a projection of
// state held one level up, in EvidenceWorkbench.

import { flexRender, type Table } from '@tanstack/react-table'
import type { ClaimRow } from '../lib/claim-table'
import { claimColumns } from './claim-columns'

export function EvidenceTable({
  table,
  selectedId,
  neighbourIds,
  onSelect,
}: {
  table: Table<ClaimRow>
  selectedId: string | null
  neighbourIds: Set<string>
  onSelect: (claimId: string) => void
}) {
  const rows = table.getRowModel().rows

  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <table className="wb-table">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const canSort = h.column.getCanSort()
                const sorted = h.column.getIsSorted()
                return (
                  <th
                    key={h.id}
                    className={canSort ? 'sortable' : undefined}
                    onClick={
                      canSort ? h.column.getToggleSortingHandler() : undefined
                    }
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {sorted && (
                      <span className="sort-ind">
                        {sorted === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="wb-empty" colSpan={claimColumns.length}>
                No claims match these filters.
              </td>
            </tr>
          )}
          {rows.map((r) => {
            const id = r.original.id
            const cls = [
              'wb-row',
              id === selectedId ? 'selected' : '',
              id !== selectedId && neighbourIds.has(id) ? 'neighbour' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <tr key={id} className={cls} onClick={() => onSelect(id)}>
                {r.getVisibleCells().map((c) => (
                  <td key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
