'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const CATEGORIES = [
  'Laptops & PCs', 'Smartphones', 'Gaming',
  'Audio', 'Wearables', 'Smart Home', 'Accesorios',
]

const SORT_OPTIONS = [
  { value: '',           label: 'Más recientes' },
  { value: 'price_asc',  label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

interface Props {
  q: string
  sort: string
  cat: string
  min: string
  max: string
}

export function BuscarFilters({ q, sort, cat, min, max }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  const hasFilters = !!(sort || cat || min || max)

  function buildUrl(overrides: Partial<{ sort: string; cat: string; min: string; max: string }>) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    const s = overrides.sort   !== undefined ? overrides.sort   : sort
    const c = overrides.cat    !== undefined ? overrides.cat    : cat
    const mn = overrides.min   !== undefined ? overrides.min    : min
    const mx = overrides.max   !== undefined ? overrides.max    : max
    if (s)  params.set('sort', s)
    if (c)  params.set('cat',  c)
    if (mn) params.set('min',  mn)
    if (mx) params.set('max',  mx)
    return `/buscar?${params.toString()}`
  }

  function applyPrice() {
    router.push(buildUrl({ min: localMin, max: localMax }))
  }

  function clearFilters() {
    setLocalMin('')
    setLocalMax('')
    router.push(q ? `/buscar?q=${encodeURIComponent(q)}` : '/buscar')
  }

  return (
    <div className="mb-6 space-y-3">
      {/* Top bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
          style={{
            background: open ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${open ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.1)'}`,
            color: open ? '#3b82f6' : 'rgba(255,255,255,0.6)',
          }}
        >
          <SlidersHorizontal size={12} />
          Filtros {hasFilters && <span style={{ color: '#f97316' }}>•</span>}
          <ChevronDown size={11} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => router.push(buildUrl({ sort: e.target.value }))}
          className="px-3 py-1.5 rounded-xl text-xs font-medium outline-none appearance-none cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: sort ? '#fff' : 'rgba(255,255,255,0.5)',
          }}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <X size={11} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Expanded filter panel */}
      {open && (
        <div
          className="grid sm:grid-cols-2 gap-5 p-5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Category */}
          <div>
            <p className="text-[11px] font-semibold mb-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>CATEGORÍA</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => router.push(buildUrl({ cat: cat === c ? '' : c }))}
                  className="text-[10px] px-2.5 py-1 rounded-full font-medium transition-all"
                  style={{
                    background: cat === c ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${cat === c ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    color: cat === c ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <p className="text-[11px] font-semibold mb-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>RANGO DE PRECIO</p>
            <div className="flex items-center gap-2 mb-2.5">
              <input
                type="number"
                placeholder="Mínimo"
                value={localMin}
                onChange={e => setLocalMin(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl text-xs outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>–</span>
              <input
                type="number"
                placeholder="Máximo"
                value={localMax}
                onChange={e => setLocalMax(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl text-xs outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              />
            </div>
            <button
              onClick={applyPrice}
              className="w-full py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', color: '#fff' }}
            >
              Aplicar precio
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
