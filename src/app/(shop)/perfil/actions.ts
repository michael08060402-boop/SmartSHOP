'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

interface ProfileData {
  name: string
  phone: string
  address: string
  addressLat: number | null
  addressLng: number | null
  addressRef: string
}

export async function updateProfile(data: ProfileData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'No autenticado' }

  if (!data.name?.trim()) return { error: 'El nombre es requerido' }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name:       data.name.trim(),
      phone:      data.phone?.trim()   || null,
      address:    data.address?.trim() || null,
      addressLat: data.addressLat,
      addressLng: data.addressLng,
      addressRef: data.addressRef?.trim() || null,
    },
  })
  revalidatePath('/perfil')
  return { success: true }
}

export async function changePassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'No autenticado' }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword     = formData.get('newPassword')     as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (newPassword !== confirmPassword) return { error: 'Las contrasenas no coinciden' }
  if (newPassword.length < 8)          return { error: 'Minimo 8 caracteres' }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user?.password) return { error: 'Esta cuenta usa Google, no tiene contrasena' }

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return { error: 'Contrasena actual incorrecta' }

  const hashed = await bcrypt.hash(newPassword, 12)
  await db.user.update({ where: { id: session.user.id }, data: { password: hashed } })
  return { success: true }
}
