import React, { useState } from 'react';
import { CartItem } from '../lib/types';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedCheckout: () => void;
  formatPrice: (amountInSAR: number) => string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onProceedCheckout, formatPrice }) => {
  // FIX 11: Track which indices are animating out before removal
  const [removingIndices, setRemovingIndices] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleRemove = (index: number) => {
    // Trigger slide-out animation, then actually remove after animation completes
    setRemovingIndices((prev) => new Set(prev).add(index));
    setTimeout(() => {
      onRemoveItem(index);
      setRemovingIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 250);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/30 animate-fade-in flex justify-end"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="p-8 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-street text-zinc-400 uppercase tracking-[0.25em]">Apricity Officials</span>
            <h2 className="font-heading font-extrabold text-xl text-[#1a1a1a] uppercase mt-0.5">Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-[#1a1a1a]" aria-label="Close"><X size={20} /></button>
        </div>

        <div className="bg-[#f3f2f0] border-b border-zinc-200 py-2.5 px-8 flex items-center justify-between text-[11px] font-mono-street text-zinc-500 uppercase tracking-wider">
          <span>🇸🇦 Free KSA Express Shipping</span>
          <span>{formatPrice(0)}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-8 divide-y divide-zinc-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 space-y-4 py-12 font-mono-street">
              <p className="text-xs uppercase tracking-wider">Your bag is empty.</p>
              <button onClick={onClose} className="px-6 py-3 bg-[#1a1a1a] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">Discover Pieces</button>
            </div>
          ) : (
            cart.map((item, index) => (
              // FIX 11: Apply slide-out class when this index is being removed
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                className={`py-6 flex gap-4 items-start ${removingIndices.has(index) ? 'animate-slide-out' : ''}`}
              >
                <img src={item.product.images[0]} alt="" className="w-20 h-24 object-cover bg-[#f3f2f0] shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#1a1a1a] uppercase">{item.product.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono-street mt-1 uppercase tracking-wider">
                        Size: <strong className="text-[#1a1a1a]">{item.selectedSize}</strong> · Colour: <strong className="text-[#1a1a1a]">{item.selectedColor}</strong>
                      </p>
                    </div>
                    <button onClick={() => handleRemove(index)} className="text-zinc-300 hover:text-red-400 p-1"><Trash2 size={15} /></button>
                  </div>
                  <div className="flex items-end justify-between mt-5">
                    <div className="flex items-center border border-zinc-200 bg-[#f3f2f0] rounded">
                      <button onClick={() => onUpdateQuantity(index, item.quantity - 1)} className="px-3 py-1 text-zinc-400 hover:text-[#1a1a1a]"><Minus size={12} /></button>
                      <span className="font-mono-street text-xs px-3 text-[#1a1a1a] font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(index, item.quantity + 1)} className="px-3 py-1 text-zinc-400 hover:text-[#1a1a1a]"><Plus size={12} /></button>
                    </div>
                    <span className="font-mono-street font-bold text-sm text-[#1a1a1a]">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 bg-[#f3f2f0] border-t border-zinc-200 space-y-4">
            <div className="flex items-center justify-between text-zinc-400 font-mono-street text-[11px] uppercase">
              <span>Subtotal</span>
              <span className="text-[#1a1a1a] font-bold text-base">{formatPrice(subtotal)}</span>
            </div>
            <div className="py-2.5 px-3 bg-white border border-zinc-200 flex items-center justify-between text-[11px] font-mono-street text-zinc-500 uppercase">
              <span className="text-[#1a1a1a] font-bold">Tabby 4×</span>
              <span>4 payments of {formatPrice(subtotal / 4)}</span>
            </div>
            <button
              onClick={onProceedCheckout}
              className="w-full py-4 text-white font-mono-street text-[11px] font-extrabold uppercase tracking-[0.2em] bg-[#0B3D2E] hover:bg-[#07402A] hover:shadow-lg hover:shadow-[#0B3D2E]/30 active:scale-[0.99] transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
            >
              <span>Guest Checkout</span>
              <ArrowRight size={16} />
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-mono-street uppercase tracking-wider pt-1">
              <ShieldCheck size={13} /> Secure Checkout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
