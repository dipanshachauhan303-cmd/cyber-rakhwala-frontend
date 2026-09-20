import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, CheckCircle } from 'lucide-react'
import { api, setAuth } from '../utils/api.js'

const DEMO_ACCOUNTS = [
  { label: 'Law Enforcement', email: 'law@demo.com', password: 'demo123', color: '#2563eb' },
  { label: 'Admin', email: 'admin@demo.com', password: 'demo123', color: '#dc2626' },
  { label: 'Student', email: 'student@demo.com', password: 'demo123', color: '#7c3aed' },
]

const ROLE_PATHS = {
  'law-enforcement': '/law-enforcement/dashboard',
  admin: '/admin/dashboard',
  student: '/student/dashboard',
}

const FEATURES = [
  'Phone & UPI Intelligence',
  'Vehicle & Aadhaar Lookup',
  'CDR & IPDR Analysis',
  'Face Recognition',
  'Threat Intelligence',
]

export default function Login() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bgRef = useRef(null)
  const globeRef = useRef(null)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Network background animation
  useEffect(() => {
    const canvas = bgRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.8,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      grad.addColorStop(0, '#eef2ff')
      grad.addColorStop(0.5, '#eff6ff')
      grad.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Orbs
      ;[
        { x: canvas.width * 0.1, y: canvas.height * 0.2, r: 200, c: 'rgba(147,197,253,0.3)' },
        { x: canvas.width * 0.9, y: canvas.height * 0.8, r: 250, c: 'rgba(96,165,250,0.2)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, r: 300, c: 'rgba(14,165,233,0.1)' },
      ].forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, o.c)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const a = 0.18 * (1 - dist / 120)
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(59,130,246,${a})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
        const p = pts[i]
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        g.addColorStop(0, 'rgba(37,99,235,0.8)')
        g.addColorStop(1, 'rgba(37,99,235,0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(59,130,246,0.9)'
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  // Globe animation
  useEffect(() => {
    const canvas = globeRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, angle = 0

    const draw = () => {
      ctx.clearRect(0, 0, 180, 180)
      const cx = 90, cy = 90, r = 70

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4)
      glow.addColorStop(0, 'rgba(59,130,246,0.18)')
      glow.addColorStop(1, 'rgba(59,130,246,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Fill
      const fill = ctx.createRadialGradient(cx - 25, cy - 25, 5, cx, cy, r)
      fill.addColorStop(0, 'rgba(219,234,254,0.5)')
      fill.addColorStop(0.6, 'rgba(59,130,246,0.15)')
      fill.addColorStop(1, 'rgba(30,58,138,0.3)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = fill
      ctx.fill()

      // Border
      const border = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
      border.addColorStop(0, 'rgba(147,197,253,1)')
      border.addColorStop(0.5, 'rgba(59,130,246,0.7)')
      border.addColorStop(1, 'rgba(30,58,138,0.9)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = border
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Latitude lines
      for (let lat = -75; lat <= 75; lat += 25) {
        const laR = lat * Math.PI / 180
        const lr = r * Math.cos(laR)
        const ly = cy + r * Math.sin(laR)
        if (lr <= 0) continue
        ctx.beginPath()
        ctx.ellipse(cx, ly, lr, lr * 0.18, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(147,197,253,${Math.cos(laR) * 0.3})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // Longitude lines
      for (let lon = 0; lon < 180; lon += 30) {
        const a = (lon + angle) * Math.PI / 180
        const cosA = Math.cos(a)
        const xr = r * Math.abs(cosA)
        if (xr < 2) continue
        const xOff = cx + r * Math.sin(a) * 0.5
        ctx.beginPath()
        ctx.ellipse(xOff, cy, xr * Math.abs(Math.sin(a) * 0.5 + 0.5), r, 0, -Math.PI / 2, Math.PI / 2)
        ctx.strokeStyle = `rgba(96,165,250,${Math.abs(cosA) * 0.35})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // City dots
      const cities = [[22, 40], [45, -20], [-30, 55], [10, -45], [60, 15], [-50, -35], [35, 65], [-15, 25]]
      cities.forEach(([la, lo]) => {
        const loR = (lo + angle) * Math.PI / 180
        const laR = la * Math.PI / 180
        if (Math.cos(loR) < 0) return
        const px = cx + r * Math.cos(laR) * Math.sin(loR)
        const py = cy - r * Math.sin(laR)
        const dg = ctx.createRadialGradient(px, py, 0, px, py, 7)
        dg.addColorStop(0, 'rgba(147,197,253,1)')
        dg.addColorStop(0.4, 'rgba(59,130,246,0.5)')
        dg.addColorStop(1, 'rgba(59,130,246,0)')
        ctx.beginPath()
        ctx.arc(px, py, 7, 0, Math.PI * 2)
        ctx.fillStyle = dg
        ctx.fill()
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#bfdbfe'
        ctx.fill()
      })

      // Shine
      const shine = ctx.createRadialGradient(cx - 25, cy - 25, 2, cx - 12, cy - 12, 40)
      shine.addColorStop(0, 'rgba(255,255,255,0.4)')
      shine.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = shine
      ctx.fill()

      angle += 0.3
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  const doLogin = async (email, password) => {
    const e = email.trim(), p = password.trim()
    if (!e) { setError('Email is required'); return }
    if (!p) { setError('Password is required'); return }
    if (p.length < 3) { setError('Password is too short'); return }
    setLoading(true); setError('')
    try {
      const data = await api.post('/api/auth/login', { email: e, password: p })
      setAuth(data.token, data.user)
      window.location.href = ROLE_PATHS[data.user.role] || '/login'
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    doLogin(form.email, form.password)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* Animated background */}
      <canvas ref={bgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Left panel - desktop */}
      {!isMobile && (
        <div style={{ width: '460px', flexShrink: 0, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(59,130,246,0.15)' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}>
              <Shield size={22} color="#ffffff" />
            </div>
            <div>
              <p style={{ color: '#1e3a8a', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.12em' }}>CYBER RAKHWALA</p>
              <p style={{ color: '#93c5fd', fontSize: '0.72rem', letterSpacing: '0.06em' }}>INTELLIGENCE PLATFORM v3.0</p>
            </div>
          </div>

          {/* Globe */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <canvas ref={globeRef} width={180} height={180} style={{ filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.4))' }} />
            <div>
              <h1 style={{ color: '#1e3a8a', fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '10px', textAlign: 'center' }}>
                Secure Intelligence<br />at your fingertips.
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, textAlign: 'center', marginBottom: '20px' }}>
                OSINT tools, case management, and threat intelligence built for law enforcement.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {FEATURES.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(59,130,246,0.1)' }}>
                    <CheckCircle size={14} color="#2563eb" />
                    <span style={{ color: '#1e3a8a', fontSize: '0.875rem', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p style={{ color: '#93c5fd', fontSize: '0.72rem', textAlign: 'center', letterSpacing: '0.06em' }}>
            PROTECTED BY CYBER RAKHWALA SECURITY PROTOCOL v3.0
          </p>
        </div>
      )}

      {/* Right panel - login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 16px' : '40px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                <Shield size={20} color="#ffffff" />
              </div>
              <div>
                <p style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.9rem', letterSpacing: '0.08em' }}>CYBER RAKHWALA</p>
                <p style={{ color: '#93c5fd', fontSize: '0.7rem' }}>Intelligence Platform</p>
              </div>
            </div>
          )}

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.15)', boxShadow: '0 8px 40px rgba(37,99,235,0.12)', padding: isMobile ? '24px 20px' : '32px' }}>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Welcome back</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '24px' }}>Sign in to access the platform</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#93c5fd" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" autoComplete="email" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setError('') }} placeholder="you@example.com" className="cr-input" style={{ paddingLeft: '36px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#93c5fd" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type={showPass ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }} placeholder="••••••••" className="cr-input" style={{ paddingLeft: '36px', paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#dc2626' }}>
                  ⚠ {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                {loading ? 'Signing in...' : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    Sign In <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', margin: '16px 0 14px' }}>
              Law Enforcement?{' '}
              <Link to="/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
            </p>

            <div style={{ borderTop: '1px solid rgba(59,130,246,0.1)', paddingTop: '16px' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', textAlign: 'center' }}>
                Quick Demo Access
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.label}
                    onClick={() => doLogin(account.email, account.password)}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '11px 16px', borderRadius: '8px',
                      border: `1px solid ${account.color}30`,
                      background: `${account.color}10`,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '0.875rem', fontWeight: 600, color: account.color,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${account.color}20`; e.currentTarget.style.borderColor = `${account.color}50` }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${account.color}10`; e.currentTarget.style.borderColor = `${account.color}30` }}
                  >
                    <span>{account.label}</span>
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}