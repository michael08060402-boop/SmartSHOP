'use server'

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) return { error: 'Todos los campos son requeridos.' }
  if (password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) return { error: 'Ya existe una cuenta con ese email.' }

  const hashed = await bcrypt.hash(password, 10)
  await db.user.create({ data: { name, email, password: hashed } })

  return { success: true }
}

export async function loginUser(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/auth/completo',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o contraseña incorrectos.' }
    }
    throw error
  }
}
