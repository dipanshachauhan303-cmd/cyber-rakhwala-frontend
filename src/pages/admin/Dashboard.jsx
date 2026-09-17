import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import {
  Users, Zap, Search, Shield, Activity,
  TrendingUp, AlertTriangle, CheckCircle,
  Clock, ArrowUpRight, Settings, Database,
  CreditCard, Bell, FileText
} from 'lucide-react'

const RECENT_USERS = [
  { name: 'Law Enforcement Demo', email: 'law-enforcement@cyberrakhwala.com', role: 'law-enforcement', status: 'active', joined: '28/6/2026' },
  { name: 'Student Demo', email: 'student@cyberrakhwala.com', role: 'student', status: 'active', joined: '28/6/2026' },
  { name: 'Admin User', email: 'admin@cyberrakhwala.com', role: 'admin', status: 'active', joined: '28/6/2026' },
  { name: 'Content Manager', email: 'content@cyberrakhwala.com', role: 'staff', status: 'active', joined: '28/6/2026' },
]

const MODULES = [
  { icon: Users, label: 'Users', desc: 'Create, ban, role assign', path: '/admin/users', color: '#0ea5e9' },
  { icon: Shield, label: 'Roles', desc: 'Permission profiles', path: '/admin/roles', color: '#8b5cf6' },
  { icon: CreditCard, label: 'Plans', desc: 'Credits & subscriptions', path: '/admin/plans', color: '#10b981' },
  { icon: Database, label: 'Providers', desc: 'External API connectors', path: '/admin/providers', color: '#f97316' },
  { icon: Settings, label: 'Tools', desc: 'Tool visibility and costs', path: '/admin/tools', color: '#64748b' },
  { icon: FileText, label: 'Content', desc: 'Homepage and site blocks', path: '/admin/content', color: '#ec4899' },
  { icon: Activity, label: 'Analytics', desc: 'Deep drilldown and events', path: '/admin/analytics', color: '#06b6d4' },
  { icon: Bell, label: 'Tickets', desc: 'Contact and feedback queue', path: '/admin/tickets', color: '#ef4444' },
]

const ROLE_COLORS = {
  admin: { bg: '#fee2e2', color: '#dc2626' },
  'law-enforcement': { bg: '#e0f2fe', color: '#0284c7' },
  student: { bg: '#ede9fe', color: '#7c3aed' },
  staff: { bg: '#d1fae5', color: '#059669' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'admin') { navigate('/login'); return }
    setUser(parsed)
  }, [navigate])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="admin" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar user={{ ...user, credits: null }} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Hidden Admin Console
            </p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Cyber Rakhwala Operations Center
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '600px' }}>
              Users, subscriptions, API providers, tool readiness, content blocks, support tickets, and search operations are all managed here.
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {['Protected Route Access', 'RBAC Staff Controls', 'Provider Orchestration', 'Audit-Ready Operations'].map((tag) => (
                <span key={tag} style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: '6px', letterSpacing: '0.03em' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Meta info bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Active Module', value: 'Overview', color: '#0f172a' },
              { label: 'Role Scope', value: 'admin', color: '#0f172a' },
              { label: 'Data Plane', value: 'Mongo + Protected API', color: '#0ea5e9' },
              { label: 'Control Surface', value: 'Users, Billing, Providers, Tools', color: '#0f172a' },
            ].map((item) => (
              <div key={item.label} className="cr-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* KPI Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Registered Users', value: '7', icon: Users, color: '#0ea5e9', bg: '#e0f2fe', trend: '+2 this week' },
              { label: 'Tracked Searches', value: '0', icon: Search, color: '#10b981', bg: '#d1fae5', trend: 'No activity yet' },
              { label: 'Provider Readiness', value: '0%', icon: Database, color: '#d97706', bg: '#fef3c7', trend: 'Setup required' },
              { label: 'Open Tickets', value: '0', icon: Bell, color: '#ef4444', bg: '#fee2e2', trend: 'All clear' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="cr-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {stat.label}
                    </p>
                    <div style={{ width: '36px', height: '36px', background: stat.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={stat.color} />
                    </div>
                  </div>
                  <p className="stat-number">{stat.value}</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>{stat.trend}</p>
                </div>
              )
            })}
          </div>

          {/* Modules grid */}
          <div className="cr-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Modules</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>Enterprise control rail for identity, billing, providers, content, investigations, and support workflows.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {MODULES.map((mod) => {
                const Icon = mod.icon
                return (
                  <button
                    key={mod.label}
                    onClick={() => navigate(mod.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc' }}
                  >
                    <div style={{ width: '34px', height: '34px', background: mod.color + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={mod.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{mod.label}</p>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mod.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Recent users */}
            <div className="cr-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Recent Commercial Activity</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>Latest user registrations, payments, and queue movement.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {RECENT_USERS.map((u) => {
                  const rc = ROLE_COLORS[u.role] || ROLE_COLORS.staff
                  return (
                    <div
                      key={u.email}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    >
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{u.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.email}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: rc.bg, color: rc.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {u.role}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{u.joined}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Support + Runtime health */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="cr-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Support + Runtime Health</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>Ticket queue and current configuration counts.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Settings Records', value: '0' },
                    { label: 'Feature Toggles', value: '0' },
                  ].map((item) => (
                    <div key={item.label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px', border: '1px solid #e2e8f0' }}>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                        {item.label}
                      </p>
                      <p className="stat-number" style={{ fontSize: '1.5rem' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cr-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Manage Users', path: '/admin/users', color: '#0ea5e9' },
                    { label: 'Configure Providers', path: '/admin/providers', color: '#f97316' },
                    { label: 'View Analytics', path: '/admin/analytics', color: '#10b981' },
                    { label: 'Check Tickets', path: '/admin/tickets', color: '#ef4444' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.color = action.color }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}
                    >
                      {action.label}
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}