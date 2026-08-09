'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { uploadPackageImage } from '@/lib/actions/upload';
import { ImagePlus, X, Loader2 } from 'lucide-react';

export function ImageUploadField({ name = 'cover_image_url' }: { name?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const fd = new FormData();
    fd.append('file', file);
    const result = await uploadPackageImage(fd);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      setPreview(null);
      return;
    }

    setUrl(result.url ?? '');
    toast.success('Image upload ho gayi!');
  }

  function handleClear() {
    setPreview(null);
    setUrl('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-2">
      {/* hidden value submitted with form */}
      <input type="hidden" name={name} value={url} />

      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 size={28} className="animate-spin text-white" />
            </div>
          )}
          {!loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 py-8 transition-colors hover:border-primary hover:bg-primary/5">
          <ImagePlus size={28} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Image choose karein (JPG, PNG — max 5MB)</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      )}
    </div>
  );
}
