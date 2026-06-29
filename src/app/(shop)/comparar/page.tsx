import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Scale } from 'lucide-react'
import { AddToCartButton } from '@/components/shop/add-to-cart-button'

export default async function CompararPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams
  if (!ids) notFound()

  const idList = ids.split(',').filter(Boolean).slice(0, 3)
  if (idList.length < 2) notFound()

  const products = await db.product.findMany({
    where: { id: { in: idList }, isActive: true },
  })

  if (products.length < 2) notFound()

  const ordered = idList.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products

  const rows = [
    { label: 'Categoría',       fn: (p: typeof products[0]) => p.category },
    { label: 'Precio',          fn: (p: typeof products[0]) => `S/. ${p.price.toLocaleString('es-PE')}`, highlight: true },
    { label: 'Precio original', fn: (p: typeof products[0]) => p.originalPrice ? `S/. ${p.originalPrice.toLocaleString('es-PE')}` : '—' },
    { label: 'Descuento',       fn: (p: typeof products[0]) => p.originalPrice ? `${Math.round((1 - p.price / p.originalPrice) * 100)}% OFF` : '—' },
    { label: 'Disponibilidad',  fn: (p: typeof products[0]) => p.stock > 0 ? `${p.stock} en stock` : 'Sin stock' },
    { label: 'Badge',           fn: (p: typeof products[0]) => p.badge ?? '—' },
  ]

  const colSize = `repeat(${ordered.length}, minmax(160px, 1fr))`
  const minW = 140 + ordered.length * 160

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      <div className="fixed top-20 left-10 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#3b82f6' }} />
      <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: '#f97316' }} />

      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.35)' }}>
        <ArrowLeft size={15} /> Volver al catálogo
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Scale size={20} style={{ color: '#3b82f6' }} />
          <h1 className="text-2xl font-bold text-white">Comparar productos</h1>
        </div>
        <div className="h-px mt-2 w-48" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Comparando {ordered.length} productos lado a lado
        </p>
      </div>

      {/* ── MOBILE LAYOUT ─────────────────────────────── */}
      <div className="md:hidden space-y-4">

        {/* Product cards */}
        <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${ordered.length}, 1fr)` }}>
          {ordered.map(p => (
            <div key={p.id} className="rounded-2xl p-3 text-center flex flex-col"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-full mx-auto rounded-xl overflow-hidden flex items-center justify-center mb-2"
                style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.05)' }}>
                {p.images[0]
                  ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-2" />
                  : <span className="text-3xl">📦</span>}
              </div>
              {p.badge && (
                <span className="inline-block mb-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(249,115,22,0.9)', color: '#fff' }}>
                  {p.badge}
                </span>
              )}
              <p className="text-[10px] mb-0.5" style={{ color: '#60a5fa' }}>{p.category}</p>
              <p className="text-xs font-semibold text-white leading-tight flex-1 line-clamp-2">{p.name}</p>
              <Link href={`/producto/${p.id}`}
                className="mt-2 block text-xs font-semibold py-1.5 rounded-xl"
                style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)', color: '#fff' }}>
                Ver producto
              </Link>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {rows.map((row, i) => (
            <div key={row.label} className="flex items-center" style={{
              background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <p className="px-3 py-3 text-[11px] font-medium shrink-0 w-[30%]"
                style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</p>
              {ordered.map(p => (
                <p key={p.id} className="py-3 text-sm font-semibold text-center flex-1"
                  style={{ color: row.highlight ? '#f97316' : 'rgba(255,255,255,0.85)' }}>
                  {row.fn(p)}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Add to cart */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${ordered.length}, 1fr)` }}>
          {ordered.map(p => (
            <AddToCartButton key={p.id} label="Agregar" product={{
              id: p.id, name: p.name, price: p.price,
              image: p.images[0] ?? '', stock: p.stock,
            }} />
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto pb-2">

        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `140px ${colSize}`, minWidth: minW }}>
          <div />
          {ordered.map(p => (
            <div key={p.id} className="rounded-2xl p-4 text-center flex flex-col"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-full max-w-[130px] mx-auto rounded-xl overflow-hidden flex items-center justify-center mb-3"
                style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.05)' }}>
                {p.images[0]
                  ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-2" />
                  : <span className="text-4xl">📦</span>}
              </div>
              {p.badge && (
                <span className="inline-block mb-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(249,115,22,0.9)', color: '#fff' }}>
                  {p.badge}
                </span>
              )}
              <p className="text-[10px] mb-1" style={{ color: '#60a5fa' }}>{p.category}</p>
              <p className="text-sm font-semibold text-white leading-tight flex-1">{p.name}</p>
              <Link href={`/producto/${p.id}`}
                className="mt-3 block text-xs font-semibold py-2 rounded-xl transition-opacity hover:opacity-80"
                style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)', color: '#fff' }}>
                Ver producto
              </Link>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', minWidth: minW }}>
          {rows.map((row, i) => (
            <div key={row.label} className="grid items-center" style={{
              gridTemplateColumns: `140px ${colSize}`,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div className="px-4 py-3.5">
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</p>
              </div>
              {ordered.map(p => (
                <div key={p.id} className="px-4 py-3.5 text-center">
                  <p className="text-sm font-semibold"
                    style={{ color: row.highlight ? '#f97316' : 'rgba(255,255,255,0.85)' }}>
                    {row.fn(p)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: `140px ${colSize}`, minWidth: minW }}>
          <div className="flex items-center">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Agregar al carrito</p>
          </div>
          {ordered.map(p => (
            <div key={p.id}>
              <AddToCartButton product={{
                id: p.id, name: p.name, price: p.price,
                image: p.images[0] ?? '', stock: p.stock,
              }} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
