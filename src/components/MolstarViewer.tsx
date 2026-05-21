// Mol* 3D structure viewer — the molecular hero for the brain-access module.
//
// Mol* is a ~600 kB bundle (the same engine RCSB embeds on every PDB page). It
// is dynamic-imported by the page via React.lazy so it ships ONLY to this
// route and never weighs down the landing bundle — the quarantine the eng doc
// requires. The standalone Viewer app is imported from `lib/apps/viewer/app`
// rather than the `index` barrel: the barrel pulls a raw `.scss` skin import
// Vite cannot process, so we take the Viewer class directly and load the
// prebuilt stylesheet ourselves.

import { useEffect, useRef, useState } from 'react'
import 'molstar/build/viewer/molstar.css'
import { Viewer } from 'molstar/lib/apps/viewer/app'

type Status = 'loading' | 'ready' | 'error'

export default function MolstarViewer({
  url,
  height = 300,
}: {
  url: string
  height?: number
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let viewer: Viewer | undefined
    let cancelled = false

    void (async () => {
      try {
        const v = await Viewer.create(host, {
          // No extensions: this is a plain structure view. Dropping them keeps
          // the mp4-export encoder and other extension weight out of the chunk.
          extensions: [],
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowRemoteState: false,
          layoutShowSequence: false,
          layoutShowLog: false,
          layoutShowLeftPanel: false,
          viewportShowExpand: true,
          viewportShowControls: false,
          viewportShowSettings: false,
          viewportShowSelectionMode: false,
          viewportShowAnimation: false,
          pdbProvider: 'rcsb',
        })
        if (cancelled) {
          v.dispose()
          return
        }
        viewer = v
        await v.loadStructureFromUrl(url, 'mmcif', false)
        if (!cancelled) setStatus('ready')
      } catch (err) {
        console.error('Mol* viewer failed to initialise:', err)
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
      viewer?.dispose()
    }
  }, [url])

  return (
    <div
      style={{
        position: 'relative',
        height,
        borderRadius: 4,
        overflow: 'hidden',
        border: '0.5px solid var(--rule-strong)',
        background: 'var(--bg-sunk)',
      }}
    >
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
      {status !== 'ready' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 28px',
            pointerEvents: status === 'error' ? 'auto' : 'none',
          }}
        >
          <span
            className="micro"
            style={{ color: status === 'error' ? 'var(--accent)' : 'var(--ink-3)' }}
          >
            {status === 'error'
              ? '3D viewer unavailable — WebGL may be disabled in this browser.'
              : 'Loading Mol* structure viewer…'}
          </span>
        </div>
      )}
    </div>
  )
}
