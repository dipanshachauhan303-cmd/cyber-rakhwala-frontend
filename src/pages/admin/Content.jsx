import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { FileText, Save, Edit2, X, Check, Plus, Trash2 } from 'lucide-react'

const INITIAL_BLOCKS = [
  { id: 1, title: 'Hero Heading', key: 'hero_heading', type: 'text', value: 'Cyber Rakhwala Intelligence Platform', page: 'Homepage' },
  { id: 2, title: 'Hero Subheading', key: 'hero_sub', type: 'text', value: 'Advanced OSINT tools for law enforcement and security professionals.', page: 'Homepage' },
  { id: 3, title: 'Login Page Notice', key: 'login_notice', type: 'text', value: 'Protected by Cyber Rakhwala Security Protocol v3.0', page: 'Login' },
  { id: 4, title: 'Maintenance Banner', key: 'maintenance_banner', type: 'text', value: '', page: 'Global' },
  { id: 5, title: 'Student Welcome Message', key: 'student_welcome', type: 'textarea', value: 'Welcome to Cyber Rakhwala Student Platform. Use your credits wisely.', page: 'Student' },
  { id: 6, title: 'Law Enforcement Notice', key: 'le_notice', type: 'textarea', value: 'All searches are logged and monitored. Use tools responsibly and within legal bounds.', page: 'Law Enforcement' },
]

const PAGE_COLORS = {
  Homepage: { bg: '#dbeafe', color: '#1d4ed8' },
  Login: { bg: '#ede9fe', color: '#7c3aed' },
  Global: { bg: '#fef3c7', color: '#d97706' },
  Student: { bg: '#d1fae5', color: '#059669' },
  'Law Enforcement': { bg: '#fee2e2', color: '#dc2626' },
}

export default function AdminContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS)
  const [editBlock, setEditBlock] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newBlock, setNewBlock] = useState({ title: '', key: '', type: 'text', value: '', page: 'Global' })
  const [filterPage, setFilterPage] = useState('All')
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

  const pages = ['All', ...Object.keys(PAGE_COLORS)]
  const filtered = blocks.filter(b => filterPage === 'All' || b.page === filterPage)

  const openEdit = (block) => { setEditBlock(block.id); setEditValue(block.value) }

  const handleSave = (id) => {
    setSaving(true)
    setTimeout(() => {
      setBlocks(blocks.map(b => b.id === id ? { ...b, value: editValue } : b))
      setEditBlock(null)
      setSaving(false)
      setSaved(id)
      setTimeout(() => setSaved(null), 2000)
    }, 600)
  }

  const handleDelete = (id) => setBlocks(blocks.filter(b => b.id !== id))

  const handleAddBlock = (e) => {
    e.preventDefault()
    setBlocks([...blocks, { id: Date.now(), ...newBlock }])
    setNewBlock({ title: '', key: '', type: 'text', value: '', page: 'Global' })
    setShowAdd(false)
  }

  const modalStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(30,58,138,0.3)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 50, padding: '16px'
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(59,130,246,0.2)',
    boxShadow: '0 20px 60px rgba(37,99,235,0.2)',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="constellation" />
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Content</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Homepage and site content blocks</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> {!isMobile && 'Add Block'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {pages.map(p => (
              <button key={p} onClick={() => setFilterPage(p)} style={{
                padding: '5px 12px', borderRadius: '6px', border: '1px solid',
                borderColor: filterPage === p ? '#2563eb' : 'rgba(59,130,246,0.15)',
                background: filterPage === p ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.7)',
                color: filterPage === p ? '#ffffff' : '#64748b',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                backdropFilter: 'blur(6px)',
              }}>{p}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((block) => {
              const pc = PAGE_COLORS[block.page] || { bg: '#f1f5f9', color: '#64748b' }
              const isEditing = editBlock === block.id
              const isSaved = saved === block.id
              return (
                <div key={block.id} className="cr-card" style={{ padding: isMobile ? '14px' : '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{block.title}</h3>
                        <span style={{ background: pc.bg, color: pc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{block.page}</span>
                        {isSaved && <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#059669', fontSize: '0.72rem', fontWeight: 600 }}><Check size={12} /> Saved!</span>}
                      </div>
                      <p style={{ fontSize: '0.68rem', color: '#93c5fd', fontFamily: 'monospace' }}>key: {block.key}</p>
                    </div>
                    {!isEditing && (
                      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                        <button onClick={() => openEdit(block)} style={{ background: 'rgba(219,234,254,0.8)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => handleDelete(block.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {block.type === 'textarea' ? (
                        <textarea value={editValue} onChange={e => setEditValue(e.target.value)} className="cr-input" rows={3} style={{ resize: 'vertical' }} autoFocus />
                      ) : (
                        <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} className="cr-input" autoFocus />
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setEditBlock(null)} className="btn-secondary" style={{ padding: '8px 14px' }}>
                          <X size={13} /> Cancel
                        </button>
                        <button onClick={() => handleSave(block.id)} disabled={saving} className="btn-primary" style={{ padding: '8px 18px' }}>
                          <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(219,234,254,0.2)', borderRadius: '6px', padding: '10px 12px', border: '1px solid rgba(59,130,246,0.1)' }}>
                      <p style={{ fontSize: '0.875rem', color: block.value ? '#1e3a8a' : '#93c5fd', fontStyle: block.value ? 'normal' : 'italic', lineHeight: 1.6 }}>
                        {block.value || '(empty — click Edit to add content)'}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="cr-card" style={{ padding: '50px', textAlign: 'center' }}>
                <FileText size={36} color="#93c5fd" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#64748b' }}>No content blocks for this page</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {showAdd && (
        <div style={modalStyle}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '440px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>Add Content Block</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddBlock} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title *</label>
                <input type="text" required value={newBlock.title} onChange={e => setNewBlock({ ...newBlock, title: e.target.value })} placeholder="e.g. Hero Heading" className="cr-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key *</label>
                <input type="text" required value={newBlock.key} onChange={e => setNewBlock({ ...newBlock, key: e.target.value.toLowerCase().replace(/\s/g, '_') })} placeholder="hero_heading" className="cr-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</label>
                  <select value={newBlock.type} onChange={e => setNewBlock({ ...newBlock, type: e.target.value })} className="cr-input">
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Page</label>
                  <select value={newBlock.page} onChange={e => setNewBlock({ ...newBlock, page: e.target.value })} className="cr-input">
                    {Object.keys(PAGE_COLORS).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Initial Value</label>
                <textarea value={newBlock.value} onChange={e => setNewBlock({ ...newBlock, value: e.target.value })} placeholder="Content..." className="cr-input" rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 18px' }}>
                  <Plus size={14} /> Add Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}