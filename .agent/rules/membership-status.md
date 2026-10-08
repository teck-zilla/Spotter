---
trigger: always_on
---

# membership-status

Controls: how membership status and tier are derived, and what each state may
see or do. Check in lives in `check-in.md`. Money lives in
`payments-and-ledger.md`.

## Deriving state

- Compute status in one function, `effectiveStatus(member, gym, now)`, from `expiryDate`, the gym's `graceDays` and `cancelledAt`. Values: ACTIVE, GRACE, EXPIRED, CANCELLED. Store nothing.
  Why: nothing can drift, and no scheduled job is needed to move members between states.
- Read the grace length from the gym's `graceDays` field. The PRD default is three days. During grace nothing changes for the member.
  Why: the gym can change it without a code change.
- Compute tier in one function, `effectiveTier(member, gym, now)`. It returns her stored tier while ACTIVE or GRACE, and BASIC once EXPIRED or CANCELLED.
  Why: it is the only input to the tier filter in search.
- Write a `MembershipChange` row on every change to tier or expiry.
  Why: the history explains every date she is shown.

## What each state may see or do

| What | Basic | Premium | Expired or cancelled |
|---|---|---|---|
| Timetable, prices, rules, access hours, guest policy, pause and cancellation terms | Yes | Yes | Yes |
| Written training plans, trainer guidance | No | Yes | No |
| Own attendance history, payment history, receipts | Yes | Yes | Yes |
| Check in | Yes | Yes | No |
| Pay | Yes | Yes | Yes |

Why: locking an expired member out of her own history helps nobody, and locking her out of the price list argues against her own renewal. Premium content is the reason to pay more, so Basic and expired members do not get it.

## Ask first

- If a member has a cancelled date and an unexpired expiry, which state wins? The PRD does not say.
- How is `cancelledAt` set? The member list fields and the screen list do not include it.