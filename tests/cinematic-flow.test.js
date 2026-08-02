const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('proposal markup uses a real-life cue without response buttons', () => {
  const html = fs.readFileSync('index.html', 'utf8');

  assert.match(html, /id="finalProposalQuestion"/);
  assert.match(html, /id="lookUpCue"/);
  assert.doesNotMatch(html, /id="proposalBtns"|id="noBtn"/);
});
