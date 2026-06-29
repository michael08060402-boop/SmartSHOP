import { getAllSettings } from '@/lib/settings'
import { ConfigForm } from './config-form'
import { Settings } from 'lucide-react'

export default async function AdminConfigPage() {
  const settings = await getAllSettings()

  return (
    <div className="p-6 space-y-6" style={{ background: '#111214', minHeight: '100vh' }}>
      <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Ajustes generales de la tienda
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }}>
          <Settings size={16} style={{ color: '#f97316' }} />
        </div>
      </div>

      <div className="max-w-2xl">
        <ConfigForm settings={settings} />
      </div>
    </div>
  )
}
