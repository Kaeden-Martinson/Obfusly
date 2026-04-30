# Quick Subscription Diagnostic Steps

## 🔍 STEP 1: Check Your Configuration
```bash
curl http://localhost:3000/api/debug/stripe-config
```

**What to look for:**
- All plans should show `"configured": true`
- Should NOT see `"placeholder"` in any stripePriceId
- Should see checkmarks (✓) for all configured items

**If you see errors like:**
```
❌ professional: stripePriceId is placeholder
```
Your `.env` file is missing:
```env
STRIPE_PRICE_PROFESSIONAL=price_xxxxx
STRIPE_PRICE_ENTERPRISE=price_xxxxx
```

---

## 🔍 STEP 2: Test a Payment
1. Log in to your test account (or create new one)
2. Go to Pricing
3. Click "Get Started" for Professional plan
4. Use Stripe test card: `4242 4242 4242 4242` | 12/25 | 123
5. Complete payment

**Watch the server logs** - you should see:
```
[CHECKOUT] Creating session for plan: professional
[CHECKOUT] User found: <userId>, current plan: free
[CHECKOUT] Plan config: { name: 'Professional', price: 19.99, stripePriceId: 'price_xxxxx' }
[CHECKOUT] Session created: cs_test_xxxxx
```

---

## 🔍 STEP 3: Check What Stripe Recorded
After payment completes, immediately check Stripe Dashboard:

1. Go to **Stripe Dashboard**
2. Go to **Customers**
3. Find your customer (search by email)
4. Click on them
5. Scroll to **Subscriptions** section
6. You should see a new subscription with status `active`
7. Copy the Customer ID (starts with `cus_`)

---

## 🔍 STEP 4: Debug With Customer ID
```bash
curl http://localhost:3000/api/debug/subscription/cus_UQlAMx5PpDZtS2
```

Replace `cus_UQlAMx5PpDZtS2` with your actual customer ID from Step 3.

**Good response should show:**
```json
{
  "customerExists": true,
  "userInDb": true,
  "user": {
    "plan": "professional",
    "subStatus": "active",
    "stripeSubId": "sub_xxxxx"
  },
  "stripeSubscriptions": [
    {
      "id": "sub_xxxxx",
      "status": "active",
      "priceId": "price_xxxxx"
    }
  ]
}
```

**Bad response - `"plan": "free"`:**
- Webhook didn't fire
- Plan name not passed to webhook
- Webhook didn't save the plan

---

## 🔍 STEP 5: Check Database Directly
```bash
# Start MongoDB shell
mongosh

# Connect to database
use obfusly

# Find your user by email
db.users.findOne({ email: "your-email@example.com" })
```

Should show:
```
plan: "professional"
subStatus: "active"
stripeSubId: "sub_xxxxx"
```

If `plan` is still `"free"`, the webhook didn't save it.

---

## 🔍 STEP 6: Check Webhook in Stripe Dashboard
1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Find the webhook endpoint for your server
3. Click on it
4. Scroll to **Recent events**
5. Look for `checkout.session.completed` event
6. Click on it to see what Stripe sent

**Check if it shows:**
- `metadata.planName` = "professional" or "enterprise"
- `subscription` = subscription ID (should NOT be null)

If `metadata.planName` is missing, the problem is in [server.js](server.js#L640).

---

## 🔍 STEP 7: Manually Trigger Webhook (Local Testing)

If you have **Stripe CLI** installed:

```bash
# Terminal 1: Listen for webhooks
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Copy the webhook signing secret it gives you
# Put it in your .env as STRIPE_WEBHOOK_SECRET=whsec_xxxxx
# Restart server

# Terminal 2: Trigger test events
stripe trigger checkout.session.completed
```

Check server logs for webhook processing messages.

---

## 🔏 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `plan: "free"` after payment | Webhook not saving plan | Check logs for `[CHECKOUT]` messages |
| `subStatus: "inactive"` | Webhook didn't set status | Verify metadata.planName in webhook event |
| `stripeSubId: null` | Subscription ID not saved | Check if session.subscription exists in webhook |
| 404 on debug endpoint | Stripe not configured | Check `STRIPE_SECRET` in .env |
| Payment redirects to home | No checkout success handler | Check [app.js line 2660](Frontend/Javascript/app.js#L2660) |

---

## 📋 Checklist Before Going Live

- [ ] `STRIPE_SECRET` set to `sk_live_...` (not `sk_test_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` registered in Stripe Dashboard
- [ ] `STRIPE_PRICE_PROFESSIONAL` set to real price ID
- [ ] `STRIPE_PRICE_ENTERPRISE` set to real price ID
- [ ] `DOMAIN` environment variable set to your production domain
- [ ] Webhook endpoint registered in Stripe Dashboard
- [ ] Test payment completes successfully
- [ ] Database shows correct plan after payment
- [ ] Frontend displays correct plan on account page
- [ ] Server logs show `[CHECKOUT]` and `[SUBSCRIPTION]` messages

---

## Quick Test Script

Save as `test-subscription.sh`:

```bash
#!/bin/bash

echo "=== Checking Stripe Configuration ==="
curl -s http://localhost:3000/api/debug/stripe-config | jq '.plans'

echo ""
echo "=== Sample Customer Debug ==="
echo "Replace cus_UQlAMx5PpDZtS2 with your customer ID"
echo "curl http://localhost:3000/api/debug/subscription/cus_UQlAMx5PpDZtS2 | jq"
```

---

## Need More Help?

1. **Check server logs** - look for `[CHECKOUT]` or `[SUBSCRIPTION]` or `[ERROR]`
2. **Check Stripe Dashboard** - verify customer and subscription exist
3. **Check database directly** - verify plan was saved
4. **Check webhook events** - verify Stripe sent the data
5. **Use debug endpoints** - `/api/debug/stripe-config` and `/api/debug/subscription/:customerId`

The issue is usually one of these:
- Missing/placeholder Stripe price IDs
- Webhook not registered in Stripe Dashboard
- Webhook secret wrong in .env
- Metadata not being passed to checkout session
- Webhook not firing at all
