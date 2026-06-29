import { db } from '@/lib/db'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Shield, Truck, Zap, Package } from 'lucide-react'
import Link from 'next/link'
import { ProductImages } from '@/components/shop/product-images'
import { AddToCartButton } from '@/components/shop/add-to-cart-button'
import { FavoriteToggleButton } from '@/components/shop/favorite-toggle-button'
import { ProductReviews } from '@/components/shop/product-reviews'
import { TrackRecentlyViewed } from '@/components/shop/track-recently-viewed'
import { ProductCard } from '@/components/shop/product-card'

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, session, reviews] = await Promise.all([
    db.product.findUnique({ where: { id, isActive: true } }),
    auth(),
    db.review.findMany({
      where: { productId: id },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])
  if (!product) notFound()

  const related = await db.product.findMany({
    where: { isActive: true, category: product.category, NOT: { id } },
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  const avgRating  = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const hasReviewed = session?.user?.id
    ? reviews.some(r => (r as any).userId === session.user!.id)
    : false
  const canReview = !!session?.user?.id && !hasReviewed

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const perks = [
    { icon: Truck,   text: 'Envío gratis en compras +$200.000' },
    { icon: Shield,  text: 'Garantía oficial 12 meses'         },
    { icon: Zap,     text: 'Entrega express mismo día'         },
    { icon: Package, text: 'Devoluciones sin costo 30 días'    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Track this product in recently viewed */}
      <TrackRecentlyViewed product={{
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] ?? '',
        category: product.category,
        badge: product.badge,
      }} />

      {/* Breadcrumb */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.35)' }}>
        <ArrowLeft size={15} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Images */}
        <ProductImages images={product.images} name={product.name} />

        {/* Info */}
        <div className="flex flex-col gap-5">

          {/* Category + badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
              {product.category}
            </span>
            {product.badge && (
              <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{product.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={16}
                fill={s <= Math.round(avgRating) ? '#f97316' : 'none'}
                style={{ color: '#f97316' }} />
            ))}
            <span className="text-sm ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {reviews.length > 0 ? `${avgRating.toFixed(1)} · ${reviews.length} reseña${reviews.length !== 1 ? 's' : ''}` : 'Sin reseñas aún'}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">S/. {product.price.toLocaleString('es-PE')}</span>
            {product.originalPrice && (
              <div className="flex flex-col">
                <span className="text-sm line-through mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  S/. {product.originalPrice.toLocaleString('es-PE')}
                </span>
                {discount && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                    -{discount}% OFF
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {product.description}
            </p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: product.stock > 0 ? '#34d399' : '#f87171' }}
            />
            <span className="text-sm font-medium"
              style={{ color: product.stock > 0 ? '#34d399' : '#f87171' }}>
              {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <div className="flex-1">
              <AddToCartButton product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? '',
                stock: product.stock,
              }} />
            </div>
            <FavoriteToggleButton item={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images[0] ?? '',
              category: product.category,
              badge: product.badge,
            }} />
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Perks */}
          <div className="grid grid-cols-2 gap-3">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon size={15} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <span className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12 border-t pt-10" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-bold text-white">Productos relacionados</h2>
            <div className="h-px flex-1 ml-2" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.3), transparent)' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-12 border-t pt-10" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <ProductReviews
          productId={product.id}
          reviews={reviews as any}
          canReview={canReview}
          avgRating={avgRating}
        />
      </div>
    </div>
  )
}
