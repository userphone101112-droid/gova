import stitchRouteMap from '../../routes/stitch-route-map'

export type StitchNavOverlayProps = {
  isOpen?: boolean
  onClose?: () => void
}

export function StitchNavigationOverlay({ isOpen = true, onClose }: StitchNavOverlayProps) {
  const journeyGroups = {
    buyer: [] as Array<{ title: string; route: string; id: string }>,
    seller: [] as Array<{ title: string; route: string; id: string }>,
    admin: [] as Array<{ title: string; route: string; id: string }>,
    service: [] as Array<{ title: string; route: string; id: string }>,
    guest: [] as Array<{ title: string; route: string; id: string }>,
  }

  for (const entry of Object.values(stitchRouteMap)) {
    journeyGroups[entry.journey as keyof typeof journeyGroups]?.push({
      title: entry.title,
      route: entry.route,
      id: entry.id,
    })
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 400,
        maxHeight: '100vh',
        backgroundColor: 'white',
        borderLeft: '1px solid #ccc',
        overflowY: 'auto',
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Stitch Screens</h2>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>
            ✕
          </button>
        )}
      </div>

      {(Object.entries(journeyGroups) as Array<[string, typeof journeyGroups.buyer]>).map(
        ([journey, screens]) =>
          screens.length > 0 && (
            <div key={journey} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                {journey}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {screens.map((screen) => (
                  <li key={screen.id} style={{ marginBottom: 8 }}>
                    <a
                      href={screen.route}
                      style={{
                        display: 'block',
                        padding: 8,
                        fontSize: 13,
                        color: '#0066cc',
                        textDecoration: 'none',
                        borderRadius: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={screen.title}
                    >
                      {screen.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
    </div>
  )
}
