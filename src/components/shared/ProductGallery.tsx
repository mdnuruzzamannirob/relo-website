'use client';

import Image from 'next/image';
import { useState } from 'react';
import ImageZoomPreview from './ImageZoomPreview';

interface Props {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div
        onClick={() => setOpen(true)}
        className="border-brand-100 bg-brand-50 relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border"
      >
        <Image src={images[active]} alt={title} fill priority className="object-cover" />
      </div>

      {/* THUMBNAILS (ALWAYS BELOW) */}
      <div className="mt-4 flex w-full gap-3 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActive(i)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border ${
              active === i ? 'border-primary ring-primary ring-2' : 'border-brand-100'
            }`}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* MODAL */}
      {open && <ImageZoomPreview images={images} index={active} onClose={() => setOpen(false)} />}
    </div>
  );
}
