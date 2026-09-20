import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import {
  Users, Zap, Search, Shield, Activity,
  AlertTriangle, CheckCircle, ArrowUpRight,
  Settings, Database, CreditCard, Bell,
  FileText, BarChart2
} from 'lucide-react'

const RECENT_USERS = [
  { name: 'Law Enforcement Demo', email: 'law@demo.com', role: 'law-enforcement', joined: '28/6/2026' },
  { name: 'Student Demo', email: 'student@demo.com', role: 'student', joined: '28/6/2026' },
  { name: 'Admin User', email: 'admin@demo.com', role: 'admin', joined: '28/6/2026' },
  { name: 'Content Manager', email: 'content@demo.com', role: 'staff', joined: '28/6/2026' },
]

const MODULES = [
  { icon: Users, label: 'Users', desc: 'Create, ban, role assign', path: '/admin/users', color: '#2563eb' },
  { icon: Shield, label: 'Registrations', desc: 'Approve/reject officers', path: '/admin/registrations', color: '#10b981' },
  { icon: CreditCard, label: 'Plans', desc: 'Credits & subscriptions', path: '/admin/plans', color: '#8b5cf6' },
  { icon: Database, label: 'Providers', desc: 'External API connectors', path: '/admin/providers', color: '#f97316' },
  { icon: Settings, label: 'Tools', desc: 'Tool visibility and costs', path: '/admin/tools', color: '#0ea5e9' },
  { icon: FileText, label: 'Content', desc: 'Homepage and site blocks', path: '/admin/content', color: '#ec4899' },
  { icon: Activity, label: 'Analytics', desc: 'Deep drilldown and events', path: '/admin/analytics', color: '#06b6d4' },
  { icon: Bell, label: 'Tickets', desc: 'Contact and feedback queue', path: '/admin/tickets', color: '#ef4444' },
]

const ROLE_COLORS = {
  admin: { bg: '#fee2e2', color: '#dc2626' },
  'law-enforcement': { bg: '#dbeafe', color: '#1d4ed8' },
  student: { bg: '#ede9fe', color: '#7c3aed' },
  staff: { bg: '#d1fae5', color: '#059669' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="matrix" />
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Admin Console</p>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Operations Center</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage users, tools, providers, content and support.</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Registered Users', value: '7', icon: Users, grad: ['#2563eb', '#0ea5e9'], trend: '+2 this week' },
              { label: 'Tracked Searches', value: '0', icon: Search, grad: ['#10b981', '#06b6d4'], trend: 'No activity yet' },
              { label: 'Provider Readiness', value: '0%', icon: Database, grad: ['#f59e0b', '#f97316'], trend: 'Setup required' },
              { label: 'Open Tickets', value: '0', icon: Bell, grad: ['#ef4444', '#dc2626'], trend: 'All clear' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="cr-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
                    <div style={{ width: '34px', height: '34px', background: `linear-gradient(135deg, ${stat.grad[0]}, ${stat.grad[1]})`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${stat.grad[0]}50`, flexShrink: 0 }}>
                      <Icon size={16} color="#ffffff" />
                    </div>
                  </div>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '6px' }}>{stat.trend}</p>
                </div>
              )
            })}
          </div>

          {/* Modules */}
          <div className="cr-card" style={{ padding: isMobile ? '16px' : '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>Modules</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>Quick access to all admin controls</p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '10px' }}>
              {MODULES.map((mod) => {
                const Icon = mod.icon
                return (
                  <button key={mod.label} onClick={() => navigate(mod.path)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.7)', border: `1px solid rgba(59,130,246,0.12)`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left', width: '100%', backdropFilter: 'blur(6px)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${mod.color}40`; e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.7)' }}
                  >
                    <div style={{ width: '32px', height: '32px', background: `linear-gradient(135deg, ${mod.color}20, ${mod.color}35)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${mod.color}25` }}>
                      <Icon size={15} color={mod.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a' }}>{mod.label}</p>
                      {!isMobile && <p style={{ fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.desc}</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>

            <div className="cr-card" style={{ padding: isMobile ? '16px' : '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>Recent Users</h3>
                <button onClick={() => navigate('/admin/users')} style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Manage →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {RECENT_USERS.map((u) => {
                  const rc = ROLE_COLORS[u.role] || ROLE_COLORS.staff
                  return (
                    <div key={u.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.1)', backdropFilter: 'blur(6px)' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a' }}>{u.name}</p>
                        {!isMobile && <p style={{ fontSize: '0.72rem', color: '#93c5fd' }}>{u.email}</p>}
                      </div>
                      <span style={{ background: rc.bg, color: rc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {u.role === 'law-enforcement' ? 'Law' : u.role}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="cr-card" style={{ padding: isMobile ? '16px' : '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '14px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Manage Users', path: '/admin/users', color: '#2563eb' },
                  { label: 'Pending Registrations', path: '/admin/registrations', color: '#10b981' },
                  { label: 'Configure Providers', path: '/admin/providers', color: '#f97316' },
                  { label: 'View Analytics', path: '/admin/analytics', color: '#8b5cf6' },
                  { label: 'Check Tickets', path: '/admin/tickets', color: '#ef4444' },
                ].map((action) => (
                  <button key={action.label} onClick={() => navigate(action.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a', backdropFilter: 'blur(6px)', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.color = action.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.1)'; e.currentTarget.style.color = '#1e3a8a' }}
                  >
                    {action.label}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}