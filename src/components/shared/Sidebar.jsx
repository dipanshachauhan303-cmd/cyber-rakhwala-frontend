import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Wrench, FolderOpen, Shield,
  Users, Settings, LogOut, ChevronLeft, ChevronRight,
  Activity, Key, Database, FileText, CreditCard,
  Bell, BarChart2, Clock, Menu, X
} from 'lucide-react'
import { clearAuth } from '../../utils/api.js'

const NAV = {
  'law-enforcement': [
    { icon: LayoutDashboard, label: 'Overview', path: '/law-enforcement/dashboard' },
    { icon: Wrench, label: 'Tools', path: '/law-enforcement/tools' },
    { icon: FolderOpen, label: 'Cases', path: '/law-enforcement/cases' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Clock, label: 'Registrations', path: '/admin/registrations' },
    { icon: Wrench, label: 'Tools', path: '/admin/tools' },
    { icon: CreditCard, label: 'Plans', path: '/admin/plans' },
    { icon: Key, label: 'API Keys', path: '/admin/api-keys' },
    { icon: Database, label: 'Providers', path: '/admin/providers' },
    { icon: FileText, label: 'Content', path: '/admin/content' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: Bell, label: 'Tickets', path: '/admin/tickets' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ],
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Wrench, label: 'Tools', path: '/student/tools' },
    { icon: Activity, label: 'History', path: '/student/history' },
  ],
}

const ROLE_BADGE = {
  'law-enforcement': { label: 'Law Enforcement', color: '#0ea5e9', bg: '#e0f2fe' },
  admin: { label: 'Admin', color: '#dc2626', bg: '#fee2e2' },
  student: { label: 'Student', color: '#7c3aed', bg: '#ede9fe' },
}

export default function Sidebar({ role = 'law-enforcement' }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const links = NAV[role] || NAV['law-enforcement']
  const badge = ROLE_BADGE[role] || ROLE_BADGE['law-enforcement']

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/login'
  }

  const handleNavigate = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <div style={{
      width: collapsed ? '64px' : '220px',
      height: '100%',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        minHeight: '64px',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={16} color="#ffffff" />
            </div>
            <div>
              <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em' }}>CYBER</p>
              <p style={{ color: '#64748b', fontSize: '0.65rem' }}>RAKHWALA</p>
            </div>
          </div>
        )}
        {collapsed && <Shield size={18} color="#ffffff" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{
            background: badge.bg, color: badge.color,
            fontSize: '0.68rem', fontWeight: 700,
            padding: '3px 10px', borderRadius: '20px',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {badge.label}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '10px', padding: collapsed ? '10px 0' : '10px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent',
                borderRight: isActive ? '2px solid #0ea5e9' : '2px solid transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                color: isActive ? '#0ea5e9' : '#94a3b8',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={16} />
              {!collapsed && (
                <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}>
                  {link.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: '10px', padding: '10px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#64748b', borderRadius: '6px', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
        >
          <LogOut size={16} />
          {!collapsed && <span style={{ fontSize: '0.875rem' }}>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed', top: '16px', left: '16px', zIndex: 100,
          background: '#0f172a', border: 'none', borderRadius: '8px',
          padding: '8px', cursor: 'pointer', color: '#ffffff',
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <div style={{ display: 'flex', minHeight: '100vh' }} className="desktop-sidebar">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: mobileOpen ? 0 : '-220px',
        zIndex: 100, height: '100vh', transition: 'left 0.25s ease',
        display: 'none',
      }} className="mobile-sidebar">
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute', top: '16px', right: '-40px',
              background: '#0f172a', border: 'none', borderRadius: '0 8px 8px 0',
              padding: '8px', cursor: 'pointer', color: '#ffffff',
            }}
          >
            <X size={20} />
          </button>
          <SidebarContent />
        </div>
      </div>
    </>
  )
}