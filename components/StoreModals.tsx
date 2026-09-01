'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  ArrowRight, 
  Heart, 
  Ruler, 
  Lock, 
  Download,
  Star,
  Layers,
  Crown,
  CreditCard,
  QrCode,
  Building2,
  PackageCheck,
  CheckCircle2,
  MessageCircle,
  ChevronRight,
  Sparkle,
  Gem,
  Feather,
  Flame,
  Wind
} from 'lucide-react';
import { useStore } from '@/lib/storeContext';
import { INITIAL_CATEGORIES } from '@/lib/catalogData';
import { SafeImage } from '@/components/SafeImage';

// -------------------------------------------------------------
// 1. SLIDE-OUT ROYAL SHOPPING BAG & REAL CHECKOUT
// -------------------------------------------------------------
export function SlideOverCart() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartTotal, 
    discountAmount, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    updateCartQuantity, 
    removeFromCart, 
    freeShippingThreshold, 
    progressToFreeShipping,
    createOrder,
    checkoutDirectMode,
    setCheckoutDirectMode,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [stepOverride, setStepOverride] = useState<'cart' | 'details' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  
  // Checkout Form Details
  const [customerName, setCustomerName] = useState('Pooja Singhania');
  const [customerEmail, setCustomerEmail] = useState('pooja.singhania@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState('Penthouse 4B, Gulmohar Enclave');
  const [city, setCity] = useState('New Delhi');
  const [stateName, setStateName] = useState('Delhi NCR');
  const [pincode, setPincode] = useState('110049');

  const checkoutStep = stepOverride ?? (checkoutDirectMode ? 'details' : 'cart');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleProceedToDetails = () => {
    if (cart.length === 0) return;
    setStepOverride('details');
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !pincode) {
      alert('Please fill in all delivery details to ensure seamless royal courier dispatch.');
      return;
    }

    setIsCheckingOut(true);
    try {
      await createOrder({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: `${shippingAddress}, ${city}, ${stateName}`,
        city,
        pincode,
        amount: cartTotal,
        discount_amount: discountAmount,
        coupon_applied: appliedCoupon ? appliedCoupon.code : undefined,
        status: 'pending',
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          colorName: item.colorName,
          image_url: item.image_url
        })),
        razorpay_order_id: `ord_${Date.now()}`,
        razorpay_payment_id: `pay_${Date.now()}`
      });

      setIsCartOpen(false);
      setCheckoutDirectMode(false);
      setStepOverride(null);
      showToast('👑 Order Confirmed with Silk Mark Guarantee!');
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div id="slide-over-cart-container" className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsCartOpen(false);
            setCheckoutDirectMode(false);
            setStepOverride(null);
          }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#fffdfa] border-l border-[#c89d46]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#faedf0] bg-[#fffdfa] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#faedf0] flex items-center justify-center text-[#c89d46]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-royal text-sm sm:text-base font-bold text-[#3d0a14]">
                    {checkoutStep === 'details' ? 'Royal Atelier Checkout' : 'Royal Shopping Bag'}
                  </h3>
                  <span className="text-[10px] text-[#806b6e] uppercase tracking-wider block">
                    {checkoutStep === 'details' ? 'Step 2: Delivery & Payment' : `${cartCount} Curated Pieces`}
                  </span>
                </div>
              </div>

              <button
                id="close-cart-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutDirectMode(false);
                  setStepOverride(null);
                }}
                className="w-8 h-8 rounded-full hover:bg-[#faedf0] flex items-center justify-center text-[#3d0a14] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {checkoutStep === 'cart' && (
              <div className="bg-[#fcf6f0] px-4 py-2.5 border-b border-[#ebd9dc] text-xs">
                <div className="flex justify-between text-[11px] font-semibold text-[#3d0a14] mb-1">
                  <span>
                    {progressToFreeShipping >= 100 
                      ? '✓ Free Insured Air Express Shipping Unlocked' 
                      : `Add ₹${(freeShippingThreshold - cartSubtotal).toLocaleString()} for Free Air Express`}
                  </span>
                  <span className="text-[#c89d46] font-bold">{Math.min(100, Math.round(progressToFreeShipping))}%</span>
                </div>
                <div className="w-full bg-[#ebd9dc] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#c89d46] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, progressToFreeShipping)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#faedf0] mx-auto flex items-center justify-center text-[#c89d46]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-royal text-base font-bold text-[#3d0a14]">Your Bag is Empty</h4>
                  <p className="text-xs text-[#806b6e] max-w-xs mx-auto">
                    Explore our single-shade pure Mulberry silk suits, 32-kali anarkalis, and handcrafted festive sets.
                  </p>
                  <button
                    id="cart-empty-explore-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      const el = document.getElementById('curated-catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-[#3d0a14] text-[#fffdfa] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#521320] transition-colors cursor-pointer"
                  >
                    Explore Royal Collections
                  </button>
                </div>
              ) : checkoutStep === 'cart' ? (
                /* Step 1: Cart Items List */
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      id={`cart-item-${item.id}`}
                      className="p-3 bg-white rounded-xl border border-[#ebd9dc] shadow-2xs flex gap-3 relative"
                    >
                      <div className="w-18 h-24 rounded-lg overflow-hidden shrink-0 bg-[#faedf0]">
                        <SafeImage 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-[#3d0a14] line-clamp-1 leading-snug">{item.title}</h4>
                            <button
                              id={`remove-cart-item-${item.id}`}
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#806b6e] hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[10px] text-[#6b5558] mt-0.5">
                            <span className="font-semibold">Size: {item.size}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span 
                                className="w-2 h-2 rounded-full border border-black/20" 
                                style={{ backgroundColor: item.colorHex }} 
                              />
                              {item.colorName}
                            </span>
                          </div>
                          {item.customNotes && (
                            <p className="text-[10px] text-[#c89d46] font-medium mt-0.5">
                              Custom fit: {item.customNotes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#faedf0]">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-[#ebd9dc] rounded-md overflow-hidden bg-[#faf5f6]">
                            <button
                              id={`decrease-qty-${item.id}`}
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-[#3d0a14] hover:bg-[#ebd9dc] transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-bold text-[#3d0a14]">{item.quantity}</span>
                            <button
                              id={`increase-qty-${item.id}`}
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-[#3d0a14] hover:bg-[#ebd9dc] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-[#3d0a14]">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Voucher Box */}
                  <div className="pt-2">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        id="cart-coupon-input"
                        type="text"
                        placeholder="Voucher (AURA20, ROYAL1000)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 bg-white border border-[#ebd9dc] rounded-lg text-xs font-mono text-[#3d0a14] placeholder-[#806b6e] focus:outline-hidden focus:border-[#c89d46] uppercase"
                      />
                      <button
                        id="cart-apply-coupon-btn"
                        type="submit"
                        className="px-4 py-2 bg-[#3d0a14] text-[#fffdfa] text-xs font-bold uppercase rounded-lg hover:bg-[#521320] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {couponMessage && (
                      <p className={`text-[11px] mt-1.5 ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-700 font-semibold'}`}>
                        {couponMessage.text}
                      </p>
                    )}

                    {appliedCoupon && (
                      <div className="mt-2 p-2 bg-[#faedf0] rounded-md border border-[#ebd9dc] flex items-center justify-between text-xs text-[#3d0a14]">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#c89d46]" />
                          <span className="font-bold font-mono">{appliedCoupon.code}</span>
                          <span className="text-[#806b6e] text-[10px]">(-₹{discountAmount.toLocaleString()})</span>
                        </div>
                        <button
                          id="cart-remove-coupon-btn"
                          onClick={removeCoupon}
                          className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Step 2: Customer Address & Instant Payment */
                <form id="checkout-details-form" onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
                  <div className="p-3 bg-[#faedf0] rounded-lg border border-[#ebd9dc]">
                    <span className="text-[10px] font-bold tracking-wider text-[#c89d46] uppercase block">
                      PATRON DELIVERY PROFILE
                    </span>
                    <p className="text-[11px] text-[#6b5558] mt-0.5">
                      Enter details for official Govt. Silk Mark transit and BlueDart air dispatch tracking.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3d0a14] mb-1">Full Name *</label>
                      <input
                        id="checkout-name"
                        required
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Pooja Singhania"
                        className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-lg text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3d0a14] mb-1">Mobile / WhatsApp *</label>
                        <input
                          id="checkout-phone"
                          required
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-lg text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3d0a14] mb-1">Email Address *</label>
                        <input
                          id="checkout-email"
                          required
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="pooja@example.com"
                          className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-lg text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3d0a14] mb-1">Shipping Address *</label>
                      <textarea
                        id="checkout-address"
                        required
                        rows={2}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="House / Flat No, Landmark, Society"
                        className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-lg text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#3d0a14] mb-1">City *</label>
                        <input
                          id="checkout-city"
                          required
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#3d0a14] mb-1">State *</label>
                        <input
                          id="checkout-state"
                          required
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#3d0a14] mb-1">PIN Code *</label>
                        <input
                          id="checkout-pincode"
                          required
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="pt-2 space-y-2">
                    <label className="block text-[11px] font-bold text-[#3d0a14]">Preferred Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="pay-method-upi"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'upi'
                            ? 'border-[#3d0a14] bg-[#faedf0] text-[#3d0a14] font-bold ring-1 ring-[#3d0a14]'
                            : 'border-[#ebd9dc] bg-white text-[#6b5558]'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-[#c89d46]" />
                        <span className="text-[11px]">Instant UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        id="pay-method-card"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'border-[#3d0a14] bg-[#faedf0] text-[#3d0a14] font-bold ring-1 ring-[#3d0a14]'
                            : 'border-[#ebd9dc] bg-white text-[#6b5558]'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-[#c89d46]" />
                        <span className="text-[11px]">Debit / Cards</span>
                      </button>

                      <button
                        type="button"
                        id="pay-method-netbanking"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'netbanking'
                            ? 'border-[#3d0a14] bg-[#faedf0] text-[#3d0a14] font-bold ring-1 ring-[#3d0a14]'
                            : 'border-[#ebd9dc] bg-white text-[#6b5558]'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-[#c89d46]" />
                        <span className="text-[11px]">NetBanking</span>
                      </button>

                      <button
                        type="button"
                        id="pay-method-cod"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-[#3d0a14] bg-[#faedf0] text-[#3d0a14] font-bold ring-1 ring-[#3d0a14]'
                            : 'border-[#ebd9dc] bg-white text-[#6b5558]'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-[#c89d46]" />
                        <span className="text-[11px]">Cash on Delivery</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Summary & Action */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#faedf0] bg-[#fffdfa] space-y-3">
                <div className="space-y-1.5 text-xs text-[#6b5558]">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-[#3d0a14]">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Festive Privilege Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Insured Air Express Delivery</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-[#faedf0] pt-2 flex justify-between text-sm font-bold text-[#3d0a14]">
                    <span>Total Amount</span>
                    <span className="text-base text-[#3d0a14]">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    id="proceed-to-checkout-btn"
                    onClick={handleProceedToDetails}
                    className="w-full py-3 bg-[#3d0a14] text-[#fffdfa] rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-[#521320] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Royal Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#c89d46]" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      id="back-to-cart-step-btn"
                      onClick={() => setStepOverride('cart')}
                      className="px-4 py-3 bg-white border border-[#ebd9dc] text-[#3d0a14] rounded-lg text-xs font-bold hover:bg-[#faedf0] transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      form="checkout-details-form"
                      id="confirm-pay-order-btn"
                      disabled={isCheckingOut}
                      className="flex-1 py-3 bg-[#3d0a14] text-[#fffdfa] rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-[#521320] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#c89d46]" />
                      <span>{isCheckingOut ? 'Securing Dispatch...' : `Confirm & Place Order · ₹${cartTotal.toLocaleString()}`}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 2. SIDE CATEGORIES DRAWER (Centralized Discovery Menu)
// -------------------------------------------------------------
export function SideCategoryDrawer() {
  const { 
    isCategoryDrawerOpen, 
    setIsCategoryDrawerOpen, 
    selectedCategory, 
    setSelectedCategory, 
    setIsSizeGuideOpen,
    setIsTrackOrderModalOpen 
  } = useStore();

  if (!isCategoryDrawerOpen) return null;

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <Sparkles className="w-4 h-4" />,
    Suits: <Crown className="w-4 h-4" />,
    Anarkali: <Sparkle className="w-4 h-4" />,
    Shararas: <Gem className="w-4 h-4" />,
    Kurtas: <Feather className="w-4 h-4" />,
    'Co-ord Sets': <Flame className="w-4 h-4" />,
    Sarees: <Layers className="w-4 h-4" />,
    'Dupatta Sets': <Wind className="w-4 h-4" />,
  };

  return (
    <AnimatePresence>
      <div id="side-category-drawer-container" className="fixed inset-0 z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCategoryDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-sm bg-[#fffdfa] border-r border-[#c89d46]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#faedf0] bg-[#3d0a14] text-[#fffdfa] flex items-center justify-between">
              <div>
                <span className="text-[9px] tracking-widest uppercase font-bold text-[#c89d46] block">
                  HAUTE ETHNIC DIRECTORY
                </span>
                <h3 className="font-royal text-base font-bold text-white">
                  Atelier Master Weaves
                </h3>
              </div>

              <button
                id="close-category-drawer-btn"
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {INITIAL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    id={`drawer-category-${cat.id}`}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setIsCategoryDrawerOpen(false);
                      const el = document.getElementById('curated-catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3d0a14] text-[#fffdfa] shadow-xs'
                        : 'bg-white hover:bg-[#faedf0] text-[#3d0a14] border border-[#ebd9dc]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15 text-[#c89d46]' : 'bg-[#faedf0] text-[#3d0a14]'
                      }`}>
                        {categoryIcons[cat.slug] || <Sparkles className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs block">{cat.label}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-[#e0cfd2]' : 'text-[#806b6e]'}`}>
                          {cat.desc}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-[#c89d46] text-[#3d0a14]' : 'bg-[#faedf0] text-[#6b5558]'
                      }`}>
                        {cat.count}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#c89d46]' : 'text-[#806b6e]'}`} />
                    </div>
                  </button>
                );
              })}

              {/* Utility shortcuts */}
              <div className="pt-4 border-t border-[#faedf0] space-y-2">
                <button
                  id="drawer-size-guide-btn"
                  onClick={() => {
                    setIsCategoryDrawerOpen(false);
                    setIsSizeGuideOpen(true);
                  }}
                  className="w-full p-3 rounded-lg bg-white border border-[#ebd9dc] text-xs font-bold text-[#3d0a14] hover:bg-[#faedf0] flex items-center gap-2 cursor-pointer"
                >
                  <Ruler className="w-4 h-4 text-[#c89d46]" />
                  <span>Royal Sizing & Fit Chart (Inches / CM)</span>
                </button>

                <button
                  id="drawer-track-order-btn"
                  onClick={() => {
                    setIsCategoryDrawerOpen(false);
                    setIsTrackOrderModalOpen(true);
                  }}
                  className="w-full p-3 rounded-lg bg-white border border-[#ebd9dc] text-xs font-bold text-[#3d0a14] hover:bg-[#faedf0] flex items-center gap-2 cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4 text-[#c89d46]" />
                  <span>Track Live Courier Transit</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#fbf6f0] border-t border-[#faedf0] text-center text-xs text-[#806b6e]">
              <span className="font-royal font-bold text-[#3d0a14] block">SUIT BLISS AURA</span>
              <span className="text-[10px]">100% Pure Mulberry Silk & Silk Mark Certified</span>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 3. QUICK VIEW & INSPECT MODAL
// -------------------------------------------------------------
export function QuickViewModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    buyNow, 
    toggleWishlist, 
    isInWishlist, 
    setIsSizeGuideOpen 
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customFitNotes, setCustomFitNotes] = useState('');
  const [pincodeCheck, setPincodeCheck] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);
  const gallery = quickViewProduct.gallery && quickViewProduct.gallery.length > 0 
    ? quickViewProduct.gallery 
    : [quickViewProduct.image_url];

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeCheck.length === 6) {
      setPincodeStatus('✓ Delivery in 2-3 Business Days via BlueDart Air Express (Insured)');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian Postal PIN code');
    }
  };

  const discountPercent = quickViewProduct.original_price > quickViewProduct.price
    ? Math.round(((quickViewProduct.original_price - quickViewProduct.price) / quickViewProduct.original_price) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div id="quick-view-modal-container" className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl bg-[#fffdfa] rounded-2xl shadow-2xl overflow-hidden border border-[#c89d46]/40 text-[#3d0a14]"
          >
            {/* Close Button */}
            <button
              id="close-quickview-btn"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#3d0a14] hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Gallery */}
              <div className="p-4 sm:p-6 bg-[#faf5f6] flex flex-col justify-between">
                <div className="relative aspect-3/4 rounded-xl overflow-hidden shadow-inner bg-white">
                  <SafeImage
                    src={gallery[selectedImageIndex] || quickViewProduct.image_url}
                    alt={quickViewProduct.title}
                    className="w-full h-full object-cover"
                  />
                  {quickViewProduct.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#3d0a14] text-[#c89d46] text-[10px] font-bold tracking-widest uppercase rounded shadow-xs z-10">
                      {quickViewProduct.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-14 h-18 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          selectedImageIndex === idx ? 'border-[#3d0a14] ring-2 ring-[#c89d46]' : 'border-transparent opacity-70'
                        }`}
                      >
                        <SafeImage src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details & Buying Flow */}
              <div className="p-5 sm:p-8 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="space-y-3">
                  {/* Category & Color */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c89d46]">
                      {quickViewProduct.category} · Silk Mark Authenticated
                    </span>
                    <div className="flex items-center gap-1 text-[#c89d46] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#c89d46]" />
                      <span>{quickViewProduct.rating} ({quickViewProduct.reviews_count} reviews)</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-royal text-lg sm:text-xl font-bold text-[#3d0a14] leading-snug">
                    {quickViewProduct.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 pb-2 border-b border-[#faedf0]">
                    <span className="text-xl font-bold text-[#3d0a14]">
                      ₹{quickViewProduct.price.toLocaleString()}
                    </span>
                    {quickViewProduct.original_price > quickViewProduct.price && (
                      <>
                        <span className="text-xs text-[#806b6e] line-through">
                          ₹{quickViewProduct.original_price.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Single Shade Info */}
                  <div className="p-2.5 bg-[#fbf6f0] rounded-lg border border-[#ebd9dc] text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-black/20" 
                        style={{ backgroundColor: quickViewProduct.color }} 
                      />
                      <div>
                        <span className="font-bold text-[#3d0a14] block">Shade: {quickViewProduct.colorName}</span>
                        <span className="text-[10px] text-[#806b6e]">{quickViewProduct.fabric} · {quickViewProduct.craft}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                      In Stock
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#6b5558] leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Size Selector */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#3d0a14]">Select Garment Size:</span>
                      <button
                        id="quickview-size-guide-link"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-[#c89d46] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Size Chart</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {quickViewProduct.sizes.map((s) => (
                        <button
                          key={s}
                          id={`quickview-size-${s}`}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                            selectedSize === s
                              ? 'bg-[#3d0a14] text-[#fffdfa] border-[#3d0a14] shadow-xs'
                              : 'bg-white text-[#3d0a14] border-[#ebd9dc] hover:border-[#3d0a14]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Sizing Notes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b5558] mb-1">
                      Custom Fit Request (Optional - Kurti length, sleeve cut):
                    </label>
                    <input
                      id="quickview-custom-fit-input"
                      type="text"
                      value={customFitNotes}
                      onChange={(e) => setCustomFitNotes(e.target.value)}
                      placeholder="e.g. Kurti Length 47 inches, Sleeves 19 inches"
                      className="w-full px-3 py-1.5 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] placeholder-[#806b6e] focus:outline-hidden focus:border-[#c89d46]"
                    />
                  </div>

                  {/* Pincode Estimator */}
                  <form onSubmit={handlePincodeCheck} className="pt-1">
                    <div className="flex gap-2">
                      <input
                        id="quickview-pincode-input"
                        type="text"
                        maxLength={6}
                        value={pincodeCheck}
                        onChange={(e) => setPincodeCheck(e.target.value)}
                        placeholder="Enter PIN Code for delivery check"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] placeholder-[#806b6e] focus:outline-hidden focus:border-[#c89d46]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-white border border-[#ebd9dc] text-[#3d0a14] rounded-md text-xs font-bold hover:bg-[#faedf0] cursor-pointer"
                      >
                        Check
                      </button>
                    </div>
                    {pincodeStatus && (
                      <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                        {pincodeStatus}
                      </p>
                    )}
                  </form>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#faedf0] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="quickview-add-to-cart-btn"
                      onClick={() => addToCart(quickViewProduct, selectedSize, 1, customFitNotes)}
                      className="py-3 bg-[#fffdfa] border-2 border-[#3d0a14] text-[#3d0a14] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#faedf0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#c89d46]" />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      id="quickview-buy-now-btn"
                      onClick={() => buyNow(quickViewProduct, selectedSize, customFitNotes)}
                      className="py-3 bg-[#3d0a14] text-[#fffdfa] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#521320] transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#c89d46]" />
                      <span>Buy Now</span>
                    </button>
                  </div>

                  <button
                    id="quickview-toggle-wishlist-btn"
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className="w-full py-2 bg-transparent text-[#6b5558] hover:text-[#3d0a14] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{inWishlist ? 'In Royal Wishlist' : 'Add to Wishlist Vault'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 4. ORDER SUCCESS CONFIRMATION MODAL
// -------------------------------------------------------------
export function OrderSuccessModal() {
  const { 
    isOrderSuccessOpen, 
    setIsOrderSuccessOpen, 
    lastOrder, 
    setIsTrackOrderModalOpen, 
    setTrackingOrder 
  } = useStore();

  if (!isOrderSuccessOpen || !lastOrder) return null;

  const handleTrackThisOrder = () => {
    setTrackingOrder(lastOrder);
    setIsOrderSuccessOpen(false);
    setIsTrackOrderModalOpen(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const waUrl = `https://wa.me/919876543210?text=Hello%20Suit%20Bliss%20Aura%2C%20I%20have%20placed%20Order%20ID%20${lastOrder.id}%20for%20an%20amount%20of%20INR%20${lastOrder.amount}.`;

  return (
    <AnimatePresence>
      <div id="order-success-modal-container" className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOrderSuccessOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#fffdfa] rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#c89d46]/50 text-[#3d0a14] space-y-5"
          >
            <button
              id="close-success-modal-btn"
              onClick={() => setIsOrderSuccessOpen(false)}
              className="absolute top-4 right-4 text-[#806b6e] hover:text-[#3d0a14] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] tracking-widest font-bold uppercase text-[#c89d46]">
                AUTHENTICATED ATELIER DISPATCH
              </span>
              <h3 className="font-royal text-xl font-bold text-[#3d0a14]">
                Order Confirmed with Honor
              </h3>
              <p className="text-xs text-[#806b6e]">
                Order ID: <strong className="text-[#3d0a14] font-mono">{lastOrder.id}</strong>
              </p>
            </div>

            {/* Order Summary Receipt Box */}
            <div className="p-4 bg-white rounded-lg border border-[#edd5d9] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#faedf0] pb-2">
                <span className="text-[#806b6e]">Patron Name</span>
                <span className="font-bold text-[#3d0a14]">{lastOrder.customer_name}</span>
              </div>

              <div className="flex justify-between border-b border-[#faedf0] pb-2">
                <span className="text-[#806b6e]">Delivery Destination</span>
                <span className="text-right text-[#3d0a14] max-w-xs">{lastOrder.shipping_address}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#806b6e] uppercase">Curated Ensembles:</span>
                {lastOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="line-clamp-1 flex-1 pr-2">
                      {it.quantity}x {it.title} ({it.size})
                    </span>
                    <span className="font-bold shrink-0">₹{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#faedf0] pt-2 flex justify-between font-bold text-sm text-[#3d0a14]">
                <span>Total Paid Amount</span>
                <span>₹{lastOrder.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions: Print invoice, Track live, WhatsApp */}
            <div className="space-y-2.5">
              <button
                id="track-last-order-btn"
                onClick={handleTrackThisOrder}
                className="w-full py-3 bg-[#3d0a14] text-[#fffdfa] rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-[#521320] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#c89d46]" />
                <span>Track Live Transit Timeline</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="print-invoice-btn"
                  onClick={handlePrintInvoice}
                  className="py-2.5 bg-white border border-[#ebd9dc] text-[#3d0a14] rounded-lg text-xs font-semibold hover:border-[#3d0a14] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#c89d46]" />
                  <span>Print Invoice</span>
                </button>

                <a
                  id="whatsapp-concierge-order-link"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 5. LIVE ORDER TRACKING MODAL
// -------------------------------------------------------------
export function TrackOrderModal() {
  const { isTrackOrderModalOpen, setIsTrackOrderModalOpen, trackingOrder, trackOrderById } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<typeof trackingOrder>(null);

  if (!isTrackOrderModalOpen) return null;

  const activeOrder = searchedOrder || trackingOrder;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    const res = trackOrderById(searchInput);
    if (res.found && res.order) {
      setSearchedOrder(res.order);
    } else {
      alert(`Order "${searchInput}" not found. Try searching with recent order ID or "AURA-7821-DEL".`);
    }
  };

  const steps = [
    { title: 'Order Authenticated', desc: 'Silk Mark verification & quality pass', date: 'Day 1' },
    { title: 'Master Tailor Final Pressing', desc: 'Hand stitched and packaged in royal box', date: 'Day 2' },
    { title: 'BlueDart Air Dispatched', desc: 'Air transit tracking generated', date: 'Day 3' },
    { title: 'Out for Royal Delivery', desc: 'Insured courier at your doorstep', date: 'Day 4' },
  ];

  return (
    <AnimatePresence>
      <div id="track-order-modal" className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsTrackOrderModalOpen(false);
            setSearchedOrder(null);
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#fffdfa] rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#c89d46]/40 text-[#3d0a14] space-y-5"
          >
            <button
              id="close-track-order-btn"
              onClick={() => {
                setIsTrackOrderModalOpen(false);
                setSearchedOrder(null);
              }}
              className="absolute top-4 right-4 text-[#806b6e] hover:text-[#3d0a14] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] tracking-widest font-bold uppercase text-[#c89d46]">
                LIVE COURIER & TAILORING TELEMETRY
              </span>
              <h3 className="font-royal text-lg font-bold text-[#3d0a14] mt-0.5">
                Track Royal Order Status
              </h3>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                id="track-order-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder="Enter Order ID (e.g. AURA-7821-DEL)"
                className="flex-1 px-3 py-2 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46] uppercase font-mono"
              />
              <button
                id="track-order-submit-btn"
                type="submit"
                className="px-4 py-2 bg-[#3d0a14] text-[#fffdfa] rounded-md text-xs font-bold hover:bg-[#521320] transition-colors cursor-pointer"
              >
                Track
              </button>
            </form>

            {activeOrder && (
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-white border border-[#edd5d9] rounded-lg text-xs flex justify-between">
                  <div>
                    <div className="text-[#806b6e]">Order ID</div>
                    <div className="font-bold text-[#3d0a14] font-mono">{activeOrder.id}</div>
                  </div>
                  <div>
                    <div className="text-[#806b6e]">Courier Partner</div>
                    <div className="font-bold text-emerald-700">BlueDart Air Express</div>
                  </div>
                  <div>
                    <div className="text-[#806b6e]">Estimated Arrival</div>
                    <div className="font-bold text-[#3d0a14]">Within 48-72 Hours</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 pl-2">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-[#3d0a14] text-[#c89d46] flex items-center justify-center shrink-0 z-10 text-xs font-bold shadow-xs">
                        ✓
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-bold text-[#3d0a14]">{step.title}</h5>
                          <span className="text-[10px] text-[#c89d46] font-semibold">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-[#806b6e]">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 6. SIZE GUIDE MODAL (Inches & CM Tabbed)
// -------------------------------------------------------------
export function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isSizeGuideOpen) return null;

  const chartData = [
    { size: 'XS', bust: unit === 'inches' ? '32-34' : '81-86', waist: unit === 'inches' ? '26-28' : '66-71', hip: unit === 'inches' ? '36-38' : '91-96', length: unit === 'inches' ? '46' : '117' },
    { size: 'S', bust: unit === 'inches' ? '36' : '91', waist: unit === 'inches' ? '30' : '76', hip: unit === 'inches' ? '40' : '101', length: unit === 'inches' ? '46' : '117' },
    { size: 'M', bust: unit === 'inches' ? '38' : '96', waist: unit === 'inches' ? '32' : '81', hip: unit === 'inches' ? '42' : '106', length: unit === 'inches' ? '47' : '119' },
    { size: 'L', bust: unit === 'inches' ? '40' : '101', waist: unit === 'inches' ? '34' : '86', hip: unit === 'inches' ? '44' : '111', length: unit === 'inches' ? '47' : '119' },
    { size: 'XL', bust: unit === 'inches' ? '42' : '106', waist: unit === 'inches' ? '36' : '91', hip: unit === 'inches' ? '46' : '116', length: unit === 'inches' ? '48' : '122' },
    { size: 'XXL', bust: unit === 'inches' ? '44' : '112', waist: unit === 'inches' ? '38' : '96', hip: unit === 'inches' ? '48' : '122', length: unit === 'inches' ? '48' : '122' },
  ];

  return (
    <AnimatePresence>
      <div id="size-guide-modal" className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSizeGuideOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#fffdfa] rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#c89d46]/40 text-[#3d0a14] space-y-4"
          >
            <button
              id="close-size-guide-btn"
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-[#806b6e] hover:text-[#3d0a14] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-widest font-bold uppercase text-[#c89d46]">
                  ROYAL TAILORING PRECISION
                </span>
                <h3 className="font-royal text-lg font-bold text-[#3d0a14] mt-0.5">
                  Garment Fit & Measurement Guide
                </h3>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center p-1 bg-[#faedf0] rounded-lg border border-[#ebd9dc] text-xs font-bold">
                <button
                  id="unit-toggle-inches"
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 rounded-md transition-all ${unit === 'inches' ? 'bg-[#3d0a14] text-white shadow-xs' : 'text-[#6b5558]'}`}
                >
                  Inches
                </button>
                <button
                  id="unit-toggle-cm"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-md transition-all ${unit === 'cm' ? 'bg-[#3d0a14] text-white shadow-xs' : 'text-[#6b5558]'}`}
                >
                  CM
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-[#ebd9dc]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#faedf0] text-[#3d0a14] font-bold border-b border-[#ebd9dc]">
                  <tr>
                    <th className="p-3">Standard Size</th>
                    <th className="p-3">Bust ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Hip ({unit})</th>
                    <th className="p-3">Kurti Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#faedf0] bg-white">
                  {chartData.map((row) => (
                    <tr key={row.size} className="hover:bg-[#faedf0]/30 transition-colors">
                      <td className="p-3 font-bold text-[#3d0a14]">{row.size}</td>
                      <td className="p-3 text-[#6b5558]">{row.bust}</td>
                      <td className="p-3 text-[#6b5558]">{row.waist}</td>
                      <td className="p-3 text-[#6b5558]">{row.hip}</td>
                      <td className="p-3 text-[#6b5558]">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#fbf6f0] rounded-lg border border-[#ebd9dc] text-xs text-[#6b5558] space-y-1">
              <strong className="text-[#3d0a14] block">How to Measure for Perfect Fit:</strong>
              <p>• <strong>Bust:</strong> Measure around the fullest part of your chest with relaxed posture.</p>
              <p>• <strong>Waist:</strong> Measure around your natural waistline, just above the hip bone.</p>
              <p>• <strong>Custom Alterations:</strong> All garments come with 2-inch inner fabric margins for effortless local adjustments or tailor modification.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 7. WISHLIST DRAWER
// -------------------------------------------------------------
export function WishlistDrawer() {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    products, 
    toggleWishlist, 
    addToCart 
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      <div id="wishlist-drawer-container" className="fixed inset-0 z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWishlistOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#fffdfa] border-l border-[#c89d46]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#faedf0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                <h3 className="font-royal text-base font-bold text-[#3d0a14]">
                  Royal Wishlist Vault ({wishlistProducts.length})
                </h3>
              </div>
              <button
                id="close-wishlist-drawer-btn"
                onClick={() => setIsWishlistOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#faedf0] flex items-center justify-center text-[#3d0a14] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Heart className="w-12 h-12 text-[#ebd9dc] mx-auto" />
                  <h4 className="font-royal text-base font-bold text-[#3d0a14]">Your Vault is Empty</h4>
                  <p className="text-xs text-[#806b6e] max-w-xs mx-auto">
                    Save your favorite silk master garments to your wishlist by tapping the heart icon.
                  </p>
                </div>
              ) : (
                wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-xl border border-[#ebd9dc] shadow-2xs flex gap-3 items-center"
                  >
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#faedf0] shrink-0">
                      <SafeImage src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-[#3d0a14] line-clamp-1">{p.title}</h4>
                      <p className="text-[10px] text-[#806b6e]">{p.category} · {p.colorName}</p>
                      <span className="text-xs font-bold text-[#3d0a14] block mt-1">₹{p.price.toLocaleString()}</span>
                      
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            addToCart(p, 'M', 1);
                            toggleWishlist(p.id);
                          }}
                          className="px-3 py-1 bg-[#3d0a14] text-white rounded text-[10px] font-bold hover:bg-[#521320] cursor-pointer"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="px-2 py-1 text-[10px] text-rose-700 font-semibold hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 8. WRITE REVIEW MODAL
// -------------------------------------------------------------
export function WriteReviewModal() {
  const { isReviewModalOpen, setIsReviewModalOpen, addReview, products, showToast } = useStore();
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [productTitle, setProductTitle] = useState(products[0]?.title || 'Royal Silk Suit');

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content || !title) return;

    addReview({
      author,
      city: city || 'New Delhi',
      rating,
      title,
      content,
      productTitle,
    });

    setIsReviewModalOpen(false);
    showToast('✨ Thank you! Your verified patron review has been published.');
  };

  return (
    <AnimatePresence>
      <div id="write-review-modal" className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsReviewModalOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-[#fffdfa] rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#c89d46]/40 text-[#3d0a14] space-y-4"
          >
            <button
              id="close-review-modal-btn"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-[#806b6e] hover:text-[#3d0a14] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] tracking-widest font-bold uppercase text-[#c89d46]">
                PATRON TESTIMONIAL DISPATCH
              </span>
              <h3 className="font-royal text-lg font-bold text-[#3d0a14] mt-0.5">
                Share Your Atelier Experience
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#6b5558] mb-1">Select Rating *</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#c89d46] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-[#c89d46]' : 'text-[#ebd9dc]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6b5558] mb-1">Your Full Name *</label>
                <input
                  required
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Princess Gayatri Devi"
                  className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6b5558] mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#6b5558] mb-1">Garment</label>
                  <select
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full px-2 py-2 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                  >
                    {products.slice(0, 10).map((p) => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6b5558] mb-1">Review Headline *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exquisite silk weave and royal flare"
                  className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6b5558] mb-1">Detailed Feedback *</label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the fabric texture, zari brilliance, fitting, and delivery experience..."
                  className="w-full px-3 py-2 bg-white border border-[#ebd9dc] rounded-md text-xs text-[#3d0a14] focus:outline-hidden focus:border-[#c89d46]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3d0a14] text-[#fffdfa] rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-[#521320] transition-colors cursor-pointer shadow-xs"
              >
                Submit Verified Review
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------
// 9. TOAST NOTIFICATION
// -------------------------------------------------------------
export function ToastNotification() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-[#3d0a14] text-[#fffdfa] px-4 py-3 rounded-xl border border-[#c89d46] shadow-2xl flex items-center gap-3 text-xs max-w-sm"
      >
        <Sparkles className="w-4 h-4 text-[#c89d46] shrink-0" />
        <span className="font-semibold">{toastMessage}</span>
      </motion.div>
    </AnimatePresence>
  );
}
