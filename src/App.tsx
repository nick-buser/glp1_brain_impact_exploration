import { lazy, Suspense, useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { sections } from './lib/sections'
import Overview from './pages/Overview'

// Mechanism pages are code-split: framer-motion and per-module data ship only
// to the routes that use them, keeping the landing route lean.
const BrainAccess = lazy(() => import('./pages/BrainAccess'))
const PpgNts = lazy(() => import('./pages/PpgNts'))
const Appetite = lazy(() => import('./pages/Appetite'))
const Wanting = lazy(() => import('./pages/Wanting'))
const CrossReward = lazy(() => import('./pages/CrossReward'))
const AversiveAffect = lazy(() => import('./pages/AversiveAffect'))
const Neuroimmune = lazy(() => import('./pages/Neuroimmune'))
const HedonicTone = lazy(() => import('./pages/HedonicTone'))
const Moderators = lazy(() => import('./pages/Moderators'))
const Evidence = lazy(() => import('./pages/Evidence'))
const OpenQuestions = lazy(() => import('./pages/OpenQuestions'))
const Bibliography = lazy(() => import('./pages/Bibliography'))

const ACCESS_PATH = '/mechanisms/access'
const PPG_PATH = '/mechanisms/ppg-nts'
const APPETITE_PATH = '/mechanisms/appetite'
const WANTING_PATH = '/mechanisms/wanting'
const CROSS_PATH = '/mechanisms/cross-reward'
const AVERSIVE_PATH = '/mechanisms/amygdala-gaba'
const NEURO_PATH = '/mechanisms/neuroimmune'
const HEDONIC_PATH = '/mechanisms/hedonic-tone'
const MODERATORS_PATH = '/moderators'
const EVIDENCE_PATH = '/evidence'
const OPEN_QUESTIONS_PATH = '/open-questions'
const BIBLIOGRAPHY_PATH = '/bibliography'
// The HPA / stress-axis content lives in the Aversive Affect module, and the
// standalone nav entry has been dropped; this route survives only to redirect
// old links and bookmarks.
const HPA_PATH = '/mechanisms/hpa'

function RouteFallback() {
  return (
    <div className="micro" style={{ padding: '56px 36px', color: 'var(--ink-3)' }}>
      Loading module…
    </div>
  )
}

type Theme = 'atlas-light' | 'atlas-dark'

function NavContents({
  theme,
  onThemeToggle,
  onNavClose,
}: {
  theme: Theme
  onThemeToggle: () => void
  onNavClose: () => void
}) {
  return (
    <>
      <div style={{ padding: '18px 20px 12px 20px' }}>
        <div className="eyebrow">GLP-1 Brain Mechanism Atlas</div>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 13,
            color: 'var(--ink-2)',
            margin: '6px 0 0 0',
            lineHeight: 1.4,
            fontStyle: 'italic',
          }}
        >
          A workbench over a moving literature.
        </p>
      </div>
      <hr className="hr" />

      <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0', flex: 1 }}>
        {sections.map((s, i) => (
          <li key={s.path}>
            <NavLink
              to={s.path}
              end={s.path === '/'}
              onClick={onNavClose}
              style={({ isActive }) => ({
                display: 'grid',
                gridTemplateColumns: '26px 1fr',
                gap: 8,
                alignItems: 'baseline',
                padding: '7px 20px',
                textDecoration: 'none',
                background: isActive ? 'var(--accent-bg)' : 'transparent',
                borderLeft: isActive
                  ? '1.5px solid var(--accent)'
                  : '1.5px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <span className="micro" style={{ color: 'var(--ink-3)' }}>
                    {String(i).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 13,
                      lineHeight: 1.3,
                      color: isActive ? 'var(--ink-1)' : 'var(--ink-2)',
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {s.title}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="hr" />
      <button
        type="button"
        onClick={onThemeToggle}
        className="micro"
        style={{
          margin: '10px 20px',
          padding: '6px 8px',
          background: 'transparent',
          border: '0.5px solid var(--rule-strong)',
          borderRadius: 2,
          color: 'var(--ink-2)',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {theme === 'atlas-light' ? '◑ Deep ink' : '◐ Warm paper'}
      </button>
    </>
  )
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('atlas-theme') as Theme) || 'atlas-light',
  )
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem('atlas-theme', theme)
  }, [theme])

  // Close mobile nav when the route changes (user tapped a link)
  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  // Close mobile nav on Escape
  useEffect(() => {
    if (!navOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navOpen])

  // Lock body scroll while the mobile nav overlay is open
  useEffect(() => {
    document.body.classList.toggle('atlas-nav-open', navOpen)
    return () => document.body.classList.remove('atlas-nav-open')
  }, [navOpen])

  const toggleTheme = () =>
    setTheme((t) => (t === 'atlas-light' ? 'atlas-dark' : 'atlas-light'))

  return (
    <div className={`atlas ${theme}`} style={{ height: '100%', display: 'flex' }}>
      {/* Mobile gate — covers the whole viewport on narrow screens */}
      <div className="atlas-mobile-gate" role="alert" aria-live="polite">
        <div className="eyebrow" style={{ marginBottom: 16, letterSpacing: '0.09em' }}>
          GLP-1 Brain Mechanism Atlas
        </div>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: '-0.012em',
            color: 'var(--ink-1)',
            margin: '0 0 16px 0',
          }}
        >
          Built for a larger screen.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 15,
            lineHeight: 1.55,
            color: 'var(--ink-2)',
            margin: 0,
            maxWidth: 340,
            textWrap: 'pretty',
          }}
        >
          The interactive diagrams, force-directed mechanism graph, and
          split-panel module layout need room to work. Open on a laptop
          or desktop to explore.
        </p>
      </div>
      {/* Mobile top bar — hidden on desktop via CSS */}
      <div className="atlas-mobile-bar">
        <button
          type="button"
          className="atlas-hamburger"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="eyebrow" style={{ color: 'var(--ink-2)', letterSpacing: '0.09em' }}>
          GLP-1 Brain Atlas
        </span>
      </div>

      {/* Mobile backdrop — only in the DOM when the nav is open */}
      {navOpen && (
        <div
          className="atlas-nav-backdrop"
          aria-hidden="true"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Nav — desktop: fixed 232 px sidebar; mobile: slide-over overlay */}
      <nav
        className={`atlas-nav${navOpen ? ' atlas-nav--open' : ''}`}
        style={{
          width: 232,
          flexShrink: 0,
          borderRight: '0.5px solid var(--rule)',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {/* Close button row — hidden on desktop via CSS */}
        <div className="atlas-nav-close-row">
          <button
            type="button"
            className="atlas-nav-close"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
          >
            ✕
          </button>
        </div>

        <NavContents
          theme={theme}
          onThemeToggle={toggleTheme}
          onNavClose={() => setNavOpen(false)}
        />
      </nav>

      <main style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--bg)' }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path={ACCESS_PATH} element={<BrainAccess />} />
            <Route path={PPG_PATH} element={<PpgNts />} />
            <Route path={APPETITE_PATH} element={<Appetite />} />
            <Route path={WANTING_PATH} element={<Wanting />} />
            <Route path={CROSS_PATH} element={<CrossReward />} />
            <Route path={AVERSIVE_PATH} element={<AversiveAffect />} />
            <Route path={NEURO_PATH} element={<Neuroimmune />} />
            <Route path={HEDONIC_PATH} element={<HedonicTone />} />
            <Route path={MODERATORS_PATH} element={<Moderators />} />
            <Route path={EVIDENCE_PATH} element={<Evidence />} />
            <Route path={OPEN_QUESTIONS_PATH} element={<OpenQuestions />} />
            <Route path={BIBLIOGRAPHY_PATH} element={<Bibliography />} />
            <Route path={HPA_PATH} element={<Navigate to={AVERSIVE_PATH} replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
