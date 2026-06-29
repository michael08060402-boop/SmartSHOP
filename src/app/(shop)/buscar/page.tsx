import { db } from '@/lib/db'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { BuscarFilters } from './buscar-filters'
import { ProductsGrid } from '@/components/shop/products-grid'
import type { Prisma } from '@prisma/client'

type SP = { q?: string; sort?: string; cat?: string; min?: string; max?: string }

export default async function BuscarPage({ searchParams }: { searchParams: Promise<SP> }) {
  const { q, sort, cat, min, max } = await searchParams

  const query  = q?.trim()   ?? ''
  const sortBy = sort?.trim() ?? ''
  const catBy  = cat?.trim()  ?? ''
  const minVal = min ? parseFloat(min) : undefined
  const maxVal = max ? parseFloat(max) : undefined

  const hasAnyFilter = !!(query || catBy || minVal || maxVal)

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(query && {
      OR: [
        { name:        { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category:    { contains: query, mode: 'insensitive' } },
        { badge:       { contains: query, mode: 'insensitive' } },
      ],
    }),
    ...(catBy && { category: catBy }),
    ...((minVal !== undefined || maxVal !== undefined) && {
      price: {
        ...(minVal !== undefined ? { gte: minVal } : {}),
        ...(maxVal !== undefined ? { lte: maxVal } : {}),
      },
    }),
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === 'price_asc'  ? { price: 'asc'      } :
    sortBy === 'price_desc' ? { price: 'desc'     } :
    { createdAt: 'desc' }

  const products = hasAnyFilter
    ? await db.product.findMany({ where, orderBy })
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Search size={18} style={{ color: '#3b82f6' }} />
          <h1 className="text-xl font-bold text-white">
            {query ? `Resultados para "${query}"` : 'Búsqueda'}
          </h1>
        </div>
        <div className="h-px mt-2" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
        {hasAnyFilter && (
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {products.length > 0
              ? `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`
              : 'Sin resultados'}
          </p>
        )}
      </div>

      {/* Filters (only when there is a query) */}
      {query && (
        <BuscarFilters
          q={query}
          sort={sortBy}
          cat={catBy}
          min={min ?? ''}
          max={max ?? ''}
        />
      )}

      {/* Empty state */}
      {!hasAnyFilter && (
        <div className="text-center py-24" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Escribe algo para buscar</p>
        </div>
      )}

      {hasAnyFilter && products.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <Search size={48} className="mx-auto opacity-20" style={{ color: '#fff' }} />
          <p className="text-lg font-semibold text-white">Sin resultados</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Intenta con otras palabras o ajusta los filtros
          </p>
          <Link href="/" className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}>
            Ver todos los productos
          </Link>
        </div>
      )}

      {products.length > 0 && <ProductsGrid products={products} />}
    </div>
  )
}
