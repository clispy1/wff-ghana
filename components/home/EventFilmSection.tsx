'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Clapperboard } from 'lucide-react';
import type { HomeContent } from '@/lib/homeContent';

/** "https://youtu.be/ID", "…/watch?v=ID", "…/shorts/ID", "…/embed/ID" → ID. */
export function youTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

/**
 * The official event film, directly under the hero. Admin → Homepage
 * Content → Event Film sets it: a YouTube link (recommended) or an
 * uploaded video file. With no video set it shows a "coming soon"
 * placeholder instead of an empty player.
 */
export function EventFilmSection({ film }: { film?: HomeContent['eventFilm'] }) {
  const [playing, setPlaying] = useState(false);
  if (!film) return null;

  const url = film.videoUrl?.trim() || '';
  const ytId = url ? youTubeId(url) : null;
  const poster = film.posterUrl || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '/hero-bg.jpeg');

  let player: React.ReactNode;
  if (ytId && playing) {
    player = (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
        title={film.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    );
  } else if (ytId) {
    // Thumbnail first, player on click: the YouTube embed is heavy and
    // shouldn't load for every visitor who never presses play.
    player = (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${film.title}`}
        className="group absolute inset-0 w-full h-full"
      >
        <Image src={poster} alt="" fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" />
        <span className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-wff-red text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <Play size={36} className="ml-1.5" fill="currentColor" />
          </span>
        </span>
      </button>
    );
  } else if (url) {
    player = (
      <video
        src={url}
        poster={film.posterUrl || undefined}
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full bg-black"
      />
    );
  } else {
    player = (
      <div className="absolute inset-0">
        <Image src={poster} alt="" fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover blur-sm scale-105 opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-fg/30 flex items-center justify-center mb-5">
            <Clapperboard size={30} className="text-gold-ink" />
          </span>
          <p className="font-bebas text-3xl md:text-4xl tracking-wide">Event film coming soon</p>
          <p className="font-sans text-xs md:text-sm text-fg/60 mt-2">The official highlights are in the edit. Check back shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <section aria-label={film.title} className="site-dark bg-page text-fg py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-8 md:mb-10 max-w-2xl">
          {film.supertitle && (
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-wff-red mb-3">{film.supertitle}</p>
          )}
          <h2 className="font-bebas text-5xl md:text-7xl leading-none">{film.title}</h2>
          {film.description && (
            <p className="font-sans text-fg/60 text-sm md:text-base leading-relaxed mt-4">{film.description}</p>
          )}
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-fg/10 bg-black shadow-2xl">
          {player}
        </div>
      </div>
    </section>
  );
}
