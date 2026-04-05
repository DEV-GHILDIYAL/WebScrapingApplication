import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900">
      <Navbar />
      
      {/* Hero section */}
      <Hero />

      {/* Features section */}
      <Features />

      {/* How it works section */}
      <HowItWorks />

      {/* Testimonials section */}
      <Testimonials />

      {/* CTA section */}
      <CTA />

      <Footer />
    </main>
  );
}
