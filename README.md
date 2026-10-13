# Spotter

Spotter is a focused mobile web app that a single gym provides to its 400 members. It answers questions strictly using the gym's own approved records, enables daily check-ins upon arrival, displays personal attendance and balance records, and processes subscription renewals and arrears payments.

---

## Product Summary

Spotter serves as a single source of truth for gym members while automating front desk inquiries and recordkeeping:

- **Record-Grounded Inquiries**: Answers member questions using only the gym's own verified cards. It never guesses, never uses outside general knowledge, and adheres to a strict grounding check before returning answers.
- **Member Self Check-In**: Members verify physical visits by entering a daily rotating 4-digit code during gym operating hours (maximum one check-in per member per day).
- **Private Member Records**: Displays exact attendance counts and dates, itemized balances from the ledger, membership tier, expiration dates, and payment history with receipts.
- **In-App Payments**: Supports subscription renewals and arrears payments via Flutterwave. Verified payments instantly extend membership duration with zero manual staff intervention.
- **Named Front Desk Handoff**: When a record holds no answer, or if a member asks a question from the never-answer list (medical advice, inquiries about other members, staff conduct, or pricing waivers), Spotter returns a concise refusal and seamlessly routes the member to the on-duty front desk officer via WhatsApp with the question pre-filled.
- **Design Persona**: Built for members like Chioma Adeyemi—optimized for low-cost Android smartphones, small mobile data bundles, low battery consumption, and unreliable network connections.

---

## Problem the Product Solves

The gym operates with 400 active members and one front desk managed by two rotating officers, closing at 8:00 PM:

1. **Repetitive Front Desk Inquiries**: Staff are continuously interrupted by the same routine questions (class timetables, guest policies, off-peak hours, attendance tallies, and account balances). After 8:00 PM, members have no way to get answers.
2. **Uncertain and Guessed Answers**: Desk staff frequently rely on memory or cannot locate physical paper ledgers, leading to inconsistent answers.
3. **Disputed Attendance and Payments**: Cash and bank transfer payments recorded late or missed in manual paper receipt books cause friction, embarrassment, and lost subscription revenue. Spotter turns attendance and balance history into verified, auditable facts rather than memories.

---

## Scope

### In Scope (MVP)

Spotter focuses on five member-facing features and dedicated administrative input screens:

- **F-1: Ask About the Gym**: Semantic retrieval over approved shared cards at or below the member's effective tier. Protected by a deterministic rules layer, intent router, vector similarity search, and a digit-grounding verification step.
- **F-2: My Records**: Private records fetched strictly by exact member ID from the server session. Covers personal attendance history, an itemized ledger balance, active tier, expiry dates, and receipts.
- **F-3: Check In**: Member-entered 4-digit daily code during open hours. Active and grace-period members produce at most one check-in per calendar day. Expired members are prompted to renew.
- **F-4: Pay**: Renewal and arrears payments via Flutterwave with unique idempotency keys, pending attempt protection, and automated expiry extension upon webhook verification.
- **F-5: Ask the Desk**: Direct WhatsApp handoff displaying the on-duty staff member's name and pre-populating the inquiry, member number, and name.
- **Staff & Owner Input Screens**:
  - **Staff (DESK)**: Draft shared cards, view/regenerate the daily code, issue member activation codes, and log manual check-ins.
  - **Owner (OWNER)**: Approve and reconfirm shared cards, manage membership plans and member lists, record cash/transfer payments, post charges, and review weekly answer audits.

### Out of Scope (MVP)

- Class bookings, scheduling, and capacity management.
- Push notifications, automated nudges, or background reminders (version one never messages a member first).
- In-app member-to-trainer or member-to-staff messaging.
- Workout tracking, weight logs, or body metric analytics.
- Social leaderboards, streaks, or referral programs.
- Automated door hardware access integration.
- Multi-gym management (architected for a single gym).
- Native iOS or Android mobile applications.
- Automatic recurring monthly billing.

---

## Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js (App Router), TypeScript, React 19 | Responsive web app shell with offline-capable service worker caching |
| **Styling** | Vanilla CSS Modules | Custom design tokens optimized for rapid render and low data overhead |
| **Database** | PostgreSQL on Neon (Free Tier) | Serverless PostgreSQL with `pgvector` extension for 768-dimension embeddings |
| **ORM** | Prisma ORM | Typed data models, dual pooled (`DATABASE_URL`) and direct (`DIRECT_URL`) connections |
| **AI & Embeddings** | Google Gemini API (Free Tier) | `text-embedding-004` (768 dims) for shared card chunks; `gemini-2.5-flash` for intent routing and grounded answer generation |
| **Payments** | Flutterwave | In-app subscription renewals and arrears, signature-verified webhooks |
| **Hosting & Jobs** | Vercel (Hobby) & Vercel Cron | Serverless deployment with two daily cron jobs (daily code rotation and nightly audit sweep) |

---

## Security & Architecture Principles

- **Zero Outside Knowledge**: Answers come exclusively from approved gym records. No general internet knowledge is used.
- **Data Isolation**: Private records (`Member`, `CheckIn`, `LedgerEntry`, `Payment`, etc.) are never embedded, never indexed in vector search, and strictly read by authenticated session member ID.
- **Audit Logging**: Every private read writes to `PrivateAccessLog` to enforce data isolation, and every question writes to `QuestionLog` before responses are returned.
- **Append-Only Accounting**: Balances are calculated dynamically from immutable ledger rows. No database row for payments or ledger entries is ever updated or deleted; corrections use visible adjustment entries.
