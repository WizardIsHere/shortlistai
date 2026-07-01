# ShortlistAI 

**Experience it here:**  
#### 👉 https://shortlistai-lac.vercel.app/

An AI-guided car-buying advisor for the Indian market. A confused buyer answers
6 quick questions and gets a shortlist of 5 cars in under 3 minutes — each with
an AI-written fit explanation, an honest "devil's advocate" gotcha, and a real
3-year cost-of-ownership breakdown, not just a spec sheet.

## What did you build and why?

Four pages, two API routes, and three pure-logic `lib/` modules:

- **`/`** — landing page.
- **`/quiz`** — 6-question form (budget slider, use-case, body type, seats, fuel, free-text notes).
- **`/results`** — scoring engine picks the top 8 candidates from a 72-car dataset, Gemini picks
  and explains the best 5 of those, `lib/tco.ts` computes real EMI/fuel/insurance/maintenance costs
  for each.
- **`/compare`** — side-by-side spec table (with winning cells highlighted) plus a Gemini verdict
  for 2-3 shortlisted cars.

The core idea I kept coming back to: **the scoring engine and the LLM do different jobs, and
neither should do the other's.** Weighted scoring (price/body/seats/fuel/safety) is deterministic
and auditable — you can always explain *why* a car ranked where it did. Gemini's job is strictly
narrower: pick the best 5 of the pre-scored 8, and explain the human tradeoffs (comfort, "what
owners complain about", "who should pick this") that a scoring formula can't capture. If Gemini
is down, the app still works — it just shows ranked results without prose. That fallback isn't an
afterthought; it's why the scoring engine returns real 0-100 scores instead of leaving fit
entirely to the LLM.

## What did you deliberately cut?

- **No database.** Car data is a static typed array (`lib/cars.ts`) generated once from the
  provided CSV. 72 cars don't need a query layer.
- **No accounts / cross-session history.** One quiz → one session, held in `localStorage` for
  24h. Reopening the tab restores it; there was no requirement to remember *past* sessions.
- **No real dealer/pricing data.** Prices are the dataset's static ex-showroom figures. Anything
  claiming to be live pricing would have been fake.
- **A "zero results" empty state I built defensively, then removed.** I initially worried the
  scoring engine could return fewer than 5 cars for an impossible budget/fuel/seat combo. It
  can't — every car gets a partial-credit score against every query, so `rankTop8` always returns
  8. Building UI for a state that structurally can't occur would've been wasted work, so I
  deleted it once I'd proven it via testing rather than leaving it in "just in case."
- **Tests.** Explicitly out of scope for the time box; I leaned on `tsc --noEmit`, `eslint`, a
  full `next build`, and Playwright-scripted manual passes (see below) instead.

## Tech stack and why

- **Next.js 14+ App Router, TypeScript strict** — mandated, and a good fit: thin Route Handlers
  for the two API calls, everything else static/client.
- **Tailwind CSS** — mandated; also just fast for a UI this component-light.
- **lucide-react** — mandated icon set; doubles as the "no car photos" body-type/fuel-type
  visual language (icon + gradient color = instant car-type recognition without stock photos).
- **Gemini `gemini-2.5-flash`, server-side only** — mandated. Two narrow, single-purpose calls
  (`generateShortlist`, `generateComparison`) rather than one do-everything prompt, each forced
  to `application/json` output and defensively parsed (strip markdown fences, throw a typed
  `GeminiParseError` on malformed JSON, resolve car-id-shaped strings back to readable names when
  the model ignores formatting instructions — which it did, once, for the upsell nudge).
- **Static JSON-as-TypeScript, no ORM** — the dataset is 72 rows; a database would be pure
  overhead.

## What did you delegate to AI tools vs. do manually? Where did they help most?

This whole build ran through Claude Code end-to-end — I (the assistant) wrote all the code,
tests, and infra moves; the human supplied the spec, the CSV, API keys, and went/no-go calls at
each milestone. Within that, a few things are worth separating out:

**Where AI-assisted development helped most:**
- **Speed on mechanical translation.** CSV → typed `Car[]` (72 rows, slugified ids, validated
  against the exact union types) took one script and a sanity check, not manual data entry.
- **Catching my own bugs via actual execution, not review.** Two real bugs only surfaced because
  I ran the app against live Gemini responses instead of trusting the code by inspection:
  1. `/api/shortlist` computed TCO from the scoring engine's top-5, but Gemini often picks a
     *different* 5 of the 8 candidates — TCO and shortlist cars silently mismatched. Only visible
     by diffing actual response JSON.
  2. Budget/fuel/seat relaxation could never trigger, because `rankTop8` always returns exactly 8
     cars (partial-credit scoring never produces "too few results"). The bug was in the *trigger
     condition*, not the ranking — only obvious once I deliberately constructed an impossible
     query and watched the relaxation banner not appear.
- **Cross-checking the model against itself.** When Gemini's upsell nudge returned a raw
  `car_id` instead of "Tata Nexon" (ignoring the prompt's formatting instruction), the fix wasn't
  a better prompt alone — it was a code-level resolver that rewrites any id-shaped string back to
  a display name, so the UI can't break even if the model drifts.
- **Design-system application at volume.** The later "make it premium" pass specified exact hex
  values, exact Tailwind classes, per-component states — mechanical to apply across 4 pages
  quickly, easy to get subtly wrong by hand (e.g. matching `border-[#6C63FF]` selected-state logic
  consistently across 5 different option-card variants).

**Where it got in the way:**
- **A self-inflicted debugging detour.** Mid-redesign, a Playwright test script rapid-clicked
  through 4 quiz options with no waits between them, then read `getComputedStyle` immediately —
  and got stale values because the 150ms CSS transition hadn't finished. That looked exactly like
  "Tailwind isn't generating the arbitrary-value classes," and I spent real time inspecting
  compiled CSS chunks before realizing the bug was in the *test's* timing, not the app. The lesson
  is generalizable: fast synthetic interactions need explicit waits, or they lie to you in ways
  that look like product bugs.
- **A wrong assumption about API quota.** When Gemini started returning 429s, swapping in a new
  API key didn't help — because Gemini's free-tier quota is scoped to the *Google Cloud project*,
  not the individual key. Two keys from the same project share one 20-requests/day pool. That cost
  a round-trip of "try new key → still broken → actually explain why" that a better first
  explanation would have skipped.
- **Environment friction, not model friction.** `create-next-app` refused a name with a capital
  letter, Playwright/`chromium-cli` weren't preinstalled, `gh` wasn't available, and Vercel/GitHub
  auth both needed a human in the loop for OAuth. None of this is an AI-reasoning problem — it's
  the normal cost of a fresh sandboxed environment — but it did consume tool calls that added
  nothing to the product.

## If you had another 4 hours, what would you add?

In priority order, all still within "polish and harden," not new scope:

1. **Server-side rate limiting / debouncing on `/api/shortlist` and `/api/compare`.** Right now
   nothing stops a user from refreshing rapidly and burning Gemini quota; a simple in-session
   guard would help more than it costs.
2. **Distinguish *why* AI is unavailable.** Today, a bad key, a network blip, and a 429 quota
   exhaustion all collapse into the same generic "AI unavailable" banner. Detecting
   `RESOURCE_EXHAUSTED` specifically and showing "daily AI quota reached, try again tomorrow"
   would be a small, high-value change I already scoped but didn't build (see the Gemini-quota
   conversation in this session).
3. **Mobile pass.** The quiz's option-card grids and the compare table were never checked below
   ~768px; the spec table in particular will need real thought on narrow viewports (currently just
   horizontally scrollable).
4. **Cache identical quiz answers.** Two users (or one user hitting back/forward) with the exact
   same `QuizAnswers` currently re-spend a full Gemini call. A simple hash-keyed in-memory cache
   (with a short TTL) would cut real quota usage without touching the "no database" constraint.
5. **A real automated smoke test**, even one Playwright script that runs the full quiz → results
   → compare path and asserts on DOM state, so future changes don't rely on me re-discovering the
   same manual verification steps each time.

## Running it locally

```bash
npm install
echo "GEMINI_API_KEY=your-key-here" > .env.local
npm run dev
```

Requires a [Gemini API key](https://aistudio.google.com/apikey). Free-tier keys are capped at
20 requests/day per model, shared across all keys in the same Google Cloud project — plan test
sessions accordingly. Without a working key, the app degrades gracefully to ranked-but-unexplained
results rather than failing.
