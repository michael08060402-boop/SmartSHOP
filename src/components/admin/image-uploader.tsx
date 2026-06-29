'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

export function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)

    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue

      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, { upsert: false })

      if (uploadError) {
        setError(`Error subiendo ${file.name}: ${uploadError.message}`)
        continue
      }

      const { data } = supabase.storage.from('products').getPublicUrl(fileName)
      uploaded.push(data.publicUrl)
    }

    onChange([...value, ...uploaded])
    setUploading(false)
  }

  function removeImage(url: string) {
    onChange(value.filter(u => u !== url))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
        style={{
          borderColor: uploading ? '#3b82f6' : 'rgba(255,255,255,0.12)',
          background: uploading ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)',
          minHeight: 100,
          padding: '20px 16px',
        }}
      >
        {uploading ? (
          <>
            <Loader2 size={22} className="animate-spin" style={{ color: '#3b82f6' }} />
            <p className="text-sm" style={{ color: '#3b82f6' }}>Subiendo imágenes...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <Upload size={18} style={{ color: '#f97316' }} />
            </div>
            <p className="text-sm font-medium text-white">Arrastra imágenes aquí</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              o haz clic para seleccionar · JPG, PNG, WEBP
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={url} className="relative group rounded-xl overflow-hidden"
              style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {url.startsWith('http') ? (
                <img src={url} alt={`imagen ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={24} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ background: 'rgba(0,0,0,0.7)', color: '#f87171' }}
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: '#f97316', color: '#fff' }}>
                  PRINCIPAL
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
        {value.length} imagen{value.length !== 1 ? 's' : ''} · La primera será la imagen principal
      </p>
    </div>
  )
}
