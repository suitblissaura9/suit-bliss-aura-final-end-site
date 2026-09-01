'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard,
  Shirt,
  PlusCircle,
  ShoppingBag,
  Tag,
  Trash2,
  Edit,
  Search,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Crown,
  ChevronRight,
  X,
  TrendingUp
} from 'lucide-react';
import { useStore } from '@/lib/storeContext';
import { Product, Order, INITIAL_PRODUCTS } from '@/lib/catalogData';
import { SafeImage } from '@/components/SafeImage';

export default function AdminDashboard() {
  const {
    products,
    orders,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    refreshData,
    isLoading
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product' | 'orders' | 'coupons'>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State (Single Color Focus)
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: '',
    category: 'Suits',
    price: 4999,
    original_price: 9999,
    description: '',
    fabric: 'Pure Mulberry Katan Silk',
    craft: 'Varanasi Kadwa Zari Weave',
    color: '#3d0a14',
    colorName: 'Royal Heritage Maroon',
    image_url: 'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800&h=1000&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800&h=1000&fit=crop'],
    badge: 'BEST SELLER',
    rating: 4.9,
    reviews_count: 32,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    delivery_days: 3,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showToast('✨ Garment updated successfully in Supabase & Catalog!');
        setEditingProduct(null);
      } else {
        await addProduct(formData);
        showToast('👑 New Royal Garment published to Atelier Catalog!');
      }
      // Reset form
      setFormData({
        title: '',
        category: 'Suits',
        price: 4999,
        original_price: 9999,
        description: '',
        fabric: 'Pure Mulberry Katan Silk',
        craft: 'Varanasi Kadwa Zari Weave',
        color: '#3d0a14',
        colorName: 'Royal Heritage Maroon',
        image_url: 'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800&h=1000&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800&h=1000&fit=crop'],
        badge: 'NEW ARRIVAL',
        rating: 5.0,
        reviews_count: 12,
        in_stock: true,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
        delivery_days: 3,
      });
      setActiveTab('products');
    } catch (err) {
      console.error(err);
      showToast('Error saving product. Please check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title,
      category: prod.category,
      price: prod.price,
      original_price: prod.original_price,
      description: prod.description,
      fabric: prod.fabric,
      craft: prod.craft,
      color: prod.color,
      colorName: prod.colorName,
      image_url: prod.image_url,
      gallery: prod.gallery || [prod.image_url],
      badge: prod.badge,
      rating: prod.rating || 4.9,
      reviews_count: prod.reviews_count || 24,
      in_stock: prod.in_stock !== false,
      sizes: prod.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
      delivery_days: prod.delivery_days || 3,
    });
    setActiveTab('add-product');
  };

  const handleSeedCatalog = async () => {
    if (confirm('Restore / Seed full 50+ master handcrafted garments catalog into your store & Supabase?')) {
      try {
        localStorage.setItem('suitbliss_products', JSON.stringify(INITIAL_PRODUCTS));
        await refreshData();
        showToast('✨ Royal 50+ Garment Catalog Seeded Successfully!');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalGarments = products.length;
  const inStockCount = products.filter((p) => p.in_stock).length;
  const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'dispatched' || o.status === 'delivered').length;

  const filteredAdminProducts = products.filter((p) => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch = productSearch === '' || 
      p.title.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.colorName.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#fcf9f5] text-[#3d0a14] flex flex-col">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl bg-[#1a0f12] text-[#e5c07b] border border-[#c89d46] shadow-2xl text-xs font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#c89d46]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Navigation Header */}
      <header className="bg-[#1a0f12] text-[#fffdfa] border-b border-[#c89d46]/30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-[#c89d46]" />
          <div>
            <h1 className="font-royal text-base sm:text-lg font-bold tracking-widest text-[#e5c07b]">
              SUIT BLISS ATELIER CONSOLE
            </h1>
            <p className="text-[10px] text-[#fffdfa]/60 tracking-wider uppercase">
              Master Catalog, Orders & Inventory Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshData()}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#e5c07b] transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Sync with Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Cloud</span>
          </button>

          <Link
            href="/"
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <span>Live Store</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#faedf0]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-[#3d0a14] text-[#fffdfa] shadow'
                : 'bg-[#fffdfa] text-[#806b6e] hover:text-[#3d0a14] border border-[#faedf0]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#c89d46]" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-[#3d0a14] text-[#fffdfa] shadow'
                : 'bg-[#fffdfa] text-[#806b6e] hover:text-[#3d0a14] border border-[#faedf0]'
            }`}
          >
            <Shirt className="w-4 h-4 text-[#c89d46]" />
            <span>Master Garments ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setActiveTab('add-product');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'add-product'
                ? 'bg-[#3d0a14] text-[#fffdfa] shadow'
                : 'bg-[#fffdfa] text-[#806b6e] hover:text-[#3d0a14] border border-[#faedf0]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#c89d46]" />
            <span>{editingProduct ? 'Edit Garment' : 'Add New Garment'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#3d0a14] text-[#fffdfa] shadow'
                : 'bg-[#fffdfa] text-[#806b6e] hover:text-[#3d0a14] border border-[#faedf0]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#c89d46]" />
            <span>Patron Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'coupons'
                ? 'bg-[#3d0a14] text-[#fffdfa] shadow'
                : 'bg-[#fffdfa] text-[#806b6e] hover:text-[#3d0a14] border border-[#faedf0]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#c89d46]" />
            <span>Vouchers & Promos</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-[#fffdfa] border border-[#faedf0] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#806b6e] text-xs font-bold uppercase tracking-wider">
                  <span>Gross Order Value</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-royal text-2xl font-bold text-[#3d0a14]">
                  ₹{totalRevenue.toLocaleString()}
                </h3>
                <p className="text-[11px] text-emerald-800 font-semibold">
                  Processed via 256-Bit Razorpay Vault
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#fffdfa] border border-[#faedf0] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#806b6e] text-xs font-bold uppercase tracking-wider">
                  <span>Total Garments</span>
                  <div className="p-2 rounded-xl bg-[#faedf0] text-[#3d0a14]">
                    <Shirt className="w-4 h-4 text-[#c89d46]" />
                  </div>
                </div>
                <h3 className="font-royal text-2xl font-bold text-[#3d0a14]">
                  {totalGarments} Pieces
                </h3>
                <p className="text-[11px] text-[#806b6e]">
                  {inStockCount} In Stock • Single-Hue Masterpieces
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#fffdfa] border border-[#faedf0] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#806b6e] text-xs font-bold uppercase tracking-wider">
                  <span>Total Patron Orders</span>
                  <div className="p-2 rounded-xl bg-[#faedf0] text-[#3d0a14]">
                    <ShoppingBag className="w-4 h-4 text-[#c89d46]" />
                  </div>
                </div>
                <h3 className="font-royal text-2xl font-bold text-[#3d0a14]">
                  {orders.length}
                </h3>
                <p className="text-[11px] text-emerald-800 font-semibold">
                  {completedOrders} Settled & Dispatched
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#fffdfa] border border-[#faedf0] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#806b6e] text-xs font-bold uppercase tracking-wider">
                  <span>Active Vouchers</span>
                  <div className="p-2 rounded-xl bg-[#faedf0] text-[#3d0a14]">
                    <Tag className="w-4 h-4 text-[#c89d46]" />
                  </div>
                </div>
                <h3 className="font-royal text-2xl font-bold text-[#3d0a14]">
                  {coupons.length} Vouchers
                </h3>
                <p className="text-[11px] text-[#806b6e]">
                  AURA20, ROYAL1000, SILKMARK
                </p>
              </div>

            </div>

            {/* Quick Actions Strip */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#3d0a14] to-[#5c1322] text-[#fffdfa] border border-[#c89d46]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-royal text-base font-bold text-white">
                  Need to Seed or Restore the 50+ Garment Catalog?
                </h4>
                <p className="text-xs text-[#faedf0]/80">
                  Instant 1-click restore to synchronize 50+ pure mulberry silk suits, kalidar anarkalis, and mirror shararas into your database.
                </p>
              </div>
              <button
                onClick={handleSeedCatalog}
                className="btn-gold px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Seed Full 50+ Garments</span>
              </button>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-[#fffdfa] p-6 rounded-3xl border border-[#faedf0] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-royal text-base font-bold text-[#3d0a14]">
                  Recent Patron Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#c89d46] hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-[#806b6e] py-6 text-center">
                  No orders placed yet. As soon as a patron checks out via Razorpay, it will appear here in real-time.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#faedf0] text-[#3d0a14] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Patron</th>
                        <th className="px-4 py-3">Investment</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#faedf0]">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#fcf9f5]">
                          <td className="px-4 py-3 font-mono font-bold text-[#3d0a14]">{ord.id}</td>
                          <td className="px-4 py-3 text-[#3d0a14] font-semibold">{ord.customer_name}</td>
                          <td className="px-4 py-3 font-royal font-bold text-[#c89d46]">₹{ord.amount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                              {ord.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#806b6e]">
                            {new Date(ord.created_at || '').toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MASTER GARMENTS LIST */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#fffdfa] p-4 rounded-2xl border border-[#faedf0]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#806b6e] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search garments by title or color..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#fcf9f5] border border-[#faedf0] pl-9 pr-3 py-2 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#fcf9f5] border border-[#faedf0] px-3 py-2 text-xs rounded-xl text-[#3d0a14] font-semibold focus:outline-none focus:border-[#c89d46]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="Suits">Suits</option>
                  <option value="Anarkali">Anarkali</option>
                  <option value="Shararas">Shararas</option>
                  <option value="Kurtas">Kurtas</option>
                  <option value="Co-ord Sets">Co-ord Sets</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Dupattas">Dupattas</option>
                </select>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setActiveTab('add-product');
                  }}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Garment</span>
                </button>
              </div>
            </div>

            {/* Products Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdminProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#fffdfa] rounded-3xl border border-[#faedf0] p-4 flex gap-4 shadow-sm hover:shadow-md transition-all justify-between"
                >
                  <div className="w-20 h-28 rounded-2xl overflow-hidden border border-[#faedf0] shrink-0 bg-[#faedf0]">
                    <SafeImage
                      src={prod.image_url}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-white shadow-sm"
                          style={{ backgroundColor: prod.color }}
                          title={prod.colorName}
                        />
                        <span className="text-[10px] font-bold text-[#806b6e] uppercase">
                          {prod.category} • {prod.colorName}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-[#3d0a14] line-clamp-2 leading-snug">
                        {prod.title}
                      </h4>
                      <p className="font-royal text-sm font-bold text-[#c89d46] mt-1">
                        ₹{prod.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#faedf0]">
                      <button
                        onClick={() => handleStartEdit(prod)}
                        className="flex-1 py-1.5 rounded-lg bg-[#faedf0] hover:bg-[#c89d46]/20 text-[#3d0a14] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit className="w-3 h-3 text-[#c89d46]" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${prod.title}" from catalog?`)) {
                            deleteProduct(prod.id);
                            showToast('Garment deleted from catalog.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#806b6e] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: ADD / EDIT PRODUCT FORM */}
        {activeTab === 'add-product' && (
          <div className="max-w-3xl mx-auto bg-[#fffdfa] rounded-3xl border border-[#faedf0] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-[#faedf0] pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-royal text-lg font-bold text-[#3d0a14]">
                  {editingProduct ? 'Edit Royal Garment' : 'Add New Handcrafted Garment'}
                </h3>
                <p className="text-xs text-[#806b6e]">
                  Manage single-shade pure pigment, fabric, price, and artisan craft specifications.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="p-1.5 rounded-full hover:bg-[#faedf0] text-[#806b6e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                  Garment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Banarasi Katan Silk Suit with Zari Kadwa Dupatta"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#fcf9f5] border border-[#faedf0] px-4 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                    className="w-full bg-[#fcf9f5] border border-[#faedf0] px-3 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                  >
                    <option value="Suits">Suits</option>
                    <option value="Anarkali">Anarkali</option>
                    <option value="Shararas">Shararas</option>
                    <option value="Kurtas">Kurtas</option>
                    <option value="Co-ord Sets">Co-ord Sets</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Dupatta Sets">Dupatta Sets</option>
                    <option value="Lehengas">Lehengas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                    Badge Tag
                  </label>
                  <select
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: (e.target.value || undefined) as Product['badge'] })}
                    className="w-full bg-[#fcf9f5] border border-[#faedf0] px-3 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                  >
                    <option value="">None</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="LIMITED EDITION">LIMITED EDITION</option>
                    <option value="TRENDING NOW">TRENDING NOW</option>
                    <option value="HERITAGE ARCHIVE">HERITAGE ARCHIVE</option>
                    <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#fcf9f5] border border-[#faedf0] px-4 py-2.5 text-xs rounded-xl text-[#3d0a14] font-bold focus:outline-none focus:border-[#c89d46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                    Compare at Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    className="w-full bg-[#fcf9f5] border border-[#faedf0] px-4 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                  />
                </div>
              </div>

              {/* Single Color Controls */}
              <div className="p-4 bg-[#fcf9f5] rounded-2xl border border-[#faedf0] space-y-3">
                <h4 className="font-bold text-xs text-[#3d0a14]">
                  🎨 Single Signature Hue (No Multi-Color Swatches)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#806b6e] mb-1">
                      Color Name (e.g. Royal Heritage Maroon)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.colorName}
                      onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                      className="w-full bg-[#fffdfa] border border-[#faedf0] px-3.5 py-2 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#806b6e] mb-1">
                      Color Hex Code / Picker
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-[#faedf0] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex-1 bg-[#fffdfa] border border-[#faedf0] px-3 py-2 text-xs rounded-xl font-mono text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fabric & Craft */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                    Fabric Composition *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Mulberry Katan Silk"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-[#fcf9f5] border border-[#faedf0] px-4 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                    Artisan Craft Technique *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Varanasi Kadwa Weave"
                    value={formData.craft}
                    onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
                    className="w-full bg-[#fcf9f5] border border-[#faedf0] px-4 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                  High-Resolution Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value, gallery: [e.target.value] })}
                  className="w-full bg-[#fcf9f5] border border-[#faedf0] px-4 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#3d0a14] mb-1">
                  Garment Description & Atelier Story *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the silhouette, neckline, border work, and styling suggestions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#fcf9f5] border border-[#faedf0] px-4 py-2.5 text-xs rounded-xl text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#faedf0]">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-3 rounded-xl border border-[#faedf0] text-xs font-semibold text-[#806b6e] hover:bg-[#faedf0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-gold py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Crown className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Royal Garment' : 'Publish to Live Catalog'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-[#fffdfa] p-4 rounded-2xl border border-[#faedf0]">
              <div>
                <h3 className="font-royal text-sm sm:text-base font-bold text-[#3d0a14]">
                  Patron Orders & Razorpay Transactions
                </h3>
                <p className="text-xs text-[#806b6e]">
                  Manage statuses, customer delivery addresses, and courier dispatch.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#fffdfa] rounded-3xl border border-[#faedf0] space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#c89d46] mx-auto" />
                <h4 className="font-royal text-base font-bold text-[#3d0a14]">No Orders Recorded Yet</h4>
                <p className="text-xs text-[#806b6e]">
                  All test or live orders created via Razorpay on the store will display here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#fffdfa] p-6 rounded-3xl border border-[#faedf0] space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#faedf0] pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#806b6e]">Order ID</span>
                        <h4 className="font-mono text-sm font-bold text-[#3d0a14]">{ord.id}</h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-royal text-base font-bold text-[#c89d46]">
                          ₹{ord.amount.toLocaleString()}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            updateOrderStatus(ord.id, e.target.value as Order['status']);
                            showToast(`Order status updated to ${e.target.value}`);
                          }}
                          className="bg-[#fcf9f5] border border-[#faedf0] px-3 py-1.5 text-xs rounded-xl font-bold uppercase text-[#3d0a14] focus:outline-none focus:border-[#c89d46]"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed / Paid</option>
                          <option value="dispatched">Dispatched Air Express</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="font-bold text-[#3d0a14]">Patron Information</p>
                        <p className="text-[#806b6e] mt-0.5">{ord.customer_name}</p>
                        <p className="text-[#806b6e]">{ord.customer_email}</p>
                        {ord.customer_phone && <p className="text-[#806b6e]">{ord.customer_phone}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <p className="font-bold text-[#3d0a14]">Delivery Address</p>
                        <p className="text-[#806b6e] mt-0.5">
                          {ord.shipping_address || 'Standard Royal Courier Dispatch'}
                        </p>
                        {ord.razorpay_payment_id && (
                          <p className="text-[10px] text-emerald-800 font-mono mt-1">
                            Razorpay Ref: {ord.razorpay_payment_id}
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-[#fffdfa] p-6 rounded-3xl border border-[#faedf0] space-y-4">
              <h3 className="font-royal text-base font-bold text-[#3d0a14]">
                Active Atelier Privilege Vouchers
              </h3>
              <p className="text-xs text-[#806b6e]">
                These promo discount codes are active on the checkout drawer and flash banner.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl bg-[#fcf9f5] border border-[#faedf0] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#3d0a14] bg-[#faedf0] px-2.5 py-1 rounded-lg">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#3d0a14]">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                    </p>
                    <p className="text-[11px] text-[#806b6e]">
                      Applicable on min order of ₹{c.minOrder.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
