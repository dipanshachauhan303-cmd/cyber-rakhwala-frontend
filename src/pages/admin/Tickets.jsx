import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Bell, Search, X, CheckCircle,
  Clock, AlertTriangle, MessageSquare,
  ChevronDown, Send
} from 'lucide-react'

const INITIAL_TICKETS = [
  {
    id: 'TK-001', subject: 'Cannot access Phone Lookup tool',
    message: 'I am getting an error when trying to use the phone lookup tool. It says insufficient credits but I have 250.',
    user: 'Law Enforcement Demo', email: 'law@demo.com',
    status: 'open', priority: 'high',
    created: '2 hours ago', category: 'Bug',
  },
  {
    id: 'TK-002', subject: 'Request for additional credits',
    message: 'We need more credits for an ongoing investigation. Please approve 500 additional credits.',
    user: 'Officer Smith', email: 'smith@police.gov',
    status: 'pending', priority: 'medium',
    created: '1 day ago', category: 'Billing',
  },
  {
    id: 'TK-003', subject: 'CDR Analysis result format question',
    message: 'Can you explain the format of CDR analysis results? The timestamp column is confusing.',
    user: 'Student Demo', email: 'student@demo.com',
    status: 'resolved', priority: 'low',
    created: '3 days ago', category: 'Support',
  },
  {
    id: 'TK-004', subject: 'Face Recognition not working on mobile',
    message: 'The face recognition tool does not work properly on mobile browsers.',
    user: 'Officer Raj', email: 'raj@cyber.gov',
    status: 'open', priority: 'high',
    created: '5 hours ago', category: 'Bug',
  },
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

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'admin') { navigate('/login'); return }
    setUser(parsed)
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="admin" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar user={user} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Support Tickets</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Contact and feedback queue</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total', value: tickets.length, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Open', value: tickets.filter(t => t.status === 'open').length, color: '#dc2626', bg: '#fee2e2' },
              { label: 'Pending', value: tickets.filter(t => t.status === 'pending').length, color: '#d97706', bg: '#fef3c7' },
              { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, color: '#059669', bg: '#d1fae5' },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '18px' }}>
                <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="cr-input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
            {['all', 'open', 'pending', 'resolved'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '8px 14px', borderRadius: '6px', border: '1px solid',
                  borderColor: filterStatus === s ? '#0ea5e9' : '#e2e8f0',
                  background: filterStatus === s ? '#e0f2fe' : '#ffffff',
                  color: filterStatus === s ? '#0284c7' : '#64748b',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Tickets list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((ticket) => {
              const sc = STATUS_COLORS[ticket.status]
              const pc = PRIORITY_COLORS[ticket.priority]
              return (
                <div
                  key={ticket.id}
                  className="cr-card"
                  style={{
                    padding: '18px', cursor: 'pointer',
                    borderLeft: `3px solid ${ticket.priority === 'high' ? '#ef4444' : ticket.priority === 'medium' ? '#f59e0b' : '#e2e8f0'}`,
                  }}
                  onClick={() => setActiveTicket(ticket)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#94a3b8' }}>{ticket.id}</span>
                        <span style={{ background: pc.bg, color: pc.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize' }}>{ticket.priority}</span>
                        <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{ticket.category}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{ticket.subject}</p>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>{ticket.message.slice(0, 100)}...</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ticket.user}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ticket.created}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{sc.label}</span>
                      {ticket.status !== 'resolved' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleResolve(ticket.id) }}
                          style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: '#059669', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <CheckCircle size={12} /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
                <Bell size={36} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#94a3b8' }}>No tickets found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Ticket detail modal */}
      {activeTicket && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '560px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' }}>{activeTicket.id}</p>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{activeTicket.subject}</h3>
              </div>
              <button onClick={() => setActiveTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            {/* User info */}
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{activeTicket.user}</p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{activeTicket.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ background: PRIORITY_COLORS[activeTicket.priority].bg, color: PRIORITY_COLORS[activeTicket.priority].color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize' }}>
                    {activeTicket.priority}
                  </span>
                  <span style={{ background: STATUS_COLORS[activeTicket.status].bg, color: STATUS_COLORS[activeTicket.status].color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                    {STATUS_COLORS[activeTicket.status].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Message</p>
              <p style={{ fontSize: '0.875rem', color: '#0f172a', lineHeight: 1.6 }}>{activeTicket.message}</p>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '8px' }}>{activeTicket.created}</p>
            </div>

            {/* Reply */}
            {activeTicket.status !== 'resolved' && (
              <form onSubmit={handleSendReply}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Reply</label>
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="cr-input"
                  rows={4}
                  style={{ resize: 'vertical', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleResolve(activeTicket.id)}
                    className="btn-secondary"
                    style={{ padding: '10px 16px' }}
                  >
                    <CheckCircle size={14} /> Mark Resolved
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="btn-primary"
                    style={{ padding: '10px 20px' }}
                  >
                    <Send size={14} /> {sending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            )}

            {activeTicket.status === 'resolved' && (
              <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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