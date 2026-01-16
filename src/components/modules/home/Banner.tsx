'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
  return (
    <section className="relative flex h-full max-h-200 min-h-[calc(100vh-119px)] w-full items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banner.png"
          alt="Banner Image"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Content Container */}
      <div className="app-container relative z-10 flex size-full items-end pb-10 md:pb-16">
        {/* Horizontal Card Design */}
        <div className="flex w-full max-w-140 flex-col items-center justify-between gap-8 rounded-xl bg-white p-8 shadow-xl md:flex-row">
          {/* Left Side: Text */}

          <h1 className="text-primary flex-1 text-2xl font-semibold">
            Sell what you don&apos;t wear. Find what you love.
          </h1>

          {/* Right Side: Buttons */}
          <div className="flex w-full flex-col gap-3 md:w-65">
            <Button className="h-13 w-full rounded-xl text-base">Sell Now</Button>

            <Link href="/how-it-works">
              <Button variant="outline" className="border-primary h-13 w-full rounded-xl text-base">
                Learn how it works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
