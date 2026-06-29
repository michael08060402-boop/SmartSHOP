'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createReview(productId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Inicia sesión para dejar una reseña' }

  const rating  = parseInt(formData.get('rating') as string)
  const comment = (formData.get('comment') as string)?.trim() || null

  if (!rating || rating < 1 || rating > 5) return { error: 'Selecciona una calificación' }

  const existing = await db.review.findUnique({
    where: { productId_userId: { productId, userId: session.user.id } },
  })
  if (existing) return { error: 'Ya dejaste una reseña para este producto' }

  await db.review.create({
    data: { productId, userId: session.user.id, rating, comment },
  })

  revalidatePath(`/producto/${productId}`)
  return { success: true }
}
