# spotter

## Description

Spotter is a web app that a single gym gives to its four hundred members. It answers questions using only the gym's own records, lets a member check in, shows her own attendance and balance, and lets her pay her subscription. When the records hold no answer, or the question is on the never answer list, it says so in one sentence and hands the member to the front desk officer by name.

## Who uses it

- Member. The only user of the app. The design persona is Chioma Adeyemi (PRD section 4). Design for a low cost Android phone, small data bundles, unreliable power and no technical help.
- Owner. A record supplier. He never opens the member app. He has his own screens on a separate route behind a separate login. He approves every shared card, maintains the member list and the membership plans, and enters cash and transfer payments. He runs the weekly review and the weekly answer audit.
- Staff. Two front desk officers. They are record suppliers and never open the member app. Members see them only as a name and a WhatsApp link when Spotter cannot answer. Staff may send remote activation codes within the limit in FR-5b. Staff screens never show a member's balance or payment history.

## One thing the agent must do well

Make every answer come from this gym's own records. Never guess. Never use general knowledge. If the records hold no answer, the no answer sentence is fixed: "I do not have that in the gym's records." Add nothing. A medical refusal uses its own fixed wording (FR-36). Every refusal names a specific person.

- Shared records may be searched by meaning.
- Private records are fetched by exact member ID taken from the server session. They are never searched by meaning, never searched across members and never embedded.
- The only cross member read is the member name list used by the rules layer. It reads names only. No other cross member read is allowed.
- Every private read writes an access log row with the session member ID, the target member ID and the function name.
- Every question writes a question log row before the response returns.

## Defined scope for the MVP

Five member facing features. No more.

- F-1 Ask about the gym. Only cards whose status is approved and whose current version is approved enter search, at or below her effective tier (FR-11).
- F-2 My records. Covers her attendance, her balance with every entry listed, her tier and expiry date, and her receipts and payment history. Fetched by exact member ID.
- F-3 Check in. She types the daily four digit code during opening hours. The only controls are those in FR-19, FR-19b and FR-19c. Add no others. One member produces at most one check in per day. A member past grace cannot check in and sees the renewal amount and the pay button. The PRD names two sources for opening hours. Ask which one before writing the time check.
- F-4 Pay. Renewal or arrears through the payment gateway.
  - Every payment starts as a pending attempt with a unique idempotency key.
  - A pending attempt never expires her access.
  - A stale pending attempt becomes abandoned, never failed.
  - The app never stores card details and never holds money.
  - Every success produces a receipt.
  - On a verified success the webhook, in one database transaction, marks the attempt successful, creates the payment and ledger entry, and extends expiry for a renewal. No staff action is needed. An unverified webhook changes nothing.
- F-5 Ask the desk. Names the officer on duty and opens WhatsApp with the question typed in.

The home screen is part of the member app and is not a sixth feature. It shows cached status first, then eight tappable questions the owner configures (PRD 6.2).

Every answer in F-1 and F-2 carries a "this is wrong" report control. Tapping it saves a report linked to the question log, opens a one line note field and thanks the member. It sends nothing to anyone. It is not a sixth feature.

Staff and owner screens are input, not features. Build only these:

- Staff: draft a card, set the daily code, issue an activation code, record a manual check in.
- Owner: approve cards, reconfirm cards, member list, membership plans, record a cash or transfer payment, post a charge, weekly review, weekly answer audit.

Access. The desk issues a one time activation code. The member accepts the privacy notice, then sets a PIN. One member holds one active device at a time. There is no self service reset, no SMS and no email in version one. The PIN is never stored in plain form and never logged.

Launch gates. No member account is activated until the desk tally is done and the minimum approved card count in PRD 5.4 is met. At runtime the app refuses every member question while approved cards are below that minimum (FR-11b). Balance answers go live only after fourteen consecutive days of same day entry, measured as in FR-47b.

Blocking gates in PRD 14.1. Gate A blocks all check in code. Gate B blocks balance answer code and payment amounts. Gate C blocks all payment code. Gate D blocks the go live of balance answers. The 5.4 launch gates are separate.

Data protection. Show the privacy notice before PIN setup. The PRD sets retention and exit export rules (FR-60, FR-61) and names no scheduled job for deletion. Ask before building any deletion or export.

Version one stores this data and builds nothing on it: every expiry date and change, payment history, every check in with timestamp, every unanswered question with full text, every payment attempt with failure reason, every question with outcome, card and score.

## Not in scope for the MVP

- Class booking and capacity.
- Push notifications, reminders and nudges. Version one sends no automated message. It never messages a member first. The PRD does not say how FR-5b delivers a remote code. Ask before building it.
- Trainer chat or member to staff messaging inside the app.
- Progress tracking, weight logs and body metrics.
- Referrals, streaks and leaderboards.
- Door access control.
- Multi gym support. Serve one gym. The schema holds a gym ID. Build no gym switching and no multi gym logic.
- A native Android app.
- Replacing the gym's accounting.
- Training, medical, diet or injury advice. Spotter may repeat what an approved training plan card says to a Premium member. It never recommends, adapts or advises.
- No feature may act on its own to message or bill a member. The only scheduled jobs are the two named in PRD 8.1.
- Automatic monthly billing. The owner posts charges by hand.
- Version two features: renewal reminders, attendance nudges, new card suggestions, failed payment recovery, answer quality tuning.

## Stack

- Next.js with the App Router, TypeScript, Prisma, PostgreSQL, pgvector for vector data.
- Flutterwave for payments. The PRD text names Paystack. Flutterwave is fixed for this project. PRD section 11.3 fees belong to Paystack. Do not use them for Flutterwave. Read Flutterwave's current webhook documentation before writing verification. List what you relied on as an assumption. Stop and ask before writing payment code.
- Gemini free tier for embedding calls and language model calls, behind one interface module. Verify the free tier limits before writing model code. If they differ from PRD 7.1, stop and ask.
- Build and test on free tiers. The owner decides production hosting and database cost in PRD 11.4. Add no paid service.
- Database host: Neon free tier. Hosting: Vercel Hobby for build and test only. Scheduled jobs: Vercel Cron, exactly two, and no status transition job (PRD 8.1).

## Folder map

The PRD names only these paths:

```
app/api/**                          route handlers. No direct Prisma calls.
POST /api/ask                       F-1 and F-2 questions
POST /api/checkin                   F-3
POST /api/payments/initiate         F-4 start
POST /api/payments/webhook          F-4 confirmation
src/server/auth/session.ts          the only place the session cookie is read
src/server/private/*.ts             private record reads. Member ID is argument one.
src/server/retrieval/search.ts      shared card search. Raw query only.
src/server/retrieval/index-card.ts  card chunk writes. Raw query only.
src/server/router/rules.ts          never answer rules. Runs before any model call.
```

Staff and owner routes use a separate route, separate middleware, a separate cookie and a separate session table. The PRD gives no path for them. The PRD names no folder for screens, payments code or Prisma files. Ask the developer to approve each path once, then record it in this file.

## How to work in this codebase

- One change means one PRD requirement, for example FR-20. Make one change at a time. Quote its number and text at the top of your response. Finish it before you start the next.
- Ask before adding any package.
- Never run a command that connects to a database, including migrate, db push, seed, studio and any query. Do not edit the Prisma schema or create migration files unless the developer asks for that change in this session. Show the change and ask the developer to apply it.
- End every response with a heading called Assumptions. Each item says what you assumed and why. If there are none, write None.
- Stop and ask when the PRD is silent, unclear, or contradicts this file. Do not ask about code style or names.

Hard rules taken from the PRD:

- In member routes, read the member ID from the session only. Staff and owner routes take a member ID because staff and owner pick the member, and they act under their own session.
- No route handler imports the Prisma client directly.
- CI blocks the three patterns listed in PRD 8.3. Never edit, weaken or bypass those checks.
- Write the raw card chunk code in index-card.ts. Do not run it. The Prisma client cannot set the vector column. Call the embedding API before opening any transaction, and abort the approval if any embedding call fails (PRD 9.6).
- Never embed attendance, payments, ledger entries, balances, expiry dates, phone numbers, member names, question logs or access logs (PRD 7.2). Never put them in the vector index.
- The language model never sees private rows. Application code renders every number in a private answer from a fixed template.
- Money answers use the fixed form "Our records show AMOUNT outstanding for PERIOD" and end with "Correct as of DATE, based on payments recorded here." Never write "You owe". Never show a money figure without its source record and its date.
- Never store a balance field in the database. An opening balance is one ledger entry. Compute the balance in exactly one function. The home screen may cache the last balance with its date and hides it after the age limit in FR-8b. Answers are never cached.
- Derive status in one function, effectiveStatus, from expiry date, grace days and cancelled date. Derive tier in one function, effectiveTier. Never store membership status. Card status and payment status are stored fields.
- Never write code that updates or deletes a payment or ledger row. Fix a mistake with an offsetting adjustment entry that stays visible (FR-47, FR-50).
- Only the webhook marks an in app payment successful. Cash and transfer payments are recorded by the owner (FR-47). Verify the gateway signature before any database write.
- The tier filter runs before ranking, in the query. Search on the effective tier only. Never search on the stored tier.
- Show the source card and its last confirmed date with every shared answer. Never show an answer that has no source card.
- Run the never answer rules in code before any model call and before retrieval. The router model can also refuse. A refusal from either one stands.
- The never answer list covers: another member, anything medical, whether the door will open right now, refund, waiver, discount and cancellation decisions, and staff conduct. Answer questions about cancellation terms from approved cards.
- A stage is one step in the question path: rules, router, embedding, vector query, answer. On failure or timeout show the fixed error text for that path and the named handoff. A failure on the private path never shows zero. Never fall back to general knowledge.
- Check in needs a network.
- Model answers use one or two short sentences in plain English, active voice, no em dashes (PRD 7.7). Other member text uses plain English.

## Where the detailed rules live

The PRD is `spotter-prd-v2.md`, at the path the developer confirms. If it is not found there, stop and ask. It holds every schema, query, prompt, threshold, price, dimension and setting name. This file holds none of them. The PRD names no separate rules files.

- Summary, problem, goals, personas, scope, launch gates: sections 1 to 5.
- Identity and access: 6.1. Home screen: 6.2. F-1 to F-5: 6.3 to 6.7.
- Staff screens: 6.8. Owner screens: 6.9.
- Tier and status rules: 6.10. Data protection and retention: 6.11.
- AI tools, rules layer, prompts, grounding check, stage budgets: section 7.
- Architecture, where each rule is enforced, Prisma schema: section 8.
- Vector design: section 9. Vector table, index and retrieval query: section 10.
- Business model: section 11. Its gateway fees are Paystack fees.
- Success metrics and stop signals: 12. Risks: 13.
- Blocking gates and open questions: 14. Every assumption the PRD makes: Appendix A.

## Definitions

- Member. A person who pays the gym and uses the app.
- Shared record. A record that is the same for everyone, such as timetable, prices and rules.
- Private record. A record that belongs to one member only, such as attendance, balance and history.
- Card. One shared record. Each edit makes a card version. A card version stays hidden until the owner approves it. The live card version does not change before then.
- Chunk. A piece of an approved card's text. It is the unit that gets embedded and searched.
- Embedding. A list of numbers that stands for a piece of text, so that texts with similar meaning sit close together.
- pgvector. The PostgreSQL extension that stores embeddings in a normal column and compares them in normal queries.
- Tier. Basic or Premium. Premium members see written training plans and trainer guidance. Basic, expired and cancelled members do not. Every other shared card is visible to all (FR-52).
- Active. Expiry has not passed. Grace. Expiry has passed and grace days have not. Expired. Grace is over. Cancelled. The member has a cancelled date. The PRD does not say which wins if both apply. Ask.
- Effective tier. The stored tier while the member is active or in grace. Basic once expired or cancelled. It is the only input to the tier filter.
- Never answer list. The categories refused by the rules layer before any model call, and by the router model.
- Named fallback. The officer on duty, shown by name with a WhatsApp link.
- Activation code. A one time code the desk issues. It expires on first use or after its time limit. The system shows it once and stores only a hash (FR-1, FR-2).
- Check in code. The four digit code the system generates each day. Staff see it and may regenerate it once a day.
- Grounding check. Compare every digit sequence in the answer, after removing commas, colons, full stops and currency symbols, with those in the cards and the question. Numbers written as words are not checked. A failed answer is discarded. The member gets the no answer response with the handoff, and the log records it as blocked ungrounded.
- Canonical balance. The sum of the member's ledger entries. Payments, credits and refunds are negative. Charges and opening balances are positive. Adjustments go either way (PRD 8.5). A positive total means she owes.
- Gate. A blocking question or condition in the PRD. The feature it gates does not start or launch until it is answered.