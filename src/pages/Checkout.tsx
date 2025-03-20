
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, checkout } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'US',
    zip: '',
  });
  
  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 12.99;
  const total = subtotal + shipping;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    
    setIsSubmitting(true);
    
    // Process order through Printful integration
    const success = await checkout(shippingInfo);
    
    setIsSubmitting(false);
    
    if (success) {
      setOrderComplete(true);
    }
  };
  
  if (cartItems.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }
  
  if (orderComplete) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <div className="py-24 px-6 md:px-12 flex flex-col items-center justify-center">
          <div className="max-w-md text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-display text-mystic-900 mb-4">Order Complete!</h1>
            <p className="text-mystic-700 mb-8">
              Thank you for your order. We've received your request and will begin processing it immediately.
              You will receive a confirmation email shortly.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
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
          <h1 className="text-3xl md:text-4xl font-display text-mystic-900 mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-display text-mystic-900 mb-6 flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" /> 
                  Shipping Information
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input 
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zip">Postal Code</Label>
                      <Input 
                        id="zip"
                        name="zip"
                        value={shippingInfo.zip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-display text-mystic-900 mb-6 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" /> 
                    Payment Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" required />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" required pattern="[0-9]{16}" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" required placeholder="MM/YY" pattern="[0-9]{2}/[0-9]{2}" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" required pattern="[0-9]{3,4}" placeholder="123" />
                    </div>
                  </div>
                </form>
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
                
                <button 
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 mb-4"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Purchase"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
