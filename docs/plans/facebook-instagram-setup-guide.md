# Complete Guide: Facebook Developer Setup for Instagram & Facebook Messaging

This guide will walk you through setting up Facebook Developer account and getting API permissions to connect Instagram/Facebook messaging to your website admin panel.

---

## Phase 1: Create Facebook Developer Account

### Step 1.1: Sign Up for Facebook Developers
1. Go to **[developers.facebook.com](https://developers.facebook.com/)**
2. Click **"Log In"** (top right) - use your Facebook account
3. If prompted, click **"Continue as [Your Name]"**
4. Complete any verification if required
5. Accept the Terms of Service and click **"Create Account"**
6. Enter your phone number for verification (required by Facebook)
7. Enter the verification code sent to your phone

**✅ You now have a Facebook Developer account!**

---

## Phase 2: Create an App for Your Salon

### Step 2.1: Create New App
1. Go to **[developers.facebook.com](https://developers.facebook.com/)**
2. Click **"My Apps"** (top menu)
3. Click **"+ Create App"** button (blue button, top right)
4. Select **"Other"** → **"Business"** → Click **"Next"**
5. Enter App Name: **"The Hideaway Salon"** (or your salon name)
6. Select a Business Account (create one if you don't have it):
   - If you have a Facebook Business Page, select it
   - If not, click "Create a new Business account"
7. Enter Business details:
   - Business Name: **The Hideaway – Hair & Beauty Salon**
   - Business Email: **your email address**
8. Click **"Create App"**

### Step 2.2: Note Your App Credentials
1. Once created, you'll see the **App Dashboard**
2. Find **App ID** at the top (a long number like: `1234567890123456`)
3. Find **App Secret** (click "Show" next to it)
4. **⚠️ IMPORTANT:** Copy and save these credentials:
   - App ID: `_______________`
   - App Secret: `_______________`

---

## Phase 3: Add Instagram/Business API Products

### Step 3.1: Add Instagram Basic Display
1. In your App Dashboard, scroll down to **"Add products to your app"**
2. Find **"Instagram"** in the list
3. Click **"Set Up"** on Instagram Basic Display
4. It will be added to your left sidebar

### Step 3.2: Add Facebook Messaging (Optional - for Facebook Page)
1. Scroll down to find **"Facebook"** products
2. Click **"Set Up"** on **"Messenger"**
3. This enables Facebook Page messaging

### Step 3.3: Configure Instagram Basic Display
1. Click on **Instagram** in left sidebar
2. Click **"Basic Display"**
3. Scroll to **"Instagram App"**
4. Click **"Add or Remove Instagram Testers"**
5. Click **"Add Instagram Testers"**
6. Enter your salon Instagram username: `thehideawaydubai`
7. Click **"Submit"**

---

## Phase 4: Get API Permissions

### Step 4.1: Request Permissions for Instagram Messaging
1. In left sidebar, go to **App Review** → **"Permissions and Features"**
2. Find and request these permissions:
   - `instagram_basic` - Basic Instagram access
   - `instagram_manage_messages` - **Read and reply to messages** ⭐
   - `instagram_manage_comments` - Manage comments
   - `pages_show_list` - Show your pages
   - `pages_messaging` - Send/receive messages

3. For each permission:
   - Click **"Get"** or **"Request"**
   - Add details about how you'll use it
   - Submit for review (Facebook may take 24-48 hours)

### Step 4.2: Generate Access Token
1. Go to **Instagram** → **Basic Display**
2. Scroll to **"User Token"**
3. Click **"Generate Token"**
4. Accept the permissions
5. **Copy the Access Token** - save this securely!

---

## Phase 5: Connect to Your Website

### Step 5.1: Add Credentials to Environment Variables
Create a `.env.local` file in your project root:

```env
# Facebook/Instagram API Credentials
NEXT_PUBLIC_FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=your_app_secret_here
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_id
```

### Step 5.2: Update Admin Panel
The developer will need to:
1. Create API routes to communicate with Instagram Graph API
2. Build the messaging UI in your admin panel
3. Handle token refresh (tokens expire every 60 days)

---

## Quick Reference: API Endpoints You'll Use

| Purpose | Endpoint |
|---------|----------|
| Get messages | `GET /{ig-user-id}/messages` |
| Send reply | `POST /{ig-user-id}/messages` |
| Get profile | `GET /{ig-user-id}` |
| Get media | `GET /{ig-user-id}/media` |

---

## Troubleshooting

### Common Issues:
1. **"App not verified"** - Complete App Review for permissions
2. **"Token expired"** - Implement token refresh flow
3. **"No Instagram account"** - Convert personal account to Business account
4. **"Permission denied"** - Re-request permissions in App Review

### Need Help?
- Facebook Developer Documentation: [developers.facebook.com/docs](https://developers.facebook.com/docs)
- Instagram Graph API Docs: [developers.facebook.com/docs/instagram](https://developers.facebook.com/docs/instagram)

---

## Next Steps After Setup

Once you complete this setup:
1. Save your credentials
2. Send me the credentials (App ID, App Secret, Access Token)
3. I'll integrate the messaging into your admin panel

**Ready to start? Go to [developers.facebook.com](https://developers.facebook.com/) and begin with Phase 1!**
