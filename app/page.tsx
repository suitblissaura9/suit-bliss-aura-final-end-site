'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  Star, 
  Eye, 
  Check, 
  Copy, 
  Crown, 
  ShieldCheck, 
  Truck,
  RotateCcw,
  CreditCard,
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  ChevronDown, 
  MessageSquarePlus, 
  Zap,
  Award,
  Scissors
} from 'lucide-react';
import { useStore } from '@/lib/storeContext';
import { INITIAL_CATEGORIES, FAQ_ITEMS } from '@/lib/catalogData';
import { SafeImage } from '@/components/SafeImage';

export default function HomePage() {
  const { 
    products, 
    addToCart, 
    buyNow, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct,
    setIsReviewModalOpen,
    setIsSizeGuideOpen,
    setIsTrackOrderModalOpen,
    applyCoupon,
    selectedCategory,
    setSelectedCategory,
    reviews,
    showToast
  } = useStore();

  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('trending');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [craftTab, setCraftTab] = useState<'kadwa' | 'silkmark' | 'tailoring' | 'dispatch'>('kadwa');
  const [liveBuyerIndex, setLiveBuyerIndex] = useState(0);
  const [showLiveTicker, setShowLiveTicker] = useState(true);

  // Live recent customer purchase ticker
  const recentPurchases = [
    { name: 'Pooja K.', city: 'New Delhi (GK-1)', item: 'Royal Banarasi Katan Silk Suit', time: '4 mins ago' },
    { name: 'Dr. Sunita V.', city: 'Mumbai (Juhu)', item: 'Mehrunissa 32-Kali Kalidar Anarkali', time: '11 mins ago' },
    { name: 'Ananya S.', city: 'Bangalore (Indiranagar)', item: 'Bespoke Mirrorwork Sharara Set', time: '19 mins ago' },
    { name: 'Mehak G.', city: 'Jaipur (C-Scheme)', item: 'Imperial Chanderi Kurta Set', time: '34 mins ago' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBuyerIndex((prev) => (prev + 1) % recentPurchases.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [recentPurchases.length]);

  // Hero Slider Banners
  const heroSlides = [
    {
      id: 1,
      badge: 'GOVT. SILK MARK CERTIFIED',
      title: 'Royal Banarasi Katan Silk Suits',
      subtitle: 'Pure Mulberry Silk • Electroplated Kadwa Zari • Scalloped Dupattas',
      desc: 'Single-shade monochrome heritage suits handcrafted by Varanasi master weavers. Pure silver-gold zari with zero floating threads on reverse.',
      ctaText: 'Explore Royal Suits',
      category: 'Suits',
      bgGradient: 'from-[#1f060b] via-[#330c14] to-[#47101c]',
      imgUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80',
      price: '₹8,999',
      originalPrice: '₹18,999'
    },
    {
      id: 2,
      badge: '32-KALI MAJESTIC FLARE',
      title: 'Opulent Kalidar Anarkali Gowns',
      subtitle: '6-Meter Royal Twirl • Handcrafted Zardozi • Pure Raw Silk',
      desc: 'Mughal court silhouettes hand-stitched with dabka needlework, built-in satin can-can flare, and sheer champagne organza drapes.',
      ctaText: 'Explore Kalidar Anarkalis',
      category: 'Anarkali',
      bgGradient: 'from-[#0b1c15] via-[#143326] to-[#1f4837]',
      imgUrl: 'https://images.unsplash.com/photo-1578932750294-708f5fa0ab1a?w=900&auto=format&fit=crop&q=80',
      price: '₹9,499',
      originalPrice: '₹21,999'
    },
    {
      id: 3,
      badge: 'FESTIVE JAIPUR COUTURE',
      title: 'Heritage Gota Patti & Mirror Shararas',
      subtitle: 'Pure Chanderi Silk • Real Glass Mirrors • Scalloped Hems',
      desc: 'Celebratory tiered shararas designed for festive occasions with pure silk linings, handmade latkan doris, and embroidered sheer capes.',
      ctaText: 'Explore Shararas',
      category: 'Shararas',
      bgGradient: 'from-[#2b1206] via-[#4a220b] to-[#6d3412]',
      imgUrl: 'https://images.unsplash.com/photo-1539537159408-64c156a90c60?w=900&auto=format&fit=crop&q=80',
      price: '₹7,999',
      originalPrice: '₹16,999'
    }
  ];

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Filter and sort products (NO shade selector, NO redundant category bar lines)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
        
        let priceMatch = true;
        if (priceRange === 'under-6000') priceMatch = p.price < 6000;
        else if (priceRange === '6000-9000') priceMatch = p.price >= 6000 && p.price <= 9000;
        else if (priceRange === 'above-9000') priceMatch = p.price > 9000;

        return categoryMatch && priceMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (new Date(b.created_at || '').getTime() || 0) - (new Date(a.created_at || '').getTime() || 0);
        return 0; // trending default
      });
  }, [products, selectedCategory, priceRange, sortBy]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    applyCoupon(code);
    showToast(`✨ Voucher ${code} applied successfully!`);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    showToast('✨ Welcome to the Royal Privilege Club! Enjoy your 20% privilege code.');
  };

  const handleScrollToCatalog = (catSlug?: string) => {
    if (catSlug) setSelectedCategory(catSlug);
    const el = document.getElementById('curated-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categoryImages: Record<string, string> = {
    Suits: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    Anarkali: 'https://images.unsplash.com/photo-1578932750294-708f5fa0ab1a?w=600&auto=format&fit=crop&q=80',
    Shararas: 'https://images.unsplash.com/photo-1539537159408-64c156a90c60?w=600&auto=format&fit=crop&q=80',
    Kurtas: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&auto=format&fit=crop&q=80',
    'Co-ord Sets': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    Sarees: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    'Dupatta Sets': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
  };

  return (
    <div className="w-full bg-[#fdfbf7] text-[#2d1217] min-h-screen">
      
      {/* 1. HERO SLIDER BANNER (Clean, Non-overlapping Structural Layout) */}
      <section className="relative overflow-hidden bg-[#1f060b] text-[#fffdfa] border-b-2 border-[#c89d46]/40 shadow-xl">
        <div className="relative min-h-[520px] sm:min-h-[560px] md:min-h-[600px] flex items-center">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive 
                    ? 'opacity-100 z-10 pointer-events-auto' 
                    : 'opacity-0 z-0 pointer-events-none'
                } bg-gradient-to-r ${slide.bgGradient} flex items-center`}
              >
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
                  
                  {/* Left Column: Royal Typography & Interactive CTAs */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c89d46]/25 border border-[#c89d46]/70 text-[#fcedc7] text-xs font-bold tracking-widest uppercase shadow-xs">
                      <Crown className="w-4 h-4 text-[#c89d46]" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="font-royal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-base text-[#ebd9dc] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                      {slide.desc}
                    </p>

                    {/* Interactive Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                      <button
                        id={`hero-slide-${slide.id}-cta-btn`}
                        onClick={() => handleScrollToCatalog(slide.category)}
                        className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#c89d46] via-[#dfb76c] to-[#c89d46] hover:from-[#d9ae57] hover:to-[#e6c177] text-[#24060c] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#3d0a14]" />
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4 text-[#3d0a14]" />
                      </button>

                      <button
                        id={`hero-coupon-claim-${slide.id}`}
                        onClick={() => handleCopyCoupon('AURA20')}
                        className="px-5 sm:px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-[#c89d46]/60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs active:scale-95"
                      >
                        <Zap className="w-4 h-4 text-[#c89d46]" />
                        <span>20% OFF: AURA20</span>
                      </button>
                    </div>

                    {/* Quality Badges Strip - Clean Rounded Blocks */}
                    <div className="pt-4 border-t border-white/20 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-center">
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                        <span className="block text-xs sm:text-sm font-bold text-[#c89d46]">100% PURE</span>
                        <span className="text-[10px] sm:text-xs text-[#cfbcc0] font-medium">Mulberry Silk</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                        <span className="block text-xs sm:text-sm font-bold text-[#c89d46]">KADWA ZARI</span>
                        <span className="text-[10px] sm:text-xs text-[#cfbcc0] font-medium">Varanasi Loom</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                        <span className="block text-xs sm:text-sm font-bold text-[#c89d46]">48-HR AIR</span>
                        <span className="text-[10px] sm:text-xs text-[#cfbcc0] font-medium">Insured Dispatch</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Image Card */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div 
                      onClick={() => handleScrollToCatalog(slide.category)}
                      className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#c89d46]/70 group bg-black/40 cursor-pointer transform hover:scale-[1.02] transition-all duration-500"
                    >
                      <div className="aspect-[3/4] w-full">
                        <SafeImage
                          src={slide.imgUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg sm:text-xl font-bold text-[#c89d46]">{slide.price}</span>
                              <span className="text-xs text-white/70 line-through">{slide.originalPrice}</span>
                            </div>
                            <p className="text-xs text-[#ebd9dc] line-clamp-1 mt-0.5">{slide.subtitle}</p>
                          </div>
                          <span className="px-3 py-1.5 bg-[#c89d46] text-[#24060c] rounded-xl text-xs font-bold shadow-md">
                            Shop Now
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Controls (Large 44px Hit Targets for 100% Clickability) */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-4">
          <button
            id="hero-prev-slide-btn"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="w-10 h-10 rounded-full bg-black/70 hover:bg-[#c89d46] text-white hover:text-[#3d0a14] flex items-center justify-center transition-all cursor-pointer border border-white/30 active:scale-90 shadow-md"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                id={`hero-dot-${idx}`}
                onClick={() => setCurrentSlide(idx)}
                className="p-1 cursor-pointer flex items-center justify-center group"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span
                  className={`h-2.5 rounded-full transition-all duration-300 block ${
                    currentSlide === idx 
                      ? 'w-8 bg-[#c89d46] shadow-sm' 
                      : 'w-2.5 bg-white/40 group-hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            id="hero-next-slide-btn"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="w-10 h-10 rounded-full bg-black/70 hover:bg-[#c89d46] text-white hover:text-[#3d0a14] flex items-center justify-center transition-all cursor-pointer border border-white/30 active:scale-90 shadow-md"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 2. FOUR LUXURY ASSURANCE PILLARS STRIP (Rounded-2xl Blocks with Generous Spacing) */}
      <section className="bg-[#fffdfa] border-b border-[#ebd9dc] py-5 sm:py-6 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            
            <div 
              onClick={() => handleScrollToCatalog('Suits')}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#faf5f6] hover:bg-[#f3e5e8] border border-[#ebd9dc] hover:border-[#c89d46] transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3d0a14] text-[#c89d46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#3d0a14] block truncate">100% Silk Mark</span>
                <span className="text-[10px] sm:text-xs text-[#785f63] block truncate font-medium">Govt. Verified Purity</span>
              </div>
            </div>

            <div 
              onClick={() => setIsTrackOrderModalOpen(true)}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#faf5f6] hover:bg-[#f3e5e8] border border-[#ebd9dc] hover:border-[#c89d46] transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3d0a14] text-[#c89d46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#3d0a14] block truncate">Insured Air Express</span>
                <span className="text-[10px] sm:text-xs text-[#785f63] block truncate font-medium">Free Pan-India Delivery</span>
              </div>
            </div>

            <div 
              onClick={() => handleScrollToCatalog('all')}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#faf5f6] hover:bg-[#f3e5e8] border border-[#ebd9dc] hover:border-[#c89d46] transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3d0a14] text-[#c89d46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#3d0a14] block truncate">Cash on Delivery</span>
                <span className="text-[10px] sm:text-xs text-[#785f63] block truncate font-medium">Pay at Doorstep</span>
              </div>
            </div>

            <div 
              onClick={() => setIsSizeGuideOpen(true)}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#faf5f6] hover:bg-[#f3e5e8] border border-[#ebd9dc] hover:border-[#c89d46] transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3d0a14] text-[#c89d46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#3d0a14] block truncate">7-Day Exchange</span>
                <span className="text-[10px] sm:text-xs text-[#785f63] block truncate font-medium">Free Size Alterations</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FESTIVE PRIVILEGE VOUCHERS BANNER (Rounded-xl 1-Click Apply Buttons) */}
      <section className="bg-gradient-to-r from-[#3d0a14] via-[#521320] to-[#3d0a14] text-[#fffdfa] py-3.5 border-b border-[#c89d46]/40 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#fcedc7] text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-[#c89d46]" />
              <span>Click to Copy & Apply Royal Vouchers:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                id="copy-voucher-aura20-btn"
                onClick={() => handleCopyCoupon('AURA20')}
                className="px-3.5 py-1.5 bg-[#fcedc7] hover:bg-white text-[#3d0a14] rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                <span>AURA20 (20% OFF)</span>
                {copiedCoupon === 'AURA20' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-[#3d0a14]" />}
              </button>

              <button
                id="copy-voucher-royal1000-btn"
                onClick={() => handleCopyCoupon('ROYAL1000')}
                className="px-3.5 py-1.5 bg-[#fcedc7] hover:bg-white text-[#3d0a14] rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                <span>ROYAL1000 (₹1,000 OFF)</span>
                {copiedCoupon === 'ROYAL1000' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-[#3d0a14]" />}
              </button>

              <button
                id="copy-voucher-silkmark-btn"
                onClick={() => handleCopyCoupon('SILKMARK')}
                className="px-3.5 py-1.5 bg-[#fcedc7] hover:bg-white text-[#3d0a14] rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                <span>SILKMARK (₹500 OFF)</span>
                {copiedCoupon === 'SILKMARK' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-[#3d0a14]" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED SILHOUETTES LOOKBOOK (Spacious, Rounded-2xl Modular Blocks) */}
      <section className="py-12 sm:py-16 bg-[#f7f1ea] border-b border-[#ebd9dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#c89d46] block">
                CURATED ETHNIC SILHOUETTES
              </span>
              <h2 className="font-royal text-2xl sm:text-3xl font-bold text-[#3d0a14] mt-1">
                Explore by Craft & Heritage
              </h2>
            </div>
            <button
              onClick={() => handleScrollToCatalog('all')}
              className="px-5 py-2.5 bg-[#3d0a14] hover:bg-[#521320] text-[#fffdfa] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <span>View All Outfits</span>
              <ArrowRight className="w-4 h-4 text-[#c89d46]" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
            {INITIAL_CATEGORIES.filter(c => c.slug !== 'all').map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  id={`lookbook-card-${cat.id}`}
                  onClick={() => handleScrollToCatalog(cat.slug)}
                  className={`flex flex-col p-3 rounded-2xl bg-white border transition-all duration-300 group cursor-pointer text-center ${
                    isSelected 
                      ? 'border-[#3d0a14] ring-2 ring-[#c89d46] shadow-lg -translate-y-1' 
                      : 'border-[#ebd9dc] hover:border-[#c89d46] hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-[#faf5f6]">
                    <SafeImage
                      src={categoryImages[cat.slug] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80'}
                      alt={cat.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {cat.count} Sets
                      </span>
                    </div>
                  </div>
                  
                  <span className="text-xs sm:text-sm font-bold text-[#3d0a14] group-hover:text-[#c89d46] transition-colors leading-tight truncate">
                    {cat.label}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#785f63] truncate mt-1 font-normal">
                    {cat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MASTER CATALOG SECTION (Clean Spacing, Rounded-2xl Modular Product Cards) */}
      <section id="curated-catalog-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faedf0] border border-[#ebd9dc] text-[#3d0a14] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#c89d46]" />
            <span>100% Certified Single-Shade Couture</span>
          </div>
          <h2 className="font-royal text-2xl sm:text-3xl md:text-4xl font-bold text-[#3d0a14]">
            {selectedCategory === 'all' ? 'All Handcrafted Collections' : `${selectedCategory} Ensembles`}
          </h2>
          <p className="text-xs sm:text-sm text-[#785f63]">
            Showing {filteredProducts.length} certified single-shade garments with instant Razorpay checkout & free pan-India express shipping.
          </p>
        </div>

        {/* Clean, Refined Toolbar with Category Switcher, Price & Sort */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-[#ebd9dc] shadow-2xs mb-8">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar">
            {INITIAL_CATEGORIES.map((cat) => {
              const isActive = (cat.slug === 'all' && selectedCategory === 'all') || selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  id={`cat-chip-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-[#3d0a14] text-white shadow-sm'
                      : 'bg-[#faf5f6] text-[#6b5558] hover:text-[#3d0a14] hover:bg-[#faedf0] border border-[#ebd9dc]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Price Range & Sort */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto text-xs shrink-0">
            
            <div className="flex items-center gap-2">
              <span className="text-[#785f63] font-bold text-xs">Price:</span>
              <select
                id="catalog-price-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-2 bg-white border border-[#ebd9dc] rounded-xl text-xs text-[#3d0a14] font-semibold focus:outline-hidden focus:border-[#c89d46] cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-6000">Under ₹6,000</option>
                <option value="6000-9000">₹6,000 - ₹9,000</option>
                <option value="above-9000">Above ₹9,000</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#785f63] font-bold text-xs">Sort By:</span>
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-white border border-[#ebd9dc] rounded-xl text-xs text-[#3d0a14] font-semibold focus:outline-hidden focus:border-[#c89d46] cursor-pointer"
              >
                <option value="trending">Featured & Trending</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Patron Rating</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>

          </div>
        </div>

        {/* 6. PRODUCT CARDS GRID (Structurally sound, Rounded-2xl Modular Blocks) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#ebd9dc] space-y-4 shadow-2xs">
            <p className="text-sm sm:text-base font-semibold text-[#3d0a14]">No garments match the selected filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="px-6 py-2.5 bg-[#3d0a14] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#521320] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              const discountPercent = product.original_price > product.price 
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="bg-white rounded-2xl border border-[#ebd9dc] shadow-sm hover:shadow-2xl hover:border-[#c89d46]/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image Container with Consistent 3:4 Aspect Ratio & SafeImage */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#faf5f6]">
                    <div 
                      onClick={() => setQuickViewProduct(product)}
                      className="w-full h-full cursor-pointer"
                    >
                      <SafeImage
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Top Badges (No overlap with Wishlist button) */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none max-w-[65%]">
                      {product.badge && (
                        <span className="px-2.5 py-1 bg-[#3d0a14] text-[#c89d46] text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-xs truncate">
                          {product.badge}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2 py-0.5 bg-emerald-800 text-white text-[9px] sm:text-[10px] font-bold uppercase rounded-lg shadow-xs w-fit">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button (Comfortable 36px Hit Area) */}
                    <button
                      id={`wishlist-card-btn-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs shadow-md flex items-center justify-center text-[#3d0a14] hover:bg-white transition-all active:scale-90 z-10 cursor-pointer"
                      title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-red-600 text-red-600' : 'text-[#3d0a14]'}`} />
                    </button>

                    {/* Quick View Floating Action */}
                    <button
                      id={`quickview-hover-btn-${product.id}`}
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute inset-x-3 bottom-3 py-2 bg-white/95 text-[#3d0a14] text-xs font-bold rounded-xl shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5 hover:bg-[#3d0a14] hover:text-white cursor-pointer active:scale-95"
                    >
                      <Eye className="w-4 h-4 text-[#c89d46]" />
                      <span>Quick Inspect</span>
                    </button>
                  </div>

                  {/* Card Body Details */}
                  <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      {/* Color Shade & Rating Display (Single Color Designation) */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#faedf0] text-[#3d0a14] text-[10px] sm:text-[11px] font-semibold min-w-0 border border-[#ebd9dc]">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                            style={{ backgroundColor: product.color }}
                          />
                          <span className="truncate max-w-[90px] sm:max-w-[130px]">{product.colorName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#c89d46] font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#c89d46]" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      {/* Product Title */}
                      <h4 
                        onClick={() => setQuickViewProduct(product)}
                        className="text-xs sm:text-sm font-bold text-[#3d0a14] line-clamp-2 leading-snug hover:text-[#c89d46] transition-colors cursor-pointer pt-0.5"
                      >
                        {product.title}
                      </h4>

                      {/* Fabric / Craft Tag */}
                      <p className="text-[10px] sm:text-xs text-[#785f63] truncate">
                        {product.fabric}
                      </p>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="space-y-2.5 pt-2.5 border-t border-[#faedf0]">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm sm:text-base font-bold text-[#3d0a14]">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.original_price > product.price && (
                            <span className="text-[10px] sm:text-xs text-[#806b6e] line-through">
                              ₹{product.original_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold hidden sm:inline">Free Air Express</span>
                      </div>

                      {/* Working Direct Buttons: Add to Bag + Buy Now */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id={`add-to-bag-${product.id}-btn`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 'M', 1);
                          }}
                          className="py-2 px-2 bg-white border-2 border-[#3d0a14] text-[#3d0a14] rounded-xl text-xs font-bold hover:bg-[#faedf0] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#c89d46]" />
                          <span>Add</span>
                        </button>

                        <button
                          id={`buy-now-${product.id}-btn`}
                          onClick={(e) => {
                            e.stopPropagation();
                            buyNow(product, 'M');
                          }}
                          className="py-2 px-2 bg-[#3d0a14] text-[#fffdfa] rounded-xl text-xs font-bold hover:bg-[#521320] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#c89d46]" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. ATELIER CRAFT & HERITAGE SHOWCASE (Interactive Tabs) */}
      <section className="bg-[#1f060b] text-[#fffdfa] py-12 sm:py-16 border-y-2 border-[#c89d46]/40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-8">
            <span className="text-[10px] font-bold tracking-widest text-[#c89d46] uppercase">
              THE ATELIER HERITAGE
            </span>
            <h2 className="font-royal text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Centuries of Varanasi & Kanchipuram Weaving
            </h2>
            <p className="text-xs text-[#d4bfc3]">
              Every garment is created with unhurried devotion to authentic handloom techniques and pure silk yarns.
            </p>
          </div>

          {/* Interactive Craft Tabs */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setCraftTab('kadwa')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                craftTab === 'kadwa' ? 'bg-[#c89d46] text-[#24060c] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              The Kadwa Technique
            </button>
            <button
              onClick={() => setCraftTab('silkmark')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                craftTab === 'silkmark' ? 'bg-[#c89d46] text-[#24060c] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Govt. Silk Mark Purity
            </button>
            <button
              onClick={() => setCraftTab('tailoring')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                craftTab === 'tailoring' ? 'bg-[#c89d46] text-[#24060c] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Bespoke Couturier Tailoring
            </button>
            <button
              onClick={() => setCraftTab('dispatch')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                craftTab === 'dispatch' ? 'bg-[#c89d46] text-[#24060c] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Insured Express Dispatch
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white/5 rounded-2xl p-4 sm:p-8 border border-white/10">
            
            <div className="lg:col-span-7 space-y-3 text-left">
              {craftTab === 'kadwa' && (
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#c89d46]/20 text-[#fcedc7] text-[11px] font-bold">
                    <Crown className="w-3.5 h-3.5 text-[#c89d46]" />
                    <span>Pure Varanasi Handloom Weave</span>
                  </div>
                  <h3 className="font-royal text-xl sm:text-2xl font-bold text-white">
                    Zero Floating Threads on Reverse (Authentic Kadwa)
                  </h3>
                  <p className="text-xs text-[#e0cfd2] leading-relaxed">
                    Unlike modern powerlooms that leave messy loose threads on the inner side, authentic Varanasi Kadwa weaving requires master weavers to individually lock each gold-silver zari motif with individual shuttle movements. Each suit takes up to 24 days to weave.
                  </p>
                  <button
                    onClick={() => handleScrollToCatalog('Suits')}
                    className="px-4 py-2 bg-[#c89d46] text-[#24060c] font-bold text-xs rounded-xl hover:bg-[#d9ae57] transition-colors cursor-pointer"
                  >
                    Explore Kadwa Suits
                  </button>
                </div>
              )}

              {craftTab === 'silkmark' && (
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#c89d46]/20 text-[#fcedc7] text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c89d46]" />
                    <span>Government Certified Authenticity</span>
                  </div>
                  <h3 className="font-royal text-xl sm:text-2xl font-bold text-white">
                    100% Pure Mulberry & Tussar Silk Yarn
                  </h3>
                  <p className="text-xs text-[#e0cfd2] leading-relaxed">
                    Every silk suit and saree from Suit Bliss Aura comes attached with an official Silk Mark Organization of India tag and security hologram verifying 100% natural silk purity with zero synthetic blending.
                  </p>
                  <button
                    onClick={() => handleScrollToCatalog('Suits')}
                    className="px-4 py-2 bg-[#c89d46] text-[#24060c] font-bold text-xs rounded-xl hover:bg-[#d9ae57] transition-colors cursor-pointer"
                  >
                    Explore Certified Silk Suits
                  </button>
                </div>
              )}

              {craftTab === 'tailoring' && (
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#c89d46]/20 text-[#fcedc7] text-[11px] font-bold">
                    <Scissors className="w-3.5 h-3.5 text-[#c89d46]" />
                    <span>Bespoke Couturier Service</span>
                  </div>
                  <h3 className="font-royal text-xl sm:text-2xl font-bold text-white">
                    Custom Tailored to Your Exact Body Measurements
                  </h3>
                  <p className="text-xs text-[#e0cfd2] leading-relaxed">
                    Select &ldquo;Custom Fit&rdquo; during size selection or leave your measurements in the order notes. Our master tailors personally verify your bust, waist, hip, and length measurements via WhatsApp before cutting the fabric.
                  </p>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="px-4 py-2 bg-[#c89d46] text-[#24060c] font-bold text-xs rounded-xl hover:bg-[#d9ae57] transition-colors cursor-pointer"
                  >
                    Open Royal Size Guide
                  </button>
                </div>
              )}

              {craftTab === 'dispatch' && (
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#c89d46]/20 text-[#fcedc7] text-[11px] font-bold">
                    <Truck className="w-3.5 h-3.5 text-[#c89d46]" />
                    <span>Express Air Couriers</span>
                  </div>
                  <h3 className="font-royal text-xl sm:text-2xl font-bold text-white">
                    48-Hour Pan-India Air Dispatch in Keepsake Boxes
                  </h3>
                  <p className="text-xs text-[#e0cfd2] leading-relaxed">
                    Shipped in gold-embossed magnetic keepsake boxes with acid-free tissue wrapping, scented cedar sachets, and certificate cards. Fully insured against loss or transit damage.
                  </p>
                  <button
                    onClick={() => setIsTrackOrderModalOpen(true)}
                    className="px-4 py-2 bg-[#c89d46] text-[#24060c] font-bold text-xs rounded-xl hover:bg-[#d9ae57] transition-colors cursor-pointer"
                  >
                    Track an Existing Order
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#c89d46]/50 aspect-[4/3]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
                  alt="Varanasi Master Handloom Weaving"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5">
                  <span className="text-[11px] font-semibold text-[#fcedc7] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#c89d46]" />
                    Varanasi Master Handloom Guild Authenticated
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. PATRON REVIEWS & TESTIMONIALS */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[10px] tracking-widest font-bold uppercase text-[#c89d46]">
              AUTHENTIC PATRON TESTIMONIALS
            </span>
            <h2 className="font-royal text-xl sm:text-3xl font-bold text-[#3d0a14] mt-0.5">
              Loved by 1,400+ Connoisseurs
            </h2>
          </div>

          <button
            id="open-write-review-btn"
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2 bg-[#3d0a14] text-[#fffdfa] rounded-xl text-xs font-bold hover:bg-[#521320] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#c89d46]" />
            <span>Write a Patron Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {reviews.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-white rounded-2xl border border-[#ebd9dc] shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-[#c89d46] transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#c89d46] text-[#c89d46]" />
                    ))}
                  </div>
                  <span className="text-[9px] text-emerald-700 font-bold">Verified Buyer</span>
                </div>
                <h4 className="text-xs font-bold text-[#3d0a14]">{rev.title}</h4>
                <p className="text-[11px] text-[#6b5558] leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-[#faedf0] text-[10px]">
                <span className="font-bold text-[#3d0a14] block">{rev.author}</span>
                <span className="text-[#806b6e]">{rev.city} · {rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="bg-[#faf5f6] py-10 sm:py-14 border-t border-[#ebd9dc]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[10px] tracking-widest font-bold uppercase text-[#c89d46]">
              CONCIERGE ASSISTANCE
            </span>
            <h2 className="font-royal text-xl sm:text-3xl font-bold text-[#3d0a14]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#ebd9dc] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    id={`faq-toggle-btn-${index}`}
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#3d0a14] hover:bg-[#faedf0]/60 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#c89d46] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-3.5 sm:p-4 pt-0 text-xs text-[#6b5558] leading-relaxed border-t border-[#faedf0] bg-[#fffdfa]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER VIP CLUB */}
      <section className="bg-[#24060c] text-[#fffdfa] py-10 sm:py-14 px-4 sm:px-6 text-center space-y-3.5 border-t-2 border-[#c89d46]/40">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-[#c89d46]">
            ROYAL PRIVILEGE CLUB
          </span>
          <h3 className="font-royal text-xl sm:text-3xl font-bold text-white">
            Private Invitations for Handloom Drops
          </h3>
          <p className="text-xs text-[#d4bfc3]">
            Subscribe to receive private preview invitations for limited single-shade Varanasi silk releases and exclusive festive discount privileges.
          </p>

          {newsletterSubscribed ? (
            <div className="p-3.5 bg-white/10 rounded-xl text-emerald-300 text-xs font-bold">
              ✓ Welcome to the Royal Privilege Club! Your voucher code: <strong>AURA20</strong> is active.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto pt-2">
              <input
                id="newsletter-email-input"
                required
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-3.5 py-2.5 bg-white/10 border border-[#c89d46]/50 rounded-xl text-xs text-white placeholder-white/60 focus:outline-hidden focus:border-[#c89d46]"
              />
              <button
                id="newsletter-subscribe-btn"
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-[#c89d46] to-[#dfb76c] text-[#24060c] rounded-xl text-xs font-bold hover:brightness-110 transition-all cursor-pointer active:scale-95 shadow-lg"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 11. LIVE RECENT PURCHASE POPUP TICKER */}
      {showLiveTicker && (
        <div className="fixed bottom-20 left-4 z-40 bg-[#3d0a14]/95 text-white border border-[#c89d46]/60 rounded-xl shadow-2xl p-3 max-w-xs sm:max-w-sm hidden sm:flex items-center gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-[#c89d46] text-[#3d0a14] flex items-center justify-center shrink-0 font-bold text-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-[10px] leading-tight flex-1">
            <p className="font-semibold text-[#fcedc7]">
              {recentPurchases[liveBuyerIndex].name} ({recentPurchases[liveBuyerIndex].city})
            </p>
            <p className="text-white/80 line-clamp-1">
              ordered <span className="text-[#c89d46]">{recentPurchases[liveBuyerIndex].item}</span>
            </p>
            <span className="text-[9px] text-white/50">{recentPurchases[liveBuyerIndex].time}</span>
          </div>
          <button
            onClick={() => setShowLiveTicker(false)}
            className="text-white/60 hover:text-white text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
