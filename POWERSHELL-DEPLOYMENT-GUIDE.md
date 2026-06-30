# 🚀 DRISHTI VEDIC+ v2.0 — PowerShell Deployment Guide

**For:** Ankit Sir, Shivanchal Consultants  
**Platform:** Windows 10/11 + PowerShell  
**Time to deploy:** 25 minutes (first time), 2 minutes (subsequent updates)  
**End state:** Live URL on Vercel with full DRISHTI Vedic + Numerology platform

---

## 🎯 WHAT YOU'LL GET AT THE END

A live, public URL like `https://drishti-vedic.vercel.app` (or `drishti.shivanchal.in` after DNS) showing:

- ✅ **Home page** — Birth chart + Mulank + Bhagyank + Naamank + Soul + Kua numbers in one view
- ✅ **Lo Shu Grid** — 3×3 visual with arrows of strength/weakness
- ✅ **Compatibility page** (`/match`) — Unique DRISHTI Score (100-point system)
- ✅ **API endpoints** — `/api/kundli`, `/api/numerology`, `/api/drishti-score`
- ✅ **Mock mode working** — Runs without ANY API keys (all numerology is pure math)
- ✅ **Production-ready** — Add real Prokerala/Gemini keys when ready

---

## 📋 PRE-REQUISITES CHECKLIST (Do These ONCE)

Before running any of the steps below, make sure aap ke laptop pe ye install ho:

### 1. Node.js v20+ (Required)
Open PowerShell aur check karein:
```powershell
node --version
```
- ✅ If you see `v20.x.x` or higher → skip
- ❌ If not installed → download from **https://nodejs.org** (LTS version, pick the .msi installer)
- After install, **close PowerShell aur naya window kholein** (PATH refresh karne ke liye)

### 2. Git (Required)
```powershell
git --version
```
- ✅ If you see `git version 2.x.x` → skip
- ❌ If not installed → download from **https://git-scm.com/download/win**
- During install, accept all defaults

### 3. GitHub account (Required)
- Sign up at **https://github.com** if you don't have one
- Use email: `ankitdubey.aitech@gmail.com` (or your preferred)

### 4. Vercel account (Required, free tier OK)
- Sign up at **https://vercel.com** using GitHub login (easiest)

### 5. PowerShell Execution Policy (One-time fix for npm)
Open PowerShell **as Administrator** (right-click → Run as Administrator) and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Type `Y` when prompted. Close admin PowerShell. **All other commands use regular PowerShell.**

---

## 🛠️ STEP-BY-STEP DEPLOYMENT (Copy each block, paste into PowerShell, hit Enter)

### STEP 1 — Open PowerShell at your chosen folder

Press `Windows + R`, type `powershell`, hit Enter. Then navigate to E: drive:
```powershell
Set-Location E:\
```

If you want a dedicated folder for DRISHTI:
```powershell
New-Item -ItemType Directory -Path "E:\drishti" -Force | Out-Null
Set-Location E:\drishti
```

### STEP 2 — Extract the ZIP

You'll have `drishti-mvp-v2.zip` from the chat. Move it to `E:\drishti\` (or wherever you ran Step 1).

Extract using PowerShell:
```powershell
Expand-Archive -Path .\drishti-mvp-v2.zip -DestinationPath . -Force
Set-Location .\drishti-v2
```

Verify files extracted:
```powershell
Get-ChildItem
```
You should see: `app/`, `components/`, `lib/`, `supabase/`, `package.json`, `.env.example`, etc.

### STEP 3 — Install dependencies (one-time, ~3-5 minutes)

```powershell
npm install
```

⏳ Wait for the spinner to finish. You'll see ~250 packages installed. Warnings about deprecated packages are normal — ignore them.

If you see an **error** about execution policy, go back to Pre-requisite #5.

### STEP 4 — Create the .env.local file (mock mode for now)

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` in Notepad to view (don't edit yet — mock mode works without keys):
```powershell
notepad .env.local
```
Close Notepad after looking. **The app runs perfectly in mock mode** — all numerology is real math, only astrology + AI narration use mocks. Add real keys later.

### STEP 5 — Test it locally FIRST

```powershell
npm run dev
```

You'll see output like:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
✓ Ready in 2.1s
```

**Open your browser** and go to `http://localhost:3000`

Test it:
1. Click **"Use sample data"** button
2. Click **"Generate Complete DRISHTI Reading →"**
3. Wait 3 seconds
4. See 4 tabs: **Astrology, Numerology, Lo Shu Grid, DRISHTI Reading** ✨
5. Then visit `http://localhost:3000/match` to test the DRISHTI Score (100-point system)
6. Click **"Use sample data"** there too, then **"Calculate Compatibility →"**

**Working?** 🎉 Press `Ctrl+C` in PowerShell to stop the server.

**Not working?** Check the troubleshooting section at the bottom.

### STEP 6 — Push to GitHub (3 minutes)

In PowerShell, still in the `drishti-v2` folder:

```powershell
# Initialize git repo
git init

# Configure git (only if you've never used git on this machine)
git config --global user.name "Ankit Dubey"
git config --global user.email "ankitdubey.aitech@gmail.com"

# Stage all files
git add .

# First commit
git commit -m "Initial commit - DRISHTI Vedic+ v2.0 with Numerology"
```

Now go to **https://github.com/new** in browser:
- Repository name: `drishti-vedic`
- Description: `Vedic Astrology + Numerology Platform`
- **Private** (recommended for now)
- **DO NOT** check "Add a README file"
- Click **"Create repository"**

GitHub will show you a page with commands. Copy the HTTPS URL (looks like `https://github.com/YOUR-USERNAME/drishti-vedic.git`).

Back in PowerShell:
```powershell
# Replace YOUR-USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR-USERNAME/drishti-vedic.git
git branch -M main
git push -u origin main
```

A browser window may pop up asking you to log into GitHub. Log in.

✅ **Code is now on GitHub.**

### STEP 7 — Deploy to Vercel (5 minutes)

Open **https://vercel.com/new** in your browser.

1. Click **"Import Git Repository"**
2. Find `drishti-vedic` from the list → click **"Import"**
3. **Framework Preset:** Next.js (auto-detected — leave as is)
4. **Root Directory:** `./` (leave as is)
5. **Environment Variables:** Skip for now (mock mode works)
6. Click **"Deploy"**

⏳ Wait ~2 minutes for build. You'll see a celebration screen with confetti.

You'll get a URL like `https://drishti-vedic.vercel.app`. **Open it. It's live.** 🚀

### STEP 8 — Test the live URL

Visit `https://drishti-vedic-XXX.vercel.app` (your URL):
1. Use sample data → Generate DRISHTI Reading
2. All 4 tabs work
3. `/match` page works with sample data
4. Mobile responsive (open on phone)

---

## 🔧 ADDING REAL API KEYS (When You're Ready)

Mock mode works for **landing page demo to bureaus**. For real bureau onboarding (Day 7+), get real keys:

### A. Prokerala API (Astrology) — ₹0 for first 1,000 calls/month
1. Sign up at **https://api.prokerala.com**
2. Settings → API Keys → Copy `client_id` and `client_secret`
3. In **Vercel dashboard** → your project → **Settings** → **Environment Variables**:
   - Add `PROKERALA_CLIENT_ID` = (paste)
   - Add `PROKERALA_CLIENT_SECRET` = (paste)
4. Click **"Save"** → **Redeploy** (Deployments tab → 3 dots → Redeploy)

### B. Google Gemini (AI Narration) — Free tier 1,500 requests/day
1. Visit **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"** → Copy the key
3. Vercel → Settings → Environment Variables:
   - Add `GEMINI_API_KEY` = (paste)
4. Save → Redeploy

### C. Supabase (Auth + DB) — Free tier 500MB
1. Sign up at **https://supabase.com**
2. Create new project, name it `drishti-vedic`
3. Wait ~2 minutes for provisioning
4. Settings → API → Copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)
   - JWT Secret (under JWT Settings)
5. SQL Editor → New Query → paste contents of `supabase/schema-v2.sql` → Run
6. Authentication → Providers → Email → Enable Magic Link
7. Vercel → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` = (service role)
   - `SUPABASE_JWT_SECRET` = (JWT Secret)
8. Save → Redeploy

---

## 🔄 UPDATING YOUR DEPLOYED APP (2-Minute Workflow)

After initial deployment, every code change deploys automatically:

```powershell
# Make your changes in code
# Then:
git add .
git commit -m "Description of what you changed"
git push
```

Vercel detects the push and rebuilds automatically. Live URL updates in ~90 seconds.

---

## 🌐 CUSTOM DOMAIN (drishti.shivanchal.in)

Once you have a custom domain in BigRock or wherever:

1. Vercel → Project → **Settings** → **Domains**
2. Add `drishti.shivanchal.in`
3. Vercel will give you a **CNAME record** like `cname.vercel-dns.com`
4. Go to your domain registrar (BigRock)
5. DNS settings → Add CNAME:
   - Host: `drishti`
   - Points to: `cname.vercel-dns.com`
   - TTL: 1 hour
6. Wait 10-30 minutes for DNS propagation
7. Your site is live at `https://drishti.shivanchal.in` with auto-SSL

---

## 🆘 TROUBLESHOOTING

### "npm: command not found"
- Node.js not installed or PATH not refreshed
- Close PowerShell, open new window, try again

### "execution of scripts is disabled on this system"
- Run Pre-requisite #5 (Set-ExecutionPolicy)

### `npm install` shows errors
- Try: `npm install --legacy-peer-deps`
- If still failing: `Remove-Item -Recurse -Force node_modules; npm install`

### Local site shows "Module not found"
- Restart dev server: `Ctrl+C` then `npm run dev` again

### Vercel build fails
- Check the build log on Vercel dashboard
- Most common: TypeScript error → fix locally, push again
- Or: missing dependency → check `package.json` has all packages

### "PROKERALA_CLIENT_ID is not defined" (after adding keys)
- Vercel doesn't auto-redeploy on env var changes
- Go to **Deployments** → latest one → 3 dots → **"Redeploy"**

### Lo Shu Grid not showing properly
- Hard refresh: `Ctrl+Shift+R`
- Or clear browser cache

### Numerology calculations look wrong
- All calculations are deterministic — same input = same output
- Mulank uses **day of birth** (e.g., born 23rd → 2+3 = 5)
- Bhagyank uses **full DOB sum** (master numbers 11/22/33 preserved)
- Kua uses **birth year + gender** (special rules for 2000+)
- Check `lib/numerology.ts` for the math

---

## 📞 QUICK REFERENCE CARD

```powershell
# Start dev server
Set-Location E:\drishti\drishti-v2
npm run dev

# Stop dev server
Ctrl+C

# Push changes to live
git add .
git commit -m "your message"
git push

# Install new dependency
npm install <package-name>

# Force rebuild
Remove-Item -Recurse -Force .next
npm run build

# Check what changed
git status
git diff
```

---

## 🎯 WHAT TO DO RIGHT NOW (5-Minute Quickstart)

If aap abhi sirf "Yeh kaam karta hai ya nahi" verify karna chahte hain:

```powershell
# 1. Open PowerShell

# 2. Navigate to where you put the ZIP
Set-Location E:\drishti

# 3. Extract
Expand-Archive .\drishti-mvp-v2.zip -DestinationPath . -Force
Set-Location .\drishti-v2

# 4. Install (3-5 min wait)
npm install

# 5. Copy env file
Copy-Item .env.example .env.local

# 6. Run
npm run dev

# 7. Open http://localhost:3000 in browser
# 8. Click "Use sample data" → "Generate Complete DRISHTI Reading"
# 9. See magic happen
```

If this works locally → proceed to Step 6 (GitHub) → Step 7 (Vercel).

If it doesn't work → screenshot the error in PowerShell and reply in chat.

---

## 🎁 BONUS: One-Command Deployment Script

A ready-to-run PowerShell script `deploy\deploy.ps1` is included. To use:

```powershell
# After extracting ZIP and installing dependencies:
.\deploy\deploy.ps1
```

This runs all checks and tells you exactly what to do next. Useful for first-time deployment.

---

**Built by:** Shivanchal Consultants (Ankit Dubey, Bhopal)  
**Version:** 2.0 — June 2026  
**Differentiator:** Only Vedic platform in India with unified 100-point DRISHTI Score (Astrology + Numerology)

🚀 **Aap launch ke liye taiyaar hain. Go.**
