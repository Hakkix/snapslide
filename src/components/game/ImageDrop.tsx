'use client';

import { useState } from 'react';
import { ImageUp } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $imageUrl, setImageUrl } from '@/stores/gameStore';
import { DEFAULT_IMAGE } from '@/lib/puzzle';

export function ImageDrop() {
  const imageUrl = useStore($imageUrl);
  const [dragging, setDragging] = useState(false);

  const pickFile = (file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    // Client-side only: the object URL points at the local file, nothing is uploaded.
    const previous = $imageUrl.get();
    if (previous?.startsWith('blob:')) URL.revokeObjectURL(previous);
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files?.[0]);
      }}
      className={`group relative flex h-36 cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-dashed p-4 transition-colors ${
        dragging ? 'border-orchid bg-orchid/10' : 'border-white/15 bg-ink-2 hover:border-white/30'
      }`}
    >
      <div
        className="size-24 shrink-0 rounded-xl bg-cover bg-center ring-1 ring-white/10"
        style={{ backgroundImage: `url(${imageUrl ?? DEFAULT_IMAGE})` }}
      />
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-medium">
          <ImageUp className="size-4 text-orchid" />
          {imageUrl ? 'Swap photo' : 'Use your photo'}
        </p>
        <p className="mt-1 text-sm text-zinc-400">Click or drop a PNG, JPG or WebP. Square images work best.</p>
      </div>
      <input
        type="file"
        className="sr-only"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </label>
  );
}
