# 🖼️ 05 — Pages: Gallery, Pricing & Book
> **For AI Coding Agents:** Antigravity, Bolt, Lovable, v0, Cursor
> This is File 5 of 6. Read ALL 6 files before writing any code.
> Build order: 01 Setup → 02 Design System → 03 Data → 04 Home/Services → 05 Gallery/Pricing/Book → 06 Backend/Deploy

---

## 📄 Gallery Page (`app/gallery/page.tsx`)

### Page Metadata

```tsx
export const metadata = {
  title: 'Gallery | Gretta Saloon',
  description: 'Browse our stunning hair transformations, bridal styling, color treatments and more. View the work of Kerala\'s best stylists.',
  keywords: 'hair gallery kerala, salon portfolio, hair transformations, bridal styling gallery',
}
```

### Page Component

```tsx
// app/gallery/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Lightbox from '@/components/gallery/Lightbox';

const galleryItems = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
    category: 'color',
    title: 'Balayage Transformation',
    description: 'Beautiful balayage with caramel tones'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4-035f?w=800&q=80',
    category: 'cut',
    title: 'Precision Bob Cut',
    description: 'Sharp bob with face-framing layers'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
    category: 'bridal',
    title: 'Bridal Updo',
    description: 'Elegant bridal hairstyle'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1616683693503-795920b0b8c1?w=800&q=80',
    category: 'nails',
    title: 'Nail Art',
    description: 'Elegant gel manicure design'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    category: 'color',
    title: 'Vibrant Red Color',
    description: 'Rich red with shine boost'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1554515595-36e9c4d7c1e2?w=800&q=80',
    category: 'treatment',
    title: 'Hair Spa Treatment',
    description: 'Revitalized and nourished hair'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
    category: 'style',
    title: 'Volume Blowout',
    description: 'Luxurious volume and shine'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1503951914875-452162b28f1f?w=800&q=80',
    category: 'cut',
    title: 'Men\'s Precision Cut',
    description: 'Modern fade with beard styling'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    category: 'extensions',
    title: 'Hair Extensions',
    description: 'Natural length and volume'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    category: 'bridal',
    title: 'Bridal Makeup',
    description: 'Flawless wedding day glam'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
    category: 'color',
    title: 'Ombre Style',
    description: 'Smooth ombre transition'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80',
    category: 'style',
    title: 'Wavy Beach Hair',
    description: 'Effortless beach waves'
  }
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'color', label: 'Color' },
  { id: 'cut', label: 'Cuts' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'style', label: 'Styling' },
  { id: 'treatment', label: 'Treatments' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);
  
  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);
  
  const openLightbox = (item: typeof galleryItems[0]) => {
    setSelectedImage(item);
    setLightboxOpen(true);
  };
  
  return (
    <main className="pt-24 pb-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
            Our Portfolio
          </span>
          <h1 className="font-fraunces text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
            Transformations
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Explore our gallery of stunning hair transformations. Each style is crafted to enhance your unique beauty.
          </p>
        </motion.div>
        
        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-[#C9A962] text-[#1A1A1A]'
                  : 'bg-white text-[#4A4A4A] hover:bg-[#C9A962]/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
              onClick={() => openLightbox(item)}
            >
              <img 
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <Lightbox 
          image={selectedImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  );
}
```

### Lightbox Component

```tsx
// app/components/gallery/Lightbox.tsx
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface LightboxProps {
  image: {
    src: string;
    title: string;
    description: string;
  };
  onClose: () => void;
}

export default function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div 
        className="max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={image.src}
          alt={image.title}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
        <div className="text-center mt-6">
          <h3 className="font-fraunces text-2xl font-semibold text-white mb-2">
            {image.title}
          </h3>
          <p className="text-gray-400">{image.description}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 💰 Pricing Page (`app/pricing/page.tsx`)

### Page Metadata

```tsx
export const metadata = {
  title: 'Pricing & Membership | Gretta Saloon',
  description: 'View our service pricing and exclusive membership benefits. Save up to 20% with our membership packages.',
  keywords: 'salon pricing kerala, hair salon prices, membership benefits, Gretta saloon packages',
}
```

### Page Component

```tsx
// app/pricing/page.tsx
import { pricingCategories, memberships } from '@/lib/data/pricing';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="pt-24 pb-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
            Our Pricing
          </span>
          <h1 className="font-fraunces text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
            Services & Membership
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Transparent pricing for all our premium services. Save more with our exclusive membership programs.
          </p>
        </motion.div>
        
        {/* Membership Cards */}
        <section className="mb-20">
          <h2 className="font-fraunces text-2xl font-bold text-[#1A1A1A] text-center mb-10">
            Membership Programs
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {memberships.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 ${
                  tier.highlighted 
                    ? 'ring-2 ring-[#C9A962] shadow-xl scale-105' 
                    : 'shadow-lg'
                }`}
              >
                {tier.savings && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A962] text-[#1A1A1A] px-4 py-1 rounded-full text-sm font-semibold">
                    {tier.savings}
                  </div>
                )}
                
                <h3 className="font-fraunces text-2xl font-bold text-[#1A1A1A] mb-2">
                  {tier.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#1A1A1A]">
                    ₹{tier.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[#4A4A4A]">/{tier.billing}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#C9A962] flex-shrink-0 mt-0.5" />
                      <span className="text-[#4A4A4A]">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/book"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                    tier.highlighted
                      ? 'bg-[#C9A962] text-[#1A1A1A] hover:bg-[#B8944F]'
                      : 'bg-[#FAF8F5] text-[#1A1A1A] hover:bg-[#E8E4DF]'
                  }`}
                >
                  Join Now
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Price Tables */}
        {pricingCategories.map((category, catIndex) => (
          <section key={category.id} className="mb-16">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="font-fraunces text-2xl font-bold text-[#1A1A1A] mb-8 pb-4 border-b border-[#E8E4DF]">
                {category.name}
              </h2>
              
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] text-lg">
                        {item.name}
                      </h3>
                      {(item.duration || item.description) && (
                        <p className="text-[#4A4A4A] text-sm mt-1">
                          {item.duration || item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-fraunces text-2xl font-bold text-[#C9A962]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        ))}
      </div>
    </main>
  );
}
```

---

## 📅 Book Online Page (`app/book/page.tsx`)

### Page Metadata

```tsx
export const metadata = {
  title: 'Book Appointment | Gretta Saloon',
  description: 'Book your appointment at Gretta Saloon online. Choose your service, select date and time, and confirm in seconds.',
  keywords: 'book salon appointment online, book hair appointment, Gretta saloon booking',
}
```

### Booking Form Component

```tsx
// app/components/booking/BookingForm.tsx
'use client';

import { useState } from 'react';
import { services } from '@/lib/data/services';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Calendar, Clock, User } from 'lucide-react';

const steps = [
  { id: 1, label: 'Service', icon: Check },
  { id: 2, label: 'Date & Time', icon: Calendar },
  { id: 3, label: 'Details', icon: User },
  { id: 4, label: 'Confirm', icon: Check },
];

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit to server action
    handleNext();
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                currentStep >= step.id 
                  ? 'bg-[#C9A962] text-[#1A1A1A]' 
                  : 'bg-[#E8E4DF] text-[#4A4A4A]'
              }`}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </div>
            <span className={`ml-2 hidden sm:block ${
              currentStep >= step.id ? 'text-[#1A1A1A]' : 'text-[#4A4A4A]'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-[#C9A962]' : 'bg-[#E8E4DF]'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-fraunces text-xl font-semibold text-[#1A1A1A] mb-6">
                Select a Service
              </h3>
              <div className="grid gap-4">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.service === service.id
                        ? 'border-[#C9A962] bg-[#C9A962]/5'
                        : 'border-[#E8E4DF] hover:border-[#C9A962]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={formData.service === service.id}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.service === service.id
                          ? 'border-[#C9A962]'
                          : 'border-[#E8E4DF]'
                      }`}>
                        {formData.service === service.id && (
                          <div className="w-3 h-3 rounded-full bg-[#C9A962]" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">{service.name}</div>
                        <div className="text-sm text-[#4A4A4A]">{service.duration}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-[#C9A962]">
                      ₹{service.price.toLocaleString('en-IN')}
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-fraunces text-xl font-semibold text-[#1A1A1A] mb-6">
                Choose Date & Time
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-4 rounded-xl border border-[#E8E4DF] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Preferred Time
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-4 rounded-xl border border-[#E8E4DF] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 outline-none"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Contact Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-fraunces text-xl font-semibold text-[#1A1A1A] mb-6">
                Your Details
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full p-4 rounded-xl border border-[#E8E4DF] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full p-4 rounded-xl border border-[#E8E4DF] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 rounded-xl border border-[#E8E4DF] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Special Requests or Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-4 rounded-xl border border-[#E8E4DF] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 outline-none resize-none"
                    placeholder="Any special requests or notes for your appointment..."
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-[#C9A962]" />
              </div>
              <h3 className="font-fraunces text-2xl font-bold text-[#1A1A1A] mb-4">
                Booking Confirmed!
              </h3>
              <p className="text-[#4A4A4A] mb-8">
                Thank you for your booking. We will send a confirmation to your phone and email shortly.
              </p>
              
              <div className="bg-[#FAF8F5] rounded-xl p-6 text-left max-w-md mx-auto">
                <h4 className="font-semibold text-[#1A1A1A] mb-4">Booking Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4A4A4A]">Service:</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {services.find(s => s.id === formData.service)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A4A4A]">Date:</span>
                    <span className="font-medium text-[#1A1A1A]">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A4A4A]">Time:</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {formData.time}:00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A4A4A]">Name:</span>
                    <span className="font-medium text-[#1A1A1A]">{formData.name}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-[#4A4A4A] cursor-not-allowed'
                  : 'text-[#1A1A1A] hover:bg-[#FAF8F5]'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.service) ||
                  (currentStep === 2 && (!formData.date || !formData.time))
                }
                className="flex items-center gap-2 bg-[#C9A962] text-[#1A1A1A] px-8 py-3 rounded-lg font-semibold hover:bg-[#B8944F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#C9A962] text-[#1A1A1A] px-8 py-3 rounded-lg font-semibold hover:bg-[#B8944F] transition-colors"
              >
                Confirm Booking
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
```

### Book Page Layout

```tsx
// app/book/page.tsx
import BookingForm from '@/components/booking/BookingForm';
import { fadeInUp } from '@/lib/animations';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Clock } from 'lucide-react';

export default function BookPage() {
  return (
    <main className="pt-24 pb-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
            Book Now
          </span>
          <h1 className="font-fraunces text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
            Schedule Your Visit
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Book your appointment online in just a few clicks. Choose your service, 
            pick a time that works for you, and we'll confirm instantly.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-fraunces text-xl font-semibold text-[#1A1A1A] mb-6">
                Prefer to Book by Phone?
              </h3>
              <div className="space-y-4">
                <a 
                  href="tel:+919876543210"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#C9A962]/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#C9A962]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Call Us</div>
                    <div className="text-[#4A4A4A]">+91 98765 43210</div>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/919876543210?text=Hi!+I'd+like+to+book+an+appointment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#25D366]/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">WhatsApp</div>
                    <div className="text-[#4A4A4A]">Chat with us</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Hours Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-fraunces text-xl font-semibold text-[#1A1A1A] mb-4">
                <Clock className="w-5 h-5 inline mr-2 text-[#C9A962]" />
                Opening Hours
              </h3>
              <div className="space-y-2 text-[#4A4A4A]">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
            
            {/* Location Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-fraunces text-xl font-semibold text-[#1A1A1A] mb-4">
                Our Location
              </h3>
              <p className="text-[#4A4A4A]">
                Gretta Saloon<br />
                Muthukulam, Kerala 686122<br />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## ✅ Gallery, Pricing & Book Pages Checklist

- [ ] Gallery page with filter tabs
- [ ] Gallery grid with hover effects
- [ ] Lightbox component with keyboard navigation
- [ ] Pricing page with membership cards
- [ ] Price table categories
- [ ] Book page with multi-step form
- [ ] Service selection step
- [ ] Date & time picker step
- [ ] Contact details step
- [ ] Confirmation step
- [ ] WhatsApp/phone booking alternatives
- [ ] All animations working
- [ ] Responsive on all breakpoints
- [ ] SEO metadata for all pages
