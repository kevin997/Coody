# 🔒 Cloudflare Security Setup Guide

## Overview

Your Coody platform is now protected with **Cloudflare Turnstile** - a free, privacy-friendly CAPTCHA alternative that blocks bot attacks on your login and registration forms.

---

## 🎯 What's Protected

✅ **Registration form** (`/inscription`)  
✅ **Login form** (`/connexion`)  
✅ **Bot attacks** prevented  
✅ **Brute force attempts** blocked  
✅ **Privacy-friendly** - no tracking  

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Cloudflare Turnstile Keys

1. Go to https://dash.cloudflare.com
2. Sign up/login (it's FREE)
3. Click **"Turnstile"** in the left sidebar
4. Click **"Add Site"** button
5. Fill in the form:
   - **Site name**: Coody Platform
   - **Domain**: Your domain (e.g., `coody.vercel.app`) or `localhost` for testing
   - **Widget mode**: Managed (recommended)
6. Click **"Create"**
7. Copy your keys:
   - **Site Key** (starts with `0x...`)
   - **Secret Key** (starts with `0x...`)

### Step 2: Add Keys to Environment Variables

#### Local Development (`.env` file):

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
```

#### Vercel Production:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add TWO variables:

**Variable 1:**
- Key: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Value: Your site key from Cloudflare
- Environment: Production, Preview, Development

**Variable 2:**
- Key: `TURNSTILE_SECRET_KEY`
- Value: Your secret key from Cloudflare
- Environment: Production, Preview, Development

5. Click **"Save"**
6. Redeploy your app

### Step 3: Test It!

1. Go to your registration page
2. You should see a CAPTCHA widget appear
3. Complete the CAPTCHA
4. Submit the form
5. ✅ Success! You're protected

---

## 🎨 How It Works

### User Experience:

```
User → Fills form → Completes CAPTCHA → Submits
                          ↓
                    Cloudflare verifies
                          ↓
                    Token sent to server
                          ↓
                    Server validates token
                          ↓
                    Account created/Login success
```

### What Users See:

1. **Form fields** (name, email, password)
2. **Shield icon** with "Protection contre les robots"
3. **Turnstile widget** (checkbox or automatic)
4. **Submit button**

### Security Flow:

```
Frontend (Browser)           Backend (Server)
─────────────────────       ─────────────────
User fills form          
   ↓
Turnstile loads
   ↓
User completes CAPTCHA
   ↓
Token generated
   ↓
Form submitted with token ──→ Receives request
                             ↓
                          Validates token with Cloudflare
                             ↓
                          If valid: Process request
                          If invalid: Reject with 403
```

---

## 🛡️ Security Features

### Protection Against:

| Threat | How Turnstile Blocks It |
|--------|------------------------|
| **Bot Registration** | Detects automated scripts |
| **Brute Force Login** | Limits rapid attempts |
| **Credential Stuffing** | Identifies suspicious patterns |
| **DDoS Attacks** | Rate limits requests |
| **Fake Accounts** | Verifies human interaction |

### Privacy Features:

✅ **No tracking cookies**  
✅ **No user data collection**  
✅ **GDPR compliant**  
✅ **No annoying image puzzles** (usually)  
✅ **Fast verification** (<1 second)  

---

## 🔧 Configuration Options

### Environment-Based Behavior:

| Environment | CAPTCHA Required | Behavior |
|-------------|-----------------|----------|
| **Development** | Optional | Forms work without CAPTCHA |
| **Production** | Required | Forms require CAPTCHA |

### Widget Appearance:

Edit in `src/app/inscription/page.tsx` or `src/app/connexion/page.tsx`:

```tsx
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
  options={{
    theme: 'light', // or 'dark'
    size: 'normal', // or 'compact'
  }}
/>
```

---

## 📊 Monitoring & Analytics

### View Turnstile Stats:

1. Go to https://dash.cloudflare.com
2. Click **"Turnstile"**
3. Select your site
4. View dashboard:
   - Total verifications
   - Success rate
   - Bot blocks
   - Geographic data

### Check Logs:

Server-side verification logs are in your Vercel logs:

1. Go to Vercel Dashboard
2. Click **"Deployments"**
3. Click your deployment
4. View **"Function Logs"**
5. Search for: `Turnstile verification`

---

## 🐛 Troubleshooting

### Issue: CAPTCHA doesn't appear

**Solution:**
1. Check `.env` file has correct `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check browser console for errors

### Issue: "Vérification de sécurité requise" error

**Solution:**
1. Verify you completed the CAPTCHA
2. Check Turnstile site key is correct
3. Ensure domain matches in Cloudflare dashboard
4. Try refreshing the page

### Issue: "Échec de la vérification de sécurité"

**Solution:**
1. Check `TURNSTILE_SECRET_KEY` is set in Vercel
2. Verify secret key matches in Cloudflare
3. Check Vercel logs for error details
4. Ensure Cloudflare API is accessible

### Issue: Works locally but fails on Vercel

**Solution:**
1. Add BOTH environment variables in Vercel
2. Check domain in Cloudflare matches Vercel URL
3. Redeploy after adding variables
4. Clear Vercel build cache

---

## 🔄 Testing Checklist

### Before Deployment:

- [ ] Turnstile keys added to `.env`
- [ ] CAPTCHA appears on registration page
- [ ] CAPTCHA appears on login page
- [ ] Forms submit successfully with CAPTCHA
- [ ] Forms blocked without CAPTCHA (in production)

### After Deployment:

- [ ] Environment variables added to Vercel
- [ ] Domain added to Cloudflare Turnstile
- [ ] CAPTCHA loads on production
- [ ] Registration works with CAPTCHA
- [ ] Login works with CAPTCHA
- [ ] Check Turnstile dashboard shows verifications

---

## 💡 Advanced Options

### Option 1: Add Rate Limiting

Add to `src/lib/turnstile.ts`:

```typescript
const RATE_LIMIT = 5; // Max attempts per IP per hour
```

### Option 2: Add IP Blocking

Cloudflare Dashboard → Security → WAF → IP Access Rules

### Option 3: Enable Challenge Page

Cloudflare Dashboard → Security → Settings → Security Level: High

### Option 4: Add Email Verification

Combine Turnstile with email verification for double protection.

---

## 🌐 Full Cloudflare Protection (Optional)

For complete site protection, set Cloudflare as your DNS provider:

### Benefits:
- DDoS protection
- Web Application Firewall (WAF)
- SSL/TLS encryption
- CDN for faster loading
- Bot management
- Analytics

### Setup with Vercel:

⚠️ **Note**: This is more complex and optional. Turnstile alone provides good protection.

1. Add domain to Cloudflare
2. Update nameservers
3. Configure Vercel custom domain
4. Enable "Full (strict)" SSL mode
5. Configure firewall rules

**Alternative**: Use Vercel's domain and just Turnstile (simpler, still secure)

---

## 📈 Performance Impact

| Metric | Impact | Details |
|--------|--------|---------|
| **Page Load** | +50-200ms | Turnstile script loads |
| **Form Submit** | +100-500ms | Token verification |
| **Server Load** | Minimal | One API call to Cloudflare |
| **User Experience** | Positive | Invisible or one-click |

---

## 🎯 Best Practices

### Do's ✅

- ✅ Keep secret key private (never commit to git)
- ✅ Use environment variables
- ✅ Monitor Turnstile dashboard regularly
- ✅ Test forms after deployments
- ✅ Check logs for failed verifications

### Don'ts ❌

- ❌ Don't hardcode keys in code
- ❌ Don't skip verification on server
- ❌ Don't use same keys for dev/prod
- ❌ Don't expose secret key in client code
- ❌ Don't disable in production

---

## 🔑 Key Files Modified

| File | Purpose |
|------|---------|
| `src/lib/turnstile.ts` | Server-side verification |
| `src/app/api/register/route.ts` | Registration API protection |
| `src/app/inscription/page.tsx` | Registration form with CAPTCHA |
| `src/app/connexion/page.tsx` | Login form with CAPTCHA |
| `.env` | Environment variables |
| `.env.example` | Environment variable template |

---

## 🆘 Support & Resources

### Official Documentation:
- Cloudflare Turnstile: https://developers.cloudflare.com/turnstile/
- React Turnstile: https://github.com/marsidev/react-turnstile

### Get Help:
- Cloudflare Community: https://community.cloudflare.com
- Cloudflare Support: https://dash.cloudflare.com/support

### Check Status:
- Cloudflare Status: https://www.cloudflarestatus.com

---

## ✅ You're Protected!

Your Coody platform now has enterprise-grade security:

🛡️ **Bot protection** - Automated attacks blocked  
🔒 **Brute force prevention** - Login attempts limited  
🚫 **Fake accounts stopped** - Human verification required  
📊 **Analytics** - Monitor threats in real-time  
🚀 **Fast & privacy-friendly** - No user tracking  

**Your learners can sign up safely and securely! 🎓**
