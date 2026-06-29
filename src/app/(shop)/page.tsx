import { auth } from '@/auth'
import { ChevronRight, Zap, ShieldCheck, Truck, Headset } from 'lucide-react'
import Image from 'next/image'
import { HeroSlider } from '@/components/shop/hero-slider'
import { ProductsGrid } from '@/components/shop/products-grid'
import { RecentlyViewedSection } from '@/components/shop/recently-viewed-section'
import { db } from '@/lib/db'

const categories = [
  { name: 'Laptops & PCs',  slug: 'laptops',      icon: '/laptops.png'     },
  { name: 'Smartphones',    slug: 'smartphones',   icon: '/smartphones.png' },
  { name: 'Gaming',         slug: 'gaming',        icon: '/gaming.png'      },
  { name: 'Audio',          slug: 'audio',         icon: '/audio.png'       },
  { name: 'Wearables',      slug: 'wearables',     icon: '/wearables.png'   },
  { name: 'Smart Home',     slug: 'smart-home',    icon: '/smart-home.png'  },
  { name: 'Accesorios',     slug: 'accesorios',    icon: '/accesorios.png'  },
]

const perks = [
  { icon: Truck,       title: 'Envío gratis',      desc: 'En compras +$200.000'   },
  { icon: ShieldCheck, title: 'Garantía oficial',   desc: '12 meses en todo'       },
  { icon: Zap,         title: 'Entrega express',    desc: 'Mismo día en tu ciudad' },
  { icon: Headset,     title: 'Soporte 24/7',       desc: 'Expertos disponibles'   },
]

export default async function HomePage() {
  const session = await auth()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Explorador'
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>

      <HeroSlider firstName={firstName} />

      {/* ── Perks strip ── */}
      <div style={{ background: 'linear-gradient(90deg, #0d1f3c 0%, #1a0a03 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
              >
                <Icon size={16} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{title}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">

        {/* ── Categories ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Categorías</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Explora por tipo de producto</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium" style={{ color: '#3b82f6' }}>
              Ver todas <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {categories.map(({ name, slug, icon }) => (
              <a
                key={slug}
                href={`/categoria/${slug}`}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-blue-500/50 group"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 group-hover:bg-blue-500/10"
                  style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)' }}
                >
                  <Image src={icon} alt={name} width={40} height={40} className="object-contain" />
                </div>
                <span className="text-[11px] font-medium text-center leading-tight" style={{ color: 'var(--foreground)' }}>
                  {name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Recently Viewed ── */}
        <RecentlyViewedSection />

        {/* ── Products ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                {products.length > 0 ? 'Productos destacados' : 'Catálogo'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {products.length > 0 ? `${products.length} productos disponibles` : 'Próximamente'}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden text-center py-20 px-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[80px] opacity-20 pointer-events-none"
                style={{ background: '#3b82f6' }} />
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none"
                style={{ background: '#f97316' }} />
              <div className="relative z-10 space-y-4 max-w-md mx-auto">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-500" />
                  Catálogo en construcción
                </div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  Los productos llegan pronto
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Nuestro equipo está cargando el catálogo. Muy pronto encontrarás
                  los mejores productos de tecnología al mejor precio.
                </p>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
