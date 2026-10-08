import Link from 'next/link';
import Registration from '@/components/Registration';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchActiveEvent } from '@/lib/activeEvent';
import { isEventOver } from '@/lib/eventPhase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Athlete Registration | WFF Ghana 2026 All Africa Championship',
  description:
    'Register to compete in the 2026 WFF All Africa Championship. Complete your athlete profile, competition details, documents, and payment in one place.',
};

export default async function RegisterPage() {
  const event = await fetchActiveEvent(await createServerSupabase());

  // Once the event is over the form closes; a new active event with
  // future dates in the admin reopens it.
  if (isEventOver(event)) {
    return (
      <main className="min-h-screen bg-page pt-40 pb-24">
        <div className="container mx-auto px-6 max-w-xl text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-wff-red mb-4">Athlete Registration</p>
          <h1 className="font-bebas text-6xl md:text-7xl leading-none mb-6">Registration is closed</h1>
          <p className="font-sans text-fg/60 leading-relaxed mb-10">
            The {event?.title || 'championship'} has ended. Thank you to every athlete who took the stage.
            Registration for the next championship will open here. Follow us for the announcement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/media"
              className="bg-wff-red text-white font-bebas text-xl tracking-wider px-8 py-3 rounded-lg hover:bg-white hover:text-wff-red transition-colors"
            >
              View the Gallery
            </Link>
            <Link
              href="/contact"
              className="border border-fg/20 text-fg font-bebas text-xl tracking-wider px-8 py-3 rounded-lg hover:border-wff-gold hover:text-gold-ink transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page pt-28">
      <Registration />
    </main>
  );
}
