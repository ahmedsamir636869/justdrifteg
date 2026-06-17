'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ImagePlus, X, Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CarImage {
  id: string
  url: string
  storage_path: string
  is_primary: boolean
}

export default function CarImageUpload({ carId, existingImages, isOwner }: { carId: string, existingImages: CarImage[], isOwner: boolean }) {
  const [images, setImages] = useState<CarImage[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} must be under 5MB`)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const filePath = `${user.id}/${carId}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath)

        const { data: imageRow, error: dbError } = await supabase
          .from('car_images')
          .insert({
            car_id: carId,
            url: publicUrl,
            storage_path: filePath,
            is_primary: images.length === 0,
          })
          .select()
          .single()

        if (dbError) throw dbError

        setImages(prev => [...prev, imageRow])
      }
      toast.success('Photos uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (image: CarImage) => {
    try {
      await supabase.storage.from('car-images').remove([image.storage_path])
      await supabase.from('car_images').delete().eq('id', image.id)
      setImages(prev => prev.filter(img => img.id !== image.id))
      toast.success('Photo deleted')
    } catch (err: any) {
      toast.error(err.message || 'Delete failed')
    }
  }

  const handleSetPrimary = async (image: CarImage) => {
    try {
      // Unset all primary
      await supabase.from('car_images').update({ is_primary: false }).eq('car_id', carId)
      // Set new primary
      await supabase.from('car_images').update({ is_primary: true }).eq('id', image.id)
      setImages(prev => prev.map(img => ({ ...img, is_primary: img.id === image.id })))
      toast.success('Cover photo updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to set primary')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
              <img src={img.url} alt="Car photo" className="w-full h-full object-cover" />
              {img.is_primary && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3" /> Cover
                </div>
              )}
              {isOwner && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {!img.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(img)}
                      className="bg-neutral-800 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                      title="Set as cover photo"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(img)}
                    className="bg-neutral-800 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    title="Delete photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {isOwner && (
        <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-800 rounded-xl cursor-pointer hover:border-zinc-100/50 transition-colors bg-neutral-950/50 group">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleUpload}
            ref={fileInputRef}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="w-8 h-8 text-zinc-100 animate-spin" />
          ) : (
            <ImagePlus className="w-8 h-8 text-neutral-600 group-hover:text-zinc-100 transition-colors" />
          )}
          <span className="text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors">
            {uploading ? 'Uploading...' : 'Click to add photos'}
          </span>
        </label>
      )}
    </div>
  )
}
