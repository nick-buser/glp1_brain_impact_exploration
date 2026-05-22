# Bibliography deep-links — feature note

Status: **deferred** (spec only, not built). Captured 2026-05-21.

## The idea

The Bibliography page already shows, for each reference, how load-bearing it is:
`cited by 3 claims · 5 observations`. That count is inert text. The ask is to
turn each usage into a **deep-link to the spot where the source is actually
used** — one link per claim that leans on the paper.

## What "the spots" are

A paper is used in two ways, both already computed in `Bibliography.tsx`:

- **Claims** — `claimsByPaper` maps each paper to the exact claim IDs.
- **Evidence observations** — `observationsByPaper` counts them; each
  observation has a stable `id`.

An evidence observation has **no standalone view** — it only renders inside its
owning claim's record (the right rail in `ClaimDetail.tsx`). So the meaningful
deep-link target is the **claim** on the Evidence workbench. A paper cited by
"3 claims · 5 observations" yields **3 links** (the claims); the 5 observations
belong to those same 3 claims and would be redundant as separate links.

## The one real gap

`EvidenceWorkbench.tsx` holds the selected claim in local React state
(`selectedId`), not in the URL. So `/evidence?claim=<id>` does nothing today.
To make deep-links land, that page must:

1. Read `?claim=` from the URL on mount (`useSearchParams`) and seed
   `selectedId` — this opens the right-rail claim record automatically.
2. Scroll the matching table row into view — `EvidenceTable.tsx` rows have no
   DOM anchor today, so add an `id`/`ref` to the `<tr>`.

Fresh navigation has empty facet filters, so the target row is never hidden —
no filter-clearing logic needed.

## The Bibliography change

Replace the plain `usageLabel` text with a list of links. The page would also
need `dataset.claims` (to label each link with the claim's statement rather
than a bare ID). Each entry becomes `<Link to={'/evidence?claim=' + claimId}>`.

## Effort estimate

| Piece | Effort |
| --- | --- |
| Workbench reads `?claim=` + scrolls row into view | ~30 min |
| Bibliography: claim list → links | ~20 min |
| (Optional) per-observation anchors in `ClaimDetail` for `#<evidenceId>` | +30 min |

~1 hour for solid per-claim deep-links; +30 min for per-observation anchors
(`/evidence?claim=X#<evidenceId>`) that scroll an individual observation card
in the right rail.

## Related

The reverse direction — citation → bibliography — is already done: no-DOI
citations in `ClaimDetail.tsx` link to `/bibliography#<paperId>`, and (as of
this note) every `ClaimCard` citation does too.
