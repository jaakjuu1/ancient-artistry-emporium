
import { useState, useEffect, createContext, useContext } from 'react';
import { createPrintfulOrder } from '@/utils/printful';
import { toast } from "@/components/ui/use-toast";

export interface CartItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
  productType: string;
  variantId: number;
  size: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  checkout: (shippingInfo: ShippingInfo) => Promise<boolean>;
}

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(i => 
        i.id === item.id && i.productType === item.productType && i.size === item.size
      );
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(i => 
          i.id === item.id && i.productType === item.productType && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, item];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const checkout = async (shippingInfo: ShippingInfo): Promise<boolean> => {
    try {
      // Format items for Printful API
      const orderItems = cartItems.map(item => ({
        sync_variant_id: item.variantId,
        quantity: item.quantity
      }));
      
      // Submit order to Printful
      const order = await createPrintfulOrder(orderItems, shippingInfo);
      
      if (order) {
        clearCart();
        toast({
          title: "Order placed successfully!",
          description: "Your order has been submitted for processing."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Checkout failed:", error);
      toast({
        title: "Checkout failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
