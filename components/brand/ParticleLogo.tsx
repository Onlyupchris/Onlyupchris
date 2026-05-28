'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RivoniaLogo } from './RivoniaLogo'

type Particle = {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  phase: 'explode' | 'drift' | 'assemble'
}

const TEAL = '#4DD9D9'
const WHITE = '#FFFFFF'
const COLORS = [TEAL, WHITE, '#2BBFBF', '#7BE8E8', '#A0EEEE']

function getDiamondPoints(cx: number, cy: number, r: number): [number, number][] {
  const pts: [number, number][] = []
  const steps = 180
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2
    const x = cx + Math.cos(angle) * r * 0.7
    const y = cy + Math.sin(angle) * r * 0.7
    // Diamond shape: |x-cx| + |y-cy| <= r
    if (Math.abs(x - cx) + Math.abs(y - cy) <= r) {
      pts.push([x, y])
    }
  }
  // Fill diamond with a grid
  for (let dx = -r; dx <= r; dx += 6) {
    for (let dy = -r; dy <= r; dy += 6) {
      if (Math.abs(dx) + Math.abs(dy) <= r * 0.88) {
        pts.push([cx + dx, cy + dy])
      }
    }
  }
  return pts
}

export function ParticleLogo({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const phaseRef = useRef<'explode' | 'drift' | 'assemble' | 'done'>('explode')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showLogo, setShowLogo] = useState(false)
  const [canvasVisible, setCanvasVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2

    // Build target points (diamond shape)
    const targets = getDiamondPoints(cx, cy, Math.min(W, H) * 0.3)

    // Spawn particles from center
    const count = Math.min(targets.length, 220)
    particlesRef.current = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 5
      return {
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 20,
        targetX: targets[i % targets.length][0],
        targetY: targets[i % targets.length][1],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2.5,
        alpha: 0.8 + Math.random() * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: 'explode',
      }
    })

    // Phase transitions
    timerRef.current = setTimeout(() => {
      phaseRef.current = 'drift'
      timerRef.current = setTimeout(() => {
        phaseRef.current = 'assemble'
        timerRef.current = setTimeout(() => {
          phaseRef.current = 'done'
          setCanvasVisible(false)
          setShowLogo(true)
          onComplete?.()
        }, 1400)
      }, 600)
    }, 800)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      const phase = phaseRef.current

      for (const p of particlesRef.current) {
        if (phase === 'explode') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.97
          p.vy *= 0.97
          p.alpha = Math.max(0.3, p.alpha - 0.003)
        } else if (phase === 'drift') {
          p.vx += (Math.random() - 0.5) * 0.3
          p.vy += (Math.random() - 0.5) * 0.3
          p.vx *= 0.92
          p.vy *= 0.92
          p.x += p.vx
          p.y += p.vy
        } else if (phase === 'assemble') {
          const dx = p.targetX - p.x
          const dy = p.targetY - p.y
          p.vx = p.vx * 0.7 + dx * 0.12
          p.vy = p.vy * 0.7 + dy * 0.12
          p.x += p.vx
          p.y += p.vy
          p.alpha = Math.min(1, p.alpha + 0.02)
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      }

      if (phase !== 'done') {
        animFrameRef.current = requestAnimationFrame(draw)
      }
    }

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onComplete])

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Teal radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(77,217,217,0.12) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />

      <AnimatePresence>
        {canvasVisible && (
          <motion.canvas
            key="canvas"
            ref={canvasRef}
            width={400}
            height={400}
            className="relative z-10"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
        {showLogo && (
          <motion.div
            key="logo"
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <RivoniaLogo size="xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
