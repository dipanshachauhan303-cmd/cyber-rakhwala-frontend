import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield, Eye, EyeOff, ArrowRight,
  User, Mail, Phone, Star, MapPin,
  Building2, Lock, CheckCircle
} from 'lucide-react'

const RANKS = [
  'Constable', 'Head Constable', 'Assistant Sub-Inspector (ASI)',
  'Sub-Inspector (SI)', 'Inspector', 'Deputy Superintendent (DSP)',
  'Superintendent of Police (SP)', 'Senior SP', 'DIG', 'IG', 'ADG', 'DGP', 'Other'
]

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'CBI', 'CID', 'Central Forces', 'Other'
]

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [idFile, setIdFile] = useState(null)
  const [form, setForm] = useState({
    username: '', fullName: '', email: '', contact: '',
    rank: '', cadre: '', policeStation: '',
    password: '', confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return }
    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
      setError('Only PDF or Image files allowed'); return
    }
    setIdFile(file)
    setError('')
  }

  const validateStep1 = () => {
    if (!form.username.trim()) return 'Username is required'
    if (form.username.length < 3) return 'Username must be at least 3 characters'
    if (!form.fullName.trim()) return 'Full name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email address'
    if (!form.contact.trim()) return 'Contact number is required'
    return null
  }

  const validateStep2 = () => {
    if (!form.rank) return 'Rank is required'
    if (!form.cadre) return 'Cadre/State is required'
    if (!form.policeStation.trim()) return 'Police Station is required'
    return null
  }

  const validateStep3 = () => {
    if (!form.password) return 'Password is required'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleNext = () => {
    const err = step === 1 ? validateStep1() : validateStep2()
    if (err) { setError(err); return }
    setError('')
    setStep(step + 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validateStep3()
    if (err) { setError(err); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true) }, 1500)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ width: '72px', height: '72px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={36} color="#059669" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>Registration Submitted</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Your registration has been submitted for verification. You will receive an email once your account is approved by the admin.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '12px 28px' }}>
            Go to Login <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex' }}>

      {/* Left panel */}
      <div style={{ width: '360px', background: '#0f172a', padding: '40px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} color="#ffffff" />
          </div>
          <div>
            <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em' }}>CYBER RAKHWALA</p>
            <p style={{ color: '#64748b', fontSize: '0.72rem' }}>Law Enforcement Portal</p>
          </div>
        </div>

        <div>
          <h1 style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '12px' }}>
            Law Enforcement Registration
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '28px' }}>
            Register your official account to access OSINT tools, CDR analysis, and investigation management.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { s: 1, label: 'Personal Information' },
              { s: 2, label: 'Official Details' },
              { s: 3, label: 'Security Setup' },
            ].map((item) => (
              <div key={item.s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                  background: step > item.s ? '#10b981' : step === item.s ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step > item.s
                    ? <CheckCircle size={14} color="#fff" />
                    : <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{item.s}</span>
                  }
                </div>
                <span style={{ fontSize: '0.875rem', color: step >= item.s ? '#ffffff' : '#64748b', fontWeight: step === item.s ? 600 : 400 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#475569', fontSize: '0.75rem' }}>
          All registrations are verified by admin before access is granted.
        </p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= s ? '#0ea5e9' : '#e2e8f0', transition: 'background 0.3s' }} />
            ))}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
            {step === 1 ? 'Personal Information' : step === 2 ? 'Official Details' : 'Security Setup'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '24px' }}>Step {step} of 3</p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#dc2626', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'username', label: 'USERNAME', placeholder: 'Choose a unique username', icon: User, type: 'text' },
                { name: 'fullName', label: 'FULL NAME', placeholder: "Officer's full name", icon: User, type: 'text' },
                { name: 'email', label: 'EMAIL', placeholder: 'your@email.com', icon: Mail, type: 'email' },
                { name: 'contact', label: 'CONTACT NUMBER', placeholder: '+91XXXXXXXXXX', icon: Phone, type: 'tel' },
              ].map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.name}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '0.06em' }}>{field.label}</label>
                    <div style={{ position: 'relative' }}>
                      <Icon size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="cr-input"
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>
                  </div>
                )
              })}
              <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '4px' }}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2 — Official Details */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '0.06em' }}>RANK</label>
                <div style={{ position: 'relative' }}>
                  <Star size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select name="rank" value={form.rank} onChange={handleChange} className="cr-input" style={{ paddingLeft: '36px' }}>
                    <option value="">e.g. Sub-Inspector, DSP</option>
                    {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '0.06em' }}>CADRE (STATE)</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select name="cadre" value={form.cadre} onChange={handleChange} className="cr-input" style={{ paddingLeft: '36px' }}>
                    <option value="">e.g. Maharashtra, Delhi</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '0.06em' }}>POLICE STATION</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    name="policeStation"
                    value={form.policeStation}
                    onChange={handleChange}
                    placeholder="Serving Police Station"
                    className="cr-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '0.06em' }}>UPLOAD ID CARD</label>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', background: '#f8fafc' }}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ width: '100%', fontSize: '0.85rem', color: '#64748b' }}
                  />
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                    ℹ Deleted after verification (Max 5MB. PDF/Image)
                  </p>
                </div>
                {idFile && (
                  <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> {idFile.name} selected
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '12px' }}>
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Security */}
          {step === 3 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '0.06em' }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="cr-input"
                    style={{ paddingLeft: '36px', paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '0.06em' }}>CONFIRM PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="cr-input"
                    style={{ paddingLeft: '36px', paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 14px', fontSize: '0.8rem', color: '#166534' }}>
                <p style={{ fontWeight: 700, marginBottom: '6px' }}>Before submitting:</p>
                <ul style={{ paddingLeft: '16px', lineHeight: 1.9, margin: 0 }}>
                  <li>Ensure all details match your official ID</li>
                  <li>Your ID card will be deleted after verification</li>
                  <li>Admin approval may take 24–48 hours</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="button" onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>Back</button>
                <button type="submit" disabled={loading} style={{ flex: 2, justifyContent: 'center', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? 'Submitting...' : <><span>Register</span> <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}