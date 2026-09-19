import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import { Clock, Search, Zap, CheckCircle, XCircle, Filter } from 'lucide-react'

const MOCK_HISTORY = [
  { id: 1, tool: 'IP Tracer', query: '192.168.1.1', credits: 35, status: 'success', time: '2 hours ago', category: 'Network' },
  { id: 2, tool: 'Domain Intel', query: 'example.com', credits: 27, status: 'success', time: '3 hours ago', category: 'OSINT' },
  { id: 3, tool: 'Email OSINT', query: 'test@example.com', credits: 41, status: 'failed', time: '5 hours ago', category: 'OSINT' },
  { id: 4, tool: 'URL Scanner', query: 'https://suspicious.com', credits: 32, status: 'success', time: '1 day ago', category: 'Threat' },
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="student" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0 }}>
        <Topbar user={{ ...user, credits: 100 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Scan History</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Your past tool searches and results</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Scans', value: MOCK_HISTORY.length, color: '#0ea5e9' },
              { label: 'Successful', value: MOCK_HISTORY.filter(h => h.status === 'success').length, color: '#10b981' },
              { label: 'Failed', value: MOCK_HISTORY.filter(h => h.status === 'failed').length, color: '#ef4444' },
              { label: 'Credits Used', value: totalCredits, color: '#d97706' },
            ].map((s) => (
              <div key={s.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search history..." className="cr-input" style={{ paddingLeft: '32px' }} />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['all', 'success', 'failed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: '8px 12px', borderRadius: '6px', border: '1px solid',
                  borderColor: filterStatus === s ? '#0ea5e9' : '#e2e8f0',
                  background: filterStatus === s ? '#e0f2fe' : '#ffffff',
                  color: filterStatus === s ? '#0284c7' : '#64748b',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* History list */}
          {filtered.length === 0 ? (
            <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
              <Clock size={36} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No scan history found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((item) => (
                <div key={item.id} className="cr-card" style={{ padding: isMobile ? '14px' : '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                        background: item.status === 'success' ? '#d1fae5' : '#fee2e2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.status === 'success'
                          ? <CheckCircle size={18} color="#059669" />
                          : <XCircle size={18} color="#dc2626" />
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{item.tool}</p>
                          <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>{item.category}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Query: {item.query}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{item.time}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '6px', padding: '5px 8px', flexShrink: 0 }}>
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