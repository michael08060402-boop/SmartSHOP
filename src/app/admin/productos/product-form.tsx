'use client'

import { useState, useTransition } from 'react'
import { createProduct, updateProduct } from './actions'
import type { Product } from '@prisma/client'
import { Save, Loader2 } from 'lucide-react'
import { ImageUploader } from '@/components/admin/image-uploader'

const categories = ['Laptops & PCs','Smartphones','Gaming','Audio','Wearables','Smart Home','Accesorios']
const badges     = ['', 'Nuevo', 'Oferta', 'Más vendido', 'Gaming', 'Liquidación']

interface Props { product?: Product }

export function ProductForm({ product }: Props) {
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const isEdit = !!product

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    // Inject images array as newline-separated string for the server action
    fd.set('images', images.join('\n'))
    startTransition(async () => {
      if (isEdit) await updateProduct(product.id, fd)
      else        await createProduct(fd)
    })
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 10,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 6,
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left col */}
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>Nombre del producto *</label>
            <input name="name" required defaultValue={product?.name} placeholder='Ej: Laptop UltraBook Pro 16"' style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>

          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea name="description" rows={4} defaultValue={product?.description ?? ''} placeholder="Descripción del producto..."
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Precio *</label>
              <input name="price" type="number" required min="0" step="1" defaultValue={product?.price}
                placeholder="0" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label style={labelStyle}>Precio original</label>
              <input name="originalPrice" type="number" min="0" step="1" defaultValue={product?.originalPrice ?? ''}
                placeholder="Opcional" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Stock *</label>
              <input name="stock" type="number" required min="0" defaultValue={product?.stock ?? 0}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label style={labelStyle}>Badge</label>
              <select name="badge" defaultValue={product?.badge ?? ''} style={{ ...inputStyle, cursor: 'pointer' }}>
                {badges.map(b => <option key={b} value={b} style={{ background: '#0f1020' }}>{b || 'Sin badge'}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Categoría *</label>
            <select name="category" required defaultValue={product?.category ?? ''} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="" style={{ background: '#0f1020' }}>Seleccionar categoría</option>
              {categories.map(c => <option key={c} value={c} style={{ background: '#0f1020' }}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Visibilidad</label>
            <select name="isActive" defaultValue={product?.isActive !== false ? 'true' : 'false'}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="true"  style={{ background: '#0f1020' }}>✅ Activo — visible en tienda</option>
              <option value="false" style={{ background: '#0f1020' }}>🙈 Oculto — no visible</option>
            </select>
          </div>
        </div>

        {/* Right col — images */}
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>Imágenes del producto</label>
            <ImageUploader value={images} onChange={setImages} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', color: '#fff', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isEdit ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <a href="/admin/productos" className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Cancelar
        </a>
      </div>
    </form>
  )
}
