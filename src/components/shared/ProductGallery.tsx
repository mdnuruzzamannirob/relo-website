'use client';

import Image from 'next/image';
import { useState } from 'react';
import ImageZoomPreview from './ImageZoomPreview';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

import { cn } from '@/lib/utils/cn';

interface Props {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const safeImages = images.length > 0 ? images : ['/images/banner.png'];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div
        onClick={() => setOpen(true)}
        className="border-brand-100 bg-brand-50 relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border"
      >
        <Image src={safeImages[active]} alt={title} fill priority className="object-cover" />
      </div>

      {/* THUMBNAILS SWIPER */}
      <Swiper modules={[FreeMode]} spaceBetween={12} slidesPerView="auto" freeMode className="mt-4">
        {safeImages.map((img, i) => (
          <SwiperSlide key={img} className="w-24!">
            <button
              onClick={() => setActive(i)}
              className={cn(
                'relative size-24 overflow-hidden rounded-lg border-4 transition',
                active === i ? 'border-primary' : 'border-transparent',
              )}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* MODAL */}
      {open && (
        <ImageZoomPreview images={safeImages} index={active} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
