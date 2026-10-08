---
trigger: always_on
---

# member-facing-copy

Controls: every fixed sentence a member sees, and the style of all text she
reads. Nothing else lives here.

## Rules

- Keep every fixed string in one module. Ask for its path and record it in `decisions.md`.
  Why: wording appears in AI code, screens and errors. Without one source, each copy drifts.
- Do not invent wording. If a string is missing here, ask. Add it here once approved.
  Why: wording is a product decision.
- Write plain English in short sentences and active voice. Use no em dashes. Model answers are one or two short sentences.
  Why: members have cheap phones, small data bundles and nobody to help them.
- Placeholders: NAME is the officer on duty from the desk rota. DATE, MONTH and PERIOD come from the record. AMOUNT is written with commas, then the word naira, for example 15,000 naira.
  Why: one meaning per placeholder stops each screen inventing its own format.

## Fixed strings

| When | Text |
|---|---|
| No answer in the records | I do not have that in the gym's records. |
| Medical question | I cannot answer questions about injuries or health. Please speak to NAME or your doctor. |
| A stage over budget | I cannot reach the gym's records right now |
| Private read fails | I cannot read your records right now |
| Bad or expired activation code | That code is not valid. Ask the front desk for a new one. |
| Already checked in | You are already checked in today |
| Wrong check in code | That is not today's code. Check the board at the desk. |
| No code set today | The desk has not set today's code yet. |
| No check ins in range | No check ins recorded for MONTH. |
| No ledger entries | No payments recorded yet. Ask the front desk if you paid in cash. |
| New member | 0 days this month |
| Nothing owed | Nothing due. |
| Payment would not start | Payment could not start. Try again or pay at the desk. |
| Pending payment | We are confirming a payment of AMOUNT from DATE. |
| Old card | This was last confirmed on DATE. |
| Stale cached balance | Open to refresh |

## Money

- Say "Our records show AMOUNT outstanding for PERIOD." Never say "You owe". End every balance answer with "Correct as of DATE, based on payments recorded here."
  Why: money is reported, never ruled on.
- Never show a money figure without its date.
  Why: a figure with no date cannot be checked.

## Handoffs

- Show the named officer in the handoff button, "Send this to NAME", and in the medical string. Do not add the name to any other fixed sentence. Every refusal, error and no answer shows that button. The fixed strings may say "the front desk" where the table does.
  Why: the PRD wants a person named at every refusal, and it also fixes the exact wording of each sentence.
- The button opens WhatsApp with the question, her member number and her name already typed, apostrophes intact.
  Why: she should not retype her question.
- Outside desk hours, name the officer on the next shift and say when the desk opens. Still open WhatsApp.
  Why: she still gets a person and a time.

## The privacy notice

- It fits on one screen. It states what is stored, who sees it, how long it is kept, and how to ask for a copy or deletion. It also states that the gym is the data controller and the developer is a data processor.
  Why: the PRD requires it before the PIN is set. Under Nigerian law the controller and processor roles decide who answers for a breach.

## Ask first

The PRD does not fix wording for these. Ask, then add each here:

- The one sentence beside the handoff button.
- The line on the activation screen for a visitor with no session.
- Refusals for another member, door access, money decisions and staff conduct.
- The refusal while fewer than thirty cards are approved.
- The thank you after a "this is wrong" report.
- The message that check in needs a network.