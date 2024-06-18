const { replaceMiddle, roundToNDigits, extractSortedValuesByKeys, filterAndLimitString, parseStringArray} = require('../static/js/utils'); // replace with the actual file name

test('replaces middle of long strings correctly', () => {
  expect(replaceMiddle('abcdefghijk')).toBe('abcd...hijk');
  expect(replaceMiddle('1234567890')).toBe('1234...7890');
});

test('returns short strings unchanged', () => {
    expect(replaceMiddle('abcd')).toBe('abcd');
    expect(replaceMiddle('12345678')).toBe('12345678');
});

test('rounds numbers to N digits', () => {
    expect(roundToNDigits(123.45678, 2)).toBe(123.46);
    expect(roundToNDigits(0.123456, 4)).toBe(0.1235);
});

test('extracts sorted values by keys from a dictionary', () => {
    const dictionary = { z: 3, a: 1, f: 2 };
    expect(extractSortedValuesByKeys(dictionary)).toEqual([1, 2, 3]);
});

// test the function `filterAndLimitString`
test('filters and limits strings correctly', () => {
    expect(filterAndLimitString('abc123', 5)).toBe('abc12');
    expect(filterAndLimitString('AbC 123', 10)).toBe('AbC123');
    expect(filterAndLimitString('AbC!#ß 123', 6)).toBe('AbC123');
});

// test the function `parseStringArray`
test('parses string arrays correctly', () => {
    expect(parseStringArray('abc')).toEqual(['abc']);
    expect(parseStringArray('abc,def,ghi')).toEqual(['abc', 'def', 'ghi']);
    expect(parseStringArray('abc,def,ghi,')).toEqual(['abc', 'def', 'ghi', '']);
    expect(parseStringArray('abc,def,ghi,')).not.toEqual(['abc', 'def', 'ghi']);
})