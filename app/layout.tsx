import type {Metadata} from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import CustomCursor from '@/components/CustomCursor';
import Loader from '@/components/Loader';
import ScrubberNavbar from '@/components/ScrubberNavbar';
import Footer from '@/components/Footer';
import SmoothScrolling from '@/components/SmoothScrolling';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'WFF Ghana | 2026 All Africa Championship',
  description: 'Official digital home for the World Fitness Federation (WFF) Ghana. Host of the 2026 All Africa Championship.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="text-white font-sans antialiased overflow-x-hidden selection:bg-wff-red selection:text-white" suppressHydrationWarning>
        <SmoothScrolling>
          <div className="noise-overlay"></div>
          <CustomCursor />
          <Loader />
          <ScrubberNavbar />
          {children}
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
