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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fadeIn"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <div className="w-screen max-w-full sm:max-w-md bg-[#131d38] border-l border-[#26365a] text-zinc-100 flex flex-col shadow-2xl animate-slideLeft">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#26365a] flex items-center justify-between bg-[#16223f]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#FCA311]" />
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">Your Hardware Cart</h2>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#1e2d4f] text-[#FCA311] border border-[#26365a]">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1e2d4f] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress bar */}
              <div className="px-5 py-3 bg-[#16223f]/70 border-b border-[#26365a]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Truck className="w-3.5 h-3.5 text-[#FCA311]" />
                    <span>
                      {subtotal >= FREE_SHIPPING_THRESHOLD_INR ? (
                        <span className="text-emerald-400 font-medium">Free Express Air Courier Unlocked!</span>
                      ) : (
                        <span>
                          Add <span className="font-semibold text-[#FCA311]">{formatINR(FREE_SHIPPING_THRESHOLD_INR - subtotal)}</span> more for Free BlueDart Shipping
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#1e2d4f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#FCA311] transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#1e2d4f] border border-[#26365a] flex items-center justify-center text-zinc-400 mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">Your cart is empty</h3>
                    <p className="text-xs text-zinc-400 max-w-xs mb-6">
                      Explore our extensive Indian retail catalog or configure your custom desktop build in our PC Builder.
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FCA311] hover:bg-[#e5920a] text-black shadow-glow-orange transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 p-3.5 rounded-2xl bg-[#16223f] border border-[#26365a] hover:border-zinc-500 transition-all"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-[#26365a] flex-shrink-0 bg-[#0b1329]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FCA311] block mb-0.5">
                              {item.product.brand} · {item.product.category}
                            </span>
                            <h4 className="text-xs font-semibold text-white truncate" title={item.product.name}>
                              {item.product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-zinc-400 hover:text-red-400 p-1 transition-colors flex-shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-bold font-mono text-[#FCA311]">
                            {formatINR((item.product.price ?? 0) * item.quantity)}
                          </span>

                          <div className="flex items-center gap-1 bg-[#1e2d4f] border border-[#26365a] rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-[#26365a]"
                              title="Decrease quantity"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold px-2 min-w-[24px] text-center text-zinc-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-[#26365a]"
                              title="Increase quantity"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
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
                <div className="p-4 sm:p-5 border-t border-[#26365a] bg-[#16223f] space-y-3.5">
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
                    <div className="pt-2 border-t border-[#26365a] flex justify-between text-base font-bold text-white">
                      <span>Grand Total</span>
                      <span className="font-mono text-[#FCA311] text-lg font-bold">
                        {formatINR(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FCA311]" />
                      Brand Warranty
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#FCA311]" />
                      BlueDart Transit Cover
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#e5920a] text-black shadow-glow-orange flex items-center justify-center gap-2 transition-all active:scale-95 min-h-[48px]"
                    >
                      <span>Proceed to Indian Gateway</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors text-center"
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
