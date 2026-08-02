# Cinematic Proposal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the final screen into a quiet bridge from the video to the real-life proposal.

**Architecture:** A testable sequence module owns approved Korean copy, photo variants, and timing. The existing page scripts render it and CSS supplies visual variants.

**Tech Stack:** HTML, CSS, browser JavaScript, Node built-in test runner.

## Global Constraints

- Retain the current images, BGM, black background, and `#e5a872` accent.
- Do not add dependencies.
- Use the approved final Korean copy verbatim.
- Keep the 2,000 ms silent proposal cue.

---

### Task 1: Add sequence data with a failing-first test

**Files:**
- Create: `sequence.js`
- Create: `tests/sequence.test.js`
- Modify: `index.html`
- Modify: `script.js`

**Interfaces:**
- Produces: `window.ProposalSequence` and CommonJS exports: `memories`, `finalLetter`, `silentPauseMs`.

- [ ] **Step 1: Write the failing test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const sequence = require('../sequence.js');
test('defines five varied memories and a two-second proposal cue', () => {
  assert.equal(sequence.memories.length, 5);
  assert.deepEqual(sequence.memories.map(({ variant }) => variant), ['full-frame', 'polaroid', 'close-up', 'film-strip', 'full-frame']);
  assert.equal(sequence.finalLetter.at(-1), '고개를 들어\\n나를 봐줄래?');
  assert.equal(sequence.silentPauseMs, 2000);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/sequence.test.js`

Expected: FAIL because `sequence.js` is absent.

- [ ] **Step 3: Implement the module and connect it**

Create `sequence.js` with five asset-backed memories using the variants asserted above, `silentPauseMs: 2000`, and final lines `너와 함께한 모든 순간이\n내가 가장 아끼는 장면이 되었어.`, `이제 화면 속 이야기는 여기까지야.\n우리의 진짜 이야기는, 지금부터 시작이야.`, and `고개를 들어\n나를 봐줄래?`. Export it to CommonJS and `window`. Load it before `script.js`; replace the local memory array with its memory list.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/sequence.test.js`

Expected: PASS with one test.

- [ ] **Step 5: Commit**

Run: `git add sequence.js tests/sequence.test.js index.html script.js; git commit -m "feat: define cinematic proposal sequence"`

### Task 2: Replace response buttons with the final letter

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `tests/sequence.test.js`

**Interfaces:**
- Produces: `#realProposalCue`, `#finalLetterText`, and `playFinalLetter()`.

- [ ] **Step 1: Write the failing test**

```js
test('keeps the real proposal cue free of response buttons', () => {
  const html = require('node:fs').readFileSync('index.html', 'utf8');
  assert.match(html, /id="realProposalCue"/);
  assert.doesNotMatch(html, /id="proposalBtns"/);
  assert.doesNotMatch(html, /id="noBtn"/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/sequence.test.js`

Expected: FAIL because the current button group remains.

- [ ] **Step 3: Implement the real-life cue**

Replace the button group with `<div id="realProposalCue" aria-live="polite"><p id="finalLetterText"></p></div>`. Add `playFinalLetter()` to type each sequence line after the final memory exits; preserve the final line for `silentPauseMs`, with no later text or effect. Remove `moveNoBtn`, `acceptProposal`, and their listeners.

- [ ] **Step 4: Verify GREEN and commit**

Run: `node --test tests/sequence.test.js; git add index.html script.js tests/sequence.test.js; git commit -m "feat: cue the real-life proposal"`

Expected: two passing tests, then one focused commit.

### Task 3: Vary memory scenes and soften the ending

**Files:**
- Modify: `style.css`
- Modify: `script.js`
- Modify: `tests/sequence.test.js`

**Interfaces:**
- Produces: `memory-step--full-frame`, `memory-step--polaroid`, `memory-step--close-up`, and `memory-step--film-strip` styles.

- [ ] **Step 1: Write the failing test**

```js
test('styles every declared memory variant', () => {
  const css = require('node:fs').readFileSync('style.css', 'utf8');
  for (const { variant } of sequence.memories) assert.match(css, new RegExp(`memory-step--${variant}`));
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/sequence.test.js`

Expected: FAIL because variant selectors do not yet exist.

- [ ] **Step 3: Implement and verify GREEN**

Append the variant class to each generated memory step. CSS gives full-frame a slow scale, polaroid a white border and rotation, close-up a cropped image, and film-strip a dark frame. Remove flowers from the final scene; use a low-opacity static star field behind the cue. Run `node --test tests/sequence.test.js` and confirm all three tests pass.

- [ ] **Step 4: Run final checks and commit**

Run: `node --check sequence.js; node --check script.js; git diff --check; git add style.css script.js tests/sequence.test.js; git commit -m "feat: vary proposal memory scenes"`

Expected: zero syntax or whitespace errors and one focused commit.
