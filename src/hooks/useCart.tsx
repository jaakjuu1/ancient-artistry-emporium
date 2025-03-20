
import { useState, useEffect, createContext, useContext } from 'react';
import { createPrintfulOrder } from '@/utils/printful';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from './useAuth';

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage or Supabase when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // If user is logged in, try to get cart from Supabase
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('order_items(*, products(*)), status')
            .eq('user_id', user.id)
            .eq('status', 'cart')
            .maybeSingle();

          if (error) throw error;
          
          if (data && data.order_items) {
            // Format items from database to match CartItem interface
            const items = data.order_items.map((item: any) => ({
              id: item.product_id,
              title: item.products.title,
              artist: item.products.artist,
              price: parseFloat(item.price),
              quantity: item.quantity,
              image: item.products.image,
              productType: item.products.product_type,
              variantId: item.variant_id,
              size: item.size || 'medium',
            }));
            
            setCartItems(items);
          } else {
            // No cart in database, check localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              setCartItems(parsedCart);
              
              // Save localStorage cart to database
              if (parsedCart.length > 0) {
                saveCartToDatabase(parsedCart);
              }
            }
          }
        } catch (error) {
          console.error('Error loading cart from database:', error);
          // Fallback to localStorage
          const savedCart = localStorage.getItem('cart');
          setCartItems(savedCart ? JSON.parse(savedCart) : []);
        }
      } else {
        // If no user is logged in, use localStorage
        const savedCart = localStorage.getItem('cart');
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage and/or Supabase when it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      if (user) {
        saveCartToDatabase(cartItems);
      }
    } else {
      localStorage.removeItem('cart');
      
      if (user) {
        deleteCartFromDatabase();
      }
    }
  }, [cartItems, user]);

  const saveCartToDatabase = async (items: CartItem[]) => {
    if (!user) return;
    
    try {
      // First, check if user has a cart
      const { data: existingCart, error: cartError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'cart')
        .maybeSingle();
      
      if (cartError) throw cartError;
      
      let orderId;
      
      if (!existingCart) {
        // Create a new cart order
        const { data: newCart, error: newCartError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            status: 'cart',
            total: calculateTotal(items),
          })
          .select('id')
          .single();
        
        if (newCartError) throw newCartError;
        orderId = newCart.id;
      } else {
        orderId = existingCart.id;
        
        // Update cart total
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            total: calculateTotal(items),
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
        
        if (updateError) throw updateError;
        
        // Delete existing items
        const { error: deleteError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderId);
        
        if (deleteError) throw deleteError;
      }
      
      // Insert new items
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      }));
      
      const { error: insertError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (insertError) throw insertError;
      
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
  };

  const deleteCartFromDatabase = async () => {
    if (!user) return;
    
    try {
      const { data: cart, error: cartError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'cart')
        .maybeSingle();
      
      if (cartError) throw cartError;
      
      if (cart) {
        // Delete order items first
        const { error: deleteItemsError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', cart.id);
        
        if (deleteItemsError) throw deleteItemsError;
        
        // Then delete the order
        const { error: deleteOrderError } = await supabase
          .from('orders')
          .delete()
          .eq('id', cart.id);
        
        if (deleteOrderError) throw deleteOrderError;
      }
    } catch (error) {
      console.error('Error deleting cart from database:', error);
    }
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

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
    
    if (user) {
      deleteCartFromDatabase();
    }
  };

  const checkout = async (shippingInfo: ShippingInfo): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Format items for Printful API
      const orderItems = cartItems.map(item => ({
        sync_variant_id: item.variantId,
        quantity: item.quantity
      }));
      
      // Submit order to Printful
      const printfulOrder = await createPrintfulOrder(orderItems, shippingInfo);
      
      if (printfulOrder) {
        // Update order in Supabase
        const { data: cart, error: cartError } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'cart')
          .maybeSingle();
        
        if (cartError) throw cartError;
        
        if (cart) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: 'pending',
              shipping_address: shippingInfo,
              printful_order_id: printfulOrder.id.toString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', cart.id);
          
          if (updateError) throw updateError;
        }
        
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
