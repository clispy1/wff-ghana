import Link from 'next/link';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import ClearCartOnSuccess from './ClearCartOnSuccess';

export const dynamic = 'force-dynamic';

const COPY = {
  success: {
    registration: {
      title: 'ENTRY FEE RECEIVED',
      body: 'Your payment is confirmed and your application is now with the selection committee. You will hear from us by email once it has been reviewed.',
    },
    shop: {
      title: 'ORDER CONFIRMED',
      body: 'Payment received. Your gear is being prepared for dispatch — we will email you tracking details shortly.',
    },
    ticket: {
      title: 'TICKETS SECURED',
      body: 'Payment received. Your tickets have been reserved and confirmation is on its way to your inbox.',
    },
    default: {
      title: 'PAYMENT CONFIRMED',
      body: 'Your payment has been received. A confirmation email is on its way.',
    },
  },
  failed: {
    title: 'PAYMENT NOT COMPLETED',
    body: 'The transaction did not go through and you have not been charged for it. You can safely try again.',
  },
  error: {
    title: 'PAYMENT UNCONFIRMED',
    body: 'We could not confirm this payment. If money left your account, quote the reference below to support and we will resolve it.',
  },
};

export default async function PaymentStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; reference?: string; purpose?: string; message?: string }>;
}) {
  const params = await searchParams;
  const status = params.status === 'success' ? 'success' : params.status === 'failed' ? 'failed' : 'error';
  const purpose = (params.purpose || 'default') as keyof typeof COPY.success;

  const copy =
    status === 'success'
      ? COPY.success[purpose] || COPY.success.default
      : status === 'failed'
        ? COPY.failed
        : COPY.error;

  const Icon = status === 'success' ? CheckCircle : status === 'failed' ? XCircle : AlertTriangle;
  const accent =
    status === 'success' ? 'text-wff-gold' : status === 'failed' ? 'text-wff-red' : 'text-yellow-500';

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark flex items-center justify-center">
      {status === 'success' && params.purpose === 'shop' && <ClearCartOnSuccess />}

      <div className="container mx-auto px-6 text-center max-w-2xl">
        <Icon className={`w-24 h-24 ${accent} mx-auto mb-8`} />

        <h1 className="font-bebas text-5xl md:text-7xl mb-6 text-white">{copy.title}</h1>

        <p className="font-sans text-white/60 text-base leading-relaxed mb-4">
          {params.message || copy.body}
        </p>

        {params.reference && (
          <p className="font-sans text-xs text-white/40 mb-12">
            Reference:{' '}
            <span className="text-wff-gold font-bold tracking-wider">{params.reference}</span>
          </p>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-block border border-wff-gold text-wff-gold font-bebas text-2xl px-10 py-3 hover:bg-wff-gold hover:text-black transition-colors"
          >
            BACK TO HOME
          </Link>
          {status !== 'success' && (
            <Link
              href={purpose === 'shop' ? '/checkout' : purpose === 'ticket' ? '/championship#tickets' : '/register'}
              className="inline-block border border-white/20 text-white font-bebas text-2xl px-10 py-3 hover:bg-white hover:text-black transition-colors"
            >
              TRY AGAIN
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
