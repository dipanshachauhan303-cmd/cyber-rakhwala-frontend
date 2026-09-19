import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Users, Plus, Search, Edit2, Trash2,
  Ban, CheckCircle, X, Save, Eye, AlertTriangle, Zap
} from 'lucide-react'

const INITIAL_USERS = [
  { id: 1, name: 'Law Enforcement Demo', email: 'law@demo.com', role: 'law-enforcement', status: 'active', credits: 250, joined: '28/6/2026', lastSeen: '2 hours ago' },
  { id: 2, name: 'Student Demo', email: 'student@demo.com', role: 'student', status: 'active', credits: 100, joined: '28/6/2026', lastSeen: '5 hours ago' },
  { id: 3, name: 'Admin User', email: 'admin@demo.com', role: 'admin', status: 'active', credits: 999, joined: '28/6/2026', lastSeen: 'Just now' },
  { id: 4, name: 'Content Manager', email: 'content@demo.com', role: 'staff', status: 'active', credits: 500, joined: '28/6/2026', lastSeen: '1 day ago' },
  { id: 5, name: 'Provider Manager', email: 'provider@demo.com', role: 'staff', status: 'inactive', credits: 500, joined: '28/6/2026', lastSeen: '3 days ago' },
]

const ROLES = ['admin', 'law-enforcement', 'student', 'staff']

const ROLE_COLORS = {
  admin: { bg: '#fee2e2', color: '#dc2626' },
  'law-enforcement': { bg: '#e0f2fe', color: '#0284c7' },
  student: { bg: '#ede9fe', color: '#7c3aed' },
  staff: { bg: '#d1fae5', color: '#059669' },
}

const STATUS_COLORS = {
  active: { bg: '#d1fae5', color: '#059669', label: 'Active' },
  inactive: { bg: '#f1f5f9', color: '#64748b', label: 'Inactive' },
  banned: { bg: '#fee2e2', color: '#dc2626', label: 'Banned' },
}

const EMPTY_FORM = { name: '', email: '', role: 'law-enforcement', status: 'active', credits: 250, password: '' }

export default function AdminUsers() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
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

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  const openCreate = () => { setEditUser(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (u) => { setEditUser(u); setForm({ ...u, password: '' }); setShowModal(true) }

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      if (editUser) {
        setUsers(users.map(u => u.id === editUser.id ? { ...u, ...form } : u))
      } else {
        setUsers([{ id: Date.now(), ...form, joined: new Date().toLocaleDateString(), lastSeen: 'Just now' }, ...users])
      }
      setShowModal(false)
      setSaving(false)
    }, 700)
  }

  const handleBan = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u))
  }

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id))
    setDeleteConfirm(null)
  }

  const handleCredits = (id, delta) => {
    setUsers(users.map(u => u.id === id ? { ...u, credits: Math.max(0, u.credits + delta) } : u))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0' }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Users</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage platform access and roles</p>
            </div>
            <button onClick={openCreate} className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> {!isMobile && 'Add User'}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total', value: users.length, color: '#0ea5e9' },
              { label: 'Active', value: users.filter(u => u.status === 'active').length, color: '#10b981' },
              { label: 'Banned', value: users.filter(u => u.status === 'banned').length, color: '#ef4444' },
              { label: 'Law', value: users.filter(u => u.role === 'law-enforcement').length, color: '#0284c7' },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="cr-input" style={{ paddingLeft: '32px' }} />
            </div>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="cr-input" style={{ width: 'auto', padding: '8px 12px' }}>
              <option value="all">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Users table - desktop */}
          {!isMobile && (
            <div className="cr-card" style={{ overflow: 'hidden' }}>
              <table className="cr-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Credits</th>
                    <th>Last Seen</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const rc = ROLE_COLORS[u.role] || ROLE_COLORS.staff
                    const sc = STATUS_COLORS[u.status]
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', background: rc.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: rc.color }}>{u.name[0]}</span>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{u.name}</p>
                              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ background: rc.bg, color: rc.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {u.role === 'law-enforcement' ? 'Law' : u.role}
                          </span>
                        </td>
                        <td>
                          <span style={{ background: sc.bg, color: sc.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{sc.label}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <button onClick={() => handleCredits(u.id, -50)} style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer', color: '#dc2626', fontWeight: 700 }}>-</button>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: '#d97706', minWidth: '36px', textAlign: 'center' }}>{u.credits}</span>
                            <button onClick={() => handleCredits(u.id, 50)} style={{ background: '#d1fae5', border: 'none', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer', color: '#059669', fontWeight: 700 }}>+</button>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.lastSeen}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => setViewUser(u)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                              <Eye size={13} />
                            </button>
                            <button onClick={() => openEdit(u)} style={{ background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#0284c7', display: 'flex' }}>
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => handleBan(u.id)} style={{ background: u.status === 'banned' ? '#d1fae5' : '#fef3c7', border: `1px solid ${u.status === 'banned' ? '#a7f3d0' : '#fde68a'}`, borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: u.status === 'banned' ? '#059669' : '#d97706', display: 'flex' }}>
                              {u.status === 'banned' ? <CheckCircle size={13} /> : <Ban size={13} />}
                            </button>
                            <button onClick={() => setDeleteConfirm(u.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#dc2626', display: 'flex' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Users cards - mobile */}
          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((u) => {
                const rc = ROLE_COLORS[u.role] || ROLE_COLORS.staff
                const sc = STATUS_COLORS[u.status]
                return (
                  <div key={u.id} className="cr-card" style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', background: rc.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: rc.color }}>{u.name[0]}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{u.name}</p>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{u.email}</p>
                        </div>
                      </div>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{sc.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ background: rc.bg, color: rc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>
                          {u.role === 'law-enforcement' ? 'Law' : u.role}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', color: '#d97706', fontWeight: 600 }}>
                          <Zap size={11} color="#d97706" />{u.credits}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => setViewUser(u)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                          <Eye size={13} />
                        </button>
                        <button onClick={() => openEdit(u)} style={{ background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#0284c7', display: 'flex' }}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleBan(u.id)} style={{ background: u.status === 'banned' ? '#d1fae5' : '#fef3c7', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: u.status === 'banned' ? '#059669' : '#d97706', display: 'flex' }}>
                          {u.status === 'banned' ? <CheckCircle size={13} /> : <Ban size={13} />}
                        </button>
                        <button onClick={() => setDeleteConfirm(u.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#dc2626', display: 'flex' }}>
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '460px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{editUser ? 'Edit User' : 'Create User'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Full Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" className="cr-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" className="cr-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Password {editUser ? '(leave blank to keep)' : '*'}</label>
                <input type="password" required={!editUser} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="cr-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="cr-input">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="cr-input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Credits</label>
                <input type="number" min="0" value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} className="cr-input" />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 18px' }}>
                  <Save size={14} /> {saving ? 'Saving...' : editUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>User Details</h3>
              <button onClick={() => setViewUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { label: 'Name', value: viewUser.name },
                { label: 'Email', value: viewUser.email },
                { label: 'Role', value: viewUser.role },
                { label: 'Status', value: STATUS_COLORS[viewUser.status]?.label },
                { label: 'Credits', value: viewUser.credits },
                { label: 'Joined', value: viewUser.joined },
              ].map((row) => (
                <div key={row.label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
                  <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>{row.label}</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize', wordBreak: 'break-all' }}>{row.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setViewUser(null); openEdit(viewUser) }} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => setViewUser(null)} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '340px', padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={22} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Delete User?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '18px' }}>This cannot be undone.</p>
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