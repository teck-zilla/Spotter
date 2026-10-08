---
name: add-private-read
description: Use when adding or changing code that reads, counts or shows one member's own records in Spotter. That includes attendance, balance entries, receipts, membership tier and expiry, and the home status payload. Do not use for shared card search or for staff and owner screens.
---

# add-private-read

Add one private read. Do the steps in order. Each step ends with a check.

## Before you start

If the read serves a staff or owner screen, stop and ask. `private-data-access.md` lists that as an open question.

## Steps

1. **Name the read.**
   Write one line: what the read returns. List every model it touches by name.
   Check: the line and the model list appear in your response.

2. **Place it and register its models.**
   Open `private-data-access.md`. Put the read where that file says private reads live. Compare your model list with the CI list in that file. Add any missing model in the same change.
   If the read returns a balance, call the balance function that `payments-and-ledger.md` names.
   Check: the function sits in the location that file names. Every model from step 1 appears in the CI list. A read that returns a balance contains no sum of its own.

3. **Build the answer text.**
   Build the text as `private-data-access.md` directs. Take every fixed string from `member-facing-copy.md`. If a string has no row there, stop and ask.
   Check: each string in the output traces to a row in `member-facing-copy.md`.

4. **Write three tests.**
   - A request that carries another member's ID returns the caller's own records.
   - The count or total returned equals the rows in the source table for that member and range.
   - One call produces one access log row.
   Follow `testing.md` for any test that needs a database.
   Check: three test names exist. Each name states its check.

5. **Report.**
   List the function, the models you touched, the three tests, and any test left for the developer to run.
   Check: every item in this list appears in your response.

## Finish line

You are done when all of these are true:

- The function exists in the location `private-data-access.md` names.
- Every touched model is in the CI list.
- Three tests exist.
- Your response lists any test left for the developer.