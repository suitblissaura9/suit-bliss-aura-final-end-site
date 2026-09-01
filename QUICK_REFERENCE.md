# 📖 Suit Bliss - Quick Reference Guide

## 🎯 Quick Start (5 Minutes)

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy template
cp .env.example .env.local

# Fill in these values from Supabase and Razorpay:
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
```

### 3. Set Up Supabase
```sql
-- Run in Supabase SQL Editor (copy from DATABASE_SETUP.sql)
-- Creates: products table, orders table, RLS policies, indexes
```

### 4. Create Storage Bucket
- Go to Supabase Storage
- Create bucket named `products`
- Set to PUBLIC (important!)

### 5. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📂 File Structure Reference

```
suit-bliss/
├── 📄 README.md                    ← Start here for overview
├── 📄 SETUP_GUIDE.md              ← Detailed setup instructions
├── 📄 DEPLOYMENT_CHECKLIST.md      ← Launch checklist
├── 📄 IMPLEMENTATION_SUMMARY.md    ← What was built
├── 📄 QUICK_REFERENCE.md          ← This file
│
├── 🔧 Configuration Files
│   ├── .env.example               ← Copy to .env.local
│   ├── env.local                  ← Your local variables (not versioned)
│   ├── tailwind.config.ts         ← Tailwind v4 setup
│   ├── tsconfig.json              ← TypeScript strict mode
│   ├── next.config.ts             ← Next.js configuration
│   └── postcss.config.mjs          ← CSS processing
│
├── 💾 Database & Backend
│   ├── DATABASE_SETUP.sql         ← PostgreSQL schema
│   └── app/api/create-order/route.ts ← Razorpay API
│
├── 🎨 Frontend (React Components)
│   ├── app/layout.tsx             ← Root layout, header, footer, cart
│   ├── app/page.tsx               ← Storefront with real-time sync
│   ├── app/admin/page.tsx         ← Admin dashboard
│   ├── app/globals.css            ← Global styles + theme
│   └── lib/supabase.ts            ← Supabase client
│
└── 📦 Dependencies (package.json)
    ├── @supabase/supabase-js
    ├── framer-motion
    ├── razorpay
    ├── next
    ├── react
    └── tailwindcss
```

---

## 🎯 Common Tasks

### Add a Product (Admin)
1. Navigate to `/admin`
2. Fill in product form:
   - Title, Price (₹), Description
   - Fabric Notes, Image Upload
3. Click "Add Garment"
4. ✅ Product appears instantly on storefront

### Delete a Product
1. Go to `/admin` → Products tab
2. Find product in inventory table
3. Click "Purge" button
4. ✅ Product deleted from database and storage

### View Orders
1. Go to `/admin` → Orders tab
2. See all incoming transactions
3. Check customer name, amount, status
4. Real-time updates as new orders arrive

### Make a Test Purchase
1. Browse storefront
2. Click "Add to Bag"
3. Open cart drawer (top right)
4. Click "Proceed to Payment"
5. Use test card: **4111 1111 1111 1111**
6. Enter any OTP: **1234**
7. ✅ Order appears in admin dashboard

---

## 🎨 Styling Reference

### Colors Available (Use in className)
```css
bg-obsidian      /* #0f0f0f - Main background */
bg-charcoal      /* #1a1a1a - Secondary */
bg-slate         /* #2d2d2d - Inputs */
bg-stone         /* #3f3f3f - Tertiary */
bg-taupe         /* #6b6b6b - Accents */
text-cream       /* #f5f3f0 - Main text */
text-taupe       /* #6b6b6b - Secondary text */

/* Borders */
border-stone/30  /* Subtle borders */
border-taupe     /* Accent borders */
```

### Font Classes
```css
font-luxury      /* Georgia serif - Headings */
font-modern      /* System UI sans - Body text */
tracking-wide    /* 0.2em letter spacing */
```

### Utility Classes
```css
hover-lift       /* Hover scale + shadow */
luxury-shadow    /* Deep shadow effect */
glass            /* Blur + transparency */
gradient-text    /* Gradient effect */
```

---

## 🔗 API Reference

### POST /api/create-order
Creates a Razorpay order

**Request:**
```javascript
fetch('/api/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 50000,  // In paisa (÷100 for INR)
    items: [{ id, title, price }]
  })
})
```

**Response:**
```json
{
  "id": "order_xxx",
  "amount": 50000,
  "currency": "INR",
  "receipt": "SUITBLISS-xxx"
}
```

---

## 🗄️ Database Quick Reference

### Products Table
```sql
SELECT * FROM products;

-- Columns:
id, title, price, description, fabric_notes, image_url, created_at, updated_at

-- Add product:
INSERT INTO products (title, price, description, fabric_notes, image_url)
VALUES ('Premium Suit', 50000, '...', '...', 'https://...');
```

### Orders Table
```sql
SELECT * FROM orders;

-- Columns:
id, customer_name, customer_email, amount, status, razorpay_order_id, 
razorpay_payment_id, receipt_code, items, created_at, updated_at

-- Statuses: 'pending' | 'completed'
```

---

## ⚡ Performance Tips

### Optimize Images
- Use JPG/WebP format
- Compress before uploading
- Max size: 2MB recommended
- Recommended dimensions: 800x800px

### Database Performance
- Indexes already created on created_at, status
- Queries optimized with .order() and .select('*')
- Real-time sync uses efficient WebSocket channels

### Build Optimization
- Next.js Turbopack (fast builds)
- Automatic code splitting
- Image lazy loading
- CSS tree shaking

---

## 🐛 Debugging Checklist

### Products Not Showing?
```javascript
// Check browser console
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Products loaded:', products.length)
```

### Real-Time Not Working?
```javascript
// Check DevTools → Network → WS tab
// Should see active WebSocket connection to supabase
```

### Payment Failing?
```javascript
// Check Razorpay keys in .env.local
// Verify using TEST keys (not production)
// Check browser console for Razorpay errors
```

### Images Not Uploading?
```
• Supabase Storage → products bucket → Must be PUBLIC
• File size < 50MB
• Supported formats: JPG, PNG, WebP
```

---

## 📊 Monitoring Dashboard

### What to Check Daily
- [ ] Check `/admin` → Orders tab
- [ ] Verify products appear on storefront
- [ ] Test add-to-cart functionality
- [ ] Check browser console (no errors)

### What to Check Weekly
- [ ] Database performance in Supabase Dashboard
- [ ] Storage usage (images uploaded)
- [ ] Razorpay payment dashboard
- [ ] Real-time sync latency

---

## 🚀 Deployment Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Vercel Deploy
```bash
vercel --prod
```

---

## 📚 Documentation Map

| Document | Purpose | Pages |
|----------|---------|-------|
| README.md | Project overview | 10+ |
| SETUP_GUIDE.md | Step-by-step setup | 8+ |
| DEPLOYMENT_CHECKLIST.md | Launch verification | 6+ |
| IMPLEMENTATION_SUMMARY.md | What was built | 8+ |
| DATABASE_SETUP.sql | Database schema | 3 |
| .env.example | Environment template | 1 |

---

## 🔑 Important URLs

| Purpose | URL |
|---------|-----|
| Local Development | http://localhost:3000 |
| Storefront | http://localhost:3000 |
| Admin Dashboard | http://localhost:3000/admin |
| Supabase Console | https://supabase.com/dashboard |
| Razorpay Dashboard | https://dashboard.razorpay.com |
| Vercel Dashboard | https://vercel.com/dashboard |

---

## 🎓 Key Concepts

### Real-Time Sync
Products update instantly when admin makes changes:
```javascript
supabase.channel('products-changes')
  .on('postgres_changes', { table: 'products' }, (payload) => {
    // INSERT/UPDATE/DELETE handled automatically
  })
  .subscribe()
```

### Payment Flow
```
User clicks "Pay" → Create Razorpay Order (API) → Open Checkout
→ User pays → Success → Create Order in DB → Show Confirmation
```

### Storage Integration
```
Admin uploads image → Saved to Supabase Storage → Get public URL
→ Store URL in products table → Display on storefront
```

---

## 🎯 Success Indicators

✅ Working correctly when:
- [ ] Dev server starts (npm run dev)
- [ ] Build succeeds (npm run build)
- [ ] No console errors
- [ ] Products load on storefront
- [ ] Admin dashboard accessible
- [ ] Real-time updates work
- [ ] Payment flow completes
- [ ] Orders appear in database

---

## 💡 Pro Tips

1. **Development**: Use `npm run dev` with browser DevTools open
2. **Testing**: Use Razorpay test card 4111111111111111
3. **Images**: Keep images optimized (~50-100KB each)
4. **Database**: Check Supabase dashboard for query times
5. **Deployment**: Test `npm run build` before deploying
6. **Real-Time**: Monitor WebSocket in DevTools
7. **Performance**: Use Vercel Analytics for monitoring
8. **Security**: Never commit `.env.local` file

---

## 🆘 Emergency Contacts

| Issue | Contact |
|-------|---------|
| Database | support@supabase.io |
| Payments | support@razorpay.com |
| Deployment | support.vercel.com |
| Documentation | Check README.md |

---

## ✅ Pre-Launch Checklist

- [ ] Environment variables filled in
- [ ] Supabase database set up
- [ ] Storage bucket created (PUBLIC)
- [ ] Razorpay test keys configured
- [ ] npm run build succeeds
- [ ] npm run dev starts without errors
- [ ] Storefront shows products
- [ ] Admin dashboard accessible
- [ ] Test purchase completes
- [ ] Order appears in database

---

## 🎉 You're All Set!

Suit Bliss is ready to launch. Follow the checklist, set up your environment, and deploy!

**Questions?** Check the detailed documentation:
- README.md (overview)
- SETUP_GUIDE.md (step-by-step)
- DEPLOYMENT_CHECKLIST.md (launch)

**Let's build luxury!** ✨

---

**Suit Bliss v1.0.0**  
Production Ready - All Systems Go!
