# 📦 03 — Data Files
> **Relume Reference URLs (publicly accessible):**
> - Sitemap:     https://www.relume.io/app/project/P3127528_nWa_X_Pnu0bm1Tq_82DGe1ZnAQoW-3NzVt8LxNMKqxs#mode=sitemap
> - Wireframe:   https://www.relume.io/app/project/P3127528_nWa_X_Pnu0bm1Tq_82DGe1ZnAQoW-3NzVt8LxNMKqxs#mode=wireframe
> - Style Guide: https://www.relume.io/app/project/P3127528_nWa_X_Pnu0bm1Tq_82DGe1ZnAQoW-3NzVt8LxNMKqxs#mode=styleguide&concept=4H8Aintxv0AMZSCzC2jsxT
>
> All data below was extracted directly from the Relume wireframe & style guide live preview.
> Create all files inside `lib/data/`. Import them into components as needed.

---

## 📄 `lib/data/services.ts`

```ts
export interface Service {
  slug:          string
  title:         string
  icon:          string        // Lucide icon name
  shortDesc:     string        // 1-line — used on cards
  longDesc:      string        // 2-3 sentences — used on detail page
  subServices:   string[]      // bullet list on detail page
  image:         string        // Unsplash URL
  startingPrice: number        // in ₹
  duration:      string        // e.g. "45–60 mins"
  tag?:          string        // optional badge e.g. "Most Popular"
}

export const services: Service[] = [
  {
    slug:          'haircuts-styling',
    title:         'Haircuts & Styling',
    icon:          'Scissors',
    shortDesc:     'Clean lines and sharp edges. We listen to what you want and deliver it.',
    longDesc:      'Each cut is designed to work with your natural texture and grow out beautifully. We consult before we touch the scissors. No surprises — just the result you came for.',
    subServices:   ['Ladies Haircut', 'Gents Haircut', 'Kids Haircut', 'Blow Dry', 'Hair Setting', 'Trim & Shape'],
    image:         'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    startingPrice: 350,
    duration:      '30–60 mins',
    tag:           'Most Popular',
  },
  {
    slug:          'hair-coloring',
    title:         'Hair Color',
    icon:          'Palette',
    shortDesc:     'Balayage, highlights, global color, and correction. Vibrant. Lasting. Precise.',
    longDesc:      'From subtle sun-kissed balayage to bold full-color transformations. We use professional-grade products that protect while they color. Every shade is mixed to suit your skin tone.',
    subServices:   ['Global Color', 'Balayage', 'Highlights', 'Ombre', 'Color Correction', 'Toning & Gloss'],
    image:         'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    startingPrice: 1200,
    duration:      '90–180 mins',
    tag:           'Trending',
  },
  {
    slug:          'hair-treatments',
    title:         'Treatments',
    icon:          'Sparkles',
    shortDesc:     'Keratin, spa, restoration. We rebuild what time and heat have worn down.',
    longDesc:      'Every treatment is customized to your hair\'s current condition and goal. We assess before we apply. The result is hair that looks and feels better than it has in years.',
    subServices:   ['Hair Spa', 'Keratin Treatment', 'Smoothening', 'Deep Conditioning', 'Scalp Treatment', 'Aromatherapy'],
    image:         'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80',
    startingPrice: 800,
    duration:      '60–120 mins',
  },
  {
    slug:          'bridal-styling',
    title:         'Bridal Styling',
    icon:          'Crown',
    shortDesc:     'She builds styles that hold through dancing and photographs.',
    longDesc:      'Your wedding day gets the full attention it deserves, from trial to the big day. We build styles that hold through celebration, photography, and everything in between.',
    subServices:   ['Bridal Hair', 'Bridal Makeup', 'Pre-Bridal Package', 'Trial Session', 'Party Makeup', 'Saree Draping'],
    image:         'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    startingPrice: 8000,
    duration:      '3–6 hours',
    tag:           'Premium',
  },
  {
    slug:          'mens-grooming',
    title:         "Men's Grooming",
    icon:          'Zap',
    shortDesc:     'Beards and cuts handled with equal precision. Clean, sharp, confident.',
    longDesc:      'That\'s the standard here. No compromise on technique. Whether it\'s a fade, a beard shape-up, or a full grooming session — we handle it with skill.',
    subServices:   ['Haircut', 'Beard Trim', 'Beard Styling', 'Clean Shave', 'Scalp Treatment', 'Hair Color (Men)'],
    image:         'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    startingPrice: 250,
    duration:      '30–45 mins',
  },
  {
    slug:          'makeup',
    title:         'Makeup',
    icon:          'Wand2',
    shortDesc:     'Color and technique that enhance what you have.',
    longDesc:      'We make you look like yourself — only better. Available for all events and occasions, from casual parties to full bridal looks. We use only professional-grade products.',
    subServices:   ['Party Makeup', 'Bridal Makeup', 'Engagement Makeup', 'Photoshoot Makeup', 'Airbrush Makeup', 'HD Makeup'],
    image:         'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80',
    startingPrice: 1500,
    duration:      '60–90 mins',
  },
  {
    slug:          'nail-care',
    title:         'Nail Care',
    icon:          'Hand',
    shortDesc:     'Finished hands complete the picture. Precision in every application.',
    longDesc:      'Quality products and skilled technicians in every session. We do nails that last, look flawless, and feel professional. From simple manicures to elaborate nail art.',
    subServices:   ['Basic Manicure', 'Gel Manicure', 'Basic Pedicure', 'Spa Pedicure', 'Nail Art', 'Gel Extensions', 'Nail Repair'],
    image:         'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
    startingPrice: 400,
    duration:      '45–90 mins',
  },
]

// Helper — get service by slug
export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find(s => s.slug === slug)
```

---

## 📄 `lib/data/team.ts`

```ts
export interface TeamMember {
  id:        number
  name:      string
  role:      string
  specialty: string
  bio:       string
  years:     number
  image:     string    // Unsplash avatar URL
  instagram?: string
}

export const team: TeamMember[] = [
  {
    id:        1,
    name:      'Priya Nair',
    role:      'Color Specialist',
    specialty: 'Balayage & Highlights',
    bio:       'Fifteen years perfecting balayage and highlights. She sees dimension where others see flat.',
    years:     15,
    image:     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    instagram: '#',
  },
  {
    id:        2,
    name:      'Arjun Menon',
    role:      'Precision Cuts',
    specialty: 'Haircuts & Fades',
    bio:       'Sharp lines and sharper instincts. He listens first, cuts second, and the results speak.',
    years:     10,
    image:     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    instagram: '#',
  },
  {
    id:        3,
    name:      'Divya Sharma',
    role:      'Bridal Artistry',
    specialty: 'Bridal Hair & Makeup',
    bio:       'She builds styles that hold through dancing and photographs. Your day gets the attention it deserves.',
    years:     8,
    image:     'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    instagram: '#',
  },
  {
    id:        4,
    name:      'Vikram Das',
    role:      "Men's Grooming",
    specialty: 'Cuts & Beard Styling',
    bio:       'Beards and cuts handled with equal precision. Clean, sharp, confident. That\'s the standard here.',
    years:     7,
    image:     'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    instagram: '#',
  },
  {
    id:        5,
    name:      'Anjali Krishnan',
    role:      'Hair Treatments',
    specialty: 'Keratin & Hair Spa',
    bio:       'Keratin, spa, restoration. She rebuilds what time and heat have worn down to nothing.',
    years:     6,
    image:     'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
    instagram: '#',
  },
  {
    id:        6,
    name:      'Rohan Patel',
    role:      'Makeup Artist',
    specialty: 'Makeup & Styling',
    bio:       'Color and technique that enhance what you have. He makes you look like yourself, only better.',
    years:     5,
    image:     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    instagram: '#',
  },
  {
    id:        7,
    name:      'Sneha Iyer',
    role:      'Nail Care',
    specialty: 'Gel Nails & Nail Art',
    bio:       'Finished hands complete the picture. Precision and quality products in every application.',
    years:     4,
    image:     'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    instagram: '#',
  },
]
```

---

## 📄 `lib/data/testimonials.ts`

```ts
export interface Testimonial {
  stars: number
  quote: string
  name:  string
  role:  string
  image?: string
}

export const testimonials: Testimonial[] = [
  {
    stars: 5,
    quote: 'Priya understood exactly what I wanted before I could fully explain it. The cut is sharp, the color is perfect, and it\'s held up beautifully.',
    name:  'Anjali Menon',
    role:  'Marketing Professional',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    stars: 5,
    quote: 'My wedding day hair was flawless. They didn\'t just style it, they made me feel confident walking down the aisle.',
    name:  'Divya Kumar',
    role:  'Bride',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
  },
  {
    stars: 5,
    quote: 'I\'ve tried everywhere. The keratin treatment here actually works and doesn\'t damage my hair. I\'m a regular now.',
    name:  'Ravi Shankar',
    role:  'Business Owner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    stars: 5,
    quote: 'Best balayage in Kerala. The team really listened to what I wanted and delivered exactly that.',
    name:  'Meera Pillai',
    role:  'Regular Client',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80',
  },
]
```

---

## 📄 `lib/data/pricing.ts`

```ts
export interface PriceItem {
  name:  string
  price: number       // in ₹
  note?: string       // e.g. "per session" or "starting from"
}

export interface PriceCategory {
  category: string
  items:    PriceItem[]
}

export const pricingTable: PriceCategory[] = [
  {
    category: 'Haircuts',
    items: [
      { name: 'Ladies Haircut',         price: 350  },
      { name: 'Gents Haircut',          price: 250  },
      { name: 'Kids Haircut',           price: 200  },
      { name: 'Blow Dry',               price: 300  },
      { name: 'Hair Setting',           price: 400  },
    ],
  },
  {
    category: 'Hair Coloring',
    items: [
      { name: 'Global Color',           price: 1200,  note: 'starting from' },
      { name: 'Highlights',             price: 1800,  note: 'starting from' },
      { name: 'Balayage',               price: 2500,  note: 'starting from' },
      { name: 'Ombre',                  price: 2000,  note: 'starting from' },
      { name: 'Color Correction',       price: 3500,  note: 'starting from' },
      { name: 'Toning & Gloss',         price: 800   },
    ],
  },
  {
    category: 'Treatments',
    items: [
      { name: 'Hair Spa',               price: 800  },
      { name: 'Keratin Treatment',      price: 3500, note: 'starting from' },
      { name: 'Smoothening',            price: 4000, note: 'starting from' },
      { name: 'Deep Conditioning',      price: 600  },
      { name: 'Scalp Treatment',        price: 900  },
      { name: 'Aromatherapy',           price: 700  },
    ],
  },
  {
    category: "Men's Grooming",
    items: [
      { name: 'Haircut',                price: 250  },
      { name: 'Beard Trim',             price: 150  },
      { name: 'Beard Styling',          price: 200  },
      { name: 'Clean Shave',            price: 180  },
      { name: 'Scalp Treatment (Men)',  price: 600  },
      { name: 'Hair Color (Men)',       price: 800, note: 'starting from' },
    ],
  },
  {
    category: 'Makeup',
    items: [
      { name: 'Party Makeup',           price: 1500 },
      { name: 'Engagement Makeup',      price: 2500 },
      { name: 'Bridal Makeup',          price: 5000, note: 'starting from' },
      { name: 'Airbrush Makeup',        price: 3500 },
      { name: 'HD Makeup',              price: 4000 },
    ],
  },
  {
    category: 'Nail Care',
    items: [
      { name: 'Basic Manicure',         price: 400  },
      { name: 'Gel Manicure',           price: 700  },
      { name: 'Basic Pedicure',         price: 500  },
      { name: 'Spa Pedicure',           price: 900  },
      { name: 'Nail Art',               price: 300, note: 'per nail design' },
      { name: 'Gel Extensions',         price: 1200 },
      { name: 'Nail Repair',            price: 200  },
    ],
  },
  {
    category: 'Bridal Packages',
    items: [
      { name: 'Basic Bridal',           price: 8000,  note: 'hair + makeup' },
      { name: 'Premium Bridal',         price: 15000, note: 'hair + makeup + nails' },
      { name: 'Full Day Bridal',        price: 22000, note: 'all day + trial session' },
    ],
  },
]

// ─── Membership Tiers ───────────────────────────────────────────

export interface Membership {
  tier:     string
  subtitle: string
  price:    number
  period:   string
  popular:  boolean
  features: string[]
  cta:      string
}

export const memberships: Membership[] = [
  {
    tier:     'Single Visit',
    subtitle: 'One service',
    price:    1500,
    period:   'per appointment',
    popular:  false,
    features: [
      'One haircut or color service',
      'Consultation included',
      'Expert stylist assigned',
      'No commitment required',
    ],
    cta: 'Book Now',
  },
  {
    tier:     'Monthly Membership',
    subtitle: 'Unlimited visits',
    price:    4500,
    period:   'per month',
    popular:  true,
    features: [
      'Two services monthly',
      'Priority booking',
      '15% discount on all services',
      'Guest privileges',
      'Free treatment quarterly',
      'WhatsApp stylist access',
    ],
    cta: 'Join Monthly',
  },
  {
    tier:     'Annual Membership',
    subtitle: 'Best value',
    price:    45000,
    period:   'per year',
    popular:  false,
    features: [
      'Unlimited services all year',
      '25% discount always',
      'Priority + weekend slots',
      'Free bridal trial session',
      'Birthday special treatment',
      'Dedicated personal stylist',
      'Free monthly deep conditioning',
    ],
    cta: 'Join Annual',
  },
]
```

---

## 📄 `lib/data/faqs.ts`

```ts
export interface FAQ {
  question: string
  answer:   string
  category?: 'general' | 'booking' | 'membership' | 'services'
}

export const faqs: FAQ[] = [
  {
    question: 'How do I book an appointment?',
    answer:   'Use our online booking system on the Book Online page. Select your service, choose your stylist, and pick a time that works. You\'ll get a confirmation and reminder. Simple as that.',
    category: 'booking',
  },
  {
    question: 'Can I request a specific stylist?',
    answer:   'Yes. Each stylist has a specialty and a portfolio. Browse their work on our Team page and request them when you book. If they\'re available, they\'re yours.',
    category: 'booking',
  },
  {
    question: 'What\'s included in a consultation?',
    answer:   'We talk about what you want, what your hair can do, and what will work best for your lifestyle. No surprises. Just honest conversation before we start.',
    category: 'general',
  },
  {
    question: 'How long do results typically last?',
    answer:   'Haircuts hold their shape for four to six weeks. Color lasts six to eight weeks depending on the service. Treatments vary. We\'ll tell you exactly what to expect.',
    category: 'services',
  },
  {
    question: 'Do you offer touch-up appointments?',
    answer:   'We do. Book a touch-up at a reduced rate within the recommended timeframe. Members get priority scheduling for touch-ups.',
    category: 'services',
  },
  {
    question: 'What\'s the difference between memberships?',
    answer:   'Single visits work for occasional clients. Monthly memberships give you two services, priority booking, and discounts. Annual memberships offer the best value for regular clients.',
    category: 'membership',
  },
  {
    question: 'Can I transfer my membership?',
    answer:   'Memberships are personal to you. They can\'t be transferred, but you can gift a membership to someone else as a present.',
    category: 'membership',
  },
  {
    question: 'What if I need to cancel or reschedule?',
    answer:   'Cancel or reschedule up to 24 hours before your appointment with no penalty. Less notice and you\'ll forfeit the booking fee. We understand life happens.',
    category: 'booking',
  },
  {
    question: 'Do you use quality products?',
    answer:   'Only the best. We use professional-grade products that work. No shortcuts. Your hair deserves better than drugstore solutions.',
    category: 'general',
  },
  {
    question: 'Are you open on weekends?',
    answer:   'Yes. We\'re open Saturday and Sunday. Weekday hours are flexible too. Check the Contact page for our full schedule.',
    category: 'general',
  },
]

// Helper — filter FAQs by category
export const getFAQsByCategory = (cat: FAQ['category']) =>
  faqs.filter(f => f.category === cat)
```

---

## 📄 `lib/data/gallery.ts`

```ts
export interface GalleryImage {
  id:       number
  src:      string
  alt:      string
  category: 'all' | 'haircut' | 'color' | 'bridal' | 'mens' | 'treatment'
  before?:  string    // optional before image for slider
}

export const galleryImages: GalleryImage[] = [
  { id: 1,  src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', alt: 'Precision haircut transformation', category: 'haircut' },
  { id: 2,  src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', alt: 'Balayage color result', category: 'color', before: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80' },
  { id: 3,  src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'Bridal updo styling', category: 'bridal' },
  { id: 4,  src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', alt: 'Men\'s fade haircut', category: 'mens' },
  { id: 5,  src: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80', alt: 'Hair spa treatment', category: 'treatment' },
  { id: 6,  src: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80', alt: 'Highlights color work', category: 'color', before: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80' },
  { id: 7,  src: 'https://images.unsplash.com/photo-1590159763121-7c9fd312190e?w=600&q=80', alt: 'Bob haircut styling', category: 'haircut' },
  { id: 8,  src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', alt: 'Bridal hair and makeup', category: 'bridal', before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80' },
  { id: 9,  src: 'https://images.unsplash.com/photo-1493256338651-d82f7a7e638?w=600&q=80', alt: 'Ombre color result', category: 'color' },
  { id: 10, src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80', alt: 'Beard styling and trim', category: 'mens' },
  { id: 11, src: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80', alt: 'Keratin treatment result', category: 'treatment' },
  { id: 12, src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', alt: 'Layered haircut', category: 'haircut' },
]

// Gallery filter tabs
export const galleryFilters = [
  { label: 'All',       value: 'all'       },
  { label: 'Haircuts',  value: 'haircut'   },
  { label: 'Color',     value: 'color'     },
  { label: 'Bridal',    value: 'bridal'    },
  { label: "Men's",     value: 'mens'      },
  { label: 'Treatment', value: 'treatment' },
]

// Before/after pairs (3 featured for BeforeAfterSlider)
export const beforeAfterPairs = galleryImages.filter(img => img.before)
```

---

## 📄 `lib/data/stats.ts`

```ts
export const stats = [
  { end: 2000, suffix: '+', label: 'Clients Transformed',  sublabel: 'and counting' },
  { end: 7,    suffix: '',  label: 'Expert Stylists',       sublabel: 'specialists on team' },
  { end: 12,   suffix: '',  label: 'Years in Business',     sublabel: 'in Kerala' },
  { end: 98,   suffix: '%', label: 'Return Rate',           sublabel: 'clients come back' },
]
```

---

## ✅ Data Files Checklist

- [ ] `lib/data/services.ts` — 7 services with slugs, icons, descriptions, prices
- [ ] `lib/data/team.ts` — 7 stylists with bios, roles, Unsplash photos
- [ ] `lib/data/testimonials.ts` — 4 real client reviews from wireframe
- [ ] `lib/data/pricing.ts` — full price table (7 categories) + 3 membership tiers
- [ ] `lib/data/faqs.ts` — 10 FAQs with categories, all answers from Relume wireframe
- [ ] `lib/data/gallery.ts` — 12 gallery images with filter categories + 3 before/after pairs
- [ ] `lib/data/stats.ts` — 4 animated counter stats
