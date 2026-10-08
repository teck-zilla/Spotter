---
trigger: always_on
---

# private-data-access

Controls: how private records are read, logged and shown, and how they are
kept out of search. Nothing else lives here.

## Where private reads live

- A private read is any query on a model in the CI list in the last section. Put every one in `src/server/private/*.ts`. Every exported function takes `memberId` as argument one.
  Why: one narrow module is easy to audit. A forgotten filter is one line away from exposing four hundred people.
- No route handler touches Prisma. CI greps `app/api/**` for `prisma.` and fails on a match.
  Why: it keeps every member ID filter inside the one module.
- One wrapper in that module writes a `PrivateAccessLog` row for every private read. The row holds the session member ID, the queried member ID and the calling function.
  Why: prevention without detection is a hope, not a control.
- The nightly sweep checks that the two IDs match on every row. A mismatch shows on the owner review page and goes to the developer. Add this check to the one nightly sweep. Do not make a new job.
  Why: this is how a leak is caught when no one is watching. Only two scheduled jobs are allowed.

## What a private answer contains

- Build every private answer from a fixed code template. The language model never sees the rows. Its only jobs on this path are intent and a date range.
  Why: a model that never touches a figure cannot garble one.
- Attendance: the count and every date in the range. The count equals the number of `CheckIn` rows for that member and range, exactly.
  Why: she uses it to settle a dispute at the desk.
- Balance: every ledger entry with its date, amount, channel and who recorded it, then the closing line from `member-facing-copy.md`. Get the total from the one balance function in `payments-and-ledger.md`.
  Why: a bare total cannot be checked. A list can.
- Receipts and payment history come from payment rows.
- Use the empty result strings in `member-facing-copy.md`. On a failed read, show the error string and the named handoff. Never show a zero.
  Why: a false zero balance is a wrong answer about money.
- Balance answers go live only after fourteen consecutive days of same day entry of cash and transfer payments, measured as the gap between `Payment.paidAt` and `Payment.createdAt`. Until then F-2 answers attendance only. This is Gate D.
  Why: a balance is only as true as the desk's entry habit.

## Keeping private records out of search

- Never embed attendance, payments, ledger entries, balances, expiry dates, phone numbers, member names, question logs or access logs. Never write them to the vector index. Never search them by meaning. Never search across members.
  Why: one forgotten filter on a shared index would show one member's row to another. The only safe filter is no index.
- The only cross member read is the member name list, used by the rules layer. It reads names only.
  Why: the rules layer must recognise another member's name to refuse the question.
- CI fails if any private model name appears in a file under `src/server/retrieval/`. The names are: `Member`, `CheckIn`, `LedgerEntry`, `Payment`, `PaymentAttempt`, `MembershipChange`, `MemberSession`, `ActivationCode`, `QuestionLog`, `PrivateAccessLog`.
  Why: a policy is only real if the build enforces it.
- When a private model is added to the schema, add its name to that CI list in the same change.
  Why: a model missing from the list is a model retrieval can import unnoticed.
- If anyone asks for semantic search over private records, the answer is no.

## Ask first

- Where do staff and owner screens read and write data, given that route handlers cannot call Prisma? Does the access log cover those reads? The PRD does not say.
- What does a balance question return before Gate D passes? The PRD does not say.
- What does the membership intent (PRIVATE_MEMBERSHIP) show? The PRD has the intent and no flow.