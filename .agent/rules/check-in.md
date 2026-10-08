---
trigger: always_on
---

# check-in

Controls: how a visit is recorded, who may check in, and how the daily code
works. Status rules live in `membership-status.md`.

## Rules

- Accept a check in only when all of these hold: the code matches today's `CheckInCode`, the time is inside opening hours, the member has no check in today, and the member is ACTIVE or in GRACE. Add no other control, such as a location check.
  Why: the code deters casual remote check in only. It cannot stop a shared photo of the board. The real fix is Gate A.
- Take opening hours from the access hours card's structured fields. Refuse a check in outside them, whatever the code.
  Why: a check in at three in the morning is not a visit.
- Write at most one `CheckIn` row per member per calendar day. A second attempt writes nothing.
  Why: the days trained number must be real.
- A member past grace cannot check in. Show the renewal amount and the pay button instead.
  Why: a check in claims a visit the gym did not sell.
- After three wrong codes in five minutes, make her wait sixty seconds.
  Why: it stops guessing a four digit code.
- Staff may record a manual check in for a named member, with source MANUAL and their staff ID. Code check ins have source CODE.
  Why: dead phones.
- Check in is the only write with no confirmation dialog. It is one tap after the code is typed. Add no dialog.
  Why: the PRD makes it the single exception.
- Check in completes in under three seconds on a two G connection. It needs a network and says so.
  Why: members stand at the door on weak signal.

## The daily code

- The daily code job at 04:00 generates the next day's four digit code. The code rotates at 04:00, and yesterday's code stops working then. Do not add a third job.
  Why: only two scheduled jobs are allowed.
- DESK sees today's code and may regenerate it once per day, if it leaks.
  Why: a leaked code ruins that day's attendance.

## Owner flags

- The nightly sweep computes two flags for the owner review page: a day above one hundred and fifty percent of that weekday's trailing four week average, and more than ten check ins from distinct devices within sixty seconds. Never refuse a check in because of a flag.
  Why: they are signals for the owner, not controls.

## Ask first

- The PRD gives two sources for opening hours: the access hours card and placeholder fields on the gym record. Which governs?
- The job at 04:00 generates tomorrow's code, and the code also rotates at 04:00. Which code is valid from 04:00 to midnight?
- The PRD says the code is generated, and also shows "The desk has not set today's code yet". Do staff set the code or only see it?
- Gate A asks whether the gym's card reader logs entries. Check `decisions.md` before building check in.