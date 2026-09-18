import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, CheckCircle } from 'lucide-react'
import { api, setAuth } from '../utils/api.js'

const DEMO_ACCOUNTS = [
  { label: 'Law Enforcement', email: 'law@demo.com', password: 'demo123', bg: '#0f172a', hover: '#1e293b' },
  { label: 'Admin', email: 'admin@demo.com', password: 'demo123', bg: '#dc2626', hover: '#b91c1c' },
  { label: 'Student', email: 'student@demo.com', password: 'demo123', bg: '#7c3aed', hover: '#6d28d9' },
]

const ROLE_PATHS = {
  'law-enforcement': '/law-enforcement/dashboard',
  admin: '/admin/dashboard',
  student: '/student/dashboard',
}

const FEATURES = [
  'Phone & UPI Lookup',
  'Vehicle & Aadhaar Info',
  'CDR & IPDR Analysis',
  'Face Recognition',
  'Threat Intelligence',
]

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const doLogin = async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const data = await api.post('/api/auth/login', { email, password })
      setAuth(data.token, data.user)
      window.location.href = ROLE_PATHS[data.user.role] || '/login'
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    doLogin(form.email, form.password)
  }

  const handleDemo = (account) => {
    doLogin(account.email, account.password)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex' }}>

      {/* Left panel */}
      <div style={{ width: '420px', background: '#0f172a', padding: '40px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} color="#ffffff" />
          </div>
          <div>
            <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em' }}>CYBER RAKHWALA</p>
            <p style={{ color: '#64748b', fontSize: '0.72rem' }}>Intelligence Platform</p>
          </div>
        </div>

        <div>
          <h1 style={{ color: '#ffffff', fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '12px' }}>
            Secure Intelligence <br /> at your fingertips.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '28px' }}>
            OSINT tools, case management, and threat intelligence — built for law enforcement, researchers, and security professionals.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color="#06b6d4" />
                <span style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#475569', fontSize: '0.75rem' }}>
          Protected by Cyber Rakhwala Security Protocol v3.0
        </p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Welcome back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' }}>Sign in to access the platform</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="cr-input"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="cr-input"
                  style={{ paddingLeft: '36px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {loading ? 'Signing in...' : <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>Sign in <ArrowRight size={16} /></span>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', margin: '16px 0 0' }}>
            Law Enforcement?{' '}
            <Link to="/register" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </p>

          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Quick demo access
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.label}
                  onClick={() => handleDemo(account)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '10px 16px', borderRadius: '8px',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: '0.875rem', fontWeight: 600, color: '#ffffff',
                    background: account.bg, transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = account.hover}
                  onMouseLeave={e => e.currentTarget.style.background = account.bg}
                >
                  <span>{account.label}</span>
                  <ArrowRight size={15} color="#ffffff" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}