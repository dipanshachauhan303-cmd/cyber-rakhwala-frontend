import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { Clock, Search, Zap, CheckCircle, XCircle } from 'lucide-react'

const MOCK_HISTORY = [
  { id: 1, tool: 'IP Tracer', query: '192.168.1.1', credits: 35, status: 'success', time: '2 hours ago', category: 'Network' },
  { id: 2, tool: 'Domain Intel', query: 'example.com', credits: 27, status: 'success', time: '3 hours ago', category: 'OSINT' },
  { id: 3, tool: 'Email OSINT', query: 'test@example.com', credits: 41, status: 'failed', time: '5 hours ago', category: 'OSINT' },
  { id: 4, tool: 'URL Scanner', query: 'https://suspicious.com', credits: 32, status: 'success', time: '1 day ago', category: 'Network' },
  { id: 5, tool: 'Hash Analyzer', query: 'abc123def456...', credits: 23, status: 'success', time: '1 day ago', category: 'Forensics' },
]

export default function StudentHistory() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
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

  const filtered = MOCK_HISTORY.filter(h => {
    const matchSearch = h.tool.toLowerCase().includes(search.toLowerCase()) ||
      h.query.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || h.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalCredits = MOCK_HISTORY.reduce((a, h) => a + h.credits, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="network" />
      <Sidebar role="student" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={{ ...user, credits: 100 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Scan History</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Your past tool searches and results</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Scans', value: MOCK_HISTORY.length, grad: ['#2563eb', '#0ea5e9'] },
              { label: 'Successful', value: MOCK_HISTORY.filter(h => h.status === 'success').length, grad: ['#10b981', '#06b6d4'] },
              { label: 'Failed', value: MOCK_HISTORY.filter(h => h.status === 'failed').length, grad: ['#ef4444', '#dc2626'] },
              { label: 'Credits Used', value: totalCredits, grad: ['#f59e0b', '#f97316'] },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <Search size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search history..." className="cr-input" style={{ paddingLeft: '32px' }} />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['all', 'success', 'failed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: '8px 12px', borderRadius: '6px', border: '1px solid',
                  borderColor: filterStatus === s ? '#2563eb' : 'rgba(59,130,246,0.15)',
                  background: filterStatus === s ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.7)',
                  color: filterStatus === s ? '#ffffff' : '#64748b',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  backdropFilter: 'blur(6px)',
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* History list */}
          {filtered.length === 0 ? (
            <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
              <Clock size={36} color="#93c5fd" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No scan history found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((item) => (
                <div key={item.id} className="cr-card" style={{ padding: isMobile ? '14px' : '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                        background: item.status === 'success' ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${item.status === 'success' ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      }}>
                        {item.status === 'success'
                          ? <CheckCircle size={18} color="#1d4ed8" />
                          : <XCircle size={18} color="#dc2626" />
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{item.tool}</p>
                          <span style={{ background: 'rgba(219,234,254,0.6)', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>{item.category}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Query: {item.query}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '2px' }}>{item.time}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fef3c7', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '5px 10px', flexShrink: 0 }}>
                      <Zap size={12} color="#d97706" />
                      <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.82rem' }}>{item.credits}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}