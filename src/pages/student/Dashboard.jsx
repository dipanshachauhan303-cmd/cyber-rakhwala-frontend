import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Zap, Phone, Globe, Mail, Hash, Image,
  Link, MapPin, Database, Wifi, MessageCircle,
  Car, CreditCard, Shield, Users, Activity,
  Clock, Bell, Download, Upload, ChevronRight,
  BookOpen, Award, X, ArrowUpRight, LogOut, Menu
} from 'lucide-react'
import { clearAuth } from '../../utils/api.js'

const TOOLS = [
  { id: 'ip-tracer', icon: Wifi, label: 'IP Tracer', code: 'trace-ip', credits: 23, category: 'Network' },
  { id: 'domain-intel', icon: Globe, label: 'Domain Intel', code: 'dnslookup', credits: 18, category: 'OSINT' },
  { id: 'email-osint', icon: Mail, label: 'Email OSINT', code: 'email-trace', credits: 27, category: 'OSINT' },
  { id: 'phone-lookup', icon: Phone, label: 'Phone Lookup', code: 'phone-intel', credits: 30, category: 'OSINT' },
  { id: 'social-scan', icon: Users, label: 'Social Scan', code: 'social-scan', credits: 38, category: 'OSINT' },
  { id: 'hash-check', icon: Hash, label: 'Hash Analyzer', code: 'hash-check', credits: 15, category: 'Forensics' },
  { id: 'img-data', icon: Image, label: 'Image EXIF', code: 'img-data', credits: 33, category: 'Forensics' },
  { id: 'url-scan', icon: Link, label: 'URL Scanner', code: 'url-scan', credits: 21, category: 'Threat' },
  { id: 'geo-lookup', icon: MapPin, label: 'Geo Lookup', code: 'geo-lookup', credits: 24, category: 'Geospatial' },
  { id: 'breach-db', icon: Database, label: 'Breach DB', code: 'breach-db', credits: 30, category: 'Security' },
  { id: 'dns-enum', icon: Globe, label: 'DNS Enum', code: 'dns-enum', credits: 18, category: 'Network' },
  { id: 'port-scan', icon: Wifi, label: 'Port Scan', code: 'port-scan', credits: 27, category: 'Network' },
  { id: 'wa-trace', icon: MessageCircle, label: 'WhatsApp Trace', code: 'wa-trace', credits: 30, category: 'Communication' },
  { id: 'face-scan', icon: Users, label: 'Face Recon', code: 'face-scan', credits: 38, category: 'Biometric' },
  { id: 'vehicle-lookup', icon: Car, label: 'Vehicle Info', code: 'vehicle-lookup', credits: 23, category: 'Records' },
  { id: 'upi-trace', icon: CreditCard, label: 'UPI Lookup', code: 'upi-trace', credits: 27, category: 'Financial' },
  { id: 'aadhaar-lookup', icon: Shield, label: 'Aadhaar Info', code: 'aadhaar-lookup', credits: 30, category: 'Identity' },
  { id: 'pan-trace', icon: CreditCard, label: 'PAN Lookup', code: 'pan-trace', credits: 27, category: 'Financial' },
  { id: 'cdr-analyze', icon: Activity, label: 'CDR Analysis', code: 'cdr-analyze', credits: 38, category: 'Telecom' },
  { id: 'ipdr-analyze', icon: Activity, label: 'IPDR Analysis', code: 'ipdr-analyze', credits: 38, category: 'Telecom' },
  { id: 'person-lookup', icon: Users, label: 'Person Lookup', code: 'person-lookup', credits: 30, category: 'Records' },
]

const CATEGORIES = ['All', 'Network', 'OSINT', 'Forensics', 'Threat', 'Geospatial', 'Security', 'Communication', 'Biometric', 'Records', 'Financial', 'Identity', 'Telecom']

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [activeTool, setActiveTool] = useState(null)
  const [toolInput, setToolInput] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    setUser(JSON.parse(stored))
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [navigate])

  const filtered = TOOLS.filter(t => {
    const matchCat = category === 'All' || t.category === category
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleRun = (e) => {
    e.preventDefault()
    if (!toolInput.trim()) return
    setRunning(true)
    setTimeout(() => {
      setResult({ message: 'Tool integration requires backend API. Demo mode active.', timestamp: new Date().toLocaleTimeString() })
      setRunning(false)
    }, 1500)
  }

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/login'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 98 }} />
      )}

      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        top: 0, left: isMobile ? (mobileMenuOpen ? 0 : '-220px') : 0,
        height: '100vh',
        zIndex: 99,
        transition: 'left 0.25s ease',
        boxShadow: isMobile && mobileMenuOpen ? '4px 0 20px rgba(0,0,0,0.4)' : 'none',
      }}>
        {/* User info */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: '#7c3aed', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>
                {(user.name || 'S')[0]}
              </span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'Student Demo'}</p>
              <p style={{ color: '#7c3aed', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase' }}>Student</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', padding: '3px 7px', flexShrink: 0 }}>
              <Zap size={11} color="#f59e0b" />
              <span style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700 }}>100</span>
            </div>
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {/* Category filters */}
          <div style={{ padding: '8px 12px' }}>
            <p style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Categories</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); if (isMobile) setMobileMenuOpen(false) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '7px 10px',
                    borderRadius: '6px', border: 'none', cursor: 'pointer',
                    background: category === cat ? 'rgba(14,165,233,0.12)' : 'transparent',
                    color: category === cat ? '#0ea5e9' : '#94a3b8',
                    fontSize: '0.82rem', fontWeight: category === cat ? 600 : 400,
                    borderRight: category === cat ? '2px solid #0ea5e9' : '2px solid transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', borderRadius: '6px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
          >
            <LogOut size={16} />
            <span style={{ fontSize: '0.875rem' }}>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{
          height: isMobile ? '56px' : '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0 16px' : '0 24px',
          flexShrink: 0,
          position: isMobile ? 'fixed' : 'relative',
          top: 0, left: 0, right: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', display: 'flex' }}>
                <Menu size={22} />
              </button>
            )}
            <div>
              <h1 style={{ fontSize: isMobile ? '0.9rem' : '1.25rem', fontWeight: 700, color: '#0f172a' }}>Student Dashboard</h1>
              {!isMobile && <p style={{ fontSize: '0.78rem', color: '#64748b' }}>OSINT Learning Platform</p>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: isMobile ? '5px 8px' : '6px 12px' }}>
              <Zap size={13} color="#d97706" />
              <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.875rem' }}>100</span>
              {!isMobile && <span style={{ color: '#92400e', fontSize: '0.78rem' }}>credits</span>}
            </div>
            <span style={{ background: '#ede9fe', color: '#7c3aed', fontSize: isMobile ? '0.65rem' : '0.75rem', fontWeight: 700, padding: isMobile ? '3px 8px' : '4px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
              {isMobile ? '1.5x' : 'Field Access (1.5x cost)'}
            </span>
          </div>
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Tools', value: TOOLS.length, icon: BookOpen, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Credits', value: '100', icon: Zap, color: '#d97706', bg: '#fef3c7' },
              { label: 'Scans', value: '0', icon: Search, color: '#10b981', bg: '#d1fae5' },
              { label: 'Awards', value: '0', icon: Award, color: '#8b5cf6', bg: '#ede9fe' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="cr-card" style={{ padding: isMobile ? '12px' : '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
                    <div style={{ width: '28px', height: '28px', background: stat.bg, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} color={stat.color} />
                    </div>
                  </div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="cr-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Tools grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="cr-card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color="#0ea5e9" />
                    </div>
                    <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Zap size={9} />{tool.credits}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{tool.label}</p>
                  {!isMobile && <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', marginBottom: '8px' }}>{tool.code}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: isMobile ? '8px' : '0' }}>
                    <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>{tool.category}</span>
                    <button
                      onClick={() => { setActiveTool(tool); setResult(null); setToolInput('') }}
                      style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '5px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      Run <ArrowUpRight size={11} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {/* Tool modal */}
      {activeTool && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '460px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', background: '#e0f2fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <activeTool.icon size={18} color="#0ea5e9" />
                </div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{activeTool.label}</p>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>{activeTool.code}</p>
                </div>
              </div>
              <button onClick={() => { setActiveTool(null); setResult(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRun} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Input</label>
                <input type="text" value={toolInput} onChange={e => setToolInput(e.target.value)} placeholder={`Enter query for ${activeTool.label}...`} className="cr-input" autoFocus />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} color="#d97706" /> {activeTool.credits} credits (1.5x = {Math.ceil(activeTool.credits * 1.5)})
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setActiveTool(null)} className="btn-secondary" style={{ padding: '8px 14px' }}>Cancel</button>
                  <button type="submit" disabled={running || !toolInput.trim()} className="btn-primary" style={{ padding: '8px 18px' }}>
                    {running ? 'Running...' : 'Execute'}
                  </button>
                </div>
              </div>
            </form>
            {result && (
              <div style={{ marginTop: '14px', padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', marginBottom: '3px' }}>✓ Query processed</p>
                <p style={{ fontSize: '0.78rem', color: '#15803d' }}>{result.message}</p>
                <p style={{ fontSize: '0.72rem', color: '#86efac', marginTop: '3px' }}>{result.timestamp}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}