const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('proposal markup uses a real-life cue without response buttons', () => {
  const html = fs.readFileSync('index.html', 'utf8');

  assert.match(html, /id="finalProposalQuestion"/);
  assert.match(html, /id="lookUpCue"/);
  assert.doesNotMatch(html, /id="proposalBtns"|id="noBtn"/);
});

test('defines five camera variants and the two-second final beat', () => {
  const script = fs.readFileSync('script.js', 'utf8');

  for (const variant of ['slow-zoom', 'print', 'pan', 'glow', 'finale']) {
    assert.match(script, new RegExp(`variant: '${variant}'`));
  }
  assert.match(script, /const FINAL_SILENT_BEAT_MS = 2000/);
  assert.doesNotMatch(script, /function createFlowers|function moveNoBtn/);
});

test('styles every camera variant and provides calm responsive motion', () => {
  const css = fs.readFileSync('style.css', 'utf8');

  for (const variant of ['slow-zoom', 'print', 'pan', 'glow', 'finale']) {
    assert.match(css, new RegExp(`memory-step--${variant}`));
  }
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /max-height:\s*52vh/);
});
