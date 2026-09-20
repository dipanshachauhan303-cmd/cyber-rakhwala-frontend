import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
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
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="circuit" />
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Settings</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Runtime configuration and feature toggles</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Section tabs */}
            <div className="cr-card" style={{ padding: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                {SECTIONS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '8px', border: 'none',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      background: activeSection === s.id ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'transparent',
                      color: activeSection === s.id ? '#ffffff' : '#64748b',
                      fontSize: '0.82rem', fontWeight: activeSection === s.id ? 600 : 400,
                      boxShadow: activeSection === s.id ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
                      transition: 'all 0.2s ease',
                    }}>
                      <Icon size={14} /> {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fields */}
            <div className="cr-card" style={{ padding: isMobile ? '16px' : '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                {currentSection && (
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                    <currentSection.icon size={18} color="#ffffff" />
                  </div>
                )}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>{currentSection?.label}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {currentSection?.fields.map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {field.label}
                    </label>
                    {field.type === 'toggle' ? (
                      <button onClick={() => setSettings({ ...settings, [field.key]: !settings[field.key] })} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {settings[field.key]
                          ? <ToggleRight size={32} color="#2563eb" />
                          : <ToggleLeft size={32} color="#93c5fd" />
                        }
                        <span style={{ fontSize: '0.875rem', color: settings[field.key] ? '#2563eb' : '#93c5fd', fontWeight: 600 }}>
                          {settings[field.key] ? 'Enabled' : 'Disabled'}
                        </span>
                      </button>
                    ) : (
                      <input
                        type={field.type}
                        value={settings[field.key]}
                        onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                        className="cr-input"
                        style={{ maxWidth: isMobile ? '100%' : '400px' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(59,130,246,0.1)', flexWrap: 'wrap' }}>
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