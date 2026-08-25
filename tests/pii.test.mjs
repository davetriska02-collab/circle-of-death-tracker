import { test } from 'node:test';
import assert from 'node:assert/strict';
import { containsPII, findPIIPaths, sessionContainsPII } from '../pii.js';

test('accepts ordinary clinical-IT notes', () => {
  assert.equal(containsPII('EMIS froze on patient summary screen'), false);
  assert.equal(containsPII('Accurx SMS delayed for 2 minutes'), false);
});

test('rejects NHS number phrase and digit patterns', () => {
  assert.equal(containsPII('patient NHS number on screen'), true);
  assert.equal(containsPII('nhsnumber written together still matches phrase? NHS number'), true);
  assert.equal(containsPII('4010232131'), true);
  assert.equal(containsPII('401 023 2131'), true);
  assert.equal(containsPII('401-023-2131'), true);
});

test('walks nested incident notes', () => {
  const session = {
    narrative: 'slow morning',
    incidents: [{ id: 1, note: 'NHS number visible on freeze' }],
  };
  assert.equal(sessionContainsPII(session), true);
  assert.deepEqual(findPIIPaths(session), ['incidents[0].note']);
});

test('returns no hits for a clean session', () => {
  const session = {
    narrative: 'EMIS slow all morning',
    incidents: [{ id: 1, note: 'loading patient list' }],
  };
  assert.equal(sessionContainsPII(session), false);
  assert.deepEqual(findPIIPaths(session), []);
});
