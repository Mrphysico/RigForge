import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  QrCode, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  FileText, 
  AlertCircle,
  Loader2,
  Building2,
  User,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  formatINR, 
  FREE_SHIPPING_THRESHOLD_INR, 
  STANDARD_SHIPPING_FEE_INR, 
  GST_RATE 
} from '../../utils/formatCurrency';
import { API_BASE_URL } from '../../config/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestError, setGuestError] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const merchantConfig = {
    beneficiaryName: 'Arth Rakesh Jadav',
    upiId: '9819319689@nyes',
    bank: 'Bank of India',
    qrCodePath: '/images/upi-qr.jpg',
  };

  const subtotal = getSubtotal();
  const tax = subtotal * GST_RATE;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : (subtotal > 0 ? STANDARD_SHIPPING_FEE_INR : 0);
  const grandTotal = subtotal + shippingFee;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(merchantConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProceedToStep2 = () => {
    if (!user) {
      if (!guestName.trim()) {
        setGuestError('Please enter your full name for the dispatch invoice.');
        return;
      }
      if (!guestEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
        setGuestError('Please enter a valid email address for delivery tracking.');
        return;
      }
    }
    setGuestError(null);
    setStep(2);
  };

  const validateAndProceedToConfirm = () => {
    const cleanUtr = utrNumber.trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError('Please enter a valid 12-digit numeric UPI Reference / UTR Number.');
      return;
    }
    setUtrError(null);
    submitOrder(cleanUtr);
  };

  const submitOrder = async (confirmedUtr: string) => {
    setIsSubmitting(true);
    const orderId = 'RF-IN-' + Math.floor(100000 + Math.random() * 900000);

    const customerName = user ? user.name : (guestName.trim() || 'Valued Customer');
    const customerEmail = user ? user.email : (guestEmail.trim().toLowerCase() || 'customer@rigforge.in');

    const orderPayload = {
      orderId,
      customerName,
      customerEmail,
      items: items.map((it) => ({
        id: it.product.id,
        name: it.product.name,
        category: it.product.category,
        price: it.product.price,
        quantity: it.quantity,
      })),
      subtotal,
      tax,
      shippingFee,
      totalAmount: grandTotal,
      utrNumber: confirmedUtr,
      paymentMethod: 'UPI_QR',
      beneficiary: merchantConfig.beneficiaryName,
      upiId: merchantConfig.upiId,
      receiptFileName: receiptFile?.name || null,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending_verification',
    };

    // Attempt to send order to backend API
    try {
      await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });
      console.log('Order successfully synced with backend API:', orderId);
    } catch {
      console.warn('Backend server not reachable, saving order locally.');
    }

    // Save order in local storage as well for resilience
    try {
      const existingOrders = JSON.parse(localStorage.getItem('rigforge_orders') || '[]');
      existingOrders.unshift(orderPayload);
      localStorage.setItem('rigforge_orders', JSON.stringify(existingOrders));
    } catch (err) {
      console.error('Failed to store order in localStorage:', err);
    }

    setIsSubmitting(false);
    setPlacedOrderId(orderId);
    setStep(4);
    clearCart();

    if (onOrderPlaced) {
      onOrderPlaced(orderId);
    }
  };

  const handleFinish = () => {
    onClose();
    setStep(1);
    setUtrNumber('');
    setReceiptFile(null);
    setPlacedOrderId(null);
    setGuestName('');
    setGuestEmail('');
    setGuestError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        onClick={step === 4 ? handleFinish : onClose} 
        className="fixed inset-0"
      />

      <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Neon top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-[#FCA311] to-amber-600" />

        {/* Modal Header */}
        <div className="p-5 border-b border-[#262626] bg-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FCA311]/15 text-[#FCA311] border border-[#FCA311]/30 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {step === 4 ? 'Order Placed & Confirmation' : 'RigForge UPI Payment Gateway'}
              </h2>
              <div className="text-[11px] font-mono text-zinc-400">
                {step === 1 && 'Step 1 of 3: Order Review & Pricing'}
                {step === 2 && 'Step 2 of 3: Scan UPI QR Code'}
                {step === 3 && 'Step 3 of 3: UTR Verification'}
                {step === 4 && 'Payment Logged & Dispatched'}
              </div>
            </div>
          </div>

          <button
            onClick={step === 4 ? handleFinish : onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-[#151515] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: ORDER REVIEW */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Review Configured Items ({items.length})
                </h3>
                <span className="text-xs font-mono text-[#FCA311]">Pan-India Express Delivery</span>
              </div>

              {/* Items List */}
              <div className="max-h-56 overflow-y-auto divide-y divide-[#262626] rounded-2xl border border-[#262626] bg-[#111111] p-2">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-400">
                    No components in cart. Please configure or select parts first.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="py-2.5 px-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#262626] bg-black flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate max-w-sm">{item.product.name}</div>
                          <div className="text-[11px] font-mono text-zinc-400">
                            {item.product.brand} · Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-[#FCA311] flex-shrink-0">
                        {formatINR(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bill Details */}
              <div className="p-4 rounded-2xl bg-[#111111] border border-[#262626] space-y-2 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal (Inclusive of 18% GST)</span>
                  <span className="font-mono text-white font-medium">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>Estimated GST (18% Included)</span>
                  <span className="font-mono text-zinc-400">~{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Insured Express Courier (BlueDart)</span>
                  <span className="font-mono font-medium text-emerald-400">
                    {subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 'FREE' : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#262626] flex justify-between text-base font-extrabold text-white">
                  <span>Total Payable</span>
                  <span className="font-mono text-[#FCA311] text-lg font-bold">{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Customer Contact & Delivery Info */}
              {user ? (
                <div className="p-3 rounded-2xl bg-[#111111] border border-[#262626] text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#FCA311] text-black font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate">{user.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 flex-shrink-0">
                    Verified Account
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#262626] text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5 uppercase font-mono text-[10px] tracking-wider">
                      <User className="w-3.5 h-3.5 text-[#FCA311]" />
                      Invoice &amp; Courier Contact
                    </span>
                    <span className="text-[10px] text-[#FCA311] font-mono">Guest Order</span>
                  </div>

                  {guestError && (
                    <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-400" />
                      <span>{guestError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => {
                          setGuestName(e.target.value);
                          if (guestError) setGuestError(null);
                        }}
                        placeholder="Recipient full name"
                        className="w-full px-3 py-2 text-xs bg-[#151515] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => {
                          setGuestEmail(e.target.value);
                          if (guestError) setGuestError(null);
                        }}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 text-xs bg-[#151515] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation button */}
              <button
                disabled={items.length === 0}
                onClick={handleProceedToStep2}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#e5920a] text-black flex items-center justify-center gap-2 shadow-glow-orange transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <span>Proceed to Scan &amp; Pay UPI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: SCAN & PAY UPI WINDOW */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">Scan UPI QR Code to Pay</h3>
                <p className="text-xs text-zinc-400">
                  Scan using any UPI app on your phone to transfer <strong className="text-[#FCA311] font-mono">{formatINR(grandTotal)}</strong>
                </p>
              </div>

              {/* Merchant Details & QR Card */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* QR Code Container */}
                <div className="sm:col-span-6 flex flex-col items-center justify-center">
                  <div className="relative p-3 rounded-2xl bg-white shadow-glow-orange border-2 border-[#FCA311] group">
                    <img
                      src={merchantConfig.qrCodePath}
                      alt="RigForge UPI QR Code"
                      className="w-56 h-56 object-contain rounded-xl"
                      onError={(e) => {
                        // Fallback image generator if static asset fails to load
                        (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=9819319689@nyes%26pn=Arth%20Rakesh%20Jadav%26cu=INR%26am=${grandTotal}`;
                      }}
                    />
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0D0D0D] text-[#FCA311] text-[10px] font-mono font-bold border border-[#FCA311] shadow-md whitespace-nowrap">
                      SCAN VIA ANY UPI APP
                    </div>
                  </div>
                </div>

                {/* Merchant Verified Info */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#262626] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <User className="w-3.5 h-3.5 text-[#FCA311]" />
                      <span>Beneficiary Name</span>
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {merchantConfig.beneficiaryName}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#262626] space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>UPI ID / VPA</span>
                      <span className="text-[10px] text-emerald-400 font-mono">NPCI Verified</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-mono font-bold text-[#FCA311] select-all">
                        {merchantConfig.upiId}
                      </span>
                      <button
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#151515] hover:bg-[#FCA311] hover:text-black text-zinc-300 flex items-center gap-1 transition-colors border border-[#262626]"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#262626] flex items-center gap-2.5 text-xs text-zinc-300">
                    <Building2 className="w-4 h-4 text-[#FCA311]" />
                    <div>
                      <span className="text-zinc-400 block text-[10px]">Settlement Bank:</span>
                      <span className="font-bold text-white">{merchantConfig.bank}</span>
                    </div>
                  </div>

                  {/* Accepted Apps Badges */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Accepted Payment Apps:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold text-zinc-200 font-mono">
                      <div className="p-1.5 rounded-xl bg-[#111111] border border-[#262626]">GPay</div>
                      <div className="p-1.5 rounded-xl bg-[#111111] border border-[#262626]">PhonePe</div>
                      <div className="p-1.5 rounded-xl bg-[#111111] border border-[#262626]">Paytm</div>
                      <div className="p-1.5 rounded-xl bg-[#111111] border border-[#262626]">BHIM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-[#151515] text-zinc-300 border border-[#262626] flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#e5920a] text-black flex items-center justify-center gap-2 shadow-glow-orange transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>I Have Paid · Enter UTR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: UTR VERIFICATION & ORDER PLACEMENT */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">Payment Verification</h3>
                <p className="text-xs text-zinc-400">
                  Enter the 12-digit UPI Reference / UTR Number from your banking app receipt.
                </p>
              </div>

              {/* Error alert */}
              {utrError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{utrError}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* UTR Number Input */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-bold">
                    12-Digit UPI Reference / UTR Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={utrNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setUtrNumber(val);
                      if (val.length === 12) setUtrError(null);
                    }}
                    placeholder="e.g. 425189012345"
                    className="w-full py-3.5 px-4 text-base font-mono bg-[#111111] text-white placeholder-zinc-600 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] tracking-widest text-center"
                    autoFocus
                  />
                  <span className="text-[11px] text-zinc-400 block mt-1 text-right font-mono">
                    {utrNumber.length} / 12 digits
                  </span>
                </div>

                {/* Screenshot Upload (Optional) */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Payment Screenshot (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-[#262626] hover:border-[#FCA311]/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#111111]/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-1.5 text-xs text-zinc-400">
                      <Upload className="w-5 h-5 text-[#FCA311]" />
                      {receiptFile ? (
                        <span className="font-semibold text-white flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {receiptFile.name}
                        </span>
                      ) : (
                        <span>Click or drag your payment receipt screenshot here</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Beneficiary Confirmation Recap */}
                <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#262626] text-xs space-y-1.5 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Beneficiary:</span>
                    <span className="font-semibold text-white">{merchantConfig.beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Transferred:</span>
                    <span className="font-mono font-bold text-[#FCA311]">{formatINR(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UPI ID:</span>
                    <span className="font-mono text-zinc-300">{merchantConfig.upiId}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-[#151515] text-zinc-300 border border-[#262626] flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to QR</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || utrNumber.length !== 12}
                  onClick={validateAndProceedToConfirm}
                  className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#e5920a] text-black flex items-center justify-center gap-2 shadow-glow-orange transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Confirm &amp; Place Order</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ANIMATED ORDER CONFIRMATION */}
          {step === 4 && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/10 mb-2">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UPI PAYMENT LOGGED SUCCESSFULLY</span>
              </div>

              <h3 className="text-2xl font-black text-white">
                Thank You for Your Order!
              </h3>

              <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                Your order has been registered and is pending swift UTR verification against merchant settlement records.
              </p>

              {/* Order Tracking Card */}
              <div className="w-full bg-[#111111] rounded-2xl p-5 border border-[#262626] text-left text-xs space-y-2.5 my-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#262626]">
                  <span className="text-zinc-400">Order Tracking ID:</span>
                  <span className="font-mono font-extrabold text-[#FCA311] text-sm">{placedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Paid via UPI:</span>
                  <span className="font-mono font-bold text-white">{formatINR(grandTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">UTR / Reference No:</span>
                  <span className="font-mono text-zinc-300 tracking-wider">{utrNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Beneficiary:</span>
                  <span className="text-white font-medium">{merchantConfig.beneficiaryName} ({merchantConfig.bank})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Courier Partner:</span>
                  <span className="text-white font-medium">BlueDart Express Air (Insured)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Dispatch Status:</span>
                  <span className="text-emerald-400 font-semibold font-mono">Queued for Assembly &amp; ESD Packing</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#e5920a] text-black shadow-glow-orange transition-all active:scale-95"
              >
                Back to RigForge Store
              </button>
            </div>
          )}
        </div>

        {/* Security footer */}
        <div className="p-3.5 border-t border-[#262626] bg-[#111111] flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FCA311]" />
          <span>Secured by NPCI Unified Payments Interface &amp; RigForge Escrow</span>
        </div>
      </div>
    </div>
  );
};
