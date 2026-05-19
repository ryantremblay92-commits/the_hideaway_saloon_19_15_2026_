# 🏠 04 — Pages: Home & Services
> **For AI Coding Agents:** Antigravity, Bolt, Lovable, v0, Cursor
> This is File 4 of 6. Read ALL 6 files before writing any code.
> Build order: 01 Setup → 02 Design System → 03 Data → 04 Home/Services → 05 Gallery/Pricing/Book → 06 Backend/Deploy

---

## 📄 Home Page (`app/page.tsx`)

### Page Metadata

```tsx
export const metadata = {
  title: 'Gretta Saloon | Premium Hair Saloon in Kerala',
  description: "Kerala's premier hair saloon for precision haircuts, balayage, bridal styling, and keratin treatments. Located in Muthukulam. Book online today.",
  keywords: 'hair saloon kerala, best saloon muthukulam, bridal hair kerala, balayage kerala, keratin treatment kerala',
  openGraph: {
    title: 'Gretta Saloon | Premium Hair Saloon in Kerala',
    description: "Kerala's premier hair saloon for precision haircuts, balayage, bridal styling, and keratin treatments.",
    url: 'https://grettasaloon.com',
    type: 'website',
  }
}
```

### Section 1: Hero

```tsx
// app/components/home/HeroSection.tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FAF8F5]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#C9A962]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#C9A962]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-xl"
          >
            <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
              Welcome to Gretta Saloon
            </span>
            <h1 className="font-fraunces text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              Your Hair, <br />
              <span className="text-[#C9A962]">Our Passion</span>
            </h1>
            <p className="text-lg text-[#4A4A4A] mb-8 leading-relaxed">
              Experience world-class hair care in the heart of Kerala. 
              From precision cuts to stunning color transformations, 
              we bring your dream look to life.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book"
                className="inline-flex items-center gap-2 bg-[#C9A962] text-[#1A1A1A] px-6 py-3 rounded-lg font-semibold hover:bg-[#B8944F] transition-colors"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/services"
                className="inline-flex items-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 rounded-lg font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                View Services
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-[#E8E4DF]">
              <div>
                <div className="font-fraunces text-3xl font-bold text-[#1A1A1A]">5000+</div>
                <div className="text-sm text-[#4A4A4A]">Happy Clients</div>
              </div>
              <div>
                <div className="font-fraunces text-3xl font-bold text-[#1A1A1A]">15+</div>
                <div className="text-sm text-[#4A4A4A]">Years Experience</div>
              </div>
              <div>
                <div className="font-fraunces text-3xl font-bold text-[#1A1A1A]">4.9</div>
                <div className="text-sm text-[#4A4A4A]">Rating</div>
              </div>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4-035f?w=800&q=80"
                alt="Gretta Saloon Interior"
                className="object-cover w-full h-full"
              />
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#C9A962]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Award Winning</div>
                    <div className="text-sm text-[#4A4A4A]">Best Salon in Kerala 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

### Section 2: Features (Why Choose Us)

```tsx
// app/components/home/FeaturesSection.tsx
import { features } from './data';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-[#1A1A1A]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
            Why Choose Gretta
          </span>
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-white mb-6">
            Experience the Difference
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-[#252525] p-8 rounded-2xl text-center hover:bg-[#2A2A2A] transition-colors group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A962]/10 flex items-center justify-center group-hover:bg-[#C9A962]/20 transition-colors">
                <feature.icon className="w-8 h-8 text-[#C9A962]" />
              </div>
              <h3 className="font-fraunces text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// In app/components/home/data.ts
export const features = [
  {
    icon: Scissors,
    title: 'Expert Stylists',
    description: 'Our team brings years of international experience and continuous training.'
  },
  {
    icon: Sparkles,
    title: 'Premium Products',
    description: 'We use only the finest professional hair care products for lasting results.'
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every client receives a customized consultation for their unique needs.'
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized as the best salon in Kerala for excellence in hair care.'
  }
];
```

### Section 3: Services Preview

```tsx
// app/components/home/ServicesPreview.tsx
import { services, getFeaturedServices } from '@/lib/data/services';
import ServiceCard from '@/components/services/ServiceCard';
import { fadeInUp } from '@/lib/animations';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ServicesPreview() {
  const featuredServices = getFeaturedServices();
  
  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
            Our Services
          </span>
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
            What We Offer
          </h2>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            From precision cuts to stunning color transformations, 
            we offer a comprehensive range of hair services.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-[#C9A962] font-semibold hover:gap-4 transition-all"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

### Section 4: Testimonials Carousel

```tsx
// app/components/home/TestimonialsSection.tsx
import { testimonials } from '@/lib/data/testimonials';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import StarRating from '@/components/ui/StarRating';

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
            What Our Clients Say
          </h2>
        </motion.div>
        
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-[#FAF8F5] p-8 rounded-2xl">
                <StarRating rating={testimonial.rating} />
                <p className="text-[#4A4A4A] my-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                    <span className="text-[#C9A962] font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">{testimonial.name}</div>
                    <div className="text-sm text-[#4A4A4A]">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
```

### Section 5: Gallery Preview

```tsx
// app/components/home/GalleryPreview.tsx
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Link from 'next/link';

const galleryImages = [
  { id: 1, src: '...', category: 'color' },
  { id: 2, src: '...', category: 'cut' },
  { id: 3, src: '...', category: 'bridal' },
  { id: 4, src: '...', category: 'style' },
];

export default function GalleryPreview() {
  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <span className="text-[#C9A962] font-semibold tracking-wider uppercase mb-4 block">
            Our Work
          </span>
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
            Transformations
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <img 
                src={img.src} 
                alt="Gallery" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/gallery"
            className="inline-flex items-center gap-2 bg-[#C9A962] text-[#1A1A1A] px-6 py-3 rounded-lg font-semibold hover:bg-[#B8944F] transition-colors"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
```

### Section 6: CTA Section

```tsx
// app/components/home/CTASection.tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#C9A962]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#C9A962]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready for Your Transformation?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Book your appointment today and experience the Gretta Saloon difference. 
            Your dream hair is just a click away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/book"
              className="inline-flex items-center gap-2 bg-[#C9A962] text-[#1A1A1A] px-8 py-4 rounded-lg font-semibold hover:bg-[#B8944F] transition-colors"
            >
              Book Now
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1A1A1A] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

---

## 📄 Services Listing Page (`app/services/page.tsx`)

### Page Metadata

```tsx
export const metadata = {
  title: 'Our Services | Gretta Saloon',
  description: 'Explore our range of premium hair services including haircuts, coloring, bridal styling, keratin treatments, and more in Muthukulam, Kerala.',
  keywords: 'hair services kerala, salon services, hair coloring, bridal styling, keratin treatment',
}
```

### Page Component

```tsx
// app/services/page.tsx
import { services } from '@/lib/data/services';
import ServiceCard from '@/components/services/ServiceCard';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { motion } from 'framer-motion';

export default function ServicesPage() {
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
            Our Expertise
          </span>
          <h1 className="font-fraunces text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
            Premium Hair Services
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Discover our comprehensive range of hair services designed to make you look and feel your best.
          </p>
        </motion.div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-6 py-2 rounded-full bg-[#C9A962] text-[#1A1A1A] font-semibold">
            All
          </button>
          <button className="px-6 py-2 rounded-full border border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C9A962] hover:text-[#C9A962] transition-colors">
            Hair
          </button>
          <button className="px-6 py-2 rounded-full border border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C9A962] hover:text-[#C9A962] transition-colors">
            Treatments
          </button>
          <button className="px-6 py-2 rounded-full border border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C9A962] hover:text-[#C9A962] transition-colors">
            Styling
          </button>
        </div>
        
        {/* Services Grid */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={fadeInUp}>
              <ServiceCard service={service} showPrice />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
```

---

## 📄 Service Detail Page (`app/services/[slug]/page.tsx`)

```tsx
// app/services/[slug]/page.tsx
import { services, getServiceBySlug } from '@/lib/data/services';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Star } from 'lucide-react';

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: `${service.name} | Gretta Saloon`,
    description: service.shortDescription,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();
  
  return (
    <main className="pt-24 pb-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <Link 
          href="/services"
          className="inline-flex items-center gap-2 text-[#4A4A4A] hover:text-[#C9A962] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="aspect-[4/5] rounded-2xl overflow-hidden">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content */}
          <div>
            <span className="text-[#C9A962] font-semibold tracking-wider uppercase">
              {service.category}
            </span>
            <h1 className="font-fraunces text-4xl font-bold text-[#1A1A1A] mt-2 mb-6">
              {service.name}
            </h1>
            <p className="text-lg text-[#4A4A4A] mb-8 leading-relaxed">
              {service.fullDescription}
            </p>
            
            {/* Meta */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#C9A962]" />
                <span className="text-[#4A4A4A]">{service.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#C9A962]" />
                <span className="text-[#4A4A4A]">Popular Choice</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="bg-white p-6 rounded-xl mb-8">
              <div className="text-sm text-[#4A4A4A] mb-1">{service.priceNote}</div>
              <div className="text-3xl font-fraunces font-bold text-[#1A1A1A]">
                ₹{service.price.toLocaleString('en-IN')}
              </div>
            </div>
            
            {/* CTA */}
            <Link 
              href="/book"
              className="inline-flex w-full justify-center items-center gap-2 bg-[#C9A962] text-[#1A1A1A] px-8 py-4 rounded-lg font-semibold hover:bg-[#B8944F] transition-colors"
            >
              Book This Service
            </Link>
          </div>
        </div>
        
        {/* Related Services */}
        <div className="mt-20">
          <h2 className="font-fraunces text-2xl font-bold text-[#1A1A1A] mb-8">
            Other Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services
              .filter(s => s.id !== service.id)
              .slice(0, 3)
              .map(s => (
                <Link key={s.id} href={`/services/${s.slug}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={s.image} 
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#C9A962]">
                        {s.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## ✅ Home & Services Pages Checklist

- [ ] Home page layout with all sections
- [ ] Hero section with animation
- [ ] Features section
- [ ] Services preview section
- [ ] Testimonials carousel (Swiper)
- [ ] Gallery preview section
- [ ] CTA section
- [ ] Services listing page with filters
- [ ] Service detail page with dynamic routing
- [ ] All animations working
- [ ] Responsive on all breakpoints
- [ ] SEO metadata for all pages
