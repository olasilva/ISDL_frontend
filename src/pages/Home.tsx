// src/pages/Home.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Extras from '../components/Extras';
import Legal from '../components/Legal';
import Hero from '../sections/Hero';
import Trust from '../sections/Trust';
import Services from '../sections/Services';
import Process from '../sections/Process';
import Work from '../sections/Work';
import Why from '../sections/Why';
import Packages from '../sections/Packages';
import Updates from '../sections/Updates';
import Reviews from '../sections/Reviews';
import FAQ from '../sections/FAQ';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Extras />
      <Legal />
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <Navbar />
      <Hero />
      <main id="main" tabIndex={-1}>
        <Trust />
        <Services />
        <Process />
        <Work />
        <Why />
        <Packages />
        <Updates />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}