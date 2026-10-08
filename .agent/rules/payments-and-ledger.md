---
trigger: always_on
---

# payments-and-ledger

Controls: how money moves in the app and how it is recorded. Status and tier
live in `membership-status.md`. The PIN rule lives in `auth-and-roles.md`.

## Gateway

- Use Flutterwave only. The PRD was written for Paystack. Do not use any Paystack detail from the PRD: the fee table in 11.3, signature handling or business verification steps.
  Why: they belong to a different gateway.
- Before writing payment code, read Flutterwave's current webhook documentation and list what you relied on as assumptions.
  Why: the PRD holds no Flutterwave facts.
- Gate B blocks all payment amounts and balance code. Gate C blocks all payment code. Check `decisions.md` first.
  Why: the PRD says build does not start on a gated feature until the gate is answered.

## Values

- Payment status: PENDING, SUCCESS, FAILED, ABANDONED. Purpose: RENEWAL or ARREARS. Channel: IN_APP, CASH or TRANSFER.
- Ledger entry type: OPENING_BALANCE, CHARGE, PAYMENT or ADJUSTMENT.

## Payment flow

- Take the renewal amount from the membership plan for her tier. Take the arrears amount from the balance function. Never parse the prices card.
  Why: the prices card is prose for humans.
- The client sends a generated idempotency key. Keep the key unique in the database. A repeated tap returns the existing attempt.
  Why: two taps must not charge twice.
- Create the attempt with status PENDING, a unique reference and the purpose. Then start the gateway transaction.
  Why: a record must exist before money can move.
- Only the webhook marks an in app payment successful. The browser redirect is a hint, never proof.
  Why: a member can close the browser after paying.
- Verify the gateway signature before any database write. Log and discard an unverified webhook. It changes nothing.
  Why: anyone can post to a public URL.
- On a verified success, in one database transaction: mark the attempt SUCCESS, create the payment, create the ledger entry and, for a renewal, apply the renewal rule.
  Why: a partial write leaves a member debited and unpaid.
- Poll the attempt for up to ninety seconds, then tell her the gym is confirming.
  Why: webhooks can arrive late.
- A lost network leaves the attempt PENDING. On reopening, show the pending attempt at the top.
  Why: she must see that her payment is not lost.
- A member with a PENDING attempt is never treated as expired. Access holds for twenty four hours from the attempt.
  Why: she paid and must not be locked out while the gym confirms.
- Add this to the one nightly sweep: mark attempts PENDING over twenty four hours as ABANDONED and list them on the owner review page. Do not make a new job. Never mark an attempt FAILED without gateway confirmation. The one FAILED case is a gateway failure at initiation, with the reason recorded.
  Why: the money may have moved. Only two scheduled jobs are allowed.
- Never hold a balance, store card details or touch money. Funds settle into the gym's own bank account.
  Why: it keeps the app out of custody of funds.
- Every success produces a receipt with amount, date, reference and channel. Receipts survive expiry and cancellation.
  Why: she needs proof of payment at any time.

## The renewal rule

- Use one function for every renewal, in app or by cash. Extend `expiryDate` by the plan's `durationDays`, counted from the later of today and the current `expiryDate`. Write a `MembershipChange` row with the old and new values and the payment reference as the reason. Require no staff action.
  Why: without this, a member who pays at nine at night is locked out the next morning.

## The ledger

- Store money in kobo. Compute the balance in exactly one function: the sum of the member's ledger amounts. A positive total means she owes. OPENING_BALANCE and CHARGE are positive. PAYMENT is negative. ADJUSTMENT may be either sign. Store no balance field.
  Why: two definitions of balance drift apart.
- An opening balance is one OPENING_BALANCE ledger entry.
  Why: it keeps one definition of balance.
- Never update or delete a payment or a ledger row. In app payments cannot be edited by anyone, including the owner. Correct a mistake with an offsetting ADJUSTMENT entry that stays visible.
  Why: a visible history makes a money answer defensible.
- The owner records cash and transfer payments. He has a staff identity with role OWNER, so each entry is stamped with his staff ID. He marks whether it is a renewal.
  Why: cash entry is the owner's control point.
- The owner posts charges by hand. Do not automate them.
  Why: automatic billing is an agent, and agents are version two.

## Ask first

- FR-27 holds access for a pending attempt, but `effectiveStatus` takes no attempt input. Where is the hold applied? The PRD does not say.