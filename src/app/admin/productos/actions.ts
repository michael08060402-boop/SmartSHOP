'use server'

import { db } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado')
}

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const name          = formData.get('name') as string
  const description   = formData.get('description') as string
  const price         = parseFloat(formData.get('price') as string)
  const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
  const stock         = parseInt(formData.get('stock') as string)
  const category      = formData.get('category') as string
  const badge         = formData.get('badge') as string || null
  const isActive      = formData.get('isActive') === 'true'
  const imagesRaw     = formData.get('images') as string
  const images        = imagesRaw ? imagesRaw.split('\n').map(s => s.trim()).filter(Boolean) : []

  if (!name || !price || !category) return { error: 'Nombre, precio y categoría son requeridos.' }

  await db.product.create({
    data: { name, description, price, originalPrice, stock, category, badge, isActive, images },
  })

  revalidatePath('/admin/productos')
  revalidatePath('/')
  redirect('/admin/productos')
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()

  const name          = formData.get('name') as string
  const description   = formData.get('description') as string
  const price         = parseFloat(formData.get('price') as string)
  const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
  const stock         = parseInt(formData.get('stock') as string)
  const category      = formData.get('category') as string
  const badge         = formData.get('badge') as string || null
  const isActive      = formData.get('isActive') === 'true'
  const imagesRaw     = formData.get('images') as string
  const images        = imagesRaw ? imagesRaw.split('\n').map(s => s.trim()).filter(Boolean) : []

  await db.product.update({
    where: { id },
    data: { name, description, price, originalPrice, stock, category, badge, isActive, images },
  })

  revalidatePath('/admin/productos')
  revalidatePath('/')
  redirect('/admin/productos')
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  await db.product.delete({ where: { id } })
  revalidatePath('/admin/productos')
  revalidatePath('/')
}

export async function toggleActive(id: string, current: boolean) {
  await requireAdmin()
  await db.product.update({ where: { id }, data: { isActive: !current } })
  revalidatePath('/admin/productos')
}
