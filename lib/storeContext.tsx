'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Product, 
  Order, 
  Coupon, 
  INITIAL_PRODUCTS, 
  INITIAL_COUPONS,
  INITIAL_REVIEWS
} from './catalogData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  original_price?: number;
  quantity: number;
  size: string;
  colorName: string;
  colorHex: string;
  image_url: string;
  customNotes?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  productTitle: string;
  verified: boolean;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  cart: CartItem[];
  wishlist: string[];
  reviews: ReviewItem[];
  appliedCoupon: Coupon | null;
  discountAmount: number;
  cartSubtotal: number;
  cartTotal: number;
  cartCount: number;
  freeShippingThreshold: number;
  progressToFreeShipping: number;

  // Selected filters across views
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  
  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCategoryDrawerOpen: boolean;
  setIsCategoryDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isTailoringModalOpen: boolean;
  setIsTailoringModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  isTrackOrderModalOpen: boolean;
  setIsTrackOrderModalOpen: (open: boolean) => void;
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  checkoutDirectMode: boolean;
  setCheckoutDirectMode: (val: boolean) => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Actions
  addToCart: (product: Product, size?: string, quantity?: number, customNotes?: string) => void;
  buyNow: (product: Product, size?: string, customNotes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  trackOrderById: (orderId: string) => { found: boolean; order?: Order };
  addReview: (review: Omit<ReviewItem, 'id' | 'date' | 'verified'>) => void;

  // Admin and Cloud operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
  createOrder: (orderData: Omit<Order, 'id' | 'created_at'>) => Promise<Order>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('suitbliss_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Initial product load warning:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('suitbliss_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Initial order load warning:', e);
      }
    }
    return [
      {
        id: 'AURA-7821-DEL',
        customer_name: 'Aditi Rao Hydari',
        customer_email: 'aditi.rao@example.com',
        customer_phone: '+91 98765 12345',
        shipping_address: '14 Royal Bungalows, Golf Course Road, Gurgaon',
        city: 'Gurgaon',
        pincode: '122002',
        amount: 8999,
        discount_amount: 1000,
        coupon_applied: 'ROYAL1000',
        status: 'dispatched',
        items: [
          {
            id: 'suit-01-M',
            title: 'Royal Banarasi Katan Silk Suit with Kadwa Zari Dupatta',
            price: 8999,
            quantity: 1,
            size: 'M',
            colorName: 'Royal Heritage Maroon',
            image_url: 'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800&h=1000&fit=crop'
          }
        ],
        razorpay_order_id: 'order_live_99281',
        razorpay_payment_id: 'pay_live_883190',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ];
  });

  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('suitbliss_reviews');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Initial review load warning:', e);
      }
    }
    return INITIAL_REVIEWS;
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('suitbliss_cart');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Initial cart load warning:', e);
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('suitbliss_wishlist');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Initial wishlist load warning:', e);
      }
    }
    return ['suit-01', 'anar-01'];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isTailoringModalOpen, setIsTailoringModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [checkoutDirectMode, setCheckoutDirectMode] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const freeShippingThreshold = 2999;

  const refreshData = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodErr && dbProducts && dbProducts.length > 0) {
        const mappedProducts: Product[] = dbProducts.map((p) => ({
          id: String(p.id),
          title: p.title || 'Royal Handcrafted Garment',
          category: p.category || 'Suits',
          price: Number(p.price) || 4999,
          original_price: Number(p.compare_at_price || p.original_price) || Number(p.price) * 1.8,
          description: p.description || 'Pure silk royal ensemble with intricate hand embellishments.',
          fabric: p.fabric || 'Pure Mulberry Katan Silk',
          craft: p.craft || 'Handloom Kadwa Weave',
          color: p.color || '#3d0a14',
          colorName: p.colorName || 'Royal Heritage Maroon',
          image_url: p.image_url || 'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800&h=1000&fit=crop',
          gallery: p.gallery || [p.image_url],
          badge: p.badge || 'BEST SELLER',
          rating: Number(p.rating) || 4.9,
          reviews_count: Number(p.reviews_count) || 45,
          in_stock: p.in_stock !== false,
          sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
          delivery_days: p.delivery_days || 3,
          created_at: p.created_at || new Date().toISOString(),
        }));

        setProducts(mappedProducts);
        localStorage.setItem('suitbliss_products', JSON.stringify(mappedProducts));
      }

      const { data: dbOrders, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!orderErr && dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
        localStorage.setItem('suitbliss_orders', JSON.stringify(dbOrders));
      }
    } catch (e) {
      console.warn('Supabase sync notice:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshData();
    }, 50);
    return () => clearTimeout(timer);
  }, [refreshData]);

  // Cart helper functions
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('suitbliss_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (product: Product, size: string = 'M', quantity: number = 1, customNotes?: string) => {
    const itemKey = `${product.id}-${size}`;
    const existingIndex = cart.findIndex((i) => i.id === itemKey);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      if (customNotes) updatedCart[existingIndex].customNotes = customNotes;
    } else {
      const newItem: CartItem = {
        id: itemKey,
        productId: product.id,
        title: product.title,
        price: product.price,
        original_price: product.original_price,
        quantity,
        size,
        colorName: product.colorName,
        colorHex: product.color,
        image_url: product.image_url,
        customNotes,
      };
      updatedCart = [newItem, ...cart];
    }

    saveCart(updatedCart);
    setCheckoutDirectMode(false);
    setIsCartOpen(true);
    showToast(`✨ Added "${product.title.slice(0, 24)}..." to Royal Bag`);
  };

  const buyNow = (product: Product, size: string = 'M', customNotes?: string) => {
    const itemKey = `${product.id}-${size}`;
    const existingIndex = cart.findIndex((i) => i.id === itemKey);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity = 1;
      if (customNotes) updatedCart[existingIndex].customNotes = customNotes;
    } else {
      const newItem: CartItem = {
        id: itemKey,
        productId: product.id,
        title: product.title,
        price: product.price,
        original_price: product.original_price,
        quantity: 1,
        size,
        colorName: product.colorName,
        colorHex: product.color,
        image_url: product.image_url,
        customNotes,
      };
      updatedCart = [newItem, ...cart];
    }

    saveCart(updatedCart);
    setCheckoutDirectMode(true);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const updated = cart.filter((i) => i.id !== cartItemId);
    saveCart(updated);
    showToast('Garment removed from bag');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      const updated = cart.map((i) =>
        i.id === cartItemId ? { ...i, quantity } : i
      );
      saveCart(updated);
    }
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist helpers
  const toggleWishlist = (productId: string) => {
    let updated: string[];
    const product = products.find((p) => p.id === productId);
    const title = product ? product.title.slice(0, 22) : 'Garment';

    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      showToast(`Removed "${title}" from Wishlist`);
    } else {
      updated = [productId, ...wishlist];
      showToast(`❤️ Saved "${title}" to Royal Wishlist`);
    }
    setWishlist(updated);
    try {
      localStorage.setItem('suitbliss_wishlist', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed);
    if (!found) {
      return { success: false, message: 'Invalid voucher code.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Voucher applies on minimum order value of ₹${found.minOrder.toLocaleString()}.`,
      };
    }
    setAppliedCoupon(found);
    const saved = found.discountType === 'percentage'
      ? Math.round((cartSubtotal * found.discountValue) / 100)
      : found.discountValue;
    showToast(`✨ Privilege Voucher "${found.code}" applied! Saved ₹${saved.toLocaleString()}`);
    return {
      success: true,
      message: `✨ Voucher ${found.code} applied! Saved ₹${saved.toLocaleString()}`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const trackOrderById = (orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === cleanId || o.id.toUpperCase().includes(cleanId));
    if (found) {
      setTrackingOrder(found);
      setIsTrackOrderModalOpen(true);
      return { found: true, order: found };
    }
    return { found: false };
  };

  const addReview = (reviewData: Omit<ReviewItem, 'id' | 'date' | 'verified'>) => {
    const newRev: ReviewItem = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      verified: true,
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('suitbliss_reviews', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    showToast('✨ Thank you! Your verified patron review has been published.');
  };

  // CRUD actions for Admin & Cloud
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<boolean> => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      created_at: new Date().toISOString(),
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('suitbliss_products', JSON.stringify(updated));

    if (supabase) {
      try {
        await supabase.from('products').insert([
          {
            title: newProduct.title,
            category: newProduct.category,
            price: newProduct.price,
            compare_at_price: newProduct.original_price,
            description: newProduct.description,
            fabric: newProduct.fabric,
            craft: newProduct.craft,
            color: newProduct.color,
            colorName: newProduct.colorName,
            image_url: newProduct.image_url,
            badge: newProduct.badge,
            rating: newProduct.rating,
            reviews_count: newProduct.reviews_count,
            in_stock: newProduct.in_stock,
            sizes: newProduct.sizes,
          },
        ]);
      } catch (e) {
        console.warn('Supabase product insert notice:', e);
      }
    }
    showToast('Garment added to catalog');
    return true;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(updated);
    localStorage.setItem('suitbliss_products', JSON.stringify(updated));

    if (supabase) {
      try {
        await supabase.from('products').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase product update notice:', e);
      }
    }
    showToast('Garment updated');
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('suitbliss_products', JSON.stringify(updated));

    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase product delete notice:', e);
      }
    }
    showToast('Garment deleted');
    return true;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem('suitbliss_orders', JSON.stringify(updated));

    if (supabase) {
      try {
        await supabase.from('orders').update({ status }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase order update notice:', e);
      }
    }
    showToast(`Order status updated to "${status}"`);
    return true;
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> => {
    const orderId = `AURA-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      created_at: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('suitbliss_orders', JSON.stringify(updated));

    if (supabase) {
      try {
        await supabase.from('orders').insert([
          {
            id: newOrder.id,
            customer_name: newOrder.customer_name,
            customer_email: newOrder.customer_email,
            amount: newOrder.amount,
            status: newOrder.status,
            razorpay_order_id: newOrder.razorpay_order_id,
            razorpay_payment_id: newOrder.razorpay_payment_id,
          },
        ]);
      } catch (e) {
        console.warn('Supabase order insert notice:', e);
      }
    }

    setLastOrder(newOrder);
    setIsOrderSuccessOpen(true);
    clearCart();
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        coupons,
        cart,
        wishlist,
        reviews,
        appliedCoupon,
        discountAmount,
        cartSubtotal,
        cartTotal,
        cartCount,
        freeShippingThreshold,
        progressToFreeShipping,
        selectedCategory,
        setSelectedCategory,
        selectedColor,
        setSelectedColor,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCategoryDrawerOpen,
        setIsCategoryDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isTailoringModalOpen,
        setIsTailoringModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        lastOrder,
        setLastOrder,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        isTrackOrderModalOpen,
        setIsTrackOrderModalOpen,
        trackingOrder,
        setTrackingOrder,
        isReviewModalOpen,
        setIsReviewModalOpen,
        checkoutDirectMode,
        setCheckoutDirectMode,
        toastMessage,
        showToast,
        addToCart,
        buyNow,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        trackOrderById,
        addReview,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        createOrder,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
