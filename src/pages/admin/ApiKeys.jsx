import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { Key, Plus, Eye, EyeOff, Copy, Trash2, X, Save, CheckCircle, AlertTriangle } from 'lucide-react'

const INITIAL_KEYS = [
  { id: 1, name: 'Production API Key', key: 'cr_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '28/6/2026', lastUsed: '2 hours ago', status: 'active', permissions: ['read', 'write'] },
  { id: 2, name: 'Development API Key', key: 'cr_dev_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '28/6/2026', lastUsed: '1 day ago', status: 'active', permissions: ['read'] },
  { id: 3, name: 'Test API Key', key: 'cr_test_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '1/7/2026', lastUsed: 'Never', status: 'inactive', permissions: ['read'] },
]

export default function AdminApiKeys() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [keys, setKeys] = useState(INITIAL_KEYS)
  const [showKeys, setShowKeys] = useState({})
  const [copied, setCopied] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', permissions: ['read'] })
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
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

  const toggleKey = (id) => setShowKeys({ ...showKeys, [id]: !showKeys[id] })
  const maskKey = (key) => key.slice(0, 12) + '••••••••••••' + key.slice(-4)

  const handleCopy = (key, id) => {
    navigator.clipboard.writeText(key)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCreate = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newKey = {
        id: Date.now(),
        name: form.name,
        key: `cr_live_sk_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
        created: new Date().toLocaleDateString(),
        lastUsed: 'Never',
        status: 'active',
        permissions: form.permissions,
      }
      setKeys([newKey, ...keys])
      setForm({ name: '', permissions: ['read'] })
      setShowModal(false)
      setSaving(false)
    }, 700)
  }

  const handleDelete = (id) => { setKeys(keys.filter(k => k.id !== id)); setDeleteConfirm(null) }
  const toggleStatus = (id) => setKeys(keys.map(k => k.id === id ? { ...k, status: k.status === 'active' ? 'inactive' : 'active' } : k))

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
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>API Keys</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage API access keys for integrations</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> {!isMobile && 'Create Key'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Keys', value: keys.length, grad: ['#2563eb', '#0ea5e9'] },
              { label: 'Active', value: keys.filter(k => k.status === 'active').length, grad: ['#10b981', '#06b6d4'] },
              { label: 'Inactive', value: keys.filter(k => k.status === 'inactive').length, grad: ['#64748b', '#94a3b8'] },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(254,243,199,0.6)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(6px)' }}>
            <AlertTriangle size={16} color="#d97706" />
            <p style={{ fontSize: '0.82rem', color: '#92400e' }}>Keep your API keys secret. Do not share them in public repositories or client-side code.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {keys.map((k) => (
              <div key={k.id} className="cr-card" style={{ padding: isMobile ? '14px' : '20px', opacity: k.status === 'inactive' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(59,130,246,0.2)' }}>
                      <Key size={18} color="#1d4ed8" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{k.name}</p>
                      <p style={{ fontSize: '0.72rem', color: '#93c5fd' }}>Created {k.created} · Last used {k.lastUsed}</p>
                    </div>
                  </div>
                  <span style={{ background: k.status === 'active' ? '#dbeafe' : '#f1f5f9', color: k.status === 'active' ? '#1d4ed8' : '#64748b', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>
                    {k.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(219,234,254,0.3)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {showKeys[k.id] ? k.key : maskKey(k.key)}
                  </span>
                  <button onClick={() => toggleKey(k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', flexShrink: 0 }}>
                    {showKeys[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => handleCopy(k.key, k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === k.id ? '#059669' : '#93c5fd', flexShrink: 0 }}>
                    {copied === k.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {k.permissions.map(p => (
                      <span key={p} style={{ background: 'rgba(219,234,254,0.6)', color: '#1d4ed8', fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>{p}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => toggleStatus(k.id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', backdropFilter: 'blur(6px)' }}>
                      {k.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => setDeleteConfirm(k.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div style={modalStyle}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '420px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>Create API Key</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Production API Key" className="cr-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Permissions</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['read', 'write'].map(perm => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem', color: '#1e3a8a', fontWeight: 500 }}>
                      <input type="checkbox" checked={form.permissions.includes(perm)} onChange={e => {
                        if (e.target.checked) setForm({ ...form, permissions: [...form.permissions, perm] })
                        else setForm({ ...form, permissions: form.permissions.filter(p => p !== perm) })
                      }} />
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(254,243,199,0.6)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.78rem', color: '#92400e' }}>
                ⚠ The key will only be shown once after creation. Copy it immediately.
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 18px' }}>
                  <Save size={14} /> {saving ? 'Creating...' : 'Create Key'}
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
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px' }}>Delete API Key?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '18px' }}>Any integrations using this key will stop working.</p>
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