import type {Metadata} from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import './globals.css'; // Global styles

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
  title: 'WFF Ghana | World Fitness Federation',
  description: 'Official digital home for the World Fitness Federation (WFF) Ghana chapter.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="bg-[#0A0A0A] text-white font-sans antialiased overflow-x-hidden selection:bg-[#CC0000] selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
