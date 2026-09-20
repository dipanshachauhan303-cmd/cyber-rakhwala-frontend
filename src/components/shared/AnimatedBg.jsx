import { useEffect, useRef } from 'react'

// Pattern types: 'network', 'hex', 'circuit', 'matrix', 'constellation', 'dna'
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

    // Common colors
    const blue = 'rgba(59,130,246,'
    const cyan = 'rgba(14,165,233,'
    const light = 'rgba(219,234,254,'

    const drawGradientBg = () => {
      // Base light blue gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      grad.addColorStop(0, '#eef2ff')
      grad.addColorStop(0.5, '#f0f4ff')
      grad.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Glowing orbs
      const orbs = [
        { x: canvas.width * 0.1, y: canvas.height * 0.2, r: 200, c: 'rgba(147,197,253,0.25)' },
        { x: canvas.width * 0.85, y: canvas.height * 0.1, r: 250, c: 'rgba(96,165,250,0.18)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.9, r: 180, c: 'rgba(14,165,233,0.15)' },
      ]
      orbs.forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, o.c)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
    }

    // 1. NETWORK — particle web
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
              const a = 0.2 * (1 - dist / 130)
              const lg = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y)
              lg.addColorStop(0, `${blue}${a})`)
              lg.addColorStop(1, `${cyan}${a})`)
              ctx.beginPath()
              ctx.moveTo(pts[i].x, pts[i].y)
              ctx.lineTo(pts[j].x, pts[j].y)
              ctx.strokeStyle = lg
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

    // 2. HEX — hexagon grid
    if (pattern === 'hex') {
      let t = 0
      const hexes = []
      const size = 32
      const w = size * 2
      const h = Math.sqrt(3) * size

      for (let row = -1; row < canvas.height / h + 2; row++) {
        for (let col = -1; col < canvas.width / w + 2; col++) {
          const x = col * w * 0.75
          const y = row * h + (col % 2 === 0 ? 0 : h / 2)
          hexes.push({ x, y, phase: Math.random() * Math.PI * 2 })
        }
      }

      const drawHex = (x, y, s, alpha) => {
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 6
          const px = x + s * Math.cos(a)
          const py = y + s * Math.sin(a)
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
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
          const alpha = 0.04 + pulse * 0.14
          drawHex(h.x, h.y, size - 2, alpha)
          if (pulse > 0.8) {
            drawHex(h.x, h.y, size - 2, pulse * 0.3)
            ctx.fillStyle = `${blue}${pulse * 0.06})`
            ctx.fill()
          }
        })
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    // 3. CIRCUIT — circuit board lines
    if (pattern === 'circuit') {
      const nodes = Array.from({ length: 25 }, () => ({
        x: Math.round(Math.random() * (canvas.width / 40)) * 40,
        y: Math.round(Math.random() * (canvas.height / 40)) * 40,
        pulse: Math.random() * Math.PI * 2,
        connections: [],
      }))

      nodes.forEach((n, i) => {
        const nearby = nodes.filter((m, j) => j !== i && Math.hypot(m.x - n.x, m.y - n.y) < 200)
        n.connections = nearby.slice(0, 3)
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
            ctx.strokeStyle = `${blue}0.15)`
            ctx.lineWidth = 0.8
            ctx.stroke()

            // Moving dot on circuit
            const pathLen = Math.abs(m.x - n.x) + Math.abs(m.y - n.y)
            const dotPos = progress * pathLen
            let dotX, dotY
            const seg1 = Math.abs(midX - n.x)
            const seg2 = Math.abs(m.y - n.y)
            if (dotPos < seg1) { dotX = n.x + (midX - n.x) * (dotPos / seg1); dotY = n.y }
            else if (dotPos < seg1 + seg2) { dotX = midX; dotY = n.y + (m.y - n.y) * ((dotPos - seg1) / seg2) }
            else { dotX = midX + (m.x - midX) * ((dotPos - seg1 - seg2) / Math.abs(m.x - midX)); dotY = m.y }

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

          // Node dot
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

    // 4. CONSTELLATION — star pattern
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
        const near = stars.filter((t, j) => j !== i && Math.hypot(t.x - s.x, t.y - s.y) < 150)
        near.slice(0, 2).forEach(t => lines.push([s, t]))
      })

      let t = 0
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        t += 0.015

        lines.forEach(([a, b]) => {
          const dist = Math.hypot(b.x - a.x, b.y - a.y)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `${blue}${0.08 + 0.06 * Math.sin(t)}})`
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

    // 5. DNA — double helix data stream
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
              ctx.moveTo(x1, y)
              ctx.lineTo(x2, y)
              ctx.strokeStyle = `${blue}${0.15 + a * 0.2})`
              ctx.lineWidth = 0.8
              ctx.stroke()

              ctx.beginPath()
              ctx.arc(x1, y, 2.5, 0, Math.PI * 2)
              ctx.fillStyle = `${cyan}${0.4 + a * 0.5})`
              ctx.fill()
              ctx.beginPath()
              ctx.arc(x2, y, 2.5, 0, Math.PI * 2)
              ctx.fillStyle = `${blue}${0.4 + a * 0.5})`
              ctx.fill()
            }
          }

          // Strands
          ctx.beginPath()
          for (let y = 0; y < canvas.height; y += 4) {
            const phase = t * 60 + y
            const x = cx + amp * Math.sin(phase * Math.PI / 180)
            y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.strokeStyle = `${blue}0.12)`
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.beginPath()
          for (let y = 0; y < canvas.height; y += 4) {
            const phase = t * 60 + y + 180
            const x = cx + amp * Math.sin(phase * Math.PI / 180)
            y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.strokeStyle = `${cyan}0.12)`
          ctx.lineWidth = 1
          ctx.stroke()
        }
        animId = requestAnimationFrame(animate)
      }
      animate()
    }

    // 6. MATRIX — falling data
    if (pattern === 'matrix') {
      const cols = Math.floor(canvas.width / 20)
      const drops = Array.from({ length: cols }, () => Math.random() * canvas.height / 16)
      const chars = '01アイウエオカキクケコABCDEF0123456789'
      let t = 0

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGradientBg()
        t++

        if (t % 3 === 0) {
          drops.forEach((drop, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)]
            const x = i * 20
            const y = drop * 16

            ctx.font = '11px JetBrains Mono'
            ctx.fillStyle = `rgba(37,99,235,${Math.random() * 0.15 + 0.05})`
            ctx.fillText(char, x, y)

            if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
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
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  )
}