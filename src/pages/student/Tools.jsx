import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import {
  Phone, Users, Car, CreditCard, Shield,
  Search, Globe, Mail, Hash, Image, Link, MapPin,
  Database, Wifi, MessageCircle, Zap, X, ArrowUpRight, Building
} from 'lucide-react'

const CATEGORIES = ['All', 'Network', 'OSINT', 'Forensics', 'Financial', 'Identity', 'Records', 'Business', 'Communication', 'Geospatial']

const TOOLS = [
  { id: 'phone-lookup', icon: Phone, label: 'Phone Lookup', desc: 'Phone number intelligence', credits: 14, category: 'OSINT' },
  { id: 'domain-intel', icon: Globe, label: 'Domain Analysis', desc: 'Investigate domain info', credits: 8, category: 'OSINT' },
  { id: 'email-osint', icon: Mail, label: 'Email Forensics', desc: 'Analyze email headers', credits: 12, category: 'Forensics' },
  { id: 'social-scan', icon: Users, label: 'Social Profiler', desc: 'Social media recon', credits: 16, category: 'OSINT' },
  { id: 'hash-check', icon: Hash, label: 'Hash Analyzer', desc: 'Verify file integrity', credits: 6, category: 'Forensics' },
  { id: 'img-data', icon: Image, label: 'Image EXIF', desc: 'Extract image metadata', credits: 15, category: 'Forensics' },
  { id: 'url-scan', icon: Link, label: 'URL Scanner', desc: 'Scan URLs for threats', credits: 10, category: 'Network' },
  { id: 'geo-lookup', icon: MapPin, label: 'Geolocation', desc: 'Geographic intelligence', credits: 12, category: 'Geospatial' },
  { id: 'breach-db', icon: Database, label: 'Breach Database', desc: 'Check data breaches', credits: 30, category: 'Network' },
  { id: 'dns-enum', icon: Globe, label: 'DNS Records', desc: 'Query DNS records', credits: 8, category: 'Network' },
  { id: 'ip-tracer', icon: Wifi, label: 'IP Intelligence', desc: 'Trace and analyze IP', credits: 10, category: 'Network' },
  { id: 'ip-tracker', icon: Wifi, label: 'IP Tracker', desc: 'Real-time IP tracking', credits: 15, category: 'Network' },
  { id: 'wa-trace', icon: MessageCircle, label: 'WhatsApp Trace', desc: 'Trace WhatsApp IPs', credits: 20, category: 'Communication' },
  { id: 'vehicle-lookup', icon: Car, label: 'Vehicle Info', desc: 'RTO database lookup', credits: 15, category: 'Records' },
  { id: 'upi-trace', icon: CreditCard, label: 'UPI Lookup', desc: 'NPCI/UPI ID lookup', credits: 18, category: 'Financial' },
  { id: 'pan-trace', icon: CreditCard, label: 'PAN Lookup', desc: 'Income Tax database', credits: 18, category: 'Financial' },
  { id: 'num-upi', icon: CreditCard, label: 'Number to UPI', desc: 'Find UPI IDs by number', credits: 20, category: 'Financial' },
  { id: 'num-image', icon: Image, label: 'Number to Image', desc: 'Images by phone number', credits: 25, category: 'OSINT' },
  { id: 'osint-tools', icon: Search, label: 'OSINT Tools', desc: 'Open source intelligence', credits: 30, category: 'OSINT' },
  { id: 'pan-verify', icon: CreditCard, label: 'PAN Verification', desc: 'Verify PAN number', credits: 18, category: 'Identity' },
  { id: 'pan-details', icon: CreditCard, label: 'PAN Details', desc: 'Get full PAN details', credits: 20, category: 'Identity' },
  { id: 'dl-verify', icon: Car, label: 'DL Verification', desc: 'Verify driving license', credits: 18, category: 'Records' },
  { id: 'gst-verify', icon: Building, label: 'GST Verification', desc: 'Verify GST number', credits: 15, category: 'Business' },
  { id: 'mca-company', icon: Building, label: 'MCA Company Search', desc: 'Search company in MCA', credits: 20, category: 'Business' },
  { id: 'rc-verify', icon: Car, label: 'RC Verification', desc: 'Verify vehicle RC', credits: 15, category: 'Records' },
  { id: 'rc-lite', icon: Car, label: 'RC Lite', desc: 'Quick RC lookup', credits: 12, category: 'Records' },
  { id: 'vehicle-challan', icon: Car, label: 'Vehicle Challan', desc: 'Check pending challans', credits: 15, category: 'Records' },
  { id: 'ifsc-details', icon: Database, label: 'Bank by IFSC', desc: 'Get bank details from IFSC', credits: 10, category: 'Financial' },
  { id: 'upi-verify', icon: CreditCard, label: 'UPI Verification', desc: 'Verify UPI ID', credits: 15, category: 'Financial' },
  { id: 'upi-validate', icon: CreditCard, label: 'UPI Validate', desc: 'Validate UPI payment address', credits: 15, category: 'Financial' },
]

export default function StudentTools() {
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
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="hex" />
      <Sidebar role="student" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={{ ...user, credits: 100 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Tools</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{TOOLS.length} tools available — 1.5x credit cost for students</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <Search size={14} color="#93c5fd" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..." className="cr-input" style={{ paddingLeft: '36px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '8px 12px', flexShrink: 0, backdropFilter: 'blur(8px)' }}>
              <Zap size={13} color="#d97706" />
              <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>100</span>
              {!isMobile && <span style={{ color: '#92400e', fontSize: '0.78rem' }}>credits</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600,
                border: '1px solid',
                borderColor: category === cat ? '#2563eb' : 'rgba(59,130,246,0.15)',
                background: category === cat ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.7)',
                color: category === cat ? '#ffffff' : '#64748b',
                cursor: 'pointer', whiteSpace: 'nowrap',
                backdropFilter: 'blur(6px)',
                boxShadow: category === cat ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
              }}>{cat}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
            {filtered.map((tool) => {
              const Icon = tool.icon
              const studentCredits = Math.ceil(tool.credits * 1.5)
              return (
                <div key={tool.id} className="cr-card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.2))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.15)' }}>
                      <Icon size={16} color="#2563eb" />
                    </div>
                    <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Zap size={9} />{studentCredits}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '2px' }}>{tool.label}</p>
                  {!isMobile && <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '6px' }}>{tool.desc}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span style={{ background: 'rgba(219,234,254,0.6)', color: '#1d4ed8', fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>{tool.category}</span>
                    <button onClick={() => { setActiveTool(tool); setResult(null); setToolInput('') }} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Run <ArrowUpRight size={11} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {activeTool && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,58,138,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '24px', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(37,99,235,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.2))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <activeTool.icon size={18} color="#2563eb" />
                </div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>{activeTool.label}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{activeTool.desc}</p>
                </div>
              </div>
              <button onClick={() => { setActiveTool(null); setResult(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRun} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Input</label>
                <input type="text" value={toolInput} onChange={e => setToolInput(e.target.value)} placeholder={`Enter query for ${activeTool.label}...`} className="cr-input" autoFocus />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(219,234,254,0.4)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '3px' }}>✓ Query processed</p>
                <p style={{ fontSize: '0.78rem', color: '#2563eb' }}>{result.message}</p>
                <p style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '3px' }}>{result.timestamp}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}