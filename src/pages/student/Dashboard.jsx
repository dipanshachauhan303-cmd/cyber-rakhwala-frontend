import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Search, Zap, Phone, Globe, Mail, Hash, Image,
  Link, MapPin, Database, Wifi, MessageCircle,
  Car, CreditCard, Shield, Users, Activity,
  BookOpen, Award, X, ArrowUpRight
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
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [navigate])

  const filtered = TOOLS.filter(t => {
    const matchCat = category === 'All' || t.category === category
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar
        role="student"
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingTop: isMobile ? '56px' : '0',
        minWidth: 0,
      }}>
        <Topbar
          user={{ ...user, credits: 100 }}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          {/* Header */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Student Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>OSINT Learning Platform — Field Access (1.5x credit cost)</p>
          </div>

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
                    <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
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

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600,
                  border: '1px solid',
                  borderColor: category === cat ? '#0ea5e9' : '#e2e8f0',
                  background: category === cat ? '#e0f2fe' : '#ffffff',
                  color: category === cat ? '#0284c7' : '#64748b',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
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
                  {!isMobile && <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace', marginBottom: '8px' }}>{tool.code}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
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
                  <Zap size={12} color="#d97706" /> {activeTool.credits} × 1.5 = {Math.ceil(activeTool.credits * 1.5)} credits
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