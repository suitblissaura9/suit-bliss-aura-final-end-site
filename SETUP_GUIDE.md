# Suit Bliss - Complete Setup Guide

## Overview
Suit Bliss is a production-grade luxury e-commerce web application with real-time Supabase synchronization and secure Razorpay payment integration.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (https://supabase.com)
- A Razorpay account (https://razorpay.com)

## Step 1: Project Setup

```bash
cd suit-bliss
npm install
```

## Step 2: Supabase Configuration

### 2.1 Create a Supabase Project
1. Go to https://supabase.com and sign in
2. Create a new project
3. Wait for the project to be provisioned

### 2.2 Database Setup
1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Copy and paste the entire contents of `DATABASE_SETUP.sql`
4. Execute the SQL

### 2.3 Configure Storage Bucket
1. In Supabase Dashboard, go to **Storage**
2. Create a new bucket named `products`
3. Set it to **Public** (make it publicly accessible)
4. Done!

### 2.4 Get Your Credentials
1. Go to **Settings** → **API**
2. Copy your:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Razorpay Configuration

### 3.1 Get Your Credentials
1. Sign in to https://dashboard.razorpay.com
2. Go to **Settings** → **API Keys**
3. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID` (also `NEXT_PUBLIC_RAZORPAY_KEY_ID`)
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

## Step 4: Environment Variables

1. Create a `.env.local` file in the project root
2. Copy the contents from `.env.example`
3. Fill in all the values from Supabase and Razorpay
4. Save and never commit this file (it's already in .gitignore)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## Step 5: Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## Features

### 1. Luxury Storefront (`/`)
- Real-time product synchronization with Supabase
- Animated hero section with smooth transitions
- Beautiful product cards with hover zoom effects
- Add to cart functionality with localStorage persistence
- Responsive grid layout

### 2. Admin Dashboard (`/admin`)

#### Product Management
- Upload new garments with images to Supabase Storage
- Set pricing in Indian Rupees (₹)
- Add detailed descriptions and fabric notes
- Real-time product inventory table with thumbnails
- One-click "Purge" function to delete products

#### Order Tracking
- Live transaction table showing all incoming orders
- Display customer names, amounts, and payment statuses
- Real-time updates as new orders come in
- Sortable and filterable order information

### 3. Shopping Cart
- Sticky header with cart icon and item count
- Cart drawer showing all items
- Quick remove functionality
- Real-time total calculation
- Secure Razorpay payment checkout

### 4. Payment Integration
- Secure Razorpay checkout handler
- Client-side payment verification
- Automatic order creation after successful payment
- Unique receipt codes for each transaction

## File Structure

```
suit-bliss/
├── app/
│   ├── layout.tsx              # Global layout with header, footer, cart
│   ├── page.tsx                # Luxury storefront with real-time sync
│   ├── globals.css             # Global styles and Tailwind theme
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── api/
│       └── create-order/
│           └── route.ts        # Razorpay order creation endpoint
├── lib/
│   └── supabase.ts             # Supabase client initialization
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── env.local                   # Environment variables (local)
├── DATABASE_SETUP.sql          # Database schema
└── SETUP_GUIDE.md             # This file
```

## Database Schema

### Products Table
- `id` (UUID): Primary key
- `title` (VARCHAR): Product name
- `price` (DECIMAL): Price in INR
- `description` (TEXT): Product description
- `fabric_notes` (TEXT): Tailoring and fabric details
- `image_url` (TEXT): URL to product image in Supabase Storage
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### Orders Table
- `id` (UUID): Primary key
- `customer_name` (VARCHAR): Customer name
- `customer_email` (VARCHAR): Customer email
- `amount` (DECIMAL): Order amount in INR
- `status` (VARCHAR): Payment status (pending/completed)
- `razorpay_order_id` (VARCHAR): Razorpay order ID
- `razorpay_payment_id` (VARCHAR): Razorpay payment ID
- `receipt_code` (VARCHAR): Unique receipt code
- `items` (JSONB): Order items data
- `created_at` (TIMESTAMP): Order creation time
- `updated_at` (TIMESTAMP): Last update time

## Real-Time Synchronization

The storefront uses Supabase's `postgres_changes` subscription to listen for live updates:

1. **INSERT**: New products appear instantly on the storefront
2. **UPDATE**: Product changes reflect immediately
3. **DELETE**: Products disappear from the storefront when removed

No page refresh needed - all changes are streamed in real-time!

## Styling

The application uses a refined dark luxury aesthetic:

### Color Palette
- **Obsidian** (#0f0f0f): Primary background
- **Charcoal** (#1a1a1a): Secondary background
- **Taupe** (#6b6b6b): Accent color for buttons and highlights
- **Cream** (#f5f3f0): Text color
- **Stone** (#3f3f3f): Tertiary elements

### Typography
- **Georgia** (serif): Luxury brand font for headings
- **System UI** (sans-serif): Modern clean font for body text
- Custom letter spacing: `tracking-wide` (0.2em)

### Animations
- Fade-in effects on page load
- Slide-up animations for product cards
- Hover zoom on product images (1.08x scale)
- Smooth transitions on all interactive elements
- Animated scroll indicator in hero section

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel Dashboard under Project Settings.

### Docker
```bash
docker build -t suit-bliss .
docker run -p 3000:3000 suit-bliss
```

### Self-Hosted
```bash
npm run build
npm start
```

## Troubleshooting

### Supabase Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that RLS policies are properly set
- Ensure the `products` and `orders` tables exist

### Razorpay Payment Issues
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Check that you're in test mode for development
- Ensure browser allows payment scripts from checkout.razorpay.com

### Real-Time Updates Not Working
- Check Supabase Realtime is enabled for the tables
- Verify browser console for WebSocket connection errors
- Ensure subscription channel name matches table name

### Image Upload Issues
- Verify `products` bucket exists in Supabase Storage
- Check bucket is set to Public
- Ensure file size is under 50MB

## Performance Optimizations

1. **Image Optimization**: Use optimized images (JPG/WebP)
2. **Lazy Loading**: Product images load progressively
3. **Caching**: Static pages are cached at build time
4. **Database Indexes**: Optimized queries with proper indexes
5. **CDN**: Supabase Storage serves images via CDN

## Security Features

1. **Server-Side Razorpay**: Keys never exposed to frontend
2. **Row-Level Security**: Supabase RLS policies restrict access
3. **HTTPS Only**: All external APIs use HTTPS
4. **CORS Protection**: Proper CORS headers configured
5. **Input Validation**: All inputs sanitized and validated

## Support & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## License

Proprietary - Suit Bliss Luxury Fashion

---

**Built with ❤️ for ultra-luxury e-commerce**
