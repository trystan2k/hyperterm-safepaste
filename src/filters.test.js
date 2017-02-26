// @flow

import filterPasteData from './filters';

test('empty config strips dollar prefix and newline postfix', () => {
  expect(filterPasteData({}, ' $ hellobello\n')).toBe('hellobello');
});

test('dollar prefix strip leaves variables in place', () => {
  expect(filterPasteData({keepDollarPrefixes: false}, '$PATH')).toBe('$PATH');
});

test('allows keeping dollar prefixes', () => {
  expect(filterPasteData({keepDollarPrefixes: true}, ' $ yes')).toBe(' $ yes');
});

test('allows keeping last newline', () => {
  expect(filterPasteData({keepNewlinePostfix: true}, 'data\n')).toBe('data\n');
});

test('strips all newlines from end', () => {
  expect(filterPasteData({keepNewlinePostfix: false}, 'data\n\n')).toBe('data');
});

test('allows passing in custom filter function', () => {
  expect(filterPasteData({overrideFilter: () => 'yolo'}, 'meh')).toBe('yolo');
});
