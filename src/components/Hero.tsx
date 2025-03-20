
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

const Hero = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroImage = document.querySelector('.hero-parallax') as HTMLElement;
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="hero-parallax absolute inset-0 bg-stone-texture bg-center bg-cover z-0"
        style={{ transform: 'translateY(0)' }}
      >
        <div className="absolute inset-0 bg-mystic-950/60"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <div className={cn(
          "max-w-3xl mx-auto",
          "animate-fade-in [animation-delay:300ms]"
        )}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white mb-6">
            Mystical Masterpieces
          </h1>
          <p className="text-xl md:text-2xl font-serif text-white/90 mb-8 max-w-2xl mx-auto">
            Discover the hidden wisdom of history's greatest artists through our exclusive collection of print-on-demand treasures.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#featured" className="btn-primary">
              Explore Collection
            </a>
            <a href="#about" className="btn-outline border-white/70 text-white hover:bg-white/10">
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="w-8 h-12 rounded-full border-2 border-white/60 flex justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-[bounce_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
