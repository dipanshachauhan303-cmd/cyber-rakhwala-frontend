import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Phone, Users, Activity, Car, CreditCard, Shield,
  Search, Globe, Mail, Hash, Image, Link, MapPin,
  Database, Wifi, MessageCircle, Zap, X, ArrowUpRight,
  Radio, BarChart2, Fingerprint, FileText, Building
} from 'lucide-react'

const CATEGORIES = [
  'All', 'OSINT', 'Telecom', 'Financial', 'Identity',
  'Forensics', 'Network', 'Biometric', 'Records',
  'Communication', 'Geospatial', 'Business', 'Utility', 'DigiLocker'
]

const TOOLS = [
  // Existing tools
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

  // Identity Verification (NEW)
  { id: 'aadhaar-otp', icon: Shield, label: 'Aadhaar Send OTP', desc: 'Send OTP to Aadhaar linked mobile', credits: 20, category: 'Identity', color: '#ec4899' },
  { id: 'aadhaar-submit-otp', icon: Shield, label: 'Aadhaar Submit OTP', desc: 'Verify Aadhaar via OTP', credits: 25, category: 'Identity', color: '#ec4899' },
  { id: 'pan-verify', icon: CreditCard, label: 'PAN Verification', desc: 'Verify PAN number instantly', credits: 18, category: 'Identity', color: '#10b981' },
  { id: 'pan-details', icon: CreditCard, label: 'PAN Details', desc: 'Get full PAN card details', credits: 20, category: 'Identity', color: '#10b981' },
  { id: 'aadhaar-ocr', icon: Image, label: 'Aadhaar OCR', desc: 'Extract data from Aadhaar image', credits: 22, category: 'Identity', color: '#ec4899' },
  { id: 'pan-ocr', icon: Image, label: 'PAN OCR', desc: 'Extract data from PAN image', credits: 22, category: 'Identity', color: '#10b981' },
  { id: 'aadhaar-pan-link', icon: Link, label: 'Aadhaar–PAN Link Check', desc: 'Check Aadhaar and PAN linkage', credits: 15, category: 'Identity', color: '#8b5cf6' },

  // Government ID (NEW)
  { id: 'voter-id', icon: Shield, label: 'Voter ID Verification', desc: 'Verify voter ID details', credits: 18, category: 'Identity', color: '#0ea5e9' },
  { id: 'passport-verify', icon: FileText, label: 'Passport Verification', desc: 'Verify passport details', credits: 25, category: 'Identity', color: '#0ea5e9' },
  { id: 'dl-verify', icon: Car, label: 'Driving License Verification', desc: 'Verify driving license', credits: 18, category: 'Records', color: '#f97316' },

  // GST & Business (NEW)
  { id: 'gst-verify', icon: Building, label: 'GST Verification', desc: 'Verify GST number', credits: 15, category: 'Business', color: '#10b981' },
  { id: 'gst-return', icon: Building, label: 'GST Return Status', desc: 'Check GST return filing status', credits: 18, category: 'Business', color: '#10b981' },
  { id: 'gst-advance', icon: Building, label: 'GST Advance Details', desc: 'Get detailed GST information', credits: 20, category: 'Business', color: '#10b981' },
  { id: 'pan-by-gst', icon: CreditCard, label: 'PAN No by GST No', desc: 'Get PAN from GST number', credits: 15, category: 'Business', color: '#10b981' },
  { id: 'mca-company', icon: Building, label: 'MCA Company Search', desc: 'Search company in MCA database', credits: 20, category: 'Business', color: '#0ea5e9' },
  { id: 'mca-cin', icon: Building, label: 'MCA CIN Search', desc: 'Search by CIN number', credits: 20, category: 'Business', color: '#0ea5e9' },
  { id: 'name-to-cin', icon: Building, label: 'Name to CIN List', desc: 'Get CIN list by company name', credits: 18, category: 'Business', color: '#0ea5e9' },
  { id: 'din-details', icon: Users, label: 'DIN Details', desc: 'Director Identification Number details', credits: 18, category: 'Business', color: '#8b5cf6' },

  // Vehicle & Transport (NEW)
  { id: 'rc-verify', icon: Car, label: 'RC Verification', desc: 'Verify vehicle RC', credits: 15, category: 'Records', color: '#f97316' },
  { id: 'rc-details', icon: Car, label: 'RC Details', desc: 'Get full RC details', credits: 18, category: 'Records', color: '#f97316' },
  { id: 'rc-lite', icon: Car, label: 'RC Lite', desc: 'Quick RC lookup', credits: 12, category: 'Records', color: '#f97316' },
  { id: 'rc-owner-history', icon: Car, label: 'RC Owner History', desc: 'Vehicle ownership history', credits: 25, category: 'Records', color: '#f97316' },
  { id: 'rc-to-mobile', icon: Phone, label: 'RC Number to Mobile', desc: 'Get mobile from RC number', credits: 30, category: 'Records', color: '#f97316' },
  { id: 'vehicle-challan', icon: Car, label: 'Vehicle Challan', desc: 'Check pending challans', credits: 15, category: 'Records', color: '#ef4444' },
  { id: 'fastag-info', icon: Car, label: 'FasTag Info Fetch', desc: 'Get FasTag details', credits: 15, category: 'Records', color: '#f97316' },

  // Banking & UPI (NEW)
  { id: 'bank-verify', icon: CreditCard, label: 'Bank Verification', desc: 'Verify bank account', credits: 20, category: 'Financial', color: '#0ea5e9' },
  { id: 'ifsc-details', icon: Database, label: 'Bank Details by IFSC', desc: 'Get bank details from IFSC', credits: 10, category: 'Financial', color: '#0ea5e9' },
  { id: 'upi-verify', icon: CreditCard, label: 'UPI Verification', desc: 'Verify UPI ID', credits: 15, category: 'Financial', color: '#10b981' },
  { id: 'upi-validate', icon: CreditCard, label: 'UPI Validate', desc: 'Validate UPI payment address', credits: 15, category: 'Financial', color: '#10b981' },
  { id: 'vpa-info', icon: CreditCard, label: 'VPA Info', desc: 'Get VPA details', credits: 15, category: 'Financial', color: '#10b981' },
  { id: 'mobile-to-vpa', icon: Phone, label: 'Mobile No to VPA', desc: 'Find VPA from mobile number', credits: 20, category: 'Financial', color: '#10b981' },
  { id: 'upi-name-mobile', icon: Phone, label: 'Find UPI & Name by Mobile', desc: 'Get UPI ID and name from mobile', credits: 22, category: 'Financial', color: '#10b981' },
  { id: 'mobile-multi-upi', icon: Phone, label: 'Mobile to Multiple UPI', desc: 'Get all UPI IDs linked to mobile', credits: 25, category: 'Financial', color: '#10b981' },
  { id: 'mobile-multi-account', icon: Phone, label: 'Mobile to Multiple Account', desc: 'Get all accounts linked to mobile', credits: 25, category: 'Financial', color: '#0ea5e9' },
  { id: 'mobile-ifsc-account', icon: Phone, label: 'Mobile to IFSC & Account', desc: 'Get IFSC and account from mobile', credits: 25, category: 'Financial', color: '#0ea5e9' },

  // Utility & Bill (NEW)
  { id: 'electricity-bill', icon: Zap, label: 'Electricity Bill Fetch', desc: 'Fetch electricity bill details', credits: 15, category: 'Utility', color: '#f59e0b' },
  { id: 'gas-info', icon: Database, label: 'Gas Info Fetch', desc: 'Fetch gas connection details', credits: 15, category: 'Utility', color: '#f59e0b' },
  { id: 'gas-pipeline', icon: Database, label: 'Gas Pipeline', desc: 'Gas pipeline connection info', credits: 15, category: 'Utility', color: '#f59e0b' },
  { id: 'water-bill', icon: Database, label: 'Water Bill', desc: 'Fetch water bill details', credits: 15, category: 'Utility', color: '#0ea5e9' },
  { id: 'postpaid-bill', icon: Phone, label: 'Postpaid Bill Fetch', desc: 'Fetch postpaid mobile bill', credits: 15, category: 'Utility', color: '#8b5cf6' },
  { id: 'broadband-bill', icon: Wifi, label: 'Broadband Bill', desc: 'Fetch broadband bill details', credits: 15, category: 'Utility', color: '#0ea5e9' },
  { id: 'landline-bill', icon: Phone, label: 'Landline Bill', desc: 'Fetch landline bill details', credits: 15, category: 'Utility', color: '#8b5cf6' },
  { id: 'emi-fetch', icon: CreditCard, label: 'EMI Payment Fetch', desc: 'Fetch EMI payment details', credits: 20, category: 'Utility', color: '#ef4444' },
  { id: 'insurance-info', icon: Shield, label: 'Insurance Info Fetch', desc: 'Fetch insurance policy details', credits: 20, category: 'Utility', color: '#10b981' },

  // DigiLocker (NEW)
  { id: 'digilocker-init', icon: Database, label: 'DigiLocker Init', desc: 'Initialize DigiLocker session', credits: 20, category: 'DigiLocker', color: '#8b5cf6' },
  { id: 'digilocker-status', icon: Database, label: 'DigiLocker Status', desc: 'Check DigiLocker status', credits: 15, category: 'DigiLocker', color: '#8b5cf6' },
  { id: 'digilocker-aadhaar', icon: Shield, label: 'DigiLocker Aadhaar Details', desc: 'Get Aadhaar from DigiLocker', credits: 25, category: 'DigiLocker', color: '#8b5cf6' },
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0 }}>
        <Topbar user={{ ...user, credits: 250 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Investigation Tools
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {TOOLS.length} tools available — Deploy specialized tools for your investigations
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '8px 12px', flexShrink: 0 }}>
              <Zap size={13} color="#d97706" />
              <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>250</span>
              {!isMobile && <span style={{ color: '#92400e', fontSize: '0.78rem' }}>credits</span>}
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

          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
            Showing {filtered.length} of {TOOLS.length} tools
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="cr-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '36px', height: '36px', background: tool.color + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                  <button type="button" onClick={() => { setActiveTool(null); setResult(null) }} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" disabled={running || !toolInput.trim()} className="btn-primary" style={{ padding: '8px 20px' }}>
                    {running ? 'Running...' : 'Run Tool'}
                  </button>
                </div>
              </div>
            </form>

            {result && (
              <div style={{ marginTop: '16px', padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>✓ Query processed — {activeTool.label}</p>
                <p style={{ fontSize: '0.8rem', color: '#15803d', marginBottom: '4px' }}><strong>Query:</strong> {toolInput}</p>
                <p style={{ fontSize: '0.78rem', color: '#15803d' }}>{result.message}</p>
                <p style={{ fontSize: '0.72rem', color: '#86efac', marginTop: '6px' }}>{result.timestamp}</p>
                <div style={{ marginTop: '12px', padding: '10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #d1fae5' }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Real API results will appear here once provider keys are configured.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}