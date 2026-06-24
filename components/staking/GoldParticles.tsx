'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  radius: number
}

export function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2

    const particles: Particle[] = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 8
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        alpha: 0.8 + Math.random() * 0.2,
        radius: 2 + Math.random() * 4,
      }
    })

    let raf: number

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      let allDone = true
      for (const p of particles) {
        if (p.alpha <= 0) continue
        allDone = false
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08
        p.alpha -= 0.018

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(201,168,76,${Math.max(0, p.alpha)})`
        ctx!.fill()
      }

      if (!allDone) {
        raf = requestAnimationFrame(draw)
      }
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />
}
