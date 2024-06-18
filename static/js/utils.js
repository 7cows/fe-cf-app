function roundToNDigits(value, n) {
    return Number(Math.round(value + 'e' + n) + 'e-' + n);
}

function extractSortedValuesByKeys(dictionary) {
    if (dictionary == null) {
        return null;
    }
    let sortedKeys = Object.keys(dictionary).sort();
    let sortedValues = sortedKeys.map(key => dictionary[key]);
    return sortedValues;
}

function replaceMiddle(str) {
    if (str.length <= 8) {
        return str;  // Return the original string if it's too short
    }
    return str.substr(0, 4) + '...' + str.substr(-4);
}

function filterAndLimitString(input, n) {
    console.log("filterAndLimitString::input", input);
    if (input === undefined) {
        return '';
    }
    const filtered = input.replace(/[^A-Za-z0-9]/g, '');
    return filtered.slice(0, n);
}

function parseStringArray(input) {
    return input.split(',').map(s => s.trim());
}
  
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { replaceMiddle, roundToNDigits, extractSortedValuesByKeys, filterAndLimitString, parseStringArray };
}