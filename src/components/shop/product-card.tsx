'use client'

import { useState } from 'react'
import { ShoppingCart, Star, Heart, Scale } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@prisma/client'
import { useCart } from '@/context/cart-context'
import { useFavorites } from '@/context/favorites-context'
import { useCompare } from '@/context/compare-context'
import { useToast } from '@/context/toast-context'

interface Props {
  product: Product
  layout?: 'grid' | 'list'
}

export function ProductCard({ product: p, layout = 'grid' }: Props) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { addItem, flyToCart } = useCart()
  const { toggle: toggleFav, isFavorite } = useFavorites()
  const { toggle: toggleCompare, isIn } = useCompare()
  const { addToast } = useToast()

  const image = p.images[0]
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null
  const fav = isFavorite(p.id)
  const comparing = isIn(p.id)

  const compareProduct = {
    id: p.id, name: p.name, price: p.price,
    originalPrice: p.originalPrice, image: image ?? '',
    category: p.category, badge: p.badge,
  }
  const favProduct = {
    id: p.id, name: p.name, price: p.price,
    originalPrice: p.originalPrice, image: image ?? '',
    category: p.category, badge: p.badge,
  }

  /* ── LIST LAYOUT ─────────────────────────────────────────── */
  if (layout === 'list') {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex gap-3 rounded-2xl overflow-hidden transition-all duration-200 p-3"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${hovered ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: hovered ? '0 4px 24px rgba(59,130,246,0.1)' : 'none',
        }}
      >
        <Link href={`/producto/${p.id}`} className="absolute inset-0 z-10" aria-label={p.name} />

        {/* Image */}
        <div
          className="w-24 h-24 shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {image && !imgError
            ? <img src={image} alt={p.name} className="w-full h-full object-contain p-2" onError={() => setImgError(true)} />
            : <div className="text-3xl">📦</div>}
        </div>

        {/* All content in one column */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: '#60a5fa' }}>{p.category}</span>
            {p.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.9)', color: '#fff' }}>
                {p.badge}
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-white leading-tight line-clamp-2">{p.name}</p>

          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={9} fill={s <= 4 ? '#f97316' : 'none'} style={{ color: '#f97316' }} />
            ))}
          </div>

          {/* Price + actions */}
          <div className="flex items-center justify-between mt-auto pt-1 gap-2">
            <div>
              <p className="text-sm font-bold text-white">S/. {p.price.toLocaleString('es-PE')}</p>
              {p.originalPrice && (
                <p className="text-[10px] line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  S/. {p.originalPrice.toLocaleString('es-PE')}
                </p>
              )}
              {discount && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                  -{discount}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 z-20 shrink-0">
              <button
                onClick={e => { e.preventDefault(); toggleCompare(compareProduct) }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                title="Comparar"
                style={{
                  background: comparing ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${comparing ? 'rgba(59,130,246,0.45)' : 'rgba(255,255,255,0.1)'}`,
                  color: comparing ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                }}
              >
                <Scale size={12} />
              </button>

              <button
                onClick={e => { e.preventDefault(); const wasFav = isFavorite(p.id); toggleFav(favProduct); addToast({ type: 'fav', title: wasFav ? 'Eliminado de favoritos' : 'Añadido a favoritos', subtitle: p.name }) }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                title="Favorito"
                style={{
                  background: fav ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${fav ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: fav ? '#f97316' : 'rgba(255,255,255,0.5)',
                }}
              >
                <Heart size={12} fill={fav ? 'currentColor' : 'none'} />
              </button>

              <button
                disabled={p.stock === 0}
                onClick={e => {
                  e.preventDefault()
                  flyToCart(image ?? '', e.currentTarget)
                  addItem({ id: p.id, name: p.name, price: p.price, image: image ?? '', stock: p.stock })
                  addToast({ type: 'cart', title: 'Agregado al carrito', subtitle: p.name })
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)', color: '#fff' }}
              >
                <ShoppingCart size={11} />
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── GRID LAYOUT (default) ──────────────────────────────── */
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered ? '0 8px 32px rgba(59,130,246,0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <Link href={`/producto/${p.id}`} className="absolute inset-0 z-10" aria-label={p.name} />

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.04)' }}>
        {image && !imgError ? (
          <img
            src={image}
            alt={p.name}
            className="w-full h-full object-contain p-3 transition-transform duration-300"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}

        {p.badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(249,115,22,0.9)', color: '#fff', backdropFilter: 'blur(4px)' }}>
            {p.badge}
          </span>
        )}
        {discount && !p.badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(52,211,153,0.9)', color: '#fff' }}>
            -{discount}%
          </span>
        )}

        {/* Top-right buttons: favorite + compare */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
          <button
            onClick={e => { e.preventDefault(); const wasFav = isFavorite(p.id); toggleFav(favProduct); addToast({ type: 'fav', title: wasFav ? 'Eliminado de favoritos' : 'Añadido a favoritos', subtitle: p.name }) }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            title="Favorito"
            style={{
              background: fav ? 'rgba(249,115,22,0.85)' : 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
              border: fav ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Heart size={13} fill={fav ? '#fff' : 'none'} style={{ color: fav ? '#fff' : 'rgba(255,255,255,0.7)' }} />
          </button>
          <button
            onClick={e => { e.preventDefault(); toggleCompare(compareProduct) }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            title="Comparar"
            style={{
              background: comparing ? 'rgba(59,130,246,0.85)' : 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
              border: comparing ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Scale size={12} style={{ color: comparing ? '#fff' : 'rgba(255,255,255,0.7)' }} />
          </button>
        </div>

        {p.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}>
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <span className="text-[10px] font-medium" style={{ color: '#60a5fa' }}>{p.category}</span>
        <p className="text-sm font-semibold text-white leading-tight line-clamp-2">{p.name}</p>

        <div className="flex items-center gap-0.5">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={10} fill={s <= 4 ? '#f97316' : 'none'} style={{ color: '#f97316' }} />
          ))}
          <span className="text-[10px] ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>(0)</span>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-white">S/. {p.price.toLocaleString('es-PE')}</span>
            {p.originalPrice && (
              <span className="text-xs line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>
                S/. {p.originalPrice.toLocaleString('es-PE')}
              </span>
            )}
          </div>

          <button
            disabled={p.stock === 0}
            onClick={e => {
              e.preventDefault()
              flyToCart(image ?? '', e.currentTarget)
              addItem({ id: p.id, name: p.name, price: p.price, image: image ?? '', stock: p.stock })
            }}
            className="relative z-20 mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: hovered && p.stock > 0 ? 'linear-gradient(90deg, #ea580c, #f97316)' : 'rgba(249,115,22,0.12)',
              color: hovered && p.stock > 0 ? '#fff' : '#f97316',
              border: '1px solid rgba(249,115,22,0.3)',
            }}
          >
            <ShoppingCart size={12} />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
