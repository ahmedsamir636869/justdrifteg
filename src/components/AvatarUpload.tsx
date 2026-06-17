'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { updateAvatarUrl } from '@/app/actions/profile'
import { Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function AvatarUpload({ currentUrl, username, hideText = false }: { currentUrl: string | null, username: string, hideText?: boolean }) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}` // Storing avatars in a subfolder of car-images

      // Upload to the 'car-images' bucket (we will reuse it for avatars)
      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath)

      await updateAvatarUrl(publicUrl)
      toast.success('Avatar updated successfully')

    } catch (error: any) {
      toast.error(error.message || 'Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
          {currentUrl ? (
            <Image src={currentUrl} alt={username} fill sizes="96px" className="object-cover" />
          ) : (
            <span className="text-3xl font-bold text-zinc-500">{username[0]?.toUpperCase()}</span>
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer">
            {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
          </div>
        </div>

        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
        
        <label 
          htmlFor="single" 
          className="absolute inset-0 cursor-pointer rounded-full"
        />
      </div>
      {!hideText && <p className="text-xs text-zinc-500">Click to upload new avatar</p>}
    </div>
  )
}
