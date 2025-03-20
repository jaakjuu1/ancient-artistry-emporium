
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItemProps {
  id: number;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
  productType: string;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  artist,
  price,
  quantity,
  image,
  productType,
  onRemove,
  onUpdateQuantity
}) => {
  return (
    <div className="flex flex-col md:flex-row py-6 border-b border-mystic-200 last:border-b-0 gap-4">
      {/* Product Image */}
      <div className="w-full md:w-24 h-24 rounded-md overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="text-lg font-display text-mystic-900">{title}</h3>
        <p className="text-mystic-700 text-sm">{artist}</p>
        <p className="text-mystic-600 text-sm mt-1">{productType}</p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
          className="p-1 rounded-full border border-mystic-300 hover:bg-mystic-100 transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4 text-mystic-700" />
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          className="p-1 rounded-full border border-mystic-300 hover:bg-mystic-100 transition-colors"
        >
          <Plus className="h-4 w-4 text-mystic-700" />
        </button>
      </div>
      
      {/* Price */}
      <div className="text-right w-24">
        <p className="text-lg font-semibold text-mystic-900">${(price * quantity).toFixed(2)}</p>
        <p className="text-mystic-600 text-sm">${price.toFixed(2)} each</p>
      </div>
      
      {/* Remove Button */}
      <button 
        onClick={() => onRemove(id)}
        className="text-burgundy-700 hover:text-burgundy-900 transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;
