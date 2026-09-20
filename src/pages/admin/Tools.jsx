import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { Search, Edit2, Save, X, Zap, ToggleLeft, ToggleRight } from 'lucide-react'

const INITIAL_TOOLS = [
  { id: 1, name: 'Phone Lookup', code: 'phone-intel', category: 'OSINT', credits: 14, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 2, name: 'Face Recognition', code: 'face-scan', category: 'Biometric', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 3, name: 'CDR Analysis', code: 'cdr-analyze', category: 'Telecom', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 4, name: 'Vehicle Info', code: 'vehicle-lookup', category: 'Records', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 5, name: 'UPI Lookup', code: 'upi-trace', category: 'Financial', credits: 18, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 6, name: 'Aadhaar Info', code: 'aadhaar-lookup', category: 'Identity', credits: 30, visible: true, roles: ['law-enforcement'] },
  { id: 7, name: 'PAN Lookup', code: 'pan-trace', category: 'Financial', credits: 18, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 8, name: 'IPDR Analysis', code: 'ipdr-analyze', category: 'Telecom', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 9, name: 'Person Location', code: 'person-lookup', category: 'Records', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 10, name: 'Breach Database', code: 'breach-db', category: 'Network', credits: 30, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 11, name: 'IP Intelligence', code: 'trace-ip', category: 'Network', credits: 10, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 12, name: 'Domain Analysis', code: 'dnslookup', category: 'OSINT', credits: 8, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 13, name: 'Email Forensics', code: 'email-trace', category: 'Forensics', credits: 12, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 14, name: 'Social Profiler', code: 'social-scan', category: 'OSINT', credits: 16, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 15, name: 'Hash Analyzer', code: 'hash-check', category: 'Forensics', credits: 6, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 16, name: 'Image EXIF', code: 'img-data', category: 'Forensics', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 17, name: 'URL Scanner', code: 'url-scan', category: 'Network', credits: 10, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 18, name: 'Geolocation', code: 'geo-lookup', category: 'Geospatial', credits: 12, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 19, name: 'DNS Records', code: 'dns-enum', category: 'Network', credits: 8, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 20, name: 'Data Mining', code: 'datamine', category: 'OSINT', credits: 18, visible: false, roles: ['law-enforcement'] },
  { id: 21, name: 'WhatsApp Trace', code: 'wa-trace', category: 'Communication', credits: 20, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 22, name: 'SDR', code: 'sdr', category: 'Telecom', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 23, name: 'Vehicle Search', code: 'vehicle-search', category: 'Records', credits: 18, visible: true, roles: ['law-enforcement'] },
  { id: 24, name: 'CSR Analysis', code: 'csr-analysis', category: 'Telecom', credits: 22, visible: true, roles: ['law-enforcement'] },
  { id: 25, name: 'Tower Dump Analysis', code: 'tower-dump', category: 'Telecom', credits: 35, visible: true, roles: ['law-enforcement'] },
  { id: 26, name: 'Cell ID Location', code: 'cell-id', category: 'Geospatial', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 27, name: 'IP Tracker', code: 'ip-tracker', category: 'Network', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 28, name: 'Number to UPI', code: 'num-upi', category: 'Financial', credits: 20, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 29, name: 'Number to Image', code: 'num-image', category: 'OSINT', credits: 25, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 30, name: 'OSINT Tools', code: 'osint-tools', category: 'OSINT', credits: 30, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 31, name: 'Aadhaar Send OTP', code: 'aadhaar-otp', category: 'Identity', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 32, name: 'Aadhaar Submit OTP', code: 'aadhaar-submit-otp', category: 'Identity', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 33, name: 'PAN Verification', code: 'pan-verify', category: 'Identity', credits: 18, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 34, name: 'PAN Details', code: 'pan-details', category: 'Identity', credits: 20, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 35, name: 'Aadhaar OCR', code: 'aadhaar-ocr', category: 'Identity', credits: 22, visible: true, roles: ['law-enforcement'] },
  { id: 36, name: 'PAN OCR', code: 'pan-ocr', category: 'Identity', credits: 22, visible: true, roles: ['law-enforcement'] },
  { id: 37, name: 'Aadhaar–PAN Link Check', code: 'aadhaar-pan-link', category: 'Identity', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 38, name: 'Voter ID Verification', code: 'voter-id', category: 'Identity', credits: 18, visible: true, roles: ['law-enforcement'] },
  { id: 39, name: 'Passport Verification', code: 'passport-verify', category: 'Identity', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 40, name: 'Driving License Verification', code: 'dl-verify', category: 'Records', credits: 18, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 41, name: 'GST Verification', code: 'gst-verify', category: 'Business', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 42, name: 'GST Return Status', code: 'gst-return', category: 'Business', credits: 18, visible: true, roles: ['law-enforcement'] },
  { id: 43, name: 'GST Advance Details', code: 'gst-advance', category: 'Business', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 44, name: 'PAN No by GST No', code: 'pan-by-gst', category: 'Business', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 45, name: 'MCA Company Search', code: 'mca-company', category: 'Business', credits: 20, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 46, name: 'MCA CIN Search', code: 'mca-cin', category: 'Business', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 47, name: 'Name to CIN List', code: 'name-to-cin', category: 'Business', credits: 18, visible: true, roles: ['law-enforcement'] },
  { id: 48, name: 'DIN Details', code: 'din-details', category: 'Business', credits: 18, visible: true, roles: ['law-enforcement'] },
  { id: 49, name: 'RC Verification', code: 'rc-verify', category: 'Records', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 50, name: 'RC Details', code: 'rc-details', category: 'Records', credits: 18, visible: true, roles: ['law-enforcement'] },
  { id: 51, name: 'RC Lite', code: 'rc-lite', category: 'Records', credits: 12, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 52, name: 'RC Owner History', code: 'rc-owner-history', category: 'Records', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 53, name: 'RC Number to Mobile', code: 'rc-to-mobile', category: 'Records', credits: 30, visible: true, roles: ['law-enforcement'] },
  { id: 54, name: 'Vehicle Challan', code: 'vehicle-challan', category: 'Records', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 55, name: 'FasTag Info Fetch', code: 'fastag-info', category: 'Records', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 56, name: 'Bank Verification', code: 'bank-verify', category: 'Financial', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 57, name: 'Bank Details by IFSC', code: 'ifsc-details', category: 'Financial', credits: 10, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 58, name: 'UPI Verification', code: 'upi-verify', category: 'Financial', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 59, name: 'UPI Validate', code: 'upi-validate', category: 'Financial', credits: 15, visible: true, roles: ['law-enforcement', 'student'] },
  { id: 60, name: 'VPA Info', code: 'vpa-info', category: 'Financial', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 61, name: 'Mobile No to VPA', code: 'mobile-to-vpa', category: 'Financial', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 62, name: 'Find UPI & Name by Mobile', code: 'upi-name-mobile', category: 'Financial', credits: 22, visible: true, roles: ['law-enforcement'] },
  { id: 63, name: 'Mobile to Multiple UPI', code: 'mobile-multi-upi', category: 'Financial', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 64, name: 'Mobile to Multiple Account', code: 'mobile-multi-account', category: 'Financial', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 65, name: 'Mobile to IFSC & Account', code: 'mobile-ifsc-account', category: 'Financial', credits: 25, visible: true, roles: ['law-enforcement'] },
  { id: 66, name: 'Electricity Bill Fetch', code: 'electricity-bill', category: 'Utility', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 67, name: 'Gas Info Fetch', code: 'gas-info', category: 'Utility', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 68, name: 'Gas Pipeline', code: 'gas-pipeline', category: 'Utility', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 69, name: 'Water Bill', code: 'water-bill', category: 'Utility', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 70, name: 'Postpaid Bill Fetch', code: 'postpaid-bill', category: 'Utility', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 71, name: 'Broadband Bill', code: 'broadband-bill', category: 'Utility', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 72, name: 'Landline Bill', code: 'landline-bill', category: 'Utility', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 73, name: 'EMI Payment Fetch', code: 'emi-fetch', category: 'Utility', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 74, name: 'Insurance Info Fetch', code: 'insurance-info', category: 'Utility', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 75, name: 'DigiLocker Init', code: 'digilocker-init', category: 'DigiLocker', credits: 20, visible: true, roles: ['law-enforcement'] },
  { id: 76, name: 'DigiLocker Status', code: 'digilocker-status', category: 'DigiLocker', credits: 15, visible: true, roles: ['law-enforcement'] },
  { id: 77, name: 'DigiLocker Aadhaar Details', code: 'digilocker-aadhaar', category: 'DigiLocker', credits: 25, visible: true, roles: ['law-enforcement'] },
]

const ROLE_COLORS = {
  'law-enforcement': { bg: '#dbeafe', color: '#1d4ed8' },
  student: { bg: '#ede9fe', color: '#7c3aed' },
  admin: { bg: '#fee2e2', color: '#dc2626' },
}

export default function AdminTools() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [tools, setTools] = useState(INITIAL_TOOLS)
  const [search, setSearch] = useState('')
  const [editTool, setEditTool] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'admin') { navigate('/login'); return }
    setUser(parsed)
    const fn = () => setIsMobile(window.innerWidth <= 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [navigate])

  const filtered = tools.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.code.toLowerCase().includes(search.toLowerCase())
  )

  const toggleVisible = (id) => setTools(tools.map(t => t.id === id ? { ...t, visible: !t.visible } : t))
  const openEdit = (tool) => { setEditTool(tool); setForm({ ...tool, roles: tool.roles.join(', ') }) }

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setTools(tools.map(t => t.id === editTool.id ? {
        ...t, name: form.name, credits: Number(form.credits),
        roles: form.roles.split(',').map(r => r.trim()).filter(Boolean),
      } : t))
      setEditTool(null)
      setSaving(false)
    }, 600)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="network" />
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Tools</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Tool visibility, credits, and role access</p>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', background: 'rgba(255,255,255,0.7)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.15)', backdropFilter: 'blur(6px)' }}>
              {tools.filter(t => t.visible).length}/{tools.length} visible
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total', value: tools.length, grad: ['#2563eb', '#0ea5e9'] },
              { label: 'Visible', value: tools.filter(t => t.visible).length, grad: ['#10b981', '#06b6d4'] },
              { label: 'Hidden', value: tools.filter(t => !t.visible).length, grad: ['#64748b', '#94a3b8'] },
              { label: 'Avg Credits', value: Math.round(tools.reduce((a, t) => a + t.credits, 0) / tools.length), grad: ['#f59e0b', '#f97316'] },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', marginBottom: '14px', maxWidth: '300px' }}>
            <Search size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..." className="cr-input" style={{ paddingLeft: '32px' }} />
          </div>

          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((tool) => (
                <div key={tool.id} className="cr-card" style={{ padding: '14px', opacity: tool.visible ? 1 : 0.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{tool.name}</p>
                      <p style={{ fontSize: '0.72rem', color: '#93c5fd', fontFamily: 'monospace' }}>{tool.code}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} color="#d97706" />
                      <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.82rem' }}>{tool.credits}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button onClick={() => toggleVisible(tool.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: tool.visible ? '#2563eb' : '#93c5fd', padding: 0 }}>
                      {tool.visible ? <ToggleRight size={20} color="#2563eb" /> : <ToggleLeft size={20} color="#93c5fd" />}
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{tool.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                    <button onClick={() => openEdit(tool)} style={{ background: 'rgba(219,234,254,0.8)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Edit2 size={12} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cr-card" style={{ overflow: 'hidden' }}>
              <table className="cr-table">
                <thead>
                  <tr>
                    <th>Tool</th><th>Category</th><th>Credits</th><th>Roles</th><th>Visibility</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tool) => (
                    <tr key={tool.id} style={{ opacity: tool.visible ? 1 : 0.5 }}>
                      <td>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>{tool.name}</p>
                        <p style={{ fontSize: '0.72rem', color: '#93c5fd', fontFamily: 'monospace' }}>{tool.code}</p>
                      </td>
                      <td>
                        <span style={{ background: 'rgba(219,234,254,0.6)', color: '#1d4ed8', fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{tool.category}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Zap size={11} color="#d97706" />
                          <span style={{ fontWeight: 700, color: '#d97706', fontFamily: 'monospace' }}>{tool.credits}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {tool.roles.map(r => {
                            const rc = ROLE_COLORS[r] || { bg: '#f1f5f9', color: '#64748b' }
                            return (
                              <span key={r} style={{ background: rc.bg, color: rc.color, fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                                {r === 'law-enforcement' ? 'Law' : r}
                              </span>
                            )
                          })}
                        </div>
                      </td>
                      <td>
                        <button onClick={() => toggleVisible(tool.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: tool.visible ? '#2563eb' : '#93c5fd', padding: 0 }}>
                          {tool.visible ? <ToggleRight size={22} color="#2563eb" /> : <ToggleLeft size={22} color="#93c5fd" />}
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{tool.visible ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => openEdit(tool)} style={{ background: 'rgba(219,234,254,0.8)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {editTool && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,58,138,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(37,99,235,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>Edit Tool</h3>
              <button onClick={() => setEditTool(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tool Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="cr-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credits Cost</label>
                <input type="number" min="1" required value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} className="cr-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Allowed Roles (comma separated)</label>
                <input type="text" value={form.roles} onChange={e => setForm({ ...form, roles: e.target.value })} placeholder="law-enforcement, student" className="cr-input" />
                <p style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '4px' }}>Options: law-enforcement, student, admin</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditTool(null)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 18px' }}>
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}