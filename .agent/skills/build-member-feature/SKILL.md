---
name: build-member-feature
description: Use when building or changing one member facing block of Spotter. The blocks are activation, the home screen, ask about the gym, my records, check in, pay, and ask the desk. Ends with a requirement to test table. Do not use for staff or owner screens.
---

# build-member-feature

Build one member facing block. Do the steps in order. Each step ends with a check.

## Steps

1. **Pick the block and list its parts.**
   Name the block and its PRD section, from 6.1 to 6.7. Work on one block only. From that section, list each part:
   - Every flow step.
   - The empty state.
   - The error state.
   - Every acceptance bullet.
   Give each part its FR number or a label such as "acceptance 3".
   Check: the list has one line per part. If the PRD gives the block no empty state or no error state, write "none in PRD" on that line.

2. **Match strings and check open items.**
   For every fixed sentence the list needs, find its row in `member-facing-copy.md`. Mark any part with no row as ASK.
   Open `decisions.md`. If it holds an open item for this block, mark that part ASK.
   Check: every part has a string row, "no string needed", or an ASK mark. Build no part marked ASK.

3. **Build the block.**
   Open the rules file for the block and follow it:

   | Block | Rules file |
   |---|---|
   | Activation | `auth-and-roles.md` |
   | Home screen | `home-and-offline.md` |
   | Ask about the gym | `ai-pipeline.md`, `retrieval-and-vector.md` |
   | My records | `ai-pipeline.md`, `private-data-access.md` |
   | Check in | `check-in.md` |
   | Pay | `payments-and-ledger.md` |
   | Ask the desk | `ai-pipeline.md`, `member-facing-copy.md` |

   If the block reads tier or status, also open `membership-status.md`.
   For every read of a member's own records, use the `add-private-read` skill. Do not repeat its steps here.
   Check: every rules file for the block is named in your response. Every private read in the block was built with `add-private-read`.

4. **Write the tests.**
   Write one test for each acceptance bullet, each empty state and each error state. Name each test with its FR number or label. Follow `testing.md` for any test that needs a database.
   Check: the number of tests equals the number of acceptance bullets plus empty states plus error states, excluding parts marked ASK.

5. **Fill the table.**
   Add a table to your response with these columns: Part, FR or label, String row, Test name. Write one row for every part from step 1. A cell may hold ASK. No cell may be blank.
   Check: the table has one row per part and no blank cell.

## Finish line

You are done when the table has no blank cell, and every part marked ASK is listed for the developer.