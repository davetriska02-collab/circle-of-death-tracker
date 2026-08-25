import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function hasIdLabel(item) {
  return item && typeof item.id === 'string' && typeof item.label === 'string';
}

test('config.json is a valid 1.0 tracker config', async () => {
  const config = JSON.parse(await readFile(new URL('../config.json', import.meta.url), 'utf8'));

  assert.equal(typeof config.appVersion, 'string');
  assert.match(config.appVersion, /^\d+\.\d+\.\d+$/);
  assert.equal(config.storageMode, 'worker');
  assert.match(config.workerUrl, /^https:\/\/.+\.workers\.dev\/submit$/);
  assert.equal(config.fallbackRepo, 'davetriska02-collab/circle-of-death-tracker');

  for (const key of ['sites', 'roles', 'sessionTypes']) {
    assert.ok(Array.isArray(config[key]) && config[key].length > 0, `${key} must be a non-empty array`);
    assert.ok(config[key].every(hasIdLabel), `${key} entries need id and label`);
  }
});
