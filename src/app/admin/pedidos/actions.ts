'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@prisma/client'

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await db.order.update({ where: { id: orderId }, data: { status } })
  revalidatePath('/admin/pedidos')
  revalidatePath('/admin')
}
