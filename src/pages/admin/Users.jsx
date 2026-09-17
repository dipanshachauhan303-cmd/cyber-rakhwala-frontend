import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Users, Plus, Search, Filter, Shield,
  Edit2, Trash2, Ban, CheckCircle, X,
  Save, Eye, EyeOff, ChevronDown, Mail,
  Calendar, Zap, AlertTriangle
} from 'lucide-react'

const INITIAL_USERS = [
  { id: 1, name: 'Law Enforcement Demo', email: 'law-enforcement@cyberrakhwala.com', role: 'law-enforcement', status: 'active', credits: 250, joined: '28/6/2026', lastSeen: '2 hours ago' },
  { id: 2, name: 'Student Demo', email: 'student@cyberrakhwala.com', role: 'student', status: 'active', credits: 100, joined: '28/6/2026', lastSeen: '5 hours ago' },
  { id: 3, name: 'Admin User', email: 'admin@cyberrakhwala.com', role: 'admin', status: 'active', credits: 999, joined: '28/6/2026', lastSeen: 'Just now' },
  { id: 4, name: 'Content Manager', email: 'content@cyberrakhwala.com', role: 'staff', status: 'active', credits: 500, joined: '28/6/2026', lastSeen: '1 day ago' },
  { id: 5, name: 'Provider Manager', email: 'provider@cyberrakhwala.com', role: 'staff', status: 'inactive', credits: 500, joined: '28/6/2026', lastSeen: '3 days ago' },
  { id: 6, name: 'Support Admin', email: 'support@cyberrakhwala.com', role: 'staff', status: 'active', credits: 300, joined: '28/6/2026', lastSeen: '30 min ago' },
  { id: 7, name: 'Law Demo 2', email: 'lawenforcement@cyberrakhwala.com', role: 'law-enforcement', status: 'banned', credits: 0, joined: '28/6/2026', lastSeen: '7 days ago' },
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

const EMPTY_FORM = {
  name: '', email: '', role: 'law-enforcement',
  status: 'active', credits: 250, password: '',
}

export default function AdminUsers() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'admin') { navigate('/login'); return }
    setUser(parsed)
  }, [navigate])

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    const matchStatus = filterStatus === 'all' || u.status === filterStatus
    return matchSearch && matchRole && matchStatus
  })

  const openCreate = () => {
    setEditUser(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (u) => {
    setEditUser(u)
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status, credits: u.credits, password: '' })
    setShowModal(true)
  }

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
      <Sidebar role="admin" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar user={user} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Users</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Create, manage, and control platform access</p>
            </div>
            <button onClick={openCreate} className="btn-primary" style={{ padding: '10px 20px' }}>
              <Plus size={16} /> Add User
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Users', value: users.length, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Active', value: users.filter(u => u.status === 'active').length, color: '#10b981', bg: '#d1fae5' },
              { label: 'Banned', value: users.filter(u => u.status === 'banned').length, color: '#ef4444', bg: '#fee2e2' },
              { label: 'Law Enforcement', value: users.filter(u => u.role === 'law-enforcement').length, color: '#0284c7', bg: '#e0f2fe' },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '18px' }}>
                <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="cr-input"
                style={{ paddingLeft: '32px' }}
              />
            </div>

            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="cr-input"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="all">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="cr-input"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          {/* Users table */}
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
                          <div style={{ width: '34px', height: '34px', background: rc.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: rc.color }}>{u.name[0]}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{u.name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ background: rc.bg, color: rc.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ background: sc.bg, color: sc.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                          {sc.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button onClick={() => handleCredits(u.id, -50)} style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', width: '22px', height: '22px', cursor: 'pointer', color: '#dc2626', fontWeight: 700, fontSize: '0.9rem' }}>-</button>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#d97706', minWidth: '36px', textAlign: 'center' }}>{u.credits}</span>
                          <button onClick={() => handleCredits(u.id, 50)} style={{ background: '#d1fae5', border: 'none', borderRadius: '4px', width: '22px', height: '22px', cursor: 'pointer', color: '#059669', fontWeight: 700, fontSize: '0.9rem' }}>+</button>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.lastSeen}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => setViewUser(u)}
                            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => openEdit(u)}
                            style={{ background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#0284c7', display: 'flex', alignItems: 'center' }}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleBan(u.id)}
                            style={{ background: u.status === 'banned' ? '#d1fae5' : '#fef3c7', border: `1px solid ${u.status === 'banned' ? '#a7f3d0' : '#fde68a'}`, borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: u.status === 'banned' ? '#059669' : '#d97706', display: 'flex', alignItems: 'center' }}
                            title={u.status === 'banned' ? 'Unban' : 'Ban'}
                          >
                            {u.status === 'banned' ? <CheckCircle size={13} /> : <Ban size={13} />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No users found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                {editUser ? 'Edit User' : 'Create User'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                  Password {editUser ? '(leave blank to keep)' : '*'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required={!editUser}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="cr-input"
                    style={{ paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
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

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 20px' }}>
                  <Save size={15} /> {saving ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '420px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>User Details</h3>
              <button onClick={() => setViewUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
              <div style={{ width: '48px', height: '48px', background: ROLE_COLORS[viewUser.role]?.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: ROLE_COLORS[viewUser.role]?.color }}>{viewUser.name[0]}</span>
              </div>
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{viewUser.name}</p>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>{viewUser.email}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Role', value: viewUser.role },
                { label: 'Status', value: STATUS_COLORS[viewUser.status]?.label },
                { label: 'Credits', value: viewUser.credits },
                { label: 'Joined', value: viewUser.joined },
                { label: 'Last Seen', value: viewUser.lastSeen },
              ].map((row) => (
                <div key={row.label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{row.label}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{row.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
              <button onClick={() => { setViewUser(null); openEdit(viewUser) }} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => setViewUser(null)} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '380px', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Delete User?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '20px' }}>This action cannot be undone. The user will lose all access.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}