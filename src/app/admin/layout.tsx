import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="min-h-screen flex" style={{ background: '#111214' }}>
      <AdminSidebar user={session.user} />
      <main className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0" style={{ background: '#111214' }}>
        {children}
      </main>
    </div>
  )
}
