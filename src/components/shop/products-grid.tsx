'use client'

import { useState, useEffect } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import type { Product } from '@prisma/client'

interface Props {
  products: Product[]
}

export function ProductsGrid({ products }: Props) {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('product-layout') as 'grid' | 'list' | null
      if (saved === 'list' || saved === 'grid') setLayout(saved)
    } catch {}
  }, [])

  function setView(v: 'grid' | 'list') {
    setLayout(v)
    try { localStorage.setItem('product-layout', v) } catch {}
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button
            onClick={() => setView('grid')}
            className="p-1.5 rounded-lg transition-all"
            title="Vista cuadrícula"
            style={{
              background: layout === 'grid' ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: layout === 'grid' ? '#3b82f6' : 'rgba(255,255,255,0.35)',
            }}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            className="p-1.5 rounded-lg transition-all"
            title="Vista lista"
            style={{
              background: layout === 'list' ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: layout === 'list' ? '#3b82f6' : 'rgba(255,255,255,0.35)',
            }}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} layout="list" />)}
        </div>
      )}
    </div>
  )
}
