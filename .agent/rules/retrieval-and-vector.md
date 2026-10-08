---
trigger: always_on
---

# retrieval-and-vector

Controls: how shared cards are chunked, embedded, stored, searched and kept in
step with approval. Private data is out of scope here.

## What goes in the index

- Embed only chunks of approved card versions whose parent card is also approved. Each chunk carries `category` and `minTier`, copied from the version.
  Why: an unapproved or retired card must never reach a member.
- Under 250 words, make one chunk: title plus body. Above that, split on blank lines into chunks of at most 200 words, with the title added to the front of each.
  Why: a chunk must never lose its subject.
- For category TIMETABLE, make one chunk per day of the week, each starting with the day name.
  Why: "what time is the Saturday class" should match a Saturday chunk, not compete with six other days. This is a PRD assumption.

## The table

- The table is `CardChunk`. Prisma owns the table. Declare the vector column as `Unsupported("vector(768)")?`. Do not change 768 without asking, because it means re-embedding every card.
- Columns: `id`, `cardVersionId` (cascade delete), `chunkIndex` (unique with `cardVersionId`), `content`, `category`, `minTier`, `embedding`, `createdAt`.
- `category` is one of TIMETABLE, PRICES, RULES, ACCESS_HOURS, GUEST_POLICY, PAUSE_CANCELLATION, TRAINING_PLAN, TRAINER_GUIDANCE. `minTier` is BASIC or PREMIUM.
- Show the developer this migration. Do not run it.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE "CardChunk" ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE "CardChunk" ADD CONSTRAINT card_chunk_embedding_present
  CHECK (embedding IS NOT NULL);
```

Why: Prisma cannot set the vector column, and the check makes `cardChunk.create` fail every time.

## Writing chunks

- Write chunks only in `src/server/retrieval/index-card.ts`, with `$executeRaw` and bound parameters. CI fails on `cardChunk.create` and `cardChunk.update`.
  Why: the failure should happen at build time, not in production.

```sql
INSERT INTO "CardChunk"
  ("id","cardVersionId","chunkIndex","content","category","minTier","embedding","createdAt")
VALUES ($1,$2,$3,$4,$5::"CardCategory",$6::"Tier",$7::vector,now());
```

- Never put a value into raw SQL by string interpolation.
  Why: raw SQL appears only in the two retrieval files, so every parameter there must be bound.

## Searching

- Read only in `src/server/retrieval/search.ts`, with `$queryRaw`.
  Why: two files hold all raw SQL, and CI keeps it that way.
- Build the tier list in code from `effectiveTier`. BASIC gives `['BASIC']`. PREMIUM gives `['BASIC','PREMIUM']`.
  Why: a wrong list unlocks Premium cards or hides Basic ones.
- Filter in the WHERE clause, before ranking. Never after.
  Why: filtering after ranking can return nothing while the right Basic card sits at rank six.

```sql
SELECT ch."id", ch."content", ch."cardVersionId",
  c."title" AS card_title, cv."body" AS card_body,
  c."lastConfirmedAt" AS last_confirmed_at,
  1 - (ch."embedding" <=> $1::vector) AS similarity
FROM "CardChunk" ch
JOIN "CardVersion" cv ON cv."id" = ch."cardVersionId"
JOIN "Card" c ON c."id" = cv."cardId"
WHERE c."status" = 'APPROVED'
  AND cv."status" = 'APPROVED'
  AND c."currentVersionId" = cv."id"
  AND ch."minTier"::text = ANY($2::text[])
ORDER BY ch."embedding" <=> $1::vector
LIMIT 5;
```

- Similarity is one minus cosine distance. Drop results below 0.70 in application code. When none remain, return nothing.
  Why: 0.70 is a starting value, not a finding. `QuestionLog.topScore` is written on every question so it can be tuned in week two.
- Take the title, body and last confirmed date from the joins, not from chunk metadata.
  Why: chunk metadata stays minimal so nothing goes stale in two places.
- A card past its review interval still answers. The answer shows its last confirmed date. Never hide the age of a record.
  Why: a hidden age is how a stale price looks current. The interval is a field on the card.

## Card lifecycle and reindexing

- A staff draft creates a version with status PENDING_APPROVAL. The live version does not change. Only the owner approves, as set in `auth-and-roles.md`.
  Why: members must never see an unreviewed card.
- Approve in this order. Chunk with no database writes. Call the embedding API for every chunk, outside any transaction. If any call fails, abort and change nothing. Then, in one transaction, delete the old chunks, insert the new ones, set the version APPROVED, set the card's current version and set `lastConfirmedAt`.
  Why: a transaction held across a network call can hang. A card must never be live and unindexed.
- Reconfirm with no edit updates `lastConfirmedAt` only. No reindex, no embedding call.
  Why: the text did not change.
- Reject returns the version with a note. Embed nothing.
  Why: a rejected card must never reach the index.
- Retire a card by setting `Card.status` to RETIRED. Chunk deletion is cleanup only.
  Why: the search query filters on card status, so retirement works at once.
- A minimum tier change updates chunks in place.
  Why: the text did not change, so the embedding is still valid.
- Create no index beyond the primary key and the unique constraint. Add this only when chunks pass five thousand: an HNSW index (a graph structure for fast approximate search) using `vector_cosine_ops`, `m = 16`, `ef_construction = 64`. Never index `minTier`.
  Why: under three hundred chunks an exact scan takes milliseconds. An unused index is a maintenance cost.

## Ask first

- What happens when one blank line block is longer than 200 words? The PRD does not say.
- How does an owner retire a card? The owner screen list has no retire screen.