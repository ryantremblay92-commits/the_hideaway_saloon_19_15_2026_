# Modern Glamour Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate The Hideaway Saloon's digital presence to a "Modern Glamour" aesthetic with cinematic visuals and high-converting interactions.

**Architecture:** We will transition the site to a high-contrast dark theme (Onyx & Gold), implement glassmorphic UI components, and integrate cinematic media handling. The layout will be restructured to follow the "Concierge Ritual" flow.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS (v3/v4), Framer Motion, Lucide React.

---

### Task 1: Initialize Modern Glamour Design Tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: Update Tailwind Config with new color tokens and gradients**
Add `charcoal-premium`, `gold-gradient`, and custom shadow/blur utilities.

**Step 2: Update Globals CSS**
Set default background to dark charcoal and define glassmorphism utilities.

**Step 3: Commit**
```bash
git add tailwind.config.ts app/globals.css
git commit -m "design: initialize modern glamour design tokens"
```

### Task 2: Cinematic Hero Rebuild

**Files:**
- Modify: `components/sections/Hero.tsx`
- Modify: `lib/data/services.ts`

**Step 1: Implement Full-Bleed Media Wall**
Replace the grid layout with a centered cinematic headline over an immersive background.

**Step 2: Apply "Vogue" Typography**
Use thin-weight large serifs and negative letter spacing.

**Step 3: Update Brand Copy**
Update "Gretta Saloon" to "The Hideaway – Hair & Beauty Salon" and include the new tagline.

**Step 4: Commit**
```bash
git add components/sections/Hero.tsx
git commit -m "feat: implement cinematic hero with updated branding"
```

### Task 3: Floating "Slay Bar" Concierge Component

**Files:**
- Create: `components/ui/FloatingBookingBar.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create the Glassmorphic Pill**
Implement a fixed bottom bar with `backdrop-blur` and gold accents.

**Step 2: Add Shimmer Effect**
Add a CSS-based shimmer animation that triggers on hover or scroll.

**Step 3: Inject into Layout**
Ensure the bar is visible across all landing sections.

**Step 4: Commit**
```bash
git add components/ui/FloatingBookingBar.tsx app/layout.tsx
git commit -m "feat: add glassmorphic floating concierge bar"
```

### Task 4: "The Hideaway Rituals" (Services Upgrade)

**Files:**
- Modify: `components/sections/ServiceHighlight.tsx`
- Modify: `lib/data/services.ts`

**Step 1: Update Service Naming & Category Tabs**
Rename classes to "Rituals" and update icons to match focus.

**Step 2: Implement Spotlight Effect**
Use Framer Motion to create a hover state where non-hovered services dim.

**Step 3: Commit**
```bash
git add components/sections/ServiceHighlight.tsx lib/data/services.ts
git commit -m "feat: upgrade services to The Hideaway Rituals with spotlight effect"
```

### Task 5: Interactive Reveal Gallery

**Files:**
- Modify: `components/sections/GalleryPreview.tsx`
- Create: `components/gallery/BeforeAfterSlider.tsx`

**Step 1: Create Comparison Slider Component**
Build a draggable vertical handle that overlays Before/After images.

**Step 2: Update Gallery Preview with Bento Grid**
Refactor the grid into a sophisticated uneven gallery.

**Step 3: Commit**
```bash
git add components/sections/GalleryPreview.tsx components/gallery/BeforeAfterSlider.tsx
git commit -m "feat: implement interactive before-after reveal gallery"
```

### Task 6: Hyper-Local Footer & Brand Finalization

**Files:**
- Modify: `components/layout/Footer.tsx`
- Modify: `app/contact/page.tsx`

**Step 1: Update Location Details**
Update all instances of address to "La Plage, 403 Jumeirah Beach Road, Al Athar Street, Jumeirah 2, Dubai, UAE".

**Step 2: Style Map with Dark Mode**
Use a custom Google Maps style or Mapbox style that matches the Onyx theme.

**Step 3: Update Social Links**
Link to `@thehideawaydubai` and update WhatsApp integration.

**Step 4: Commit**
```bash
git add components/layout/Footer.tsx app/contact/page.tsx
git commit -m "feat: finalize local branding and footer"
```
