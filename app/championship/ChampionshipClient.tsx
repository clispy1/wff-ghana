"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Ticket,
  Hotel,
  Plane,
  Award,
  ShieldAlert,
  Globe2,
  ClipboardCheck,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import TicketPurchaseModal, { type TicketTier } from "@/components/TicketPurchaseModal";
import {
  fetchActiveEvent,
  formatEventDate,
  formatEventRange,
  type WffEvent,
} from "@/lib/activeEvent";
import {
  EVENT_CONTENT_DEFAULTS,
  fetchEventPageContent,
  formatScheduleDayHeading,
  type EventPageContent,
} from "@/lib/eventContent";

gsap.registerPlugin(ScrollTrigger);

// Fixed per-card styling for the first three award cards — visual choices,
// not content, so they stay in code. A 4th admin-added award reuses the last style.
const AWARD_ICON_STYLES = [
  {
    ring: "bg-wff-red/10 border-wff-red/20 shadow-[0_0_15px_rgba(206,17,38,0.2)]",
    stroke: "text-wff-red",
    path: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
  {
    ring: "bg-wff-gold/10 border-wff-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]",
    stroke: "text-wff-gold",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    ring: "bg-green-500/10 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]",
    stroke: "text-green-500",
    path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const initialTickets: any[] = [];
const initialHotels: any[] = [];
// Database states are initialized inside the component.

export default function ChampionshipClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [selectedTicket, setSelectedTicket] = useState<TicketTier | null>(null);

  const [TICKETS, setTickets] = useState<any[]>(initialTickets);
  const [HOTELS, setHotels] = useState<any[]>(initialHotels);
  const [championshipEvent, setChampionshipEvent] = useState<WffEvent | null>(null);
  const [pageContent, setPageContent] = useState<EventPageContent>(EVENT_CONTENT_DEFAULTS);

  useEffect(() => {
    const fetchChampionshipData = async () => {
      try {
        const [ticketsRes, hotelsRes, eventsRes, contentRes] =
          await Promise.all([
            supabase
              .from("ticket_tiers")
              .select("*")
              .order("price", { ascending: true }),
            supabase.from("accommodations").select("*"),
            fetchActiveEvent(),
            fetchEventPageContent(),
          ]);

        if (ticketsRes.data?.length)
          setTickets(
            ticketsRes.data.map((t) => ({
              id: t.id,
              name: t.name,
              price: Number(t.price),
              isVip: Boolean(t.type?.toLowerCase().includes("vip")),
              category: "Tickets",
              description: t.description,
            })),
          );
        if (hotelsRes.data?.length)
          setHotels(
            hotelsRes.data.map((h) => ({
              type: h.type,
              name: h.name,
              location: h.location,
              desc: h.description,
              labelColor: h.label_color,
            })),
          );
        if (eventsRes) setChampionshipEvent(eventsRes);
        setPageContent(contentRes);
      } catch (e) {
        console.error(e);
      }
    };
    fetchChampionshipData();
  }, []);

  const handleBuyTicket = (ticketId: string) => {
    const ticket = TICKETS.find((t) => t.id === ticketId);
    if (ticket) setSelectedTicket(ticket);
  };

  const registrationDeadline = championshipEvent?.registration_deadline
    ? new Date(championshipEvent.registration_deadline)
    : null;
  const registrationOpen = !registrationDeadline || registrationDeadline.getTime() > Date.now();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean scrolling animations
      gsap.fromTo(
        ".reveal-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".reveal-trigger-section",
            start: "top 85%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="pt-32 pb-24 min-h-screen relative overflow-y-auto bg-wff-dark"
    >
      {/* Ambient Red Glow Background */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(206,17,38,0.12) 0%, transparent 70%)",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-16">
          <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.3em] mb-4">
            {championshipEvent?.start_date
              ? `${new Date(championshipEvent.start_date).getFullYear()} Continental Summit`
              : "Continental Summit"}
          </p>
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">
            THE ULTIMATE <span className="text-wff-red">SHOWDOWN</span>
          </h1>
          <p className="font-sans text-lg text-white/70 leading-relaxed md:px-12">
            {championshipEvent?.description ||
              "The preeminent physiques from across Africa will converge in Ghana. Experience state-of-the-art stage layout, fair judging, and unmatched energy."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <MapPin className="text-wff-red" size={24} />,
              title: championshipEvent?.venue_name || "Venue To Be Announced",
              subtitle: championshipEvent?.venue_location || "Accra, Ghana",
            },
            {
              icon: <Calendar className="text-wff-gold" size={24} />,
              title: formatEventDate(championshipEvent?.start_date) || "Date To Be Announced",
              subtitle:
                formatEventRange(
                  championshipEvent?.start_date,
                  championshipEvent?.end_date,
                ) || "To Be Announced",
            },
            {
              icon: <Ticket className="text-white" size={24} />,
              title: TICKETS.length > 0 ? "Pre-Sale Live" : "Tickets Coming Soon",
              subtitle: TICKETS.length > 0 ? "Exquisite Seating Plans" : "Check back soon",
            },
            {
              icon: <Award className="text-wff-gold" size={24} />,
              title: "WFF Pro Cards",
              subtitle: "Multiple Divisions Offered",
            },
            {
              icon: <Globe2 className="text-wff-red" size={24} />,
              title: pageContent.logistics.hostNationName,
              subtitle: pageContent.logistics.hostNationTagline,
            },
            {
              icon: <ClipboardCheck className="text-wff-gold" size={24} />,
              title: registrationOpen ? "Registration Open" : "Registration Closed",
              subtitle: registrationDeadline
                ? `Closes ${formatEventDate(championshipEvent!.registration_deadline)}`
                : "Details to follow",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4"
            >
              <div className="p-3 bg-white/5 rounded-lg">{item.icon}</div>
              <div>
                <h4 className="font-bebas text-xl text-white">{item.title}</h4>
                <p className="font-sans text-xs text-white/50">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {pageContent.logistics.pdfUrl && (
          <div className="flex justify-center mb-16">
            <a
              href={pageContent.logistics.pdfUrl}
              download
              className="inline-flex items-center gap-2 border border-white/20 text-white font-bebas text-lg px-6 py-2.5 rounded hover:bg-white hover:text-black transition-colors"
            >
              <Download size={18} />
              Download Event PDF
            </a>
          </div>
        )}

        {/* Tickets Section */}
        <div
          id="tickets"
          className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-wff-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="font-bebas text-4xl md:text-5xl mb-4 text-white">
                GET YOUR <span className="text-wff-red">TICKETS</span>
              </h2>
              <p className="font-sans text-sm text-white/60 mb-6 leading-relaxed">
                Be a witness to absolute bodybuilding and wellness history.
                Choose Tier 1 general admission seating or enjoy the ultimate
                high-profile VIP experience with fully loaded backstage passes
                and red-carpet access.
              </p>
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg max-w-sm">
                <p className="font-sans text-xs text-white/70">
                  ⚡ <strong>Note:</strong> Tickets purchased online are
                  instantly compiled inside your local order tray. Check your
                  email inbox for official receipts.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TICKETS.length === 0 ? (
                <p className="text-white/40 text-sm col-span-full">
                  Ticket tiers will be announced shortly.
                </p>
              ) : (
                TICKETS.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-8 border rounded-xl flex flex-col justify-between h-80 ${
                      ticket.isVip
                        ? "border-wff-gold bg-wff-gold/5 relative overflow-hidden group"
                        : "border-white/10 bg-black/40 group"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-bebas text-2xl tracking-widest text-white group-hover:text-wff-red transition-colors">
                          {ticket.isVip ? "VIP UNLIMITED" : "GENERAL SEAT"}
                        </span>
                        {ticket.isVip && (
                          <span className="text-[9px] uppercase tracking-wider bg-wff-gold text-black font-extrabold px-2 py-0.5 rounded-sm">
                            Hot Seller
                          </span>
                        )}
                      </div>
                      <h5 className="font-bebas text-3xl mb-1 text-white">
                        {ticket.name}
                      </h5>
                      <p className="font-sans text-xs text-white/50 leading-relaxed mb-6">
                        {ticket.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                      <div>
                        <span className="text-[10px] font-sans text-white/40 block">
                          Price
                        </span>
                        <span className="font-sans font-bold text-lg text-white">
                          ₵ {ticket.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleBuyTicket(ticket.id)}
                        className={`font-bebas text-sm uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-200 ${
                          ticket.isVip
                            ? "bg-wff-gold text-black hover:bg-white hover:text-black font-bold"
                            : "bg-wff-red text-white hover:bg-white hover:text-black font-bold"
                        }`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detailed Running Order & Timetable */}
        <div
          id="schedule"
          className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-16"
        >
          <h2 className="font-bebas text-4xl md:text-5xl text-wff-gold mb-8 pb-4 border-b border-white/10">
            TIMETABLE & RUNNING ORDER
          </h2>

          <div className="space-y-12 font-sans">
            {pageContent.schedule.days.map((day, idx) => {
              // Last day gets the gold dot (final/awards day); every
              // other day gets red — matches the original design intent
              // without needing a color field in the admin form.
              const isLast = idx === pageContent.schedule.days.length - 1;
              const dotColor = isLast
                ? "bg-wff-gold shadow-[0_0_10px_rgba(252,209,22,0.8)]"
                : "bg-wff-red shadow-[0_0_10px_rgba(206,17,38,0.8)]";

              return (
                <div key={idx} className="relative pl-8 border-l border-white/10">
                  <div
                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${dotColor}`}
                  ></div>
                  <h3 className="font-bebas text-2xl md:text-3xl text-white mb-1 uppercase tracking-wider">
                    {formatScheduleDayHeading(day)}
                  </h3>
                  {(day.venueName || day.venueLocation) && (
                    <p className="font-sans text-xs text-wff-gold mb-4">
                      {[day.venueName, day.venueLocation].filter(Boolean).join(" — ")}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {day.blocks.map((block, bIdx) => (
                      <div
                        key={bIdx}
                        className="bg-black/45 border border-white/5 p-6 rounded-xl"
                      >
                        <p className="text-wff-gold text-xs uppercase tracking-widest font-bold mb-4 border-b border-white/10 pb-2 font-mono">
                          {block.label}
                        </p>
                        <ul className="space-y-2 text-xs text-white/70 leading-relaxed">
                          {block.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start">
                              <span className="text-wff-red mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Airport Transfers, Visa Guidance, Accommodations */}
        <div
          id="logistics"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Shuttles & Transports */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="p-3 bg-wff-red/10 border border-wff-red/20 text-wff-red w-fit rounded-lg mb-6">
                <Plane size={24} />
              </div>
              <h3 className="font-bebas text-3xl mb-4 text-white">
                AIRPORTS & VISAS
              </h3>
              <p className="font-sans text-xs text-white/60 leading-relaxed space-y-4">
                <span>{pageContent.logistics.airportIntro}</span>
                <br />
                <br />
                <span>{pageContent.logistics.transportNote}</span>
                <br />
                <br />
                <span>
                  {pageContent.logistics.visaNote} {pageContent.logistics.yellowFeverNote}
                </span>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/40">
              <ShieldAlert size={14} className="text-wff-red" /> Mandatory
              Yellow Card Required
            </div>
          </div>

          {/* Official Host Hotels */}
          <div className="lg:col-span-2 bg-[#111]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-6 pb-2 border-b border-white/10">
              <div className="p-3 bg-wff-gold/15 text-wff-gold rounded-lg">
                <Hotel size={24} />
              </div>
              <h3 className="font-bebas text-3xl text-white">
                OFFICIAL ACCOMMODATIONS
              </h3>
            </div>
            <p className="font-sans text-xs text-white/50 mb-6 leading-relaxed">
              {pageContent.logistics.hotelIntro} Use discount code{" "}
              <span className="text-wff-gold font-bold">
                {pageContent.logistics.hotelDiscountCode}
              </span>{" "}
              when securing rooms.
            </p>

            <div className="space-y-4 font-sans text-xs">
              {HOTELS.map((hotel, hIdx) => (
                <div
                  key={hIdx}
                  className="bg-black/55 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-sm text-[9px] font-extrabold uppercase tracking-wider mb-2 ${hotel.labelColor}`}
                    >
                      {hotel.type}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {hotel.name}
                    </h4>
                    <p className="text-[10px] text-wff-gold mb-2">
                      {hotel.location}
                    </p>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      {hotel.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards & Prizes */}
        <div
          id="awards"
          className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-16"
        >
          <h2 className="font-bebas text-4xl md:text-5xl text-wff-gold mb-8 pb-4 border-b border-white/10">
            AWARDS &amp; PRIZES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            {pageContent.awards.items.map((award, i) => {
              const style = AWARD_ICON_STYLES[Math.min(i, AWARD_ICON_STYLES.length - 1)];
              return (
                <div key={i} className="flex flex-col">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border ${style.ring}`}
                  >
                    <svg
                      className={`w-6 h-6 ${style.stroke}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={style.path}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{award.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{award.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Ghana Roster CTA */}
        <div id="roster" className="mt-24 pt-16 border-t border-white/10 text-center">
          <h2 className="font-bebas text-5xl md:text-7xl mb-4 text-white">
            TEAM <span className="text-wff-red">GHANA</span> ROSTER
          </h2>
          <p className="font-sans text-sm text-white/50 max-w-xl mx-auto mb-8">
            Meet the elite national squad defending the home turf against
            incoming continental challengers.
          </p>
          <Link
            href="/championship/athletes"
            className="inline-block bg-wff-red text-white font-bebas text-xl px-8 py-3 tracking-wider hover:bg-white hover:text-wff-red transition-colors duration-300"
          >
            VIEW FULL ROSTER
          </Link>
        </div>
      </div>

      {/* Ticket Purchase Modal */}
      {selectedTicket && (
        <TicketPurchaseModal
          tier={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </main>
  );
}

