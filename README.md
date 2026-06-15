# ChamberMate

Live app: [carleton.github.io/chambermate](https://carleton.github.io/chambermate/)

Data collection tool for the [Meerts Lab](https://apps.carleton.edu/curricular/psyc/meertslab/) at Carleton College. Researchers use it on a tablet during experiments to record rat behavior with button presses, then download a formatted CSV that feeds directly into their analysis spreadsheet.

---

## What the app does

### Partner Preference / COP

Tracks how much time a female rat spends with two stimulus animals (or objects). The researcher taps **In** when the rat enters one of the two zones, and **Center** when she returns to the middle. The app records:

- Time spent with Object 1 vs Object 2 (separate stopwatches)
- Hops, ear movements, and chews per zone
- A timestamped behavior sequence shown in a results table

### Pacing

Tracks a female rat's sexual behavior across a full mating session. The researcher taps buttons as each event happens:

- **In / Out** — male enters or leaves the chamber
- **Mount / Intro / Ejac** with an LQ (lordosis quotient) score of 0–3
- **Hops, Ears, Kick, Squeak, Roll** — proceptive and rejection behaviors

The app calculates pacing LQ, LQ average, and percent exits live. The downloaded CSV includes pre-written Excel formulas that auto-calculate contact return latency, time to exit, and pacing statistics when opened in Excel.

---

## Running locally

```bash
npm install
npm run dev      # starts Vite dev server at localhost:5173
npm test         # runs all unit tests
npm run build    # builds to dist/ for GitHub Pages deployment
```

---

## Code structure

```
src/
  cop/
    logic.js   — pure COP logic (no DOM)
    dom.js     — COP button handlers, timers, UI updates
  pacing/
    logic.js   — pure pacing logic (no DOM)
    dom.js     — pacing button handlers, timers, UI updates
  main.js      — entry point, imports both dom files

tests/
  cop.test.js      — 41 tests for COP logic and CSV structure
  pacing.test.js   — 73 tests for pacing logic and CSV structure
  setup.js         — jsdom test environment setup

js/              — original pre-refactor files (kept for reference, not loaded)
index.html       — single-page app, jQuery Mobile for UI
```

### `logic.js` vs `dom.js`

Every feature has two files with a strict boundary between them:

**`logic.js`** — pure functions only. No `document`, no `$`, no `setInterval`. Takes plain values in, returns plain values out. Everything here is unit-testable without a browser.

```js
// Example: recording a behavior updates state immutably
copState = recordBehavior(copState, 'inOne', clockTime);
```

**`dom.js`** — talks to the browser. Reads from DOM elements, updates `innerHTML`, manages timers, handles button clicks. Calls `logic.js` functions to update state, then reflects that state back to the UI. Not directly tested (DOM behavior is verified manually).

```js
// Example: button handler in dom.js
function inObjectOne() {
  copState = recordBehavior(copState, 'inOne', clockDisplayToInt()); // logic
  objOneStart();                                                       // timer
  document.getElementById('hops_in_1').disabled = false;              // UI
}
```

---

## How to make changes

### Change a calculation or counter

Edit `src/cop/logic.js` or `src/pacing/logic.js`. Run `npm test` — the tests will catch regressions in CSV structure and calculated values. Add a new test in `tests/cop.test.js` or `tests/pacing.test.js` if you're adding new behavior.

### Change what a button does

Edit the corresponding handler in `src/cop/dom.js` or `src/pacing/dom.js`. Button handlers are named after what they do (`inObjectOne`, `mountTwo`, `out`). Each handler follows the same pattern: update state using a logic function, then update the UI.

### Change the CSV output

The CSV is built in two places:
- **Metadata rows** (experiment info, counters): `buildCopCsvMetadata` in `src/cop/logic.js` or `buildPacingCsvHeaderRows` in `src/pacing/logic.js`. Tests in `tests/` lock down every row position — update them if you intentionally change the layout.
- **Data rows** (per-event table): built in `copDownloadCSV` / `downloadCSV` in the respective `dom.js` files.

### Add a new button to the UI

1. Add the button in `index.html` with an `onclick="myNewFunction()"` attribute.
2. Write a handler function in the relevant `dom.js`.
3. If it updates a counter or calculation, add the pure logic to `logic.js` first, write a test, then call it from the handler.
4. Expose the function at the bottom of `dom.js` in the `Object.assign(window, {...})` block.

### Change the UI appearance

Edit `css/main.css`. The layout framework is jQuery Mobile 1.4.5 — its `data-role` attributes in `index.html` control page transitions and button styles.

---

## Testing

Tests use [Vitest](https://vitest.dev/) with jsdom. They cover:

- **Time conversion functions** (`stringToIntTime`, `timeToSeconds`, `secondsToTime`)
- **State machine** — zone transitions for COP, male in/out for pacing
- **All counters** — chews, hops, ears per zone; rejection behaviors; stim counts
- **LQ calculations** — lqAvg, pacingLq, percent exit per stim type
- **CSV structure** — every metadata row by index, every data column by position

Run with: `npm test`

---

## Developer notes

- When creating a pull request, GitHub defaults to Josh's original repo as the target. Change the destination to the Carleton AT `master` branch instead.
- Before merging, verify CSV download, results table, and data values work in the browser. The tests cover logic but not the full browser interaction.

---

## Original authors

Josh Pitkofsky — Malcolm Mitchell — John Win — Alexei Mendez
