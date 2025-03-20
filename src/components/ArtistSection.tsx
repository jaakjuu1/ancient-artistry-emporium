
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Artist {
  id: number;
  name: string;
  period: string;
  image: string;
  description: string;
}

const artists: Artist[] = [
  {
    id: 1,
    name: "Leonardo da Vinci",
    period: "Italian Renaissance, 1452-1519",
    image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=500&auto=format&fit=crop",
    description: "Master of the Italian Renaissance whose work blended art and science, embedding sacred geometry and hidden symbolism in his masterpieces."
  },
  {
    id: 2,
    name: "Hildegard von Bingen",
    period: "Medieval Germany, 1098-1179",
    image: "https://images.unsplash.com/photo-1588953936179-344bb0626ae6?w=500&auto=format&fit=crop",
    description: "Mystic, composer, and illuminator whose visionary manuscripts captured divine revelations through vibrant cosmic imagery."
  },
  {
    id: 3,
    name: "Ancient Egyptian Masters",
    period: "Old Kingdom to Late Period, 3100-332 BCE",
    image: "https://images.unsplash.com/photo-1608156639585-b3a7a6e98d0b?w=500&auto=format&fit=crop",
    description: "Anonymous artists who encoded profound cosmological knowledge and spiritual wisdom through hieroglyphic art and temple designs."
  }
];

const ArtistSection: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-parchment-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">Visionary Artists</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {artists.map((artist, index) => (
            <div 
              key={artist.id}
              className={cn(
                "flex flex-col items-center text-center",
                "opacity-0 animate-fade-in [animation-delay:200ms]"
              )}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-mystic-300 shadow-lg mb-6">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-display text-mystic-900 mb-2">{artist.name}</h3>
              <p className="text-mystic-700 font-serif italic mb-4">{artist.period}</p>
              <p className="illuminated-initial text-mystic-800 mb-6 max-w-md">{artist.description}</p>
              <Link 
                to={`/artist/${artist.id}`}
                className="decorated-link"
              >
                Explore Works
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistSection;
