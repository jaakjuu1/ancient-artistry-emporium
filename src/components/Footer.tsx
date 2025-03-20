
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-mystic-950 text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 lg:col-span-1">
            <Link to="/" className="font-display text-2xl md:text-3xl text-white hover:text-white/90 transition-colors">
              Mystical Masterpieces
            </Link>
            <p className="mt-4 text-white/80">
              Bringing the profound wisdom of history's greatest artists into your everyday life through exceptional print-on-demand products.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@mysticalmasterpieces.com" className="text-white/80 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/artists" className="text-white/80 hover:text-white transition-colors">Artists</Link></li>
              <li><Link to="/products" className="text-white/80 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/cart" className="text-white/80 hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white">Products</h3>
            <ul className="space-y-3">
              <li><Link to="/products/1" className="text-white/80 hover:text-white transition-colors">Art Prints</Link></li>
              <li><Link to="/products/2" className="text-white/80 hover:text-white transition-colors">Apparel</Link></li>
              <li><Link to="/products/3" className="text-white/80 hover:text-white transition-colors">Home Décor</Link></li>
              <li><Link to="/products/4" className="text-white/80 hover:text-white transition-colors">Books & Journals</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white">Stay Connected</h3>
            <p className="text-white/80 mb-4">Subscribe to receive updates on new artworks and exclusive offers.</p>
            <form className="mt-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-md w-full bg-mystic-900 border border-mystic-700 text-white focus:outline-none focus:ring-1 focus:ring-burgundy-700"
                />
                <button 
                  type="submit" 
                  className="bg-burgundy-700 hover:bg-burgundy-800 text-white px-4 py-2 rounded-r-md transition-colors duration-300"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-mystic-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} Mystical Masterpieces. All rights reserved.
          </p>
          <p className="text-white/70 text-sm mt-4 md:mt-0 flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-burgundy-500" /> for lovers of art and wisdom
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
