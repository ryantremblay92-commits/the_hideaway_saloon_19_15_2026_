# Elegancia Unisex Salon - Website Features Documentation

## Overview

Elegancia Unisex Salon is a premium hair and beauty salon website built with Next.js 14, featuring a modern dark-gold aesthetic design. The website serves as a digital hub for customer acquisition, booking management, and loyalty program administration.

**Brand Details:**
- **Business Name:** Elegancia Unisex Salon
- **Location:** Kerala, India
- **Design Theme:** Elegant Luxury (Primary Gold #C9A962, Deep Charcoal #0A0A0B, Rich Ivory)
- **Website:** Modern dark theme with gold accents

---

## 1. Public Website Features

### 1.1 Home Page (`/`)
The home page serves as the main entry point with the following sections:

- **Hero Section** - Full-screen welcome with salon branding, tagline, and CTA buttons
- **Stats Section** - Animated counters showing salon achievements (years in business, happy clients, etc.)
- **Service Highlights** - Featured services with icons and brief descriptions
- **Gallery Preview** - Curated image showcase with lightbox functionality
- **Team Section** - Stylist profiles with photos and specialties
- **Testimonials** - Customer reviews in a carousel slider
- **Call to Action** - Promotional section encouraging bookings
- **FAQ Section** - Common questions with accordion answers

### 1.2 Services Pages (`/services` & `/services/[slug]`)

**Services Listing:**
- Grid display of all available services
- Category filtering (Hair, Bridal, Beauty, etc.)
- Search functionality
- Service cards with:
  - Icon representation
  - Service name
  - Short description
  - Starting price
  - Duration
  - "Book Now" CTA

**Service Detail Pages:**
- Large hero image
- Full service description
- Sub-services list
- Pricing information
- Duration estimates
- Related services
- Booking integration

**Service Categories:**
- Haircuts & Styling
- Hair Color & Highlights
- Hair Treatments (Keratin, Spa, Restoration)
- Bridal Styling
- Men's Grooming
- Beauty Services

### 1.3 Gallery (`/gallery`)

- **Grid Layout** - Responsive masonry-style image gallery
- **Category Filtering** - Filter by service type
- **Lightbox Viewer** - Full-screen image viewing with navigation
- **Before/After Slider** - Interactive comparison tool for transformations
- **Lazy Loading** - Performance-optimized image loading

### 1.4 Pricing (`/pricing`)

- **Service Price List** - Detailed pricing for all services
- **Membership Packages** - Premium membership tiers with benefits
- **Price Comparison Table** - Feature comparison for packages
- **Special Offers** - Current promotions and discounts

### 1.5 Booking (`/book`)

**Multi-Step Booking Form:**
1. **Service Selection** - Choose from available services
2. **Stylist Selection** - Choose preferred stylist
3. **Date & Time** - Select preferred date and time slot
4. **Details** - Enter contact information and special requests
5. **Confirmation** - Review and confirm booking
6. **Payment** - Option to pay via UPI (optional)

**UPI Payment Features:**
- QR code generation for easy scanning
- Deep links to PhonePe, Paytm, Google Pay
- Payment reference tracking
- Copy UPI ID functionality
- WhatsApp support for payment issues

**Features:**
- Real-time availability checking
- WhatsApp notification integration
- Email confirmation (via Resend)
- Booking reference generation
- Calendar integration

### 1.6 Contact (`/contact`)

- **Contact Form** - Send inquiries directly
- **Location Map** - Embedded Google Maps
- **Address Details** - Full salon address with directions
- **Phone Number** - Direct call-to-action
- **WhatsApp Integration** - One-click WhatsApp messaging
- **Business Hours** - Operating schedule display

### 1.7 FAQ (`/faq`)

- **Accordion FAQ** - Expandable question/answer sections
- **Categories** - Organized by topic (Services, Bookings, Policies, etc.)
- **Search** - Quick find functionality

---

## 2. Authentication System

### 2.1 User Registration (`/register`)

**Features:**
- Email & password registration
- Full name input
- Phone number verification
- Terms acceptance checkbox
- Social login options (future)
- Email verification

### 2.2 User Login (`/login`)

**Features:**
- Email/password authentication
- "Remember me" functionality
- Password reset flow
- OAuth integration (future)
- Session management

### 2.3 User Account (`/account`)

**Dashboard Features:**
- Profile management
- Booking history (upcoming and past)
- Loyalty points display
- Tier status visualization
- Referral code sharing
- Points transaction history

---

## 3. Admin Panel (`/admin`)

### 3.1 Admin Dashboard

**Overview Metrics:**
- Total bookings count
- Revenue statistics
- Customer metrics
- Service popularity
- Recent activity feed

### 3.2 Bookings Management (`/admin/bookings`)

**Features:**
- List all bookings with filters
- Booking status management (Pending, Confirmed, Completed, Cancelled)
- Date range filtering
- Search functionality
- Booking details view
- Status update actions
- Export capabilities

### 3.3 Clients Management (`/admin/clients`)

**Features:**
- Customer directory
- Search and filter
- Customer profile viewing
- Booking history per customer
- Contact information
- Loyalty points display

### 3.4 Content Management (`/admin/content`)

**Manageable Content:**
- Services (CRUD operations)
- Gallery images
- Team members
- Testimonials
- FAQ entries
- Special offers

**Features:**
- Rich text editor
- Image upload (via Cloudinary)
- Preview functionality
- Publish/unpublish toggle

### 3.5 Loyalty Program (`/admin/loyalty`)

**Program Overview:**
- Total points outstanding
- Active customers count
- Tier distribution chart
- Monthly points earned/redeemed
- Total referrals

**Management Features:**
- View all customer points
- Manual points adjustment
- Transaction history
- Referral tracking
- Tier benefits configuration

### 3.6 Settings (`/admin/settings`)

- Business information
- Operating hours
- Social media links
- Email templates
- Notification preferences

---

## 4. Customer Loyalty Program

### 4.1 Points System

**Earning Points:**
- 1 point per ₹1 spent (base rate)
- Bonus points for higher tiers
- Referral bonuses

**Redeeming Points:**
- 100 points = ₹1 value
- Minimum redemption threshold
- Partial redemption allowed

### 4.2 Tier System

| Tier | Points Range | Bonus | Benefits |
|------|-------------|-------|----------|
| Bronze | 0 - 499 | 0% | Base earning rate |
| Silver | 500 - 999 | 5% | Bonus points on all services |
| Gold | 1000 - 2499 | 10% | Priority booking |
| Platinum | 2500+ | 15% | Exclusive offers + priority |

### 4.3 Referral Program

**How It Works:**
- Unique referral code generation
- Share via WhatsApp/Social media
- 100 points for referrer on first booking
- 50 points for referee on first booking
- Track referral status (Pending, Completed, Expired)

---

## 5. Technical Features

### 5.1 Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Email | Resend |
| Images | Cloudinary |
| Hosting | Vercel |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Geist (Variable) |

### 5.2 Database Tables

**Core Tables:**
- `profiles` - User profiles with roles
- `bookings` - Appointment bookings
- `services` - Service offerings
- `gallery` - Gallery images
- `testimonials` - Customer reviews
- `team` - Staff members

**Loyalty Tables:**
- `loyalty_programs` - Program configuration
- `customer_points` - Points per customer
- `points_transactions` - Transaction history
- `referrals` - Referral codes and tracking
- `tier_benefits` - Tier definitions

### 5.3 API & Server Actions

**Booking Actions:**
- `createBooking()` - Submit new booking
- `getBookings()` - Fetch user bookings
- `updateBookingStatus()` - Modify booking status

**Contact Actions:**
- `submitContactForm()` - Process inquiries

**Loyalty Actions:**
- `getCustomerPoints()` - Fetch customer points
- `addPointsToCustomer()` - Add earned points
- `redeemPoints()` - Redeem points
- `createReferralCode()` - Generate referral code
- `useReferralCode()` - Apply referral
- `getLoyaltyStats()` - Admin statistics
- `getTierBenefits()` - Fetch tier info

### 5.4 UI Components

**Payment Components:**
- `PaymentPage` - UPI QR code payment page with app links

**Layout Components:******
- `Navbar` - Sticky navigation with mobile drawer
- `Footer` - Site footer with links and socials
- `WhatsAppFAB` - Floating WhatsApp button

**Booking Components:**
- `BookingForm` - Multi-step booking form
- `FloatingBookingBar` - Persistent booking CTA

**Gallery Components:**
- `Lightbox` - Full-screen image viewer
- `BeforeAfterSlider` - Image comparison tool

**Common Components:**
- `Button` - Reusable button styles
- `Card` - Content card wrapper
- `Input` - Form input fields
- `SectionHeader` - Section titles
- `NotificationCenter` - Admin notifications

---

## 6. Marketing & Engagement Features

### 6.1 Social Media Integration

- **Instagram Feed** - Display latest Instagram posts
- **Google Reviews** - Show Google reviews widget
- **QR Codes** - WhatsApp and review links

### 6.2 WhatsApp Integration

- Floating action button
- Direct booking links
- Customer support channel
- Promotional broadcasts

### 6.3 Email Marketing

- Booking confirmations
- Reminder notifications
- Loyalty program updates
- Promotional campaigns

---

## 7. User Experience Features

### 7.1 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancements

### 7.2 Accessibility
- Keyboard navigation
- Screen reader friendly
- Color contrast compliance

### 7.3 Performance
- Image optimization
- Lazy loading
- Code splitting
- Caching strategies

### 7.4 Animations
- Scroll-triggered reveals
- Page transitions
- Micro-interactions
- Loading states

---

## 8. Security Features

### 8.1 Authentication
- Secure password hashing
- Session management
- Role-based access control
- Email verification

### 8.2 Data Protection
- Row Level Security (RLS) policies
- Input validation
- SQL injection prevention
- XSS protection

### 8.3 API Security
- Server-side operations
- Environment variable protection
- Rate limiting (future)

---

## 9. Deployment & DevOps

### 9.1 CI/CD Pipeline
- GitHub integration
- Automatic deployments
- Preview deployments

### 9.2 Environment
- Development (local)
- Staging (Vercel preview)
- Production (Vercel production)

### 9.3 Monitoring
- Error tracking
- Performance monitoring
- Analytics integration

---

## 10. Future Enhancements

- Online payment processing
- Multi-location support
- Inventory management
- Advanced analytics dashboard
- Mobile app integration
- AI-powered recommendations
- Virtual try-on features
- Subscription models

---

*Document Version: 1.0*
*Last Updated: March 2026*
*Project: Elegancia Unisex Salon Website*
