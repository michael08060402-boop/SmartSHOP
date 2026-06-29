import { db } from '@/lib/db'
import { Users, ShoppingBag, Calendar, Shield, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminUsuariosPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  })

  const admins = users.filter(u => u.role === 'ADMIN').length

  return (
    <div className="p-6 space-y-6" style={{ background: '#111214', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ color: '#f97316', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }}>
            Admins: {admins}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
            Usuarios: {users.length - admins}
          </span>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Users size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-x-auto" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
         <div className="min-w-[640px]">

          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-bold tracking-widest uppercase"
            style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="col-span-3">Usuario</span>
            <span className="col-span-3">Correo</span>
            <span className="col-span-2 text-center">Pedidos</span>
            <span className="col-span-2 text-center">Rol</span>
            <span className="col-span-1 text-right">Registro</span>
            <span className="col-span-1"></span>
          </div>

          {/* Rows */}
          {users.map((user, i) => {
            const isAdmin = user.role === 'ADMIN'
            const initials = (user.name ?? user.email ?? 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            return (
              <div
                key={user.id}
                className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center transition-colors"
                style={{
                  borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: isAdmin ? 'rgba(249,115,22,0.03)' : 'transparent',
                }}
              >
                {/* Name + avatar */}
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold"
                    style={{
                      background: isAdmin
                        ? 'linear-gradient(135deg,rgba(249,115,22,0.3),rgba(59,130,246,0.3))'
                        : 'rgba(255,255,255,0.07)',
                      border: isAdmin ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: isAdmin ? '#f97316' : 'rgba(255,255,255,0.5)',
                    }}>
                    {user.image
                      ? <img src={user.image} alt={initials} className="w-full h-full object-cover" />
                      : initials}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{user.name ?? '—'}</p>
                </div>

                {/* Email */}
                <p className="col-span-3 text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {user.email}
                </p>

                {/* Orders count */}
                <div className="col-span-2 flex items-center justify-center gap-1.5">
                  <ShoppingBag size={11} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <span className="text-sm font-bold text-white">{user._count.orders}</span>
                </div>

                {/* Role */}
                <div className="col-span-2 flex justify-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={isAdmin
                      ? { color: '#f97316', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }
                      : { color: '#3b82f6', background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {isAdmin ? <Shield size={9} /> : <User size={9} />}
                    {isAdmin ? 'Admin' : 'Usuario'}
                  </span>
                </div>

                {/* Join date */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <Calendar size={10} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {new Date(user.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </span>
                </div>

                {/* Ver historial */}
                <div className="col-span-1 flex justify-end">
                  <Link href={`/admin/usuarios/${user.id}`}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                    Ver <ChevronRight size={10} />
                  </Link>
                </div>
              </div>
            )
          })}
         </div>
        </div>
      )}
    </div>
  )
}
