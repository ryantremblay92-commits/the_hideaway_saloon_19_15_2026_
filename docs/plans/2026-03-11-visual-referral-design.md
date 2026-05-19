# Design Document: Visual Referral Engine & Creator Kit

## Overview
A growth-focused feature designed to turn The Hideaway clients into brand ambassadors. It provides them with a "Creator Kit" to share their experiences authentically while ensuring direct conversion via personalized "Spotlight" landing pages and automated referral tracking.

## Objectives
- Drive high-quality referrals through personal recommendations.
- Increase website traffic via social status/story "bridges".
- Incentivize first-time visits with exclusive welcome gifts.
- Empower clients to be creative with their own content while using smart tracking tools.

## Phase I: Personal Invitation Landing Page
**Route:** `/invite/[code]`
**Query Params:** `ritual=[slug]`

### Features:
- **Friend Recognition**: Fetches and displays the referrer's name to establish trust.
- **Service Recommendation**: Dynamically spotlights the exact ritual the friend just completed.
- **Welcome Gift**: Displays a unique discount code (e.g., "WELCOME-OFFER-50") for the first-time visitor.
- **Attribution**: Automatically sets a "referral_code" cookie in the friend's browser to ensure the referrer gets credit even if the booking happens later.

## Phase II: Creator Kit (User Account)
**Location:** `/account` (User Dashboard)

### Components:
- **Transparent QR Generator**: A downloadable, branded PNG of a QR code that encodes the specific Referral + Ritual link.
- **Magic Link Sticker**: A one-tap "Copy Link" optimized for Instagram Link Stickers.
- **Visual Asset Pack**: High-end background images of their specific rituals that clients can used in their creative posts.

## Phase III: Technical Tracking & Rewards
- **Cookie Attribution**: 30-day persistence for referral codes.
- **Booking Integration**: The `/book` page automatically detects the referral cookie and pre-selects the recommended service.
- **Admin Completion Hook**: Automated reward point issuance when a referred booking is marked "Completed" in the admin panel.

## Implementation Roadmap
1. **Invite Page Architecture**: Build the dynamic `/invite/[code]` route.
2. **Referral Database Extensions**: Ensure data fetching for referrer names and service details.
3. **Creator Kit UI**: Add the sharing toolset to the user account page.
4. **Attribution Logic**: Implement cookie-based referral tracking.
