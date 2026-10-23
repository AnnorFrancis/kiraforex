# Kira Forex: sample website

A pitch sample for **Lamidi Sikira (Kira Forex)**, founder of Kiraforex Trading Academy and The Kira Foundation, Accra.
Built by Perkins Creative. Plain HTML, CSS and JavaScript: no build step, no internet needed.

## Open it

- Double-click **OPEN-WEBSITE.bat** (uses Python's built-in web server if it is installed, so the 3D always runs), or
- double-click **index.html** (works straight from the folder too).

Useful extras:

- `index.html?pose=1` freezes all motion for clean screenshots.
- The intro plays once per browser tab. Open a new tab to see it again.

## What is in it

| Page | What it does |
| --- | --- |
| `index.html` | The monument hero (KIRA, with Kira standing in the I as a rose candle) over a live 3D scene of the last 64 real gold sessions in glass. Then reach, her story, the four ways to trade, the trade slip calculator, the weekly forecast, the bootcamp tour, her photos, quotes, price with a currency switcher, FAQ, the Foundation. |
| `trading-room.html` | Live session clocks (Sydney, Tokyo, London, New York, DST-safe), a week in the room, real setup format, the calculator, three plans. |
| `academy.html` | The learning path as rising candles, four courses with modules and prices, a live certificate preview. |
| `mentorship.html` | Twelve weeks one to one, who it is for, a four-step application with a bookable intro call. |
| `bootcamps.html` | A 3D globe with arcs from Accra to seven cities, dates and seats, the two-day programme. |
| `about.html` | Her story, photos, The Kira Foundation (request a class), press and speaking. |
| `checkout.html` | Order summary, Mobile Money / card on the provider's page / bank transfer (all simulated; no card numbers are ever entered). |
| `portal.html` | The Atelier: the student area (membership, live-session countdown, setups, course progress, journal, orders). |
| `admin/index.html` | Kira HQ: the owner dashboard (members, revenue, applications, bootcamp seats, post a setup to members, orders, desk insights). Sample data. |
| `policies.html` | Risk disclosure, terms, refunds, privacy. |
| The Desk | The concierge on every page (bottom right): answers prices, where to start, brokers, refunds, tour dates, risk. |

## What is real and what is sample

**Real (from her public channels and the market):**

- Her photos, from her TikTok and Instagram posts. The hero cut-out is her studio photo in a white shirt and navy trousers.
- Follower numbers (23 Oct 2026): Instagram 262K, TikTok 112.2K, YouTube 59.1K, Telegram 32K.
- Her quotes and captions, her YouTube video titles, and the gold, GBPAUD and BTC setups she posted on her free Telegram.
- The two member messages, as shown in her own TikTok post.
- Stages and recognition: Traders Fair South Africa 2025, the Affiliate and Influencers Summit Dubai 2025, the UAE bootcamp 2024, the SmartVision award 2025, a 2024 international award, press in ThisDay 2024 and YEN.com.gh 2023.
- Gold prices: COMEX gold futures, daily, the 64 sessions to 23 Oct 2026. Exchange rates for the currency switcher: 23 Oct 2026.

**Sample, to confirm with the client before launch:**

- **Prices.** Trading Room $99 / $269 / $890; courses $249 / $1,250 / $790 / $199; mentorship $4,800; bootcamp $650 / $1,100.
- **Products.** Course names and modules (built from her YouTube topics), and the bootcamp cities, dates, venues and seats.
- **Operations.** Mentorship seat count, live-session times, refund terms and the desk email (`desk@kiraforex.com`).
- **Foundation and policies.** The Foundation programme wording, and all policy text, which needs a Ghana-qualified lawyer.
- **Dashboard data.** Everything in Kira HQ and the student area is generated sample data.

## Change things

Everything editable lives in **`assets/js/data.js`**: brand and social links, prices, plans, courses, tour dates, quotes, FAQ, the risk warning, exchange rates and the gold data.

- **Colours:** the `:root` block at the top of `assets/css/style.css` (malachite, rose quartz, pearl, champagne).
- **Photos:** `assets/img/full` and `assets/img/thumb`, with the same file name in both. The hero cut-out is `assets/img/full/kira-cutout.webp` (a transparent PNG/WebP).
- **The hero:** the 3D scene is `assets/js/hero3d.js`. The monument markup is at the top of `index.html`.

## Before it goes live

1. A proper photoshoot: full-length cut-outs in her signature suits for the I, plus portrait and desk sets in one light.
2. Real prices, dates, and the broker/affiliate relationship, stated clearly.
3. Legal review of the risk disclosure, terms, refunds and privacy policies. Register with Ghana's Data Protection Commission.
4. Wire payments to a hosted provider (Paystack or Hubtel for Mobile Money and cards), Telegram invites, email.
5. A small CMS so she can update forecasts, setups and tour dates herself.
