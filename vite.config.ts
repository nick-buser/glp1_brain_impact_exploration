import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Mol* circular-import fix.
//
// Mol*'s `mol-plugin/behavior.js` eagerly captures namespace imports in an
// object literal — `BuiltInPluginBehaviors = { State: StaticState, ... }`.
// `behavior.js` sits inside a circular import, and any bundler that flattens
// ESM into one scope (Vite's dep optimizer in dev, Rolldown for the prod
// build) can emit `behavior.js` *before* `behavior/static/state.js`. The
// object literal then captures the not-yet-assigned `var`, so
// `BuiltInPluginBehaviors.State` is `undefined` and `Viewer.create` throws
// `Cannot read properties of undefined (reading 'registerDefault')`.
//
// The fix rewrites just that file so object-literal entries become lazy
// getters, deferring each namespace read to access time (inside
// `Viewer.create`), by when the `var` is assigned. The same plugin is
// registered twice: in `plugins` it reaches `behavior.js` during the prod
// build; in `optimizeDeps` it reaches it during dev dep pre-bundling (where
// Mol* is bundled before the top-level plugin pipeline sees it).
const molstarBehaviorFix = {
  name: 'molstar-behavior-lazy-namespaces',
  load(id: string) {
    const file = id.split('?')[0]
    if (!/mol-plugin[/\\]behavior\.js$/.test(file)) return null
    const src = readFileSync(file, 'utf8')
    const code = src.replace(
      /export const (BuiltInPluginBehaviors|PluginBehaviors) = \{([^}]*)\};/g,
      (_, name: string, body: string) => {
        const getters = body
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((pair) => {
            const [k, v] = pair.split(':').map((x) => x.trim())
            return `  get ${k}() { return ${v}; }`
          })
          .join(',\n')
        return `export const ${name} = {\n${getters}\n};`
      },
    )
    return code === src ? null : { code }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), molstarBehaviorFix],
  optimizeDeps: {
    rolldownOptions: { plugins: [molstarBehaviorFix] },
  },
})
