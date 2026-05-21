// The two-channel contrast — the corrective to a dopamine monoculture.
// GLP-1RAs reduce intake through two dissociable channels that feel different:
// the mesolimbic wanting channel ("less pull toward") and the amygdala-GABA
// aversive channel ("more stop / avoid / malaise"). Per the UI/UX guide this
// belongs on the page as visible structure, not buried in prose.

import type { AversiveChannel } from '../lib/schemas'
import { resolveClaim } from '../lib/data'
import { aversiveModule } from '../lib/aversive'

function Channel({
  channel,
  color,
  borderLeft,
}: {
  channel: AversiveChannel
  color: string
  borderLeft?: boolean
}) {
  const resolved = channel.claimId ? resolveClaim(channel.claimId) : undefined
  const cite = resolved?.papers[0]?.cite
  return (
    <div
      style={{
        padding: '14px 16px',
        borderLeft: borderLeft ? '0.5px solid var(--rule)' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 1,
            background: color,
            display: 'inline-block',
          }}
        />
        <span className="micro" style={{ color: 'var(--ink-2)' }}>
          {channel.label}
        </span>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 17,
          fontStyle: 'italic',
          color: 'var(--ink-1)',
          margin: '8px 0 0 0',
          lineHeight: 1.3,
        }}
      >
        “{channel.phrase}”
      </p>
      <p
        className="margin-note"
        style={{ fontSize: 11.5, margin: '7px 0 0 0', fontStyle: 'normal' }}
      >
        {channel.note}
      </p>
      {cite && (
        <div className="micro" style={{ marginTop: 8, color: 'var(--ink-3)' }}>
          {cite}
        </div>
      )}
    </div>
  )
}

export function ChannelContrast() {
  const { contrast } = aversiveModule
  return (
    <div style={{ marginTop: 10 }}>
      <div
        className="panel"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
      >
        <Channel channel={contrast.wanting} color="var(--cool)" />
        <Channel channel={contrast.aversion} color="var(--accent)" borderLeft />
      </div>
      <p
        className="margin-note"
        style={{ fontSize: 12, margin: '9px 0 0 0' }}
      >
        {contrast.note}
      </p>
    </div>
  )
}
