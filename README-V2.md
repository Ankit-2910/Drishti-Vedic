# 🔮 DRISHTI Vedic+ v2.0 — Master README

**Where Vedic Astrology meets Vedic Numerology**

A complete Vedic platform built for matrimonial bureaus, individuals, and consultants. Unique in India for combining astrology + numerology into a **single 100-point compatibility score**.

Built by **Shivanchal Consultants** (Ankit Dubey, Bhopal) · June 2026

---

## 🆚 v1 → v2 — What's New

| Aspect | v1 (Astrology only) | v2 (NEW) |
|---|---|---|
| **Numerology engine** | ❌ None | ✅ 10 systems (Mulank, Bhagyank, Naamank, Soul, Personality, Kua, Lo Shu, Personal Year, Karmic Debt, Master Numbers) |
| **Compatibility score** | Ashtakoot 36-guna | ✅ **DRISHTI Score 100-point** (unique in India) |
| **Lo Shu Grid** | ❌ | ✅ 3×3 visual with 8 Arrows + thematic meanings per number |
| **Services** | 1 (kundli) | ✅ **14+ services** (Panchang, Hora, Sade Sati, Vastu, Mantras, Lal Kitab, Raj Yoga, Mangal Dosh, Rashifal, etc.) |
| **Hindi labels** | ❌ English-only | ✅ Bilingual Hindi (Devanagari) + English |
| **API endpoints** | 1 | 3 (kundli, numerology, drishti-score) |
| **Database columns** | Basic chart fields | ✅ Mulank, Bhagyank, Kua, Karmic Debts, DRISHTI Score |
| **Mock mode** | Astrology mock | ✅ Numerology is **100% real math** (no mocks ever) |
| **Total files** | ~12 | **39 files** |

---

## ⭐ The DRISHTI Score (The Moat)

No competitor in India offers a unified astrology + numerology score. This is your defensible differentiator:

```
┌─────────────────────────────────────────────────┐
│  DRISHTI SCORE = 100 points                     │
├─────────────────────────────────────────────────┤
│  50 pts → Astrology (Ashtakoot 36-guna)         │
│  25 pts → Numerology (Mulank/Bhagyank/Naamank)  │
│  15 pts → Lo Shu Grid mutual completion         │
│  10 pts → Dosha adjustments (Manglik/Nadi)      │
├─────────────────────────────────────────────────┤
│  85-100 → Exceptional                           │
│  70-84  → Excellent                             │
│  55-69  → Good                                  │
│  40-54  → Average                               │
│  25-39  → Challenging                           │
│   0-24  → Not Recommended                       │
└─────────────────────────────────────────────────┘
```

This is genuinely original. Patent-pending vibes.

---

## 📂 What's in This ZIP

### Application (Next.js 14 + TypeScript)
```
app/
├── page.tsx                          ← Home (chart + numerology)
├── match/page.tsx                    ← DRISHTI Score (compatibility)
├── sevayein/page.tsx                 ← Services hub (matches screenshot)
├── sevayein/panchang/page.tsx        ← दैनिक पंचांग
├── sevayein/hora/page.tsx            ← होरा मुहूर्त
├── sevayein/sade-sati/page.tsx       ← साढ़े साती
├── sevayein/mangal-dosh/page.tsx     ← मंगल दोष
├── sevayein/vastu/page.tsx           ← वास्तु
├── sevayein/mantras/page.tsx         ← मंत्र जाप
├── sevayein/lal-kitab/page.tsx       ← लाल किताब
├── sevayein/raj-yoga/page.tsx        ← राज योग
├── sevayein/rashifal/page.tsx        ← राशिफल
├── layout.tsx, globals.css           ← Brand tokens, fonts
└── api/
    ├── kundli/route.ts               ← Combined chart + numerology
    ├── numerology/route.ts           ← Pure numerology endpoint
    └── drishti-score/route.ts        ← Unified 100-pt match

components/
├── LoShuGrid.tsx                     ← 3×3 with thematic meanings (NEW)
├── NumerologyCard.tsx                ← 5-number numerology display
├── DrishtiScoreCard.tsx              ← Hero score + breakdown
└── ServicePageWrapper.tsx            ← Shared profile wrapper

lib/
├── numerology.ts                     ← 10-system engine (~600 lines, pure math)
├── drishti-score.ts                  ← Unified 100-pt scorer
├── panchang.ts                       ← Tithi/Nakshatra/Yoga/Karana
├── sade-sati.ts                      ← Saturn 7.5yr transit analyzer
├── services.ts                       ← Hora/Vastu/Mantras/Lal Kitab/Raj Yoga/Mangal Dosh
├── profile-storage.ts                ← localStorage helper
├── prokerala.ts                      ← Astrology API + mock
├── gemini.ts                         ← AI narration (thinkingBudget:0)
└── supabase.ts                       ← DB clients

supabase/
└── schema-v2.sql                     ← Full DB schema with numerology cols

deploy/
└── deploy.ps1                        ← Optional one-command PowerShell helper

POWERSHELL-DEPLOYMENT-GUIDE.md        ← Step-by-step Windows deployment
README-V2.md                          ← This file
```

---

## 🔢 The 10 Numerology Systems

All real math. No mocks ever. Free forever.

| # | System | What It Reveals |
|---|---|---|
| 1 | **Mulank** (Driver) | Core personality, born-day energy |
| 2 | **Bhagyank** (Destiny/Life Path) | Life purpose, karmic mission |
| 3 | **Naamank** (Name, Chaldean) | How world perceives you |
| 4 | **Soul Number** (vowels) | Inner desires, heart's longing |
| 5 | **Personality Number** (consonants) | Outer image, social mask |
| 6 | **Kua** (Feng Shui) | East/West group, 8 directions |
| 7 | **Lo Shu Grid** (3×3 magic square) | Strengths, missing lessons, 8 Arrows |
| 8 | **Personal Year** | Annual energy cycle (1-9) |
| 9 | **Karmic Debt** (13/14/16/19) | Past-life patterns to resolve |
| 10 | **Master Numbers** (11/22/33) | Spiritual potency (preserved) |

---

## 🏛️ The 14+ Services (Matches Your Competitor Screenshot)

### Vedic Astrology (वैदिक ज्योतिष)
1. **जन्म कुंडली** (Birth Chart) — Home page, full chart
2. **गुण मिलान** (DRISHTI Score) — Unified 100-pt match
3. **दशा विश्लेषण** (Dasha) — Mahadasha/Antardasha in chart
4. **राज योग** — Auspicious combinations detector
5. **साढ़े साती** (Sade Sati) — Saturn 7.5yr transit phases
6. **मंगल दोष** — Mars dosha + remedies
7. **होरा मुहूर्त** — Live planetary hour (auto-refresh)
8. **दैनिक पंचांग** — Daily Vedic calendar

### Numerology (अंक विज्ञान)
9. **अंक ज्योतिष** — Full numerology report
10. **लो शू ग्रिड** — 3×3 deep-dive
11. **नाम अंक विज्ञान** — Name analysis
12. **संख्या ज्योतिष** — Lucky numbers

### Remedies (उपाय)
13. **मंत्र जाप** — Personalized by Mulank
14. **वास्तु** — Direction from Kua
15. **लाल किताब** — 9 planet remedies
16. **राशिफल** — Daily horoscope

---

## 🚀 Deployment (5-Minute Quickstart)

```powershell
# 1. Extract ZIP
Set-Location E:\drishti
Expand-Archive .\drishti-mvp-v2.zip -DestinationPath . -Force
Set-Location .\drishti-v2

# 2. Install dependencies
npm install

# 3. Setup env (mock mode)
Copy-Item .env.example .env.local

# 4. Run locally
npm run dev

# 5. Open http://localhost:3000 → test → done!
```

**Full guide:** Open `POWERSHELL-DEPLOYMENT-GUIDE.md` for the complete Windows deployment walkthrough (GitHub, Vercel, custom domain, etc.)

**Automated:** Run `.\deploy\deploy.ps1` for guided one-command setup.

---

## 🔑 API Keys (Optional — App Works Without Them)

| Service | Free Tier | What It Does |
|---|---|---|
| **Prokerala** | 1,000 calls/mo | Real astrology computation (mock used otherwise) |
| **Gemini 2.5 Flash** | 1,500/day | AI narration (thinkingBudget:0 locked) |
| **Supabase** | 500MB DB | Auth + storage |
| **Razorpay** | Per-transaction | B2B partner billing |

**App is fully functional in mock mode** — numerology is real math, astrology + narration use deterministic mocks. Perfect for demos to matrimonial bureaus before any cost is incurred.

---

## 💼 B2B Go-To-Market (Recap from v1)

Already delivered in v1 deliverables (still valid for v2):

- ✅ **B2B partnership contract** (matrimonial bureaus)
- ✅ **Privacy policy** (DPDP Act 2023 compliant)
- ✅ **Terms of service**
- ✅ **DPA** (Data Processing Agreement)
- ✅ **Customer success playbook** (7-day onboarding)
- ✅ **WhatsApp outreach sequence** (14-day Hindi/English)
- ✅ **LinkedIn playbook**
- ✅ **Bureau target list** (50 researched bureaus across Tier-2 India)
- ✅ **Financial model** (break-even Month 3-4)
- ✅ **Operations runbook**

### Pricing (Locked)
- **Partner Starter:** ₹15K/month (100 matches)
- **Partner Pro:** ₹30K/month (500 matches)
- **Enterprise:** Custom

### Beachhead Cities
Bhopal, Indore, Jaipur, Lucknow → expansion through Tier-2 India.

---

## 🛠️ Tech Stack (Locked)

```
Framework:     Next.js 14.2 (App Router) + TypeScript
Styling:       Tailwind CSS + custom brand tokens
Fonts:         Fraunces (serif) + Manrope (sans) + JetBrains Mono
Database:      Supabase PostgreSQL (ap-south-1)
Auth:          Supabase Magic Link
Astrology:     Prokerala API (with deterministic mock fallback)
AI:            Gemini 2.5 Flash (thinkingBudget:0 + JSON mode)
Billing:       Razorpay (subscriptions)
Hosting:       Vercel (auto-deploy from GitHub)
Mobile:        Mobile-first responsive (Expo wrapper planned for Phase 3)
```

**Numerology engine = 0 external dependencies. Pure TypeScript math. Runs instant, free, forever.**

---

## 📊 Why This Wins

1. **Unique DRISHTI Score** — No Indian competitor combines astrology + numerology into 100-pt metric
2. **14+ services** — Matches the breadth of AstroSage/AstroTalk
3. **Hindi-first UI** — Tier-2 bureau owners prefer Hindi/Hinglish
4. **Real math, no mocks** — Numerology is genuinely accurate (not LLM-generated)
5. **Mobile-first** — Tier-2 audience is mobile-primary
6. **Production-grade** — Auth, billing, RLS, DPDP compliance, RLS, B2B contracts all done
7. **Zero recurring cost in mock mode** — Demos can happen without burning ₹1
8. **Differentiated branding** — DRISHTI ("vision") name + dark/gold aesthetic
9. **Tier-2 pricing** — ₹15K starter ≤ competitor monthly costs
10. **B2B sales infrastructure ready** — Contract, DPA, target list, sequences all delivered

---

## 🔥 Recommended Next Actions (in order)

1. **TODAY**: Extract ZIP → `npm install` → `npm run dev` → verify locally
2. **TOMORROW**: Push to GitHub → Deploy to Vercel → Get live URL
3. **DAY 3**: Custom domain (drishti.shivanchal.in via BigRock CNAME)
4. **DAY 4**: Record 60-second demo video showing DRISHTI Score in action
5. **DAY 5**: Start WhatsApp outreach to first 10 bureaus from the target list
6. **WEEK 2**: Add real Prokerala + Gemini keys → upgrade from mock to live
7. **WEEK 3**: Connect Supabase → enable auth + chart persistence
8. **WEEK 4**: First paid partner (target: ₹15K/month deal)

---

## 🆘 Support

- **POWERSHELL-DEPLOYMENT-GUIDE.md** — Full Windows deployment walkthrough
- **deploy\deploy.ps1** — Run for guided one-command setup
- **lib/numerology.ts** — All calculation source code (open and readable)
- **supabase/schema-v2.sql** — Database schema (run once in Supabase SQL editor)

---

## 📜 Credits

**Built by:** Ankit Dubey, Co-Founder/COO, Shivanchal Consultants  
**For:** Matrimonial bureaus, individual consultants, and B2B partners across India  
**Brand:** DRISHTI Vedic+ (दृष्टि — "vision" in Sanskrit)  
**Inspired by:** Classical Vedic texts (BPHS, Phaladeepika, Saravali, Ank Shastra), modern competitor research (AstroSage, AstroTalk competitor parity)

---

**Aap launch ke liye taiyaar hain. 🚀**

— DRISHTI Vedic+ v2.0 · June 2026 · Bhopal

---

## 🆕 v2.1 UPDATE — Major Feature Additions

This build adds everything requested plus competitive must-haves:

### ✅ Fixed: 4 Previously-Broken Pages (now fully working)
- **दशा विश्लेषण / Dasha Analysis** (`/sevayein/dasha`) — Full Vimshottari 120-year timeline with current Mahadasha + Antardasha highlighting, computed from your Moon nakshatra
- **लो शू ग्रिड / Lo Shu Grid Deep-Dive** (`/sevayein/lo-shu`) — Standalone grid with life-area themes + arrows
- **नाम अंक विज्ञान / Name Numerology** (`/sevayein/name-numerology`) — Chaldean name analysis + Naamank↔Mulank harmony check
- **संख्या ज्योतिष / Number Astrology** (`/sevayein/sankhya`) — Lucky-number checker for phone/vehicle/house/business

### ✅ Bilingual (English + हिन्दी)
- Global **EN / हिं language toggle** in the top bar (preference remembered)
- The **AI reading (narration) now outputs BOTH languages** — English paragraph block, then full Hindi (Devanagari) block
- All new pages + login + comparison page respond to the toggle
- Noto Sans Devanagari font loaded for crisp Hindi rendering

### ✅ Client Login (registered email)
- **Magic-link login** via Supabase (`/login`) — enter registered email → secure link
- **Demo-mode fallback** — works instantly without any keys (perfect for demos), upgrades to real magic links once Supabase keys are added
- Login state shown in top bar with logout

### ✅ OM Dhwani Background Sound
- Floating **ॐ button** (bottom-right) — one tap to start the meditative drone
- Layered Web Audio synth: 136.1 Hz OM fundamental + harmonics + subtle 9999 Hz shimmer + slow "breathing" modulation
- Preference remembered; honest design (browsers block autoplay, so it's one-tap)

### ✅ Competitive Must-Haves (the "way ahead" feel)
- **Why DRISHTI page** (`/why-drishti`) — side-by-side comparison table vs other astro sites, highlighting the DRISHTI Score moat
- **Print / PDF export** — clean print stylesheet on every result page (browser "Save as PDF")
- **WhatsApp share** buttons on results — critical for the Indian matrimonial market
- **Sticky top navigation** with brand, services, match, why-drishti, language, login

### 🔧 Verified
- `npx tsc --noEmit` → **0 errors**
- `npm run build` → **✓ Compiled successfully, 24/24 pages generated**
