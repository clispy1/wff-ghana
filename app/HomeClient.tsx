'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import WorldChampionships from '@/components/WorldChampionships';
import { SponsorsMarquee } from '@/components/home/SponsorsMarquee';
import { FederationSection } from '@/components/home/FederationSection';
import { JourneySection } from '@/components/home/JourneySection';
import { ChampionshipSection } from '@/components/home/ChampionshipSection';
import { DivisionRegistrySection } from '@/components/home/DivisionRegistrySection';
import { WellnessSection } from '@/components/home/WellnessSection';
import { ArmorySection } from '@/components/home/ArmorySection';
import { GallerySection } from '@/components/home/GallerySection';
import { NewsSection } from '@/components/home/NewsSection';
import { PartnershipsSection } from '@/components/home/PartnershipsSection';
import { VendorsSection } from '@/components/home/VendorsSection';
import { BecomeVendorSection } from '@/components/home/BecomeVendorSection';
import { FinalCtaSection } from '@/components/home/FinalCtaSection';
import type { WffEvent } from '@/lib/activeEvent';
import type { HomeContent } from '@/lib/homeContent';
import type { GalleryPhoto } from '@/lib/galleryMedia';
import type { HomeSectionVisibility } from '@/lib/homeSections';

gsap.registerPlugin(ScrollTrigger);

export interface HomeClientProps {
  sponsors: { name: string; role: string }[];
  news: { id: string; date: string; title: string; summary: string }[];
  products: {
    id: string;
    name: string;
    price: number;
    img: string;
    category: string;
    description: string;
  }[];
  eventData: WffEvent | null;
  content: Partial<HomeContent>;
  galleryPhotos: GalleryPhoto[];
  vendors: { id: string; name: string; category: string }[];
  enabledSections: HomeSectionVisibility;
}

export default function HomeClient({
  sponsors,
  news,
  products,
  eventData,
  content,
  galleryPhotos,
  vendors,
  enabledSections,
}: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    president,
    journey,
    championship,
    ambassadors,
    wellness,
    armory,
    gallery,
    news: newsSection,
    partnerships,
    becomeVendor,
    contactCta,
  } = content;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Universal Reveal Animation - Simplified and standardized for consistency
      gsap.utils.toArray('.reveal-target').forEach((el: any) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              // Play once when scrolling down, reverse when scrolling all the way back up
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Refresh ScrollTrigger after a short delay to account for any layout shifts
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative bg-wff-dark min-h-screen overflow-hidden">

      {/* 1. Hero Module — always shown */}
      <Hero event={eventData} />

      {/* 2. Authentic Partners / Sponsors Strip (Moving Marquee) */}
      {enabledSections.sponsorsMarquee && <SponsorsMarquee sponsors={sponsors} />}

      {/* 3. Federation About Section */}
      {enabledSections.federation && <FederationSection president={president} />}

      {/* 4. Journey Panel (Grid layout instead of horizontal scroll) */}
      {enabledSections.journey && <JourneySection journey={journey} />}

      {/* 5. Natural Championship Details Panel */}
      {enabledSections.championship && (
        <ChampionshipSection eventData={eventData} championship={championship} />
      )}

      {/* 5.5 Continental Rulebook (World Championships Component) */}
      {enabledSections.rulebook && <WorldChampionships />}

      {/* 6. Honest Division Registry */}
      {enabledSections.divisions && <DivisionRegistrySection ambassadors={ambassadors} />}

      {/* 7. Athletic Rest & Wellness Physiology */}
      {enabledSections.wellness && <WellnessSection wellness={wellness} />}

      {/* 8. The Official Merchandise Shop (Armory) */}
      {enabledSections.armory && <ArmorySection armory={armory} products={products} />}

      {/* 9. Media & Gallery Overview */}
      {enabledSections.gallery && (
        <GallerySection gallery={gallery} galleryPhotos={galleryPhotos} />
      )}

      {/* 10. Honest News Section (Official Chronicle Files) */}
      {enabledSections.news && <NewsSection newsSection={newsSection} news={news} />}

      {/* 11. Affiliation and Sector Partnerships */}
      {enabledSections.partnerships && <PartnershipsSection partnerships={partnerships} />}

      {/* 11.5 Event Vendors — approved vendors from the admin dashboard */}
      {enabledSections.vendors && <VendorsSection vendors={vendors} />}

      {/* 11.6 Become a Vendor — pitch + apply CTA */}
      {enabledSections.becomeVendor && <BecomeVendorSection becomeVendor={becomeVendor} />}

      {/* 12. Final Athlete Application Call to Action */}
      {enabledSections.finalCta && <FinalCtaSection contactCta={contactCta} />}

    </main>
  );
}
