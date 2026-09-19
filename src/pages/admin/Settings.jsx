import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import { Settings, Save, RefreshCw, Shield, Bell, Key, ToggleLeft, ToggleRight } from 'lucide-react'

const SECTIONS = [
  {
    id: 'general', label: 'General', icon: Settings,
    fields: [
      { key: 'platform_name', label: 'Platform Name', type: 'text', value: 'Cyber Rakhwala' },
      { key: 'platform_url', label: 'Platform URL', type: 'text', value: 'https://cyberrakhwala.com' },
      { key: 'support_email', label: 'Support Email', type: 'email', value: 'support@cyberrakhwala.com' },
      { key: 'max_credits', label: 'Default Credits (new users)', type: 'number', value: '250' },
    ],
  },
  {
    id: 'security', label: 'Security', icon: Shield,
    fields: [
      { key: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', value: '60' },
      { key: 'max_login_attempts', label: 'Max Login Attempts', type: 'number', value: '5' },
      { key: 'jwt_expiry', label: 'JWT Expiry (hours)', type: 'number', value: '24' },
    ],
  },
  {
    id: 'notifications', label: 'Notifications', icon: Bell,
    fields: [
      { key: 'notify_new_user', label: 'Notify on new user registration', type: 'toggle', value: true },
      { key: 'notify_low_credits', label: 'Notify when credits below 50', type: 'toggle', value: true },
      { key: 'notify_errors', label: 'Notify on API errors', type: 'toggle', value: false },
    ],
  },
  {
    id: 'api', label: 'API Settings', icon: Key,
    fields: [
      { key: 'rate_limit', label: 'Rate Limit (requests/minute)', type: 'number', value: '60' },
      { key: 'api_timeout', label: 'API Timeout (seconds)', type: 'number', value: '30' },
      { key: 'enable_cors', label: 'Enable CORS', type: 'toggle', value: true },
    ],
  },
]

export default function AdminSettings() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState(() => {
    const init = {}
    SECTIONS.forEach(s => s.fields.forEach(f => { init[f.key] = f.value }))
    return init
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
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

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 800)
  }

  const currentSection = SECTIONS.find(s => s.id === activeSection)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', overflowX: 'hidden' }}>
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Settings</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Runtime configuration and feature toggles</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Section tabs */}
            <div className="cr-card" style={{ padding: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {SECTIONS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 12px', borderRadius: '6px', border: 'none',
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        background: activeSection === s.id ? '#e0f2fe' : 'transparent',
                        color: activeSection === s.id ? '#0284c7' : '#64748b',
                        fontSize: '0.82rem', fontWeight: activeSection === s.id ? 600 : 400,
                      }}
                    >
                      <Icon size={14} /> {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fields */}
            <div className="cr-card" style={{ padding: isMobile ? '16px' : '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                {currentSection && <currentSection.icon size={20} color="#0ea5e9" />}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{currentSection?.label}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentSection?.fields.map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                      {field.label}
                    </label>
                    {field.type === 'toggle' ? (
                      <button
                        onClick={() => setSettings({ ...settings, [field.key]: !settings[field.key] })}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        {settings[field.key]
                          ? <ToggleRight size={28} color="#0ea5e9" />
                          : <ToggleLeft size={28} color="#94a3b8" />
                        }
                        <span style={{ fontSize: '0.875rem', color: settings[field.key] ? '#0ea5e9' : '#94a3b8', fontWeight: 500 }}>
                          {settings[field.key] ? 'Enabled' : 'Disabled'}
                        </span>
                      </button>
                    ) : (
                      <input
                        type={field.type}
                        value={settings[field.key]}
                        onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                        className="cr-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '10px 22px' }}>
                  <Save size={15} /> {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
                </button>
                <button className="btn-secondary" style={{ padding: '10px 18px' }}>
                  <RefreshCw size={15} /> Reset
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}