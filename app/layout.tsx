import type {Metadata} from 'next';
import { Oswald, DM_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import CustomCursor from '@/components/CustomCursor';
import Loader from '@/components/Loader';
import ScrubberNavbar from '@/components/ScrubberNavbar';
import Footer from '@/components/Footer';
import SmoothScrolling from '@/components/SmoothScrolling';
import { CartProvider } from '@/lib/CartContext';
import CartDrawer from '@/components/CartDrawer';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-bebas', // Keeping the variable name the same so we don't have to change all the font-bebas classes
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
    <html lang="en" className={`${oswald.variable} ${dmSans.variable}`}>
      <body className="text-white font-sans antialiased overflow-x-hidden selection:bg-wff-red selection:text-white" suppressHydrationWarning>
        <CartProvider>
          <SmoothScrolling>
            <div className="noise-overlay"></div>
            <CustomCursor />
            <Loader />
            <ScrubberNavbar />
            <CartDrawer />
            {children}
            <Footer />
          </SmoothScrolling>
        </CartProvider>
      </body>
    </html>
  );
}
