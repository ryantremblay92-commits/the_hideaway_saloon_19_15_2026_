# Loyalty & Referral Program - Implementation Plan

## Overview
Build a comprehensive loyalty and referral system directly into The Hideaway Saloon admin panel. This will allow you to track customer points, manage referrals, and reward loyal clients.

---

## Phase 1: Database Schema

### New Tables Required:

```sql
-- loyalty_programs table (defines program rules)
CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  points_per_aed DECIMAL(5,2) DEFAULT 1.00,
  points_to_redeem INTEGER DEFAULT 100,
  aed_value_per_point DECIMAL(5,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- customer_points (tracks points per customer)
CREATE TABLE customer_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- points_transactions (log of all point activities)
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- earn, redeem, expire, bonus
  description TEXT,
  booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- referrals (track referral codes)
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES customers(id),
  referee_id UUID REFERENCES customers(id),
  referral_code TEXT UNIQUE NOT NULL,
  referrer_reward_points INTEGER DEFAULT 100,
  referee_reward_points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'pending', -- pending, completed, expired
  referred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- referral_rewards (configurable rewards)
CREATE TABLE referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_type TEXT NOT NULL, -- points, percentage_discount, fixed_discount
  reward_value DECIMAL(10,2) NOT NULL,
  minimum_visits INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true
);
```

---

## Phase 2: Admin Panel Pages

### 2.1 Loyalty Program Settings Page
**Route:** `/admin/settings/loyalty`

**Features:**
- [ ] Enable/disable loyalty program
- [ ] Set points earning rate (e.g., 1 point per AED 100)
- [ ] Configure redemption rate (e.g., 100 points = AED 50)
- [ ] Set up tier thresholds:
  - Bronze: 0-500 points
  - Silver: 501-2000 points
  - Gold: 2001-5000 points
  - Platinum: 5000+ points
- [ ] Tier benefits configuration

### 2.2 Customer Points Dashboard
**Route:** `/admin/loyalty`

**Features:**
- [ ] Points overview (total points issued, redeemed, outstanding)
- [ ] Leaderboard (top point earners)
- [ ] Points expiration alerts
- [ ] Bulk points adjustment (add/subtract)
- [ ] Filter by tier

### 2.3 Individual Customer Points View
**Route:** `/admin/customers/[id]/loyalty`

**Features:**
- [ ] Current points balance
- [ ] Tier status with progress to next tier
- [ ] Points history (transactions list)
- [ ] Manual points adjustment
- [ ] Issue bonus points

### 2.4 Referral Management
**Route:** `/admin/referrals`

**Features:**
- [ ] View all referrals (referrer → referee)
- [ ] Referral code management
- [ ] Track referral status (pending/completed)
- [ ] Manual referral creation
- [ ] Referral statistics:
  - Total referrals
  - Successful conversions
  - Points issued for referrals

---

## Phase 3: Frontend Components

### 3.1 Customer-Facing Loyalty Page
**Route:** `/account/loyalty`

**Features:**
- [ ] Display current points balance
- [ ] Show tier progress bar
- [ ] List recent transactions
- [ ] Available rewards/redemptions
- [ ] Referral code share (copy to clipboard)
- [ ] How to earn more points

### 3.2 Referral Widget
**Features:**
- [ ] Generate unique referral code per customer
- [ ] Share via WhatsApp, copy link
- [ ] Track referrals made
- [ ] See rewards earned from referrals

---

## Phase 4: Automation Rules

### 4.1 Auto-Point Earning
**Trigger:** After booking completion
- [ ] Calculate points: `total_bill * points_per_aed`
- [ ] Update customer points balance
- [ ] Log transaction
- [ ] Check and update tier if applicable

### 4.2 Birthday Points Bonus
**Trigger:** On customer's birthday
- [ ] Auto-issue bonus points (configurable)
- [ ] Send birthday message via WhatsApp

### 4.3 Points Expiry Notification
**Trigger:** 30 days before points expire
- [ ] Notify customer of expiring points
- [ ] Encourage booking to use points

### 4.4 Referral Completion
**Trigger:** When referee makes first booking
- [ ] Mark referral as completed
- [ ] Issue reward points to both referrer and referee
- [ ] Send confirmation messages

---

## Phase 5: UI/UX Design

### Color Scheme
- **Bronze:** `#CD7F32`
- **Silver:** `#C0C0C0`
- **Gold:** `#FFD700`
- **Platinum:** `#E5E4E2`

### Tier Badges
Display visual badges on customer profiles and in admin

### Points Display
- Large, prominent points balance
- Animated counter on points change
- Progress bar showing tier advancement

---

## Implementation Priority

### Priority 1 (Must Have):
1. Database schema setup
2. Loyalty settings page
3. Customer points view in admin
4. Points transaction logging
5. Basic frontend display

### Priority 2 (Should Have):
1. Referral system
2. Tier system
3. Manual point adjustments

### Priority 3 (Nice to Have):
1. Points expiration
2. Automated notifications
3. Referral rewards

---

## API Endpoints Needed

```
POST   /api/loyalty/points/add      - Add points to customer
POST   /api/loyalty/points/redeem  - Redeem points for discount
GET    /api/loyalty/points/:customerId - Get customer points
GET    /api/loyalty/transactions    - Get transaction history
POST   /api/referrals/generate     - Generate referral code
GET    /api/referrals/:code        - Check referral code validity
POST   /api/referrals/complete     - Complete referral (referee books)
GET    /api/loyalty/settings       - Get loyalty program settings
PUT    /api/loyalty/settings       - Update loyalty program settings
```

---

## Acceptance Criteria

### For Admin:
- [ ] Can view all customer points in admin
- [ ] Can manually add/subtract points
- [ ] Can configure loyalty program settings
- [ ] Can view and manage referrals
- [ ] Can see loyalty analytics

### For Customers:
- [ ] Can view their points balance
- [ ] Can see tier progress
- [ ] Can view points history
- [ ] Can generate and share referral code
- [ ] Can see available redemptions

---

## Next Steps

1. **Confirm database schema** - Any modifications needed?
2. **Start building** - Switch to code mode to implement

Shall I proceed with implementing the Loyalty & Referral program for The Hideaway?
