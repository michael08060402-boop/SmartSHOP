import { db } from './db'

const defaults: Record<string, string> = {
  announcement:        'ENVÍO GRATIS en compras superiores a S/. 500 | Hasta 30% OFF en tecnología seleccionada',
  shipping_threshold:  '500',
  shipping_cost:       '15',
  whatsapp:            '51958173765',
  contact_email:       'contacto@smartshop.pe',
  schedule:            'Lun – Sáb · 9:00am – 8:00pm',
}

export async function getSetting(key: string): Promise<string> {
  try {
    const row = await db.setting.findUnique({ where: { key } })
    return row?.value ?? defaults[key] ?? ''
  } catch {
    return defaults[key] ?? ''
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.setting.findMany()
    const map: Record<string, string> = { ...defaults }
    for (const r of rows) map[r.key] = r.value
    return map
  } catch {
    return { ...defaults }
  }
}
