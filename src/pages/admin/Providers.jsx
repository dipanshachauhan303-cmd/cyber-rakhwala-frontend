import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import {
  Database, Plus, Edit2, Trash2, X, Save,
  AlertTriangle, RefreshCw, Eye, EyeOff
} from 'lucide-react'

const INITIAL_PROVIDERS = [
  { id: 1, name: 'Phone Intelligence API', endpoint: 'https://api.phoneintel.in/v2', key: 'pk_live_xxxxxxxxxxxx', status: 'active', tools: ['Phone Lookup', 'WhatsApp Trace'], latency: '240ms', uptime: '99.2%' },
  { id: 2, name: 'RTO Vehicle Database', endpoint: 'https://api.vahan.in/v1', key: 'vhn_xxxxxxxxxxxx', status: 'active', tools: ['Vehicle Info'], latency: '180ms', uptime: '98.7%' },
  { id: 3, name: 'UIDAI Aadhaar API', endpoint: 'https://api.uidai.gov.in/v1', key: 'uid_xxxxxxxxxxxx', status: 'inactive', tools: ['Aadhaar Info'], latency: 'N/A', uptime: 'N/A' },
  { id: 4, name: 'NPCI UPI Gateway', endpoint: 'https://api.npci.org.in/v2', key: 'npci_xxxxxxxxxxxx', status: 'active', tools: ['UPI Lookup'], latency: '320ms', uptime: '97.5%' },
  { id: 5, name: 'Telecom CDR Provider', endpoint: 'https://api.cdranal.com/v1', key: 'cdr_xxxxxxxxxxxx', status: 'error', tools: ['CDR Analysis', 'IPDR Analysis'], latency: 'Timeout', uptime: '89.1%' },
  { id: 6, name: 'Face Recognition Engine', endpoint: 'https://api.faceai.in/v3', key: 'fr_xxxxxxxxxxxx', status: 'active', tools: ['Face Recognition'], latency: '890ms', uptime: '95.3%' },
]

const STATUS_COLORS = {
  active: { bg: '#dbeafe', color: '#1d4ed8', label: 'Active' },
  inactive: { bg: '#f1f5f9', color: '#64748b', label: 'Inactive' },
  error: { bg: '#fee2e2', color: '#dc2626', label: 'Error' },
}

const EMPTY_FORM = { name: '', endpoint: '', key: '', status: 'active', tools: '' }

export default function AdminProviders() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [providers, setProviders] = useState(INITIAL_PROVIDERS)
  const [showModal, setShowModal] = useState(false)
  const [editProvider, setEditProvider] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showKeys, setShowKeys] = useState({})
  const [testing, setTesting] = useState(null)
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

  const openCreate = () => { setEditProvider(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (p) => { setEditProvider(p); setForm({ ...p, tools: p.tools.join(', ') }); setShowModal(true) }

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const data = { ...form, tools: form.tools.split(',').map(t => t.trim()).filter(Boolean), latency: 'N/A', uptime: 'N/A' }
      if (editProvider) {
        setProviders(providers.map(p => p.id === editProvider.id ? { ...p, ...data } : p))
      } else {
        setProviders([...providers, { id: Date.now(), ...data }])
      }
      setShowModal(false)
      setSaving(false)
    }, 700)
  }

  const handleTest = (id) => { setTesting(id); setTimeout(() => setTesting(null), 1500) }
  const handleDelete = (id) => { setProviders(providers.filter(p => p.id !== id)); setDeleteConfirm(null) }
  const toggleKey = (id) => setShowKeys({ ...showKeys, [id]: !showKeys[id] })
  const maskKey = (key) => key.slice(0, 8) + '••••••••' + key.slice(-4)

  const modalStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(30,58,138,0.3)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 50, padding: '16px'
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(59,130,246,0.2)',
    boxShadow: '0 20px 60px rgba(37,99,235,0.2)',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="circuit" />
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Providers</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>External API connectors and data sources</p>
            </div>
            <button onClick={openCreate} className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> {!isMobile && 'Add Provider'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total', value: providers.length, grad: ['#2563eb', '#0ea5e9'] },
              { label: 'Active', value: providers.filter(p => p.status === 'active').length, grad: ['#10b981', '#06b6d4'] },
              { label: 'Errors', value: providers.filter(p => p.status === 'error').length, grad: ['#ef4444', '#dc2626'] },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {providers.map((p) => {
              const sc = STATUS_COLORS[p.status]
              return (
                <div key={p.id} className="cr-card" style={{ padding: isMobile ? '14px' : '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <div style={{ width: '32px', height: '32px', background: 'rgba(219,234,254,0.6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Database size={16} color="#2563eb" />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{p.name}</p>
                          {!isMobile && <p style={{ fontSize: '0.72rem', color: '#93c5fd', fontFamily: 'monospace' }}>{p.endpoint}</p>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(219,234,254,0.3)', borderRadius: '6px', padding: '6px 10px', marginBottom: '8px', maxWidth: '340px', border: '1px solid rgba(59,130,246,0.1)' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {showKeys[p.id] ? p.key : maskKey(p.key)}
                        </span>
                        <button onClick={() => toggleKey(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', flexShrink: 0 }}>
                          {showKeys[p.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {p.tools.map(t => (
                          <span key={t} style={{ background: 'rgba(219,234,254,0.6)', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', borderRadius: '4px' }}>{t}</span>
                        ))}
                        {!isMobile && (
                          <>
                            <span style={{ fontSize: '0.72rem', color: '#93c5fd' }}>Latency: {p.latency}</span>
                            <span style={{ fontSize: '0.72rem', color: '#93c5fd' }}>Uptime: {p.uptime}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{sc.label}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleTest(p.id)} style={{ background: 'rgba(219,234,254,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#2563eb', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <RefreshCw size={11} /> {testing === p.id ? '...' : 'Test'}
                        </button>
                        <button onClick={() => openEdit(p)} style={{ background: 'rgba(219,234,254,0.8)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#1d4ed8', display: 'flex' }}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#dc2626', display: 'flex' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {showModal && (
        <div style={modalStyle}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '460px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>{editProvider ? 'Edit Provider' : 'Add Provider'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'name', label: 'Provider Name', placeholder: 'e.g. Phone Intelligence API' },
                { key: 'endpoint', label: 'API Endpoint', placeholder: 'https://api.example.com/v1' },
                { key: 'key', label: 'API Key', placeholder: 'pk_live_xxxxxxxxxxxx' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{field.label} *</label>
                  <input type="text" required value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} className="cr-input" />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="cr-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Supported Tools (comma separated)</label>
                <input type="text" value={form.tools} onChange={e => setForm({ ...form, tools: e.target.value })} placeholder="Phone Lookup, WhatsApp Trace" className="cr-input" />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 18px' }}>
                  <Save size={14} /> {saving ? 'Saving...' : editProvider ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={modalStyle}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '340px', padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={22} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px' }}>Delete Provider?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '18px' }}>All tools using this provider will stop working.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}