export default function Page() {
  return (
    <main style={{ 
      padding: '48px 24px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1a1a1a' }}>
        "Logistics & Delivery Dashboard"
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
            "f2c242e5523c43b0bdeab9d0996e5ab7"
          </p>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#666' }}>Domain:</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>
            "Service Marketplace"
          </p>
        </div>
        
        <div>
          <strong style={{ color: '#666' }}>Journey:</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>
            "service"
          </p>
        </div>
      </div>
    </main>
  );
}
