import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import { CreditCard, Plus, Edit2, Trash2, X, Save, Zap, Check, AlertTriangle } from 'lucide-react'

const INITIAL_PLANS = [
  { id: 1, name: 'Student', credits: 100, price: 0, duration: 'monthly', features: ['21 tools', 'Basic OSINT', 'Field Access (1.5x cost)'], color: '#8b5cf6', active: true },
  { id: 2, name: 'Law Enforcement', credits: 250, price: 999, duration: 'monthly', features: ['All 21 tools', 'Priority access', 'Case management', 'CDR & IPDR'], color: '#0ea5e9', active: true },
  { id: 3, name: 'Professional', credits: 1000, price: 2999, duration: 'monthly', features: ['All tools', 'Bulk operations', 'API access', 'Dedicated support'], color: '#10b981', active: true },
  { id: 4, name: 'Enterprise', credits: 5000, price: 9999, duration: 'monthly', features: ['Unlimited tools', 'Custom integrations', 'SLA guarantee', 'On-premise option'], color: '#f97316', active: false },
]

const EMPTY_FORM = { name: '', credits: 250, price: 999, duration: 'monthly', features: '', active: true }

export default function AdminPlans() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [plans, setPlans] = useState(INITIAL_PLANS)
  const [showModal, setShowModal] = useState(false)
  const [editPlan, setEditPlan] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
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

  const openCreate = () => { setEditPlan(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (plan) => { setEditPlan(plan); setForm({ ...plan, features: plan.features.join(', ') }); setShowModal(true) }

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const planData = {
        ...form,
        credits: Number(form.credits),
        price: Number(form.price),
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        color: editPlan?.color || '#0ea5e9',
      }
      if (editPlan) {
        setPlans(plans.map(p => p.id === editPlan.id ? { ...p, ...planData } : p))
      } else {
        setPlans([...plans, { id: Date.now(), ...planData }])
      }
      setShowModal(false)
      setSaving(false)
    }, 700)
  }

  const handleDelete = (id) => { setPlans(plans.filter(p => p.id !== id)); setDeleteConfirm(null) }
  const toggleActive = (id) => setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role="admin" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0' }}>
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Plans</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Credits and subscription management</p>
            </div>
            <button onClick={openCreate} className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> {!isMobile && 'Add Plan'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
            {plans.map((plan) => (
              <div key={plan.id} className="cr-card" style={{ padding: '20px', borderTop: `3px solid ${plan.color}`, opacity: plan.active ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{plan.name}</h3>
                      <span style={{ background: plan.active ? '#d1fae5' : '#f1f5f9', color: plan.active ? '#059669' : '#94a3b8', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>
                        {plan.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color: plan.color }}>
                      {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                      {plan.price > 0 && <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 400 }}>/{plan.duration}</span>}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '6px 10px' }}>
                    <Zap size={13} color="#d97706" />
                    <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.875rem' }}>{plan.credits}</span>
                  </div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                      <Check size={12} color={plan.color} /> {f}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <button onClick={() => openEdit(plan)} className="btn-secondary" style={{ padding: '6px 12px', flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => toggleActive(plan.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', flex: 1 }}>
                    {plan.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => setDeleteConfirm(plan.id)} style={{ padding: '6px 10px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '460px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{editPlan ? 'Edit Plan' : 'Create Plan'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Plan Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Professional" className="cr-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Credits</label>
                  <input type="number" min="0" required value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} className="cr-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Price (₹)</label>
                  <input type="number" min="0" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="cr-input" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Duration</label>
                <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="cr-input">
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Features (comma separated)</label>
                <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="All tools, Priority access" className="cr-input" rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 18px' }}>
                  <Save size={14} /> {saving ? 'Saving...' : editPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '340px', padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={22} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Delete Plan?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '18px' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}