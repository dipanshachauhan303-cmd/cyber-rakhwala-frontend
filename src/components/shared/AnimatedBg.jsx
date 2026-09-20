import { useEffect, useRef } from 'react'

export default function AnimatedBg({ pattern = 'network' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const blue = 'rgba(59,130,246,'
    const cyan = 'rgba(14,165,233,'

    const drawGradientBg = () => {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      grad.addColorStop(0, '#eef2ff')
      grad.addColorStop(0.5, '#f0f4ff')
      grad.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ;[
        { x: canvas.width * 0.1, y: canvas.height * 0.2, r: 220, c: 'rgba(147,197,253,0.28)' },
        { x: canvas.width * 0.85, y: canvas.height * 0.1, r: 280, c: 'rgba(96,165,250,0.2)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.85, r: 200, c: 'rgba(14,165,233,0.18)' },
        { x: canvas.width * 0.2, y: canvas.height * 0.8, r: 150, c: 'rgba(59,130,246,0.12)' },
      ].forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, o.c)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
    }

    // NETWORK
    if (pattern === 'network') {
      const pts = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.8,
      }))

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        pts.forEach(p => {
          p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        })
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 130) {
              ctx.beginPath()
              ctx.moveTo(pts[i].x, pts[i].y)
              ctx.lineTo(pts[j].x, pts[j].y)
              ctx.strokeStyle = `${blue}${0.22 * (1 - dist / 130)})`
              ctx.lineWidth = 0.8
              ctx.stroke()
            }
          }
          const p = pts[i]
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
          g.addColorStop(0, `${blue}0.8)`)
          g.addColorStop(1, `${blue}0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `${blue}0.9)`
          ctx.fill()
        }
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    // HEX
    if (pattern === 'hex') {
      let t = 0
      const size = 32
      const ww = size * 2
      const hh = Math.sqrt(3) * size
      const hexes = []
      for (let row = -1; row < canvas.height / hh + 2; row++) {
        for (let col = -1; col < canvas.width / ww + 2; col++) {
          hexes.push({ x: col * ww * 0.75, y: row * hh + (col % 2 === 0 ? 0 : hh / 2), phase: Math.random() * Math.PI * 2 })
        }
      }
      const drawHex = (x, y, s, alpha) => {
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 6
          i === 0 ? ctx.moveTo(x + s * Math.cos(a), y + s * Math.sin(a)) : ctx.lineTo(x + s * Math.cos(a), y + s * Math.sin(a))
        }
        ctx.closePath()
        ctx.strokeStyle = `${blue}${alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        t += 0.012
        hexes.forEach(h => {
          const pulse = (Math.sin(t + h.phase) + 1) / 2
          drawHex(h.x, h.y, size - 2, 0.06 + pulse * 0.16)
          if (pulse > 0.8) {
            ctx.fillStyle = `${blue}${pulse * 0.07})`
            ctx.fill()
          }
        })
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    // CIRCUIT
    if (pattern === 'circuit') {
      const nodes = Array.from({ length: 25 }, () => ({
        x: Math.round(Math.random() * (canvas.width / 40)) * 40,
        y: Math.round(Math.random() * (canvas.height / 40)) * 40,
        pulse: Math.random() * Math.PI * 2,
        connections: [],
      }))
      nodes.forEach((n, i) => {
        n.connections = nodes.filter((m, j) => j !== i && Math.hypot(m.x - n.x, m.y - n.y) < 200).slice(0, 3)
      })
      let t = 0
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        t += 0.02
        nodes.forEach(n => {
          n.connections.forEach(m => {
            const progress = (Math.sin(t + n.pulse) + 1) / 2
            const midX = (n.x + m.x) / 2
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(midX, n.y)
            ctx.lineTo(midX, m.y)
            ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = `${blue}0.18)`
            ctx.lineWidth = 0.8
            ctx.stroke()
            const pathLen = Math.abs(m.x - n.x) + Math.abs(m.y - n.y)
            const dotPos = progress * pathLen
            const seg1 = Math.abs(midX - n.x)
            const seg2 = Math.abs(m.y - n.y)
            let dotX, dotY
            if (dotPos < seg1) { dotX = n.x + (midX - n.x) * (dotPos / seg1); dotY = n.y }
            else if (dotPos < seg1 + seg2) { dotX = midX; dotY = n.y + (m.y - n.y) * ((dotPos - seg1) / seg2) }
            else { dotX = midX + (m.x - midX) * ((dotPos - seg1 - seg2) / (Math.abs(m.x - midX) || 1)); dotY = m.y }
            const dg = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 6)
            dg.addColorStop(0, `${cyan}0.9)`)
            dg.addColorStop(1, `${cyan}0)`)
            ctx.beginPath()
            ctx.arc(dotX, dotY, 6, 0, Math.PI * 2)
            ctx.fillStyle = dg
            ctx.fill()
            ctx.beginPath()
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
            ctx.fillStyle = '#7dd3fc'
            ctx.fill()
          })
          const pulse = (Math.sin(t + n.pulse) + 1) / 2
          const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 8)
          ng.addColorStop(0, `${blue}${0.6 + pulse * 0.4})`)
          ng.addColorStop(1, `${blue}0)`)
          ctx.beginPath()
          ctx.arc(n.x, n.y, 8, 0, Math.PI * 2)
          ctx.fillStyle = ng
          ctx.fill()
          ctx.beginPath()
          ctx.arc(n.x, n.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#93c5fd'
          ctx.fill()
        })
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    // CONSTELLATION
    if (pattern === 'constellation') {
      const stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.5 + 0.5,
      }))
      const lines = []
      stars.forEach((s, i) => {
        stars.filter((tt, j) => j !== i && Math.hypot(tt.x - s.x, tt.y - s.y) < 150).slice(0, 2).forEach(tt => lines.push([s, tt]))
      })
      let t = 0
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        t += 0.015
        lines.forEach(([a, b]) => {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `${blue}${0.1 + 0.06 * Math.sin(t)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        })
        stars.forEach(s => {
          const twinkle = s.twinkle * (0.7 + 0.3 * Math.sin(t + s.phase))
          const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
          sg.addColorStop(0, `${cyan}${twinkle * 0.9})`)
          sg.addColorStop(1, `${cyan}0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = sg
          ctx.fill()
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(147,197,253,${twinkle})`
          ctx.fill()
        })
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    // DNA
    if (pattern === 'dna') {
      let t = 0
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        t += 0.02
        const cols = Math.ceil(canvas.width / 180)
        for (let c = 0; c < cols; c++) {
          const cx = (c + 0.5) * (canvas.width / cols)
          const amp = 40
          for (let y = -20; y < canvas.height + 20; y += 8) {
            const phase = t * 60 + y
            const x1 = cx + amp * Math.sin(phase * Math.PI / 180)
            const x2 = cx + amp * Math.sin((phase + 180) * Math.PI / 180)
            if (y % 24 === 0) {
              const a = Math.abs(Math.sin(phase * Math.PI / 180))
              ctx.beginPath()
              ctx.moveTo(x1, y); ctx.lineTo(x2, y)
              ctx.strokeStyle = `${blue}${0.18 + a * 0.22})`
              ctx.lineWidth = 0.8; ctx.stroke()
              ctx.beginPath(); ctx.arc(x1, y, 2.5, 0, Math.PI * 2)
              ctx.fillStyle = `${cyan}${0.5 + a * 0.5})`; ctx.fill()
              ctx.beginPath(); ctx.arc(x2, y, 2.5, 0, Math.PI * 2)
              ctx.fillStyle = `${blue}${0.5 + a * 0.5})`; ctx.fill()
            }
          }
          ctx.beginPath()
          for (let y = 0; y < canvas.height; y += 4) {
            const x = cx + amp * Math.sin((t * 60 + y) * Math.PI / 180)
            y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.strokeStyle = `${blue}0.15)`; ctx.lineWidth = 1; ctx.stroke()
          ctx.beginPath()
          for (let y = 0; y < canvas.height; y += 4) {
            const x = cx + amp * Math.sin((t * 60 + y + 180) * Math.PI / 180)
            y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.strokeStyle = `${cyan}0.15)`; ctx.lineWidth = 1; ctx.stroke()
        }
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    // MATRIX
    if (pattern === 'matrix') {
      const cols = Math.floor(canvas.width / 20)
      const drops = Array.from({ length: cols }, () => Math.random() * canvas.height / 16)
      const chars = '01アイウエオABCDEF0123456789'
      let t = 0
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        t++
        if (t % 3 === 0) {
          drops.forEach((drop, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)]
            ctx.font = '11px monospace'
            ctx.fillStyle = `rgba(37,99,235,${Math.random() * 0.15 + 0.06})`
            ctx.fillText(char, i * 20, drop * 16)
            if (drop * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0
            else drops[i]++
          })
        }
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [pattern])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}