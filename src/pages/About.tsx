
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { cn } from '@/lib/utils';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <div className="absolute inset-0 bg-stone-texture bg-center bg-cover">
            <div className="absolute inset-0 bg-mystic-950/60"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white">Our Story</h1>
          </div>
        </div>
        
        {/* Mission Section */}
        <div className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 animate-fade-in">
              <h2 className="text-3xl font-display text-mystic-900 mb-6">Our Mission</h2>
              <p className="illuminated-initial text-lg mb-6">
                At Mystical Masterpieces, we believe that the greatest works of art throughout history are more than mere decorations—they are vessels of profound wisdom, mystical insights, and universal truths that transcend time and culture.
              </p>
              <p className="text-lg mb-6">
                Our mission is to make these transformative works accessible in the modern world, allowing people to surround themselves with art that not only pleases the eye but nourishes the soul and stimulates the mind. We carefully select pieces that contain hidden meanings, sacred geometry, and esoteric symbolism from diverse cultures and time periods.
              </p>
              <p className="text-lg">
                By bringing these masterpieces into everyday spaces through print-on-demand products, we hope to spark curiosity, inspire contemplation, and reconnect people with the wisdom of the ages.
              </p>
            </div>
            <div className="pergament-card p-4 animate-fade-in [animation-delay:300ms]">
              <img 
                src="https://images.unsplash.com/photo-1616410732746-4122dcc6f2f1?w=600&auto=format&fit=crop" 
                alt="Ancient manuscript" 
                className="rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Values Section */}
        <div className="py-20 px-6 md:px-12 bg-mystic-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="pergament-card p-6 animate-fade-in [animation-delay:100ms]">
                <h3 className="text-xl font-display text-mystic-900 mb-4">Authenticity</h3>
                <p>
                  We are committed to accurate reproductions that honor the original work while making it accessible for modern spaces. Each piece is accompanied by educational content that provides context and insight.
                </p>
              </div>
              
              <div className="pergament-card p-6 animate-fade-in [animation-delay:200ms]">
                <h3 className="text-xl font-display text-mystic-900 mb-4">Wisdom</h3>
                <p>
                  We value the profound insights embedded in historical art and seek to highlight works that contain layers of meaning beyond their aesthetic appeal. Our curation focuses on art with symbolic depth.
                </p>
              </div>
              
              <div className="pergament-card p-6 animate-fade-in [animation-delay:300ms]">
                <h3 className="text-xl font-display text-mystic-900 mb-4">Connection</h3>
                <p>
                  We believe in the power of art to connect us—to other cultures, to history, to deeper aspects of ourselves, and to universal truths that transcend time. Our products are bridges to these connections.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Process Section */}
        <div className="py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title">Our Process</h2>
            
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3 order-2 md:order-1 animate-fade-in [animation-delay:100ms]">
                  <h3 className="text-2xl font-display text-mystic-900 mb-4">Curation & Research</h3>
                  <p className="illuminated-initial mb-4">
                    We begin by identifying artists and works throughout history that contain deeper layers of meaning—sacred geometry, esoteric symbolism, or encoded knowledge. Our team researches the historical context, the artist's intentions, and the hidden aspects of each piece.
                  </p>
                  <p>
                    This research informs both our selection process and the educational content we provide with each artwork, allowing customers to understand and appreciate the profound aspects of their purchase.
                  </p>
                </div>
                <div className="md:col-span-2 order-1 md:order-2 animate-fade-in [animation-delay:200ms]">
                  <div className="pergament-card p-4">
                    <img 
                      src="https://images.unsplash.com/photo-1529704193007-e8c7cf8c8337?w=600&auto=format&fit=crop" 
                      alt="Research process" 
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2 animate-fade-in [animation-delay:300ms]">
                  <div className="pergament-card p-4">
                    <img 
                      src="https://images.unsplash.com/photo-1569332160729-be5a9f6ce489?w=600&auto=format&fit=crop" 
                      alt="High quality reproduction" 
                      className="rounded"
                    />
                  </div>
                </div>
                <div className="md:col-span-3 animate-fade-in [animation-delay:400ms]">
                  <h3 className="text-2xl font-display text-mystic-900 mb-4">Quality Reproduction</h3>
                  <p className="illuminated-initial mb-4">
                    We partner with the finest print-on-demand services to ensure each reproduction captures the detail, color, and essence of the original work. Using archival inks, premium papers, and high-quality materials, we create products that are both beautiful and durable.
                  </p>
                  <p>
                    Whether it's a canvas print, a framed artwork, or a decorative item, each product is crafted to meet exacting standards and arrive safely at your door.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
