# Memory Film Proposal Edit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the existing Korean copy while replacing repetitive typing and uniform photo transitions with a paced cinematic montage and a real-life proposal cue.

**Architecture:** Keep the existing static HTML/CSS/JavaScript scene model. Store memory presentation metadata beside the existing memory copy, add small fade/type helpers in `script.js`, and express camera treatments through CSS modifier classes. Static source-contract tests verify the approved structure without adding dependencies.

**Tech Stack:** HTML5, CSS animations, browser JavaScript, Node built-in test runner.

## Global Constraints

- Preserve the meaning and order of all current user-facing copy.
- Keep existing images and `assets/bgm.mp3`.
- Use typing sound only for the intro and final proposal question.
- Remove flower particles, scattered proposal photos, and `Yes / No` controls.
- Keep a 2,000 ms silent beat before the final real-life proposal cue.
- Keep photo height at or below 52vh on mobile and honor `prefers-reduced-motion`.

---

### Task 1: Establish the approved scene contract

**Files:**
- Create: `tests/cinematic-flow.test.js`
- Modify: `index.html`

**Interfaces:**
- Produces: `#finalProposalQuestion`, `#lookUpCue`, and button-free proposal markup.

- [ ] **Step 1: Write a failing source-contract test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('proposal markup uses a real-life cue without response buttons', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(html, /id="finalProposalQuestion"/);
  assert.match(html, /id="lookUpCue"/);
  assert.doesNotMatch(html, /id="proposalBtns"|id="noBtn"/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/cinematic-flow.test.js`

Expected: FAIL because the new cue elements do not exist and response buttons remain.

- [ ] **Step 3: Implement the proposal markup**

Keep the existing promise copy in the proposal section. Replace the button group with empty `#finalProposalQuestion` and `#lookUpCue` elements carrying accessible live-region semantics. Remove flower and scattered-memory containers from the proposal scene.

- [ ] **Step 4: Verify GREEN and commit**

Run: `node --test tests/cinematic-flow.test.js`

Expected: one passing test.

Run: `git add index.html tests/cinematic-flow.test.js && git commit -m "feat: prepare real-life proposal cue"`

### Task 2: Recut prologue, candle, memories, and proposal timing

**Files:**
- Modify: `script.js`
- Modify: `tests/cinematic-flow.test.js`

**Interfaces:**
- Produces: memory items with `variant`; `revealSequence()` for non-typing copy; `startProposalScene()` with a 2,000 ms beat.

- [ ] **Step 1: Extend the failing contract test**

```js
test('defines five camera variants and the two-second final beat', () => {
  const script = fs.readFileSync('script.js', 'utf8');
  for (const variant of ['slow-zoom', 'print', 'pan', 'glow', 'finale']) {
    assert.match(script, new RegExp(`variant: '${variant}'`));
  }
  assert.match(script, /const FINAL_SILENT_BEAT_MS = 2000/);
  assert.doesNotMatch(script, /function createFlowers|function moveNoBtn/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/cinematic-flow.test.js`

Expected: FAIL because variants and the final-beat constant are absent and legacy effects remain.

- [ ] **Step 3: Implement the scene pacing**

Add the five asserted variants to the existing memory entries without changing their copy. Use `revealSequence()` for prologue copy, the first two candle lines, and memory captions. Keep `typeText()` for the candle request and final question. Lower BGM volume as the candle goes out and before the final question. Render `나와 결혼해 줄래?`, wait `FINAL_SILENT_BEAT_MS`, then reveal `고개를 들어 나를 바라봐줄래?`. Remove button, flower, scattered-photo, and success-screen interaction code.

- [ ] **Step 4: Verify GREEN and syntax**

Run: `node --test tests/cinematic-flow.test.js && node --check script.js`

Expected: two passing tests and zero syntax errors.

- [ ] **Step 5: Commit**

Run: `git add script.js tests/cinematic-flow.test.js && git commit -m "feat: recut cinematic proposal pacing"`

### Task 3: Add camera treatments and responsive safeguards

**Files:**
- Modify: `style.css`
- Modify: `index.html`
- Modify: `tests/cinematic-flow.test.js`

**Interfaces:**
- Consumes: `memory-step--slow-zoom`, `--print`, `--pan`, `--glow`, and `--finale` classes emitted by `script.js`.
- Produces: responsive montage styling and reduced-motion overrides.

- [ ] **Step 1: Extend the failing contract test**

```js
test('styles all camera variants and reduced motion', () => {
  const css = fs.readFileSync('style.css', 'utf8');
  for (const variant of ['slow-zoom', 'print', 'pan', 'glow', 'finale']) {
    assert.match(css, new RegExp(`memory-step--${variant}`));
  }
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /max-height:\s*52vh/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/cinematic-flow.test.js`

Expected: FAIL because the montage variants and reduced-motion rule are absent.

- [ ] **Step 3: Implement the visual system**

Add CSS for the five asserted camera variants, caption fading, the dark final proposal background, gold final cue, 52vh mobile image cap, and reduced-motion behavior. Remove obsolete flower, scattered-photo, and response-button styles. Increase `style.css` and `script.js` cache-buster query values in `index.html`.

- [ ] **Step 4: Verify the full change**

Run: `node --test tests/cinematic-flow.test.js && node --check script.js && git diff --check`

Expected: three passing tests and zero syntax or whitespace errors.

- [ ] **Step 5: Commit**

Run: `git add index.html style.css tests/cinematic-flow.test.js && git commit -m "feat: style cinematic memory montage"`
