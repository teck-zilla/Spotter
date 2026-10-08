---
trigger: glob
---

# ai-pipeline

Controls: the order of steps from question to answer, the models, the
deterministic guards, the prompts and the limits. Search rules live in
`retrieval-and-vector.md`. Fixed wording lives in `member-facing-copy.md`.

## Before any question runs

- Refuse every member question while fewer than thirty cards are APPROVED. Check on every request.
  Why: an empty system teaches members to stop opening the app.

## Order of steps

1. Rules layer.
2. Router model call, skipped for tapped questions, which carry a fixed intent.
3. Shared path or private path.
4. Write the `QuestionLog` row before the response returns.

Why: each step removes risk before the next one runs. A question is at most four hundred characters.

- Write one outcome per question: ANSWERED_SHARED, ANSWERED_PRIVATE, NO_ANSWER, REFUSED_POLICY, BLOCKED_UNGROUNDED or ERROR. Write `topScore` on shared questions.
  Why: the owner review and the threshold tuning both read this log.

## The rules layer

- Run `src/server/router/rules.ts` first. It is deterministic. A hit refuses at once, writes REFUSED_POLICY and makes no network call.
  Why: a model classifier is probabilistic, and a probabilistic guard is not enforcement.
- Cache the member name list in memory, loaded from the database and refreshed hourly. The check itself never queries the database.
  Why: the check must stay fast and offline from the network.
- Match case insensitively on word boundaries. A member's own name does not trigger the rule.

| Category | Patterns |
|---|---|
| MEDICAL | injur, pain, hurt, ache, sprain, strain, physio, doctor, hospital, medication, diet, calorie, supplement, protein, creatine, steroid, pregnan, asthma, diabet, blood pressure |
| OTHER_MEMBER | any registered member's first or last name, plus: her attendance, his attendance, someone else, another member, who else, did NAME |
| DOOR_ACCESS | can I get in, will my card work, let me in, open the door, am I allowed in right now |
| MONEY_DECISION | refund, waive, waiver, discount, free month, cancel my, reduce my fee |
| STAFF_CONDUCT | rude, complain about, report the, the staff was, she was rude, he was rude |

- Ask before adding or removing a pattern.
  Why: the PRD publishes this list, so a change is a product decision, not a code decision.
- A refusal from the rules layer or the router stands.
  Why: a false positive sends the member to a named person, which is a safe failure. A false negative from the model is caught by nothing.

## The router

- Copy this prompt word for word into a code constant. Keep the placeholder.

```
SYSTEM PROMPT: ROUTER

You classify a gym member's question. You do not answer it. You return
JSON and nothing else. No markdown, no backticks, no explanation.

Return exactly this shape:
{
  "intent": one of
    "SHARED_QUESTION",
    "PRIVATE_ATTENDANCE",
    "PRIVATE_BALANCE",
    "PRIVATE_MEMBERSHIP",
    "REFUSED_POLICY",
    "UNCLEAR",
  "date_from": "YYYY-MM-DD" or null,
  "date_to": "YYYY-MM-DD" or null,
  "refusal_reason": one of
    "OTHER_MEMBER", "MEDICAL", "DOOR_ACCESS",
    "MONEY_DECISION", "STAFF_CONDUCT", null
}

Rules.
SHARED_QUESTION covers timetable, prices, rules, access hours, guest
policy, pause and cancellation terms, training plans, trainer guidance.
PRIVATE_ATTENDANCE covers her own visits, her own days trained, her own
check in history. Fill date_from and date_to. If she names a month with
no year, use the most recent past occurrence of that month.
PRIVATE_BALANCE covers what she owes, what she has paid, her receipts.
PRIVATE_MEMBERSHIP covers her tier and her expiry date.
REFUSED_POLICY covers: any question about another member, including
whether they attended; anything medical, including injury, pain, diet,
supplements, and whether to train through something; whether the door
will open for her right now; refunds, waivers, discounts, and
cancellation decisions; complaints about staff. Set refusal_reason.
UNCLEAR covers anything you cannot place.

Today's date is {{TODAY}}.
```

- Validate returned dates in code against a five year window. Anything outside becomes UNCLEAR.
  Why: the model can invent a date.

## Models

- Embedding: `text-embedding-004`. Language model: `gemini-2.5-flash`. Both are on the Gemini free tier, behind one interface module. The router and the answer step both use the language model. The vector size is set in `retrieval-and-vector.md`.
- Set temperature to zero.
  Why: it is one of five layers against general knowledge in the PRD.
- Verify the Gemini free limits before writing model code. If they differ from the PRD, stop and ask.
  Why: free tiers change.

## Shared path

- When retrieval returns nothing, never call the language model. Return the no answer response with the handoff.
  Why: a model with no cards will use outside knowledge.
- Copy this prompt word for word into a code constant. Keep the placeholders.

```
SYSTEM PROMPT: SHARED CARD ANSWER

You answer a gym member's question using ONLY the record cards given
below. The cards are the gym's own written records. They are the only
source of truth you have.

Hard rules.
1. Use only the cards below. You have no other knowledge about this
   gym, about gyms in general, or about anything else.
2. If the cards do not contain the answer, reply with exactly:
   NO_ANSWER
   Nothing else. Do not apologise, do not suggest, do not guess, do not
   describe what most gyms do.
3. Never state a figure, a time, a price or a rule that does not appear
   in the cards.
4. Answer in one or two short sentences. Plain English. Active voice.
   No em dashes.
5. Do not mention the cards, the system, the records, or yourself.
6. Do not give medical, injury, diet or training advice, even if a card
   contains a training plan. Describe what the plan says. Do not
   recommend it to her.
7. Do not answer anything about another member.
8. End your answer. No follow up question, no offer of further help.

CARDS
{{CARD_CHUNKS}}

MEMBER QUESTION
{{QUESTION}}
```

- Treat a reply of exactly `NO_ANSWER` as the no answer response.
- Run the grounding check on every answer. A digit sequence is an unbroken run of digits. Strip commas, colons, full stops and currency symbols first. Every digit sequence in the answer must appear in the chunks or the question. On a mismatch, discard the answer. Do not repair it. Return the no answer response with the handoff. Write BLOCKED_UNGROUNDED.
  Why: it catches the invented price and the invented time, the most costly failures. Numbers written as words are not checked, because the false positives would be constant. The owner sees the block count weekly.

## Private path

- Skip retrieval entirely. Do no embedding. Do not touch the vector store. Call the private function from `private-data-access.md`. Do not call the model again.
  Why: the model must never see a private row.

## The response

- Show the answer, the source card body and the card's last confirmed date. Never show a shared answer with no source card.
  Why: the member can check the answer against the record.
- Every answer on both paths carries a "this is wrong" control. Tapping it saves a report linked to the question log, opens a one line note field and thanks the member. It sends nothing to anyone.
  Why: version one sends no automated message. The report feeds the owner review.

## Budgets

| Stage | Budget |
|---|---|
| Rules layer | 50 ms |
| Router call | 3 s |
| Embedding call | 2 s |
| Vector query | 1 s |
| Answer call | 5 s |
| Whole path | 11 s |

- A stage that runs over its budget returns the error text and the handoff. So does the 11 second limit on the whole path. Show a working state after 2 seconds. Never fall back to general knowledge.
  Why: the PRD sets the vector query budget wide to cover the Neon cold start.

## Ask first

- What happens on UNCLEAR? The PRD does not say.
- What does PRIVATE_MEMBERSHIP return? The PRD has the intent and no flow.
- What text does the member see for a refusal other than medical, and for the thirty card refusal? Record the answers in `member-facing-copy.md`.
- The PRD says word boundaries but lists stems such as `injur` and `diabet`. Confirm that stems match at the start of a word.