'use client'

import { useRecentlyViewed } from '@/context/recently-viewed-context'
import { Clock } from 'lucide-react'
import Link from 'next/link'

export function RecentlyViewedSection({ currentId }: { currentId?: string }) {
  const { items } = useRecentlyViewed()
  const filtered = items.filter(p => p.id !== currentId)
  if (filtered.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <Clock size={16} style={{ color: '#f97316' }} />
        <h2 className="text-lg font-bold text-white">Vistos recientemente</h2>
        <div className="h-px flex-1 ml-2" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.3), transparent)' }} />
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {filtered.map(p => {
          const discount = p.originalPrice
            ? Math.round((1 - p.price / p.originalPrice) * 100)
            : null
          return (
            <Link
              key={p.id}
              href={`/producto/${p.id}`}
              className="flex-none w-36 snap-start rounded-2xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="relative" style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.04)' }}>
                {p.image
                  ? <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                {p.badge && (
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(249,115,22,0.9)', color: '#fff' }}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-[10px]" style={{ color: '#60a5fa' }}>{p.category}</p>
                <p className="text-xs font-semibold text-white leading-tight mt-0.5 line-clamp-2">{p.name}</p>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-sm font-bold text-white">S/. {p.price.toLocaleString('es-PE')}</span>
                  {discount && (
                    <span className="text-[9px] font-bold px-1 py-0.5 rounded-full"
                      style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
