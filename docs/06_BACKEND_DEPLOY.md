# 🚀 06 — Backend & Deploy
> **For AI Coding Agents:** Antigravity, Bolt, Lovable, v0, Cursor
> This is File 6 of 6. Read ALL 6 files before writing any code.
> Build order: 01 Setup → 02 Design System → 03 Data → 04 Home/Services → 05 Gallery/Pricing/Book → 06 Backend/Deploy

---

## 🗄️ Supabase Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in details:
   - **Name:** `grettasaloon` (or your salon name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** `Asia (Singapore)` — closest to Kerala
4. Wait for project to be provisioned (may take ~2 minutes)

### Get Credentials

1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Create Database Tables

Run the following SQL in Supabase SQL Editor:

```sql
-- Bookings Table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public insert (website → database)
CREATE POLICY "Enable insert for bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for contact" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow authenticated read (admin dashboard)
CREATE POLICY "Enable read for authenticated users" ON bookings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read for contact authenticated" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 📧 Resend Setup (Email)

### Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. Go to **API Keys**
4. Create new key → Copy it as `RESEND_API_KEY`

### Email Templates

```tsx
// lib/actions/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(email: string, booking: {
  serviceName: string;
  date: string;
  time: string;
  name: string;
}) {
  try {
    await resend.emails.send({
      from: 'Gretta Saloon <bookings@yourdomain.com>',
      to: email,
      subject: 'Booking Confirmed - Gretta Saloon',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #C9A962; padding: 20px; text-align: center;">
            <h1 style="color: #1A1A1A; margin: 0;">Gretta Saloon</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #1A1A1A;">Booking Confirmed!</h2>
            <p>Hi ${booking.name},</p>
            <p>Your appointment has been confirmed. Here are the details:</p>
            <div style="background: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
            </div>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>Gretta Saloon Team</p>
          </div>
        </body>
        </html>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
```

---

## 🔧 Server Actions

### Booking Action

```tsx
// lib/actions/booking.ts
'use server';

import { createClient } from '@/lib/supabase';
import { sendBookingConfirmation } from './email';

export async function createBooking(formData: {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  const supabase = createClient();
  
  // Insert booking
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      service_id: formData.serviceId,
      service_name: formData.serviceName,
      booking_date: formData.date,
      booking_time: formData.time,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email || null,
      notes: formData.notes || null,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Booking error:', error);
    return { success: false, error: error.message };
  }
  
  // Send confirmation email
  if (formData.email) {
    await sendBookingConfirmation(formData.email, {
      serviceName: formData.serviceName,
      date: formData.date,
      time: formData.time,
      name: formData.name,
    });
  }
  
  return { success: true, data };
}
```

### Contact Action

```tsx
// lib/actions/contact.ts
'use server';

import { createClient } from '@/lib/supabase';

export async function submitContact(formData: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      message: formData.message,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Contact error:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}
```

---

## 🔐 Supabase Client

```tsx
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export function createClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

---

## 🌐 Vercel Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: Gretta Saloon website"

# Create GitHub repository and push
# (Use GitHub CLI or GitHub website)
gh repo create gretta-saloon --public --source=. --push
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   NEXT_PUBLIC_SALON_NAME=Gretta Saloon
   NEXT_PUBLIC_SALON_PHONE=+919876543210
   NEXT_PUBLIC_SALON_EMAIL=hello@grettasaloon.com
   NEXT_PUBLIC_SALON_ADDRESS=Muthukulam, Kerala, India 686122
   NEXT_PUBLIC_SALON_HOURS=Mon–Sat 9am–8pm, Sun 10am–6pm
   NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
   NEXT_PUBLIC_WHATSAPP_MSG=Hi!+I'd+like+to+book+an+appointment+at+Gretta+Saloon.
   ```
6. Click **Deploy**

### 3. Custom Domain (Optional)

1. Go to Project Settings → **Domains**
2. Add your domain (e.g., `grettasaloon.com`)
3. Update DNS records as instructed by Vercel
4. Wait for propagation (~24-48 hours)

---

## 📱 WhatsApp Integration

### Deep Link Format

```html
<a href="https://wa.me/919876543210?text=Hi!+I'd+like+to+book+an+appointment+at+Gretta+Saloon.">
  Chat on WhatsApp
</a>
```

### WhatsApp Floating Button

```tsx
// app/components/ui/WhatsAppFAB client';

import.tsx
'use { MessageCircle } from 'lucide-react';

export default function WhatsAppFAB() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = process.env.NEXT_PUBLIC_WHATSAPP_MSG || 'Hi! I\'d like to book an appointment';
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}
```

---

## 🖼️ Cloudinary Setup (Images)

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Go to **Settings → Upload**
3. Scroll to "Upload presets" and create a new preset:
   - **Name:** `saloon`
   - **Signing Mode:** `Unsigned`
   - **Folder:** `saloon`
4. Save and copy the preset name

### 2. Add Environment Variable

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Upload Images

1. Go to **Media Library**
2. Upload all salon images:
   - Hero images
   - Service images (7)
   - Gallery images (12+)
   - Team member photos (7)
3. Copy URLs for use in data files

---

## ✅ Pre-Launch Checklist

### Functionality
- [ ] All pages load without errors
- [ ] Navigation works on all pages
- [ ] Mobile menu opens/closes correctly
- [ ] Booking form submits successfully
- [ ] Contact form submits successfully
- [ ] WhatsApp FAB links work
- [ ] All animations play correctly

### SEO
- [ ] Meta titles set for all pages
- [ ] Meta descriptions set for all pages
- [ ] Open Graph tags configured
- [ ] Robots.txt configured
- [ ] Sitemap.xml generated
- [ ] All images have alt text

### Performance
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Fonts loading correctly
- [ ] No console errors
- [ ] Fast page transitions

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA
- [ ] All images have alt text
- [ ] ARIA labels where needed

### Deployment
- [ ] Deployed to Vercel
- [ ] Custom domain working (if set)
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Database tables created
- [ ] Email sending works

---

## 📞 Post-Launch Monitoring

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor:
  - Page views
  - Unique visitors
  - Top pages
  - Traffic sources

### Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your domain
3. Submit sitemap: `https://yoursite.com/sitemap.xml`
4. Monitor:
  - Search impressions
  - Click-through rate
  - Indexing errors

### Uptime Monitoring
- Use Vercel built-in monitoring
- Set up alerts for downtime

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|---|---|
| Booking form not submitting | Check Supabase RLS policies |
| Images not loading | Verify Cloudinary URLs |
| Email not sending | Check Resend API key |
| Build failing | Check environment variables |
| Mobile menu not working | Check JavaScript console |

### Getting Help

- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Resend:** [resend.com/docs](https://resend.com/docs)

---

## 📈 Version 2 Ideas

After launching, consider adding:

- [ ] Admin dashboard for managing bookings
- [ ] Customer accounts & booking history
- [ ] Loyalty points system
- [ ] Online product store
- [ ] Blog for SEO content
- [ ] Before/After slider
- [ ] Video gallery
- [ ] Virtual consultation booking
- [ ] Gift card system
- [ ] Multi-language support (Malayalam)

---

## ✅ Backend & Deploy Checklist

- [ ] Supabase project created
- [ ] Database tables created (bookings, contact_messages)
- [ ] RLS policies configured
- [ ] Resend account set up
- [ ] Email templates created
- [ ] Server actions implemented
- [ ] GitHub repository created
- [ ] Vercel deployment successful
- [ ] Custom domain configured (optional)
- [ ] Environment variables set
- [ ] WhatsApp FAB working
- [ ] Cloudinary set up
- [ ] Post-launch monitoring enabled
- [ ] All forms tested end-to-end
