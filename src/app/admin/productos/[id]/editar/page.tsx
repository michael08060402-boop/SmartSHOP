import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ProductForm } from '../../product-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id } })
  if (!product) notFound()

  return (
    <div className="p-6 space-y-6" style={{ background: '#111214', minHeight: '100vh' }}>
      <div className="border-b pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link href="/admin/productos" className="flex items-center gap-2 text-sm mb-4 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          <ArrowLeft size={15} /> Volver a productos
        </Link>
        <h1 className="text-2xl font-bold text-white">Editar producto</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{product.name}</p>
      </div>
      <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
        <ProductForm product={product} />
      </div>
    </div>
  )
}
