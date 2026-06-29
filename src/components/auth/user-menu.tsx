'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, User, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { Session } from 'next-auth'

export function UserMenu({ session }: { session: Session }) {
  const [open, setOpen] = useState(false)

  const name = session.user?.name ?? 'Usuario'
  const avatar = session.user?.image
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl overflow-hidden border flex items-center justify-center text-sm font-semibold transition-all duration-200"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-hover)' }}
      >
        {avatar
          ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
          : <span style={{ color: 'var(--accent)' }}>{initials}</span>
        }
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-11 z-50 w-56 rounded-xl border shadow-2xl overflow-hidden"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{session.user?.email}</p>
            </div>
            <div className="p-1">
              <Link href="/perfil" onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--foreground)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                <User size={14} /> Mi perfil
              </Link>
              <Link href="/perfil/pedidos" onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--foreground)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                <ShoppingBag size={14} /> Mis pedidos
              </Link>
              <button
                onClick={() => signOut({ redirectTo: '/login' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'rgb(248,113,113)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                <LogOut size={14} /> Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
