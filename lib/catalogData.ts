export interface Product {
  id: string;
  title: string;
  category: 'Suits' | 'Anarkali' | 'Shararas' | 'Kurtas' | 'Co-ord Sets' | 'Sarees' | 'Dupatta Sets' | 'Lehengas';
  price: number;
  original_price: number;
  description: string;
  fabric: string;
  craft: string;
  color: string; // Single distinct primary color hex
  colorName: string; // Single distinct color name
  image_url: string;
  gallery?: string[];
  badge?: 'BEST SELLER' | 'LIMITED EDITION' | 'TRENDING NOW' | 'HERITAGE ARCHIVE' | 'NEW ARRIVAL';
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom Fit')[];
  delivery_days: number;
  created_at?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  description: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
  image_url: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: string;
  city?: string;
  pincode?: string;
  amount: number;
  discount_amount?: number;
  coupon_applied?: string;
  status: 'pending' | 'tailoring' | 'dispatched' | 'delivered' | 'completed' | 'cancelled';
  items?: OrderItem[];
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
}

export const INITIAL_CATEGORIES = [
  { id: 'all', label: 'All Collections', slug: 'all', count: 48, icon: 'Sparkles', desc: 'Curated royal festive couture' },
  { id: 'suits', label: 'Royal Suits', slug: 'Suits', count: 12, icon: 'Crown', desc: 'Pure Mulberry Katan & Organza Silk suits' },
  { id: 'anarkali', label: 'Kalidar Anarkalis', slug: 'Anarkali', count: 8, icon: 'Sparkle', desc: 'Flared floor-length royal gowns' },
  { id: 'shararas', label: 'Mirror Shararas', slug: 'Shararas', count: 7, icon: 'Gem', desc: 'Heavily flared Gota & mirrorwork sets' },
  { id: 'kurtas', label: 'Artisan Kurtas', slug: 'Kurtas', count: 8, icon: 'Feather', desc: 'Chanderi & mulmul festive sets' },
  { id: 'coords', label: 'Cape Co-ord Sets', slug: 'Co-ord Sets', count: 5, icon: 'Flame', desc: 'Contemporary runway silhouettes' },
  { id: 'sarees', label: 'Heritage Sarees', slug: 'Sarees', count: 4, icon: 'Layers', desc: 'Banarasi Kadwa & Kanjivaram drapes' },
  { id: 'dupatta', label: 'Dupatta Ensembles', slug: 'Dupatta Sets', count: 4, icon: 'Wind', desc: 'Handwoven Rangkat & Mukaish organza' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // ================= 1. ROYAL SUITS & SALWAR ENSEMBLES =================
  {
    id: 'suit-01',
    title: 'Royal Banarasi Katan Silk Suit with Kadwa Zari Dupatta',
    category: 'Suits',
    price: 8999,
    original_price: 18999,
    description: 'Handcrafted in Varanasi using 100% pure Mulberry Katan silk, embellished with real silver-gold electroplated Kadwa zari motifs. Paired with pure silk trousers and an opulent scalloped organza dupatta.',
    fabric: 'Pure Mulberry Katan Silk',
    craft: 'Varanasi Kadwa Handloom Weave',
    color: '#3d0a14',
    colorName: 'Royal Heritage Maroon',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'BEST SELLER',
    rating: 4.95,
    reviews_count: 84,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'suit-02',
    title: 'Jaipur Gota Patti Scalloped Silk Suit in Antique Gold',
    category: 'Suits',
    price: 7499,
    original_price: 14999,
    description: 'Regal silhouette adorned with hand-stitched Jaipur Gota Patti foil work on pure Chanderi silk. Features handcrafted potli button plackets and matching heavy silk cigarette pants.',
    fabric: 'Pure Handwoven Chanderi Silk',
    craft: 'Jaipuri Hand Gota Patti Embellishment',
    color: '#c89d46',
    colorName: 'Antique Royal Gold',
    image_url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'TRENDING NOW',
    rating: 4.88,
    reviews_count: 52,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'suit-03',
    title: 'Emerald Jewel Tussar Silk Straight Suit with Zari Borders',
    category: 'Suits',
    price: 6999,
    original_price: 12999,
    description: 'Deep forest emerald raw tussar silk kurti styled with hand-twisted marodi resham embroidery, accented with gold tissue trims and a matching dual-tone chanderi dupatta.',
    fabric: 'Raw Tussar Silk with Gold Tissue',
    craft: 'Marodi Resham Threadwork',
    color: '#064e3b',
    colorName: 'Deep Emerald Green',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    badge: 'LIMITED EDITION',
    rating: 4.92,
    reviews_count: 41,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
    delivery_days: 4,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'suit-04',
    title: 'Kashmiri Tilla Embroidered Velvet Pashmina Suit Set',
    category: 'Suits',
    price: 11999,
    original_price: 24999,
    description: 'High luxury winter-festive velvet suit embellished with fine Kashmiri metallic tilla needlework around the keyhole neckline and sleeve cuffs, complete with pure pashmina stole.',
    fabric: 'Micro Velvet & Kashmiri Pashmina',
    craft: 'Kashmiri Hand Tilla Embroidery',
    color: '#1e1b4b',
    colorName: 'Midnight Velvet Navy',
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=80',
    badge: 'HERITAGE ARCHIVE',
    rating: 5.0,
    reviews_count: 67,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'suit-05',
    title: 'Lucknowi Chikankari Mukaish Pure Georgette Suit',
    category: 'Suits',
    price: 8499,
    original_price: 16999,
    description: 'Traditional Awadh hand-embroidered Bakhiya & Phanda stitches with sparkling silver Mukaish dots on featherlight pure Viscose Georgette. Comes with modal silk inner and dyed organza dupatta.',
    fabric: 'Pure Georgette with Silver Mukaish',
    craft: 'Awadh Hand Chikankari (32 Stitches)',
    color: '#fae8ff',
    colorName: 'Blush Lavender Mist',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW ARRIVAL',
    rating: 4.85,
    reviews_count: 29,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'suit-06',
    title: 'Haldi Mustard Organza Suit with Zari Brocade Trousers',
    category: 'Suits',
    price: 5499,
    original_price: 10999,
    description: 'Vibrant wedding celebratory suit woven in crisp organza silk with sunshine gold zari floral sprigs, paired with pure brocade straight trousers and tasseled tissue stole.',
    fabric: 'Tissue Organza & Banarasi Brocade',
    craft: 'Handloom Brocade Weaving',
    color: '#d97706',
    colorName: 'Auspicious Haldi Mustard',
    image_url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING NOW',
    rating: 4.79,
    reviews_count: 38,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },

  // ================= 2. KALIDAR ANARKALIS =================
  {
    id: 'anarkali-01',
    title: 'Mehrunissa 32-Kali Pure Silk Kalidar Anarkali Gown',
    category: 'Anarkali',
    price: 9499,
    original_price: 21999,
    description: 'Magnificent 32-kali royal court silhouette engineered for dramatic flare and twirl. Hand-embroidered zardozi yoke with floral dabka work and heavy scalloped organza border.',
    fabric: 'Pure Raw Silk with Satin Can-Can Lining',
    craft: 'Zardozi & Dabka Needlecraft',
    color: '#7e1d32',
    colorName: 'Crimson Wine Silk',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'BEST SELLER',
    rating: 4.97,
    reviews_count: 112,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'anarkali-02',
    title: 'Noor Jahan Ivory Silk Floor Gown with Antique Gold Tilla',
    category: 'Anarkali',
    price: 10999,
    original_price: 23999,
    description: 'Serene pearl ivory pure silk gown featuring Mughal arch motifs along the bodice, finished with hand-dyed champagne organza veil and vintage gold antique trims.',
    fabric: 'Mulberry Habotai Silk',
    craft: 'Mughal Arch Tilla Handwork',
    color: '#fffdfa',
    colorName: 'Pearl Royal Ivory',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    badge: 'HERITAGE ARCHIVE',
    rating: 4.94,
    reviews_count: 63,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'Custom Fit'],
    delivery_days: 4,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: 'anarkali-03',
    title: 'Peacock Teal Angrakha Flared Anarkali with Mirror Belt',
    category: 'Anarkali',
    price: 7999,
    original_price: 15999,
    description: 'Cross-over Angrakha neckline tied with handmade latkan dori, flared raw silk panels, and a detachable real glass mirrorwork waist belt.',
    fabric: 'Silk Georgette & Raw Silk',
    craft: 'Angrakha Cut & Real Mirror Craft',
    color: '#0f766e',
    colorName: 'Peacock Jewel Teal',
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW ARRIVAL',
    rating: 4.88,
    reviews_count: 34,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'anarkali-04',
    title: 'Gulmohar Red Silk Kalidar with Zari Brocade Hem',
    category: 'Anarkali',
    price: 8799,
    original_price: 17999,
    description: 'Striking scarlet bridal anarkali woven with rich zari borders at the sweeping hemline, accompanied by a matching pure silk churidar and hand-worked dupatta.',
    fabric: 'Pure Mulberry Chanderi',
    craft: 'Zari Borders & Resham Embroidery',
    color: '#991b1b',
    colorName: 'Gulmohar Scarlet Red',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    badge: 'LIMITED EDITION',
    rating: 4.91,
    reviews_count: 45,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'Custom Fit'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },

  // ================= 3. SHARARAS & GHARARAS =================
  {
    id: 'sharara-01',
    title: 'Bespoke Mirrorwork Silk Sharara Set with Sheer Cape',
    category: 'Shararas',
    price: 7999,
    original_price: 16999,
    description: 'Stunning tiered flared sharara with mirrorwork embellishments across each pleat, matching peplum bustier kurti, and a sheer flowy organza cape jacket.',
    fabric: 'Georgette Silk with Pure Crepe Inner',
    craft: 'Real Mirror Embroidery & Gota Patti',
    color: '#be185d',
    colorName: 'Rani Rose Pink',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    badge: 'BEST SELLER',
    rating: 4.96,
    reviews_count: 95,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
  },
  {
    id: 'sharara-02',
    title: 'Royal Brocade Flared Gharara with Zardozi Kurti',
    category: 'Shararas',
    price: 8999,
    original_price: 19999,
    description: 'Authentic Lucknowi knee-gather flared Gharara tailored in heavy gold brocade jacquard, matched with a structured silk short kurti and zari border dupatta.',
    fabric: 'Banarasi Brocade & Raw Silk',
    craft: 'Lucknowi Gharara Tailoring with Zardozi',
    color: '#581c87',
    colorName: 'Royal Imperial Plum',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    badge: 'HERITAGE ARCHIVE',
    rating: 4.91,
    reviews_count: 47,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'Custom Fit'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'sharara-03',
    title: 'Pistachio Mint Gota Tiered Sharara & Peplum Kurta',
    category: 'Shararas',
    price: 6899,
    original_price: 13999,
    description: 'Refreshing pastel mint festive tiered sharara detailed with traditional gold gota lace ribbons and mirror tassels on the peplum side slits.',
    fabric: 'Chanderi Silk & Organza',
    craft: 'Jaipuri Hand Gota Ribbons',
    color: '#065f46',
    colorName: 'Pistachio Heritage Mint',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW ARRIVAL',
    rating: 4.86,
    reviews_count: 28,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },

  // ================= 4. ARTISAN KURTAS =================
  {
    id: 'kurta-01',
    title: 'Imperial Chanderi Kurta Set with Gota Border',
    category: 'Kurtas',
    price: 4999,
    original_price: 9999,
    description: 'Timeless handwoven Chanderi tissue kurta with delicate Gota Patti borders on hem and sleeves, paired with silk cotton tapered pants and sheer mulmul dupatta.',
    fabric: 'Handwoven Chanderi Tissue & Mulmul',
    craft: 'Jaipuri Hand Gota Patti',
    color: '#f43f5e',
    colorName: 'Gulabi Festive Coral',
    image_url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING NOW',
    rating: 4.82,
    reviews_count: 56,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'kurta-02',
    title: 'Pure Tussar Silk Straight Kurta with Kutch Mirrorwork',
    category: 'Kurtas',
    price: 4499,
    original_price: 8999,
    description: 'Minimalist luxury straight-cut kurta crafted in textured raw Tussar silk with geometric mirrorwork motifs across yoke, designed for comfortable all-day festive elegance.',
    fabric: '100% Handloom Tussar Silk',
    craft: 'Kutch Hand Mirror Embroidery',
    color: '#9a3412',
    colorName: 'Burnt Terracotta Rust',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    badge: 'LIMITED EDITION',
    rating: 4.87,
    reviews_count: 39,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'kurta-03',
    title: 'Sapphire Royal Blue Silk Kurta with Resham Jaal Work',
    category: 'Kurtas',
    price: 5299,
    original_price: 10499,
    description: 'Lustrous royal blue pure silk straight silhouette accented with intricate tone-on-tone resham embroidery and delicate gold coin buttons.',
    fabric: 'Pure Raw Silk with Cotton Voile Inner',
    craft: 'Tone-on-Tone Resham Needlework',
    color: '#1e3a8a',
    colorName: 'Sapphire Royal Blue',
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW ARRIVAL',
    rating: 4.89,
    reviews_count: 31,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },

  // ================= 5. CO-ORD SETS =================
  {
    id: 'coord-01',
    title: 'Silk Draped Dhoti & Embellished Cape Co-ord Set',
    category: 'Co-ord Sets',
    price: 6499,
    original_price: 13999,
    description: 'Runway-inspired modern ethnic co-ord featuring structured raw silk cropped bustier, pleated draped dhoti trousers, and a lightweight floor-sweeping embroidered organza cape.',
    fabric: 'Raw Silk & Pure Viscose Organza',
    craft: 'Hand Draping & Sequin Resham Work',
    color: '#0f172a',
    colorName: 'Midnight Noir Black',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING NOW',
    rating: 4.89,
    reviews_count: 53,
    in_stock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'coord-02',
    title: 'Brocade Vest & Flared Palazzos Festive Co-ord',
    category: 'Co-ord Sets',
    price: 5999,
    original_price: 11999,
    description: 'Festive chic ensemble with a tailored Banarasi brocade waistcoat vest and high-waisted pleated silk palazzo pants with inner pockets.',
    fabric: 'Banarasi Brocade & Mulberry Silk',
    craft: 'Brocade Weave & Sartorial Tailoring',
    color: '#c89d46',
    colorName: 'Champagne Gilded Gold',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW ARRIVAL',
    rating: 4.84,
    reviews_count: 27,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },

  // ================= 6. SAREES & DRAPES =================
  {
    id: 'saree-01',
    title: 'Pure Mulberry Katan Kadwa Banarasi Saree in Crimson Gold',
    category: 'Sarees',
    price: 12999,
    original_price: 28999,
    description: 'Master handloom certified 100% pure silk saree with electroplated gold-silver Kadwa hunting jaal (Shikargah) motifs across body and an opulent rich pallu.',
    fabric: '100% Pure Mulberry Katan Silk',
    craft: 'Kadwa Handloom Brocade',
    color: '#831843',
    colorName: 'Heritage Crimson Gold',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    badge: 'HERITAGE ARCHIVE',
    rating: 4.98,
    reviews_count: 78,
    in_stock: true,
    sizes: ['Custom Fit'],
    delivery_days: 3,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: 'saree-02',
    title: 'Kanchipuram Korvai Pure Silk Saree with Temple Border',
    category: 'Sarees',
    price: 14999,
    original_price: 31999,
    description: 'Handwoven in Kanchipuram using traditional Korvai interlocking technique with pure 3-ply mulberry silk yarns and contrasting petni pallu.',
    fabric: 'Pure Mulberry Silk (Silk Mark)',
    craft: 'Authentic Korvai Handloom Weaving',
    color: '#064e3b',
    colorName: 'Peacock Temple Emerald',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    badge: 'LIMITED EDITION',
    rating: 4.96,
    reviews_count: 42,
    in_stock: true,
    sizes: ['Custom Fit'],
    delivery_days: 4,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },

  // ================= 7. DUPATTA ENSEMBLES =================
  {
    id: 'dupatta-01',
    title: 'Varanasi Rangkat Pure Organza Zari Handloom Dupatta',
    category: 'Dupatta Sets',
    price: 4999,
    original_price: 10999,
    description: 'Rare multi-color diagonal dyed pure organza dupatta accented with real silver electroplated zari jaal work and scalloped hand-cut edges.',
    fabric: 'Pure Tissue Organza',
    craft: 'Varanasi Handloom Rangkat Weave',
    color: '#db2777',
    colorName: 'Multicolor Rani Festive',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    badge: 'BEST SELLER',
    rating: 4.93,
    reviews_count: 51,
    in_stock: true,
    sizes: ['Custom Fit'],
    delivery_days: 2,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'AURA20',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 3999,
    description: '20% Privilege Discount on all Handcrafted Silks'
  },
  {
    code: 'ROYAL1000',
    discountType: 'flat',
    discountValue: 1000,
    minOrder: 5999,
    description: 'Flat ₹1,000 OFF on Orders Above ₹5,999'
  },
  {
    code: 'SILKMARK',
    discountType: 'flat',
    discountValue: 500,
    minOrder: 2999,
    description: 'Flat ₹500 OFF on First Certified Silk Order'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-01',
    author: 'Pooja K. Singhania',
    city: 'New Delhi (Greater Kailash-1)',
    rating: 5,
    title: 'The Kadwa Zari is genuine master craftsmanship!',
    content: 'Ordered the Royal Banarasi Katan Silk suit for my sister’s sangeet. The zari has zero back floats—you can feel the authentic Varanasi loom quality immediately. The Silk Mark certificate was attached with hologram.',
    date: '2 days ago',
    verified: true
  },
  {
    id: 'rev-02',
    author: 'Dr. Sunita V. Joshi',
    city: 'Mumbai (Juhu)',
    rating: 5,
    title: 'Flawless 32-Kali flare, twirled like royalty',
    content: 'The Mehrunissa Anarkali has unbelievable structure with the built-in satin can-can. Received endless compliments at our Diwali gala. Express BlueDart delivery arrived in 48 hours in a gorgeous keepsake box.',
    date: '4 days ago',
    verified: true
  },
  {
    id: 'rev-03',
    author: 'Ananya S. Reddy',
    city: 'Bangalore (Indiranagar)',
    rating: 5,
    title: 'Bespoke custom tailoring service was perfection',
    content: 'Selected Custom Fit and submitted my measurements. Master tailor contacted me on WhatsApp to confirm shoulder and sleeve length. The suit fits like haute couture.',
    date: '1 week ago',
    verified: true
  },
  {
    id: 'rev-04',
    author: 'Mehak G. Rathore',
    city: 'Jaipur (C-Scheme)',
    rating: 5,
    title: 'Real glass mirrorwork with authentic Gota Patti',
    content: 'Being from Jaipur, I am very particular about real Gota foil work. Suit Bliss Aura delivers 100% authentic artisan work without synthetic shortcuts. Truly an elite couture label.',
    date: '1 week ago',
    verified: true
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How do I know my silk garment is 100% pure?',
    answer: 'Every silk piece crafted at Suit Bliss Aura carries an authorized Silk Mark Organization of India tag with a unique serial barcode and hologram. We strictly work with certified pure Mulberry, Katan, and Tussar silks.'
  },
  {
    question: 'How does Bespoke Custom Tailoring work?',
    answer: 'Select "Custom Fit" during size selection or enter your measurements in order notes. After order placement, our senior master tailor will connect with you via WhatsApp to double-check your bust, waist, hip, and length measurements before cutting fabric.'
  },
  {
    question: 'What are the delivery timelines and shipping charges?',
    answer: 'We provide complimentary Insured Air Express delivery across all 28,000+ PIN codes in India. Metro orders are delivered in 2-3 business days, while custom-tailored orders ship within 4-5 business days.'
  },
  {
    question: 'What is your exchange and return policy?',
    answer: 'We offer a hassle-free 7-day sizing exchange and return window. If you require size alterations or a different silhouette, our courier partner will arrange doorstep pickup with zero return fees.'
  },
  {
    question: 'Can I pay via Cash on Delivery (COD) or UPI?',
    answer: 'Yes! We support 100% secure Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking with zero extra transaction fees.'
  }
];
