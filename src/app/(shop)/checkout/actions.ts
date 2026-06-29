'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'

interface OrderItemInput {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

export async function createOrder(data: {
  items: OrderItemInput[]
  total: number
  shipping: number
  payMethod: string
  address: string
  phone: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'No autenticado' }

  const order = await db.order.create({
    data: {
      userId:    session.user.id,
      total:     data.total,
      shipping:  data.shipping,
      payMethod: data.payMethod,
      address:   data.address,
      phone:     data.phone,
      items: {
        create: data.items.map(i => ({
          productId: i.productId,
          name:      i.name,
          image:     i.image,
          price:     i.price,
          quantity:  i.quantity,
        })),
      },
    },
  })

  return { success: true, orderId: order.id }
}
