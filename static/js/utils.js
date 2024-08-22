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

function setCurrency(currency) {
    // Update the global currency variable
    curr = getCurrencySymbol(currency);
  
    // Update the dropdown button to show the selected currency icon
    $('#currDDG .dropdown-toggle').html(getCurrencyHtml(currency));
  
    // Update the 'c' parameter in the URL
    var url = new URL(window.location.href);
    url.searchParams.set('c', currency);
    window.history.pushState({}, '', url);
  }
  
  // Function to return the HTML for the selected currency icon
  function getCurrencyHtml(currency) {
    let currencyIcons = {
      'USD': '<i class="bi bi-currency-dollar"></i>',
      'EUR': '<i class="bi bi-currency-euro"></i>',
      'GBP': '<i class="bi bi-currency-pound"></i>',
      'JPY': '<i class="bi bi-currency-yen"></i>',
      'NULL': '<i class="bi bi-reception-0"></i>'  // Use the "NULL" option with the corresponding icon
    };
    return currencyIcons[currency];
  }
  
  // Function to return the symbol for the selected currency
  function getCurrencySymbol(currency) {
    let currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CHF': 'CHF',  // Swiss Franc doesn't have a single-character symbol
      'NULL': ''  // If NULL, set to an empty string or any default you prefer
    };
    return currencySymbols[currency];
  }

  function getCurrencyFromURL() {
    // Get the 'c' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const currency = urlParams.get('c') || 'USD'; // Default to 'USD' if 'c' is not present
    return currency;
 }