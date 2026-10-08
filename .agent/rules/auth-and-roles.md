---
trigger: always_on
---

# auth-and-roles

Controls: who a person is, how she proves it, and what each role may touch.
Nothing else lives here.

## Roles

- Staff and owner screens use a separate route, separate middleware, a separate cookie name and a separate session table from the member app. They are never reachable from the member app.
  Why: a shared session would let a member's cookie reach staff data.
- Staff and owner are one kind of signed in person with a role, DESK or OWNER. Check the role on the server for every staff and owner route.
  Why: hiding a button is not a control.
- DESK may do four things: draft a card, see and regenerate the daily code, issue an activation code, record a manual check in. Nothing else.
  Why: desk staff supply records. They do not approve them.
- OWNER alone may approve and reconfirm cards, create and edit members and membership plans, record cash and transfer payments, post charges, and use the weekly review and audit.
  Why: the owner is the control point for approval and for cash. This file is the only place that says who approves. Other files point here.
- DESK never sees any member's balance or payment history. DESK sees attendance, effective tier and expiry.
  Why: the PRD assumes staff have no money visibility, so cash entry stays the owner's control point. Do not loosen it without asking.

## Sessions

- Read the session cookie in `src/server/auth/session.ts` and nowhere else.
  Why: one place to audit.
- In member routes, take the member ID from the session only. Ignore any member ID in the body, query or headers.
  Why: a member ID from the client would let one member read another.
- Staff and owner routes take a member ID as input, because staff and owner choose the member. They act under their own session.
  Why: the rule above would make the staff screens impossible to build.
- A session lasts ninety days from its last use and refreshes on each request.
- The member re-enters her PIN after seven days of inactivity, and immediately before any payment.
  Why: a phone left unlocked must not be able to spend money.
- Bind each session to a device ID stored in the browser. One member holds one active binding. Activating on a second device revokes the first session.
  Why: the PRD calls this its strongest defence in risk R-1.
- A visitor with no session sees only the activation screen and a line that sends her to the desk.
  Why: nothing else is safe to show an unknown person.

## Activation

- The desk issues an activation code: eight characters, uppercase letters and digits, system generated. Show it once. Store only a hash.
  Why: a leaked database must not reveal usable codes.
- A code expires seventy two hours after issue or on first use, whichever comes first.
  Why: a code issued on Friday evening should still work on Sunday. This is a PRD assumption.
- After a valid code, the member accepts the privacy notice, then sets a four digit PIN. Never take the PIN before the notice.
  Why: she must know what is stored before she gives anything.
- Store the PIN as an Argon2id hash (a password hashing method built to be slow, so guessing costs a lot). Never store it plain. Never write it to any log or error response.
  Why: a four digit PIN has few possible values, so slow hashing is the only protection.
- Five wrong PINs in a row lock the account for fifteen minutes. Ten wrong in twenty four hours revoke the session and require a fresh code.
  Why: it stops guessing on a stolen phone.
- An invalid or expired code returns one message that never says which part failed. The text is in `member-facing-copy.md`.
  Why: telling her which part failed would help someone guessing codes.

## Re-linking a device

- Re-linking needs a fresh activation code from the desk. There is no self service reset, no SMS and no email.
  Why: SMS costs money per message and breaks the free tier rule. Her number was checked in person at signup.
- Staff may send a code to the member's registered WhatsApp number without her visiting. Limit: two per member per thirty days. Log each with the issuing staff ID and the reason. Refuse the third on the staff screen.
  Why: it saves a trip without removing the control.

## Ask first

- The PRD does not say how a remote code reaches WhatsApp. Ask before building it.
- The PRD names no path for the staff and owner routes. Ask for approval, then record it in `decisions.md`.