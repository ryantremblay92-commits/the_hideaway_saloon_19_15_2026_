# 🎨 02 — Design System
> **For AI Coding Agents:** Antigravity, Bolt, Lovable, v0, Cursor
> This is File 2 of 6. Read ALL 6 files before writing any code.
> Build order: 01 Setup → 02 Design System → 03 Data → 04 Home/Services → 05 Gallery/Pricing/Book → 06 Backend/Deploy

---

## 🎯 Brand Identity

### Mission Statement
*"Gretta Saloon is Kerala's premier destination for transformative hair experiences. We combine international techniques with personalized care to help every client discover their signature look."*

### Brand Voice
- **Tone:** Warm, professional, luxurious yet approachable
- **Personality:** Confident, detail-oriented, client-focused
- **Keywords:** Premium, Transformative, Personalized, Kerala's Best

---

## 🔧 Contact Information (from Relume Wireframe)

| Field | Value |
|---|---|
| **Business Name** | Gretta |
| **Email** | hello@gretta.in |
| **Phone** | +91 (484) 555-0147 |
| **Address** | Gretta salon, Kochi, Kerala 682001 India |
| **Tagline** | "We craft precision cuts and vibrant color in Kerala. Expert hands, honest work, beautiful results." |

---

## 📝 Key Copy (from Relume Wireframe)

### Hero Section
- **Heading:** "Transform your look at Gretta"
- **Subtitle:** "We craft precision cuts and vibrant color in Kerala. Expert hands, honest work, beautiful results."
- **CTA Buttons:** "Book now", "Button"

### Services Headlines
- **Section Title:** "What we offer"
- **Section Subtitle:** "Each service is tailored to your needs. We work with precision and care."
- **Services:** Haircuts, Hair color, Treatments, Bridal styling, Men's grooming, Makeup

### How It Works
- **Heading:** "Getting started is simple"
- **Subtitle:** "Three steps from now to your next look. We make booking easy and service seamless."
- **Steps:** Reserve → Browse services → Arrive prepared → Leave transformed

### Testimonials
- **Heading:** "What clients say"
- **Subtitle:** "Real people. Real transformations. Real satisfaction."

### Team
- **Heading:** "Meet our stylists"
- **Subtitle:** "Skilled hands behind every transformation at Gretta."

### Gallery
- **Heading:** "See the work"
- **Subtitle:** "Before and after. The proof is in the transformation."

### Stats
- **Heading:** "Numbers that matter. Years of trust, hundreds of satisfied clients, and counting."
- **Stats:** 2000+ Clients transformed, 12 Years in business, 98% Return rate

### Membership
- **Heading:** "Membership plans"
- **Subtitle:** "Pay for what you use. Loyalty gets you more."

### CTA
- **Heading:** "Ready for your next look?"
- **Subtitle:** "Book online now. Choose your service, pick your stylist, and we'll handle the rest."

### FAQ
- **Heading:** "Questions"
- **Subtitle:** "What you need to know about booking, services, and memberships at Gretta."

### Contact
- **Heading:** "Find us"
- **Subtitle:** "We're in Kerala. Easy to reach, worth the trip." |

---

## 🖌️ Color Palette

### Primary Colors

| Color Name | Hex Code | Usage |
|---|---|---|
| **Champagne Gold** | `#C9A962` | Primary buttons, highlights, icons, accents |
| **Deep Charcoal** | `#1A1A1A` | Headings, primary text, footer |
| **Rich Ivory** | `#FAF8F5` | Background, cards, sections |
| **Warm White** | `#FFFEF9` | Light backgrounds, nav |

### Secondary Colors

| Color Name | Hex Code | Usage |
|---|---|---|
| **Soft Sage** | `#8B9A7D` | Success states, eco-badges, secondary accents |
| **Muted Rose** | `#C4A4A4` | Subtle highlights, hover states |
| **Slate** | `#4A4A4A` | Body text, secondary headings |
| **Pearl** | `#E8E4DF` | Borders, dividers, subtle backgrounds |

### Semantic Colors

| Color Name | Hex Code | Usage |
|---|---|---|
| **Success** | `#4A7C59` | Confirmation, success messages |
| **Error** | `#C45C5C` | Validation errors |
| **Warning** | `#D4A84B` | Alerts, warnings |

---

## 🔤 Typography

### Font Families

| Font | Role | Source | Usage |
|---|---|---|---|
| **Fraunces** | Headings | Google Fonts (Variable) | H1, H2, H3, display text |
| **Inter** | Body | Google Fonts | Paragraphs, UI, navigation |

### Font Weights

| Weight | Value | Usage |
|---|---|---|
| Regular | 400 | Body text |
| Medium | 500 | Subheadings, emphasis |
| SemiBold | 600 | Buttons, navigation |
| Bold | 700 | Primary headings |

### Font Sizes (Responsive)

| Token | Mobile | Tablet | Desktop | Usage |
|---|---|---|---|---|
| `text-xs` | 12px | 12px | 12px | Labels, captions |
| `text-sm` | 14px | 14px | 14px | Small body, meta |
| `text-base` | 16px | 16px | 16px | Body text |
| `text-lg` | 18px | 18px | 18px | Large body |
| `text-xl` | 20px | 20px | 20px | Subheadings |
| `text-2xl` | 24px | 24px | 24px | H4, card titles |
| `text-3xl` | 30px | 30px | 30px | H3 |
| `text-4xl` | 36px | 36px | 36px | H2 |
| `text-5xl` | 42px | 48px | 56px | H1, hero |
| `text-6xl` | 48px | 56px | 64px | Hero display |

### Line Heights

| Token | Value | Usage |
|---|---|---|
| `leading-tight` | 1.2 | Headings |
| `leading-normal` | 1.5 | Body text |
| `leading-relaxed` | 1.75 | Long-form content |

---

## 📐 Spacing System

### Base Scale (4px increments)

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Icon gaps |
| `space-3` | 12px | Component internal |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Section internal |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-10` | 40px | Large gaps |
| `space-12` | 48px | Section padding |
| `space-16` | 64px | Hero spacing |
| `space-20` | 80px | Large sections |
| `space-24` | 96px | XL sections |

---

## 🎛️ Component Tokens

### Buttons

```tsx
// Primary Button
{
  background: '#C9A962',
  color: '#1A1A1A',
  hoverBackground: '#B8944F',
  borderRadius: '8px',
  fontWeight: '600',
  padding: '12px 24px',
  transition: 'all 0.2s ease'
}

// Secondary Button
{
  background: 'transparent',
  color: '#1A1A1A',
  border: '2px solid #C9A962',
  borderRadius: '8px',
  fontWeight: '600',
  padding: '12px 24px',
  hoverBackground: '#C9A962',
  hoverColor: '#1A1A1A',
  transition: 'all 0.2s ease'
}

// Ghost Button
{
  background: 'transparent',
  color: '#C9A962',
  fontWeight: '500',
  padding: '8px 16px',
  hoverBackground: '#FAF8F5',
  transition: 'all 0.2s ease'
}
```

### Cards

```tsx
{
  background: '#FFFEF9',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid #E8E4DF',
  shadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
  hoverShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  hoverTransform: 'translateY(-4px)',
  transition: 'all 0.3s ease'
}
```

### Inputs

```tsx
{
  background: '#FFFEF9',
  border: '1px solid #E8E4DF',
  borderRadius: '8px',
  padding: '12px 16px',
  focusBorder: '#C9A962',
  focusRing: '2px solid rgba(201, 169, 98, 0.2)',
  placeholderColor: '#4A4A4A',
  transition: 'all 0.2s ease'
}
```

### Badges

```tsx
{
  // Gold Badge
  {
    background: 'rgba(201, 169, 98, 0.1)',
    color: '#C9A962',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600'
  }
}
```

---

## ✨ Animation Tokens

### Durations

| Token | Value | Usage |
|---|---|---|
| `duration-fast` | 150ms | Micro-interactions |
| `duration-normal` | 200ms | Buttons, hovers |
| `duration-slow` | 300ms | Section reveals |
| `duration-slower` | 500ms | Hero animations |

### Easing

| Token | Value | Usage |
|---|---|---|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entering |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exiting |
| `ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Bounce |

### Animation Variants (Framer Motion)

```tsx
// lib/animations.ts

// Fade In Up
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

// Fade In Down
export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

// Fade In
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

// Scale In
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};

// Stagger Children
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Slide In Left
export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

// Slide In Right
export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

// Viewport animation (triggers when in view)
export const viewportOptions = {
  once: true,
  margin: '-100px'
};
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Target |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Container Max Widths

| Container | Max Width | Padding |
|---|---|---|
| Default | 1280px | 24px |
| Narrow | 960px | 24px |
| Wide | 1440px | 24px |

---

## 🧩 Layout Patterns

### Section Spacing

| Section | Padding (Desktop) | Padding (Mobile) |
|---|---|---|
| Standard | `py-20` (80px) | `py-12` (48px) |
| Hero | `py-24` (96px) | `py-16` (64px) |
| Compact | `py-12` (48px) | `py-8` (32px) |

### Grid Layouts

| Grid | Columns (Desktop) | Columns (Tablet) | Columns (Mobile) |
|---|---|---|---|
| Services | 4 | 2 | 1 |
| Gallery | 4 | 3 | 2 |
| Team | 4 | 2 | 1 |
| Testimonials | 3 | 2 | 1 |
| Pricing | 3 | 1 | 1 |

---

## 🌙 Dark Mode (Future)

> **Note:** Dark mode not included in v1. Reserved for v2.

```tsx
// Future tokens for dark mode
{
  dark: {
    background: '#1A1A1A',
    surface: '#252525',
    text: '#FAF8F5',
    textMuted: '#A0A0A0',
    border: '#333333'
  }
}
```

---

## ♿ Accessibility

### Color Contrast Ratios

| Usage | Minimum Ratio | WCAG Level |
|---|---|---|
| Normal Text | 4.5:1 | AA |
| Large Text (18px+) | 3:1 | AA |
| UI Components | 3:1 | AA |

### Focus States

```tsx
{
  focusRing: '2px solid #C9A962',
  focusOffset: '2px'
}
```

### Skip Links
- Include "Skip to main content" link
- Visible on focus, hidden otherwise

---

## 🔧 Navbar Component

### Desktop (lg+)

```tsx
// Position: Fixed top, full width
// Height: 80px
// Background: #FFFEF9 (with blur when scrolled)
// Logo: Left-aligned
// Nav Links: Center-aligned, horizontal
// CTA Button: Right-aligned

<nav className="fixed top-0 w-full h-20 bg-[#FFFEF9]/90 backdrop-blur-md z-50">
  <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="font-fraunces text-2xl font-bold text-[#1A1A1A]">
      Gretta Saloon
    </Link>
    
    {/* Nav Links */}
    <div className="hidden lg:flex items-center gap-8">
      <Link href="/">Home</Link>
      <Link href="/services">Services</Link>
      <Link href="/gallery">Gallery</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href="/book" className="btn-primary">Book Now</Link>
    </div>
    
    {/* Mobile Menu Button */}
    <button className="lg:hidden">
      <MenuIcon />
    </button>
  </div>
</nav>
```

### Mobile (< lg)

```tsx
// Slide-in drawer from right
// Width: 100% of viewport
// Background: #FFFEF9
// Full-height nav links with spacing
// Close button in top-right

<Drawer>
  <div className="flex flex-col p-6">
    <Link href="/" className="py-3">Home</Link>
    <Link href="/services" className="py-3">Services</Link>
    <Link href="/gallery" className="py-3">Gallery</Link>
    <Link href="/pricing" className="py-3">Pricing</Link>
    <Link href="/book" className="btn-primary mt-4">Book Now</Link>
  </div>
</Drawer>
```

### Navbar Scroll Behavior

```tsx
// When scrolled > 50px:
{
  background: 'rgba(255, 254, 249, 0.98)',
  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)'
}
```

---

## 🔚 Footer Component

### Layout (4-column grid on desktop)

```tsx
<footer className="bg-[#1A1A1A] text-white py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      
      {/* Column 1: Brand */}
      <div>
        <h3 className="font-fraunces text-2xl mb-4">Gretta Saloon</h3>
        <p className="text-gray-400 mb-6">
          Kerala's premier destination for transformative hair experiences.
        </p>
        <div className="flex gap-4">
          <SocialIcon instagram />
          <SocialIcon facebook />
        </div>
      </div>
      
      {/* Column 2: Quick Links */}
      <div>
        <h4 className="font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/book">Book Online</Link></li>
        </ul>
      </div>
      
      {/* Column 3: Contact */}
      <div>
        <h4 className="font-semibold mb-4">Contact</h4>
        <ul className="space-y-2 text-gray-400">
          <li>Muthukulam, Kerala 686122</li>
          <li>+91 98765 43210</li>
          <li>hello@grettasaloon.com</li>
        </ul>
      </div>
      
      {/* Column 4: Newsletter */}
      <div>
        <h4 className="font-semibold mb-4">Newsletter</h4>
        <p className="text-gray-400 mb-4">Get updates on new styles and offers.</p>
        <NewsletterForm />
      </div>
      
    </div>
    
    {/* Bottom Bar */}
    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
      © 2024 Gretta Saloon. All rights reserved.
    </div>
  </div>
</footer>
```

---

## 💬 WhatsApp Floating Button (FAB)

```tsx
// Fixed position: bottom-right
// Size: 56px x 56px
// Background: #25D366 (WhatsApp green)
// Icon: WhatsApp logo (white)
// Shadow: prominent
// Animation: subtle pulse on load

<Fixed position="bottom-6 right-6">
  <a 
    href="https://wa.me/919876543210?text=Hi!+I'd+like+to+book+an+appointment"
    className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    aria-label="Chat on WhatsApp"
  >
    <WhatsAppIcon className="w-7 h-7 text-white" />
  </a>
</Fixed>
```

---

## ✅ Design System Checklist

- [ ] Fraunces + Inter fonts loaded in `layout.tsx`
- [ ] Tailwind config updated with custom colors
- [ ] Button components created (primary, secondary, ghost)
- [ ] Card component with hover states
- [ ] Input component with focus states
- [ ] Animation variants in `lib/animations.ts`
- [ ] Navbar with scroll behavior
- [ ] Mobile drawer navigation
- [ ] Footer with 4-column layout
- [ ] WhatsApp FAB component
- [ ] Responsive breakpoints tested
- [ ] Accessibility focus states added
