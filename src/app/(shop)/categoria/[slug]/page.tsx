import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'  
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { ProductsGrid } from '@/components/shop/products-grid'

const slugToCategory: Record<string, string> = {
  'laptops':      'Laptops & PCs',
  'smartphones':  'Smartphones',
  'gaming':       'Gaming',
  'audio':        'Audio',
  'wearables':    'Wearables',
  'smart-home':   'Smart Home',
  'accesorios':   'Accesorios',
}

const slugToIcon: Record<string, string> = {
  'laptops':     '/laptops.png',
  'smartphones': '/smartphones.png',
  'gaming':      '/gaming.png',
  'audio':       '/audio.png',
  'wearables':   '/wearables.png',
  'smart-home':  '/smart-home.png',
  'accesorios':  '/accesorios.png',
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categoryName = slugToCategory[slug]
  if (!categoryName) notFound()

  const products = await db.product.findMany({
    where: { isActive: true, category: categoryName },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium">{categoryName}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <Image src={slugToIcon[slug]} alt={categoryName} width={40} height={40} className="object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{categoryName}</h1>
          <div className="h-px mt-1.5 w-40" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 space-y-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <Image src={slugToIcon[slug]} alt={categoryName} width={44} height={44} className="object-contain opacity-50" />
          </div>
          <p className="text-lg font-semibold text-white">Próximamente en {categoryName}</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Estamos cargando productos para esta categoría
          </p>
          <Link href="/" className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <ProductsGrid products={products} />
      )}
    </div>
  )
}
