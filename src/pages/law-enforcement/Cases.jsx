import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import {
  FolderOpen, Plus, Search, CheckCircle,
  Clock, X, Save, Eye, Trash2, AlertTriangle
} from 'lucide-react'

const INITIAL_CASES = [
  { id: 1, caseId: 'CR-2024-001', title: 'Cyber Fraud Investigation', description: 'Multiple victims reported financial fraud via fake banking app.', status: 'active', priority: 'high', assignee: 'Officer Demo', created: '2024-07-01', updated: '2 hours ago', tags: ['fraud', 'banking'] },
  { id: 2, caseId: 'CR-2024-002', title: 'Identity Theft Case', description: 'Aadhaar and PAN misuse reported by victim in Pune.', status: 'pending', priority: 'medium', assignee: 'Officer Demo', created: '2024-07-02', updated: '1 day ago', tags: ['identity', 'aadhaar'] },
  { id: 3, caseId: 'CR-2024-003', title: 'Financial Scam Analysis', description: 'UPI-based scam targeting elderly citizens.', status: 'closed', priority: 'low', assignee: 'Officer Demo', created: '2024-06-28', updated: '3 days ago', tags: ['upi', 'scam'] },
]

const STATUS = {
  active: { bg: '#dbeafe', color: '#1d4ed8', label: 'Active', icon: CheckCircle },
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending', icon: Clock },
  closed: { bg: '#f1f5f9', color: '#64748b', label: 'Closed', icon: FolderOpen },
}

const PRIORITY = {
  high: { bg: '#fee2e2', color: '#dc2626' },
  medium: { bg: '#fef3c7', color: '#d97706' },
  low: { bg: '#f1f5f9', color: '#64748b' },
}

const EMPTY_FORM = { title: '', description: '', status: 'active', priority: 'medium', tags: '' }

export default function LECases() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [cases, setCases] = useState(INITIAL_CASES)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [viewCase, setViewCase] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
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

  const filtered = cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.caseId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleCreate = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newCase = {
        id: Date.now(),
        caseId: `CR-2024-00${cases.length + 1}`,
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        assignee: user.name || 'Officer',
        created: new Date().toISOString().split('T')[0],
        updated: 'Just now',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      setCases([newCase, ...cases])
      setForm(EMPTY_FORM)
      setShowModal(false)
      setSaving(false)
    }, 800)
  }

  const handleDelete = (id) => {
    setCases(cases.filter(c => c.id !== id))
    setDeleteConfirm(null)
    if (viewCase?.id === id) setViewCase(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="circuit" />
      <Sidebar role="law-enforcement" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={{ ...user, credits: 250 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Active Cases</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Track and manage your investigations</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> {!isMobile && 'New Case'}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total', value: cases.length, grad: ['#2563eb', '#0ea5e9'] },
              { label: 'Active', value: cases.filter(c => c.status === 'active').length, grad: ['#10b981', '#06b6d4'] },
              { label: 'Pending', value: cases.filter(c => c.status === 'pending').length, grad: ['#f59e0b', '#f97316'] },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
              <Search size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases..." className="cr-input" style={{ paddingLeft: '32px' }} />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['all', 'active', 'pending', 'closed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: '8px 10px', borderRadius: '6px', border: '1px solid',
                  borderColor: filterStatus === s ? '#2563eb' : 'rgba(59,130,246,0.15)',
                  background: filterStatus === s ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.7)',
                  color: filterStatus === s ? '#ffffff' : '#64748b',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  backdropFilter: 'blur(6px)',
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Cases */}
          {filtered.length === 0 ? (
            <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
              <FolderOpen size={36} color="#93c5fd" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#64748b' }}>No cases found</p>
              <button onClick={() => setShowModal(true)} className="btn-primary" style={{ marginTop: '14px', padding: '10px 20px' }}>
                <Plus size={15} /> Create First Case
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((c) => {
                const s = STATUS[c.status]
                const p = PRIORITY[c.priority]
                const SIcon = s.icon
                return (
                  <div key={c.id} className="cr-card" style={{ padding: isMobile ? '14px' : '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', background: `linear-gradient(135deg, ${s.color}20, ${s.color}30)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${s.color}25` }}>
                        <SIcon size={16} color={s.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{c.title}</p>
                          <span style={{ background: p.bg, color: p.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', textTransform: 'capitalize' }}>{c.priority}</span>
                          <span style={{ background: s.bg, color: s.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{s.label}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>{c.description}</p>
                        <p style={{ fontSize: '0.72rem', color: '#93c5fd', fontFamily: 'monospace' }}>{c.caseId} · {c.updated}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                        <button onClick={() => setViewCase(c)} style={{ background: 'rgba(219,234,254,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                          <Eye size={13} />
                        </button>
                        <button onClick={() => setDeleteConfirm(c.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,58,138,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(37,99,235,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>Create New Case</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Case Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter case title" className="cr-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" className="cr-input" rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="cr-input">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="cr-input">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="fraud, cyber, identity" className="cr-input" />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 18px' }}>
                  <Save size={14} /> {saving ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewCase && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,58,138,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(37,99,235,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#93c5fd', fontFamily: 'monospace', marginBottom: '3px' }}>{viewCase.caseId}</p>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>{viewCase.title}</h3>
              </div>
              <button onClick={() => setViewCase(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px', lineHeight: 1.6 }}>{viewCase.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { label: 'Status', value: STATUS[viewCase.status].label },
                { label: 'Priority', value: viewCase.priority },
                { label: 'Assignee', value: viewCase.assignee },
                { label: 'Created', value: viewCase.created },
              ].map((row) => (
                <div key={row.label} style={{ background: 'rgba(219,234,254,0.3)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <p style={{ fontSize: '0.68rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>{row.label}</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e3a8a', textTransform: 'capitalize' }}>{row.value}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setViewCase(null)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,58,138,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', width: '100%', maxWidth: '360px', padding: '24px', textAlign: 'center', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(37,99,235,0.2)' }}>
            <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={22} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px' }}>Delete Case?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '18px' }}>This action cannot be undone.</p>
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