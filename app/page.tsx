import CustomCursor from '@/components/CustomCursor';
import PageLoader from '@/components/PageLoader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import WorldChampionships from '@/components/WorldChampionships';
import Events from '@/components/Events';
import Wellness from '@/components/Wellness';
import Shop from '@/components/Shop';
import Registration from '@/components/Registration';
import Athletes from '@/components/Athletes';
import Gallery from '@/components/Gallery';
import News from '@/components/News';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative bg-wff-dark min-h-screen">
      <CustomCursor />
      <PageLoader />
      <Navbar />
      <Hero />
      <About />
      <WorldChampionships />
      <Events />
      <Wellness />
      <Shop />
      <Registration />
      <Athletes />
      <Gallery />
      <News />
      <Contact />
      <Footer />
    </main>
  );
}
