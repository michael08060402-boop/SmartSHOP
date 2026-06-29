'use client'

import Link from 'next/link'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteProduct, toggleActive } from './actions'
import { useState } from 'react'
import type { Product } from '@prisma/client'

export function ProductRow({ product: p }: { product: Product }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return
    setLoading(true)
    await deleteProduct(p.id)
  }

  async function handleToggle() {
    setLoading(true)
    await toggleActive(p.id, p.isActive)
    setLoading(false)
  }

  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null

  return (
    <tr
      className="border-b transition-colors duration-150 hover:bg-white/[0.02]"
      style={{ borderColor: 'rgba(255,255,255,0.04)', opacity: loading ? 0.5 : 1 }}
    >
      {/* Nombre */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            📦
          </div>
          <div>
            <p className="text-sm font-medium text-white leading-tight">{p.name}</p>
            {p.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                {p.badge}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Categoría */}
      <td className="px-4 py-3">
        <span className="text-xs px-2 py-1 rounded-lg whitespace-nowrap"
          style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
          {p.category}
        </span>
      </td>

      {/* Precio */}
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-white">S/. {p.price.toLocaleString('es-PE')}</p>
        {discount && (
          <p className="text-[10px]" style={{ color: '#f97316' }}>-{discount}% OFF</p>
        )}
      </td>

      {/* Stock */}
      <td className="px-4 py-3">
        <span
          className="text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap"
          style={{
            background: p.stock > 0 ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
            color: p.stock > 0 ? '#34d399' : '#f87171',
            border: `1px solid ${p.stock > 0 ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}
        >
          {p.stock} unid.
        </span>
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <button
          onClick={handleToggle}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-all duration-200 hover:opacity-80"
          style={{
            background: p.isActive ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
            color: p.isActive ? '#34d399' : 'rgba(255,255,255,0.3)',
            border: `1px solid ${p.isActive ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {p.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
          {p.isActive ? 'Activo' : 'Oculto'}
        </button>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/productos/${p.id}/editar`}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#3b82f6' }}
          >
            <Pencil size={13} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}
