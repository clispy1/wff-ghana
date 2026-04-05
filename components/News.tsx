'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    id: 1,
    category: 'Announcements',
    date: 'April 2, 2026',
    title: 'Cameroon 2026: The Road Begins',
    excerpt: 'WFF International has officially announced Yaoundé, Cameroon as the host city for the 2026 World Championships. Here is what it means for Team Ghana.',
    image: 'https://picsum.photos/seed/news1/800/600',
    content: 'The World Fitness Federation (WFF) International executive committee has officially selected Yaoundé, Cameroon to host the 2026 World Championships this September. This marks a historic moment as the prestigious event returns to African soil.\n\nFor WFF Ghana, this proximity presents an unprecedented opportunity. "We are aiming to send our largest and most competitive team yet," stated WFF Ghana President Kwame Mensah. "The travel logistics are favorable, allowing our athletes to arrive in peak condition without the stress of long-haul international flights."\n\nThe national qualifiers will be more competitive than ever, as athletes vie for a spot on the roster. Training camps will commence immediately following the national selections in May.'
  },
  {
    id: 2,
    category: 'Results',
    date: 'March 10, 2026',
    title: 'Accra Muscle Showdown 2026 Results',
    excerpt: 'Full results and highlights from the first major open event of the year. See who took home the overall titles.',
    image: 'https://picsum.photos/seed/news2/800/600',
    content: 'The Accra International Conference Centre was electrified last weekend as over 100 athletes took the stage for the Accra Muscle Showdown. The event served as an early indicator of the talent pool for the upcoming national qualifiers.\n\nIn the Men\'s Bodybuilding Open, veteran Kofi Mensah secured the overall title with a flawless routine and unmatched conditioning. The Bikini division saw a tight battle, with Ama Osei edging out the competition through superior stage presentation.\n\n"The caliber of athletes we are seeing this early in the season is astounding," noted head judge Samuel Ofori. "If this is any indication, Team Ghana will be a force to be reckoned with in Cameroon."'
  },
  {
    id: 3,
    category: 'Athlete Spotlights',
    date: 'February 15, 2026',
    title: 'Rising Star: Kwesi Appiah\'s Classic Journey',
    excerpt: 'An exclusive interview with the Classic Physique sensation on his training philosophy and goals for the world stage.',
    image: 'https://picsum.photos/seed/news3/800/600',
    content: 'At just 24 years old, Kwesi Appiah has become the face of the Classic Physique division in Ghana. Embodying the golden era ideals of a small waist, broad shoulders, and sweeping quads, Appiah\'s rise has been meteoric.\n\n"It\'s not just about getting as big as possible," Appiah explains during a grueling leg session at his home gym in Kumasi. "It\'s about creating art. Every pose should look like a sculpture."\n\nAppiah\'s training focuses heavily on mind-muscle connection and posing practice. He spends up to an hour daily just perfecting his transitions. As he prepares for the national qualifiers, his eyes are firmly set on the ultimate prize: a WFF Pro Card in Cameroon.'
  }
];

export default function News() {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.news-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedArticle && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedArticle]);

  return (
    <section id="news" ref={sectionRef} className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-bebas text-5xl md:text-6xl mb-4">LATEST <span className="text-wff-red">DISPATCHES</span></h2>
            <p className="font-sans text-white/60 max-w-xl">News, results, and stories from the Ghanaian fitness community.</p>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="news-card group cursor-pointer flex flex-col"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden mb-6">
                <Image 
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-wff-red text-white font-sans text-xs font-bold uppercase tracking-widest px-3 py-1">
                  {article.category}
                </div>
              </div>
              
              <div className="flex-grow flex flex-col">
                <div className="font-sans text-xs text-white/50 uppercase tracking-widest mb-3">{article.date}</div>
                <h3 className="font-bebas text-3xl mb-3 group-hover:text-wff-red transition-colors">{article.title}</h3>
                <p className="font-sans text-sm text-white/60 mb-6 line-clamp-3 flex-grow">{article.excerpt}</p>
                
                <div className="flex items-center text-wff-red font-sans text-sm font-bold uppercase tracking-widest mt-auto">
                  Read Full Story <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-wff-dark/95 backdrop-blur-md">
          <div 
            ref={modalRef}
            className="bg-[#111] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
          >
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 z-10 bg-black/50 p-2 rounded-full text-white hover:text-wff-red transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative h-[40vh] w-full">
              <Image 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
            </div>

            <div className="p-8 md:p-16 -mt-20 relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-wff-red text-white font-sans text-xs font-bold uppercase tracking-widest px-3 py-1">
                  {selectedArticle.category}
                </span>
                <span className="font-sans text-sm text-white/50 uppercase tracking-widest">
                  {selectedArticle.date}
                </span>
              </div>
              
              <h2 className="font-bebas text-5xl md:text-7xl mb-8 leading-none">{selectedArticle.title}</h2>
              
              <div className="font-sans text-lg text-white/80 leading-relaxed space-y-6 whitespace-pre-line">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
