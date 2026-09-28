'use client';

import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

export interface NewsPost {
  id: string;
  date: string;
  title: string;
  summary: string;
}

/** Honest News section — official chronicle files. */
export function NewsSection({
  newsSection,
  news,
}: {
  newsSection?: HomeContent['news'];
  news: NewsPost[];
}) {
  if (!newsSection) return <SectionSkeleton />;

  return (
    <section className="py-24 bg-page border-b border-fg/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="font-bebas text-5xl md:text-7xl text-fg mb-12 text-center reveal-target select-none">
          {newsSection.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.length === 0 ? (
            <p className="text-fg/40 text-sm col-span-full text-center py-8">
              News articles will be posted here soon.
            </p>
          ) : (
            news.map((post) => (
              <div
                key={post.id}
                className="reveal-target bg-page border border-fg/10 p-8 hover:-translate-y-1.5 transition-transform duration-500 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <p className="font-sans text-wff-red text-xs font-bold uppercase tracking-widest mb-4">
                    {post.date}
                  </p>
                  <h3 className="font-bebas text-2xl text-fg mb-4 tracking-wide leading-tight">
                    {post.title}
                  </h3>
                  <p className="font-sans text-xs text-fg/55 leading-relaxed mb-6">
                    {post.summary}
                  </p>
                </div>
                <span className="font-sans text-xs font-black uppercase tracking-widest text-gold-ink block cursor-pointer hover:text-fg transition-colors mt-4">
                  RESOURCES →
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
