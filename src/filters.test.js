// @flow

import filterPasteData from './filters';

test('empty config strips dollar prefix and newline postfix', () => {
  expect(filterPasteData({}, ' $ hellobello\n')).toBe('hellobello');
});

test('dollar prefix strip leaves variables in place', () => {
  expect(filterPasteData({keepDollarPrefixes: false}, '$PATH')).toBe('$PATH');
});
