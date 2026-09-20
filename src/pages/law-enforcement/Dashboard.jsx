import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import {
  Search, Zap, Shield, FileText,
  AlertTriangle, Activity, ArrowUpRight,
  Phone, Car, CreditCard
} from 'lucide-react'

const QUICK_TOOLS = [
  { icon: Phone, label: 'Phone Lookup', desc: 'Phone number intelligence', credits: 14, color: '#2563eb' },
  { icon: Activity, label: 'CDR Analysis', desc: 'Call Detail Records', credits: 25, color: '#8b5cf6' },
  { icon: Car, label: 'Vehicle Info', desc: 'RTO database lookup', credits: 15, color: '#0ea5e9' },
  { icon: CreditCard, label: 'UPI Lookup', desc: 'NPCI/UPI ID lookup', credits: 18, color: '#10b981' },
  { icon: Shield, label: 'Aadhaar Info', desc: 'UIDAI database lookup', credits: 30, color: '#f97316' },
  { icon: Search, label: 'Person Location', desc: 'Name/Area/City lookup', credits: 20, color: '#ec4899' },
]

const RECENT_CASES = [
  { id: 'CR-2024-001', title: 'Cyber Fraud Investigation', status: 'active', date: '2 hours ago', priority: 'high' },
  { id: 'CR-2024-002', title: 'Identity Theft Case', status: 'pending', date: '1 day ago', priority: 'medium' },
  { id: 'CR-2024-003', title: 'Financial Scam Analysis', status: 'closed', date: '3 days ago', priority: 'low' },
]

const THREAT_FEED = [
  { type: 'warning', msg: 'New phishing campaign detected — targeting banking users', time: '5 min ago' },
  { type: 'alert', msg: 'Ransomware variant LockBit 4.0 reported in Maharashtra', time: '22 min ago' },
  { type: 'info', msg: 'System maintenance scheduled tonight at 02:00 IST', time: '1 hour ago' },
]

const STATUS_COLORS = {
  active: { bg: '#dbeafe', color: '#1d4ed8', label: 'Active' },
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  closed: { bg: '#f1f5f9', color: '#64748b', label: 'Closed' },
}

const PRIORITY_COLORS = {
  high: { bg: '#fee2e2', color: '#dc2626' },
  medium: { bg: '#fef3c7', color: '#d97706' },
  low: { bg: '#f1f5f9', color: '#64748b' },
}

export default function LEDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState('auto')
  const [searching, setSearching] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    setUser(JSON.parse(stored))
    const fn = () => setIsMobile(window.innerWidth <= 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [navigate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setTimeout(() => setSearching(false), 1500)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="network" />

      <Sidebar role="law-enforcement" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={{ ...user, credits: 250 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          {/* Quick Investigation */}
          <div className="cr-card" style={{ padding: isMobile ? '16px' : '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.35)', flexShrink: 0 }}>
                <Search size={20} color="#ffffff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>Quick Investigation</h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Instant lookup for IP, Domain, Email, or Phone</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {['auto', 'ip', 'domain', 'email', 'phone'].map((t) => (
                <button key={t} onClick={() => setQueryType(t)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid',
                  borderColor: queryType === t ? '#2563eb' : 'rgba(59,130,246,0.15)',
                  background: queryType === t ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.7)',
                  color: queryType === t ? '#ffffff' : '#64748b',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  boxShadow: queryType === t ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
                }}>
                  {t === 'auto' ? '⚡ Auto' : t.toUpperCase()}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flexDirection: isMobile ? 'column' : 'row' }}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter IP, domain, email, or phone..." className="cr-input" style={{ flex: 1 }} />
              <button type="submit" disabled={searching} className="btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
                {searching ? 'Searching...' : <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Investigate <ArrowUpRight size={16} /></span>}
              </button>
            </form>
            <p style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '8px' }}>⚡ ~5–15 credits per lookup</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Searches', value: '0', icon: Search, grad: ['#2563eb', '#0ea5e9'], bg: '#dbeafe' },
              { label: 'Active Cases', value: '1', icon: FileText, grad: ['#10b981', '#06b6d4'], bg: '#d1fae5' },
              { label: 'Credits Used', value: '0', icon: Zap, grad: ['#f59e0b', '#f97316'], bg: '#fef3c7' },
              { label: 'Threats Flagged', value: '2', icon: AlertTriangle, grad: ['#ef4444', '#dc2626'], bg: '#fee2e2' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="cr-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{stat.label}</p>
                      <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1, fontFamily: 'JetBrains Mono, monospace' }}>{stat.value}</p>
                    </div>
                    <div style={{ width: '38px', height: '38px', background: `linear-gradient(135deg, ${stat.grad[0]}, ${stat.grad[1]})`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${stat.grad[0]}50` }}>
                      <Icon size={18} color="#ffffff" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Access Tools */}
          <div className="cr-card" style={{ padding: isMobile ? '16px' : '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>Quick Access Tools</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Launch frequently used tools</p>
              </div>
              <button onClick={() => navigate('/law-enforcement/tools')} style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View all <ArrowUpRight size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '10px' }}>
              {QUICK_TOOLS.map((tool) => {
                const Icon = tool.icon
                return (
                  <button key={tool.label} onClick={() => navigate('/law-enforcement/tools')} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '10px', background: 'rgba(255,255,255,0.7)', textAlign: 'left', width: '100%', backdropFilter: 'blur(8px)', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${tool.color}40`; e.currentTarget.style.boxShadow = `0 4px 16px ${tool.color}20` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ width: '34px', height: '34px', background: `linear-gradient(135deg, ${tool.color}20, ${tool.color}30)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tool.color}20` }}>
                        <Icon size={16} color={tool.color} />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 6px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Zap size={9} /> {tool.credits}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a' }}>{tool.label}</p>
                      {!isMobile && <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{tool.desc}</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>

            {/* Recent Cases */}
            <div className="cr-card" style={{ padding: isMobile ? '16px' : '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>Recent Cases</h3>
                <button onClick={() => navigate('/law-enforcement/cases')} style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Manage →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {RECENT_CASES.map((c) => {
                  const s = STATUS_COLORS[c.status]
                  const p = PRIORITY_COLORS[c.priority]
                  return (
                    <div key={c.id} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.1)', backdropFilter: 'blur(6px)' }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>{c.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.68rem', color: '#93c5fd', fontFamily: 'monospace' }}>{c.id}</span>
                        <span style={{ background: p.bg, color: p.color, fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '20px' }}>{c.priority}</span>
                        <span style={{ background: s.bg, color: s.color, fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '20px' }}>{s.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button onClick={() => navigate('/law-enforcement/cases')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '10px' }}>
                Create New Case
              </button>
            </div>

            {/* Threat Feed */}
            <div className="cr-card" style={{ padding: isMobile ? '16px' : '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>Threat Intel Feed</h3>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} /> Live
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {THREAT_FEED.map((item, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: item.type === 'alert' ? 'rgba(254,242,242,0.8)' : item.type === 'warning' ? 'rgba(255,251,235,0.8)' : 'rgba(239,246,255,0.8)', borderLeft: `3px solid ${item.type === 'alert' ? '#ef4444' : item.type === 'warning' ? '#f59e0b' : '#2563eb'}`, backdropFilter: 'blur(6px)' }}>
                    <p style={{ fontSize: '0.82rem', color: '#1e3a8a', lineHeight: 1.5 }}>{item.msg}</p>
                    <p style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '3px' }}>{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}