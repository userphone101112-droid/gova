export default function Page() {
  return (
    <main style={{ 
      padding: '48px 24px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1a1a1a' }}>
        "Merchant Products (Dark)"
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
            "a66b5f2e60614cabbcda4ed7d198dfc8"
          </p>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#666' }}>Domain:</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>
            "Seller Operations"
          </p>
        </div>
        
        <div>
          <strong style={{ color: '#666' }}>Journey:</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#333' }}>
            "seller"
          </p>
        </div>
      </div>
    </main>
  );
}
