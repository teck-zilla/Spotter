---
trigger: always_on
---

# home-and-offline

Controls: what the home screen shows, what is cached, and what is never
cached. Fixed wording lives in `member-facing-copy.md`.

## Rules

- Render cached status first and refresh in the background. Status is effective tier, expiry date, days trained this month and balance. The screen must render with no network at all.
  Why: the member has small data bundles and unreliable signal.
- Make at most one network request on open. Keep a warm open under fifty kilobytes. This is a PRD assumption.
  Why: at typical bundle prices this keeps sixteen opens a month under one naira of data.
- A service worker (a background script the browser runs to serve cached files) caches the app shell, the eight suggested questions and the last status payload.
  Why: the app must open without data.
- Show the cached balance with its closing line from `member-facing-copy.md`. If the cached balance is more than twenty four hours old, hide the figure and show the "Open to refresh" string.
  Why: a stale money figure with no date is the failure this product exists to prevent.
- Show eight tappable questions below the status. Each tapped question carries a fixed intent and skips the router. Free typing sits underneath and is never required.
  Why: most members will tap, and the tap saves a model call.
- Never cache an answer.
  Why: a stale answer about a price is the failure this product exists to prevent.
- Read the days trained count and the balance through the private module in `private-data-access.md`.
  Why: the home screen is a private read like any other.

## Ask first

- The owner configures the eight questions from the desk tally, but the owner screen list has no screen for it. Where does the owner set them?