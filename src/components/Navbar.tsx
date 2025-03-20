
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, isAdmin, profile } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <header 
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-5"
      )}
    >
      <div className="px-6 md:px-12 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className={cn(
            "font-display text-2xl md:text-3xl transition-colors duration-300",
            isScrolled ? "text-mystic-900" : "text-white"
          )}>
            Mystic Masterpieces
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={cn(
              "nav-link",
              isScrolled ? "text-mystic-900 hover:text-burgundy-700" : "text-white hover:text-burgundy-200"
            )}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={cn(
              "nav-link",
              isScrolled ? "text-mystic-900 hover:text-burgundy-700" : "text-white hover:text-burgundy-200"
            )}
          >
            Collection
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "nav-link",
              isScrolled ? "text-mystic-900 hover:text-burgundy-700" : "text-white hover:text-burgundy-200"
            )}
          >
            About
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className={cn(
                "nav-link",
                isScrolled ? "text-mystic-900 hover:text-burgundy-700" : "text-white hover:text-burgundy-200"
              )}
            >
              Admin
            </Link>
          )}
        </nav>
        
        {/* Cart and User Controls */}
        <div className="flex items-center gap-4">
          <Link 
            to="/cart" 
            className={cn(
              "relative p-2 rounded-full transition-colors",
              isScrolled ? "text-mystic-900 hover:bg-mystic-100" : "text-white hover:bg-white/10"
            )}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-burgundy-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "rounded-full transition-colors",
                    isScrolled ? "text-mystic-900 hover:bg-mystic-100" : "text-white hover:bg-white/10"
                  )}
                >
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              to="/auth/login" 
              className={cn(
                "nav-link font-medium",
                isScrolled ? "text-mystic-900 hover:text-burgundy-700" : "text-white hover:text-burgundy-200"
              )}
            >
              Sign In
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            className={cn(
              "md:hidden p-2 rounded-full transition-colors",
              isScrolled ? "text-mystic-900 hover:bg-mystic-100" : "text-white hover:bg-white/10"
            )}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="pt-24 px-6 flex flex-col gap-6">
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/products" className="mobile-nav-link">Collection</Link>
          <Link to="/about" className="mobile-nav-link">About</Link>
          
          {isAdmin && (
            <Link to="/admin" className="mobile-nav-link">Admin</Link>
          )}
          
          {!user && (
            <Link to="/auth/login" className="btn-primary mt-4">
              Sign In
            </Link>
          )}
          
          {user && (
            <>
              <Link to="/profile" className="mobile-nav-link">My Profile</Link>
              <Link to="/orders" className="mobile-nav-link">My Orders</Link>
              
              <button 
                className="text-burgundy-700 font-medium flex items-center gap-2 mt-4"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
