import { db } from '@/lib/db'
import Link from 'next/link'
import { Tag, Package, ArrowUpRight } from 'lucide-react'

const categoryMeta: Record<string, { label: string; icon: string; color: string }> = {
  'laptops':      { label: 'Laptops & PCs',  icon: '/laptops.png',      color: '#3b82f6' },
  'smartphones':  { label: 'Smartphones',    icon: '/smartphones.png',  color: '#f97316' },
  'gaming':       { label: 'Gaming',         icon: '/gaming.png',       color: '#a855f7' },
  'audio':        { label: 'Audio',          icon: '/audio.png',        color: '#06b6d4' },
  'wearables':    { label: 'Wearables',      icon: '/wearables.png',    color: '#34d399' },
  'smart-home':   { label: 'Smart Home',     icon: '/smart-home.png',   color: '#f59e0b' },
  'accesorios':   { label: 'Accesorios',     icon: '/accesorios.png',   color: '#f87171' },
}

// reverse map: label or slug → canonical slug
const toSlug: Record<string, string> = {}
for (const [slug, meta] of Object.entries(categoryMeta)) {
  toSlug[slug]       = slug
  toSlug[meta.label] = slug
  toSlug[meta.label.toLowerCase()] = slug
}

export default async function AdminCategoriasPage() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { category: true, price: true },
  })

  const grouped = products.reduce<Record<string, { count: number; revenue: number }>>((acc, p) => {
    const slug = toSlug[p.category] ?? toSlug[p.category.toLowerCase()] ?? p.category
    if (!acc[slug]) acc[slug] = { count: 0, revenue: 0 }
    acc[slug].count++
    acc[slug].revenue += p.price
    return acc
  }, {})

  const allSlugs = Array.from(new Set([
    ...Object.keys(categoryMeta),
    ...Object.keys(grouped),
  ]))

  return (
    <div className="p-6 space-y-6" style={{ background: '#111214', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white">Categorías</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {allSlugs.length} categorías · {products.length} productos activos
          </p>
        </div>
        <Link href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(90deg,#ea580c,#f97316)', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>
          <Package size={14} /> Agregar producto
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allSlugs.map(slug => {
          const meta  = categoryMeta[slug]
          const stats = grouped[slug] ?? { count: 0, revenue: 0 }
          const color = meta?.color ?? '#3b82f6'

          return (
            <div
              key={slug}
              className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${color}25`,
                boxShadow: `0 4px 24px ${color}08`,
              }}
            >
              {/* Glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none"
                style={{ background: color }} />

              {/* Icon + name */}
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  {meta?.icon
                    ? <img src={meta.icon} alt={meta.label} className="w-9 h-9 object-contain" />
                    : <Tag size={20} style={{ color }} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{meta?.label ?? slug}</p>
                  <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{slug}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 relative z-10">
                <div className="rounded-xl px-3 py-2.5" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                  <p className="text-xl font-bold text-white">{stats.count}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Productos</p>
                </div>
                <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-sm font-bold" style={{ color }}>S/. {stats.revenue.toLocaleString('es-PE')}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Valor total</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 relative z-10">
                <Link
                  href={`/admin/productos?cat=${slug}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                >
                  <Package size={12} /> Ver productos
                </Link>
                <Link
                  href={`/categoria/${slug}`}
                  target="_blank"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                >
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
