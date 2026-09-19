import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import { BarChart2, Search, Users, Zap, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const DAILY_SEARCHES = [
  { day: 'Mon', searches: 12, credits: 180 },
  { day: 'Tue', searches: 19, credits: 285 },
  { day: 'Wed', searches: 8, credits: 120 },
  { day: 'Thu', searches: 25, credits: 375 },
  { day: 'Fri', searches: 31, credits: 465 },
  { day: 'Sat', searches: 14, credits: 210 },
  { day: 'Sun', searches: 6, credits: 90 },
]

const TOOL_USAGE = [
  { name: 'Phone Lookup', usage: 45 },
  { name: 'Vehicle Info', usage: 38 },
  { name: 'UPI Lookup', usage: 32 },
  { name: 'CDR Analysis', usage: 28 },
  { name: 'Aadhaar Info', usage: 22 },
  { name: 'Face Recon', usage: 18 },
]

const USER_ROLES = [
  { name: 'Law Enforcement', value: 4, color: '#0ea5e9' },
  { name: 'Student', value: 2, color: '#8b5cf6' },
  { name: 'Admin', value: 1, color: '#ef4444' },
]

const CREDIT_TREND = [
  { month: 'Jan', issued: 1000, used: 750 },
  { month: 'Feb', issued: 1200, used: 900 },
  { month: 'Mar', issued: 800, used: 650 },
  { month: 'Apr', issued: 1500, used: 1200 },
  { month: 'May', issued: 1100, used: 850 },
  { month: 'Jun', issued: 1300, used: 1100 },
  { month: 'Jul', issued: 900, used: 700 },
]

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: '0.78rem', color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [range, setRange] = useState('week')
  const [isMobile, setIsMobile] = useState(false)
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0' }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Analytics</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Deep drilldown and platform events</p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['week', 'month', 'year'].map(r => (
                <button key={r} onClick={() => setRange(r)} style={{
                  padding: '7px 12px', borderRadius: '6px', border: '1px solid',
                  borderColor: range === r ? '#0ea5e9' : '#e2e8f0',
                  background: range === r ? '#e0f2fe' : '#ffffff',
                  color: range === r ? '#0284c7' : '#64748b',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                }}>{r}</button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Searches', value: '115', change: '+12%', icon: Search, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Active Users', value: '6', change: '+2', icon: Users, color: '#10b981', bg: '#d1fae5' },
              { label: 'Credits Used', value: '1,725', change: '-8%', icon: Zap, color: '#d97706', bg: '#fef3c7' },
              { label: 'API Calls', value: '238', change: '+24%', icon: Activity, color: '#8b5cf6', bg: '#ede9fe' },
            ].map((stat) => {
              const Icon = stat.icon
              const isPositive = stat.change.startsWith('+')
              return (
                <div key={stat.label} className="cr-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                    <div style={{ width: '32px', height: '32px', background: stat.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={stat.color} />
                    </div>
                  </div>
                  <p className="stat-number" style={{ fontSize: '1.75rem' }}>{stat.value}</p>
                  <p style={{ fontSize: '0.72rem', color: isPositive ? '#059669' : '#dc2626', fontWeight: 600, marginTop: '4px' }}>{stat.change} vs last {range}</p>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="cr-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Daily Searches & Credits</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>Search volume this week</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={DAILY_SEARCHES} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Bar dataKey="searches" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Searches" />
                  <Bar dataKey="credits" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Credits" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="cr-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Users by Role</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>Distribution</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={USER_ROLES} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {USER_ROLES.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {USER_ROLES.map((r) => (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, display: 'inline-block' }} />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            <div className="cr-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Credit Trend</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>Issued vs used per month</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={CREDIT_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Line type="monotone" dataKey="issued" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Issued" />
                  <Line type="monotone" dataKey="used" stroke="#f59e0b" strokeWidth={2} dot={false} name="Used" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="cr-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Top Tools Used</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>Most frequently launched</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TOOL_USAGE.map((tool, i) => {
                  const pct = Math.round((tool.usage / TOOL_USAGE[0].usage) * 100)
                  return (
                    <div key={tool.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 500 }}>{tool.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{tool.usage}</span>
                      </div>
                      <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? '#0ea5e9' : i === 1 ? '#8b5cf6' : '#10b981', borderRadius: '3px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}