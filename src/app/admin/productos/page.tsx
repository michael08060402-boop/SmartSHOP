import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'
import { ProductRow } from './product-row'

const categoryAliases: Record<string, string[]> = {
  'laptops':     ['laptops', 'Laptops & PCs', 'Laptops'],
  'smartphones': ['smartphones', 'Smartphones'],
  'gaming':      ['gaming', 'Gaming'],
  'audio':       ['audio', 'Audio'],
  'wearables':   ['wearables', 'Wearables'],
  'smart-home':  ['smart-home', 'Smart Home', 'smart home'],
  'accesorios':  ['accesorios', 'Accesorios'],
}

export default async function ProductosPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams
  const aliases = cat ? (categoryAliases[cat] ?? [cat]) : null
  const products = await db.product.findMany({
    where: aliases ? { category: { in: aliases } } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6 space-y-6" style={{ background: '#111214', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {products.length} producto{products.length !== 1 ? 's' : ''}{cat ? ` en "${cat}"` : ' en total'}
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
          style={{ background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', color: '#fff', boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }}
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div
          className="rounded-2xl border p-16 flex flex-col items-center justify-center text-center"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(249,115,22,0.2)', borderStyle: 'dashed' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
            <Package size={24} style={{ color: '#f97316' }} />
          </div>
          <p className="text-base font-semibold text-white mb-1">Sin productos aún</p>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Agrega el primer producto al catálogo
          </p>
          <Link
            href="/admin/productos/nuevo"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.35)', color: '#f97316' }}
          >
            Agregar producto
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-x-auto border"
          style={{ borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.03)' }}
        >
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                {['Producto', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wide"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
