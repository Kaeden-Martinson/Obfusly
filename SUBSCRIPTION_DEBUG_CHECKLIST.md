# Subscription Debugging Checklist

## Step 1: Verify Environment Variables
Check that your `.env` file has these variables set:

```bash
# Required Stripe variables
STRIPE_SECRET=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PROFESSIONAL=price_xxxxx
STRIPE_PRICE_ENTERPRISE=price_xxxxx
```

**Action:** 
- Open `.env` file
- Verify all STRIPE_* variables are filled (not placeholder values)
- If using `price_professional_placeholder`, they need real Stripe price IDs
- Restart server after updating .env

---

## Step 2: Verify Stripe Webhook Endpoint Registration
The webhook must be configured in Stripe Dashboard to point to your server.

**In Stripe Dashboard:**
1. Go to Developers → Webhooks
2. Click "Add an endpoint"
3. Set Endpoint URL to: `https://your-domain.com/api/webhook/stripe`
4. Select events to listen for:
   - `checkout.session.completed` ✓
   - `customer.subscription.created` ✓
   - `customer.subscription.updated` ✓
   - `customer.subscription.deleted` ✓
   - `invoice.payment_failed` ✓
5. Copy the webhook secret to your `.env` as `STRIPE_WEBHOOK_SECRET`
6. Restart server

**Test locally with ngrok:**
```bash
# Terminal 1: Start server
npm start

# Terminal 2: Expose local server to internet
ngrok http 3000

# Use the ngrok URL in Stripe Dashboard webhook settings
# Example: https://abc123.ngrok.io/api/webhook/stripe
```

---

## Step 3: Check Stripe Checkout Session Configuration
Verify the checkout session is created with the correct metadata.

**Action:**
1. Start a test payment
2. Check server logs for: `[CHECKOUT] Session - Customer: ... Plan: ...`
3. If you see `Plan: undefined`, the planName isn't being passed

**If planName is undefined:**
- Check [Frontend/Javascript/app.js](Frontend/Javascript/app.js) line ~1115
- Ensure `startCheckout(plan)` is being called with correct plan name
- Verify plan name matches Stripe config: `professional` or `enterprise` (lowercase)

---

## Step 4: Test Webhook Manually (Stripe CLI)
Use Stripe's CLI to simulate webhook events.

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Copy the webhook signing secret it gives you
# Paste it into your .env as STRIPE_WEBHOOK_SECRET
# Restart server

# In another terminal, trigger test events:
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

Check server logs - you should see detailed `[CHECKOUT]` and `[SUBSCRIPTION.UPDATED]` messages.

---

## Step 5: Verify Database Updates
After a test webhook, check the database directly.

**MongoDB Query to check user:**
```javascript
db.users.findOne({ email: "your-test-email@example.com" })
```

Should show:
- `plan`: "professional" or "enterprise" (NOT "free")
- `subStatus`: "active" (NOT "inactive")
- `stripeSubId`: "sub_xxxxx" (subscription ID)

---

## Step 6: Test with Debug Endpoint
Use the debug endpoint to see what Stripe knows about the customer.

```bash
# Replace cus_XXX with your actual Stripe customer ID
curl http://localhost:3000/api/debug/subscription/cus_UQlAMx5PpDZtS2
```

Response should show:
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

---

## Step 7: Check Server Logs for Errors

Look for these log patterns after payment:

**Good logs:**
```
[CHECKOUT] Session - Customer: cus_XXX, Plan: professional, Subscription: sub_XXX
[CHECKOUT] Found user: e8162790-175f-4478-adfd-2927668fc39a
[SUBSCRIPTION] User e8162790-175f-4478-adfd-2927668fc39a upgraded to professional
```

**Bad logs (fix these):**
```
[CHECKOUT] Session - Customer: cus_XXX, Plan: undefined  ← planName not passed
[CHECKOUT] Found user: null  ← User not found in database
[SUBSCRIPTION] Could not fetch subscriptions from Stripe  ← Stripe API error
```

---

## Step 8: Common Issues & Fixes

### Issue: "Plan: undefined" in logs
- **Cause:** planName not in checkout session metadata
- **Fix:** Check `startCheckout()` in [app.js](Frontend/Javascript/app.js#L1115)
- **Should be:** `startCheckout('professional')` with lowercase plan name

### Issue: "Found user: null"
- **Cause:** Stripe customer ID doesn't match database
- **Fix:** Ensure stripeCustId is saved to database BEFORE checkout
- **Check:** User record should have stripeCustId before payment

### Issue: "Could not fetch subscriptions from Stripe"
- **Cause:** Invalid STRIPE_SECRET or Stripe API error
- **Fix:** Verify STRIPE_SECRET is correct sk_test_... or sk_live_...
- **Check:** Test with `stripe trigger` to confirm connection

### Issue: Webhook not firing
- **Cause:** Webhook endpoint not registered in Stripe Dashboard
- **Fix:** Register endpoint URL in Stripe Dashboard
- **Check:** Use Stripe CLI to verify webhook is working

---

## Step 9: Enable Extended Logging
Add this to server.js startup to see more details:

Logs will show:
- Every webhook event received
- Exact data being saved to database
- Any errors from Stripe API calls

---

## Step 10: Test Full Payment Flow

1. **Start fresh:**
   - Clear browser localStorage
   - Log out
   
2. **Create new test account:**
   - Register with test email
   - Verify email
   
3. **Make test payment:**
   - Go to Pricing page
   - Click "Get Started" for Professional plan
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry and any 3-digit CVC
   - Complete payment
   
4. **Check results immediately:**
   - Frontend should navigate to My Account
   - Should show plan as "Professional"
   - Should show status as "Active"
   
5. **Check database:**
   - Query user directly
   - Verify plan, subStatus, stripeSubId are all correct
   
6. **Check logs:**
   - Server logs should show `[CHECKOUT]`, `[SUBSCRIPTION]` messages
   - No errors

---

## Quick Fixes to Try

### Fix 1: Make sure planName is lowercase
```javascript
// In checkout handler, ensure plan name is lowercase
const planName = session.metadata?.planName?.toLowerCase();
```

### Fix 2: Ensure stripeCustId is saved before checkout
```javascript
// In POST /api/payment/create-session
await db.updateSubscription(req.user.sub, { stripeCustId: customer.id });
```

### Fix 3: Force webhook to save complete data
If webhook still not working, add this fallback:
```javascript
// In checkout success redirect
await restoreSession(); // Fetch fresh user data from /api/auth/me
// This will pick up the changes
```

---

## Debugging Commands

```bash
# View server logs in real-time
npm start

# Test Stripe connection
stripe status

# List registered webhooks
stripe logs

# Trigger test webhook
stripe trigger checkout.session.completed

# Check user in database
mongosh
use obfusly
db.users.findOne({ email: "your-email@example.com" })

# Check audit logs
db.audit_logs.find({ action: "SUBSCRIPTION_UPDATED" }).sort({ cAt: -1 }).limit(5)
```

---

## Questions to Answer

1. Do you see `[CHECKOUT]` logs in server console after payment?
2. What does the debug endpoint return?
3. Is your `STRIPE_PRICE_PROFESSIONAL` set to a real price ID (not placeholder)?
4. Did you register the webhook in Stripe Dashboard?
5. Is the webhook secret correct in your .env?

**Answer these and we can pinpoint the exact issue!**
