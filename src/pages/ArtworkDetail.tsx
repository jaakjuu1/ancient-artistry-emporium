
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Share2, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { getVariantId } from '@/utils/printful';

// Mock data for demonstration
const artworks = [
  {
    id: 1,
    title: "Vitruvian Man",
    artist: "Leonardo da Vinci",
    image: "https://images.unsplash.com/photo-1569779213435-ba3167ecfcbe?w=800&auto=format&fit=crop",
    year: "c. 1490",
    price: 89.99,
    description: "This famous drawing depicts a male figure in two superimposed positions with arms and legs apart inside both a square and a circle. It represents Leonardo's study of proportion and human anatomy, while also symbolizing the harmony between man and the universe. The drawing contains hidden mathematical ratios and cosmic proportions that reveal Leonardo's understanding of sacred geometry.",
    materials: ["Premium Archival Paper", "Canvas", "Framed Print"],
    sizes: ["12×16\"", "18×24\"", "24×36\""]
  },
  {
    id: 2, 
    title: "Scivias Illumination",
    artist: "Hildegard von Bingen",
    image: "https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=800&auto=format&fit=crop",
    year: "c. 1151",
    price: 79.99,
    description: "This illuminated manuscript page from Hildegard's visionary work 'Scivias' depicts her cosmic vision of the universe as an egg, symbolizing the divine order of creation. The vibrant cosmic imagery reveals Hildegard's mystical experiences and her understanding of the harmony between humanity, nature, and the divine. The manuscript contains profound theological insights presented through symbolic visual language.",
    materials: ["Premium Archival Paper", "Canvas", "Framed Print"],
    sizes: ["12×16\"", "18×24\"", "24×36\""]
  },
  {
    id: 3,
    title: "Book of the Fixed Stars",
    artist: "Al-Sufi",
    image: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=800&auto=format&fit=crop",
    year: "c. 964",
    price: 99.99,
    description: "This astronomical manuscript page from Al-Sufi's 'Book of the Fixed Stars' represents one of the most important works of medieval astronomy. The detailed illustrations combine scientific accuracy with artistic beauty, depicting constellations as they appear in the night sky alongside their mirror images as seen on celestial globes. The work preserves ancient Greek astronomical knowledge while incorporating Islamic scientific advancements.",
    materials: ["Premium Archival Paper", "Canvas", "Framed Print"],
    sizes: ["12×16\"", "18×24\"", "24×36\""]
  },
  {
    id: 4,
    title: "The Allegory of the Cave",
    artist: "Ancient Greek Manuscript",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop",
    year: "c. 380 BCE",
    price: 109.99,
    description: "This artistic representation of Plato's famous Allegory of the Cave depicts humans chained in a cave, mistaking shadows on the wall for reality. The powerful philosophical metaphor explores the difference between appearance and reality, illumination and ignorance. The image symbolizes the journey from darkness to enlightenment through philosophical inquiry and the pursuit of truth beyond sensory perception.",
    materials: ["Premium Archival Paper", "Canvas", "Framed Print"],
    sizes: ["12×16\"", "18×24\"", "24×36\""]
  }
];

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const artwork = artworks.find(a => a.id === Number(id));
  const { addToCart } = useCart();
  
  const [selectedMaterial, setSelectedMaterial] = useState(artwork?.materials[0] || "");
  const [selectedSize, setSelectedSize] = useState(artwork?.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  
  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display text-mystic-900 mb-4">Artwork Not Found</h2>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Map selectedMaterial to productType for Printful
    const productTypeMap: Record<string, string> = {
      "Premium Archival Paper": "poster",
      "Canvas": "canvas",
      "Framed Print": "framed-print"
    };
    
    // Map selectedSize to size for Printful
    const sizeMap: Record<string, string> = {
      "12×16\"": "small",
      "18×24\"": "medium",
      "24×36\"": "large"
    };
    
    const productType = productTypeMap[selectedMaterial] || "poster";
    const size = sizeMap[selectedSize] || "medium";
    const variantId = getVariantId(productType, size);
    
    addToCart({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      price: artwork.price,
      quantity: quantity,
      image: artwork.image,
      productType: productType,
      variantId: variantId,
      size: size
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/" className="flex items-center text-mystic-600 hover:text-mystic-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collection
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Column */}
            <div className="animate-fade-in [animation-delay:100ms]">
              <div className="pergament-card p-4 rounded-lg overflow-hidden">
                <img 
                  src={artwork.image} 
                  alt={artwork.title} 
                  className="w-full h-auto rounded object-cover"
                />
              </div>
            </div>
            
            {/* Details Column */}
            <div className="animate-fade-in [animation-delay:200ms]">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-mystic-900 mb-2">{artwork.title}</h1>
                  <p className="text-xl text-mystic-700">{artwork.artist}, {artwork.year}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-mystic-300 hover:bg-mystic-100 transition-colors">
                    <Heart className="h-5 w-5 text-burgundy-700" />
                  </button>
                  <button className="p-2 rounded-full border border-mystic-300 hover:bg-mystic-100 transition-colors">
                    <Share2 className="h-5 w-5 text-mystic-700" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-2xl font-semibold text-burgundy-800 mb-6">${artwork.price}</p>
                <p className="illuminated-initial text-mystic-800 mb-8">{artwork.description}</p>
                
                {/* Product Options */}
                <div className="space-y-6">
                  {/* Material Selection */}
                  <div>
                    <h3 className="text-lg font-display text-mystic-900 mb-3">Material</h3>
                    <div className="flex flex-wrap gap-3">
                      {artwork.materials.map((material) => (
                        <button
                          key={material}
                          className={cn(
                            "px-4 py-2 border rounded-md transition-colors",
                            selectedMaterial === material
                              ? "border-burgundy-700 bg-burgundy-50 text-burgundy-900"
                              : "border-mystic-300 hover:border-mystic-400"
                          )}
                          onClick={() => setSelectedMaterial(material)}
                        >
                          {material}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Size Selection */}
                  <div>
                    <h3 className="text-lg font-display text-mystic-900 mb-3">Size</h3>
                    <div className="flex flex-wrap gap-3">
                      {artwork.sizes.map((size) => (
                        <button
                          key={size}
                          className={cn(
                            "px-4 py-2 border rounded-md transition-colors",
                            selectedSize === size
                              ? "border-burgundy-700 bg-burgundy-50 text-burgundy-900"
                              : "border-mystic-300 hover:border-mystic-400"
                          )}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div>
                    <h3 className="text-lg font-display text-mystic-900 mb-3">Quantity</h3>
                    <div className="flex items-center border border-mystic-300 rounded-md w-32">
                      <button 
                        className="px-3 py-2 text-mystic-700 hover:text-mystic-900 transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                        className="w-12 text-center border-0 focus:ring-0 p-2 bg-transparent"
                        min="1"
                      />
                      <button 
                        className="px-3 py-2 text-mystic-700 hover:text-mystic-900 transition-colors"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
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

export default ArtworkDetail;
