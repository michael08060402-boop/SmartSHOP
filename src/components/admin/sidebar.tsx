'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import {
  LayoutDashboard, Package, Tag, Users, ShoppingBag,
  Settings, LogOut, ChevronRight, Menu, X,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { label: 'Dashboard',  href: '/admin',           icon: LayoutDashboard, accent: 'blue'   },
  { label: 'Productos',  href: '/admin/productos',  icon: Package,         accent: 'orange' },
  { label: 'Categorías', href: '/admin/categorias', icon: Tag,             accent: 'blue'   },
  { label: 'Pedidos',    href: '/admin/pedidos',    icon: ShoppingBag,     accent: 'orange' },
  { label: 'Usuarios',   href: '/admin/usuarios',   icon: Users,           accent: 'blue'   },
  { label: 'Config.',    href: '/admin/config',     icon: Settings,        accent: 'orange' },
]

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #f97316)', color: '#fff' }}>
            S
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">
              <span style={{ color: '#3b82f6' }}>Smart</span>
              <span style={{ color: '#f97316' }}>SHOP</span>
            </span>
            <p className="text-[9px] font-semibold tracking-widest uppercase leading-none" style={{ color: 'rgba(249,115,22,0.6)' }}>
              Admin Panel
            </p>
          </div>
          {/* Close button — mobile only */}
          <button
            className="md:hidden ml-auto flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)' }}
            onClick={() => setOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-bold tracking-widest uppercase px-3 mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Menú principal
        </p>
        {navItems.map(({ label, href, icon: Icon, accent }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          const isOrange = accent === 'orange'
          const accentColor  = isOrange ? '#f97316' : '#3b82f6'
          const accentBg     = isOrange ? 'rgba(249,115,22,0.12)' : 'rgba(59,130,246,0.12)'
          const accentBorder = isOrange ? '#f97316' : '#3b82f6'

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden"
              style={{
                background: active ? accentBg : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ background: accentBorder }} />
              )}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
                style={{
                  background: active ? `${accentColor}25` : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid ${accentColor}40` : '1px solid transparent',
                }}>
                <Icon size={14} style={{ color: active ? accentColor : 'rgba(255,255,255,0.3)' }} />
              </div>
              {label}
              {active && <ChevronRight size={12} className="ml-auto" style={{ color: accentColor }} />}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-4 pt-3 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(59,130,246,0.3))',
              border: '1px solid rgba(249,115,22,0.5)',
              color: '#f97316',
            }}>
            {user.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name ?? 'Admin'}</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ redirectTo: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-xl"
        style={{ background: '#0d0e10', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
        onClick={() => setOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Overlay — mobile only */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — desktop: static | mobile: drawer */}
      <aside
        className={`
          flex flex-col border-r min-h-screen h-screen overflow-y-auto
          fixed md:sticky top-0 left-0 z-50 w-64 shrink-0
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          background: '#0d0e10',
          borderColor: 'rgba(255,255,255,0.07)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        }}
      >
        {sidebarContent}
      </aside>

    </>
  )
}
