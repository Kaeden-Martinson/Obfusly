# Step-by-Step Commands to Fix Subscription Issues

## Prerequisites: Restart Your Server
First, make sure your server is running with the latest code:

```bash
# Kill existing server
npm stop
# or press Ctrl+C in the terminal

# Install latest dependencies
npm install

# Start server with debug logging
npm start
```

---

## STEP 1: Verify Your Environment Setup

### Check your `.env` file
```bash
cat .env | grep STRIPE
```

You should see:
```
STRIPE_SECRET=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PROFESSIONAL=price_xxxxx
STRIPE_PRICE_ENTERPRISE=price_xxxxx
DOMAIN=http://localhost:3000 (for dev) or your domain (for prod)
```

**If you see placeholders like `price_professional_placeholder`:**
You need to get real price IDs from Stripe:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Products → Your products or Billing → Prices
3. Find your professional and enterprise prices
4. Copy their IDs (they start with `price_`)
5. Update your `.env`:
   ```
   STRIPE_PRICE_PROFESSIONAL=price_1234567890abc
   STRIPE_PRICE_ENTERPRISE=price_1234567890def
   ```
6. Restart your server

---

## STEP 2: Check Stripe Configuration Endpoint

```bash
curl http://localhost:3000/api/debug/stripe-config | jq
```

**Good output:**
```json
{
  "stripeConfigured": true,
  "stripeServiceConfigured": true,
  "webhookSecretConfigured": true,
  "plans": {
    "professional": {
      "configured": true,
      "stripePriceId": "price_xxxxx"
    },
    "enterprise": {
      "configured": true,
      "stripePriceId": "price_xxxxx"
    }
  },
  "errors": [
    "✓ professional: stripePriceId configured",
    "✓ enterprise: stripePriceId configured",
    "✓ Stripe initialized",
    "✓ Webhook secret configured"
  ]
}
```

**If you see ❌ errors:**
- Fix the corresponding `.env` variable
- Restart server
- Re-run this command

---

## STEP 3: Create Test Account & Make Test Payment

### In your browser:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create account with test email: `test+TIMESTAMP@example.com`
4. Verify email (check console or logs)
5. Log in
6. Go to Pricing
7. Click "Get Started" for Professional plan

### Watch Server Logs
You should see:
```
[CHECKOUT] Creating session for plan: professional
[CHECKOUT] User found: [userId], current plan: free
[CHECKOUT] Plan config: { name: 'Professional', price: 19.99, stripePriceId: 'price_...' }
[CHECKOUT] Session created: cs_test_..., URL: https://checkout.stripe.com/...
```

### Complete Stripe Checkout
8. On Stripe page, use test card: `4242 4242 4242 4242`
9. Expiry: Any future date (e.g., 12/25)
10. CVC: Any 3 digits (e.g., 123)
11. Billing zip: Any (e.g., 90210)
12. Complete payment

### After Payment
Watch server logs for webhook:
```
[STRIPE WEBHOOK] Event type: checkout.session.completed
[CHECKOUT] Session - Customer: cus_..., Plan: professional, Subscription: sub_...
[CHECKOUT] Found user: [userId]
[SUBSCRIPTION] User [userId] upgraded to professional
```

If you DON'T see these logs:
- Webhook is not configured in Stripe Dashboard
- Webhook secret is wrong
- Stripe can't reach your server

---

## STEP 4: Get Your Customer ID From Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/customers)
2. Search for your test email
3. Click on the customer
4. Copy the Customer ID (starts with `cus_`)

---

## STEP 5: Use Debug Endpoint to Check Database

```bash
# Replace cus_xxxxx with your actual customer ID
curl http://localhost:3000/api/debug/subscription/cus_xxxxx | jq
```

**Good output:**
```json
{
  "customerExists": true,
  "userInDb": true,
  "user": {
    "id": "e8162790-175f-4478-adfd-2927668fc39a",
    "email": "test@example.com",
    "plan": "professional",
    "subStatus": "active",
    "stripeSubId": "sub_xxxxx",
    "stripeCustId": "cus_xxxxx"
  },
  "stripeSubscriptions": [
    {
      "id": "sub_xxxxx",
      "status": "active",
      "priceId": "price_xxxxx",
      "currentPeriodEnd": "2026-05-30T..."
    }
  ]
}
```

**Bad output - `"plan": "free"`:**
The webhook didn't save the plan. Go to STEP 6.

---

## STEP 6: Verify Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Find your webhook endpoint
3. Click on it
4. Scroll to **Recent events** section
5. Look for most recent `checkout.session.completed` event
6. Click it to expand
7. Check the **Request** tab

You should see:
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "metadata": {
        "planName": "professional"
      },
      "subscription": "sub_xxxxx",
      "customer": "cus_xxxxx"
    }
  }
}
```

**If `metadata.planName` is missing:**
- Problem is in checkout session creation
- Check [server.js line 640](server.js#L640)

**If `subscription` is null:**
- Session was payment (not subscription)
- Check stripe config for correct price IDs

---

## STEP 7: Check Database Directly

```bash
# Open MongoDB shell
mongosh

# Use the database
use obfusly

# Find your user
db.users.findOne({ email: "test@example.com" })
```

Should show:
```javascript
{
  _id: ObjectId(...),
  id: "e8162790-175f-4478-adfd-2927668fc39a",
  email: "test@example.com",
  plan: "professional",        // ← Should NOT be "free"
  subStatus: "active",         // ← Should NOT be "inactive"
  stripeSubId: "sub_xxxxx",    // ← Should exist
  stripeCustId: "cus_xxxxx",   // ← Should exist
  ...
}
```

If `plan` is still `"free"`:
- Webhook fired but didn't save plan
- Check webhook logs in Stripe Dashboard
- Check server logs for errors

---

## STEP 8: Manual Webhook Testing (Advanced)

### Install Stripe CLI
[Download from Stripe](https://stripe.com/docs/stripe-cli)

### Test webhook locally:
```bash
# Terminal 1: Listen to webhooks
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Copy the webhook signing secret (starts with whsec_)
# Put it in .env as STRIPE_WEBHOOK_SECRET=whsec_...
# Restart server

# Terminal 2: Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

Watch server logs - should see webhook processing logs.

---

## STEP 9: Verify Frontend Display

After successful payment:

1. Browser should redirect to `http://localhost:3000/account`
2. Should show:
   - **Plan:** Professional (NOT Free)
   - **Subscription Status:** Active (NOT Inactive)
   - **Next Billing Date:** [date]

If it still shows "Free":
- Refresh the page
- Clear browser cache (Ctrl+Shift+Delete)
- Log out and log back in
- Check `/api/auth/me` endpoint:
  ```bash
  curl -H "Authorization: Bearer [your-token]" http://localhost:3000/api/auth/me | jq .
  ```

---

## Troubleshooting Decision Tree

```
Payment completed?
├─ Yes
│  └─ Check server logs for [CHECKOUT] messages
│     ├─ Logs show [CHECKOUT]...
│     │  └─ Webhook configured? Check Stripe Dashboard
│     │     ├─ Yes
│     │     │  └─ Webhook fired? Check Stripe events
│     │     │     ├─ Yes
│     │     │     │  └─ Check database with debug endpoint
│     │     │     │     ├─ plan still "free"?
│     │     │     │     │  └─ → Go to STEP 6 (webhook data)
│     │     │     │     └─ plan is correct?
│     │     │     │        └─ → FIXED! ✓
│     │     │     └─ No
│     │     │        └─ → Register webhook in Stripe Dashboard
│     │     └─ No
│     │        └─ → Register webhook endpoint URL in Stripe Dashboard
│     └─ No [CHECKOUT] logs?
│        └─ Checkout session not created
│           └─ → Check STRIPE_PRICE_* in .env
└─ No
   └─ → Stripe checkout not loading
      └─ → Check STRIPE_SECRET in .env
```

---

## Questions to Answer

Before contacting support, have these ready:

1. What does `/api/debug/stripe-config` show?
   ```bash
   curl http://localhost:3000/api/debug/stripe-config
   ```

2. What does `/api/debug/subscription/cus_xxxxx` show?
   ```bash
   curl http://localhost:3000/api/debug/subscription/cus_xxxxx
   ```

3. What do the server logs show when making payment?
   ```bash
   # Look for [CHECKOUT] or [ERROR] messages
   npm start | grep -i checkout
   ```

4. What events are in Stripe Dashboard webhook?
   - Go to Developers → Webhooks → Find your endpoint → Recent events

5. What does the database show?
   ```bash
   mongosh
   use obfusly
   db.users.findOne({ email: "your-email@example.com" })
   ```

Provide answers to these and we can fix it!
