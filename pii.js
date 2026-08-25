/** Shared NHS-identifier checks for the app and (via Wrangler bundle) the Worker. */

const NHS_NUMBER_PHRASE = /\bNHS\s*number\b/i;
const TEN_DIGITS = /\b\d{10}\b/;
const GROUPED_NHS = /\b\d{3}[\s-]\d{3}[\s-]\d{4}\b/;

export function containsPII(value) {
  if (typeof value !== 'string') return false;
  return NHS_NUMBER_PHRASE.test(value) || TEN_DIGITS.test(value) || GROUPED_NHS.test(value);
}

function walkStrings(value, path, visit) {
  if (typeof value === 'string') {
    visit(path, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkStrings(item, `${path}[${i}]`, visit));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const next = path ? `${path}.${key}` : key;
      walkStrings(child, next, visit);
    }
  }
}

export function findPIIPaths(value) {
  const hits = [];
  walkStrings(value, '', (path, str) => {
    if (containsPII(str)) hits.push(path || '(root)');
  });
  return hits;
}

export function sessionContainsPII(session) {
  return findPIIPaths(session).length > 0;
}
