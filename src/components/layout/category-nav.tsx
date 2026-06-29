'use client'

const categories = [
  { label: 'Laptops & PCs', slug: 'laptops'     },
  { label: 'Smartphones',   slug: 'smartphones'  },
  { label: 'Gaming',        slug: 'gaming'       },
  { label: 'Audio',         slug: 'audio'        },
  { label: 'Wearables',     slug: 'wearables'    },
  { label: 'Smart Home',    slug: 'smart-home'   },
  { label: 'Accesorios',    slug: 'accesorios'   },
]

export function CategoryNav() {
  return (
    <div
      className="hidden md:block border-b overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ borderColor: 'rgba(249,115,22,0.12)', background: 'rgba(0,0,0,0.25)' }}
    >
      <div className="px-4 sm:px-6 h-11 flex items-center gap-1 min-w-max lg:min-w-0 lg:max-w-7xl lg:mx-auto lg:justify-center">

        {/* Inicio */}
        <a
          href="/"
          className="px-4 h-full flex items-center text-sm font-semibold transition-all duration-200 border-b-2 border-transparent whitespace-nowrap"
          style={{ color: '#3b82f6', borderBottomColor: 'rgba(59,130,246,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#3b82f6' }}
        >
          Inicio
        </a>

        {/* Divider */}
        <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {categories.map(({ label, slug }) => (
          <a
            key={slug}
            href={`/categoria/${slug}`}
            className="px-4 h-full flex items-center text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-orange-400 whitespace-nowrap"
            style={{ color: 'rgba(255,255,255,0.55)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f97316' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
