'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const categories = [
  { label: 'Inicio',        href: '/' },
  { label: 'Laptops & PCs', href: '/categoria/laptops' },
  { label: 'Smartphones',   href: '/categoria/smartphones' },
  { label: 'Gaming',        href: '/categoria/gaming' },
  { label: 'Audio',         href: '/categoria/audio' },
  { label: 'Wearables',     href: '/categoria/wearables' },
  { label: 'Smart Home',    href: '/categoria/smart-home' },
  { label: 'Accesorios',    href: '/categoria/accesorios' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0"
        style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.06)' }}
        aria-label="Menú"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute left-0 top-full mt-2 w-56 rounded-xl z-50 overflow-hidden py-1"
            style={{
              background: '#0d1324',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            }}
          >
            <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Categorías
            </p>
            {categories.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center px-4 h-11 text-sm font-medium transition-all duration-150"
                style={{ color: 'rgba(255,255,255,0.65)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#f97316'
                  e.currentTarget.style.background = 'rgba(249,115,22,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
