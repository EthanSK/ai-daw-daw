import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const plan = readFileSync(new URL('../PLAN.md', import.meta.url), 'utf8');

test('plan names Humforge and metronome feature', () => {
  assert.match(plan, /Humforge/);
  assert.match(plan, /Metronome/);
});
