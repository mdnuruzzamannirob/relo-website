'use client';

import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
}

export default function ImageZoomPreview({ images, index, onClose }: Props) {
  const [current, setCurrent] = useState(index);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const clickStart = useRef({ x: 0, y: 0 });
  const backdropRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const prev = () => {
    reset();
    setCurrent((p) => (p === 0 ? images.length - 1 : p - 1));
  };

  const next = () => {
    reset();
    setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Mouse
  const onMouseDown = (e: React.MouseEvent) => {
    clickStart.current = { x: e.clientX, y: e.clientY };

    if (scale > 1) {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const onMouseUp = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - clickStart.current.x);
    const dy = Math.abs(e.clientY - clickStart.current.y);

    isDragging.current = false;

    if (dx < 5 && dy < 5) {
      if (scale === 1) setScale(2);
      else reset();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-white/90 p-2"
      >
        <X className="h-5 w-5" />
      </button>

      {/* IMAGE STAGE */}
      <div className="relative flex h-full items-center justify-center">
        {/* Prev */}
        <button onClick={prev} className="fixed left-4 z-40 rounded-full bg-white/90 p-2">
          <ChevronLeft />
        </button>

        {/* Image */}
        <div
          className="relative h-[95vh] w-[95vw] overflow-hidden"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={() => (isDragging.current = false)}
        >
          <Image
            src={images[current]}
            alt="Preview"
            fill
            draggable={false}
            className="max-h-[95vh] max-w-[95vw] object-contain select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? 'grab' : 'zoom-in',
            }}
          />
        </div>

        {/* Next */}
        <button onClick={next} className="fixed right-4 z-40 rounded-full bg-white/90 p-2">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
