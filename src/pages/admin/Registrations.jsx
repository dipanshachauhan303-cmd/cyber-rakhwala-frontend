import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, ArrowLeft, CheckCircle, Eye, EyeOff, User, Mail, Phone, MapPin, Building, Star, Lock, FileText } from 'lucide-react'
import { api } from '../utils/api.js'

const STEPS = ['Personal Info', 'Service Details', 'Account Setup']

const RANKS = [
  'Constable', 'Head Constable', 'Assistant Sub-Inspector (ASI)',
  'Sub-Inspector (SI)', 'Inspector', 'Deputy Superintendent (DSP)',
  'Superintendent of Police (SP)', 'Senior Superintendent (SSP)',
  'Deputy Inspector General (DIG)', 'Inspector General (IG)',
  'Additional Director General (ADG)', 'Director General (DGP)',
  'Other'
]

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Other'
]

const EMPTY_FORM = {
  fullName: '', email: '', contact: '', dob: '', gender: '',
  rank: '', cadre: '', policeStation: '', badgeNumber: '', yearsOfService: '',
  username: '', password: '', confirmPassword: '', agree: false,
}

export default function Register() {
  const navigate = useNavigate()
  const bgRef = useRef(null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Background animation
  useEffect(() => {
    const canvas = bgRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.8,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      grad.addColorStop(0, '#eef2ff')
      grad.addColorStop(0.5, '#eff6ff')
      grad.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ;[
        { x: canvas.width * 0.1, y: canvas.height * 0.2, r: 200, c: 'rgba(147,197,253,0.3)' },
        { x: canvas.width * 0.9, y: canvas.height * 0.8, r: 250, c: 'rgba(96,165,250,0.2)' },
      ].forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, o.c); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(59,130,246,${0.18 * (1 - dist / 120)})`
            ctx.lineWidth = 0.7; ctx.stroke()
          }
        }
        const p = pts[i]
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        g.addColorStop(0, 'rgba(37,99,235,0.8)'); g.addColorStop(1, 'rgba(37,99,235,0)')
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(59,130,246,0.9)'; ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })) }

  const validateStep = (s) => {
    const errs = {}
    if (s === 0) {
      if (!form.fullName.trim()) errs.fullName = 'Full name is required'
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
      if (!form.contact.trim() || form.contact.length < 10) errs.contact = 'Valid 10-digit number required'
      if (!form.dob) errs.dob = 'Date of birth required'
      if (!form.gender) errs.gender = 'Gender required'
    }
    if (s === 1) {
      if (!form.rank) errs.rank = 'Rank is required'
      if (!form.cadre) errs.cadre = 'State/Cadre is required'
      if (!form.policeStation.trim()) errs.policeStation = 'Police station required'
      if (!form.badgeNumber.trim()) errs.badgeNumber = 'Badge/ID number required'
    }
    if (s === 2) {
      if (!form.username.trim() || form.username.length < 4) errs.username = 'Username min 4 characters'
      if (!form.password || form.password.length < 6) errs.password = 'Password min 6 characters'
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
      if (!form.agree) errs.agree = 'You must agree to terms'
    }
    return errs
  }

  const next = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStep(s => s + 1)
  }

  const prev = () => setStep(s => s - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateStep(2)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await api.post('/api/auth/register', {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: 'law-enforcement',
        contact: form.contact,
        dob: form.dob,
        gender: form.gender,
        rank: form.rank,
        cadre: form.cadre,
        policeStation: form.policeStation,
        badgeNumber: form.badgeNumber,
        yearsOfService: form.yearsOfService,
        username: form.username,
      })
      setSubmitted(true)
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = (key) => ({
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1px solid ${errors[key] ? '#fca5a5' : 'rgba(59,130,246,0.2)'}`,
    fontSize: '0.875rem', background: errors[key] ? '#fff5f5' : 'rgba(255,255,255,0.85)',
    color: '#1e3a8a', outline: 'none', fontFamily: 'Inter, sans-serif',
    backdropFilter: 'blur(6px)', boxSizing: 'border-box',
  })

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a',
    marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  const errStyle = { fontSize: '0.72rem', color: '#dc2626', marginTop: '3px' }

  // Success screen
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <canvas ref={bgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: isMobile ? '32px 24px' : '48px', border: '1px solid rgba(59,130,246,0.15)', boxShadow: '0 8px 40px rgba(37,99,235,0.12)', maxWidth: '420px' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(59,130,246,0.2)' }}>
              <CheckCircle size={32} color="#2563eb" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '10px' }}>Registration Submitted!</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Your registration request has been submitted successfully. Our admin team will review your credentials and approve your account within 24-48 hours.
            </p>
            <div style={{ background: 'rgba(219,234,254,0.4)', borderRadius: '10px', padding: '14px', marginBottom: '20px', border: '1px solid rgba(59,130,246,0.1)' }}>
              <p style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>Registered as: {form.fullName}</p>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>{form.email}</p>
            </div>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Back to Login <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={bgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
              <Shield size={22} color="#ffffff" />
            </div>
            <div>
              <p style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.95rem', letterSpacing: '0.1em' }}>CYBER RAKHWALA</p>
              <p style={{ color: '#93c5fd', fontSize: '0.7rem', letterSpacing: '0.06em' }}>Law Enforcement Registration</p>
            </div>
          </div>

          {/* Step progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '24px' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem',
                    background: i < step ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : i === step ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.8)',
                    color: i <= step ? '#ffffff' : '#93c5fd',
                    border: i <= step ? 'none' : '1px solid rgba(59,130,246,0.2)',
                    boxShadow: i <= step ? '0 2px 10px rgba(37,99,235,0.3)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {i < step ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  {!isMobile && <span style={{ fontSize: '0.65rem', color: i <= step ? '#2563eb' : '#93c5fd', fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: isMobile ? '40px' : '60px', height: '2px', background: i < step ? 'linear-gradient(90deg, #2563eb, #0ea5e9)' : 'rgba(59,130,246,0.15)', margin: isMobile ? '0 6px 18px' : '0 8px 22px', transition: 'all 0.3s ease' }} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.15)', boxShadow: '0 8px 40px rgba(37,99,235,0.12)', overflow: 'hidden' }}>

            {/* Card header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(59,130,246,0.08)', background: 'rgba(219,234,254,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step === 0 ? <User size={16} color="#fff" /> : step === 1 ? <Building size={16} color="#fff" /> : <Lock size={16} color="#fff" />}
                </div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>
                    {step === 0 ? 'Personal Information' : step === 1 ? 'Service Details' : 'Account Setup'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Step {step + 1} of {STEPS.length}</p>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '20px 24px' }}>

              {/* Step 0 — Personal Info */}
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                    <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                      <label style={labelStyle}>Full Name *</label>
                      <div style={{ position: 'relative' }}>
                        <User size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="As per official ID" style={{ ...fieldStyle('fullName'), paddingLeft: '32px' }} />
                      </div>
                      {errors.fullName && <p style={errStyle}>{errors.fullName}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="official@gov.in" style={{ ...fieldStyle('email'), paddingLeft: '32px' }} />
                      </div>
                      {errors.email && <p style={errStyle}>{errors.email}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Contact Number *</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="tel" value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="+91 XXXXXXXXXX" style={{ ...fieldStyle('contact'), paddingLeft: '32px' }} maxLength={13} />
                      </div>
                      {errors.contact && <p style={errStyle}>{errors.contact}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Date of Birth *</label>
                      <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} style={fieldStyle('dob')} />
                      {errors.dob && <p style={errStyle}>{errors.dob}</p>}
                    </div>
                    <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                      <label style={labelStyle}>Gender *</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {['Male', 'Female', 'Other'].map(g => (
                          <button key={g} type="button" onClick={() => set('gender', g)} style={{
                            flex: 1, padding: '9px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                            border: `1px solid ${form.gender === g ? '#2563eb' : 'rgba(59,130,246,0.2)'}`,
                            background: form.gender === g ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.7)',
                            color: form.gender === g ? '#fff' : '#64748b',
                            transition: 'all 0.2s ease',
                          }}>{g}</button>
                        ))}
                      </div>
                      {errors.gender && <p style={errStyle}>{errors.gender}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 — Service Details */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>Rank / Designation *</label>
                      <div style={{ position: 'relative' }}>
                        <Star size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                        <select value={form.rank} onChange={e => set('rank', e.target.value)} style={{ ...fieldStyle('rank'), paddingLeft: '32px', appearance: 'none' }}>
                          <option value="">Select rank</option>
                          {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      {errors.rank && <p style={errStyle}>{errors.rank}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>State / Cadre *</label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                        <select value={form.cadre} onChange={e => set('cadre', e.target.value)} style={{ ...fieldStyle('cadre'), paddingLeft: '32px', appearance: 'none' }}>
                          <option value="">Select state</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      {errors.cadre && <p style={errStyle}>{errors.cadre}</p>}
                    </div>
                    <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                      <label style={labelStyle}>Police Station / Department *</label>
                      <div style={{ position: 'relative' }}>
                        <Building size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" value={form.policeStation} onChange={e => set('policeStation', e.target.value)} placeholder="e.g. Bhopal Central Police Station" style={{ ...fieldStyle('policeStation'), paddingLeft: '32px' }} />
                      </div>
                      {errors.policeStation && <p style={errStyle}>{errors.policeStation}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Badge / ID Number *</label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" value={form.badgeNumber} onChange={e => set('badgeNumber', e.target.value)} placeholder="Official badge number" style={{ ...fieldStyle('badgeNumber'), paddingLeft: '32px' }} />
                      </div>
                      {errors.badgeNumber && <p style={errStyle}>{errors.badgeNumber}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Years of Service</label>
                      <input type="number" min="0" max="40" value={form.yearsOfService} onChange={e => set('yearsOfService', e.target.value)} placeholder="e.g. 5" style={fieldStyle('yearsOfService')} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — Account Setup */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Username *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" value={form.username} onChange={e => set('username', e.target.value.toLowerCase().replace(/\s/g, '_'))} placeholder="officer_username" style={{ ...fieldStyle('username'), paddingLeft: '32px', fontFamily: 'JetBrains Mono, monospace' }} />
                    </div>
                    {errors.username && <p style={errStyle}>{errors.username}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" style={{ ...fieldStyle('password'), paddingLeft: '32px', paddingRight: '36px' }} />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.password && <p style={errStyle}>{errors.password}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={14} color="#93c5fd" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password" style={{ ...fieldStyle('confirmPassword'), paddingLeft: '32px', paddingRight: '36px' }} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}>
                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword}</p>}
                  </div>

                  {/* Summary */}
                  <div style={{ background: 'rgba(219,234,254,0.3)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(59,130,246,0.12)' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Registration Summary</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        ['Name', form.fullName],
                        ['Email', form.email],
                        ['Rank', form.rank],
                        ['Cadre', form.cadre],
                        ['Station', form.policeStation],
                        ['Badge', form.badgeNumber],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p style={{ fontSize: '0.65rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
                          <p style={{ fontSize: '0.78rem', color: '#1e3a8a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val || '—'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agree */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.agree} onChange={e => set('agree', e.target.checked)} style={{ marginTop: '2px', accentColor: '#2563eb' }} />
                    <span style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                      I declare that the information provided is accurate and I am an authorized law enforcement officer. I agree to use this platform within legal bounds.
                    </span>
                  </label>
                  {errors.agree && <p style={errStyle}>{errors.agree}</p>}
                  {errors.submit && (
                    <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#dc2626' }}>
                      ⚠ {errors.submit}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(59,130,246,0.08)', display: 'flex', gap: '10px', justifyContent: 'space-between', background: 'rgba(219,234,254,0.1)' }}>
              <div>
                {step > 0 && (
                  <button type="button" onClick={prev} className="btn-secondary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
              </div>
              <div>
                {step < 2 ? (
                  <button type="button" onClick={next} className="btn-primary" style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary" style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {submitting ? 'Submitting...' : <><CheckCircle size={14} /> Submit Registration</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#64748b' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}