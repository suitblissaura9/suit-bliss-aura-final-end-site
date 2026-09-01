# 🚀 Suit Bliss - Deployment & Launch Checklist

## Pre-Launch Verification

### ✅ Code Quality
- [x] TypeScript strict mode enabled
- [x] No console errors
- [x] Build succeeds: `npm run build`
- [x] Linting passes: `npm run lint`
- [x] All imports use `@/` alias
- [x] Production build tested locally

### ✅ File Structure
- [x] `app/layout.tsx` - Root layout with header, footer, cart
- [x] `app/page.tsx` - Storefront with real-time sync
- [x] `app/admin/page.tsx` - Admin dashboard
- [x] `app/api/create-order/route.ts` - Razorpay API
- [x] `app/globals.css` - Global styles + Tailwind theme
- [x] `lib/supabase.ts` - Supabase client
- [x] `tailwind.config.ts` - Tailwind v4 config
- [x] `DATABASE_SETUP.sql` - Schema file

### ✅ Documentation
- [x] README.md - Comprehensive guide
- [x] SETUP_GUIDE.md - Step-by-step setup
- [x] .env.example - Environment template
- [x] DATABASE_SETUP.sql - Database schema

## Supabase Setup

### Step 1: Create Project
- [ ] Sign in to https://supabase.com
- [ ] Create new project
- [ ] Wait for provisioning (5-10 minutes)
- [ ] Note project URL and API keys

### Step 2: Database Configuration
- [ ] Open Supabase SQL Editor
- [ ] Copy all contents from `DATABASE_SETUP.sql`
- [ ] Paste into editor
- [ ] Click "Run" to execute
- [ ] Verify `products` and `orders` tables exist
- [ ] Check RLS policies are enabled

### Step 3: Storage Bucket
- [ ] Go to Storage section in Supabase
- [ ] Click "New Bucket"
- [ ] Name it `products`
- [ ] **Uncheck** "Private bucket" (make it PUBLIC)
- [ ] Click "Create Bucket"
- [ ] Verify bucket is accessible

### Step 4: Real-Time Configuration
- [ ] Go to Database → Replication
- [ ] Verify `products` table has replication enabled
- [ ] Verify `orders` table has replication enabled
- [ ] Test by subscribing in browser console

### Step 5: Get Credentials
- [ ] Settings → API
- [ ] Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Store securely

## Razorpay Setup

### Step 1: Dashboard Access
- [ ] Sign in to https://dashboard.razorpay.com
- [ ] Verify account is in "Test" mode
- [ ] Go to Settings → API Keys
- [ ] Copy Key ID → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] Copy Key Secret → `RAZORPAY_KEY_SECRET`
- [ ] Store keys securely

### Step 2: Test Credentials
- [ ] Use test keys (NOT production keys)
- [ ] Test payment flow with test card: 4111111111111111
- [ ] Verify payment appears in Razorpay dashboard
- [ ] Check order is created in Supabase

### Step 3: Webhook Configuration (Optional)
- [ ] Go to Settings → Webhooks
- [ ] Add webhook endpoint (for production)
- [ ] Subscribe to events: `payment.captured`, `order.paid`
- [ ] Note: Not required for MVP

## Environment Configuration

### Local Development
```bash
# 1. Create .env.local file
cp .env.example .env.local

# 2. Fill in all values from Supabase and Razorpay
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=razorpay_test_xxxxx
RAZORPAY_KEY_ID=razorpay_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# 3. Start dev server
npm run dev

# 4. Visit http://localhost:3000
```

### Production Deployment (Vercel)
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add environment variables in Vercel Dashboard
- [ ] Deploy automatically

**Environment Variables in Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
NEXT_PUBLIC_RAZORPAY_KEY_ID = razorpay_live_xxxxx (for production)
RAZORPAY_KEY_ID = razorpay_live_xxxxx
RAZORPAY_KEY_SECRET = your_secret_key
```

## Testing Checklist

### 🏪 Storefront Testing
- [ ] Homepage loads without errors
- [ ] Hero section animates smoothly
- [ ] Products load from Supabase
- [ ] Product images display correctly
- [ ] Hover zoom works on product cards
- [ ] "Add to Bag" button works
- [ ] Shopping cart drawer opens/closes
- [ ] Cart shows correct item count
- [ ] Cart persists after page refresh
- [ ] Remove from cart works
- [ ] Responsive on mobile/tablet/desktop

### 🎛️ Admin Dashboard Testing
- [ ] Admin page loads at `/admin`
- [ ] Product form accepts all inputs
- [ ] Image upload works
- [ ] Products appear in table immediately
- [ ] "Purge" button deletes product
- [ ] Image deleted from storage
- [ ] Orders table shows incoming transactions
- [ ] Real-time updates work (test from another browser)

### 💳 Payment Testing
- [ ] Cart total calculates correctly
- [ ] "Proceed to Payment" button works
- [ ] Razorpay modal opens
- [ ] Test card accepted: 4111111111111111
- [ ] Any OTP accepted: 1234
- [ ] Payment successful message appears
- [ ] Order created in Supabase
- [ ] Cart clears after payment
- [ ] Order appears in admin orders table

### 🔄 Real-Time Sync Testing
- [ ] Open storefront in 2 browser windows
- [ ] Add product from admin in one window
- [ ] Verify product appears in other window instantly
- [ ] Update product price in admin
- [ ] Verify price updates instantly
- [ ] Delete product from admin
- [ ] Verify product disappears instantly

## Launch Checklist

### Before Going Live
- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Images optimized and loading fast
- [ ] Mobile responsiveness verified
- [ ] Payment flow tested end-to-end
- [ ] Real-time sync tested
- [ ] Database backups configured
- [ ] Error monitoring set up (Sentry/LogRocket)

### Pre-Production Improvements (Optional)
- [ ] Add customer authentication
- [ ] Implement admin authentication
- [ ] Add email notifications
- [ ] Create Terms & Conditions page
- [ ] Implement customer reviews/ratings
- [ ] Add wishlist functionality
- [ ] Implement order history for customers
- [ ] Add inventory management (stock levels)

### Production Deployment Steps
1. [ ] Update Razorpay to production keys
2. [ ] Change domain settings in Supabase (CORS)
3. [ ] Enable HTTPS (automatic on Vercel)
4. [ ] Set up custom domain
5. [ ] Configure email notifications
6. [ ] Set up analytics tracking
7. [ ] Create robots.txt and sitemap
8. [ ] Set up SSL certificate
9. [ ] Test everything one final time
10. [ ] Launch!

## Post-Launch Monitoring

### Daily Checks
- [ ] Check admin orders table for new orders
- [ ] Verify real-time sync is working
- [ ] Monitor error logs
- [ ] Check Razorpay dashboard for payments
- [ ] Verify product inventory

### Weekly Checks
- [ ] Database performance review
- [ ] Storage usage review
- [ ] Payment reconciliation
- [ ] Customer feedback review
- [ ] Performance metrics review

### Monthly Tasks
- [ ] Database backups verification
- [ ] Security audit
- [ ] Analytics report
- [ ] Growth metrics review
- [ ] Plan improvements

## Scaling Checklist (Future)

### As Traffic Increases
- [ ] Monitor Supabase connection limits
- [ ] Increase database plan if needed
- [ ] Optimize slow queries with indexes
- [ ] Implement caching strategy
- [ ] Set up CDN for images
- [ ] Optimize API routes

### As Inventory Grows
- [ ] Add product categories/filtering
- [ ] Implement advanced search
- [ ] Add product variants (size, color)
- [ ] Implement inventory tracking
- [ ] Add stock notifications
- [ ] Optimize database queries

### As Revenue Grows
- [ ] Migrate Razorpay to subscription plans
- [ ] Implement affiliate programs
- [ ] Add loyalty points system
- [ ] Implement bulk ordering
- [ ] Add customer accounts
- [ ] Create admin user roles

## Troubleshooting Quick Reference

| Issue | Cause | Solution |
|-------|-------|----------|
| Products not showing | Missing env vars | Verify SUPABASE_URL and ANON_KEY |
| Payment fails | Wrong Razorpay keys | Check dashboard for correct test keys |
| Real-time not updating | Subscription issue | Check browser console for WebSocket errors |
| Images not uploading | Storage bucket private | Make `products` bucket PUBLIC |
| Build fails | TypeScript error | Run `npm run lint` to find issues |

## Support Resources

- **Supabase**: https://supabase.com/docs
- **Razorpay**: https://razorpay.com/docs
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

## Success Criteria

✅ **Deployment is successful when:**

1. Storefront loads and displays products
2. Products sync in real-time from admin
3. Payment flow works end-to-end
4. Orders appear in admin dashboard
5. All responsive breakpoints work
6. No console errors in production
7. Page load time < 2 seconds
8. Real-time latency < 100ms

---

## 📞 Emergency Contacts

- **Supabase Support**: support@supabase.io
- **Razorpay Support**: support@razorpay.com
- **Vercel Support**: support.vercel.com

---

**Suit Bliss - Ready for Launch** 🎉

Track your progress above and celebrate each checkpoint!
