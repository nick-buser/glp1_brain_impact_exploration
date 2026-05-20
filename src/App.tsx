import { lazy, Suspense, useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { sections } from './lib/sections'
import Overview from './pages/Overview'

// Mechanism pages are code-split: framer-motion and per-module data ship only
// to the routes that use them, keeping the landing route lean.
const PpgNts = lazy(() => import('./pages/PpgNts'))
const Wanting = lazy(() => import('./pages/Wanting'))
const SectionPage = lazy(() => import('./pages/SectionPage'))

const PPG_PATH = '/mechanisms/ppg-nts'
const WANTING_PATH = '/mechanisms/wanting'
const CUSTOM_PATHS = new Set(['/', PPG_PATH, WANTING_PATH])

function RouteFallback() {
  return (
    <div className="micro" style={{ padding: '56px 36px', color: 'var(--ink-3)' }}>
      Loading module…
    </div>
  )
}

type Theme = 'atlas-light' | 'atlas-dark'

export default function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('atlas-theme') as Theme) || 'atlas-light',
  )

  useEffect(() => {
    localStorage.setItem('atlas-theme', theme)
  }, [theme])

  return (
    <div className={`atlas ${theme}`} style={{ height: '100%', display: 'flex' }}>
      <nav
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
          onClick={() =>
            setTheme((t) => (t === 'atlas-light' ? 'atlas-dark' : 'atlas-light'))
          }
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
      </nav>

      <main style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--bg)' }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path={PPG_PATH} element={<PpgNts />} />
            <Route path={WANTING_PATH} element={<Wanting />} />
            {sections
              .filter((s) => !CUSTOM_PATHS.has(s.path))
              .map((s) => (
                <Route key={s.path} path={s.path} element={<SectionPage section={s} />} />
              ))}
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
