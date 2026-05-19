# 💈 01 — Project Overview & Tech Stack
> **For AI Coding Agents:** Antigravity, Bolt, Lovable, v0, Cursor
> This is File 1 of 6. Read ALL 6 files before writing any code.
> Build order: 01 Setup → 02 Design System → 03 Data → 04 Home/Services → 05 Gallery/Pricing/Book → 06 Backend/Deploy

---

## 📋 Project Overview

| Field | Value |
|---|---|
| **Business Name** | Gretta Saloon (replace with your name) |
| **Business Type** | Premium Hair Saloon |
| **Location** | Muthukulam, Kerala, India — PIN 686122 |
| **Pages** | 6 total |
| **Primary Goal** | Attract local Kerala clients, enable WhatsApp/online booking |
| **Language** | English |
| **Design Source** | Relume.io — [View Project](https://www.relume.io/app/project/P3127528_nWa_X_Pnu0bm1Tq_82DGe1ZnAQoW-3NzVt8LxNMKqxs) |
| **Sitemap** | Home, Services, Service Details, Gallery, Pricing, Book Online |

---

## 🧱 Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR + SEO for local Google ranking |
| Styling | **Tailwind CSS v3** | Utility-first, mobile-first |
| Animations | **Framer Motion** | Fade-in on scroll, hero entrance |
| Counter | **react-countup** | Animated stats numbers |
| Slider | **Swiper.js** | Testimonials carousel |
| Database | **Supabase** (PostgreSQL) | Booking + contact form storage |
| Email | **Resend** | Booking confirmation emails, free 3k/mo |
| Images | **Cloudinary** | Gallery image hosting + CDN optimization |
| Hosting | **Vercel** | Free tier, auto-deploy from GitHub |
| Icons | **Lucide React** | Lightweight, consistent icon set |
| Fonts | **Google Fonts** | Fraunces (heading) + Inter (body) |

---

## 📁 Full Project File Structure

```
saloon-website/
├── app/
│   ├── layout.tsx                   # Root layout: Navbar + Footer + WhatsApp FAB
│   ├── globals.css
│   ├── page.tsx                     # Home (/)
│   ├── services/
│   │   ├── page.tsx                 # Services listing (/services)
│   │   └── [slug]/
│   │       └── page.tsx             # Service detail (/services/[slug])
│   ├── gallery/
│   │   └── page.tsx                 # Gallery (/gallery)
│   ├── pricing/
│   │   └── page.tsx                 # Pricing & Memberships (/pricing)
│   └── book/
│       └── page.tsx                 # Book Online (/book)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # Sticky nav, mobile drawer
│   │   └── Footer.tsx               # Links, socials, newsletter
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── GalleryPreview.tsx
│   │   ├── StatsSection.tsx
│   │   ├── PricingPreview.tsx
│   │   ├── CTASection.tsx
│   │   ├── FAQSection.tsx
│   │   └── ContactSection.tsx
│   ├── services/
│   │   ├── ServicesGrid.tsx
│   │   └── ServiceCard.tsx
│   ├── gallery/
│   │   ├── GalleryGrid.tsx
│   │   ├── GalleryFilter.tsx
│   │   └── Lightbox.tsx
│   ├── pricing/
│   │   ├── PriceTable.tsx
│   │   ├── MembershipCards.tsx
│   │   └── PricingComparison.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx          # Multi-step booking form
│   │   └── BookingSteps.tsx         # Step indicator UI
│   └── ui/
│       ├── SectionHeader.tsx        # Reusable label+heading+sub
│       ├── AnimatedCounter.tsx      # react-countup wrapper
│       ├── StarRating.tsx           # 5-star display
│       ├── WhatsAppFAB.tsx          # Floating WhatsApp button
│       └── BeforeAfterSlider.tsx    # Drag slider for gallery
│
├── lib/
│   ├── supabase.ts                  # Supabase client init
│   ├── animations.ts                # Framer Motion reusable variants
│   ├── actions/
│   │   ├── booking.ts               # Server action: save booking
│   │   └── contact.ts               # Server action: save message
│   └── data/
│       ├── services.ts              # 7 services with slugs
│       ├── team.ts                  # 7 stylists with bios
│       ├── testimonials.ts          # 4 client reviews
│       ├── pricing.ts               # Price table + 3 membership tiers
│       └── faqs.ts                  # 10 FAQ entries
│
├── public/
│   └── images/
│       ├── hero/                    # Hero background image
│       ├── services/                # One image per service
│       ├── gallery/                 # 12+ gallery photos
│       └── team/                    # Stylist avatar photos
│
├── docs/                            # ← All 6 .md spec files live here
│   ├── 01_PROJECT_OVERVIEW.md       # This file
│   ├── 02_DESIGN_SYSTEM.md
│   ├── 03_DATA_FILES.md
│   ├── 04_PAGES_HOME_SERVICES.md
│   ├── 05_PAGES_GALLERY_PRICING_BOOK.md
│   └── 06_BACKEND_DEPLOY.md
│
├── .env.local
├── tailwind.config.js
└── next.config.js
```

---

## 🔧 Environment Variables

```env
# .env.local — copy this and fill in your values

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_SITE_URL=https://yoursalon.com

# Salon contact info
NEXT_PUBLIC_SALON_NAME=Gretta Saloon
NEXT_PUBLIC_SALON_PHONE=+919876543210
NEXT_PUBLIC_SALON_EMAIL=hello@yoursalon.com
NEXT_PUBLIC_SALON_ADDRESS=Muthukulam, Kerala, India 686122
NEXT_PUBLIC_SALON_HOURS=Mon–Sat 9am–8pm, Sun 10am–6pm

# WhatsApp deep-link
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_WHATSAPP_MSG=Hi!+I'd+like+to+book+an+appointment+at+Gretta+Saloon.

# Social links
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yoursalon
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/yoursalon
```

---

## 📦 Install Commands

```bash
# 1. Create the Next.js project
npx create-next-app@14 saloon-website \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*"

# 2. Navigate into project
cd saloon-website

# 3. Install all required packages
npm install framer-motion
npm install react-countup
npm install swiper
npm install lucide-react
npm install @supabase/supabase-js
npm install resend
npm install clsx tailwind-merge

# 4. Copy .env.local and fill in values
# 5. Run dev server
npm run dev
```

---

## 🗺️ Page Map & Routes

| Page | Route | File | SEO Priority |
|---|---|---|---|
| Home | `/` | `app/page.tsx` | ⭐⭐⭐ Highest |
| Services | `/services` | `app/services/page.tsx` | ⭐⭐⭐ High |
| Service Detail | `/services/[slug]` | `app/services/[slug]/page.tsx` | ⭐⭐ Medium |
| Gallery | `/gallery` | `app/gallery/page.tsx` | ⭐⭐ Medium |
| Pricing | `/pricing` | `app/pricing/page.tsx` | ⭐⭐⭐ High |
| Book Online | `/book` | `app/book/page.tsx` | ⭐⭐⭐ Highest |

---

## 🌐 SEO Meta Tags (set per page)

```tsx
// Example: app/page.tsx
export const metadata = {
  title: 'Gretta Saloon | Premium Hair Saloon in Kerala',
  description: "Kerala's premier hair saloon for precision haircuts, balayage, bridal styling, and keratin treatments. Located in Muthukulam. Book online today.",
  keywords: 'hair saloon kerala, best saloon muthukulam, bridal hair kerala, balayage kerala, keratin treatment kerala',
  openGraph: {
    title: 'Gretta Saloon | Premium Hair Saloon in Kerala',
    description: 'Expert haircuts, coloring, bridal styling & treatments in Kerala.',
    url: 'https://yoursalon.com',
    type: 'website',
  },
}
```

---

## ✅ Build Checklist for Agent

- [ ] Initialize Next.js 14 project with TypeScript + Tailwind
- [ ] Install all dependencies from install commands above
- [ ] Set up `tailwind.config.js` (see `02_DESIGN_SYSTEM.md`)
- [ ] Set up `app/layout.tsx` with fonts, Navbar, Footer, WhatsApp FAB
- [ ] Create all data files in `lib/data/` (see `03_DATA_FILES.md`)
- [ ] Create `lib/animations.ts` with Framer Motion variants
- [ ] Build shared UI components (SectionHeader, StarRating, etc.)
- [ ] Build Navbar and Footer components
- [ ] Build Home page section by section (see `04_PAGES_HOME_SERVICES.md`)
- [ ] Build Services pages (see `04_PAGES_HOME_SERVICES.md`)
- [ ] Build Gallery, Pricing, Book Online pages (see `05_PAGES_GALLERY_PRICING_BOOK.md`)
- [ ] Set up Supabase and server actions (see `06_BACKEND_DEPLOY.md`)
- [ ] Deploy to Vercel (see `06_BACKEND_DEPLOY.md`)
