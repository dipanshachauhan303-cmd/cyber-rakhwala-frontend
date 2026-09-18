import { useState, useEffect } from 'react'
import { Bell, Zap, Clock, User, Search, Menu } from 'lucide-react'

export default function Topbar({ user = {}, onMenuClick }) {
  const [time, setTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    const t = setInterval(() => setTime(new Date()), 1000)
    window.addEventListener('resize', checkMobile)
    return () => {
      clearInterval(t)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const credits = user.credits || 250
  const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div style={{
      height: isMobile ? '56px' : '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 20px',
      flexShrink: 0,
      position: isMobile ? 'fixed' : 'relative',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      boxShadow: isMobile ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
    }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#0f172a', padding: '4px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Menu size={22} />
          </button>
        )}
        {isMobile ? (
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Cyber Rakhwala</span>
        ) : (
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search tools, cases..." className="cr-input" style={{ paddingLeft: '32px', width: '220px', fontSize: '0.85rem' }} />
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>

        {/* Clock - desktop only */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', background: '#f8fafc' }}>
            <Clock size={13} color="#0ea5e9" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>{formatTime(time)}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{formatDate(time)}</span>
          </div>
        )}

        {/* Credits */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #fef3c7', borderRadius: '8px', padding: isMobile ? '5px 8px' : '6px 12px', background: '#fffbeb' }}>
          <Zap size={13} color="#d97706" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706', fontFamily: 'JetBrains Mono, monospace' }}>{credits}</span>
          {!isMobile && <span style={{ color: '#92400e', fontSize: '0.78rem' }}>credits</span>}
        </div>

        {/* Bell */}
        <button style={{ position: 'relative', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={isMobile ? 16 : 17} color="#64748b" />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '15px', height: '15px', background: '#ef4444', borderRadius: '50%', fontSize: '0.55rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</span>
        </button>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: isMobile ? '5px 8px' : '6px 12px', background: '#f8fafc', cursor: 'pointer' }}>
          <div style={{ width: isMobile ? '26px' : '28px', height: isMobile ? '26px' : '28px', borderRadius: '50%', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={isMobile ? 12 : 14} color="#ffffff" />
          </div>
          {!isMobile && (
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>{user.name || 'Officer'}</p>
              <p style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>{user.role || 'law-enforcement'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}