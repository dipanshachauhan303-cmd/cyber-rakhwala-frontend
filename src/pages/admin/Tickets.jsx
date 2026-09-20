import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { Bell, Search, X, CheckCircle, Send } from 'lucide-react'

const INITIAL_TICKETS = [
  { id: 'TK-001', subject: 'Cannot access Phone Lookup tool', message: 'I am getting an error when trying to use the phone lookup tool. It says insufficient credits but I have 250.', user: 'Law Enforcement Demo', email: 'law@demo.com', status: 'open', priority: 'high', created: '2 hours ago', category: 'Bug' },
  { id: 'TK-002', subject: 'Request for additional credits', message: 'We need more credits for an ongoing investigation. Please approve 500 additional credits.', user: 'Officer Smith', email: 'smith@police.gov', status: 'pending', priority: 'medium', created: '1 day ago', category: 'Billing' },
  { id: 'TK-003', subject: 'CDR Analysis result format question', message: 'Can you explain the format of CDR analysis results? The timestamp column is confusing.', user: 'Student Demo', email: 'student@demo.com', status: 'resolved', priority: 'low', created: '3 days ago', category: 'Support' },
  { id: 'TK-004', subject: 'Face Recognition not working on mobile', message: 'The face recognition tool does not work properly on mobile browsers.', user: 'Officer Raj', email: 'raj@cyber.gov', status: 'open', priority: 'high', created: '5 hours ago', category: 'Bug' },
]

const STATUS_COLORS = {
  open: { bg: '#fee2e2', color: '#dc2626', label: 'Open' },
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  resolved: { bg: '#d1fae5', color: '#059669', label: 'Resolved' },
}

const PRIORITY_COLORS = {
  high: { bg: '#fee2e2', color: '#dc2626' },
  medium: { bg: '#fef3c7', color: '#d97706' },
  low: { bg: '#f1f5f9', color: '#64748b' },
}

export default function AdminTickets() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTicket, setActiveTicket] = useState(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
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

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleResolve = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'resolved' } : t))
    if (activeTicket?.id === id) setActiveTicket({ ...activeTicket, status: 'resolved' })
  }

  const handleSendReply = (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setTimeout(() => {
      setReply('')
      setSending(false)
      handleResolve(activeTicket.id)
    }, 800)
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="network" />
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Support Tickets</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Contact and feedback queue</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total', value: tickets.length, grad: ['#2563eb', '#0ea5e9'] },
              { label: 'Open', value: tickets.filter(t => t.status === 'open').length, grad: ['#ef4444', '#dc2626'] },
              { label: 'Pending', value: tickets.filter(t => t.status === 'pending').length, grad: ['#f59e0b', '#f97316'] },
              { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, grad: ['#10b981', '#06b6d4'] },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <Search size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="cr-input" style={{ paddingLeft: '32px' }} />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['all', 'open', 'pending', 'resolved'].map(s => (
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((ticket) => {
              const sc = STATUS_COLORS[ticket.status]
              const pc = PRIORITY_COLORS[ticket.priority]
              return (
                <div key={ticket.id} className="cr-card" style={{ padding: isMobile ? '14px' : '18px', cursor: 'pointer', borderLeft: `3px solid ${ticket.priority === 'high' ? '#ef4444' : ticket.priority === 'medium' ? '#f59e0b' : 'rgba(59,130,246,0.2)'}` }} onClick={() => setActiveTicket(ticket)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#93c5fd' }}>{ticket.id}</span>
                        <span style={{ background: pc.bg, color: pc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', textTransform: 'capitalize' }}>{ticket.priority}</span>
                        <span style={{ background: 'rgba(219,234,254,0.6)', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '20px' }}>{ticket.category}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '3px' }}>{ticket.subject}</p>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>{ticket.message.slice(0, isMobile ? 60 : 100)}...</p>
                      <p style={{ fontSize: '0.72rem', color: '#93c5fd' }}>{ticket.user} · {ticket.created}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{sc.label}</span>
                      {ticket.status !== 'resolved' && (
                        <button onClick={(e) => { e.stopPropagation(); handleResolve(ticket.id) }} style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: '#059669', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle size={11} /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
                <Bell size={36} color="#93c5fd" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#64748b' }}>No tickets found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {activeTicket && (
        <div style={modalStyle}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '540px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#93c5fd', fontFamily: 'monospace', marginBottom: '3px' }}>{activeTicket.id}</p>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>{activeTicket.subject}</h3>
              </div>
              <button onClick={() => setActiveTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>
            <div style={{ background: 'rgba(219,234,254,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '14px', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>{activeTicket.user}</p>
                  <p style={{ fontSize: '0.75rem', color: '#93c5fd' }}>{activeTicket.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <span style={{ background: PRIORITY_COLORS[activeTicket.priority].bg, color: PRIORITY_COLORS[activeTicket.priority].color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', textTransform: 'capitalize' }}>{activeTicket.priority}</span>
                  <span style={{ background: STATUS_COLORS[activeTicket.status].bg, color: STATUS_COLORS[activeTicket.status].color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{STATUS_COLORS[activeTicket.status].label}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: 1.6 }}>{activeTicket.message}</p>
              <p style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '8px' }}>{activeTicket.created}</p>
            </div>
            {activeTicket.status !== 'resolved' ? (
              <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reply</label>
                <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." className="cr-input" rows={4} style={{ resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => handleResolve(activeTicket.id)} className="btn-secondary" style={{ padding: '10px 14px' }}>
                    <CheckCircle size={14} /> Mark Resolved
                  </button>
                  <button type="submit" disabled={sending || !reply.trim()} className="btn-primary" style={{ padding: '10px 18px' }}>
                    <Send size={14} /> {sending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ background: 'rgba(209,250,229,0.5)', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#059669" />
                <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>This ticket has been resolved.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}