import fs from 'fs'
import path from 'path'
import stitchRouteMap from '../features/stitch/routes/stitch-route-map'

const root = process.cwd()
const appRoot = path.join(root, 'app')
const groupDirs = ['buyer', 'seller', 'admin', 'service', 'guest']

// Clean all group directories
for (const group of groupDirs) {
  const groupDir = path.join(appRoot, `(${group})`)
  if (fs.existsSync(groupDir)) {
    fs.rmSync(groupDir, { recursive: true, force: true })
    console.log(`Removed group directory: ${groupDir}`)
  }
}

const generated: string[] = []

for (const entry of Object.values(stitchRouteMap)) {
  // Extract segments from route: /buyer/buyer-marketplace-home -> ['buyer', 'buyer-marketplace-home']
  const routeSegments = entry.route.split('/').filter((s) => s.length > 0)
  if (routeSegments.length < 1) continue

  let journey = entry.journey
  let pathSegments = routeSegments

  // Skip first segment if it matches journey name or is 'onboarding'/'auth' for guest
  if (routeSegments[0] === journey) {
    pathSegments = routeSegments.slice(1)
  } else if (journey === 'guest' && (routeSegments[0] === 'onboarding' || routeSegments[0] === 'auth')) {
    pathSegments = routeSegments.slice(1)
  }

  const targetDir = path.join(appRoot, `(${journey})`, ...pathSegments)
  const pageFile = path.join(targetDir, 'page.tsx')

  fs.mkdirSync(targetDir, { recursive: true })

  const content = `export default function Page() {
  return (
    <main style={{ 
      padding: '48px 24px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1a1a1a' }}>
        {${JSON.stringify(entry.title)}}
      </h1>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#666' }}>Stitch ID:</strong>
          <p style={{ margin: '4px 0 0 0', fontFamily: 'monospace', color: '#333' }}>
            {${JSON.stringify(entry.id)}}
          </p>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#666' }}>Domain:</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>
            {${JSON.stringify(entry.domain)}}
          </p>
        </div>
        
        <div>
          <strong style={{ color: '#666' }}>Journey:</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>
            {${JSON.stringify(entry.journey)}}
          </p>
        </div>
      </div>
    </main>
  );
}
`

  fs.writeFileSync(pageFile, content, 'utf8')
  generated.push(pageFile)
}

console.log(`Generated ${generated.length} static screen pages.`)
