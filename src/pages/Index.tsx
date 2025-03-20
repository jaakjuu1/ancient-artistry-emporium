
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedArtworks from '../components/FeaturedArtworks';
import ArtistSection from '../components/ArtistSection';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      
      <div id="about" className="py-24 px-6 md:px-12 bg-mystic-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title">The Wisdom of the Ages</h2>
          <p className="text-lg illuminated-initial mb-6">
            Throughout history, the greatest artists have been vessels for profound knowledge and mystical insights. Their works not only captivate the eye but speak directly to the soul, encoding ancient wisdom in symbols, proportions, and hidden meanings.
          </p>
          <p className="text-lg mb-6">
            Our collection brings these masterpieces to life in exquisite print-on-demand products, allowing you to surround yourself with art that transcends mere decoration and connects you to a lineage of sacred knowledge.
          </p>
          <p className="text-lg">
            Each piece is meticulously reproduced to honor the original work while making it accessible for modern spaces and lifestyles. Explore our collection and find the mystical masterpiece that resonates with your journey.
          </p>
        </div>
      </div>
      
      <FeaturedArtworks />
      <ArtistSection />
      <ProductSection />
      
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-parchment-texture bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 md:px-12">
          <blockquote className="text-2xl md:text-3xl italic font-serif text-mystic-900 mb-8">
            "Art is the highest form of hope."
          </blockquote>
          <p className="font-display text-xl text-mystic-800">— Gerhard Richter</p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
