# Implementation Plan: The Hideaway Phase 3 - Hub & Engagement (Rewards + Notifications)

This phase focuses on user retention and admin operational efficiency.

## Step 1: Database Enhancements
- [x] Task 1.1: Add `loyalty_points` and `total_bookings` fields to the `profiles` table.
- [x] Task 1.2: Create a `notifications` table for admin and user-facing real-time alerts.
- [x] Task 1.3: Update RLS policies to allow users to view their own rewards and notifications.

## Step 2: Rewards System (Loyalty Suite)
- [x] Task 2.1: Implement logic to award points (e.g., 50 points per AED 100 spent) when a booking is marked as `completed`.
- [x] Task 2.2: Build the "My Rewards" module in the User Hub showing point balance and reward progress.
- [x] Task 2.3: Add an admin control to manually adjust user points if necessary.

## Step 3: Admin Notification Hub
- [x] Task 3.1: Build a real-time notification listener on the Admin Panel for "New Booking" events.
- [x] Task 3.2: Create the "Command Center" notification dropdown in the admin layout with "Mark as Read" functionality.

## Step 4: External Engagement (WhatsApp & Email)
- [x] Task 4.1: Integrate a WhatsApp "Notify Admin" button on new booking confirmation.
- [x] Task 4.2: Ensure email confirmation includes reward point updates.

## Progress Tracking
- Total Tasks: 9 (expanded)
- Completed: 9
- Progress: 100%

**Note:** WhatsApp integration is currently a simulation/placeholder in `lib/actions/engagement.ts`. Loyalty points are awarded automatically upon booking completion via the Admin Panel.
