import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  FolderOpen, Plus, Search, Filter, Calendar,
  AlertTriangle, CheckCircle, Clock, X, Save,
  ChevronRight, Trash2, Eye
} from 'lucide-react'

const INITIAL_CASES = [
  {
    id: 'CR-2024-001',
    title: 'Cyber Fraud Investigation',
    description: 'Multiple victims reported financial fraud via fake banking app.',
    status: 'active',
    priority: 'high',
    assignee: 'Officer Demo',
    created: '2024-07-01',
    updated: '2 hours ago',
    tags: ['fraud', 'banking', 'cyber'],
  },
  {
    id: 'CR-2024-002',
    title: 'Identity Theft Case',
    description: 'Aadhaar and PAN misuse reported by victim in Pune.',
    status: 'pending',
    priority: 'medium',
    assignee: 'Officer Demo',
    created: '2024-07-02',
    updated: '1 day ago',
    tags: ['identity', 'aadhaar'],
  },
  {
    id: 'CR-2024-003',
    title: 'Financial Scam Analysis',
    description: 'UPI-based scam targeting elderly citizens.',
    status: 'closed',
    priority: 'low',
    assignee: 'Officer Demo',
    created: '2024-06-28',
    updated: '3 days ago',
    tags: ['upi', 'scam', 'financial'],
  },
]

const STATUS = {
  active: { bg: '#d1fae5', color: '#059669', label: 'Active', icon: CheckCircle },
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending', icon: Clock },
  closed: { bg: '#f1f5f9', color: '#64748b', label: 'Closed', icon: FolderOpen },
}

const PRIORITY = {
  high: { bg: '#fee2e2', color: '#dc2626' },
  medium: { bg: '#fef3c7', color: '#d97706' },
  low: { bg: '#f1f5f9', color: '#64748b' },
}

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'active',
  priority: 'medium',
  tags: '',
}

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

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    setUser(JSON.parse(stored))
  }, [navigate])

  const filtered = cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleCreate = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newCase = {
        id: `CR-2024-00${cases.length + 1}`,
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
    if (viewCase?.id === id) setViewCase(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="law-enforcement" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar user={{ ...user, credits: 250 }} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Active Cases</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track and manage your investigations</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
              style={{ padding: '10px 20px' }}
            >
              <Plus size={16} /> New Case
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Cases', value: cases.length, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Active', value: cases.filter(c => c.status === 'active').length, color: '#10b981', bg: '#d1fae5' },
              { label: 'Pending', value: cases.filter(c => c.status === 'pending').length, color: '#d97706', bg: '#fef3c7' },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '18px' }}>
                <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search cases..."
                className="cr-input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'active', 'pending', 'closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: filterStatus === s ? '#0ea5e9' : '#e2e8f0',
                    background: filterStatus === s ? '#e0f2fe' : '#ffffff',
                    color: filterStatus === s ? '#0284c7' : '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Cases list */}
          {filtered.length === 0 ? (
            <div className="cr-card" style={{ padding: '60px', textAlign: 'center' }}>
              <FolderOpen size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No cases found</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
                style={{ marginTop: '16px', padding: '10px 20px' }}
              >
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
                  <div
                    key={c.id}
                    className="cr-card"
                    style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '16px' }}
                  >
                    <div style={{ width: '40px', height: '40px', background: s.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SIcon size={18} color={s.color} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{c.title}</p>
                        <span style={{ background: p.bg, color: p.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize', flexShrink: 0 }}>
                          {c.priority}
                        </span>
                        <span style={{ background: s.bg, color: s.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>
                          {s.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>{c.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{c.id}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Updated {c.updated}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {c.tags.map(tag => (
                            <span key={tag} style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button
                        onClick={() => setViewCase(c)}
                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Create Case Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '520px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Create New Case</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Case Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter case title"
                  className="cr-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the case"
                  className="cr-input"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="cr-input"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="cr-input"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="fraud, cyber, identity"
                  className="cr-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 20px' }}>
                  <Save size={15} /> {saving ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Case Modal */}
      {viewCase && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '520px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' }}>{viewCase.id}</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{viewCase.title}</h3>
              </div>
              <button onClick={() => setViewCase(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{viewCase.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Status', value: STATUS[viewCase.status].label },
                  { label: 'Priority', value: viewCase.priority },
                  { label: 'Assignee', value: viewCase.assignee },
                  { label: 'Created', value: viewCase.created },
                ].map((row) => (
                  <div key={row.label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{row.label}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{row.value}</p>
                  </div>
                ))}
              </div>

              {viewCase.tags.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Tags</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {viewCase.tags.map(tag => (
                      <span key={tag} style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.78rem', padding: '4px 10px', borderRadius: '6px', fontWeight: 500 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewCase(null)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}