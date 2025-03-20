
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  year: string;
  price: number;
}

const featuredArtworks: Artwork[] = [
  {
    id: 1,
    title: "Vitruvian Man",
    artist: "Leonardo da Vinci",
    image: "https://images.unsplash.com/photo-1569779213435-ba3167ecfcbe?w=600&auto=format&fit=crop",
    year: "c. 1490",
    price: 89.99
  },
  {
    id: 2, 
    title: "Scivias Illumination",
    artist: "Hildegard von Bingen",
    image: "https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=600&auto=format&fit=crop",
    year: "c. 1151",
    price: 79.99
  },
  {
    id: 3,
    title: "Book of the Fixed Stars",
    artist: "Al-Sufi",
    image: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=600&auto=format&fit=crop",
    year: "c. 964",
    price: 99.99
  },
  {
    id: 4,
    title: "The Allegory of the Cave",
    artist: "Ancient Greek Manuscript",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&auto=format&fit=crop",
    year: "c. 380 BCE",
    price: 109.99
  }
];

const FeaturedArtworks: React.FC = () => {
  return (
    <section id="featured" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">Featured Mystical Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredArtworks.map((artwork, index) => (
            <div 
              key={artwork.id}
              className={cn(
                "product-card group",
                "opacity-0 animate-fade-in",
                {
                  "[animation-delay:100ms]": index === 0,
                  "[animation-delay:200ms]": index === 1,
                  "[animation-delay:300ms]": index === 2,
                  "[animation-delay:400ms]": index === 3,
                }
              )}
            >
              <div className="relative mb-4 overflow-hidden rounded">
                <img 
                  src={artwork.image} 
                  alt={artwork.title} 
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <p className="text-white text-sm">{artwork.year}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-display text-mystic-900">{artwork.title}</h3>
              <p className="text-mystic-700 mb-2">{artwork.artist}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-burgundy-800 font-semibold">${artwork.price}</span>
                <Link 
                  to={`/artwork/${artwork.id}`}
                  className="text-sapphire-700 hover:text-sapphire-900 flex items-center gap-1 transition-colors"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/products" className="btn-secondary inline-block">
            View All Works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
