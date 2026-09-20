import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { FileText, Download, Shield, Phone, CreditCard, Car, Building, Wifi, User, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import jsPDF from 'jspdf'

const EMPTY_REPORT = {
  target: '',
  generated_by: '',
  subject: { full_name: '', name_variants: '', state: '', address: '' },
  contact: { primary_mobile: '', additional_numbers: '', telecom_operator: '', activity_status: '', email: '' },
  banking: { linked_name: '', account_number: '', bank: '', account_type: '', ifsc: '', branch: '', district: '', state: '' },
  digital_payment: { upi_id: '', imps: '', neft: '', rtgs: '', upi_status: '' },
  vehicle: { rc_number: '', registration_date: '', rto: '', manufacturer: '', model: '', vehicle_type: '', fuel_type: '', color: '', chassis: '', engine: '', insurance: '', owner_name: '', address: '' },
  business: { name: '', type: '', role: '', address: '' },
  digital_footprint: { caller_name: '', carrier: '', region: '', last_seen: '', google_profile: '', platforms: '', services: '' },
  correlation: { central_id: '', linked_systems: '', observations: '' },
  assessment: { summary: '', key_observations: '' },
}

export default function ReportGenerator() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [report, setReport] = useState(EMPTY_REPORT)
  const [expanded, setExpanded] = useState({ subject: true })
  const [generating, setGenerating] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cr_user')
    if (!stored) { navigate('/login'); return }
    setUser(JSON.parse(stored))
    const fn = () => setIsMobile(window.innerWidth <= 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [navigate])

  const updateField = (section, field, value) => {
    setReport(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const toggleSection = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const generatePDF = () => {
    setGenerating(true)
    setTimeout(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W = 210
      const margin = 15
      let y = 0

      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, W, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('CYBER RAKHWALA', margin, 16)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('OSINT INTELLIGENCE PROFILE REPORT', margin, 24)
      doc.setFontSize(9)
      doc.text(`Target: ${report.target || 'N/A'}`, margin, 32)
      doc.text(`Generated: ${new Date().toLocaleString()}`, W - margin - 60, 32)
      y = 48

      doc.setFillColor(254, 243, 199)
      doc.rect(margin, y, W - margin * 2, 10, 'F')
      doc.setTextColor(146, 64, 14)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('FOR LAWFUL INTELLIGENCE AND INVESTIGATIVE PURPOSES ONLY — LAW ENFORCEMENT USE', margin + 3, y + 6.5)
      y += 16

      const addSection = (title, emoji, fields) => {
        if (y > 260) { doc.addPage(); y = 15 }
        doc.setFillColor(239, 246, 255)
        doc.rect(margin, y, W - margin * 2, 8, 'F')
        doc.setTextColor(30, 58, 138)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${emoji} ${title}`, margin + 3, y + 5.5)
        y += 12

        fields.forEach(([label, value]) => {
          if (!value) return
          if (y > 275) { doc.addPage(); y = 15 }
          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(100, 116, 139)
          doc.text(`${label}:`, margin + 3, y)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(15, 23, 42)
          const lines = doc.splitTextToSize(value, W - margin * 2 - 50)
          doc.text(lines, margin + 45, y)
          y += lines.length * 5 + 2
        })
        y += 4
      }

      addSection('Subject Identification', '👤', [
        ['Full Name', report.subject.full_name],
        ['Name Variants', report.subject.name_variants],
        ['State', report.subject.state],
        ['Address', report.subject.address],
      ])
      addSection('Contact Information', '📱', [
        ['Primary Mobile', report.contact.primary_mobile],
        ['Additional Numbers', report.contact.additional_numbers],
        ['Telecom Operator', report.contact.telecom_operator],
        ['Activity Status', report.contact.activity_status],
        ['Email', report.contact.email],
      ])
      addSection('Banking & Financial Details', '🏦', [
        ['Linked Name', report.banking.linked_name],
        ['Account Number', report.banking.account_number],
        ['Bank', report.banking.bank],
        ['Account Type', report.banking.account_type],
        ['IFSC Code', report.banking.ifsc],
        ['Branch', report.banking.branch],
        ['District', report.banking.district],
        ['State', report.banking.state],
      ])
      addSection('Digital Payment Details', '💳', [
        ['UPI ID', report.digital_payment.upi_id],
        ['IMPS', report.digital_payment.imps],
        ['NEFT', report.digital_payment.neft],
        ['RTGS', report.digital_payment.rtgs],
        ['UPI Status', report.digital_payment.upi_status],
      ])
      addSection('Vehicle Details', '🚗', [
        ['RC Number', report.vehicle.rc_number],
        ['Registration Date', report.vehicle.registration_date],
        ['RTO', report.vehicle.rto],
        ['Manufacturer', report.vehicle.manufacturer],
        ['Model', report.vehicle.model],
        ['Vehicle Type', report.vehicle.vehicle_type],
        ['Fuel Type', report.vehicle.fuel_type],
        ['Color', report.vehicle.color],
        ['Chassis Number', report.vehicle.chassis],
        ['Engine Number', report.vehicle.engine],
        ['Insurance', report.vehicle.insurance],
        ['Owner Name', report.vehicle.owner_name],
        ['Address', report.vehicle.address],
      ])
      addSection('Business Intelligence', '🏪', [
        ['Business Name', report.business.name],
        ['Business Type', report.business.type],
        ['Role', report.business.role],
        ['Address', report.business.address],
      ])
      addSection('Digital Footprint', '🌐', [
        ['Caller Name', report.digital_footprint.caller_name],
        ['Carrier', report.digital_footprint.carrier],
        ['Region', report.digital_footprint.region],
        ['Last Seen', report.digital_footprint.last_seen],
        ['Google Profile', report.digital_footprint.google_profile],
        ['Platforms', report.digital_footprint.platforms],
        ['Active Services', report.digital_footprint.services],
      ])
      addSection('Data Correlation', '🧩', [
        ['Central Identifier', report.correlation.central_id],
        ['Linked Systems', report.correlation.linked_systems],
        ['Key Observations', report.correlation.observations],
      ])
      addSection('Overall Assessment', '🧠', [
        ['Summary', report.assessment.summary],
        ['Key Observations', report.assessment.key_observations],
      ])

      if (y > 240) { doc.addPage(); y = 15 }
      y += 4
      doc.setFillColor(239, 246, 255)
      doc.rect(margin, y, W - margin * 2, 30, 'F')
      doc.setDrawColor(219, 234, 254)
      doc.rect(margin, y, W - margin * 2, 30)
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('DISCLAIMER', margin + 3, y + 6)
      doc.setFont('helvetica', 'normal')
      const disclaimer = 'This report is prepared strictly for lawful intelligence and investigative purposes. All information has been compiled from available intelligence sources. This document is intended solely for use by law enforcement agencies and authorized personnel. The compiler does not guarantee absolute accuracy and shall not be held liable for any misuse or unauthorized application of the data.'
      const dLines = doc.splitTextToSize(disclaimer, W - margin * 2 - 6)
      doc.text(dLines, margin + 3, y + 12)

      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFillColor(15, 23, 42)
        doc.rect(0, 287, W, 10, 'F')
        doc.setTextColor(148, 163, 184)
        doc.setFontSize(7)
        doc.text('CYBER RAKHWALA — CONFIDENTIAL INTELLIGENCE REPORT', margin, 293)
        doc.text(`Page ${i} of ${pageCount}`, W - margin - 20, 293)
      }

      doc.save(`CR_Report_${report.target || 'target'}_${Date.now()}.pdf`)
      setGenerating(false)
    }, 1000)
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.85rem',
    background: 'rgba(255,255,255,0.8)', color: '#1e3a8a', outline: 'none',
    fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(6px)',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 700,
    color: '#2563eb', marginBottom: '4px',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  const renderFields = (sectionKey, fields) => (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', padding: '16px' }}>
      {fields.map(([field, label, multiline]) => (
        <div key={field} style={{ gridColumn: multiline ? '1 / -1' : 'auto' }}>
          <label style={labelStyle}>{label}</label>
          {multiline ? (
            <textarea value={report[sectionKey][field]} onChange={e => updateField(sectionKey, field, e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder={`Enter ${label.toLowerCase()}...`} />
          ) : (
            <input type="text" value={report[sectionKey][field]} onChange={e => updateField(sectionKey, field, e.target.value)} style={inputStyle} placeholder={`Enter ${label.toLowerCase()}...`} />
          )}
        </div>
      ))}
    </div>
  )

  const SECTIONS = [
    { key: 'subject', label: '👤 Subject Identification', fields: [['full_name', 'Full Name', false], ['name_variants', 'Name Variants', false], ['state', 'State', false], ['address', 'Address', true]] },
    { key: 'contact', label: '📱 Contact Information', fields: [['primary_mobile', 'Primary Mobile', false], ['additional_numbers', 'Additional Numbers', false], ['telecom_operator', 'Telecom Operator', false], ['activity_status', 'Activity Status', false], ['email', 'Email Address', false]] },
    { key: 'banking', label: '🏦 Banking & Financial Details', fields: [['linked_name', 'Linked Name / Entity', false], ['account_number', 'Account Number', false], ['bank', 'Bank Name', false], ['account_type', 'Account Type', false], ['ifsc', 'IFSC Code', false], ['branch', 'Branch', false], ['district', 'District', false], ['state', 'State', false]] },
    { key: 'digital_payment', label: '💳 Digital Payment Details', fields: [['upi_id', 'UPI ID', false], ['imps', 'IMPS', false], ['neft', 'NEFT', false], ['rtgs', 'RTGS', false], ['upi_status', 'UPI Status', false]] },
    { key: 'vehicle', label: '🚗 Vehicle Details', fields: [['rc_number', 'RC Number', false], ['registration_date', 'Registration Date', false], ['rto', 'RTO Authority', false], ['manufacturer', 'Manufacturer', false], ['model', 'Model', false], ['vehicle_type', 'Vehicle Type', false], ['fuel_type', 'Fuel Type', false], ['color', 'Color', false], ['chassis', 'Chassis Number', false], ['engine', 'Engine Number', false], ['insurance', 'Insurance Company', false], ['owner_name', 'Owner Name', false], ['address', 'Registered Address', true]] },
    { key: 'business', label: '🏪 Business Intelligence', fields: [['name', 'Business Name', false], ['type', 'Business Type', false], ['role', 'Role / Inference', false], ['address', 'Business Address', true]] },
    { key: 'digital_footprint', label: '🌐 Digital Footprint', fields: [['caller_name', 'Caller ID Name', false], ['carrier', 'Carrier', false], ['region', 'Region', false], ['last_seen', 'Last Seen', false], ['google_profile', 'Google Profile Link', false], ['platforms', 'Account Presence', false], ['services', 'Active Services', false]] },
    { key: 'correlation', label: '🧩 Data Correlation', fields: [['central_id', 'Central Linking Identifier', false], ['linked_systems', 'Linked Systems', false], ['observations', 'Key Observations', true]] },
    { key: 'assessment', label: '🧠 Overall Assessment', fields: [['summary', 'Summary', true], ['key_observations', 'Key Observations', true]] },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="dna" />
      <Sidebar role="law-enforcement" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={{ ...user, credits: 250 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Report Generator</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Generate EVIDENTIX-style OSINT intelligence reports</p>
            </div>
            <button onClick={generatePDF} disabled={generating} className="btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} />
              {generating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>

          {/* Target info */}
          <div className="cr-card" style={{ padding: isMobile ? '16px' : '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '14px' }}>Report Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Target (Phone/Name/ID)</label>
                <input type="text" value={report.target} onChange={e => setReport({ ...report, target: e.target.value })} style={inputStyle} placeholder="e.g. 9890880777" />
              </div>
              <div>
                <label style={labelStyle}>Generated By</label>
                <input type="text" value={report.generated_by} onChange={e => setReport({ ...report, generated_by: e.target.value })} style={inputStyle} placeholder="Officer name / ID" />
              </div>
            </div>
          </div>

          {/* Sections */}
          {SECTIONS.map((section) => (
            <div key={section.key} className="cr-card" style={{ marginBottom: '12px', overflow: 'hidden' }}>
              <button onClick={() => toggleSection(section.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: expanded[section.key] ? '1px solid rgba(59,130,246,0.1)' : 'none' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e3a8a' }}>{section.label}</span>
                {expanded[section.key] ? <ChevronUp size={16} color="#93c5fd" /> : <ChevronDown size={16} color="#93c5fd" />}
              </button>
              {expanded[section.key] && renderFields(section.key, section.fields)}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setReport(EMPTY_REPORT)} className="btn-secondary" style={{ padding: '10px 20px' }}>
              Clear All
            </button>
            <button onClick={generatePDF} disabled={generating} className="btn-primary" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} />
              {generating ? 'Generating PDF...' : 'Download PDF Report'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}