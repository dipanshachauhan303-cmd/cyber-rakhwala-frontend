import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { api } from '../../utils/api.js'
import {
  Shield, CheckCircle, X, Eye, Clock,
  Mail, Phone, MapPin, Building2, Star, RefreshCw
} from 'lucide-react'

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  active: { bg: '#dbeafe', color: '#1d4ed8', label: 'Approved' },
  inactive: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  banned: { bg: '#fee2e2', color: '#dc2626', label: 'Banned' },
}

export default function AdminRegistrations() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewReg, setViewReg] = useState(null)
  const [processing, setProcessing] = useState(null)
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
    fetchRegistrations()
    return () => window.removeEventListener('resize', fn)
  }, [navigate])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const data = await api.get('/api/users?role=law-enforcement')
      const users = data.users || data || []
      setRegistrations(users.filter(u => u.role === 'law-enforcement'))
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setProcessing(id)
    try {
      await api.put(`/api/users/${id}`, { status: 'active', credits: 250 })
      setRegistrations(registrations.map(r => r._id === id ? { ...r, status: 'active', credits: 250 } : r))
      if (viewReg?._id === id) setViewReg({ ...viewReg, status: 'active' })
    } catch (err) {
      console.error('Approve failed:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id) => {
    setProcessing(id)
    try {
      await api.put(`/api/users/${id}`, { status: 'banned' })
      setRegistrations(registrations.map(r => r._id === id ? { ...r, status: 'banned' } : r))
      if (viewReg?._id === id) setViewReg({ ...viewReg, status: 'banned' })
    } catch (err) {
      console.error('Reject failed:', err)
    } finally {
      setProcessing(null)
    }
  }

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

  const pending = registrations.filter(r => r.status === 'inactive')
  const approved = registrations.filter(r => r.status === 'active')
  const rejected = registrations.filter(r => r.status === 'banned')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="network" />
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Registrations</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Review and approve law enforcement officer requests</p>
            </div>
            <button onClick={fetchRegistrations} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', cursor: 'pointer', color: '#2563eb', fontSize: '0.82rem', fontWeight: 600, backdropFilter: 'blur(6px)' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Pending', value: pending.length, grad: ['#f59e0b', '#f97316'] },
              { label: 'Approved', value: approved.length, grad: ['#2563eb', '#0ea5e9'] },
              { label: 'Rejected', value: rejected.length, grad: ['#ef4444', '#dc2626'] },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
              <p style={{ color: '#93c5fd', fontSize: '0.9rem' }}>Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
              <Clock size={36} color="#93c5fd" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#64748b' }}>No registrations found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {registrations.map((reg) => {
                const sc = STATUS_COLORS[reg.status] || STATUS_COLORS.pending
                return (
                  <div key={reg._id} className="cr-card" style={{ padding: isMobile ? '14px' : '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(59,130,246,0.2)' }}>
                          <Shield size={20} color="#1d4ed8" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{reg.name}</p>
                            <span style={{ background: sc.bg, color: sc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{sc.label}</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{reg.rank || 'N/A'} • {reg.cadre || 'N/A'}</p>
                          {!isMobile && <p style={{ fontSize: '0.72rem', color: '#93c5fd' }}>{reg.email} · {new Date(reg.createdAt).toLocaleDateString()}</p>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                        <button onClick={() => setViewReg(reg)} style={{ background: 'rgba(219,234,254,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Eye size={13} /> {!isMobile && 'View'}
                        </button>
                        {reg.status === 'inactive' && (
                          <>
                            <button onClick={() => handleApprove(reg._id)} disabled={processing === reg._id} style={{ background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <CheckCircle size={13} /> {!isMobile && (processing === reg._id ? '...' : 'Approve')}
                            </button>
                            <button onClick={() => handleReject(reg._id)} disabled={processing === reg._id} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <X size={13} /> {!isMobile && 'Reject'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {viewReg && (
        <div style={modalStyle}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '480px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>Registration Details</h3>
              <button onClick={() => setViewReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'rgba(219,234,254,0.3)', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Shield size={22} color="#1d4ed8" />
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>{viewReg.name}</p>
                <p style={{ fontSize: '0.78rem', color: '#93c5fd' }}>@{viewReg.username || 'N/A'}</p>
              </div>
              <span style={{ marginLeft: 'auto', background: STATUS_COLORS[viewReg.status]?.bg || '#fef3c7', color: STATUS_COLORS[viewReg.status]?.color || '#d97706', fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                {STATUS_COLORS[viewReg.status]?.label || 'Pending'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { icon: Mail, label: 'Email', value: viewReg.email },
                { icon: Phone, label: 'Contact', value: viewReg.contact || 'N/A' },
                { icon: Star, label: 'Rank', value: viewReg.rank || 'N/A' },
                { icon: MapPin, label: 'Cadre', value: viewReg.cadre || 'N/A' },
                { icon: Building2, label: 'Police Station', value: viewReg.policeStation || 'N/A' },
                { icon: Clock, label: 'Submitted', value: new Date(viewReg.createdAt).toLocaleDateString() },
              ].map((row) => {
                const Icon = row.icon
                return (
                  <div key={row.label} style={{ background: 'rgba(219,234,254,0.2)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(59,130,246,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                      <Icon size={11} color="#93c5fd" />
                      <p style={{ fontSize: '0.65rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>{row.label}</p>
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e3a8a', wordBreak: 'break-all' }}>{row.value}</p>
                  </div>
                )
              })}
            </div>

            {viewReg.status === 'inactive' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleReject(viewReg._id)} className="btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>
                  <X size={14} /> Reject
                </button>
                <button onClick={() => handleApprove(viewReg._id)} style={{ flex: 1, justifyContent: 'center', padding: '10px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', boxShadow: '0 2px 12px rgba(37,99,235,0.3)' }}>
                  <CheckCircle size={14} /> Approve
                </button>
              </div>
            )}

            {viewReg.status !== 'inactive' && (
              <button onClick={() => setViewReg(null)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}