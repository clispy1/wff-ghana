'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { fetchGalleryMedia, type GalleryPhoto } from '@/lib/galleryMedia';

gsap.registerPlugin(ScrollTrigger);

export default function MediaClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    fetchGalleryMedia().then(setPhotos);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      // Video Scrubbing
      if (videoContainerRef.current && videoRef.current) {
        // Ensure video is loaded before getting duration
        videoRef.current.addEventListener('loadedmetadata', () => {
          ScrollTrigger.create({
            trigger: videoContainerRef.current,
            start: 'top top',
            end: '+=200%', // Pin for 2 viewport heights
            pin: true,
            scrub: 0.5, // Smooth scrubbing
            onUpdate: (self) => {
              if (videoRef.current && videoRef.current.duration) {
                // Scrub video based on scroll progress
                videoRef.current.currentTime = videoRef.current.duration * self.progress;
              }
            }
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (galleryRef.current) {
        const tiles = galleryRef.current.querySelectorAll('.gallery-tile');
        gsap.fromTo(tiles,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [photos]);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">

      {/* Scroll-Scrub Video Section */}
      <div ref={videoContainerRef} className="w-full h-screen relative overflow-hidden bg-black mb-24">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none bg-black/40">
          <h2 className="font-bebas text-6xl md:text-9xl text-white tracking-widest mix-blend-overlay">THE JOURNEY</h2>
          <p className="font-sans text-wff-gold tracking-[0.5em] uppercase text-sm md:text-lg mt-4">Scroll to explore</p>
        </div>
        {/* Using a placeholder video that allows seeking */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-80"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          muted
          playsInline
          preload="auto"
        />
      </div>

      <div className="container mx-auto px-6">

        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-20 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE <span className="text-wff-red">GALLERY</span></h1>
          <p className="font-sans text-xl text-white/70">
            Relive the glory. Exclusive moments from the WFF Ghana Championships, Fitness Ghana Awards, and behind-the-scenes action.
          </p>
        </div>

        {/* Gallery Grid */}
        <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-32">
          {photos.length === 0 ? (
            <p className="text-white/40 text-sm col-span-full text-center py-12">
              Photos will be posted here soon.
            </p>
          ) : (
            photos.map((photo) => (
              <div
                key={photo.id}
                className="gallery-tile relative w-full aspect-square bg-[#111] border border-white/10 group overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-wff-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
                <Image
                  src={photo.image_url}
                  alt={photo.caption || 'WFF Ghana gallery photo'}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <p className="font-bebas text-2xl text-white">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
