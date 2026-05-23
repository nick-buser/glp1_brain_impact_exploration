// Atlas component primitives — the shared visual vocabulary.
// Ported from designs/shared.jsx into typed React.

import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type {
  Chronicity,
  Confidence as ConfidenceLevel,
  Route,
  Scope,
  Species,
} from '../lib/schemas'
import type { ResolvedClaim } from '../lib/data'
import { daysSinceReviewed, STALE_THRESHOLD_DAYS } from '../lib/data'

// ── Eyebrow ─────────────────────────────────────────────────────────────────

export function Eyebrow({
  children,
  accent,
}: {
  children: ReactNode
  accent?: boolean
}) {
  return (
    <div className="eyebrow" style={accent ? { color: 'var(--accent)' } : undefined}>
      {children}
    </div>
  )
}

// ── Page footer ─────────────────────────────────────────────────────────────
// A `|_|`-shaped strip rendered below every route. Its purpose is purely
// orientational: it marks the bottom edge of the main viewport so the two
// column-scrolling regions inside a page read as scroll wells, not as static
// boxes that happen to be cropped.

export function PageFooter() {
  return (
    <div className="page-footer" role="presentation" aria-hidden="true">
      <div className="page-footer-well">
        <span className="page-footer-end">end of page</span>
      </div>
    </div>
  )
}

// ── Stewardship pip ─────────────────────────────────────────────────────────

export function StewardshipPip({ date, fresh }: { date: string; fresh?: boolean }) {
  return (
    <span className="pip">
      <span className={'pip-dot' + (fresh ? ' fresh' : '')} />
      {fresh ? 'Updated' : 'Reviewed'} {date}
    </span>
  )
}

// ── Module header ───────────────────────────────────────────────────────────

export function ModuleHeader({
  eyebrow,
  title,
  oneSentence,
  stewardship,
}: {
  eyebrow: string
  title: string
  oneSentence?: string
  stewardship?: { date: string; fresh?: boolean }
}) {
  return (
    <header style={{ padding: '20px 36px 16px 36px', borderBottom: '0.5px solid var(--rule)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 24,
        }}
      >
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div className="eyebrow">{eyebrow}</div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 27,
              fontWeight: 400,
              margin: '4px 0 0 0',
              lineHeight: 1.18,
              letterSpacing: '-0.012em',
            }}
          >
            {title}
          </h1>
          {oneSentence && (
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14.5,
                lineHeight: 1.55,
                color: 'var(--ink-2)',
                margin: '10px 0 0 0',
                maxWidth: 760,
                textWrap: 'pretty',
              }}
            >
              {oneSentence}
            </p>
          )}
        </div>
        {stewardship && (
          <div style={{ flexShrink: 0 }}>
            <StewardshipPip date={stewardship.date} fresh={stewardship.fresh} />
          </div>
        )}
      </div>
    </header>
  )
}

// ── Scope chips ─────────────────────────────────────────────────────────────

const SPECIES: Record<Species, { short: string; glyph: 'filled' | 'empty' }> = {
  human: { short: 'HUM', glyph: 'filled' },
  nhp: { short: 'NHP', glyph: 'filled' },
  rat: { short: 'RAT', glyph: 'empty' },
  mouse: { short: 'MUS', glyph: 'empty' },
  cell: { short: 'CELL', glyph: 'empty' },
}

const ROUTES: Record<Route, string> = {
  periph_tx: 'PERIPH·TX',
  periph_ex: 'PERIPH·EXP',
  icv: 'ICV',
  parenchymal: 'PARENCH',
  ex_vivo: 'EX-VIVO',
  oral: 'ORAL',
}

const CHRONICITY: Record<Chronicity, string> = {
  acute: 'ACUTE',
  subacute: 'SUBACUTE',
  chronic: 'CHRONIC',
}

function Chip({
  children,
  glyph,
  mode,
}: {
  children: ReactNode
  glyph?: 'filled' | 'empty'
  mode?: 'translation-fragile' | 'human-chronic'
}) {
  return (
    <span className={'chip' + (mode ? ' ' + mode : '')}>
      {glyph && <span className={'chip-glyph' + (glyph === 'empty' ? ' glyph-empty' : '')} />}
      <span>{children}</span>
    </span>
  )
}

/**
 * Renders species/route/chronicity (and optionally drug/assay/n) as chips.
 * Rodent · central · acute flags as translation-fragile; human · chronic ·
 * peripheral-therapeutic flags as the clinical register. This is the
 * anti-hype invariant: those two registers must look visibly different.
 */
export function ScopeChips({ scope, compact }: { scope: Scope; compact?: boolean }) {
  const sp = SPECIES[scope.species]
  const fragile =
    (scope.species === 'rat' || scope.species === 'mouse') &&
    (scope.route === 'icv' || scope.route === 'parenchymal') &&
    scope.chronicity === 'acute'
  const clinical =
    scope.species === 'human' &&
    scope.chronicity === 'chronic' &&
    scope.route === 'periph_tx'
  const mode = fragile ? 'translation-fragile' : clinical ? 'human-chronic' : undefined

  return (
    <div className="scope-strip">
      <Chip glyph={sp.glyph} mode={mode}>
        {sp.short}
      </Chip>
      <Chip mode={mode}>{ROUTES[scope.route]}</Chip>
      <Chip mode={mode}>{CHRONICITY[scope.chronicity]}</Chip>
      {!compact && scope.drug && <Chip>{scope.drug}</Chip>}
      {!compact && scope.assay && <Chip>{scope.assay}</Chip>}
      {!compact && scope.n != null && <Chip>n={scope.n.toLocaleString()}</Chip>}
    </div>
  )
}

// ── Confidence ──────────────────────────────────────────────────────────────

const CONF: Record<
  ConfidenceLevel,
  { bars: number; label: string; cls: string; glyph?: string }
> = {
  strong: { bars: 3, label: 'Strong', cls: '' },
  moderate: { bars: 2, label: 'Moderate', cls: '' },
  speculative: { bars: 1, label: 'Speculative', cls: '' },
  contradicted: { bars: 0, label: 'Contradicted', cls: 'contradicted', glyph: '⇄' },
  open: { bars: 0, label: 'Open question', cls: 'open', glyph: '◇' },
}

export function Confidence({
  level,
  hideLabel,
}: {
  level: ConfidenceLevel
  hideLabel?: boolean
}) {
  const c = CONF[level]
  if (c.glyph) {
    return (
      <span className={'conf ' + c.cls}>
        <span style={{ fontSize: 12, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
          {c.glyph}
        </span>
        {!hideLabel && <span>{c.label}</span>}
      </span>
    )
  }
  return (
    <span className="conf">
      <span className="conf-bars" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < c.bars ? 'on' : ''} />
        ))}
      </span>
      {!hideLabel && <span>{c.label}</span>}
    </span>
  )
}

// ── Claim card ──────────────────────────────────────────────────────────────

export function ClaimCard({ resolved }: { resolved: ResolvedClaim }) {
  const { claim, papers } = resolved
  const stale = daysSinceReviewed(claim) > STALE_THRESHOLD_DAYS

  return (
    <div className="claim">
      <p className="claim-statement">{claim.statement}</p>
      <div className="claim-meta">
        <Confidence level={claim.confidence} />
        <span className="sep" />
        <ScopeChips scope={claim.scope} compact />
      </div>
      <div className="claim-foot">
        <span>
          {resolved.evidence.length} evidence
          {stale && (
            <span style={{ color: 'var(--ink-3)', marginLeft: 8 }}>· stale &gt;90d</span>
          )}
        </span>
        {papers.length > 0 && (
          <span className="claim-cites">
            {papers.map((p, i) => (
              <Fragment key={p.id}>
                {i > 0 && <span className="claim-cite-sep"> · </span>}
                <Link
                  to={`/bibliography#${p.id}`}
                  className="claim-cite"
                  title={`${p.cite} — open in bibliography`}
                >
                  {p.cite}
                </Link>
              </Fragment>
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
