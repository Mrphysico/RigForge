import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { 
  formatINR, 
  FREE_SHIPPING_THRESHOLD_INR, 
  STANDARD_SHIPPING_FEE_INR,
  GST_RATE 
} from '../../utils/formatCurrency';

import { CheckoutModal } from '../checkout/CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
  } = useCartStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = getSubtotal();
  const tax = subtotal * GST_RATE; // 18% GST
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : (subtotal > 0 ? STANDARD_SHIPPING_FEE_INR : 0);
  const grandTotal = subtotal + shippingFee;
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_INR) * 100);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  if (!isOpen && !isCheckoutOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl animate-slideLeft">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold tracking-tight text-white">Your Hardware Cart</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-cyan-300">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="px-5 py-3 bg-zinc-900/40 border-b border-zinc-850">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {subtotal >= FREE_SHIPPING_THRESHOLD_INR ? (
                        <span className="text-emerald-400 font-medium">Free Express Air Courier Unlocked!</span>
                      ) : (
                        <span>
                          Add <span className="font-semibold text-cyan-400">{formatINR(FREE_SHIPPING_THRESHOLD_INR - subtotal)}</span> more for Free BlueDart Shipping
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">Your cart is empty</h3>
                    <p className="text-sm text-zinc-400 max-w-xs mb-6">
                      Explore our extensive Indian retail catalog or configure your custom desktop build in our PC Builder.
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/80 transition-all"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-[72px] h-[72px] object-cover rounded-lg border border-zinc-800 flex-shrink-0 bg-zinc-950"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-0.5">
                              {item.product.brand} · {item.product.category}
                            </span>
                            <h4 className="text-sm font-semibold text-white truncate" title={item.product.name}>
                              {item.product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-zinc-500 hover:text-red-400 p-1 transition-colors flex-shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-bold font-mono text-cyan-400">
                            {formatINR(item.product.price * item.quantity)}
                          </span>

                          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-zinc-400 hover:text-white transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-medium px-1 min-w-[20px] text-center text-zinc-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-zinc-400 hover:text-white transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-5 border-t border-zinc-800 bg-zinc-900/80 space-y-3.5">
                  <div className="space-y-1.5 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Subtotal (Inclusive of GST)</span>
                      <span className="font-mono text-zinc-200 font-medium">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated 18% GST (Included)</span>
                      <span className="font-mono text-zinc-400">~{formatINR(tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insured Shipping (BlueDart)</span>
                      <span className="font-mono text-zinc-200 font-medium">
                        {subtotal >= FREE_SHIPPING_THRESHOLD_INR ? (
                          <span className="text-emerald-400 font-semibold">FREE</span>
                        ) : (
                          formatINR(STANDARD_SHIPPING_FEE_INR)
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-zinc-800 flex justify-between text-base font-bold text-white">
                      <span>Grand Total</span>
                      <span className="font-mono text-cyan-400 text-lg">
                        {formatINR(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      Official Brand Warranty
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      BlueDart Transit Insurance
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>Proceed to Indian Gateway</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
      )}

      {/* UPI QR Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={() => {
          closeCart();
        }}
      />
    </>
  );
};
