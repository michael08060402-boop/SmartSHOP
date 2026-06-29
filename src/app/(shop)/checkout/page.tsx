import { CheckoutClient } from './checkout-client'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getAllSettings } from '@/lib/settings'

export default async function CheckoutPage() {
  const session = await auth()

  let savedAddress = ''
  let savedPhone   = ''
  let savedLat: number | null = null
  let savedLng: number | null = null
  let savedRef: string | null = null

  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { address: true, addressLat: true, addressLng: true, addressRef: true, phone: true },
    })
    savedAddress = user?.address    ?? ''
    savedPhone   = user?.phone      ?? ''
    savedLat     = user?.addressLat ?? null
    savedLng     = user?.addressLng ?? null
    savedRef     = user?.addressRef ?? null
  }

  const settings         = await getAllSettings()
  const shippingCost      = Number(settings.shipping_cost)      || 15
  const shippingThreshold = Number(settings.shipping_threshold) || 500

  return (
    <CheckoutClient
      userName={session?.user?.name ?? ''}
      userEmail={session?.user?.email ?? ''}
      savedAddress={savedAddress}
      savedPhone={savedPhone}
      savedLat={savedLat}
      savedLng={savedLng}
      savedRef={savedRef}
      shippingCost={shippingCost}
      shippingThreshold={shippingThreshold}
    />
  )
}
