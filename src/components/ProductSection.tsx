
import React from 'react';
import { Link } from 'react-router-dom';
import { Paintbrush, ShoppingBag, Home, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCategory {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const categories: ProductCategory[] = [
  {
    id: 1,
    title: "Art Prints",
    description: "Museum-quality reproductions on premium papers and canvas",
    icon: <Paintbrush className="h-8 w-8 text-burgundy-700" />,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Apparel",
    description: "Wearable art featuring mystical designs on premium garments",
    icon: <ShoppingBag className="h-8 w-8 text-burgundy-700" />,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Home Décor",
    description: "Transform your space with tapestries, pillows and wall hangings",
    icon: <Home className="h-8 w-8 text-burgundy-700" />,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Books & Journals",
    description: "Leather-bound journals and illustrated books of ancient wisdom",
    icon: <BookOpen className="h-8 w-8 text-burgundy-700" />,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop"
  }
];

const ProductSection: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">Product Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/products/${category.id}`}
              className={cn(
                "group relative overflow-hidden rounded-lg h-80 shadow-lg",
                "opacity-0 animate-fade-in",
                {
                  "[animation-delay:100ms]": index === 0,
                  "[animation-delay:200ms]": index === 1,
                  "[animation-delay:300ms]": index === 2,
                  "[animation-delay:400ms]": index === 3,
                }
              )}
            >
              <img 
                src={category.image} 
                alt={category.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="bg-burgundy-900/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 transition-transform duration-300 group-hover:translate-y-[-10px]">
                  <div className="flex items-center gap-3 mb-2">
                    {category.icon}
                    <h3 className="text-xl font-display">{category.title}</h3>
                  </div>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
