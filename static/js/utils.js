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

function fetchTranslations(language) {
    return $.ajax({
        url: API_ENDPOINT + '/api/translations/' + language,
        method: 'GET',
        dataType: 'json'
    }).then(function(data) {
        // Return the translations dictionary
        return data;
    }).catch(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching translations:', textStatus, errorThrown);
        return {}; // Return an empty object in case of an error
    });
}

async function setLanguage(language) {
    // Update the dropdown to show the selected language
    $('#langDDG .dropdown-toggle').html(language);
    
    // Update the URL with the new language parameter
    var url = new URL(window.location.href);
    url.searchParams.set('l', language);
    window.history.pushState({}, '', url);

    // Fetch the updated translations asynchronously
    var updated_translations = await fetchTranslations(language);

    // Update the global translations variable if new translations are fetched
    if (Object.keys(updated_translations).length > 0) {
        translations = updated_translations;
    }
    reGenerateUI();
}

function reGenerateUI() {
    let oldSpecificId = specificId-1;
    // Optionally reset specificId and repopulate forms
    specificId = 1;
    for (let productId = 1; productId <= oldSpecificId; productId++) {
        let params = extractParams(productId);
        generateProductCard(form_settings, params);
    }
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

function setCurrency(currency) {
    // Update the global currency variable
    curr = getCurrencySymbol(currency);
  
    // Update the dropdown button to show the selected currency icon
    $('#currDDG .dropdown-toggle').html(getCurrencyHtml(currency));
  
    // Update the 'c' parameter in the URL
    var url = new URL(window.location.href);
    if (curr !== 'USD') url.searchParams.set('c', currency);
    window.history.pushState({}, '', url);
    reGenerateUI();
}

function sparseTable(dataObject) {
    let data = dataObject.data;
    let columns = dataObject.columns;
    let rowCount = data.length;
    console.log("sparseTable/rowCount", rowCount);
    if (rowCount < 7){
        return dataObject;
    }
    // Create a new data array with only the first two, last two rows and the middle row with `...`
    let sparseData = [
        data[0], // First row
        data[1], // Second row
        // Middle row with '...'
        Array(columns.length).fill('').map((_, i) => (i === 0 ? '...' : '')),
        data[rowCount - 2], // Second to last row
        data[rowCount - 1]  // Last row
    ];

    // Return a new object with the same columns and the sparse data
    return {
        columns: columns,
        data: sparseData,
        index: [0, 1, '...', rowCount - 2, rowCount - 1] // Updated index
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { replaceMiddle, roundToNDigits, extractSortedValuesByKeys, filterAndLimitString, parseStringArray, fetchTranslations };
}
