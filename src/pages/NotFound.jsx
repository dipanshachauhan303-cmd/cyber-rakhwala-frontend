import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>

        <div style={{
          width: '72px', height: '72px',
          background: '#fee2e2',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Shield size={32} color="#dc2626" />
        </div>

        <p style={{ fontSize: '4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>404</p>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
          Page Not Found
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
          The page you are looking for does not exist or you do not have access to it.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
            style={{ padding: '10px 20px' }}
          >
            <ArrowLeft size={15} /> Go Back
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{ padding: '10px 20px' }}
          >
            <Home size={15} /> Home
          </button>
        </div>
      </div>
    </div>
  )
}