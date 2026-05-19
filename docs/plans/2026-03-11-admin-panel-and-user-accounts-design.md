# Design Document: The Hideaway Administration & User Suite

## Overview
Transforming The Hideaway – Hair & Beauty Salon website from a static showcase into a dynamic business platform with secure user accounts and a real-time administration panel.

## Architecture
- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth (Social Google + Email/Password)
- **Database**: Supabase PostgreSQL + Realtime
- **UI Components**: Tailwind CSS v3 + Lucide Icons + Framer Motion
- **Route Groups**:
  - `(public)`: Landing page, services, gallery, booking (accessible to all)
  - `(auth)`: Login, Register, Forgot Password
  - `(user)`: `/account` - Personal dashboard, booking history (users only)
  - `(admin)`: `/admin` - Management suite, service editing, analytics (admins only)

## Role-Based Access Control (RBAC)
We will implement a `profiles` table in Supabase to track roles:
- `user`: Standard client role.
- `employee`: Staff members (stylists/therapists) with access to their schedules.
- `admin`: Full access to the administration dashboard.

## Database Schema (Proposed)
### `profiles`
- `id`: uuid (references auth.users)
- `email`: text
- `full_name`: text
- `avatar_url`: text
- `role`: text (default: 'user')
- `created_at`: timestamp

### `bookings`
- `id`: uuid
- `user_id`: uuid (references profiles.id, nullable for guest bookings)
- `service_id`: text
- `service_name`: text
- `customer_name`: text
- `customer_email`: text
- `customer_phone`: text
- `date`: date
- `time`: text
- `status`: text (pending, confirmed, cancelled, completed)
- `total_price`: numeric
- `created_at`: timestamp

### `services`
- `id`: text (primary key)
- `name`: text
- `category`: text
- `price`: numeric
- `duration`: text
- `description`: text
- `image_url`: text
- `is_active`: boolean

### `staff_profiles`
- `id`: uuid (references profiles.id)
- `expertise`: text[]
- `bio`: text
- `is_active`: boolean
- `created_at`: timestamp

### `client_interaction_logs`
- `id`: uuid
- `customer_id`: uuid
- `staff_id`: uuid
- `booking_id`: uuid
- `interaction_type`: text
- `notes`: text
- `metadata`: jsonb

### `service_compliance`
- `id`: uuid
- `booking_id`: uuid
- `staff_id`: uuid
- `checklist_items`: jsonb
- `compliance_status`: text

## Implementation Phases
1. **Phase 1: Security & Database**: Set up Supabase schema, RLS policies, and Auth middleware.
2. **Phase 2: Authentication UI**: Build Login/Register pages matching the "Modern Glamour" theme.
3. **Phase 3: Admin Dashboard**: Build the `/admin` dashboard with a real-time booking feed.
4. **Phase 4: User Hub**: Build the `/account` profile for clients to track their rituals.
5. **Phase 5: Booking Integration**: Connect the current booking form to the database.

## Design Aesthetics (Admin Panel)
- **Theme**: "Bento Grid" layout using `glass-morphism-dark`.
- **Colors**: Deep charcoal background (`#0A0A0B`) with gold accents (`#C9A962`).
- **Charts**: Minimalist line charts for revenue and appointment trends.
- **Interactions**: Slide-over panels for editing services and confirming bookings.
