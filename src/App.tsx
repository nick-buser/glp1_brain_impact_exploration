import { NavLink, Route, Routes } from 'react-router-dom'
import { sections } from './lib/sections'
import SectionPage from './pages/SectionPage'

export default function App() {
  return (
    <div className="flex min-h-full bg-neutral-950 text-neutral-300">
      <nav className="w-64 shrink-0 border-r border-neutral-800 p-4">
        <div className="px-2 pb-4">
          <p className="text-sm font-medium text-neutral-100">GLP-1 Atlas</p>
          <p className="text-xs text-neutral-500">Brain Mechanism Explorer</p>
        </div>
        <ul className="space-y-0.5">
          {sections.map((s) => (
            <li key={s.path}>
              <NavLink
                to={s.path}
                end={s.path === '/'}
                className={({ isActive }) =>
                  `block rounded px-2 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-300'
                      : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                  }`
                }
              >
                {s.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <Routes>
          {sections.map((s) => (
            <Route
              key={s.path}
              path={s.path}
              element={<SectionPage section={s} />}
            />
          ))}
        </Routes>
      </main>
    </div>
  )
}
