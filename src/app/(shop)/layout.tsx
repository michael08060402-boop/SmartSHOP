import { Navbar } from '@/components/layout/navbar'
import { AnnouncementBar } from '@/components/layout/announcement-bar'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { CartProvider } from '@/context/cart-context'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { FavoritesProvider } from '@/context/favorites-context'
import { FavoritesDrawer } from '@/components/shop/favorites-drawer'
import { RecentlyViewedProvider } from '@/context/recently-viewed-context'
import { CompareProvider } from '@/context/compare-context'
import { CompareBar } from '@/components/shop/compare-bar'
import { ToastProvider } from '@/context/toast-context'
import { ToastContainer } from '@/components/layout/toast-container'
import { Footer } from '@/components/layout/footer'
import { SessionGuard } from '@/components/auth/session-guard'
import { auth } from '@/auth'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <ToastProvider>
      <RecentlyViewedProvider>
        <CompareProvider>
          <FavoritesProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <SessionGuard hasSession={!!session} />
                <AnnouncementBar />
                <Navbar />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
                <WhatsAppButton />
                <CartDrawer />
                <FavoritesDrawer />
                <CompareBar />
                <ToastContainer />
              </div>
            </CartProvider>
          </FavoritesProvider>
        </CompareProvider>
      </RecentlyViewedProvider>
    </ToastProvider>
  )
}
