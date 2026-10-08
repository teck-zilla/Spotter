# Spotter Product Requirements Document

Version 2.0, revised after review. Single gym. Member facing web app.

Changes from version 1.0 are listed in Appendix A.

---

## 1. Product Summary

Spotter is a web app a gym gives to its four hundred members. It answers questions using only the gym's own records, lets a member check in when she arrives, shows her own attendance and balance, and lets her pay her subscription. A confirmed payment extends her membership immediately, with no staff action required. When the records hold no answer, or the question is on the never answer list, it says so in one sentence and hands the member to the front desk officer by name.

The member is the only user of the app. Staff and the owner supply records through separate screens and never open the member app.

A general chatbot can tell a member what most gyms do on a Saturday. Spotter tells her what this gym does, and it tells her how many days she personally trained in July. That second answer exists nowhere on the internet.

---

## 2. Problem

The gym has four hundred members and one front desk. Two staff share it, one at a time, and it closes at eight. There is one paper timetable taped to the wall.

The same five questions arrive all day. What time is the Saturday class. Can I bring my sister. Why is my card not working before six. How many days have I trained this month. Do I still owe for July.

The officer on duty knows some answers and guesses at others. She cannot answer the last two at all without opening a ledger that is not in front of her. After eight, nobody answers anything.

Nobody has ever counted these questions. Section 5.4 fixes that before launch, because every quality target in section 12 needs a baseline.

### The failure scene

Chioma pays fifteen thousand naira in cash at the desk on a Tuesday evening in July. The officer takes it and means to write it in the ledger, then three members walk in at once. No receipt is issued because the receipt book is finished.

In September a different officer is on the desk. Chioma is told she owes for July. She says she paid. The officer opens the ledger and finds nothing. Neither of them can settle it. Chioma is embarrassed in front of two other members. The owner hears about it the next day and waives the fifteen thousand naira to end the argument.

The gym lost fifteen thousand naira. It also lost the member's belief that any number the gym gives her is real. She tells two friends from the same office. When her renewal comes up in October, she thinks about the argument first and the gym second.

---

## 3. Goals

**G-1. Answer the gym's recurring questions without a person.** At least seventy percent of member questions in a rolling week are answered from an approved record, measured against the baseline from section 5.4.

**G-2. Make attendance a fact instead of a memory.** At least sixty percent of real gym entries produce a check in record by the end of month two, measured by the method fixed in M-2.

**G-3. Cover the hours the desk cannot.** At least eighty questions answered from records between eight in the evening and six in the morning during month two. This is a count, not a share, because a share improves when daytime use falls.

**G-4. Move renewals into the app.** At least forty percent of renewals in month three are paid through the app, each extending membership automatically and producing a receipt.

**G-5. Never state a private number the gym cannot defend.** Zero rows in `PrivateAccessLog` where the session member ID differs from the queried member ID. Zero money answers displayed without a source record and a last confirmed date. This goal is detected, not just prevented. See FR-16b.

### Non goals

Spotter will not manage class bookings or capacity. It will not replace the gym's accounting. It will not do door access control. It will not give training, medical, diet or injury advice. It will not message a member first about anything, for any reason, in version one. It will not serve more than one gym in version one.

---

## 4. Users and Personas

### The member, the only user

**Chioma Adeyemi, twenty nine.** She works at a bank in Wuse and trains four evenings a week, usually arriving around seven. Her phone is a forty five thousand naira Android with a cracked corner and eleven gigabytes of storage, most of it full. She buys five hundred naira data bundles two or three times a week and watches the balance. Power at her flat is unreliable, so her phone is often at nineteen percent by evening. She has never asked anyone for technical help in her life and would not start now.

She opens Spotter about eighteen times a month. Sixteen are check ins that take four seconds. That is the point. The check in is the habit, and the habit makes the rest of the product possible. She also opens it with no question at all, because the counter on her home screen moves from nine days to ten days when she taps.

Her other two opens are real questions at bad times. A Sunday afternoon, about whether her sister can come on Saturday. Nine at night, after the desk has closed, about whether she paid for July.

### The member who lost her session

This path is common enough to design for. Android clears site data on low storage devices, and Chioma's phone is nearly full. When it happens she is logged out with no warning, standing in the gym, wanting to check in.

She must not have to travel. She messages the desk, staff confirm her identity against her registered number, and staff send a fresh activation code to that WhatsApp number from the staff screen. She is back in under two minutes. See FR-5b.

### The owner, a record supplier

He approves every shared card before a member can see it. He maintains the member list and the membership plans. He enters cash and transfer payments the same day they arrive. He opens a weekly review page and runs the weekly answer audit.

He does not open the member app. He has his own screens on a separate route behind a separate login.

### The staff, record suppliers and the named fallback

Two front desk officers. They draft cards for approval, set the daily check in code, issue activation codes including remote ones, and record manual check ins for dead phones.

They do not open the member app. They appear inside it only as a name and a WhatsApp link when Spotter cannot answer.

---

## 5. Scope

### 5.1 In scope for version one

| # | Feature | One line |
|---|---------|----------|
| F-1 | Ask about the gym | Answers from approved shared cards the member's effective tier allows, with a report control on every answer |
| F-2 | My records | Answers from her own private records, fetched by exact member ID, with a report control on every answer |
| F-3 | Check in | Four digit daily code typed inside the building during opening hours |
| F-4 | Pay | Renewal or arrears through Paystack, settling into the gym's account, extending membership on confirmation |
| F-5 | Ask the desk | Names the officer on duty and opens WhatsApp with the question pre typed |

Five features. The "this is wrong" report control is part of the answer screen in F-1 and F-2, not a sixth feature. It has no separate entry point.

Owner and staff screens are input, not features.

### 5.2 Out of scope

| Cut | Why |
|-----|-----|
| Class booking and capacity | Four hundred members and one studio turns booking into queue management |
| Push notifications, reminders, nudges | Version one sends nothing, and each message costs the member data |
| Trainer chat or member to staff messaging in the app | Puts staff back inside the app, which this design removed |
| Progress tracking, weight logs, body metrics | Health data, and it drags the app onto the never answer list |
| Referrals, streaks, leaderboards | Nothing works until check in works |
| Door access control | The reader decides entry, not the app |
| Multi gym support | One gym; the schema keeps a gym ID so this stays possible |
| Native Android app | Storage and update data cost the member money |

### 5.3 Deferred to version two

| Version two feature | Data version one must hold | Unlock trigger |
|---------------------|----------------------------|----------------|
| Renewal reminders | Every expiry date and change, plus payment history | M-4 above forty percent for two consecutive months |
| Attendance nudges | Every check in with timestamp | M-2 above sixty percent, sustained ninety days |
| New card suggestions | Every unanswered question with full text | Fifty or more unanswered questions logged |
| Failed payment recovery | Every payment attempt with failure reason | Twenty or more failed attempts logged |
| Answer quality tuning | Every question with outcome, card and score | One thousand questions logged |

### 5.4 Pre launch gates

No member account is activated until both gates pass.

**Gate one. Fourteen day desk tally.** Staff record every member question asked at the desk for fourteen consecutive days, as question text and a count. This is the M-1 baseline and the source of the eight suggested questions in FR-9. Without it, every quality target in section 12 is a guess.

**Gate two. Thirty approved cards.** At least thirty cards with status APPROVED, covering the top questions from gate one, before the first activation code is issued. An empty retrieval system is worse than no app, because a member who gets "I do not have that" twice never opens it again.

**Pilot.** Twenty members for thirty days before the remaining three hundred and eighty are invited.

---

## 6. Functional Requirements

### 6.1 Identity and access

**FR-1.** The desk issues a one time activation code. Eight characters, uppercase letters and digits, system generated, shown once, stored only as a hash.

**FR-2.** A code expires seventy two hours after issue or on first use, whichever comes first. ASSUMPTION: seventy two hours. Reason: a code issued Friday evening should still work on Sunday.

**FR-3.** On entering a valid code the member accepts the privacy notice (FR-58), then sets a four digit PIN. The PIN is stored as an Argon2id hash (a password hashing algorithm designed to be slow and memory hungry, so guessing is expensive). The plain PIN is never stored or logged.

**FR-4.** On activation the server issues a session cookie bound to a device ID stored in the browser. One member holds one active device binding at a time. Activating on a second device revokes the first session.

**FR-5.** Re linking a device requires a fresh activation code from the desk. There is no self service reset, no SMS and no email. ASSUMPTION: phone numbers are not independently verified in version one. Reason: SMS costs money per message and breaks the free tier rule. The number is captured in person at signup, which is the verification.

**FR-5b.** Staff may send an activation code to the member's registered WhatsApp number from the staff screen, without the member attending in person. Limit two remote re links per member per thirty days. Each one is logged with the issuing staff ID and the reason. A third within thirty days requires the member to appear at the desk.

**FR-6.** A session lasts ninety days from last use and refreshes on each request. The member re enters her PIN after seven days of inactivity, and immediately before any payment.

**FR-7.** Five consecutive wrong PIN entries lock the account for fifteen minutes. Ten wrong entries in twenty four hours revoke the session and require a fresh code.

**Empty state.** A visitor with no session sees only the activation screen and a line telling her to ask at the front desk, or to message the desk on WhatsApp.

**Error state.** An invalid or expired code returns one message: "That code is not valid. Ask the front desk for a new one." It never says which part failed.

**Acceptance criteria.**
- A code cannot be used twice.
- A member cannot hold two active sessions.
- The PIN never appears in any server log or error response.
- A third remote re link within thirty days is refused by the staff screen.

### 6.2 Home screen

**FR-8.** The home screen renders cached status first and revalidates in the background. Status is effective tier, expiry date, days trained this month, and balance.

**FR-8b.** The cached balance carries the same framing as any other money answer: the figure, then "Correct as of DATE, based on payments recorded here." If the cached balance is more than twenty four hours old, the figure is hidden and replaced with "Open to refresh". A stale money figure with no date is the exact failure this product exists to prevent, and the home screen is where it would be seen most often.

**FR-9.** Below status sit eight tappable questions, configured by the owner from the section 5.4 gate one tally. Free typing sits underneath and is never required. Each tapped question carries a fixed intent and skips the router model call.

**FR-10.** The home screen makes at most one network request on open. ASSUMPTION: a warm open transfers under fifty kilobytes. Reason: at typical Nigerian bundle pricing this keeps sixteen opens a month under one naira of data.

**Empty state.** A new member with no check ins sees "0 days this month" and no error.

**Acceptance criteria.**
- The screen renders with no network at all, using cached data.
- A cached balance older than twenty four hours never displays a figure.

### 6.3 F-1: Ask about the gym

**User story.** As a member, I want to ask a question in my own words and get this gym's actual answer, so I do not have to wait for the desk to open.

**Trigger.** She taps a suggested question or types one.

**Flow.**
1. The client posts to `POST /api/ask`.
2. The server reads the member ID and effective tier from the session. It never reads a member ID from the request body.
3. The deterministic rules layer runs first (section 7.3). A never answer pattern hit refuses immediately with no model call.
4. If the rules pass, the router model classifies the question. A tapped suggestion skips this step.
5. If the intent is a shared question, the server embeds it and runs the query in section 10.5, filtered to effective tier.
6. Chunks below the similarity threshold are dropped. If none remain, the language model is never called.
7. The answer step produces one or two lines grounded only in the surviving chunks.
8. The grounding check (section 7.7) runs on the output.
9. The response returns the answer, the source card, and the card's last confirmed date.
10. The server writes a QuestionLog row before returning.

**Inputs.** Question text, maximum four hundred characters. Session member ID and effective tier.

**Outputs.** Answer text, source card body, last confirmed date, a "this is wrong" control, a handoff control.

**Empty state.** Launch is blocked below thirty approved cards. See section 5.4 gate two and FR-11b.

**Error state.** Any stage exceeding its budget in section 7.9 returns "I cannot reach the gym's records right now" and the handoff. It never falls back to general knowledge.

**FR-11.** Only cards with `Card.status` APPROVED, whose current version is APPROVED, and whose chunk minimum tier is at or below the member's effective tier, may enter the search. The filter runs inside the SQL WHERE clause, before ranking, never after.

**FR-11b.** The app refuses to serve any member question while fewer than thirty cards hold status APPROVED. This is a runtime check, not a launch note.

**FR-12.** Every shared answer displays the source card body and its last confirmed date. An answer with no source card is never displayed.

**FR-13.** If the top similarity is below threshold, the app returns the no answer response and the handoff.

**FR-14.** A card past its review interval still answers, and the answer shows "This was last confirmed on DATE." The age of a record is never hidden.

**FR-37.** Every answer carries a "this is wrong" control. Tapping it writes a `WrongAnswerReport` linked to the `QuestionLog`, opens a one line note field, and thanks the member. It sends nothing to anyone. This control is part of the answer screen, not a separate feature.

**Acceptance criteria.**
- A Basic member asking about training plans gets the no answer response.
- A member past grace with a stored tier of PREMIUM gets Basic results only.
- A retired card never appears in results, whether or not its chunks were deleted.
- Turning off the language model produces the error state, not a generic answer.
- Every displayed answer has a card body visible underneath it.

### 6.4 F-2: My records

**User story.** As a member, I want to know how many days I trained and whether the gym has recorded my payment, without arguing at the desk.

**Trigger.** She taps "My records", or asks a question the router classifies as private.

**Flow for attendance.**
1. The router returns PRIVATE_ATTENDANCE with a date range, validated in code against a five year window.
2. The server queries `CheckIn` filtered by the session member ID and the range.
3. The server renders the answer from a code template. The language model never sees the rows.
4. The response lists the count and every date.

**Flow for balance.**
1. The router returns PRIVATE_BALANCE.
2. The server computes the canonical balance in FR-17b.
3. The server renders from a code template, listing every entry with date, amount, channel and who recorded it.
4. The answer ends with "Correct as of DATE, based on payments recorded here."

**FR-15.** Every private query filters by the member ID from the server session. A member ID supplied by the client is ignored. Enforced in one data access module. No route handler imports the Prisma client directly.

**FR-16.** Private records are never embedded, never written to the vector index, and never searched by meaning.

**FR-16b.** Every private query writes a `PrivateAccessLog` row holding the session member ID, the queried member ID and the calling function. A daily job asserts the two IDs match on every row and surfaces any mismatch on the owner review page and to the developer. Prevention without detection is a hope, not a control.

**FR-17.** Numbers in private answers are rendered by application code, not by the language model. The model's only job on this path is intent and a date range.

**FR-17b. Canonical balance.** `balance_kobo = SUM(LedgerEntry.amountKobo) WHERE memberId = :id`. Positive means she owes. Payments, credits and refunds are stored as negative amounts. Charges and opening balances are stored positive. This formula appears in exactly one function and every balance display calls it. No other definition of balance exists in this document or in the codebase.

**FR-18.** Money is reported, never ruled on. The app renders "Our records show 15,000 naira outstanding for July." It never renders "You owe 15,000 naira." This is a fixed template, not a model instruction.

**FR-37b.** Private answers carry the same "this is wrong" control as shared answers.

**Empty state.** No check ins in range returns "No check ins recorded for July." No ledger entries returns "No payments recorded yet. Ask the front desk if you paid in cash."

**Error state.** A database error returns "I cannot read your records right now" and the handoff. It never returns a zero.

**Acceptance criteria.**
- A crafted request containing another member's ID returns the caller's own records.
- The attendance count equals the number of `CheckIn` rows for that member and range, exactly.
- The balance equals the FR-17b formula, computed in SQL, with no stored balance field anywhere.
- Every balance answer contains a date and the phrase "based on payments recorded here".
- Every private query produces a `PrivateAccessLog` row.

### 6.5 F-3: Check in

**User story.** As a member, I want my visit recorded so the days trained number is real.

**Trigger.** She arrives and opens the app.

**Flow.**
1. She taps "Check in" and types the four digit code from the whiteboard.
2. The client posts to `POST /api/checkin`.
3. The server compares it to today's `CheckInCode` and checks the current time against gym opening hours.
4. On match, the server writes one `CheckIn` row with source CODE.
5. The counter increments and the screen confirms.

**FR-19. What the code does and does not do.** The code rotates daily and is written on the whiteboard at the desk. It deters casual remote check in. It does not prevent a determined member from photographing the board and sharing it, and one shared code makes that day's attendance unreliable. The controls below reduce the damage. The real fix is the door reader in Gate A of section 14, and until that is answered, M-2 is provisional.

**FR-19b.** Check ins are accepted only between the gym's opening and closing times, taken from the access hours card's structured fields. A check in at three in the morning is refused regardless of the code.

**FR-19c.** The owner review page flags any day where check ins exceed one hundred and fifty percent of that day of week's trailing four week average, and any burst of more than ten check ins from distinct devices within sixty seconds.

**FR-20.** One member produces at most one `CheckIn` row per calendar day. A second attempt returns "You are already checked in today" and writes nothing.

**FR-21.** The code rotates at four in the morning. Yesterday's code stops working then. A member arriving at eleven at night uses that day's code.

**FR-22.** Staff may record a manual check in for a named member, with source MANUAL and the staff ID recorded. This exists for dead phones.

**FR-23.** Check in is the only write with no confirmation dialog. One tap after the code is typed.

**FR-23b.** Check in is blocked for a member past grace. The screen shows the renewal amount and the pay button instead. A check in claims a visit the gym did not sell.

**Empty state.** No code set for today blocks check in with "The desk has not set today's code yet." Staff see a warning from four in the morning until it is set.

**Error state.** A wrong code returns "That is not today's code. Check the board at the desk." Three wrong codes in five minutes triggers a sixty second wait.

**Acceptance criteria.**
- The same code entered twice by one member on one day produces one row.
- Yesterday's code is rejected after four in the morning.
- A check in outside opening hours is refused.
- Check in completes on a two G connection in under three seconds.

### 6.6 F-4: Pay

**User story.** As a member, I want to pay from my phone, keep a receipt, and be renewed straight away.

**Trigger.** She taps her balance or her expiry date.

**Flow.**
1. She chooses renewal or arrears. Renewal amount comes from `MembershipPlan` for her tier. Arrears amount comes from FR-17b.
2. She re enters her PIN.
3. The client posts to `POST /api/payments/initiate` with a client generated idempotency key and the purpose.
4. The server creates a `PaymentAttempt` with status PENDING, a unique reference and the purpose, then initialises the gateway transaction.
5. She completes payment on the gateway page.
6. The gateway calls `POST /api/payments/webhook`. The server verifies the signature, finds the attempt, and in one database transaction marks it SUCCESS, creates a `Payment`, creates a `LedgerEntry`, and if the purpose is RENEWAL, applies FR-24b.
7. Her screen polls the attempt for up to ninety seconds, then tells her the gym is confirming.

**FR-24.** The webhook is the only thing that marks a payment successful. The browser redirect is a hint, never proof.

**FR-24b. Renewal extends membership.** On a confirmed RENEWAL payment, `expiryDate` is extended by the plan's `durationDays`, counted from the later of today and the current `expiryDate`. A `MembershipChange` row records the old and new values with the payment reference as the reason. No staff action is required and none is waited for. Without this rule, feature four is slower than paying cash at the desk, and the member who pays at nine at night is still locked out at seven the next morning.

**FR-24c.** Amounts come from `MembershipPlan`, never from parsing the prices card. The prices card is prose for humans to read.

**FR-25.** Every webhook is verified against the gateway signature. An unverified webhook is logged and discarded.

**FR-26.** The idempotency key is unique in the database. A repeated tap returns the existing attempt instead of charging twice.

**FR-27.** A member with a PENDING attempt is never treated as expired. Access holds for twenty four hours from the attempt.

**FR-28.** If the member loses network mid payment, the attempt stays PENDING. On reopening, the pending attempt sits at the top with "We are confirming a payment of AMOUNT from DATE."

**FR-29.** An attempt still PENDING after twenty four hours is marked ABANDONED by the daily sweep and appears on the owner review page. It is never marked FAILED without gateway confirmation, because the money may have moved.

**FR-30.** The app never holds a balance, never stores card details, and never touches money. Funds settle from the gateway into the gym's own bank account.

**FR-31.** Every successful payment produces a receipt showing amount, date, reference and channel. Receipts survive expiry and cancellation.

**Empty state.** Zero balance and expiry more than thirty days away shows a quiet pay button with "Nothing due."

**Error state.** A gateway failure at initiation returns "Payment could not start. Try again or pay at the desk." The attempt is marked FAILED with the reason recorded.

**Acceptance criteria.**
- Two rapid taps produce one gateway transaction.
- Killing the browser after the debit still results in a paid record once the webhook arrives.
- A wrong signature changes nothing in the database.
- A member expired by one day who pays a renewal at nine at night can check in at seven the next morning, with no staff action in between.
- A member with a pending attempt keeps her access.

### 6.7 F-5: Ask the desk

**User story.** As a member, when the app cannot help, I want a real person by name without retyping my question.

**Trigger.** No answer, a policy refusal, a blocked ungrounded answer, an error, or the member tapping handoff.

**Flow.**
1. The server looks up the `DeskShift` covering now and returns the officer's name and WhatsApp number.
2. The app shows one sentence and a button reading "Send this to NAME".
3. Tapping opens WhatsApp with the question, her member number and her name pre typed.
4. The server writes a `Handoff` row linked to the `QuestionLog`.

**FR-32.** The records refusal sentence is fixed: "I do not have that in the gym's records." Nothing added, nothing guessed, no near answer.

**FR-33.** Outside desk hours the app names the officer on the next shift and says when the desk opens. It still opens WhatsApp.

**FR-34.** The never answer list is enforced by the deterministic rules layer in section 7.3, before any model call and before retrieval.

**FR-35.** The never answer list is: anything about another member, including whether they attended; anything medical, including injury, pain, diet, supplements and whether to train through something; whether the door will open right now; refunds, waivers, discounts and cancellation decisions; staff conduct and complaints about staff.

**FR-36.** A medical refusal uses different wording: "I cannot answer questions about injuries or health. Please speak to NAME or your doctor."

**Acceptance criteria.**
- A question about another member's attendance never reaches the database, and `QuestionLog.outcome` records REFUSED_POLICY.
- A medical question triggers the rules layer with no model call made.
- The WhatsApp link opens with the question text intact, including apostrophes.
- Every refusal names a specific person, not "the front desk".

### 6.8 Staff screens

Separate route, separate login, separate session cookie. Never reachable from the member app.

**FR-39. Draft a card.** Title, category, body, minimum tier. Saving creates a `CardVersion` with status PENDING_APPROVAL. The live version does not change.

**FR-40. Set the daily code.** Staff see today's generated code and may regenerate once per day if it leaks.

**FR-41. Issue an activation code.** In person or remote per FR-5b. Displayed once and never shown again.

**FR-42. Record a manual check in.** Search by name or member number, record one check in for today.

**FR-43.** Staff cannot see any member's balance or payment history. They see attendance, effective tier and expiry. ASSUMPTION: staff have no money visibility. Reason: cash entry is the owner's control point, and R-2 is about accountability rather than convenience.

### 6.9 Owner screens

**FR-44. Approve cards.** Pending versions shown beside the live version. Approving sets status APPROVED, stamps approver and time, sets `lastConfirmedAt`, and triggers reindexing per section 9.6. Rejecting returns it with a note.

**FR-45. Reconfirm cards.** Cards past their review interval appear in a list. Confirming without edits updates `lastConfirmedAt` only and does not reindex.

**FR-46. Member list.** Create and edit members: name, member number, phone, tier, expiry date, opening balance. Every change to tier or expiry writes a `MembershipChange` row.

**FR-46b. Membership plans.** Create and edit `MembershipPlan` rows: tier, price in kobo, duration in days. This is the only source of renewal amounts and durations.

**FR-47. Record a cash or transfer payment.** Member, amount, date, channel. Creates a `Payment` with channel CASH or TRANSFER and a `LedgerEntry`, both stamped with the recording staff ID. Neither can be deleted. Mistakes are corrected with an offsetting ADJUSTMENT entry that stays visible.

**FR-47b.** Cash and transfer payments must be recorded on the same calendar day they are received. This is a staffing commitment, not a software feature, and R-2 depends entirely on it. Balance answers do not go live until the desk demonstrates fourteen consecutive days of same day entry, measured as the gap between `Payment.paidAt` and `Payment.createdAt`. Until then features F-1, F-3, F-4 ship and F-2 answers attendance only.

**FR-47c. Renewal by cash.** When the owner records a cash or transfer payment, he selects whether it is a renewal. If it is, FR-24b applies identically. A member who pays cash is renewed by the same rule as a member who pays in the app.

**FR-48. Post a charge.** The owner posts a charge to a member's ledger for a billing period. Manual in version one, because automatic monthly billing is an agent and agents are version two.

**FR-49. Weekly review.** One page listing: wrong answer reports, unanswered questions, blocked ungrounded answers, abandoned payment attempts, cards past their review interval, check in anomalies from FR-19c, and any `PrivateAccessLog` mismatch.

**FR-49b. Weekly answer audit.** The owner reads twenty randomly sampled answered questions each week and marks each correct or wrong. This takes about twenty minutes and produces the audited figure in M-5. Voluntary member reports alone will understate wrong answers, because most members shrug and walk to the desk.

**FR-50.** In app payments cannot be edited or deleted by anyone, including the owner.

### 6.10 Tier and status rules

**FR-51. Derived status.** Membership status is never stored. It is computed from `expiryDate`, the gym's `graceDays` and `cancelledAt` by one function, `effectiveStatus(member, gym, now)`. Values are ACTIVE, GRACE, EXPIRED, CANCELLED. Nothing can drift, and no scheduled job is needed to move members between states.

**FR-52. Effective tier.** `effectiveTier(member, gym, now)` returns her stored tier while ACTIVE or GRACE, and BASIC once EXPIRED or CANCELLED. Only the effective tier is passed to retrieval. This is the sole input to the tier filter in section 10.5.

| What | Basic | Premium | Expired or cancelled |
|------|-------|---------|----------------------|
| Timetable | Yes | Yes | Yes |
| Prices | Yes | Yes | Yes |
| Rules and access hours | Yes | Yes | Yes |
| Guest policy | Yes | Yes | Yes |
| Pause and cancellation terms | Yes | Yes | Yes |
| Written training plans | No | Yes | No |
| Trainer guidance | No | Yes | No |
| Own attendance history | Yes | Yes | Yes |
| Own payment history and receipts | Yes | Yes | Yes |
| Check in | Yes | Yes | No |
| Pay | Yes | Yes | Yes |

**FR-53.** Expiry triggers three days of grace during which nothing changes. After grace, the expired column applies.

**FR-53b.** An expired member keeps her full history, her receipts, the timetable, the price list and the pay button. Locking her out of her own history helps nobody, and locking her out of the price list is the gym arguing against its own renewal.

### 6.11 Data protection

**FR-58.** A privacy notice is shown at activation and must be accepted before the PIN is set. It states what is stored, who sees it, how long it is kept, and how to request a copy or deletion. It is written in the same plain English as the rest of the app and fits on one screen.

**FR-59.** The gym is the data controller. The developer is a data processor acting on the gym's instructions. This is stated in the privacy notice and in the contract, because under the Nigeria Data Protection Act the distinction decides who answers for a breach.

**FR-60. Retention.** Attendance, question logs and access logs are kept for twenty four months and then deleted. Payment records and receipts are kept for seven years, because they are financial records. Member identity records are kept while the membership is active and for twenty four months after cancellation.

**FR-61. Exit.** If the gym ends the contract, the owner receives a full export of all gym and member data in CSV within fourteen days, and all data is deleted from the developer's systems within thirty days of the export being confirmed. This is written into the contract before launch, not after.

---

## 7. AI and AI Related Tools and Solutions

### 7.1 Models and their free limits

| Component | Choice | Free limit | When four hundred members hit it |
|-----------|--------|------------|----------------------------------|
| Embedding model (turns text into a list of numbers so similar meanings sit close together) | Google `text-embedding-004` via the Gemini API, 768 dimensions | Free tier, rate limited per minute and per day | Around thirty query embeddings a day. Not close. |
| Language model | Google `gemini-2.5-flash` via the Gemini API | Free tier, rate limited per minute and per day | Around fifty five calls a day. Not close. |

ASSUMPTION: the Gemini free tier exists in this shape when you build. Reason: free tiers change. Verify before writing code and keep both models behind one interface module so swapping costs an hour.

Cards are embedded at approval time, not per request.

### 7.2 What is embedded and what is not

Embedded: approved card versions only. Title, body, category, minimum tier.

Never embedded: attendance, payments, ledger entries, balances, expiry dates, phone numbers, member names, question logs, access logs.

### 7.3 The rules layer, which runs first

Before any model call, `src/server/router/rules.ts` runs a deterministic check. A hit refuses immediately, writes `REFUSED_POLICY`, and makes no network call at all.

This layer exists because a language model classifier is probabilistic, and a probabilistic guard is not enforcement. The never answer list protects against medical harm and against exposing another member. Those boundaries do not rest on a model behaving.

Published pattern list, matched case insensitively on word boundaries:

| Category | Patterns |
|----------|----------|
| MEDICAL | injur, pain, hurt, ache, sprain, strain, physio, doctor, hospital, medication, diet, calorie, supplement, protein, creatine, steroid, pregnan, asthma, diabet, blood pressure |
| OTHER_MEMBER | any registered member's first or last name from the member list, plus: her attendance, his attendance, someone else, another member, who else, did NAME |
| DOOR_ACCESS | can I get in, will my card work, let me in, open the door, am I allowed in right now |
| MONEY_DECISION | refund, waive, waiver, discount, free month, cancel my, reduce my fee |
| STAFF_CONDUCT | rude, complain about, report the, the staff was, she was rude, he was rude |

The member name list is loaded from the database and refreshed hourly. Matching a member's own name does not trigger the rule.

The router model then runs on anything the rules pass. Refusal from either one refuses. False positives from the rules layer send the member to a named person, which is a safe failure. False negatives from the model are caught by nothing, which is why the rules run first.

### 7.4 The router prompt

```
SYSTEM PROMPT: ROUTER

You classify a gym member's question. You do not answer it. You return
JSON and nothing else. No markdown, no backticks, no explanation.

Return exactly this shape:
{
  "intent": one of
    "SHARED_QUESTION",
    "PRIVATE_ATTENDANCE",
    "PRIVATE_BALANCE",
    "PRIVATE_MEMBERSHIP",
    "REFUSED_POLICY",
    "UNCLEAR",
  "date_from": "YYYY-MM-DD" or null,
  "date_to": "YYYY-MM-DD" or null,
  "refusal_reason": one of
    "OTHER_MEMBER", "MEDICAL", "DOOR_ACCESS",
    "MONEY_DECISION", "STAFF_CONDUCT", null
}

Rules.
SHARED_QUESTION covers timetable, prices, rules, access hours, guest
policy, pause and cancellation terms, training plans, trainer guidance.
PRIVATE_ATTENDANCE covers her own visits, her own days trained, her own
check in history. Fill date_from and date_to. If she names a month with
no year, use the most recent past occurrence of that month.
PRIVATE_BALANCE covers what she owes, what she has paid, her receipts.
PRIVATE_MEMBERSHIP covers her tier and her expiry date.
REFUSED_POLICY covers: any question about another member, including
whether they attended; anything medical, including injury, pain, diet,
supplements, and whether to train through something; whether the door
will open for her right now; refunds, waivers, discounts, and
cancellation decisions; complaints about staff. Set refusal_reason.
UNCLEAR covers anything you cannot place.

Today's date is {{TODAY}}.
```

Returned dates are validated in code against a five year window. Anything outside becomes UNCLEAR.

### 7.5 The shared card path

1. Rules layer passes.
2. Router returns SHARED_QUESTION, or the tapped question supplies it.
3. Embed the question text.
4. Run the query in 10.5, filtered to `effectiveTier`.
5. Drop chunks below 0.70 cosine similarity.
6. If nothing remains, return no answer and skip the language model entirely.
7. Otherwise call the answer prompt.
8. Run the grounding check in 7.7.
9. Render answer, top card body, `lastConfirmedAt`.

ASSUMPTION: the threshold starts at 0.70. Reason: a starting point, not a finding. `QuestionLog.topScore` is written on every question so it can be recalibrated in week two.

### 7.6 The private record path

1. Rules layer passes.
2. Router returns a private intent.
3. **Retrieval is skipped entirely.** No embedding. The vector store is not touched.
4. The server calls a function in `src/server/private/` whose first argument is the session member ID.
5. `PrivateAccessLog` is written.
6. Rows are formatted by a code template.
7. The language model is not called again and never sees the rows.

A model that never touches a figure cannot garble one.

### 7.7 The answer prompt and the grounding check

```
SYSTEM PROMPT: SHARED CARD ANSWER

You answer a gym member's question using ONLY the record cards given
below. The cards are the gym's own written records. They are the only
source of truth you have.

Hard rules.
1. Use only the cards below. You have no other knowledge about this
   gym, about gyms in general, or about anything else.
2. If the cards do not contain the answer, reply with exactly:
   NO_ANSWER
   Nothing else. Do not apologise, do not suggest, do not guess, do not
   describe what most gyms do.
3. Never state a figure, a time, a price or a rule that does not appear
   in the cards.
4. Answer in one or two short sentences. Plain English. Active voice.
   No em dashes.
5. Do not mention the cards, the system, the records, or yourself.
6. Do not give medical, injury, diet or training advice, even if a card
   contains a training plan. Describe what the plan says. Do not
   recommend it to her.
7. Do not answer anything about another member.
8. End your answer. No follow up question, no offer of further help.

CARDS
{{CARD_CHUNKS}}

MEMBER QUESTION
{{QUESTION}}
```

**The grounding check.** Extract every digit sequence from the answer after stripping commas, colons, full stops and currency symbols. Extract the same from the card chunks and the question. Every digit sequence in the answer must appear in one of those two sets.

Numbers written as words are not checked, because normalising every spelled form is unreliable and the false positives would be constant. The check catches the invented price and the invented time, which are the failures that cost the most.

On a mismatch, do not attempt to repair the answer. Discard it, return the no answer response with the handoff, and write `QuestionLog.outcome = BLOCKED_UNGROUNDED`. The owner sees the count on the weekly review, so a check that fires too often is visible rather than silent.

### 7.8 Preventing general knowledge

Five layers, because one is not enough. The rules layer refuses whole categories before any call. Retrieval runs before generation, and the model is never called when retrieval returns nothing. The prompt forbids outside knowledge. Temperature is zero. The grounding check discards answers containing figures that appear nowhere in the source.

### 7.9 Stage budgets

| Stage | Budget |
|-------|--------|
| Rules layer | 50 ms |
| Router model call | 3 s, skipped for tapped questions |
| Embedding call | 2 s |
| Vector query | 1 s |
| Answer model call | 5 s |
| Hard ceiling | 11 s, then error state and handoff |

A visible working state appears after 2 seconds. Neon cold start sits inside the vector query budget, which is why that budget is generous for a query that normally takes milliseconds.

### 7.10 Cost per question

| Step | Input tokens | Output tokens |
|------|--------------|---------------|
| Rules layer | 0 | 0 |
| Router | About 320 | About 40 |
| Answer, shared path only | About 1,100 | About 80 |
| Private path | 0 beyond the router | 0 |

Eight hundred questions a month, seventy percent on the shared path, minus the tapped questions that skip the router. Roughly 0.8 million input tokens and 0.07 million output tokens a month. Inside the free tier. Under one dollar a month at Flash pricing if you ever pay. ASSUMPTION: current Flash pricing. Reason: prices move; the volume is the durable number.

---

## 8. Technical Architecture with a Prisma Data Model

### 8.1 The stack

| Layer | Choice | Free limit | When it breaks |
|-------|--------|------------|----------------|
| Framework | Next.js, App Router, TypeScript | Free | Never |
| ORM (maps database rows to typed objects) | Prisma | Free | Never |
| Database | PostgreSQL on Neon free tier with `pgvector` | Around 0.5 GB, compute autosuspends when idle | Not at the volumes in 8.6 |
| Hosting | Vercel Hobby for build and test only | Free, but Hobby forbids commercial use | The day the gym pays. See 11.4. |
| Scheduled jobs | Vercel Cron | Two daily jobs on Hobby | Version one needs exactly two, and FR-51 is why |
| Payments | Paystack | Integration and test mode free forever | Live transactions only |
| Models | Gemini API | See 7.1 | Not close |

**Database connections.** `DATABASE_URL` uses the Neon pooled endpoint with `pgbouncer=true&connection_limit=1`. `DIRECT_URL` uses the unpooled endpoint and is used only by Prisma Migrate. Without the pooled endpoint, serverless functions exhaust connections against a suspended compute under any concurrency.

**The two cron jobs.**

| Job | Time | What it does |
|-----|------|--------------|
| Daily code | 04:00 | Generates tomorrow's four digit `CheckInCode` |
| Nightly sweep | 03:00 | Marks attempts PENDING over twenty four hours as ABANDONED, runs the `PrivateAccessLog` assertion, computes the review page counts |

There is no status transition job, because status is derived. See FR-51.

### 8.2 Request flow

```
Browser (saved web app, service worker cache)
  |
  |  one request on open, cached status renders first
  v
Next.js route handler on Vercel
  |
  |-- session cookie -> memberId, effectiveTier   [never from request body]
  |
  |-- rules layer (deterministic, no network)
  |     hit -> REFUSED_POLICY -> named officer. Stop.
  |
  |-- router call -> Gemini Flash -> intent JSON   [skipped for tapped questions]
  |
  |-- if SHARED:  embed -> pgvector search
  |                 WHERE Card.status='APPROVED'
  |                   AND CardVersion.status='APPROVED'
  |                   AND minTier <= effectiveTier
  |                 -> top 5 -> Gemini Flash -> grounding check -> answer
  |
  |-- if PRIVATE: skip retrieval entirely
  |                 src/server/private/*.ts (memberId is argument one)
  |                 -> PrivateAccessLog -> Prisma query -> code template
  |
  |-- write QuestionLog
  v
Response: answer + source card + lastConfirmedAt + report control
```

### 8.3 Where rules are enforced

| Rule | Enforced where |
|------|----------------|
| Member ID comes from the session only | `src/server/auth/session.ts`, the only place the cookie is read |
| Private reads filter by member ID | `src/server/private/*.ts`, every exported function takes `memberId` first |
| Private reads are logged | Same module, one wrapper writes `PrivateAccessLog` |
| No route handler touches Prisma directly | CI greps `app/api/**` for `prisma.` and fails on a match |
| No CardChunk write through the Prisma client | CI greps for `cardChunk.create` and `cardChunk.update` and fails on a match. The `CHECK` constraint in 10.1 makes those calls impossible anyway; the grep makes the failure happen at build time instead of in production. |
| No private model reachable from retrieval | CI greps `src/server/retrieval/**` for every private model name and fails on a match |
| Never answer list | `src/server/router/rules.ts`, before any network call |
| Tier gating | Inside the SQL WHERE clause in `src/server/retrieval/search.ts`, using `effectiveTier` only |
| Staff and owner routes | Separate middleware, separate cookie name, separate session table |
| Webhook authenticity | Signature check before any database write |

ASSUMPTION: application layer enforcement rather than PostgreSQL row level security. Reason: Prisma does not carry a per request database role cleanly, and one narrow module with CI checks and an access log is easier for one developer to keep honest than a second permission system. Revisit if a second gym joins.

### 8.4 Caching and offline

A service worker (a background script the browser runs to serve cached files) caches the app shell, the eight suggested questions and the last status payload. Status is stale while revalidate, subject to FR-8b. Check in requires network and says so. Answers are never cached, because a stale answer about a price is the failure this product exists to prevent.

### 8.5 The Prisma schema

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")   // pooled, pgbouncer=true&connection_limit=1
  directUrl  = env("DIRECT_URL")     // unpooled, migrations only
  extensions = [vector]
}

// ---------- enums ----------

enum Tier {
  BASIC
  PREMIUM
}

enum StaffRole {
  OWNER
  DESK
}

enum CardCategory {
  TIMETABLE
  PRICES
  RULES
  ACCESS_HOURS
  GUEST_POLICY
  PAUSE_CANCELLATION
  TRAINING_PLAN
  TRAINER_GUIDANCE
}

enum CardStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
  RETIRED
}

enum CheckInSource {
  CODE
  MANUAL
}

enum PaymentChannel {
  IN_APP
  CASH
  TRANSFER
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  ABANDONED
}

enum PaymentPurpose {
  RENEWAL
  ARREARS
}

enum LedgerEntryType {
  OPENING_BALANCE
  CHARGE
  PAYMENT
  ADJUSTMENT
}

enum QuestionOutcome {
  ANSWERED_SHARED
  ANSWERED_PRIVATE
  NO_ANSWER
  REFUSED_POLICY
  BLOCKED_UNGROUNDED
  ERROR
}

enum RefusalReason {
  OTHER_MEMBER
  MEDICAL
  DOOR_ACCESS
  MONEY_DECISION
  STAFF_CONDUCT
}

// ---------- gym and staff ----------

model Gym {
  id           String   @id @default(cuid())
  name         String
  timezone     String   @default("Africa/Lagos")
  graceDays    Int      @default(3)
  opensMinute  Int      @default(360)   // 06:00 local, for FR-19b
  closesMinute Int      @default(1320)  // 22:00 local
  createdAt    DateTime @default(now())

  members      Member[]
  staff        Staff[]
  cards        Card[]
  checkInCodes CheckInCode[]
  deskShifts   DeskShift[]
  plans        MembershipPlan[]
}

model MembershipPlan {
  id           String   @id @default(cuid())
  gymId        String
  gym          Gym      @relation(fields: [gymId], references: [id])
  tier         Tier
  priceKobo    Int      // positive
  durationDays Int
  activeFrom   DateTime @default(now())

  @@unique([gymId, tier, activeFrom])
  @@index([gymId, tier])
}

model Staff {
  id             String    @id @default(cuid())
  gymId          String
  gym            Gym       @relation(fields: [gymId], references: [id])
  name           String
  role           StaffRole
  whatsappNumber String
  passwordHash   String
  active         Boolean   @default(true)
  createdAt      DateTime  @default(now())

  deskShifts          DeskShift[]
  authoredVersions    CardVersion[] @relation("VersionAuthor")
  approvedVersions    CardVersion[] @relation("VersionApprover")
  issuedCodes         ActivationCode[]
  recordedCheckIns    CheckIn[]
  recordedPayments    Payment[]
  recordedLedger      LedgerEntry[]
  createdCheckInCodes CheckInCode[]
  membershipChanges   MembershipChange[]
  reviewedReports     WrongAnswerReport[]
  handoffs            Handoff[]

  @@index([gymId, active])
}

model DeskShift {
  id          String @id @default(cuid())
  gymId       String
  gym         Gym    @relation(fields: [gymId], references: [id])
  staffId     String
  staff       Staff  @relation(fields: [staffId], references: [id])
  dayOfWeek   Int    // 0 = Sunday
  startMinute Int    // minutes from midnight, local
  endMinute   Int

  @@index([gymId, dayOfWeek])
}

// ---------- member: PRIVATE ROOT ----------
// PRIVATE. This model and everything hanging off it is fetched by exact
// member ID taken from the server session. Never searched across
// members. Never embedded. Never placed in the vector index. Every read
// writes a PrivateAccessLog row.
//
// Status is NOT stored. It is derived by effectiveStatus() from
// expiryDate, Gym.graceDays and cancelledAt. See FR-51.

model Member {
  id           String    @id @default(cuid())
  gymId        String
  gym          Gym       @relation(fields: [gymId], references: [id])
  memberNumber String    // human readable, printed on the card
  firstName    String
  lastName     String
  phone        String
  tier         Tier      @default(BASIC)
  expiryDate   DateTime  @db.Date
  cancelledAt  DateTime?
  pinHash      String?
  deviceId     String?
  activatedAt  DateTime?
  privacyAcceptedAt DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  sessions           MemberSession[]
  activationCodes    ActivationCode[]
  checkIns           CheckIn[]
  ledgerEntries      LedgerEntry[]
  payments           Payment[]
  paymentAttempts    PaymentAttempt[]
  questionLogs       QuestionLog[]
  wrongAnswerReports WrongAnswerReport[]
  membershipChanges  MembershipChange[]
  handoffs           Handoff[]
  accessLogs         PrivateAccessLog[]

  @@unique([gymId, memberNumber])
  @@index([gymId, expiryDate])
}

// PRIVATE. Fetched by exact member ID only.
model MemberSession {
  id         String    @id @default(cuid())
  memberId   String
  member     Member    @relation(fields: [memberId], references: [id])
  tokenHash  String    @unique
  deviceId   String
  createdAt  DateTime  @default(now())
  lastSeenAt DateTime  @default(now())
  revokedAt  DateTime?

  @@index([memberId, revokedAt])
}

// PRIVATE. Fetched by exact member ID only.
model ActivationCode {
  id              String    @id @default(cuid())
  memberId        String
  member          Member    @relation(fields: [memberId], references: [id])
  codeHash        String    @unique
  issuedByStaffId String
  issuedBy        Staff     @relation(fields: [issuedByStaffId], references: [id])
  remote          Boolean   @default(false)  // FR-5b
  reason          String?
  expiresAt       DateTime
  usedAt          DateTime?
  createdAt       DateTime  @default(now())

  @@index([memberId, createdAt])
}

// ---------- shared records ----------

model Card {
  id                 String       @id @default(cuid())
  gymId              String
  gym                Gym          @relation(fields: [gymId], references: [id])
  category           CardCategory
  title              String
  minTier            Tier         @default(BASIC)
  status             CardStatus   @default(DRAFT)
  reviewIntervalDays Int          @default(30)
  lastConfirmedAt    DateTime?
  currentVersionId   String?      @unique
  currentVersion     CardVersion? @relation("CurrentVersion", fields: [currentVersionId], references: [id])
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  versions CardVersion[] @relation("AllVersions")

  @@index([gymId, status])
  @@index([gymId, lastConfirmedAt])
}

model CardVersion {
  id                String     @id @default(cuid())
  cardId            String
  card              Card       @relation("AllVersions", fields: [cardId], references: [id])
  title             String
  body              String
  minTier           Tier
  status            CardStatus @default(PENDING_APPROVAL)
  authorStaffId     String
  author            Staff      @relation("VersionAuthor", fields: [authorStaffId], references: [id])
  approvedByStaffId String?
  approvedBy        Staff?     @relation("VersionApprover", fields: [approvedByStaffId], references: [id])
  approvedAt        DateTime?
  rejectionNote     String?
  createdAt         DateTime   @default(now())

  currentFor Card?       @relation("CurrentVersion")
  chunks     CardChunk[]

  @@index([cardId, status])
}

// SHARED. The only model with an embedding column.
// ALL writes to this model go through raw SQL in
// src/server/retrieval/index-card.ts. The Prisma client cannot set an
// Unsupported column, and the NOT NULL check constraint in section 10.1
// means prisma.cardChunk.create() always fails. CI blocks those calls.
model CardChunk {
  id            String                       @id @default(cuid())
  cardVersionId String
  cardVersion   CardVersion                  @relation(fields: [cardVersionId], references: [id], onDelete: Cascade)
  chunkIndex    Int
  content       String
  category      CardCategory
  minTier       Tier
  embedding     Unsupported("vector(768)")?
  createdAt     DateTime                     @default(now())

  @@unique([cardVersionId, chunkIndex])
}

// ---------- attendance ----------

model CheckInCode {
  id               String   @id @default(cuid())
  gymId            String
  gym              Gym      @relation(fields: [gymId], references: [id])
  forDate          DateTime @db.Date
  code             String   // four digits
  createdByStaffId String?
  createdBy        Staff?   @relation(fields: [createdByStaffId], references: [id])
  createdAt        DateTime @default(now())

  checkIns CheckIn[]

  @@unique([gymId, forDate])
}

// PRIVATE. Fetched by exact member ID only.
model CheckIn {
  id                String        @id @default(cuid())
  memberId          String
  member            Member        @relation(fields: [memberId], references: [id])
  checkInDate       DateTime      @db.Date
  checkedInAt       DateTime      @default(now())
  source            CheckInSource @default(CODE)
  checkInCodeId     String?
  checkInCode       CheckInCode?  @relation(fields: [checkInCodeId], references: [id])
  recordedByStaffId String?
  recordedBy        Staff?        @relation(fields: [recordedByStaffId], references: [id])
  deviceId          String?       // for the burst check in FR-19c

  @@unique([memberId, checkInDate])
  @@index([memberId, checkInDate])
  @@index([checkedInAt])
}

// ---------- money ----------
// PRIVATE. Fetched by exact member ID only.
//
// SIGN CONVENTION. amountKobo is positive when it increases what she
// owes: OPENING_BALANCE and CHARGE. It is negative when it reduces what
// she owes: PAYMENT, and ADJUSTMENT in either direction.
// Balance is never stored. FR-17b:
//   balance_kobo = SUM(amountKobo) WHERE memberId = :id

model LedgerEntry {
  id                String          @id @default(cuid())
  memberId          String
  member            Member          @relation(fields: [memberId], references: [id])
  type              LedgerEntryType
  amountKobo        Int             // see sign convention above
  occurredAt        DateTime
  periodLabel       String?         // "July 2026"
  description       String
  paymentId         String?         @unique
  payment           Payment?        @relation(fields: [paymentId], references: [id])
  recordedByStaffId String?
  recordedBy        Staff?          @relation(fields: [recordedByStaffId], references: [id])
  createdAt         DateTime        @default(now())

  @@index([memberId, occurredAt])
}

// PRIVATE. Fetched by exact member ID only.
model Payment {
  id                String         @id @default(cuid())
  memberId          String
  member            Member         @relation(fields: [memberId], references: [id])
  amountKobo        Int            // positive
  feeKobo           Int            @default(0)
  channel           PaymentChannel
  purpose           PaymentPurpose
  status            PaymentStatus  @default(SUCCESS)
  reference         String         @unique
  gatewayReference  String?        @unique
  paidAt            DateTime
  recordedByStaffId String?
  recordedBy        Staff?         @relation(fields: [recordedByStaffId], references: [id])
  rawWebhook        Json?
  createdAt         DateTime       @default(now())

  ledgerEntry LedgerEntry?
  attempt     PaymentAttempt?

  @@index([memberId, paidAt])
  @@index([channel, paidAt])   // FR-47c same day entry measurement
}

// PRIVATE. Fetched by exact member ID only.
model PaymentAttempt {
  id             String         @id @default(cuid())
  memberId       String
  member         Member         @relation(fields: [memberId], references: [id])
  reference      String         @unique
  idempotencyKey String         @unique
  amountKobo     Int
  purpose        PaymentPurpose
  status         PaymentStatus  @default(PENDING)
  failureReason  String?
  initiatedAt    DateTime       @default(now())
  resolvedAt     DateTime?
  paymentId      String?        @unique
  payment        Payment?       @relation(fields: [paymentId], references: [id])

  @@index([memberId, status])
  @@index([status, initiatedAt])
}

// PRIVATE. Fetched by exact member ID only.
model MembershipChange {
  id               String   @id @default(cuid())
  memberId         String
  member           Member   @relation(fields: [memberId], references: [id])
  field            String   // "tier" or "expiryDate"
  oldValue         String
  newValue         String
  reason           String   // "renewal payment REF" or "manual edit"
  changedByStaffId String?
  changedBy        Staff?   @relation(fields: [changedByStaffId], references: [id])
  changedAt        DateTime @default(now())

  @@index([memberId, changedAt])
}

// ---------- logs ----------

// PRIVATE. The detector behind G-5. sessionMemberId must always equal
// targetMemberId. The nightly sweep asserts this.
model PrivateAccessLog {
  id             String   @id @default(cuid())
  sessionMemberId String
  targetMemberId String
  member         Member   @relation(fields: [targetMemberId], references: [id])
  functionName   String
  accessedAt     DateTime @default(now())

  @@index([accessedAt])
  @@index([targetMemberId, accessedAt])
}

// PRIVATE for member facing reads. Visible to the owner with member
// number attached, because the owner is the data controller and cannot
// fix a wrong record without knowing whose it is. Stated in FR-58.
model QuestionLog {
  id             String          @id @default(cuid())
  memberId       String
  member         Member          @relation(fields: [memberId], references: [id])
  tierAtAsk      Tier
  questionText   String
  intent         String
  outcome        QuestionOutcome
  refusalReason  RefusalReason?
  refusedBy      String?         // "RULES" or "MODEL"
  cardVersionIds String[]
  topScore       Float?
  answerText     String?
  latencyMs      Int?
  askedAt        DateTime        @default(now())

  reports  WrongAnswerReport[]
  handoffs Handoff[]
  audits   AnswerAudit[]

  @@index([memberId, askedAt])
  @@index([outcome, askedAt])
}

model WrongAnswerReport {
  id                String      @id @default(cuid())
  questionLogId     String
  questionLog       QuestionLog @relation(fields: [questionLogId], references: [id])
  memberId          String
  member            Member      @relation(fields: [memberId], references: [id])
  note              String?
  reportedAt        DateTime    @default(now())
  reviewedAt        DateTime?
  reviewedByStaffId String?
  reviewedBy        Staff?      @relation(fields: [reviewedByStaffId], references: [id])
  resolution        String?

  @@index([reviewedAt, reportedAt])
}

// The owner's weekly sample. FR-49b. Feeds the audited figure in M-5.
model AnswerAudit {
  id            String      @id @default(cuid())
  questionLogId String
  questionLog   QuestionLog @relation(fields: [questionLogId], references: [id])
  correct       Boolean
  note          String?
  auditedAt     DateTime    @default(now())

  @@index([auditedAt])
}

model Handoff {
  id             String      @id @default(cuid())
  questionLogId  String
  questionLog    QuestionLog @relation(fields: [questionLogId], references: [id])
  memberId       String
  member         Member      @relation(fields: [memberId], references: [id])
  staffId        String
  staff          Staff       @relation(fields: [staffId], references: [id])
  openedWhatsapp Boolean     @default(false)
  createdAt      DateTime    @default(now())

  @@index([staffId, createdAt])
}
```

### 8.6 Data model summary and volume

| Model | Kind | Rows per month at 400 members | Fetched how |
|-------|------|-------------------------------|-------------|
| Member | Private root | 400 total | By session member ID |
| CheckIn | Private | About 6,400 | By member ID and date range |
| LedgerEntry | Private | About 800 | By member ID |
| Payment | Private | About 400 | By member ID |
| PaymentAttempt | Private | About 450 | By member ID |
| QuestionLog | Private | About 800 | By member ID, or aggregated |
| PrivateAccessLog | Private | About 2,000 | Written on every private read, read by the sweep |
| Card, CardVersion | Shared | Under 20 changes | By ID and effective tier |
| CardChunk | Shared, embedded | Under 300 total | Vector similarity plus tier filter |

Retention in FR-60 caps the logs at twenty four months, which caps the largest tables. Storage is not the constraint. Discipline is.

---

## 9. Vector Database Architecture and Design

### 9.1 The choice

`pgvector`, the PostgreSQL extension that stores embeddings in a normal column and compares them in normal SQL.

The stack already locks PostgreSQL and Prisma. A separate vector service would add a second system to keep in sync, a second failure mode, a second free tier to outgrow, and a synchronisation bug waiting to hand a Basic member a Premium card. With `pgvector`, tier filtering and similarity ranking happen in one query against one source of truth. The corpus is under three hundred chunks. A dedicated vector database at that size is equipment, not engineering.

Neon and Supabase both ship `pgvector` on their free tiers.

### 9.2 What is embedded

Only `CardChunk` rows belonging to a `CardVersion` with status APPROVED, whose parent `Card` also has status APPROVED. Each chunk carries `category` and `minTier` copied down.

### 9.3 What is never embedded, and what stops it

Nothing private. No attendance, no payment, no ledger entry, no balance, no expiry date, no member name, no phone number, no question log, no access log.

Meaning search across a private corpus is a system in which one member's row can surface for another member's question. There is no filter written carefully enough to make that safe, because the failure is one forgotten WHERE clause away and the blast radius is four hundred people in one city. So the private data never enters the index at all.

That paragraph is a position. Here is the enforcement. A CI rule fails the build if any private model name appears in any file under `src/server/retrieval/`. The list is `Member`, `CheckIn`, `LedgerEntry`, `Payment`, `PaymentAttempt`, `MembershipChange`, `MemberSession`, `ActivationCode`, `QuestionLog`, `PrivateAccessLog`. Adding a private model to the schema means adding it to that list, and the schema review checklist says so.

If a future feature asks for semantic search over private records, the answer is no.

### 9.4 Chunking

Cards are short. One card is typically forty to two hundred words.

Under two hundred and fifty words, one chunk, being the title plus the body. Above that, split on blank lines into chunks of at most two hundred words, with the title prepended to each so a chunk never loses its subject.

Timetables get one chunk per day of the week, each prefixed with the day name. ASSUMPTION: per day chunking for timetables. Reason: "what time is the Saturday class" should match a Saturday chunk rather than compete with six other days inside one blob.

### 9.5 Tier filtering, and why it comes first

The filter runs in the WHERE clause, before ranking, on `effectiveTier` only.

Post filtering ranks across every card then drops the disallowed ones. A Basic member asking about training would get five Premium chunks ranked, all five dropped, and an empty result, while the Basic card that answers her sat at rank six. Pre filtering ranks only what she may see.

At under three hundred rows the pre filtered scan takes milliseconds. There is no performance argument for post filtering and there is a correctness argument against it.

### 9.6 Reindexing

Embedding is a network call to Google. A database transaction is never held open across it.

**Approval sequence.**
1. Generate chunks from the version body. No database writes.
2. Call the embedding API for every chunk. This happens outside any transaction.
3. If any embedding call fails, abort. The approval fails, the owner sees an error, and nothing in the database has changed. A card is never live and unindexed at the same time.
4. Open a transaction. Delete the old version's chunks, insert the new chunks by raw SQL, set `CardVersion.status` to APPROVED, set `Card.currentVersionId`, set `lastConfirmedAt`. Commit.

| Event | What happens |
|-------|--------------|
| Owner approves a new version | The sequence above |
| Owner reconfirms with no edit | `lastConfirmedAt` updates. No reindex, no embedding call |
| Owner rejects a version | Nothing is embedded |
| Card is retired | `Card.status` becomes RETIRED. The query in 10.5 stops returning it immediately, because it filters on `Card.status`. Chunk deletion is cleanup and the safety does not depend on it succeeding |
| Minimum tier changes | Chunks updated in place. The text did not change, so the embedding is still valid |

### 9.7 Threshold and what sits below it

Cosine similarity, computed as one minus cosine distance. Threshold 0.70.

Below threshold the retrieval returns nothing, the language model is never called, and the member gets the refusal and the named officer. `QuestionLog.topScore` is written on every question so the threshold is tuned against real questions in week two rather than guessed at forever.

---

## 10. Vector Database Model

### 10.1 The table

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Prisma creates the table. This migration adds the vector column and
-- the constraint Prisma cannot express. The constraint is why every
-- CardChunk write goes through raw SQL: the Prisma client cannot set an
-- Unsupported column, so prisma.cardChunk.create() would always violate
-- it. CI blocks those calls so the failure happens at build time.
ALTER TABLE "CardChunk"
  ADD COLUMN IF NOT EXISTS embedding vector(768);

ALTER TABLE "CardChunk"
  ADD CONSTRAINT card_chunk_embedding_present
  CHECK (embedding IS NOT NULL);
```

### 10.2 Columns

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` | Primary key, cuid |
| `cardVersionId` | `text` | Foreign key to `CardVersion`, cascade delete |
| `chunkIndex` | `integer` | Position within the card, unique with `cardVersionId` |
| `content` | `text` | The exact text embedded, stored so an answer can cite it |
| `category` | `CardCategory` | Copied from the version |
| `minTier` | `Tier` | Copied from the version. BASIC or PREMIUM |
| `embedding` | `vector(768)` | From `text-embedding-004` |
| `createdAt` | `timestamptz` | Set on insert |

Metadata keys and allowed values: `category` is one of TIMETABLE, PRICES, RULES, ACCESS_HOURS, GUEST_POLICY, PAUSE_CANCELLATION, TRAINING_PLAN, TRAINER_GUIDANCE. `minTier` is BASIC or PREMIUM.

Chunk metadata stays minimal. Everything needed for display, including the card title, status and last confirmed date, comes from joining `CardVersion` and `Card` in the retrieval query.

### 10.3 The index

Ship without any index on this table beyond the primary key and the unique constraint.

At under three hundred chunks an exact sequential scan with a cosine distance calculation runs in single digit milliseconds. An HNSW index (a graph structure for fast approximate nearest neighbour search) would add build time to every reindex and trade exactness for a speed gain nobody can perceive.

There is deliberately no B tree index on `minTier`. Two distinct values across three hundred rows means the planner will ignore it. An index that is never used is a maintenance cost pretending to be an optimisation.

Add this only when chunk count passes five thousand:

```sql
CREATE INDEX card_chunk_embedding_hnsw
  ON "CardChunk"
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

### 10.4 Example insert

Raw SQL only. Called from `src/server/retrieval/index-card.ts`.

```sql
INSERT INTO "CardChunk"
  ("id", "cardVersionId", "chunkIndex", "content", "category", "minTier", "embedding", "createdAt")
VALUES (
  $1, $2, $3, $4, $5::"CardCategory", $6::"Tier", $7::vector, now()
);
```

### 10.5 The retrieval query

Called from `src/server/retrieval/search.ts` with `$queryRaw`. The tier list is built in code from `effectiveTier`, never from the request. The enum column is cast to text and compared against a text array, because passing a JavaScript array through Prisma raw parameters and casting it to a Postgres enum array is fragile across versions and costs nothing to avoid.

```sql
SELECT
  ch."id",
  ch."content",
  ch."cardVersionId",
  c."title"           AS card_title,
  cv."body"           AS card_body,
  c."lastConfirmedAt" AS last_confirmed_at,
  1 - (ch."embedding" <=> $1::vector) AS similarity
FROM "CardChunk" ch
JOIN "CardVersion" cv ON cv."id" = ch."cardVersionId"
JOIN "Card" c        ON c."id"  = cv."cardId"
WHERE c."status"  = 'APPROVED'
  AND cv."status" = 'APPROVED'
  AND c."currentVersionId" = cv."id"
  AND ch."minTier"::text = ANY($2::text[])   -- ['BASIC'] or ['BASIC','PREMIUM']
ORDER BY ch."embedding" <=> $1::vector
LIMIT 5;
```

The `c."status" = 'APPROVED'` condition is what makes retirement take effect. Deleting chunks is cleanup. Correctness lives in the query.

Results below 0.70 similarity are dropped in application code before the answer step runs.

### 10.6 Prisma and the vector column

Prisma has no native vector type. Three consequences, all handled.

The column is declared `Unsupported("vector(768)")?`. Prisma manages the table and every other column but will not read or write the vector through the generated client.

Because the client cannot set the column, and because the `CHECK` constraint requires it, `prisma.cardChunk.create()` can never succeed. Every write goes through `$executeRaw` with parameters in `src/server/retrieval/index-card.ts`, and every read through `$queryRaw` in `src/server/retrieval/search.ts`. Those two files are the only raw SQL in the codebase, and the CI grep in section 8.3 keeps it that way.

Parameters are always bound. String interpolation into raw SQL appears nowhere.

---

## 11. Business Model

### 11.1 Who pays

The gym pays. The member pays nothing for the app. She pays only her normal subscription, now through a channel that produces a receipt and renews her immediately.

### 11.2 Price

**Fifty thousand naira per month, flat, for up to five hundred members.**

ASSUMPTION: this price. Reason: it covers running cost at one gym under either hosting choice in 11.4, so break even does not depend on an unresolved question. At four hundred members paying fifteen thousand naira, the gym turns over roughly six million naira a month, so fifty thousand is under one percent of turnover and less than the cost of four members leaving over ledger arguments. It is still small enough that the owner decides alone.

ASSUMPTION: a fifteen thousand naira monthly membership fee. Reason: the figure comes from the founder's own failure scene. Confirm it in Gate B, because every naira number below moves with it.

### 11.3 Gateway cost per transaction

Paystack, Nigerian local cards: 1.5 percent plus one hundred naira, capped at two thousand naira per transaction, with the one hundred naira waived at or below two thousand five hundred naira. Integration is free. Test mode is free forever, so the whole build and test period costs nothing.

| Renewal amount | Paystack fee |
|----------------|--------------|
| 2,500 naira | 38 naira |
| 15,000 naira | 325 naira |
| 50,000 naira | 850 naira |
| 200,000 naira | 2,000 naira, capped |

**The gym absorbs the fee.** ASSUMPTION. Reason: feature four exists to make paying easier than walking to the desk. Adding three hundred and twenty five naira at checkout makes the app the expensive way to pay, the member walks to the desk with cash, and the ledger problem returns. Three hundred and twenty five naira is two percent of the fee and it buys a payment record that cannot be lost and a renewal that applies itself. Show the member a single amount with no line items.

### 11.4 Running cost at four hundred members

| Item | Free tier holds it? | Cost when it does not |
|------|---------------------|-----------------------|
| Neon PostgreSQL | Yes, at the volumes in 8.6 with FR-60 retention | About nineteen dollars a month at the first paid tier |
| Hosting, option A: Vercel Pro | No. Hobby forbids commercial use, so this is required from launch | Twenty dollars a month |
| Hosting, option B: Nigerian VPS, self hosted | No | About ten thousand naira a month |
| Gemini API | Yes, at eight hundred questions a month | Under one dollar a month |
| Paystack | No fixed cost | Per transaction only |
| Domain | No | About fifteen dollars a year |

ASSUMPTION: one thousand five hundred and fifty naira to the dollar. Reason: it moves, and it moves the cost line but not the price.

Option A costs roughly thirty three thousand naira a month. Option B costs roughly eleven thousand naira a month.

### 11.5 Break even

Fifty thousand naira covers either option at one gym, with margin. The hosting decision changes the margin, not the viability, which is why it can stay open in Gate D without blocking the price.

A second gym adds almost nothing to the bill, because the same deployment serves it once multi gym support lands in a later version.

---

## 12. Success Metrics

Six metrics. Five would have forced availability into the quality metric, which is the mistake version 1.0 made.

| # | Metric | Exact definition | Measured from | Baseline | Target |
|---|--------|------------------|---------------|----------|--------|
| M-1 | Grounded answer rate | `QuestionLog` rows with outcome ANSWERED_SHARED or ANSWERED_PRIVATE, divided by all rows excluding REFUSED_POLICY, ERROR and BLOCKED_UNGROUNDED, over a rolling seven days | `QuestionLog.outcome` | The fourteen day desk tally from section 5.4 | 70 percent by end of month two |
| M-2 | Check in coverage | Distinct `CheckIn` rows in a period, divided by counted gym entries in the same period | Primary: door reader export, if Gate A resolves yes. Fallback: a three day counted sample in weeks two, six and ten | Zero | 60 percent by end of month two |
| M-3 | After hours answers | Count of `QuestionLog` rows with outcome ANSWERED_SHARED or ANSWERED_PRIVATE and `askedAt` between 20:00 and 06:00, per month | `QuestionLog.askedAt` | Zero | 80 in month two |
| M-4 | In app renewal share | `Payment` rows with channel IN_APP and purpose RENEWAL in a month, divided by all RENEWAL payments that month | `Payment.channel`, `Payment.purpose` | Zero | 40 percent by end of month three |
| M-5 | Wrong answer rate | Two figures. Self reported: `WrongAnswerReport` rows divided by answered rows. Audited: `AnswerAudit` rows marked incorrect divided by twenty. The audited figure governs | `WrongAnswerReport`, `AnswerAudit` | None. Desk errors leave no trace | Audited under 5 percent, self reported under 3 percent |
| M-6 | Availability | `QuestionLog` rows with outcome ERROR divided by all rows, over a rolling seven days | `QuestionLog.outcome` | Not applicable | Under 2 percent |

**Why M-2's method is provisional.** The fallback three day sample asks the desk to count entries. The desk is the resource this product exists to unload, so a full week every month is not sustainable and would be quietly abandoned. Three days, three times, is achievable. If Gate A resolves yes and the door reader logs, use the reader export and the metric becomes exact and free. Answer Gate A before writing feature three.

**Why M-5 has two figures.** A member who gets a wrong answer mostly shrugs and walks to the desk. Voluntary reports will always understate. Twenty audited samples a week costs the owner twenty minutes and gives a number that does not depend on anyone bothering.

### The stop signal

**M-2 is the metric that tells you to stop.** If check in coverage is under thirty percent at the end of week three, measured by whichever method Gate A selected, stop building and fix it in the building. A sign at the desk, the officer reading the code out loud, a bigger counter on the home screen. If it is still under thirty percent at the end of week six, cut check in. Feature two then loses attendance, half the reason to open the app disappears, and what remains is a timetable with a payment button. That is a smaller product. It may still be worth building, but it is a different one and it must be priced and described as one.

**M-5 audited above five percent stops shipping.** It means cards are stale or the threshold is too low, and both get worse with every day of silence.

---

## 13. Risks

Ordered by severity, not by likelihood. Every mitigation cites a requirement that exists in this document.

| # | Risk | What happens | Why it is severe | Early warning | Mitigation |
|---|------|--------------|------------------|---------------|------------|
| R-1 | One member sees another member's records | A missing WHERE clause, a member ID read from the request body, or a shared phone that never signed out exposes a balance or an attendance history | Four hundred people in one city. A leaked balance becomes a story by the end of the week and the gym is holding it | Any `PrivateAccessLog` row where session and target IDs differ. Any CI grep failure | FR-15, FR-16, FR-16b detector, FR-4 one device, section 8.3 CI checks, section 9.3 CI rule |
| R-2 | The app states a wrong balance because a cash payment was never entered | The desk takes cash on Tuesday and types it in on Friday, or never | Money answers are the reason the product exists. One wrong one poisons every other answer the app has given | Any gap over twenty four hours between `Payment.paidAt` and `Payment.createdAt` on CASH or TRANSFER rows | FR-47b same day rule with the fourteen day launch gate for balance answers, FR-18 reporting not ruling, FR-8b staleness rule, FR-47 immutable entries |
| R-3 | Nobody checks in | Attendance stays empty. Feature two answers nothing. The counter never moves, so the habit never forms | The quiet failure and the most likely one. Nothing breaks. The product just becomes pointless while everything still works | M-2 under thirty percent in week three | FR-19 honest framing, FR-23 one tap, FR-8 counter on the home screen, the section 12 stop rule, Gate A as the real fix |
| R-4 | Attendance is inflated by a shared check in code | One member photographs the whiteboard and posts it in the members group | It corrupts M-2, the stop metric, so a failing product could look like a passing one | FR-19c anomaly flags on the owner review page | FR-19b opening hours restriction, FR-19c burst and average flags, FR-19's honest statement of what the code does not do, Gate A |
| R-5 | The owner stops approving cards | Cards drift past review. The timetable changed in the gym but not in the app. The app answers confidently and wrongly | A stale record is worse than no record, because the member acts on it | The reconfirming list in FR-49 growing past five cards. M-5 audited rate rising | FR-45 review intervals, FR-12 and FR-14 visible confirmed dates, FR-49 weekly review, FR-49b weekly audit |
| R-6 | A payment is confirmed wrongly in either direction | A missed webhook leaves a paid member unpaid. A spoofed webhook marks an unpaid member paid, and now also renews her | Both put the gym in a dispute it cannot win with its own records. FR-24b raises the stakes, because a wrong confirmation now grants access as well as clearing money | Any `PaymentAttempt` PENDING past twelve hours. Any signature verification failure | FR-24 webhook only, FR-25 signature check, FR-26 idempotency, FR-27 pending never means expired, FR-29 abandoned surfaced, FR-24b inside the same transaction so money and access never disagree |
| R-7 | Data protection failure | Four hundred people's names, numbers, attendance patterns and payment histories held with no notice, no retention limit and no named controller | The Nigeria Data Protection Act applies. A complaint or a breach with no notice and no controller named is the gym's problem and then yours. Cheap now, expensive after launch | Any member asking what you hold, with no answer ready | FR-58 notice at activation, FR-59 controller named, FR-60 retention periods, FR-61 export and deletion on exit |

---

## 14. Blocking Gates and Open Questions

### 14.1 Blocking gates

Each has an owner and a date. Build does not start on the feature it gates until it is answered.

**Gate A. Does the gym's card reader log entries, and can the logs be exported?**
Owner: founder, with the gym owner. Due: before any feature three code.
The founder's own problem scene has a member asking why her card fails before six, so a reader exists. If it logs, that is a truer attendance record than a typed code, it removes R-3 and R-4 entirely, and it makes M-2 exact and free. Gates feature three and the M-2 measurement method.
Assumed meanwhile: it does not log, so the daily code stands.

**Gate B. Where does a member's outstanding balance live today, and what is the monthly fee per tier?**
Owner: founder, with the gym owner. Due: before any balance answer code.
Without a source, the opening balances in FR-46 cannot be filled and feature two answers half of what it promises. The fee figure sets `MembershipPlan` and every naira number in section 11. Gates the balance half of feature two and all of feature four's amounts.
Assumed meanwhile: a paper ledger exists and can be transcribed. Fifteen thousand naira monthly.

**Gate C. Is the gym registered with the Corporate Affairs Commission, and does it hold a bank account in the gym's name?**
Owner: gym owner. Due: before any payment code.
Paystack requires business verification and a matching settlement account. Without both, feature four cannot go live at all. Gates feature four end to end.
Assumed meanwhile: both exist.

**Gate D. Can the desk commit to entering cash and transfer payments the same day?**
Owner: gym owner. Due: before the balance feature launches, not before it is built.
R-2 depends on it entirely and FR-47b makes it a launch condition. Gates the go live of balance answers.
Assumed meanwhile: yes, entered before the shift ends.

### 14.2 Open questions

**Q-1. Do written training plans and trainer guidance exist in writing today?**
Premium tier access is half the reason to pay more. If the plans live in a trainer's head, Premium has nothing behind it. Blocks the Premium tier, not the product. Assumed: some plans exist and can be typed as cards.

**Q-2. Who signs as data controller, and does the gym have any existing privacy notice?**
FR-59 names the gym. Somebody has to agree to that in writing. Blocks the contract, not the build. Assumed: the gym owner signs.

**Q-3. Who is on the desk when, and are the shifts stable enough to hold as a rota?**
Feature five names a person, and naming the wrong person is worse than naming nobody. Blocks the handoff's usefulness, not its build. Assumed: a weekly recurring rota staff maintain in `DeskShift`.

**Q-4. Vercel Pro or self hosted?**
Section 11.4 shows both. Fifty thousand naira covers either, so this is a margin decision, not a pricing one. Blocks nothing. Assumed: Vercel Pro at launch, self hosting reviewed at month six.

**Q-5. Is one device per member acceptable to the owner?**
It is the strongest defence in R-1 and it will annoy members with two phones. FR-5b removes the trip to the desk but not the friction. Blocks nothing, generates some desk traffic. Assumed: one device, remote re link twice per thirty days.

**Q-6. What are the gym's actual opening and closing times?**
FR-19b needs real numbers, and the defaults in the `Gym` model are placeholders. Blocks the check in time restriction. Assumed: six in the morning to ten at night.

---

## Appendix A: All assumptions in this document

1. **Activation codes expire after seventy two hours.** A code issued Friday should still work Sunday. (FR-2)
2. **Phone numbers are not independently verified.** SMS costs money per message. The number is captured in person at signup. (FR-5)
3. **A warm app open transfers under fifty kilobytes.** Keeps sixteen opens a month under one naira of data. (FR-10)
4. **Staff cannot see any member's balance or payment history.** Cash entry is the owner's control point. (FR-43)
5. **The Gemini free tier exists in the shape described.** Verify before building; keep both models behind one interface. (7.1)
6. **The similarity threshold starts at 0.70.** A starting point. `topScore` is logged so it can be recalibrated in week two. (7.5)
7. **Current Gemini Flash pricing holds.** The token volume is the durable number. (7.10)
8. **Access rules are enforced in the application layer, not with row level security.** One narrow module plus CI checks plus an access log is easier for one developer to keep honest. (8.3)
9. **Timetables are chunked one per day of the week.** A Saturday question should match a Saturday chunk. (9.4)
10. **The gym price is fifty thousand naira per month up to five hundred members.** It covers running cost under both hosting options, so break even does not depend on Q-4. (11.2)
11. **The membership fee is fifteen thousand naira per month.** From the founder's failure scene. Confirmed in Gate B. (11.2)
12. **The gym absorbs the Paystack fee.** Passing it on makes the app the expensive way to pay. (11.3)
13. **The exchange rate is one thousand five hundred and fifty naira to the dollar.** It moves the cost line, not the price. (11.4)
14. **Monthly charges are posted manually by the owner.** Automatic billing is an agent, and agents are version two. (FR-48)
15. **The grace period is three days.** Carried from the refined idea, not independently derived. Confirm with the owner. (FR-53)
16. **Gym opening hours default to six in the morning until ten at night.** Placeholder until Q-6 answers. (FR-19b, `Gym` model)

---

## Appendix B: Changes from version 1.0

| # | Change | Where |
|---|--------|-------|
| 1 | Confirmed renewal payments now extend `expiryDate` automatically. Added `MembershipPlan` and `PaymentAttempt.purpose` | 1, FR-24b, FR-24c, FR-46b, FR-47c, 8.5 |
| 2 | Same day cash entry is now a requirement with a launch gate, not a claim in the risk table | FR-47b, R-2 |
| 3 | Added a deterministic rules layer before any model call, with a published pattern list | 7.3, FR-34 |
| 4 | Added privacy notice, named controller, retention periods and exit terms | FR-58 to FR-61, R-7 |
| 5 | Canonical balance formula stated once, with the sign convention in the schema | FR-17b, 8.5 |
| 6 | CardChunk writes are raw SQL only, stated and CI enforced | 8.3, 8.5, 10.1, 10.6 |
| 7 | Effective tier defined and made the only retrieval input | FR-52, 10.5 |
| 8 | Retrieval query now filters on `Card.status` | 9.6, 10.5 |
| 9 | `MemberStatus` deleted. Status derived. Two cron jobs, not three | FR-51, 8.1, 8.5 |
| 10 | Grounding check rewritten to normalised digit comparison with a discard path | 7.7 |
| 11 | One price, fifty thousand naira. Break even holds under both hosting options | 11.2, 11.5 |
| 12 | Pre launch gates added: fourteen day tally, thirty approved cards, twenty member pilot | 5.4, FR-11b |
| 13 | Broken cross reference repointed | 6.3 |
| 14 | Remote re link by WhatsApp added, rate limited and logged | FR-5b, 4 |
| 15 | FR-19 rationale made honest. Opening hours restriction and anomaly flags added | FR-19, FR-19b, FR-19c, R-4 |
| 16 | Cached home screen balance carries the confirmed date and hides after twenty four hours | FR-8b |
| 17 | M-2 given a primary and a fallback method, marked provisional until Gate A | 12 |
| 18 | M-1 denominator cleaned. Availability split into M-6 | 12 |
| 19 | `PrivateAccessLog` added as the detector behind G-5 | FR-16b, 8.5, R-1 |
| 20 | Money fields changed from `BigInt` to `Int` | 8.5 |
| 21 | Embedding moved outside the reindex transaction | 9.6 |
| 22 | Pooled and direct database URLs specified | 8.1, 8.5 |
| 23 | G-3 restated as an absolute count | 3, M-3 |
| 24 | Report control folded into F-1 and F-2. Section 6.8 removed | 5.1, FR-37, FR-37b |
| 25 | Weekly owner audit added. M-5 reports two figures | FR-49b, 12, 8.5 |
| 26 | Single timeout replaced with stage budgets. Tapped questions skip the router | 7.9, 6.3 |
| 27 | `minTier` index removed with the reason stated | 10.3, 8.5 |
| 28 | Enum array cast changed to text | 10.5 |
| 29 | Section 14 split into blocking gates with owners and dates, and open questions | 14 |
| 30 | Unlock triggers added to the deferred table | 5.3 |
