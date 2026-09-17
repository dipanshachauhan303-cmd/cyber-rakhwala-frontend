import { useState, useEffect } from 'react'
import { Bell, Zap, Clock, User, Search, ChevronDown } from 'lucide-react'

export default function Topbar({ user = {} }) {
  const [time, setTime] = useState(new Date())
  const [showUser, setShowUser] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const credits = user.credits || 250

  const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const roleColor = {
    admin: '#dc2626',
    student: '#7c3aed',
    'law-enforcement': '#0ea5e9',
  }

  return (
    <div style={{
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
    }}>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search tools, cases..."
          className="cr-input"
          style={{ paddingLeft: '32px', width: '220px', padding: '8px 12px 8px 32px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '6px 12px',
          background: '#f8fafc',
        }}>
          <Clock size={13} color="#0ea5e9" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>
            {formatTime(time)}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{formatDate(time)}</span>
        </div>

        {/* Credits */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          border: '1px solid #fef3c7',
          borderRadius: '8px',
          padding: '6px 12px',
          background: '#fffbeb',
        }}>
          <Zap size={13} color="#d97706" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706', fontFamily: 'JetBrains Mono, monospace' }}>
            {credits}
          </span>
          <span style={{ color: '#92400e', fontSize: '0.78rem' }}>credits</span>
        </div>

        {/* Notifications */}
        <button style={{
          position: 'relative',
          background: 'none',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '7px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Bell size={17} color="#64748b" />
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '16px',
            height: '16px',
            background: '#ef4444',
            borderRadius: '50%',
            fontSize: '0.6rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
          }}>2</span>
        </button>

        {/* User */}
        <div
          onClick={() => setShowUser(!showUser)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer',
            background: '#f8fafc',
            position: 'relative',
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: roleColor[user.role] || '#0ea5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <User size={14} color="#ffffff" />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
              {user.name || 'Officer'}
            </p>
            <p style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>
              {user.role || 'law-enforcement'}
            </p>
          </div>
          <ChevronDown size={13} color="#94a3b8" />
        </div>
      </div>
    </div>
  )
}