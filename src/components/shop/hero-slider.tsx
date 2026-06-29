'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Zap, Tag, Truck } from 'lucide-react'

const slides = [
  {
    id: 1,
    badge: { icon: Zap, text: 'Ofertas de temporada — hasta 30% OFF', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.4)' },
    title: (name: string) => (
      <>
        Hola, <span style={{ background: 'linear-gradient(90deg,#f97316,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{name}</span> 👋
        <br />Tecnología que{' '}
        <span style={{ background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>transforma</span>
        <br />tu mundo.
      </>
    ),
    desc: 'Los mejores precios en laptops, smartphones, gaming y más. Envío gratis en compras superiores a $200.000.',
    cta: { label: 'Ver catálogo', style: { background: 'linear-gradient(90deg,#1d4ed8,#3b82f6)', color: '#fff', boxShadow: '0 4px 20px rgba(59,130,246,0.35)' } },
    ctaSecondary: 'Ofertas del día',
    blobs: [
      { pos: '-top-24 left-1/4', size: 'w-[500px] h-[400px]', color: '#1d6ef7', opacity: 'opacity-50' },
      { pos: 'bottom-0 right-0',  size: 'w-[400px] h-[350px]', color: '#f97316', opacity: 'opacity-45' },
      { pos: 'top-0 right-1/4',   size: 'w-[300px] h-[300px]', color: '#fb923c', opacity: 'opacity-30' },
    ],
    stats: [
      { label: 'Productos', value: '+5.000', color: '#3b82f6' },
      { label: 'Marcas',    value: '+120',   color: '#f97316' },
      { label: 'Clientes',  value: '+50K',   color: '#f97316' },
      { label: 'Envíos/día', value: '+800',  color: '#3b82f6' },
    ],
  },
  {
    id: 2,
    badge: { icon: Tag, text: 'Gaming Week — Precios increíbles', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.4)' },
    title: () => (
      <>
        <span style={{ background: 'linear-gradient(90deg,#8b5cf6,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gaming Week</span>
        <br />Hasta{' '}
        <span style={{ background: 'linear-gradient(90deg,#f97316,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>25% OFF</span>
        <br />en equipos gaming.
      </>
    ),
    desc: 'Teclados mecánicos, monitores de alto refresco, headsets y más. Solo por tiempo limitado.',
    cta: { label: 'Ver Gaming', style: { background: 'linear-gradient(90deg,#6d28d9,#8b5cf6)', color: '#fff', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' } },
    ctaSecondary: 'Ver todos',
    blobs: [
      { pos: '-top-24 right-1/4', size: 'w-[500px] h-[400px]', color: '#8b5cf6', opacity: 'opacity-45' },
      { pos: 'bottom-0 left-0',   size: 'w-[400px] h-[350px]', color: '#f97316', opacity: 'opacity-35' },
      { pos: 'top-0 left-1/4',    size: 'w-[300px] h-[300px]', color: '#3b82f6', opacity: 'opacity-25' },
    ],
    stats: [
      { label: 'Monitores',   value: '+80',   color: '#8b5cf6' },
      { label: 'Teclados',    value: '+50',   color: '#f97316' },
      { label: 'Headsets',    value: '+30',   color: '#8b5cf6' },
      { label: 'Descuento',   value: '25%',   color: '#f97316' },
    ],
  },
  {
    id: 3,
    badge: { icon: Truck, text: 'Envío Express — Mismo día en tu ciudad', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)' },
    title: () => (
      <>
        Smartphones
        <br />
        <span style={{ background: 'linear-gradient(90deg,#f97316,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5G de última</span>
        <br />generación.
      </>
    ),
    desc: 'Los mejores smartphones con conectividad 5G, cámaras de alta resolución y batería de larga duración.',
    cta: { label: 'Ver Smartphones', style: { background: 'linear-gradient(90deg,#ea580c,#f97316)', color: '#fff', boxShadow: '0 4px 20px rgba(249,115,22,0.35)' } },
    ctaSecondary: 'Comparar modelos',
    blobs: [
      { pos: '-top-24 left-1/3',  size: 'w-[500px] h-[400px]', color: '#f97316', opacity: 'opacity-40' },
      { pos: 'bottom-0 right-1/4', size: 'w-[400px] h-[350px]', color: '#1d4ed8', opacity: 'opacity-40' },
      { pos: 'top-0 right-0',      size: 'w-[300px] h-[300px]', color: '#fb923c', opacity: 'opacity-25' },
    ],
    stats: [
      { label: 'Modelos 5G', value: '+60',  color: '#f97316' },
      { label: 'Marcas',     value: '+15',  color: '#3b82f6' },
      { label: 'Garantía',   value: '12m',  color: '#f97316' },
      { label: 'Envío',      value: 'Free', color: '#3b82f6' },
    ],
  },
]

interface Props {
  firstName: string
}

export function HeroSlider({ firstName }: Props) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 250)
  }, [animating])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]
  const BadgeIcon = slide.badge.icon

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #06060f 0%, #0c1a3a 45%, #1a0800 100%)',
        minHeight: 420,
        transition: 'opacity 0.25s ease',
        opacity: animating ? 0 : 1,
      }}
    >
      <div className="absolute inset-0 grid-pattern opacity-[0.08]" />

      {/* Blobs */}
      {slide.blobs.map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.pos} ${b.size} rounded-full blur-[90px] ${b.opacity} pointer-events-none`}
          style={{ background: `radial-gradient(ellipse, ${b.color} 0%, transparent 70%)` }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: slide.badge.bg, border: `1px solid ${slide.badge.border}`, color: slide.badge.color }}
          >
            <BadgeIcon size={12} />
            {slide.badge.text}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            {slide.title(firstName)}
          </h1>

          <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {slide.desc}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={slide.cta.style}
            >
              {slide.cta.label}
            </button>
            <button
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:border-orange-500 hover:text-white"
              style={{ border: '1px solid rgba(249,115,22,0.35)', color: 'rgba(255,255,255,0.7)' }}
            >
              {slide.ctaSecondary}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-60">
          {slide.stats.map(s => (
            <div
              key={s.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}30`, boxShadow: `0 0 20px ${s.color}10` }}
            >
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow left */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Arrow right */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? '#f97316' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
