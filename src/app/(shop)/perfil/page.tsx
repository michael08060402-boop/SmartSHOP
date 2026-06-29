import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ProfileClient } from './profile-client'

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, password: true, address: true, addressLat: true, addressLng: true, addressRef: true, phone: true, createdAt: true, role: true },
  })
  if (!user) redirect('/login')

  const orderCount = await db.order.count({ where: { userId: user.id } })

  return <ProfileClient user={{ ...user, password: !!user.password }} orderCount={orderCount} />
}
