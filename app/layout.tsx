'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  ShieldCheck, 
  Crown, 
  LayoutDashboard, 
  Truck, 
  PackageCheck, 
  Ruler,
  RotateCcw,
  Home,
  Grid,
  X,
  MessageCircle
} from 'lucide-react';
import './globals.css';
import { StoreProvider, useStore } from '@/lib/storeContext';
import { SafeImage } from '@/components/SafeImage';
import { 
  SlideOverCart, 
  SideCategoryDrawer,
  QuickViewModal, 
  OrderSuccessModal,
  TrackOrderModal,
  SizeGuideModal,
  WishlistDrawer,
  WriteReviewModal,
  ToastNotification
} from '@/components/StoreModals';

function HeaderContent() {
  const { 
    cartCount, 
    cartTotal, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen, 
    setIsCategoryDrawerOpen,
    setIsTrackOrderModalOpen,
    setIsSizeGuideOpen,
    setSelectedCategory,
    products,
    setQuickViewProduct
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    '👑 100% PURE MULBERRY KATAN SILK • GOVT OF INDIA SILK MARK CERTIFIED',
    '✨ FESTIVE PRIVILEGE: USE VOUCHER "AURA20" FOR 20% OFF ON ORDERS ABOVE ₹4,999',
    '✈️ COMPLIMENTARY INSURED AIR EXPRESS SHIPPING ACROSS 28,000+ PIN CODES',
    '🪡 BESPOKE CUSTOM SIZING & HANDMADE FINISHING AVAILABLE ON ALL SUITS',
    '💳 CASH ON DELIVERY (COD) & INSTANT UPI PAYMENT ACCEPTED'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim() === '' ? [] : products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.colorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.fabric.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-[#1c080d] text-[#c89d46] text-[10px] sm:text-[11px] py-2 px-4 border-b border-[#c89d46]/30 font-semibold tracking-wider text-center flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={announcementIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 truncate max-w-4xl"
          >
            <span>{announcements[announcementIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. MAIN LUXURY STICKY HEADER */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#fffdfa]/98 backdrop-blur-md shadow-md py-2.5 border-b border-[#c89d46]/30' 
            : 'bg-[#fffdfa] py-3.5 border-b border-[#faedf0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Collections Drawer Button & Quick Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="open-side-category-drawer-btn"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#3d0a14] text-[#fffdfa] hover:bg-[#521320] transition-colors shadow-xs cursor-pointer text-xs font-bold tracking-wider"
              title="Browse Atelier Collections"
            >
              <Menu className="w-4 h-4 text-[#c89d46]" />
              <span className="hidden sm:inline uppercase text-[11px]">Collections</span>
            </button>

            {/* Desktop Quick Nav */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-[#6b5558]">
              <button
                onClick={() => setSelectedCategory('Suits')}
                className="px-2.5 py-1.5 rounded hover:text-[#3d0a14] hover:bg-[#faedf0] transition-colors cursor-pointer"
              >
                Suits
              </button>
              <button
                onClick={() => setSelectedCategory('Anarkali')}
                className="px-2.5 py-1.5 rounded hover:text-[#3d0a14] hover:bg-[#faedf0] transition-colors cursor-pointer"
              >
                Anarkalis
              </button>
              <button
                onClick={() => setSelectedCategory('Shararas')}
                className="px-2.5 py-1.5 rounded hover:text-[#3d0a14] hover:bg-[#faedf0] transition-colors cursor-pointer"
              >
                Shararas
              </button>
              <button
                onClick={() => setSelectedCategory('Kurtas')}
                className="px-2.5 py-1.5 rounded hover:text-[#3d0a14] hover:bg-[#faedf0] transition-colors cursor-pointer"
              >
                Kurtas
              </button>
              <button
                onClick={() => setSelectedCategory('Sarees')}
                className="px-2.5 py-1.5 rounded hover:text-[#3d0a14] hover:bg-[#faedf0] transition-colors cursor-pointer"
              >
                Sarees
              </button>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded text-[#806b6e] hover:text-[#3d0a14] transition-colors cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5 text-[#c89d46]" />
                <span>Fit Guide</span>
              </button>
            </nav>
          </div>

          {/* Center: Brand Identity */}
          <div className="text-center shrink-0">
            <Link href="/" className="inline-block group text-center">
              <span className="block font-royal text-base sm:text-xl md:text-2xl font-bold tracking-[0.16em] sm:tracking-[0.2em] text-[#3d0a14] group-hover:text-[#5a1422] transition-colors">
                SUIT BLISS AURA
              </span>
              <span className="block text-[8px] sm:text-[10px] tracking-[0.22em] text-[#c89d46] uppercase font-semibold -mt-0.5">
                Haute Indian Ethnic Couture
              </span>
            </Link>
          </div>

          {/* Right: Actions (Search, Track, Wishlist, Bag, Admin) */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Search Button */}
            <button
              id="open-search-header-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-[#faedf0] flex items-center justify-center text-[#3d0a14] transition-colors cursor-pointer"
              title="Search Catalog"
            >
              <Search className="w-4 h-4 text-[#3d0a14]" />
            </button>

            {/* Track Order Button */}
            <button
              id="header-track-order-btn"
              onClick={() => setIsTrackOrderModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#3d0a14] hover:bg-[#faedf0] font-semibold transition-colors cursor-pointer"
              title="Track Live Order Transit"
            >
              <PackageCheck className="w-4 h-4 text-[#c89d46]" />
              <span className="hidden md:inline text-[11px]">Track Order</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-[#faedf0] flex items-center justify-center text-[#3d0a14] transition-colors cursor-pointer"
              title="Wishlist Vault"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-red-600 fill-red-600' : 'text-[#3d0a14]'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#faedf0] border border-[#ebd9dc] hover:border-[#c89d46] text-[#3d0a14] transition-all cursor-pointer shadow-xs"
              title="View Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#c89d46]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-[#3d0a14] text-[#fffdfa] text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-[11px] font-bold leading-none">₹{cartTotal.toLocaleString()}</span>
                <span className="block text-[9px] text-[#806b6e] uppercase leading-tight font-medium">Bag</span>
              </div>
            </button>

            {/* Admin Portal Link */}
            <Link
              id="header-admin-link"
              href="/admin"
              className="w-8 h-8 rounded-full hover:bg-[#faedf0] flex items-center justify-center text-[#806b6e] hover:text-[#3d0a14] transition-colors"
              title="Atelier Admin Portal"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Search Drawer / Popover */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[#faedf0] bg-[#fffdfa] shadow-lg overflow-hidden"
            >
              <div className="max-w-4xl mx-auto p-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#806b6e]" />
                  <input
                    id="live-search-input"
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Banarasi suits, Kalidar anarkali, Chanderi kurtas, Mulberry silk, Gota patti..."
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#ebd9dc] rounded-lg text-xs sm:text-sm text-[#3d0a14] placeholder-[#806b6e] focus:outline-hidden focus:border-[#c89d46]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#806b6e] hover:text-[#3d0a14]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Instant Search Results Preview */}
                {searchResults.length > 0 && (
                  <div className="mt-3 divide-y divide-[#faedf0] bg-white rounded-lg border border-[#ebd9dc] overflow-hidden shadow-xs">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setQuickViewProduct(product);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-3 hover:bg-[#faedf0]/50 transition-colors flex items-center justify-between cursor-pointer gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded overflow-hidden bg-[#faedf0] shrink-0">
                            <SafeImage
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#3d0a14] line-clamp-1">{product.title}</h4>
                            <p className="text-[10px] text-[#806b6e]">
                              {product.category} · {product.colorName} · {product.fabric}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-[#3d0a14]">₹{product.price.toLocaleString()}</span>
                          <span className="text-[10px] text-[#c89d46] block font-semibold">Inspect ↗</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function MobileBottomNav() {
  const { 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen, 
    setIsCategoryDrawerOpen,
    setIsTrackOrderModalOpen
  } = useStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdfa]/98 backdrop-blur-md border-t border-[#ebd9dc] px-3 py-2 flex items-center justify-around shadow-lg">
      <Link 
        href="/"
        className="flex flex-col items-center justify-center text-[#3d0a14] hover:text-[#c89d46] transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Home</span>
      </Link>

      <button
        onClick={() => setIsCategoryDrawerOpen(true)}
        className="flex flex-col items-center justify-center text-[#3d0a14] hover:text-[#c89d46] transition-colors"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Categories</span>
      </button>

      <button
        onClick={() => setIsTrackOrderModalOpen(true)}
        className="flex flex-col items-center justify-center text-[#3d0a14] hover:text-[#c89d46] transition-colors"
      >
        <PackageCheck className="w-5 h-5 text-[#c89d46]" />
        <span className="text-[10px] font-semibold mt-0.5">Track</span>
      </button>

      <button
        onClick={() => setIsWishlistOpen(true)}
        className="relative flex flex-col items-center justify-center text-[#3d0a14] hover:text-[#c89d46] transition-colors"
      >
        <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-red-600 fill-red-600' : ''}`} />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center text-[#3d0a14] hover:text-[#c89d46] transition-colors"
      >
        <ShoppingBag className="w-5 h-5 text-[#c89d46]" />
        {cartCount > 0 && (
          <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#3d0a14] text-white text-[9px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-semibold mt-0.5">Bag</span>
      </button>
    </div>
  );
}

function FooterContent() {
  const { 
    setIsTrackOrderModalOpen, 
    setIsSizeGuideOpen, 
    setIsReviewModalOpen,
    setSelectedCategory 
  } = useStore();

  return (
    <footer className="bg-[#1c080d] text-[#e8d5d8] border-t-2 border-[#c89d46]/40 mt-16 pb-16 md:pb-0">
      {/* 4 Pillars of Excellence */}
      <div className="border-b border-[#c89d46]/20 bg-[#290d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3d0a14] border border-[#c89d46]/40 flex items-center justify-center text-[#c89d46] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-wide">Silk Mark Certified</h5>
              <p className="text-[11px] text-[#c4adb1]">100% Pure Mulberry & Katan Silks</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3d0a14] border border-[#c89d46]/40 flex items-center justify-center text-[#c89d46] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-wide">Insured Air Express</h5>
              <p className="text-[11px] text-[#c4adb1]">Free Delivery across 28,000+ PIN Codes</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3d0a14] border border-[#c89d46]/40 flex items-center justify-center text-[#c89d46] shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-wide">Master Handlooms</h5>
              <p className="text-[11px] text-[#c4adb1]">Authentic Varanasi & Jaipur Weaves</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3d0a14] border border-[#c89d46]/40 flex items-center justify-center text-[#c89d46] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-wide">7-Day Easy Exchange</h5>
              <p className="text-[11px] text-[#c4adb1]">Hassle-Free Sizing & Fit Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Story */}
        <div className="space-y-3">
          <span className="font-royal text-lg font-bold tracking-widest text-[#c89d46] block">
            SUIT BLISS AURA
          </span>
          <p className="text-xs text-[#c4adb1] leading-relaxed">
            Preserving centuries of Indian handloom heritage through single-shade master garments, pure Mulberry Katan silk, 32-kali Kalidar twirls, and authentic Kadwa zari artistry.
          </p>
          <div className="pt-2">
            <span className="text-[10px] text-[#c89d46] font-semibold tracking-wider uppercase block">
              Govt. Registered Silk Mark Member #SM-DEL-4821
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#c89d46]/30 pb-1.5">
            Atelier Navigation
          </h4>
          <ul className="space-y-1.5 text-xs text-[#c4adb1]">
            <li>
              <button 
                onClick={() => setSelectedCategory('Suits')} 
                className="hover:text-[#c89d46] transition-colors text-left"
              >
                Royal Suits & Sets
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory('Anarkali')} 
                className="hover:text-[#c89d46] transition-colors text-left"
              >
                32-Kali Kalidar Anarkalis
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory('Shararas')} 
                className="hover:text-[#c89d46] transition-colors text-left"
              >
                Mirrorwork Shararas
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory('Kurtas')} 
                className="hover:text-[#c89d46] transition-colors text-left"
              >
                Jaipur Gota Patti Kurtas
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory('Sarees')} 
                className="hover:text-[#c89d46] transition-colors text-left"
              >
                Heritage Banarasi Sarees
              </button>
            </li>
          </ul>
        </div>

        {/* Patron Services */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#c89d46]/30 pb-1.5">
            Patron Care & Services
          </h4>
          <ul className="space-y-1.5 text-xs text-[#c4adb1]">
            <li>
              <button onClick={() => setIsTrackOrderModalOpen(true)} className="hover:text-[#c89d46] transition-colors text-left">
                Track Live Order Transit
              </button>
            </li>
            <li>
              <button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-[#c89d46] transition-colors text-left">
                Royal Sizing & Fit Chart
              </button>
            </li>
            <li>
              <button onClick={() => setIsReviewModalOpen(true)} className="hover:text-[#c89d46] transition-colors text-left">
                Submit Patron Testimonial
              </button>
            </li>
            <li>
              <Link href="/admin" className="hover:text-[#c89d46] transition-colors text-left font-semibold text-[#c89d46]">
                Atelier Admin Console ↗
              </Link>
            </li>
          </ul>
        </div>

        {/* Concierge Contact */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#c89d46]/30 pb-1.5">
            Royal Concierge Desk
          </h4>
          <p className="text-xs text-[#c4adb1]">
            Inquiries regarding pure silk certification, custom alterations, or wedding bulk orders:
          </p>
          <div className="space-y-1.5 text-xs">
            <a 
              href="https://wa.me/919876543210?text=Hello%20Suit%20Bliss%20Aura%2C%20I%20have%20an%20inquiry%20regarding%20the%20pure%20silk%20collection." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: +91 98765 43210</span>
            </a>
            <div className="text-[#c4adb1]">Email: concierge@suitblissaura.com</div>
            <div className="text-[#c4adb1]">Atelier: Mehrauli Heritage Lane, New Delhi</div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#c89d46]/20 py-4 text-center text-[11px] text-[#a89094]">
        © {new Date().getFullYear()} SUIT BLISS AURA · All Rights Reserved · Handcrafted with Honor in India
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Suit Bliss Aura</title>
        <meta name="description" content="Ultra-luxury Indian ethnic and contemporary fashion e-commerce storefront with curated collections, interactive cart, bespoke product showcase, and admin dashboard." />
        <meta property="og:title" content="Suit Bliss Aura" />
        <meta property="og:description" content="Ultra-luxury Indian ethnic and contemporary fashion e-commerce storefront with curated collections, interactive cart, bespoke product showcase, and admin dashboard." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-[#fffdfa] text-[#3d0a14] font-sans antialiased selection:bg-[#3d0a14] selection:text-[#fffdfa]">
        <StoreProvider>
          <div className="flex min-h-screen flex-col justify-between">
            <HeaderContent />
            <main className="flex-1">{children}</main>
            <FooterContent />
            <MobileBottomNav />
          </div>

          {/* All Interactive Modals & Drawers */}
          <SlideOverCart />
          <SideCategoryDrawer />
          <QuickViewModal />
          <OrderSuccessModal />
          <TrackOrderModal />
          <SizeGuideModal />
          <WishlistDrawer />
          <WriteReviewModal />
          <ToastNotification />
        </StoreProvider>
      </body>
    </html>
  );
}
