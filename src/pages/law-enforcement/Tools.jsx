import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar.jsx'
import Topbar from '../../components/shared/Topbar.jsx'
import AnimatedBg from '../../components/shared/AnimatedBg.jsx'
import { getToolReport } from '../../data/toolReports.js'
import {
  Phone, Users, Activity, Car, CreditCard, Shield,
  Search, Globe, Mail, Hash, Image, Link, MapPin,
  Database, Wifi, MessageCircle, Zap, X, ArrowUpRight,
  Radio, BarChart2, FileText, Building, Download,
  ChevronDown, ChevronUp
} from 'lucide-react'
import jsPDF from 'jspdf'

const ICON_MAP = {
  Phone, Users, Activity, Car, CreditCard, Shield,
  Search, Globe, Mail, Hash, Image, Link, MapPin,
  Database, Wifi, MessageCircle, Zap, Radio, BarChart2,
  FileText, Building, Download, Building2: Building,
  User: Users, Settings: Search, ClipboardList: FileText,
  Smartphone: Phone, ArrowLeftRight: ArrowUpRight,
  Monitor: Database, Server: Database, Unlock: Shield,
  AlertTriangle: Shield, CheckCircle: Shield,
  Brain: Search, BarChart2, Activity,
}

const CATEGORIES = [
  'All', 'OSINT', 'Telecom', 'Financial', 'Identity',
  'Forensics', 'Network', 'Biometric', 'Records',
  'Communication', 'Geospatial', 'Business', 'Utility', 'DigiLocker'
]

const TOOLS = [
  { id: 'phone-lookup', icon: Phone, label: 'Phone Lookup', desc: 'Phone number intelligence', credits: 14, category: 'OSINT', color: '#2563eb' },
  { id: 'face-recognition', icon: Users, label: 'Face Recognition', desc: 'Facial analysis & matching', credits: 25, category: 'Biometric', color: '#8b5cf6' },
  { id: 'cdr-analysis', icon: Activity, label: 'CDR Analysis', desc: 'Call Detail Records analysis', credits: 25, category: 'Telecom', color: '#8b5cf6' },
  { id: 'vehicle-info', icon: Car, label: 'Vehicle Info', desc: 'RTO database lookup', credits: 15, category: 'Records', color: '#f97316' },
  { id: 'upi-lookup', icon: CreditCard, label: 'UPI Lookup', desc: 'NPCI/UPI ID lookup', credits: 18, category: 'Financial', color: '#0ea5e9' },
  { id: 'aadhaar-info', icon: Shield, label: 'Aadhaar Info', desc: 'UIDAI database lookup', credits: 30, category: 'Identity', color: '#ec4899' },
  { id: 'pan-lookup', icon: CreditCard, label: 'PAN Lookup', desc: 'Income Tax database', credits: 18, category: 'Financial', color: '#10b981' },
  { id: 'ipdr-analysis', icon: Activity, label: 'IPDR Analysis', desc: 'IP Detail Records analysis', credits: 25, category: 'Telecom', color: '#8b5cf6' },
  { id: 'person-location', icon: MapPin, label: 'Person Location', desc: 'Name/Area/City lookup', credits: 20, category: 'Records', color: '#f97316' },
  { id: 'breach-database', icon: Database, label: 'Breach Database', desc: 'Check data breaches', credits: 30, category: 'Network', color: '#ef4444' },
  { id: 'ip-intelligence', icon: Wifi, label: 'IP Intelligence', desc: 'Trace and analyze IP', credits: 10, category: 'Network', color: '#0ea5e9' },
  { id: 'domain-analysis', icon: Globe, label: 'Domain Analysis', desc: 'Investigate domain info', credits: 8, category: 'OSINT', color: '#10b981' },
  { id: 'email-forensics', icon: Mail, label: 'Email Forensics', desc: 'Analyze email headers', credits: 12, category: 'Forensics', color: '#10b981' },
  { id: 'social-profiler', icon: Search, label: 'Social Profiler', desc: 'Social media recon', credits: 16, category: 'OSINT', color: '#ec4899' },
  { id: 'hash-analyzer', icon: Hash, label: 'Hash Analyzer', desc: 'Verify file integrity', credits: 6, category: 'Forensics', color: '#64748b' },
  { id: 'image-exif', icon: Image, label: 'Image EXIF', desc: 'Extract image metadata', credits: 15, category: 'Forensics', color: '#f97316' },
  { id: 'url-scanner', icon: Link, label: 'URL Scanner', desc: 'Scan URLs for threats', credits: 10, category: 'Network', color: '#ef4444' },
  { id: 'geolocation', icon: MapPin, label: 'Geolocation', desc: 'Geographic intelligence', credits: 12, category: 'OSINT', color: '#10b981' },
  { id: 'dns-records', icon: Globe, label: 'DNS Records', desc: 'Query DNS records', credits: 8, category: 'Network', color: '#0ea5e9' },
  { id: 'data-mining', icon: Database, label: 'Data Mining', desc: 'Advanced data extraction', credits: 18, category: 'OSINT', color: '#8b5cf6' },
  { id: 'whatsapp-trace', icon: MessageCircle, label: 'WhatsApp Trace', desc: 'Trace WhatsApp IPs', credits: 20, category: 'Communication', color: '#10b981' },
  { id: 'sdr', icon: Radio, label: 'SDR', desc: 'Software Defined Radio', credits: 20, category: 'Telecom', color: '#8b5cf6' },
  { id: 'vehicle-search', icon: Car, label: 'Vehicle Search', desc: 'Advanced vehicle search', credits: 18, category: 'Records', color: '#f97316' },
  { id: 'csr-analysis', icon: BarChart2, label: 'CSR Analysis', desc: 'Call Summary Records', credits: 22, category: 'Telecom', color: '#8b5cf6' },
  { id: 'tower-dump', icon: Radio, label: 'Tower Dump Analysis', desc: 'Cell tower data analysis', credits: 35, category: 'Telecom', color: '#ef4444' },
  { id: 'cell-id', icon: MapPin, label: 'Cell ID Location', desc: 'Cell tower ID mapping', credits: 25, category: 'Geospatial', color: '#10b981' },
  { id: 'ip-tracker', icon: Wifi, label: 'IP Tracker', desc: 'Real-time IP tracking', credits: 15, category: 'Network', color: '#0ea5e9' },
  { id: 'num-upi', icon: CreditCard, label: 'Number to UPI', desc: 'Find UPI IDs by number', credits: 20, category: 'Financial', color: '#10b981' },
  { id: 'num-image', icon: Image, label: 'Number to Image', desc: 'Images by phone number', credits: 25, category: 'OSINT', color: '#ec4899' },
  { id: 'osint-tools', icon: Search, label: 'OSINT Tools', desc: 'Open source intelligence', credits: 30, category: 'OSINT', color: '#0ea5e9' },
  { id: 'aadhaar-otp', icon: Shield, label: 'Aadhaar Send OTP', desc: 'Send OTP to Aadhaar linked mobile', credits: 20, category: 'Identity', color: '#ec4899' },
  { id: 'aadhaar-submit-otp', icon: Shield, label: 'Aadhaar Submit OTP', desc: 'Verify Aadhaar via OTP', credits: 25, category: 'Identity', color: '#ec4899' },
  { id: 'pan-verify', icon: CreditCard, label: 'PAN Verification', desc: 'Verify PAN number instantly', credits: 18, category: 'Identity', color: '#10b981' },
  { id: 'pan-details', icon: CreditCard, label: 'PAN Details', desc: 'Get full PAN card details', credits: 20, category: 'Identity', color: '#10b981' },
  { id: 'aadhaar-ocr', icon: Image, label: 'Aadhaar OCR', desc: 'Extract data from Aadhaar image', credits: 22, category: 'Identity', color: '#ec4899' },
  { id: 'pan-ocr', icon: Image, label: 'PAN OCR', desc: 'Extract data from PAN image', credits: 22, category: 'Identity', color: '#10b981' },
  { id: 'aadhaar-pan-link', icon: Link, label: 'Aadhaar-PAN Link Check', desc: 'Check Aadhaar and PAN linkage', credits: 15, category: 'Identity', color: '#8b5cf6' },
  { id: 'voter-id', icon: Shield, label: 'Voter ID Verification', desc: 'Verify voter ID details', credits: 18, category: 'Identity', color: '#0ea5e9' },
  { id: 'passport-verify', icon: FileText, label: 'Passport Verification', desc: 'Verify passport details', credits: 25, category: 'Identity', color: '#0ea5e9' },
  { id: 'dl-verify', icon: Car, label: 'Driving License Verification', desc: 'Verify driving license', credits: 18, category: 'Records', color: '#f97316' },
  { id: 'gst-verify', icon: Building, label: 'GST Verification', desc: 'Verify GST number', credits: 15, category: 'Business', color: '#10b981' },
  { id: 'gst-return', icon: Building, label: 'GST Return Status', desc: 'Check GST return filing status', credits: 18, category: 'Business', color: '#10b981' },
  { id: 'gst-advance', icon: Building, label: 'GST Advance Details', desc: 'Get detailed GST information', credits: 20, category: 'Business', color: '#10b981' },
  { id: 'pan-by-gst', icon: CreditCard, label: 'PAN No by GST No', desc: 'Get PAN from GST number', credits: 15, category: 'Business', color: '#10b981' },
  { id: 'mca-company', icon: Building, label: 'MCA Company Search', desc: 'Search company in MCA database', credits: 20, category: 'Business', color: '#0ea5e9' },
  { id: 'mca-cin', icon: Building, label: 'MCA CIN Search', desc: 'Search by CIN number', credits: 20, category: 'Business', color: '#0ea5e9' },
  { id: 'name-to-cin', icon: Building, label: 'Name to CIN List', desc: 'Get CIN list by company name', credits: 18, category: 'Business', color: '#0ea5e9' },
  { id: 'din-details', icon: Users, label: 'DIN Details', desc: 'Director Identification Number', credits: 18, category: 'Business', color: '#8b5cf6' },
  { id: 'rc-verify', icon: Car, label: 'RC Verification', desc: 'Verify vehicle RC', credits: 15, category: 'Records', color: '#f97316' },
  { id: 'rc-details', icon: Car, label: 'RC Details', desc: 'Get full RC details', credits: 18, category: 'Records', color: '#f97316' },
  { id: 'rc-lite', icon: Car, label: 'RC Lite', desc: 'Quick RC lookup', credits: 12, category: 'Records', color: '#f97316' },
  { id: 'rc-owner-history', icon: Car, label: 'RC Owner History', desc: 'Vehicle ownership history', credits: 25, category: 'Records', color: '#f97316' },
  { id: 'rc-to-mobile', icon: Phone, label: 'RC Number to Mobile', desc: 'Get mobile from RC number', credits: 30, category: 'Records', color: '#f97316' },
  { id: 'vehicle-challan', icon: Car, label: 'Vehicle Challan', desc: 'Check pending challans', credits: 15, category: 'Records', color: '#ef4444' },
  { id: 'fastag-info', icon: Car, label: 'FasTag Info Fetch', desc: 'Get FasTag details', credits: 15, category: 'Records', color: '#f97316' },
  { id: 'bank-verify', icon: CreditCard, label: 'Bank Verification', desc: 'Verify bank account', credits: 20, category: 'Financial', color: '#0ea5e9' },
  { id: 'ifsc-details', icon: Database, label: 'Bank Details by IFSC', desc: 'Get bank details from IFSC', credits: 10, category: 'Financial', color: '#0ea5e9' },
  { id: 'upi-verify', icon: CreditCard, label: 'UPI Verification', desc: 'Verify UPI ID', credits: 15, category: 'Financial', color: '#10b981' },
  { id: 'upi-validate', icon: CreditCard, label: 'UPI Validate', desc: 'Validate UPI payment address', credits: 15, category: 'Financial', color: '#10b981' },
  { id: 'vpa-info', icon: CreditCard, label: 'VPA Info', desc: 'Get VPA details', credits: 15, category: 'Financial', color: '#10b981' },
  { id: 'mobile-to-vpa', icon: Phone, label: 'Mobile No to VPA', desc: 'Find VPA from mobile number', credits: 20, category: 'Financial', color: '#10b981' },
  { id: 'upi-name-mobile', icon: Phone, label: 'Find UPI & Name by Mobile', desc: 'Get UPI ID and name from mobile', credits: 22, category: 'Financial', color: '#10b981' },
  { id: 'mobile-multi-upi', icon: Phone, label: 'Mobile to Multiple UPI', desc: 'Get all UPI IDs linked to mobile', credits: 25, category: 'Financial', color: '#10b981' },
  { id: 'mobile-multi-account', icon: Phone, label: 'Mobile to Multiple Account', desc: 'Get all accounts linked to mobile', credits: 25, category: 'Financial', color: '#0ea5e9' },
  { id: 'mobile-ifsc-account', icon: Phone, label: 'Mobile to IFSC & Account', desc: 'Get IFSC and account from mobile', credits: 25, category: 'Financial', color: '#0ea5e9' },
  { id: 'electricity-bill', icon: Zap, label: 'Electricity Bill Fetch', desc: 'Fetch electricity bill details', credits: 15, category: 'Utility', color: '#f59e0b' },
  { id: 'gas-info', icon: Database, label: 'Gas Info Fetch', desc: 'Fetch gas connection details', credits: 15, category: 'Utility', color: '#f59e0b' },
  { id: 'gas-pipeline', icon: Database, label: 'Gas Pipeline', desc: 'Gas pipeline connection info', credits: 15, category: 'Utility', color: '#f59e0b' },
  { id: 'water-bill', icon: Database, label: 'Water Bill', desc: 'Fetch water bill details', credits: 15, category: 'Utility', color: '#0ea5e9' },
  { id: 'postpaid-bill', icon: Phone, label: 'Postpaid Bill Fetch', desc: 'Fetch postpaid mobile bill', credits: 15, category: 'Utility', color: '#8b5cf6' },
  { id: 'broadband-bill', icon: Wifi, label: 'Broadband Bill', desc: 'Fetch broadband bill details', credits: 15, category: 'Utility', color: '#0ea5e9' },
  { id: 'landline-bill', icon: Phone, label: 'Landline Bill', desc: 'Fetch landline bill details', credits: 15, category: 'Utility', color: '#8b5cf6' },
  { id: 'emi-fetch', icon: CreditCard, label: 'EMI Payment Fetch', desc: 'Fetch EMI payment details', credits: 20, category: 'Utility', color: '#ef4444' },
  { id: 'insurance-info', icon: Shield, label: 'Insurance Info Fetch', desc: 'Fetch insurance policy details', credits: 20, category: 'Utility', color: '#10b981' },
  { id: 'digilocker-init', icon: Database, label: 'DigiLocker Init', desc: 'Initialize DigiLocker session', credits: 20, category: 'DigiLocker', color: '#8b5cf6' },
  { id: 'digilocker-status', icon: Database, label: 'DigiLocker Status', desc: 'Check DigiLocker status', credits: 15, category: 'DigiLocker', color: '#8b5cf6' },
  { id: 'digilocker-aadhaar', icon: Shield, label: 'DigiLocker Aadhaar Details', desc: 'Get Aadhaar from DigiLocker', credits: 25, category: 'DigiLocker', color: '#8b5cf6' },
]

export default function LETools() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [activeTool, setActiveTool] = useState(null)
  const [toolInput, setToolInput] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [reportTool, setReportTool] = useState(null)
  const [reportData, setReportData] = useState({})
  const [expandedSections, setExpandedSections] = useState({})
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

  const filtered = TOOLS.filter(t => {
    const matchCat = category === 'All' || t.category === category
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleRun = (e) => {
    e.preventDefault()
    if (!toolInput.trim()) return
    setRunning(true)
    setTimeout(() => {
      setResult({ message: 'Tool integration requires backend API. Demo mode active.', timestamp: new Date().toLocaleTimeString() })
      setRunning(false)
    }, 1500)
  }

  const openReport = (tool) => {
    const template = getToolReport(tool.id)
    setReportTool({ ...tool, template })
    setReportData({})
    const exp = {}
    template.sections.forEach((s, i) => { exp[i] = i === 0 })
    setExpandedSections(exp)
  }

  const toggleSection = (i) => {
    setExpandedSections(prev => ({ ...prev, [i]: !prev[i] }))
  }

  const updateField = (key, value) => {
    setReportData(prev => ({ ...prev, [key]: value }))
  }

  const generatePDF = () => {
    setGenerating(true)
    setTimeout(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W = 210
      const margin = 15
      let y = 0

      // Header
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, W, 42, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('CYBER RAKHWALA', margin, 14)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(reportTool.template.title.toUpperCase(), margin, 22)
      doc.setFontSize(8)
      doc.text(`Tool: ${reportTool.label}`, margin, 30)
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 36)
      doc.text(`Officer: ${user.name || 'N/A'}`, W - margin - 55, 30)
      y = 50

      // Warning banner
      doc.setFillColor(254, 243, 199)
      doc.rect(margin, y, W - margin * 2, 9, 'F')
      doc.setTextColor(146, 64, 14)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('FOR LAWFUL INTELLIGENCE AND INVESTIGATIVE PURPOSES ONLY — LAW ENFORCEMENT USE', margin + 3, y + 6)
      y += 14

      // Sections
      reportTool.template.sections.forEach((section) => {
        const hasData = section.fields.some(f => reportData[f.key])
        if (!hasData) return

        if (y > 255) { doc.addPage(); y = 15 }

        // Section header
        doc.setFillColor(239, 246, 255)
        doc.rect(margin, y, W - margin * 2, 8, 'F')
        doc.setDrawColor(219, 234, 254)
        doc.rect(margin, y, W - margin * 2, 8)
        doc.setTextColor(30, 58, 138)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(section.label.toUpperCase(), margin + 3, y + 5.5)
        y += 12

        section.fields.forEach((field) => {
          const val = reportData[field.key]
          if (!val) return
          if (y > 270) { doc.addPage(); y = 15 }

          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(100, 116, 139)
          doc.text(`${field.label}:`, margin + 3, y)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(15, 23, 42)
          const lines = doc.splitTextToSize(val, W - margin * 2 - 52)
          doc.text(lines, margin + 52, y)
          y += lines.length * 5 + 2
        })
        y += 4
      })

      // Footer on all pages
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFillColor(15, 23, 42)
        doc.rect(0, 287, W, 10, 'F')
        doc.setTextColor(148, 163, 184)
        doc.setFontSize(7)
        doc.text('CYBER RAKHWALA — CONFIDENTIAL INTELLIGENCE REPORT', margin, 293)
        doc.text(`Page ${i} of ${pageCount}`, W - margin - 18, 293)
      }

      doc.save(`CR_${reportTool.id}_${Date.now()}.pdf`)
      setGenerating(false)
    }, 800)
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.85rem',
    background: 'rgba(255,255,255,0.85)', color: '#1e3a8a', outline: 'none',
    fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(6px)', boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#2563eb',
    marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg pattern="hex" />
      <Sidebar role="law-enforcement" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: isMobile ? '56px' : '0', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar user={{ ...user, credits: 250 }} onMenuClick={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Investigation Tools</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{TOOLS.length} tools available</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <Search size={14} color="#93c5fd" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..." className="cr-input" style={{ paddingLeft: '36px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '8px 12px', flexShrink: 0, backdropFilter: 'blur(8px)' }}>
              <Zap size={13} color="#d97706" />
              <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>250</span>
              {!isMobile && <span style={{ color: '#92400e', fontSize: '0.78rem' }}>credits</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '5px 12px', borderRadius: '6px', border: '1px solid',
                borderColor: category === cat ? '#2563eb' : 'rgba(59,130,246,0.15)',
                background: category === cat ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'rgba(255,255,255,0.7)',
                color: category === cat ? '#ffffff' : '#64748b',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: category === cat ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
                backdropFilter: 'blur(6px)',
              }}>{cat}</button>
            ))}
          </div>

          <p style={{ fontSize: '0.78rem', color: '#93c5fd', marginBottom: '12px' }}>Showing {filtered.length} of {TOOLS.length} tools</p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="cr-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '36px', height: '36px', background: `linear-gradient(135deg, ${tool.color}20, ${tool.color}35)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tool.color}25` }}>
                      <Icon size={18} color={tool.color} />
                    </div>
                    <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Zap size={9} /> {tool.credits}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '2px' }}>{tool.label}</p>
                    {!isMobile && <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{tool.desc}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: 'rgba(219,234,254,0.6)', color: '#2563eb', fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>{tool.category}</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => openReport(tool)} style={{
                        padding: '4px 8px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                        border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px',
                        background: 'rgba(219,234,254,0.6)', color: '#1d4ed8',
                        display: 'flex', alignItems: 'center', gap: '3px',
                        backdropFilter: 'blur(6px)',
                      }}>
                        <FileText size={11} /> {!isMobile && 'Report'}
                      </button>
                      <button onClick={() => { setActiveTool(tool); setToolInput(''); setResult(null) }} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        Launch <ArrowUpRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {/* Launch Modal */}
      {activeTool && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,58,138,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(37,99,235,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', background: `linear-gradient(135deg, ${activeTool.color}20, ${activeTool.color}35)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${activeTool.color}25` }}>
                  <activeTool.icon size={20} color={activeTool.color} />
                </div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>{activeTool.label}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{activeTool.desc}</p>
                </div>
              </div>
              <button onClick={() => { setActiveTool(null); setResult(null); setToolInput('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRun} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Query Input</label>
                <input type="text" value={toolInput} onChange={e => setToolInput(e.target.value)} placeholder={`Enter ${activeTool.label} query...`} className="cr-input" autoFocus />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={13} color="#d97706" /> {activeTool.credits} credits
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => { setActiveTool(null); setResult(null) }} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" disabled={running || !toolInput.trim()} className="btn-primary" style={{ padding: '8px 20px' }}>
                    {running ? 'Running...' : 'Run Tool'}
                  </button>
                </div>
              </div>
            </form>
            {result && (
              <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(219,234,254,0.5)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px' }}>Query processed — {activeTool.label}</p>
                <p style={{ fontSize: '0.8rem', color: '#2563eb', marginBottom: '4px' }}>Query: {toolInput}</p>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{result.message}</p>
                <p style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '6px' }}>{result.timestamp}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportTool && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,58,138,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(37,99,235,0.2)' }}>

            {/* Report Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', background: `linear-gradient(135deg, ${reportTool.color}20, ${reportTool.color}35)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${reportTool.color}25` }}>
                  <reportTool.icon size={20} color={reportTool.color} />
                </div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>{reportTool.template.title}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Fill details and download PDF report</p>
                </div>
              </div>
              <button onClick={() => setReportTool(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd' }}>
                <X size={20} />
              </button>
            </div>

            {/* Report Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {reportTool.template.sections.map((section, si) => (
                <div key={si} style={{ marginBottom: '12px', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.8)' }}>
                  <button onClick={() => toggleSection(si)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(219,234,254,0.3)', border: 'none', cursor: 'pointer', borderBottom: expandedSections[si] ? '1px solid rgba(59,130,246,0.1)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={14} color="#2563eb" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{section.label}</span>
                    </div>
                    {expandedSections[si] ? <ChevronUp size={15} color="#93c5fd" /> : <ChevronDown size={15} color="#93c5fd" />}
                  </button>
                  {expandedSections[si] && (
                    <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
                      {section.fields.map((field) => (
                        <div key={field.key} style={{ gridColumn: field.multiline ? '1 / -1' : 'auto' }}>
                          <label style={labelStyle}>{field.label}</label>
                          {field.multiline ? (
                            <textarea value={reportData[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder={`Enter ${field.label.toLowerCase()}...`} />
                          ) : (
                            <input type="text" value={reportData[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} style={inputStyle} placeholder={`Enter ${field.label.toLowerCase()}...`} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Report Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(59,130,246,0.1)', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button onClick={() => setReportTool(null)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
              <button onClick={generatePDF} disabled={generating} className="btn-primary" style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={15} />
                {generating ? 'Generating...' : 'Download PDF Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}