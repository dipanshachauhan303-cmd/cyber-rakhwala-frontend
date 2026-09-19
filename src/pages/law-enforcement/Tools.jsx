import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Phone, Users, Activity, Car, CreditCard, Shield,
  Search, Globe, Mail, Hash, Image, Link, MapPin,
  Database, Wifi, MessageCircle, Zap, X, ArrowUpRight,
  Radio, BarChart2
} from 'lucide-react'

const CATEGORIES = ['All', 'OSINT', 'Telecom', 'Financial', 'Identity', 'Forensics', 'Network', 'Biometric', 'Records', 'Communication', 'Geospatial']

const TOOLS = [
  { id: 'phone-lookup', icon: Phone, label: 'Phone Lookup', desc: 'Phone number intelligence', credits: 14, category: 'OSINT', color: '#f97316' },
  { id: 'face-recognition', icon: Users, label: 'Face Recognition', desc: 'Facial analysis & matching', credits: 25, category: 'Biometric', color: '#8b5cf6' },
  { id: 'cdr-analysis', icon: Activity, label: 'CDR Analysis', desc: 'Call Detail Records analysis', credits: 25, category: 'Telecom', color: '#8b5cf6' },
  { id: 'vehicle-info', icon: Car, label: 'Vehicle Info', desc: 'RTO database lookup', credits: 15, category: 'Records', color: '#f97316' },
  { id: 'upi-lookup', icon: CreditCard, label: 'UPI Lookup', desc: 'NPCI/UPI ID lookup', credits: 18, category: 'Financial', color: '#0ea5e9' },
  { id: 'aadhaar-info', icon: Shield, label: 'Aadhaar Info', desc: 'UIDAI database lookup', credits: 30, category: 'Identity', color: '#ec4899' },
  { id: 'pan-lookup', icon: CreditCard, label: 'PAN Lookup', desc: 'Income Tax database', credits: 18, category: 'Financial', color: '#10b981' },
  { id: 'ipdr-analysis', icon: Activity, label: 'IPDR Analysis', desc: 'IP Detail Records analysis', credits: 25, category: 'Telecom', color: '#8b5cf6' },
  { id: 'person-location', icon: MapPin, label: 'Person Location', desc: 'Name/Area/City lookup', credits: 20, category: 'Records', color: '#f97316' },
  { id: 'breach-database', icon: Database, label: 'Breach Database', desc: 'Check data breaches', credits: 30, category: 'Network', color: '#ef4444' },
  { id: 'ip-intelligence', icon: Wifi, label: 'IP Intelligence', desc: 'Trace and analyze IP', credits: 10, category: 'Network', color: '#0ea5e9' },
  { id: 'domain-analysis', icon: Globe, label: 'Domain Analysis', desc: 'Investigate domain info', credits: 8, category: 'OSINT', color: '#10b981' },
  { id: 'email-forensics', icon: Mail, label: 'Email Forensics', desc: 'Analyze email headers', credits: 12, category: 'Forensics', color: '#10b981' },
  { id: 'social-profiler', icon: Search, label: 'Social Profiler', desc: 'Social media recon', credits: 16, category: 'OSINT', color: '#ec4899' },
  { id: 'hash-analyzer', icon: Hash, label: 'Hash Analyzer', desc: 'Verify file integrity', credits: 6, category: 'Forensics', color: '#64748b' },
  { id: 'image-exif', icon: Image, label: 'Image EXIF', desc: 'Extract image metadata', credits: 15, category: 'Forensics', color: '#f97316' },
  { id: 'url-scanner', icon: Link, label: 'URL Scanner', desc: 'Scan URLs for threats', credits: 10, category: 'Network', color: '#ef4444' },
  { id: 'geolocation', icon: MapPin, label: 'Geolocation', desc: 'Geographic intelligence', credits: 12, category: 'OSINT', color: '#10b981' },
  { id: 'dns-records', icon: Globe, label: 'DNS Records', desc: 'Query DNS records', credits: 8, category: 'Network', color: '#0ea5e9' },
  { id: 'data-mining', icon: Database, label: 'Data Mining', desc: 'Advanced data extraction', credits: 18, category: 'OSINT', color: '#8b5cf6' },
  { id: 'whatsapp-trace', icon: MessageCircle, label: 'WhatsApp Trace', desc: 'Trace WhatsApp IPs', credits: 20, category: 'Communication', color: '#10b981' },
  { id: 'sdr', icon: Radio, label: 'SDR', desc: 'Software Defined Radio', credits: 20, category: 'Telecom', color: '#8b5cf6' },
  { id: 'vehicle-search', icon: Car, label: 'Vehicle Search', desc: 'Advanced vehicle search', credits: 18, category: 'Records', color: '#f97316' },
  { id: 'csr-analysis', icon: BarChart2, label: 'CSR Analysis', desc: 'Call Summary Records', credits: 22, category: 'Telecom', color: '#8b5cf6' },
  { id: 'tower-dump', icon: Radio, label: 'Tower Dump Analysis', desc: 'Cell tower data analysis', credits: 35, category: 'Telecom', color: '#ef4444' },
  { id: 'cell-id', icon: MapPin, label: 'Cell ID Location', desc: 'Cell tower ID mapping', credits: 25, category: 'Geospatial', color: '#10b981' },
  { id: 'ip-tracker', icon: Wifi, label: 'IP Tracker', desc: 'Real-time IP tracking', credits: 15, category: 'Network', color: '#0ea5e9' },
  { id: 'num-upi', icon: CreditCard, label: 'Number to UPI', desc: 'Find UPI IDs by number', credits: 20, category: 'Financial', color: '#10b981' },
  { id: 'num-image', icon: Image, label: 'Number to Image', desc: 'Images by phone number', credits: 25, category: 'OSINT', color: '#ec4899' },
  { id: 'osint-tools', icon: Search, label: 'OSINT Tools', desc: 'Open source intelligence', credits: 30, category: 'OSINT', color: '#0ea5e9' },
]

export default function LETools() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [activeTool, setActiveTool] = useState(null)
  const [toolInput, setToolInput] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
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
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleRun = (e) => {
    e.preventDefault()
    if (!toolInput.trim()) return
    setRunning(true)
    setTimeout(() => {
      setResult({
        message: 'Tool integration requires backend API. Demo mode active.',
        timestamp: new Date().toLocaleTimeString(),
      })
      setRunning(false)
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="law-enforcement" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0' }}>
        <Topbar user={{ ...user, credits: 250 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Investigation Tools</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Deploy specialized tools for your investigations</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="cr-input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '8px 12px', flexShrink: 0 }}>
              <Zap size={13} color="#d97706" />
              <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>250</span>
              <span style={{ color: '#92400e', fontSize: '0.78rem' }}>credits</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '5px 12px', borderRadius: '6px', border: '1px solid',
                  borderColor: category === cat ? '#0ea5e9' : '#e2e8f0',
                  background: category === cat ? '#e0f2fe' : '#ffffff',
                  color: category === cat ? '#0284c7' : '#64748b',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="cr-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '36px', height: '36px', background: tool.color + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={tool.color} />
                    </div>
                    <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Zap size={9} /> {tool.credits}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{tool.label}</p>
                    {!isMobile && <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{tool.desc}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                      {tool.category}
                    </span>
                    <button
                      onClick={() => { setActiveTool(tool); setToolInput(''); setResult(null) }}
                      style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '5px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      Launch <ArrowUpRight size={11} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {/* Tool Modal */}
      {activeTool && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: activeTool.color + '20', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <activeTool.icon size={20} color={activeTool.color} />
                </div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{activeTool.label}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{activeTool.desc}</p>
                </div>
              </div>
              <button onClick={() => { setActiveTool(null); setResult(null); setToolInput('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRun} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Query Input</label>
                <input
                  type="text"
                  value={toolInput}
                  onChange={e => setToolInput(e.target.value)}
                  placeholder={`Enter ${activeTool.label} query...`}
                  className="cr-input"
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={13} color="#d97706" /> {activeTool.credits} credits
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => { setActiveTool(null); setResult(null) }} className="btn-secondary" style={{ padding: '8px 14px' }}>Cancel</button>
                  <button type="submit" disabled={running || !toolInput.trim()} className="btn-primary" style={{ padding: '8px 18px' }}>
                    {running ? 'Running...' : 'Run Tool'}
                  </button>
                </div>
              </div>
            </form>

            {result && (
              <div style={{ marginTop: '16px', padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>✓ Query processed</p>
                <p style={{ fontSize: '0.82rem', color: '#15803d' }}>{result.message}</p>
                <p style={{ fontSize: '0.72rem', color: '#86efac', marginTop: '4px' }}>{result.timestamp}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}