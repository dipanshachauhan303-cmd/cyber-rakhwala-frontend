import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Search, Zap, Shield, Clock, TrendingUp,
  Phone, Car, CreditCard, Users, ArrowUpRight,
  AlertTriangle, CheckCircle, Activity, FileText
} from 'lucide-react'

const QUICK_TOOLS = [
  { icon: Phone, label: 'Phone Lookup', desc: 'Phone number intelligence', credits: 14, color: '#f97316', path: '/law-enforcement/tools' },
  { icon: Users, label: 'Face Recognition', desc: 'Facial analysis & matching', credits: 25, color: '#8b5cf6', path: '/law-enforcement/tools' },
  { icon: Activity, label: 'CDR Analysis', desc: 'Call Detail Records', credits: 25, color: '#8b5cf6', path: '/law-enforcement/tools' },
  { icon: Car, label: 'Vehicle Info', desc: 'RTO database lookup', credits: 15, color: '#f97316', path: '/law-enforcement/tools' },
  { icon: CreditCard, label: 'UPI Lookup', desc: 'NPCI/UPI ID lookup', credits: 18, color: '#0ea5e9', path: '/law-enforcement/tools' },
  { icon: Shield, label: 'Aadhaar Info', desc: 'UIDAI database lookup', credits: 30, color: '#ec4899', path: '/law-enforcement/tools' },
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
  active: { bg: '#d1fae5', color: '#059669', label: 'Active' },
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

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    setUser(JSON.parse(stored))
  }, [navigate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setTimeout(() => setSearching(false), 1500)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="law-enforcement" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar user={{ ...user, credits: 250 }} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Quick Investigation */}
          <div className="cr-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={20} color="#0284c7" />
              </div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Quick Investigation</h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Instant lookup for IP, Domain, Email, or Phone</p>
              </div>
            </div>

            {/* Query type tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {['auto', 'ip', 'domain', 'email', 'phone'].map((t) => (
                <button
                  key={t}
                  onClick={() => setQueryType(t)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: queryType === t ? '#0ea5e9' : '#e2e8f0',
                    background: queryType === t ? '#e0f2fe' : '#ffffff',
                    color: queryType === t ? '#0284c7' : '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {t === 'auto' ? '⚡ Auto Detect' : t.toUpperCase()}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter IP, domain, email, or phone..."
                className="cr-input"
                style={{ flex: 1, fontSize: '0.95rem' }}
              />
              <button
                type="submit"
                disabled={searching}
                className="btn-primary"
                style={{ padding: '10px 24px', flexShrink: 0 }}
              >
                {searching ? 'Searching...' : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Investigate <ArrowUpRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '8px' }}>
              ⚡ ~5–15 credits per lookup based on query type
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Searches', value: '0', icon: Search, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Active Cases', value: '1', icon: FileText, color: '#10b981', bg: '#d1fae5' },
              { label: 'Credits Used', value: '0', icon: Zap, color: '#d97706', bg: '#fef3c7' },
              { label: 'Threats Flagged', value: '2', icon: AlertTriangle, color: '#ef4444', bg: '#fee2e2' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="cr-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        {stat.label}
                      </p>
                      <p className="stat-number">{stat.value}</p>
                    </div>
                    <div style={{ width: '40px', height: '40px', background: stat.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={stat.color} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Access Tools */}
          <div className="cr-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Quick Access Tools</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Launch frequently used investigation tools</p>
              </div>
              <button
                onClick={() => navigate('/law-enforcement/tools')}
                style={{ fontSize: '0.82rem', color: '#0ea5e9', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View all <ArrowUpRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {QUICK_TOOLS.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.label}
                    onClick={() => navigate(tool.path)}
                    className="cr-card"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '8px',
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ width: '36px', height: '36px', background: tool.color + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color={tool.color} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Zap size={10} /> {tool.credits}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{tool.label}</p>
                      <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{tool.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Recent Cases */}
            <div className="cr-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Recent Cases</h3>
                <button
                  onClick={() => navigate('/law-enforcement/cases')}
                  style={{ fontSize: '0.82rem', color: '#0ea5e9', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Manage cases →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {RECENT_CASES.map((c) => {
                  const s = STATUS_COLORS[c.status]
                  const p = PRIORITY_COLORS[c.priority]
                  return (
                    <div
                      key={c.id}
                      style={{
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{c.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{c.id} · {c.date}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ background: p.bg, color: p.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize' }}>
                          {c.priority}
                        </span>
                        <span style={{ background: s.bg, color: s.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => navigate('/law-enforcement/cases')}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '14px', padding: '10px' }}
              >
                Create New Case
              </button>
            </div>

            {/* Threat Intel Feed */}
            <div className="cr-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Threat Intel Feed</h3>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                  <span style={{ width: '7px', height: '7px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
                  Live
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {THREAT_FEED.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      background: item.type === 'alert' ? '#fff5f5' : item.type === 'warning' ? '#fffbeb' : '#f8fafc',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${item.type === 'alert' ? '#ef4444' : item.type === 'warning' ? '#f59e0b' : '#0ea5e9'}`,
                    }}
                  >
                    <p style={{ fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.5 }}>{item.msg}</p>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{item.time}</p>
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