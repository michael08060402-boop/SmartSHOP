import { auth } from '@/auth'
import { UserMenu } from '@/components/auth/user-menu'
import { SearchBar } from './search-bar'
import { CategoryNav } from './category-nav'
import { CartButton } from './cart-button'
import { FavoritesButton } from './favorites-button'
import { MobileNav } from './mobile-nav'

export async function Navbar() {
  const session = await auth()

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, #080c18 0%, #0a0f1e 100%)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Main row */}
      <div
        className="border-b"
        style={{ borderColor: 'rgba(59,130,246,0.12)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 md:gap-6">

          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center gap-2">
            <img src="/icon.png" alt="SmartSHOP" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
            <span className="font-bold text-xl md:text-2xl tracking-tight">
              <span style={{ color: '#3b82f6' }}>Smart</span>
              <span style={{ color: '#f97316' }}>SHOP</span>
            </span>
          </a>

          {/* Search — hidden on mobile, visible on md+ */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-auto md:ml-0">
            <MobileNav />
            <FavoritesButton />
            <CartButton />
            <div className="w-px h-8 hidden md:block" style={{ background: 'rgba(255,255,255,0.08)' }} />
            {session && <UserMenu session={session} />}
          </div>
        </div>

        {/* Search — mobile only row */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>
      </div>

      <CategoryNav />
    </header>
  )
}
