
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const initialCartItems = [
  {
    id: 1,
    title: "Vitruvian Man",
    artist: "Leonardo da Vinci",
    price: 89.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1569779213435-ba3167ecfcbe?w=200&auto=format&fit=crop",
    productType: "Canvas Print, 18×24\""
  },
  {
    id: 3,
    title: "Book of the Fixed Stars",
    artist: "Al-Sufi",
    price: 99.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=200&auto=format&fit=crop",
    productType: "Framed Print, 24×36\""
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  
  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 12.99;
  const total = subtotal + shipping;
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <div className="py-24 px-6 md:px-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <ShoppingCart className="h-16 w-16 text-mystic-400" />
            </div>
            <h1 className="text-3xl font-display text-mystic-900 mb-4">Your Cart is Empty</h1>
            <p className="text-mystic-700 mb-8">
              Discover our collection of mystical masterpieces and start your journey through the wisdom of the ages.
            </p>
            <Link to="/" className="btn-primary">
              Explore Collection
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-mystic-900 mb-8">Your Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {cartItems.map(item => (
                  <CartItem 
                    key={item.id}
                    {...item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-display text-mystic-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-mystic-700">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mystic-700">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-mystic-200 pt-4 flex justify-between">
                    <span className="font-semibold text-mystic-900">Total</span>
                    <span className="font-semibold text-burgundy-800">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="btn-primary w-full flex items-center justify-center gap-2 py-3 mb-4">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <Link to="/" className="text-mystic-700 hover:text-mystic-900 transition-colors text-center block">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
