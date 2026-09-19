import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Shield, CheckCircle, X, Eye, Clock,
  User, Mail, Phone, MapPin, Building2, Star
} from 'lucide-react'

const PENDING = [
  { id: 1, username: 'officer_raj', fullName: 'Rajesh Kumar', email: 'rajesh.kumar@mp.gov.in', contact: '+919876543210', rank: 'Sub-Inspector (SI)', cadre: 'Madhya Pradesh', policeStation: 'Bhopal Central Police Station', submitted: '2 hours ago', status: 'pending' },
  { id: 2, username: 'dsp_sharma', fullName: 'Priya Sharma', email: 'priya.sharma@delhi.gov.in', contact: '+919812345678', rank: 'Deputy Superintendent (DSP)', cadre: 'Delhi', policeStation: 'Connaught Place Police Station', submitted: '5 hours ago', status: 'pending' },
  { id: 3, username: 'insp_verma', fullName: 'Amit Verma', email: 'amit.verma@up.gov.in', contact: '+919998887776', rank: 'Inspector', cadre: 'Uttar Pradesh', policeStation: 'Lucknow Hazratganj PS', submitted: '1 day ago', status: 'pending' },
]

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  approved: { bg: '#d1fae5', color: '#059669', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
}

export default function AdminRegistrations() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [registrations, setRegistrations] = useState(PENDING)
  const [viewReg, setViewReg] = useState(null)
  const [processing, setProcessing] = useState(null)
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

  const handleApprove = (id) => {
    setProcessing(id)
    setTimeout(() => {
      setRegistrations(registrations.map(r => r.id === id ? { ...r, status: 'approved' } : r))
      setProcessing(null)
      if (viewReg?.id === id) setViewReg({ ...viewReg, status: 'approved' })
    }, 800)
  }

  const handleReject = (id) => {
    setProcessing(id)
    setTimeout(() => {
      setRegistrations(registrations.map(r => r.id === id ? { ...r, status: 'rejected' } : r))
      setProcessing(null)
      if (viewReg?.id === id) setViewReg({ ...viewReg, status: 'rejected' })
    }, 800)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0' }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Pending Registrations
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Review and approve law enforcement officer requests</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Pending', value: registrations.filter(r => r.status === 'pending').length, color: '#d97706' },
              { label: 'Approved', value: registrations.filter(r => r.status === 'approved').length, color: '#059669' },
              { label: 'Rejected', value: registrations.filter(r => r.status === 'rejected').length, color: '#dc2626' },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Registrations list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {registrations.map((reg) => {
              const sc = STATUS_COLORS[reg.status]
              return (
                <div key={reg.id} className="cr-card" style={{ padding: isMobile ? '14px' : '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Shield size={20} color="#0284c7" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{reg.fullName}</p>
                          <span style={{ background: sc.bg, color: sc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{sc.label}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{reg.rank} • {reg.cadre}</p>
                        {!isMobile && <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{reg.email} · {reg.submitted}</p>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                      <button
                        onClick={() => setViewReg(reg)}
                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <Eye size={13} /> {!isMobile && 'View'}
                      </button>
                      {reg.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(reg.id)}
                            disabled={processing === reg.id}
                            style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#059669', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <CheckCircle size={13} /> {!isMobile && (processing === reg.id ? '...' : 'Approve')}
                          </button>
                          <button
                            onClick={() => handleReject(reg.id)}
                            disabled={processing === reg.id}
                            style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <X size={13} /> {!isMobile && 'Reject'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {registrations.length === 0 && (
              <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
                <Clock size={36} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#94a3b8' }}>No pending registrations</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View Modal */}
      {viewReg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Registration Details</h3>
              <button onClick={() => setViewReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', background: '#e0f2fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={22} color="#0284c7" />
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{viewReg.fullName}</p>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>@{viewReg.username}</p>
              </div>
              <span style={{ marginLeft: 'auto', background: STATUS_COLORS[viewReg.status].bg, color: STATUS_COLORS[viewReg.status].color, fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                {STATUS_COLORS[viewReg.status].label}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { icon: Mail, label: 'Email', value: viewReg.email },
                { icon: Phone, label: 'Contact', value: viewReg.contact },
                { icon: Star, label: 'Rank', value: viewReg.rank },
                { icon: MapPin, label: 'Cadre', value: viewReg.cadre },
                { icon: Building2, label: 'Police Station', value: viewReg.policeStation },
                { icon: Clock, label: 'Submitted', value: viewReg.submitted },
              ].map((row) => {
                const Icon = row.icon
                return (
                  <div key={row.label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                      <Icon size={11} color="#94a3b8" />
                      <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{row.label}</p>
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-all' }}>{row.value}</p>
                  </div>
                )
              })}
            </div>

            {viewReg.status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleReject(viewReg.id)} className="btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>
                  <X size={14} /> Reject
                </button>
                <button
                  onClick={() => handleApprove(viewReg.id)}
                  style={{ flex: 1, justifyContent: 'center', padding: '10px', background: '#d1fae5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
                >
                  <CheckCircle size={14} /> Approve
                </button>
              </div>
            )}

            {viewReg.status !== 'pending' && (
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