'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { HomeContent } from '@/lib/homeContent';
import type { GalleryPhoto } from '@/lib/galleryMedia';
import { SectionSkeleton } from './SectionSkeleton';

/** Media & Gallery overview — latest gallery photos. */
export function GallerySection({
  gallery,
  galleryPhotos,
}: {
  gallery?: HomeContent['gallery'];
  galleryPhotos: GalleryPhoto[];
}) {
  if (!gallery) return <SectionSkeleton />;

  return (
    <section className="py-24 bg-[#050505] border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-12 reveal-target">
          <div>
            <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-3">
              {gallery.supertitle}
            </p>
            <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">
              {gallery.title}
            </h2>
          </div>
          <Link
            href="/media"
            className="hidden md:inline-flex font-sans text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            View Media & Gallery →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryPhotos.length === 0 ? (
            <p className="text-white/40 text-sm col-span-full text-center py-8">
              Photos will be posted here soon.
            </p>
          ) : (
            galleryPhotos.map((photo) => (
              <div
                key={photo.id}
                className="reveal-target aspect-square bg-[#111] border border-white/10 hover:border-wff-red transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl relative group"
              >
                <Image
                  src={photo.image_url}
                  alt={photo.caption || 'Gallery Snip'}
                  role="presentation"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 opacity-55 group-hover:opacity-85 transition-opacity duration-300"
                />
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-center md:hidden reveal-target">
          <Link
            href="/media"
            className="inline-block border border-white/15 text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 w-full"
          >
            View Media & Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
