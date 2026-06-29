'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function saveSettings(data: Record<string, string>): Promise<{ error?: string }> {
  try {
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        db.setting.upsert({
          where:  { key },
          update: { value },
          create: { key, value },
        })
      )
    )
    revalidatePath('/', 'layout')
    return {}
  } catch {
    return { error: 'La tabla de configuración no existe aún. Ejecuta: npx prisma db push' }
  }
}
