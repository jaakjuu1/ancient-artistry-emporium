
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out py-4 px-6 md:px-12',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="font-display text-2xl md:text-3xl text-burgundy-800 hover:text-burgundy-700 transition-colors"
        >
          Mystical Masterpieces
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="decorated-link">Home</Link>
          <Link to="/artists" className="decorated-link">Artists</Link>
          <Link to="/products" className="decorated-link">Products</Link>
          <Link to="/about" className="decorated-link">About</Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-burgundy-700 hover:text-burgundy-600 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-burgundy-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>

        <button 
          className="md:hidden text-burgundy-700 hover:text-burgundy-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-40 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col items-center pt-8 space-y-6">
          <Link 
            to="/" 
            className="text-xl font-display text-burgundy-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/artists" 
            className="text-xl font-display text-burgundy-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Artists
          </Link>
          <Link 
            to="/products" 
            className="text-xl font-display text-burgundy-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link 
            to="/about" 
            className="text-xl font-display text-burgundy-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/cart" 
            className="text-xl font-display text-burgundy-800 flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart (0)</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
