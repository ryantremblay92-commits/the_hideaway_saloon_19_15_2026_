# Implementation Plan: Multi-Role Account System (Admin, Employee, Customer)

This plan outlines the expansion of the existing authentication system to support a three-tier role structure specifically for **The Hideaway Saloon**.

## 👥 Role Definitions

| Role | Access Level | Key Responsibilities |
| :--- | :--- | :--- |
| **Admin** | Full System Access | Staff management, revenue analytics, global settings, quality control across all bookings. |
| **Employee** | Staff Dashboard | Personal schedule, client interaction logs, compliance checklists, personal commission tracking. |
| **Customer** | Personal Hub | Booking history, rewards tracking, profile management, personal hair health journey. |

---

## 🛠️ Step 1: Database Schema Expansion

### 1.1 Update `profiles` Role Enum
Add 'employee' to the allowed roles.

```sql
-- Update profiles role check or enum
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'employee', 'user'));
```

### 1.2 Create `staff_profiles` Table
Store specific data for stylists and therapists.

```sql
CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  expertise TEXT[], -- e.g., ['Balayage', 'Precision Cutting']
  bio TEXT,
  working_hours JSONB, -- Day-specific shifts
  is_active BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.3 Create `client_interaction_logs` Table
Track detailed notes and preferences to ensure personalized service.

```sql
CREATE TABLE client_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id),
  staff_id UUID REFERENCES profiles(id),
  booking_id UUID REFERENCES bookings(id),
  interaction_type TEXT, -- 'consultation', 'post-service-notes', 'preference'
  notes TEXT,
  metadata JSONB, -- { color_codes: [], allergy_test_result: '', products_used: [] }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.4 Create `service_compliance` Table
Ensures staff follow "The Hideaway" quality protocols.

```sql
CREATE TABLE service_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  staff_id UUID REFERENCES profiles(id),
  checklist_items JSONB, -- { "patch_test_verified": true, "aftercare_explained": true }
  compliance_status TEXT DEFAULT 'pending', -- 'verified', 'flagged'
  verified_at TIMESTAMP WITH TIME ZONE
);
```

---

## 🔐 Step 2: Access Control & Middleware

### 2.1 Update Next.js Middleware
Refactor `middleware.ts` to handle three distinct route groups:
- `/admin/*` -> Requires `role: 'admin'`
- `/staff/*` -> Requires `role: 'employee'`
- `/account/*` -> Requires any authenticated user

### 2.2 Row Level Security (RLS) Policies
- **Bookings**: 
  - Admins: Select all.
  - Employees: Select where `stylist_id = auth.uid()`.
  - Customers: Select where `user_id = auth.uid()`.
- **Staff Profiles**:
  - Public: Select `expertise`, `bio`, `avatar`.
  - Self: Update all.
  - Admin: Full control.

---

## 🖥️ Step 3: UI & Dashboard Development

### 3.1 Employee Dashboard (`/staff`) - The "Artist Studio"
Focuses on the craftsmanship and client relationship.
- **Ritual Queue**: Real-time view of today's clients.
- **Client Digital Profile**: 
  - **Color Archive**: Historical color codes and formulas used.
  - **Preference Vault**: Favorite drinks, styling preferences, or sensitivities.
- **Compliance "Flow"**: Guided checklist for every service to maintain high standards.
- **Personal Business Tab**:
  - **Earnings Preview**: Real-time commission calculations.
  - **Performance Stats**: Average service rating and client retention rate.

### 3.2 Admin Dashboard (`/admin`) - The "Command Center"
Focuses on operational health and scalability.
- **Global Schedule**: Manage all staff shifts and overlapping bookings.
- **Compliance Audit**: View flagged or missed protocol items from any service.
- **Staff Performance Matrix**: Compare productivity, revenue, and compliance across the team.
- **Revenue Analytics**: Filter by date, service type, or staff member.

---

## 🚀 Implementation Roadmap

1. **Database Migration**: Apply new constraints and create the `staff_profiles` table.
2. **Middleware Refactor**: Implement the new routing logic.
3. **Staff Profile Editor**: Build the UI for admins to add expertise/bios to staff.
4. **Employee Portal**: Develop the base dashboard for staff members.
5. **Testing**: Verify that a 'user' cannot access `/staff` and an 'employee' cannot access `/admin`.

---

## ✅ Acceptance Criteria
- [ ] Admins can create and manage employee accounts.
- [ ] Employees can log in and see only their assigned bookings.
- [ ] Customers can only see their own data.
- [ ] The system accurately routes users to their respective dashboards upon login.

> [!TIP]
> Use the **"Hair Spa Ritual"** terminology in the staff dashboard to maintain brand consistency for The Hideaway stylists.
