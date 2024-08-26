let cashFlows = {};
let disaggCashFlows = {}; 
let sumCashFlows = {};
let sumDisaggCashFlows = {};
let hashes = {};
let productTypes = {};
let pf_permahash = '';
let specificId = 1; // to keep track of IDs to ensure uniqueness.
let curr = getCurrencyFromURL();
//let curr = "$";
let form_settings = '10111100000';
let ui_settings = '000';
// TODO: delete this dictionary once working
let translations = {}

API_ENDPOINT = typeof API_ENDPOINT !== 'undefined' ? API_ENDPOINT : '';


function get_host(){
  return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

function getQueryParam(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
}

function extractBalanceForProduct(productData, productType) {
  if (!productData || !productData.columns) {
      throw new Error("Invalid product data");
  }
  //console.log("extractBalanceForProduct/productData");
  //console.log(productData);
  // Get the index of 'balance' from columns
  let balanceIndex = productData.columns.indexOf("balance");

if (balanceIndex === -1) {  // If "balance" is not found...
    balanceIndex = productData.columns.indexOf(translations["Outstanding Balance"]);  // ...try "Outstanding Balance"
}
  if (balanceIndex === -1) {
      throw new Error("Balance column not found");
  }

  // Return the first value from the 'balance' column data
  if (productType == 'annuity'){
    return productData.data[0][balanceIndex];
  } else if (productType == 'deposit'){
    return productData.data[productData.data.length - 1][balanceIndex];
  }
}

function extractBalance(products) {
  let result = {};
  for (let productID in products) {
      //console.log("extractBalance/products[productID]", productID);
      //console.log(products[productID]);  // log the product data
      //console.log(products[productID]);  // log the product data
      result[productID] = extractBalanceForProduct(products[productID], productTypes[productID]);
  }
  return result;
}

function extractDesc(products) {
  let result = {};
  let found = false; // Flag to track if any element with a value is found

  for (let productID in products) {
    let elementID = `short_descDisplay-${productID}`;
    let value = $(`#${elementID}`).val();
    if (value) { // Check if the element has a value
      result[productID] = value;
      found = true; // Mark that we've found an element with a value
    }
  }
  // If no elements with values were found, return undefined
  if (!found) {
    return undefined;
  }
  return Object.values(result);
}


chooseAnnFreeParameter = function(radio, productId) {
  var n = parseFloat($('#n-' + productId).val());
  var id = radio.getAttribute('id');
  console.log("chooseAnnFreeParameter/id", id);
  
  // Define an array of the elements' ID prefixes
  let idPrefixes = [
    'P0Display',
    'r',
    'ADisplay',
    'T_YearsDropdown',
    'T_MonthsDropdown',
    'T_Slider',
    'remainingDebt'
  ];

  // Loop through each prefix and update the prop
  $.each(idPrefixes, function(index, prefix) {
    $('#' + prefix + '-' + productId).prop('disabled', false);
  });
  // If the id needs to be associated with a specific product, 
  // you can parse the productId from the radio button's id as well.
  switch(id) {
    case "rbP0-" + productId:
      $('#P0Display-' + productId).prop('disabled', true);
      break;
    case "rbr-" + productId:
      $('#r-' + productId).prop('disabled', true);
      break;
    case "rbA-" + productId:
      $('#ADisplay-' + productId).prop('disabled', true);
      break;
    case "rbremainingDebt-" + productId: 
      $('#remainingDebt-' + productId).prop('disabled', true);
      break;
    case "rbT-" + productId:
      $('#T_YearsDropdown-' + productId).prop('disabled', true);
      $('#T_MonthsDropdown-' + productId).prop('disabled', true);
      $('#T_Slider-' + productId).prop('disabled', true);
      break;
  }
}

function clickDropdown(e, type) {
  e.preventDefault();  // prevent the default anchor link behavior
  
  var selectedValue = $(this).attr('data-value');  // get the value from the clicked item
  var productId = $(this).closest('.product').data('product-id');
  
  // Determine whether we're dealing with years or months
  var isYear = type === 'year';
  
  // Update the appropriate element
  $("#loanMaturity" + (isYear ? 'Years' : 'Months') + "-" + productId).val(selectedValue);
  
  // Update the button text to reflect the chosen value
  $("#" + (isYear ? 'T_YearsDropdown' : 'T_MonthsDropdown') + "-" + productId).text(selectedValue + (selectedValue === "1" ? ' ' + type : ' ' + type + 's'));
  
  // Calculate the new slider value
  if (isYear) {
    $("#T_Slider-" + productId).val(selectedValue * 12 + parseInt($("#T_months-" + productId).val()));
  } else {
    $("#T_Slider-" + productId).val(parseInt($("#T_years-" + productId).val()) * 12 + parseInt(selectedValue));
  }
}

// You'd then attach these functions to your event listeners by partially applying the function with the type of dropdown:

function clickTimeDropdown(e, mainTimeUnit, prefix = "T_") {
  e.preventDefault();

  let secondaryTimeUnit = mainTimeUnit === 'year' ? 'month' : 'year';
  clickDropdown.call(this, e, mainTimeUnit);

  var selectedMainUnit = $(this).data('value');
  var productId = $(this).closest('.dropdown').find('button[id^="' + prefix + capitalizeFirstLetter(mainTimeUnit) + 'sDropdown-"]').attr('id').split('-')[1];

  // Update the hidden input and text of the button
  $('#' + prefix + capitalizeFirstLetter(mainTimeUnit) + 's-' + productId).val(selectedMainUnit);
  $('#' + prefix + capitalizeFirstLetter(mainTimeUnit) + 'sDropdown-' + productId).text(selectedMainUnit + (selectedMainUnit === 1 ? " " + mainTimeUnit : " " + mainTimeUnit + "s"));

  // Assuming the opposite dropdown value is already set
  var selectedSecondaryUnit = $('#' + prefix + capitalizeFirstLetter(secondaryTimeUnit) + 's-' + productId).val() || 0;

  // Now call the function to set the maturity slider value
  if (mainTimeUnit === 'year') {
      setSliderValue(productId, selectedMainUnit, selectedSecondaryUnit, prefix);
  } else {
      setSliderValue(productId, selectedSecondaryUnit, selectedMainUnit, prefix);
  }
}

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

clickYearsDropdown = function(e, prefix = "T_") {
  e.preventDefault();
  let main_time_unit = 'year';
  let secondary_time_unit = 'month';
  clickDropdown.call(this, e, main_time_unit);
  var selectedMainUnit = $(this).data('value');
  var productId = $(this).closest('.dropdown').find('button[id^="' + prefix + 'YearsDropdown-"]').attr('id').split('-')[1];
  
  // Update the hidden input and text of the button
  $('#' + prefix + 'Years-' + productId).val(selectedMainUnit);
  $('#' + prefix + 'YearsDropdown-' + productId).text(selectedMainUnit + (selectedMainUnit === 1 ? " " + main_time_unit : " " + main_time_unit + "s"));

  // Assuming month dropdown value is already set or defaults to 0 if not set
  var selectedSecondaryUnit = $('#' + prefix + secondary_time_unit + 's-' + productId).val() || 0;

  // Now call the function to set the maturity slider value
  setSliderValue(productId, selectedMainUnit, selectedSecondaryUnit, prefix);
}

clickMonthsDropdown = function(e, prefix = "T_") {
  e.preventDefault();
  let main_time_unit = 'month';
  let secondary_time_unit = 'year';
  clickDropdown.call(this, e, main_time_unit);
  var selectedMainUnit = $(this).data('value');
  var productId = $(this).closest('.dropdown').find('button[id^="' + prefix + 'MonthsDropdown-"]').attr('id').split('-')[1];
  
  // Update the hidden input and text of the button
  $('#' + prefix + 'Months-' + productId).val(selectedMainUnit);
  $('#' + prefix + 'MonthsDropdown-' + productId).text(selectedMainUnit + (selectedMainUnit === 1 ? " " + main_time_unit : " " + main_time_unit + "s"));

  // Assuming year dropdown value is already set
  var selectedSecondaryUnit = $('#' + prefix + secondary_time_unit + 's-' + productId).val() || 0;

  // Now call the function to set the maturity slider value
  setSliderValue(productId, selectedSecondaryUnit, selectedMainUnit, prefix);
};

function setSliderValue(productId, years, months, prefix = "T_") {
  var totalMonths = parseInt(years, 10) * 12 + parseInt(months, 10);
  $('#' + prefix + 'Slider-' + productId).val(totalMonths);
  updateSlider(productId, prefix); // Call your existing function
}

populateForm = function(productId, params) {
  if (Object.keys(params).length === 0) {
    return;
  }
  const APR_rounding_digits = 4;
  console.log('populateForm/params:', params);
  console.log('Populating form for product: ' + productId);

  //populate the money fields
  const fields = ['P0','A','remainingDebt', 'minPayment'];

  fields.forEach(field => {
      $('#'+ field + 'Display-' + productId).val(params[field]);
      $('#'+ field + '-' + productId).val(params[field]);
  });

  // Text and Hidden Inputs
  $('#r-' + productId).val(roundToNDigits(params.r*100, APR_rounding_digits));
  $('#n-' + productId).val(params.n);
  $('#T_years-' + productId).val(params.T_years);
  $('#T_months-' + productId).val(params.T_months);
  
  // Dropdown buttons
  $('#T_YearsDropdown-' + productId).text(params.T_years + ' year' + (params.T_years > 1 ? 's' : ''));
  $('#T_MonthsDropdown-' + productId).text(params.T_months + ' month' + (params.T_months !== 1 ? 's' : ''));
  
  // Range Slider
  $('#T_Slider-' + productId).val(params.T_years * 12 + params.T_months);
  
  // Frequency Label and Slider
  let frequencyLabel = 'Monthly';
  if(params.n == 1) frequencyLabel = 'Yearly';
  if(params.n == 4) frequencyLabel = 'Quarterly';
  $('#frequencyLabel-' + productId).text(frequencyLabel);
  $('#nSlider-' + productId).val(params.n == 1 ? 1 : (params.n == 4 ? 2 : 3));

  if (params.product == 'annuity'){
    console.log("populateForm/params.product", params.product);
    $('.annuity-switch[data-value="'+ productId + '"]').click();
  } else if (params.product == 'deposit'){
    console.log("populateForm/params.product", params.product);
    console.log('.rd-switch[data-value="'+ productId + '"]');
  }

  console.log("populateForm/params.free_param", params.free_param);
  // TODO: This is a temporary solution, replace a consistent way for maturity/T key
  let freeParamId = params.free_param == 'maturity' ?  'rbT-' + productId : 'rb' + params.free_param + '-' + productId;
  console.log("populateForm/freeParamId", freeParamId);
  $('#' + freeParamId).click();
  
  var HOST_URL = get_host();
  //var hashLink = set_pf_permahash(params, HOST_URL);
  //var hashLink = 'Product link: <a href="' + HOST_URL + '/CF/' + params.permahash + '?P0=' + params.P0 + '">' + replaceMiddle(params.permahash) + '</a>';
  var hashUrl = helper_createHashLink('product', params.permahash, params.P0, HOST_URL, params.short_desc);
  var hashLink = createHashLink('product', params.permahash, hashUrl);
  $('#permahash-' + productId).html(hashLink);
  // add product QR code
  displayLinkAndQRCode(productId, hashUrl);
};

// reverse of populateForm
function extractParams(productId) {
  const APR_rounding_digits = 4; // Assuming you need to round the APR when extracting it
  let params = {};

  // Helper function to assign values only if they're valid
  function assignIfValid(key, value) {
      if (value !== undefined && !isNaN(value) && value !== null) {
          params[key] = value;
      } else {
          params[key] = '';
      }
  }

  // Extract values from money fields
  const fields = ['P0', 'A', 'remainingDebt', 'minPayment'];
  fields.forEach(field => {
      let value = $('#' + field + '-' + productId).val();
      assignIfValid(field, value);
  });

  // Text and Hidden Inputs
  let rate = parseFloat($('#r-' + productId).val()) / 100; // Convert back from percentage
  assignIfValid('r', rate);

  let n = parseInt($('#n-' + productId).val(), 10);
  assignIfValid('n', n);

  let T_years = parseInt($('#T_years-' + productId).val(), 10);
  assignIfValid('T_years', T_years);

  let T_months = parseInt($('#T_months-' + productId).val(), 10);
  assignIfValid('T_months', T_months);

  // Determine frequency based on nSlider position
  const nSliderValue = $('#nSlider-' + productId).val();
  let frequency = nSliderValue == 1 ? 1 : (nSliderValue == 2 ? 4 : 12);
  assignIfValid('n', frequency);

  // Check product type using specific classes or data attributes
  if ($('.annuity-switch[data-value="' + productId + '"]').is(':checked')) {
      params.product = 'annuity';
  } else if ($('.rd-switch[data-value="' + productId + '"]').is(':checked')) {
      params.product = 'deposit';
  }

  // Deduce free_param based on the radio button checked status
  if (true) {
    params.freeParam = $('#rbP0-' + productId).is(':checked') ? 'P0' :
    $('#rbT-' + productId).is(':checked') ? 'maturity' :
    $('#rbA-' + productId).is(':checked') ? 'A' :
    $('#rbr-' + productId).is(':checked') ? 'r' : 'r';
    assignIfValid('free_param', params.freeParam);
  } else {
    params.freeParam = 'r';
  }
  params.permahash = hashes[productId];
  return params;
}

function processData(productId) {
  let sliderValue = $('#nSlider-' + productId).val();
  let frequencyMap = { 1: 1, 2: 4, 3: 12 }; // Mapping slider values to frequencies
  let frequency = frequencyMap[sliderValue] || 1; // Default to yearly if not found
  
  $('#n-' + productId).val(frequency);

  //var cf_hash = $("#search-term-" + productId).val();
  
  var dataToSend = {};
  var missingData = [];

  const fields = [
    { key: 'P0', display: true },
    { key: 'r', isPercentage: true },
    { key: 'A', display: true },
    { key: 'T_years' },
    { key: 'T_months' },
    { key: 'shift_years' },
    { key: 'shift_months' },
    { key: 'remainingDebt', display: true },
    { key: 'minPayment', display: true }
    //{ key: 'form_settings' },
  ];

  fields.forEach(({ key, display, isPercentage }) => {
    //console.log('processData/element_key:', `#${key}-${productId}`);
    let value = $(`#${key}-${productId}`).val();
    //console.log('processData/element_value:', key, value);
    //let isDisabled = display ? $(`#${key}Display-${productId}`).prop("disabled") : false;
    let isDisabled = $(`#rb${key}-${productId}`).is(":checked");
    //console.log('processData/isDisabled:', key, isDisabled);

    if (isDisabled) {
        value = '';
    } else if (value === '') {

        missingData.push(key + (display ? 'Display' : ''));
    }

    if (isPercentage && !isDisabled) {
        value = parseFloat(value) / 100;
    }

    dataToSend[key] = value;
  });

  if ($("#T_Slider-" + productId).prop("disabled")) {
    dataToSend['T_years'] = '';
    dataToSend['T_months'] = '';
  } else {
    if (dataToSend['T_years'] === "") missingData.push("T_YearsDropdown");
  }
  dataToSend['n'] = frequency;
  
  //console.log('processData/dataToSend:', dataToSend);
  dataToSend['form_settings'] = form_settings;
  return { dataToSend, missingData };
};

highlightMissingData = function(productId, missing_data) {
  let criteria = false;
  if (missing_data.length > 0) {
    missing_data.forEach(function(item) {
      // Construct the full ID using the product ID and the item from the array
      var fullId = '#' + item + '-' + productId;
      console.log('highlightMissingData/fullId:', fullId);
      // Add the 'error' class to the element
      $(fullId).addClass('is-invalid');
    });
    criteria = true;
  }
  // Assuming you have your missing_data array like

  let allIds = ['P0Display', 'r', 'ADisplay', 'T_YearsDropdown', 'remainingDebtDisplay'];

  // Step 1: Find items in allIds that are not in missing_data
  let valid_data = allIds.filter(function(id) {
      return !missing_data.includes(id);
  });

  // Step 2: Remove 'is-invalid' class from the elements in valid_data
  valid_data.forEach(function(id) {
      $("#" + id + "-" + productId).removeClass('is-invalid');
  });

  return criteria;
  ;
};

callApi = function(productId, productType, isExample = false) {
  console.log('isExample:', isExample);  
  console.log("callApi/productId", productId);
  let { dataToSend, missingData } = isExample ? { dataToSend: {}, missingData: [] }: processData(productId);
  console.log('callApi/dataToSend:', dataToSend);
  console.log('callApi/missingData:', missingData);
  let isThereMissingData = isExample ? false : highlightMissingData(productId, missingData);
  if (!isThereMissingData) {

    $.ajax({
      url: API_ENDPOINT + '/api/cf/' + productType + (isExample ? '/example' : '/'),
      type: 'POST',
      data: JSON.stringify(dataToSend), // Convert JavaScript object to JSON string
      contentType: 'application/json', // Set MIME type to JSON
      dataType: 'json', 
      success: function(response) {
        console.log('Success:', response); // logging the entire response object to inspect its structure
        if (response.error_msg !== ''){
          console.log('callApi/ajax-response.error_msg:', response.error_msg);
          document.querySelector('.error_output').textContent = response.error_msg;
        }
        if (response.error_msg == '' || response.error_msg.includes('KPI')){
          if (response.json_raster ) {
            let json_raster = JSON.parse(response.json_raster);
            let json_disagg_raster = JSON.parse(response.json_disagg_raster);
            console.log('callApi/ajax-json_raster:', json_raster);
            console.log('callApi/ajax-json_disagg_raster:', json_disagg_raster);
            cashFlows[productId] = json_raster;
            disaggCashFlows[productId] = json_disagg_raster;
            productTypes[productId] = productType;
            console.log('callApi/ajax-json_raster/response.params:', response.params);
            hashes[productId] = response.params.permahash;
            sumCashFlows = {};
            sumDisaggCashFlows = {};
            for (cf in cashFlows) {
              sumCashFlows = addCashFlowJSONs(sumCashFlows, cashFlows[cf]);
            }
            for (cf in disaggCashFlows) {
              sumDisaggCashFlows = addCashFlowJSONs(sumDisaggCashFlows, disaggCashFlows[cf]);
            }
  
            console.log('callApi/ajax-json_raster:');
            console.log(json_raster);
            console.log('callApi/ajax - Sum of cash flows:');
            console.log(sumCashFlows);
            let rasterTable = htmlizeTable(renderRaster(sumCashFlows, 1, translations, curr), 'table table-hover');
            $('#raster-placeholder').html(rasterTable);
            console.log('callApi/ajax-response.error_msg (status 200):', response.error_msg);
            document.querySelector('.error_output').textContent = ''//response.error_msg;
            createCFDropdown();
          }
          
          if (response.json_extra_info) {
            let extraInfoTable = htmlizeTable(JSON.parse(response.json_extra_info), 'table table-hover');
            $('#extra-info-placeholder-' + productId).html(extraInfoTable);
            $('#card-info-' + productId).show();
            //$('#collapseKPIs-' + productId).collapse('show');
          }
          
          if(productId){
            populateForm(productId, response.params); // calling populateForm only if productId is defined
          }
          var permahashes = $.map(hashes, function(value, key) { return value });
          if (permahashes.length)
          {
            console.log("callApi/2nd ajax - permahashes", permahashes);
            $.ajax({
              url: API_ENDPOINT + '/api/modem/compress-hashes',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ hashes: permahashes }),
              success: function(data) {
                  console.log("callApi/2nd ajax - data.compressed", data.compressed);
                  console.log("callApi/2nd ajax - cashFlows", cashFlows);
                  var P0s = get_P0s(cashFlows);
                  var desc = get_descs(cashFlows);
                  console.log("callApi/2nd ajax - P0s", P0s);
                  console.log("callApi/2nd ajax - desc", desc);
                  var HOST_URL = get_host();

                  pf_permahash = data.compressed;
                  var hashUrl = helper_createHashLink('portfolio', pf_permahash, P0s, HOST_URL, desc);
                  var hashLink = createHashLink('portfolio', pf_permahash, hashUrl);
                  $('#pf_permahash').html(hashLink);
                  displayLinkAndQRCode('pf', hashUrl);
                  // if there are more than 1 cashflows, then we can calculate the portfolio KPIs
                  if (Object.keys(cashFlows).length > 1){
                    let tablePFkpiHTML = generatePFkpiTable(sumCashFlows);
                    document.getElementById('tablePFkpiPlaceholder').innerHTML = tablePFkpiHTML;
                  }
              },
              error: function(xhr, status, error) {
                  console.error('Error:', error);
              }
            });
          }

        }
      },
      error: function(xhr, status, error) {
        console.error('Status:', status);
        console.error('Error:', error);
        console.error('XHR:', xhr);
      }
    });

    
  } else {
    console.error('Invalid input, elements missing: ', missingData);
  }
};

function updateSlider(productId, prefix = "T_"){

  var slider = document.getElementById(prefix + "Slider-" + productId);
  var years_el = document.getElementById(prefix + "years-" + productId);
  var months_el = document.getElementById(prefix + "months-" + productId);

  var val = slider.value;
  console.log("updateSlider/val", val);
  let years = Math.floor(val / 12);
  let months = val % 12;
  
  years_el.value = years;
  $("#" + prefix + "YearsDropdown-" + productId).text(years + (years === 1 ? " year" : " years"));
  months_el.value = months;
  $("#"+ prefix + "MonthsDropdown-" + productId).text(months + (months === 1 ? " month" : " months"));
}

function updateFrequencyLabel(value, productId) {
  let label = document.getElementById('frequencyLabel-' + productId);
  let actualInput = document.getElementById('n-' + productId);
  let actualValue;
  switch (parseInt(value)) {
      case 1:
          actualValue = 1; // yearly
          label.textContent = 'Yearly';
          break;
      case 2:
          actualValue = 4; // quarterly
          label.textContent = 'Quarterly';
          break;
      case 3:
          actualValue = 12; // monthly
          label.textContent = 'Monthly';
          break;
  }
  // Update the actual input value
  actualInput.value = actualValue;
}

function hookFormEventsForProduct(productId) {
  console.log('Hooking form events for product: ' + productId);
  if (productId) {
    var elements = [
      { display: 'P0Display-' + productId, value: 'P0-' + productId },
      { display: 'ADisplay-' + productId, value: 'A-' + productId },
      { display: 'remainingDebtDisplay-' + productId, value: 'remainingDebt-' + productId },
      { display: 'minPaymentDisplay-' + productId, value: 'minPayment-' + productId }
    ];

    elements.forEach(({ display, value }) => {
      var displayElement = $('#' + display);
      var valueElement = $('#' + value);
      
      if (displayElement.length && valueElement.length) {
        formatValue(displayElement[0], valueElement[0]);
        displayElement.on('blur', function() {
          formatValue(displayElement[0], valueElement[0]);
        });
      }
    });
  }
}

function formatValue(inputElement, hiddenElement) {
  var value = inputElement.value.replace(/[',]/g, '');
  if (!isNaN(value) && value.trim() !== '') {
    inputElement.value = parseFloat(value).toLocaleString('de-CH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    hiddenElement.value = parseFloat(value);
  }
}

function htmlizeTable(dataObj, tableClass) {
  let table = $('<table></table>').addClass(tableClass);
  let thead = $('<thead></thead>').addClass('thead-light');
  let tbody = $('<tbody></tbody>');

  let headerRow = $('<tr></tr>');
  dataObj.columns.forEach(col => {
    headerRow.append($('<th></th>').text(col));
  });
  thead.append(headerRow);

  dataObj.data.forEach(row => {
    let tableRow = $('<tr></tr>');
    row.forEach(cell => {
      tableRow.append($('<td></td>').text(cell).css('text-align', 'center'));
    });
    tbody.append(tableRow);
  });

  table.append(thead).append(tbody);
  return table.prop('outerHTML'); // Get string representation of the table
}

  
validateInputs = function(productId){

};

function handleAnnuityClick(e) {
  e.preventDefault();
  var productId = $(this).closest('.dropdown').find('button[id^="dropdownProductButton-"]').attr('id').split('-')[1];
  // Your logic for handling annuity click
  console.log("Annuity Clicked for ID:", productId);
  $('#productType-' + productId).val('annuity');
  // Additional logic...
}

function handleRecurringDepositClick(e) {
  e.preventDefault();
  var productId = $(this).closest('.dropdown').find('button[id^="dropdownProductButton-"]').attr('id').split('-')[1];
  // Your logic for handling annuity click
  console.log("RD Clicked for ID:", productId);
  $('#productType-' + productId).val('deposit');
  // Additional logic...
}

function createCFDropdown() {
  if (Object.keys(cashFlows).length > 0) {
    let dropdownDownloadCSV = `<button onclick="downloadCSV()" id="csvDownloadButton" class="btn btn-light">${translations['Download as CSV']}</button>`; // Added Bootstrap class for styling
    $('#csvDropdown-placeholder').html(dropdownDownloadCSV); // Corrected the jQuery selector
    
    // Now add the disaggregated view
    let aggDisaggDropdownHtml = `
    <div class="dropdown d-inline">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="aggDisaggDropdownButton" data-toggle="dropdown" aria-expanded="false">
            ${translations['Aggregated']}
        </button>
        <ul class="dropdown-menu" aria-labelledby="aggDisaggDropdownButton" id="aggDisaggDropdown">
            <li><a class="dropdown-item" href="#" data-key="aggregated">${translations['Aggregated']}</a></li>
            <li><a class="dropdown-item" href="#" data-key="disaggregated">${translations['Disaggregated']}</a></li>
        </ul>
    </div>`;

    $('#disaggDropdown-placeholder').html(aggDisaggDropdownHtml);

    // Attach event handler for dropdown item click
    $('#aggDisaggDropdown').on('click', '.dropdown-item', handleAggDisaggDropdownItemClick);
  }


  if (Object.keys(cashFlows).length > 1) {
      // First add the aggregated view
      let dropdownHtml = `<div class="dropdown d-inline">
          <button class="btn btn-dark dropdown-toggle" type="button" id="cfDropdownButton" data-toggle="dropdown" aria-expanded="false">
              Sum of Cash Flows
          </button>
          <ul class="dropdown-menu" aria-labelledby="cfDropdownButton" id="cfDropdown">`;

      // Add "Sum of cash flows" as the default option
      dropdownHtml += `<li><a class="dropdown-item" href="#" data-key="sum">${translations["Sum of Cash Flows"]}</a></li>`;

      // Add new items based on sumCashFlows keys
      Object.keys(cashFlows).forEach(function(key, index) {
          dropdownHtml += `<li><a class="dropdown-item" href="#" data-key="${key}">${translations["Cash Flow"]} ${index + 1}</a></li>`;
      });

      dropdownHtml += `</ul></div>`;
      
      $('#CFswitchDropdown-placeholder').html(dropdownHtml);

      // Attach event handler for dropdown item click
      $('#cfDropdown').on('click', '.dropdown-item', handleDropdownItemClick);
      // end of aggregated view

  }
}

function handleDropdownItemClick(e) {
  e.preventDefault();
  let key = $(this).data('key');

  // Determine the current view (Aggregated or Disaggregated)
  let aggDisaggKey = $('#aggDisaggDropdownButton').data('key') || 'aggregated';

  let dataToRender;
  let n;

  if (aggDisaggKey === 'aggregated') {
    // Use aggregated data
    dataToRender = key === 'sum' ? sumCashFlows : cashFlows[key];
  } else {
    // Use disaggregated data
    dataToRender = key === 'sum' ? sumDisaggCashFlows : disaggCashFlows[key];
  }
  n = aggDisaggKey === 'aggregated' ? 1 : get_max_n();
  let renderedRaster = htmlizeTable(renderRaster(dataToRender, n, translations, curr), 'table table-hover');
  $('#cfDropdownButton').data('key', key); // Store the selected key in the button's data
  $('#raster-placeholder').html(renderedRaster);
}

function handleAggDisaggDropdownItemClick(e) {
  e.preventDefault();

  // Retrieve the currently selected key from the cash flows dropdown
  let cfKey = $('#cfDropdownButton').data('key') || 'sum';
  let aggDisaggKey = $(this).data('key');

  let dataToRender;
  let n;

  if (cfKey === 'sum') {
    // If 'sum' is selected in the cash flows dropdown
    dataToRender = aggDisaggKey === 'aggregated' ? sumCashFlows : sumDisaggCashFlows;
  } else {
    // If a specific cash flow ID is selected in the cash flows dropdown
    dataToRender = aggDisaggKey === 'aggregated' ? cashFlows[cfKey] : disaggCashFlows[cfKey];
  }
  n = aggDisaggKey === 'aggregated' ? 1 : get_max_n();
  let renderedRaster = htmlizeTable(renderRaster(dataToRender, n, translations, curr), 'table table-hover');
  $('#raster-placeholder').html(renderedRaster);



  // Update text of the button to reflect the selected view
  $('#aggDisaggDropdownButton').text($(this).text());
  // Store the selected key in aggDisaggDropdownButton's data
  $('#aggDisaggDropdownButton').data('key', $(this).data('key'));
}

function set_pf_permahash(hash, P0s, HOST_URL, desc) {
  var descParam = desc ? '&desc=' + encodeURIComponent(desc) : '';
  var hashLink = 'Portfolio link: <a href="' + HOST_URL + '/PF/' + hash + '?P0=' + P0s + descParam + '">' + replaceMiddle(hash) + '</a>';
  return hashLink;
}

// helper function for createHashLink that return only link
function helper_createHashLink(type, hash, P0, HOST_URL, desc) {
  var descParam = desc && desc.length > 0  ? '&desc=' + encodeURIComponent(desc.map(el => filterAndLimitString(el))).replace(/%2C/g, ',') : '';
  var basePath = type === 'portfolio' ? '/PF/' : '/CF/';
  basePath = type === 'cc' ? '/CC/' : basePath;

  var hashLink = HOST_URL + basePath + hash + '?P0=' + P0 + descParam;
  
  return hashLink;
}

function createHashLink(type, hash, url) {
  //var descParam = desc ? '&desc=' + encodeURIComponent(filterAndLimitString(desc)) : '';
  //var basePath = type === 'portfolio' ? '/PF/' : '/CF/';
  var linkText = type === 'portfolio' ? 'Portfolio link: ' : 'Product link: ';
  //var url = helper_createHashLink(type, hash, P0, HOST_URL, desc);
  //var hashLink = linkText + '<a href="' + HOST_URL + basePath + hash + '?P0=' + P0 + descParam + '">' + replaceMiddle(hash) + '</a>';
  var hashLink = linkText + '<a href="' + url + '">' + replaceMiddle(hash) + '</a> ';
  
  return hashLink;
}

function get_P0s(cashFlows){
  var P0_dct = extractBalance(cashFlows);
  var P0s = extractSortedValuesByKeys(P0_dct);
  return P0s;
}

function get_descs(cashFlows){
  var desc_dct = extractDesc(cashFlows);
  var desc = extractSortedValuesByKeys(desc_dct);
  return desc;
}

function downloadCSVFile(csv) {
  var now = new Date();
  var timestamp = now.getFullYear().toString() + 
                  ('0' + (now.getMonth() + 1)).slice(-2) + 
                  ('0' + now.getDate()).slice(-2) + '_' +
                  ('0' + now.getHours()).slice(-2) +
                  ('0' + now.getMinutes()).slice(-2);

  var filename = '7cows_io_' + timestamp + '.csv';

  var csvFile = new Blob([csv], {type: "text/csv"});
  var downloadLink = $('<a></a>')
      .attr('href', window.URL.createObjectURL(csvFile))
      .attr('download', filename)
      .css('display', 'none');

  $('body').append(downloadLink);
  downloadLink[0].click();
  downloadLink.remove();
}

function downloadCSV(currencySign = '$') {
  var csv = [];
  var rows = $('#raster-placeholder table tr');
  
  // Process header row separately
  var headerRow = [];
  $(rows[0]).find('th').each(function() {
      headerRow.push('"' + $(this).text().replace(/"/g, '""') + '"'); // Keep quotes in header
  });
  csv.push(headerRow.join(','));

  // Process data rows
  rows.slice(1).each(function() { // Skip the first row (header)
      var row = [];
      $(this).find('td').each(function() {
          var cellText = $(this).text().replace(new RegExp(`\\${currencySign}`, 'g'), ''); // Remove currency sign
          row.push(cellText.replace(/"/g, '""')); // Exclude quotes for data rows
      });
      csv.push(row.join(','));
  });

  // Download CSV file
  downloadCSVFile(csv.join("\n"));
}

function updatePaginationVisibility() {
  if ($('#pagination .page-item').length <= 1) {
      $('#pagination').hide(); // Hide pagination if only one page
  } else {
      $('#pagination').show(); // Show pagination if more than one page
  }
}

function createCardAndPaginationItem(card, id) {
  let pageId = 'page-' + id;
  let existingCardContainer = $('#' + pageId);
  
  // If the card with the same ID exists, replace its content
  if (existingCardContainer.length) {
      existingCardContainer.empty().append(card);
  } else {
      // If the card doesn't exist, create a new one and append it
      let cardContainer = $('<div></div>').attr('id', pageId).addClass('card-container').append(card);
      $('#product-container').append(cardContainer);

      let paginationItem = $('<li class="page-item"><a class="page-link" href="#">' + id + '</a></li>');
      $('#pagination').append(paginationItem);

      paginationItem.on('click', 'a', function(e) {
          e.preventDefault();
          $('.card-container').hide();
          $('#' + pageId).show();

          $('#pagination .page-item').removeClass('active');
          $(this).parent().addClass('active');
      });

      if (id === 1) {
          paginationItem.find('a').click(); // Activate the first card and pagination item
      }
  }

  updatePaginationVisibility();
}

function generateProductCard(setting, params) {

  let newCard = generateCardId(setting, specificId);
  createCardAndPaginationItem(newCard, specificId);
  hookFormEventsForProduct(specificId);
  if (specificId > 1 && Object.keys(params).length > 1) {
    setMaturityBasedOnPrevious(specificId);
  }
  populateForm(specificId, params);
  hashes[specificId] = params['permahash'] ? params['permahash'] : '';
  productTypes[specificId] = params['product'] ? params['product'] : '';

  specificId++;
}

function get_max_n() {
  let k = Object.keys(cashFlows).length;
  let maxN = 0;

  for (let i = 1; i <= k; i++) {
      let currentValue = parseInt($('#n-' + i).val(), 10);
      if (!isNaN(currentValue) && currentValue > maxN) {
          maxN = currentValue;
      }
  }

  return maxN;
}

function displayLinkAndQRCode(identifier, hashLink) {
  var isPortfolio = identifier === 'pf';
  
  var targetDivId = isPortfolio ? 'pf_permahash' : 'permahash-' + identifier;
  var qrCodeDivId = 'qrcode-' + identifier;
  var buttonId = 'showQRButton-' + identifier;

  // For portfolios, directly generate the QR code without a toggle button
  if (isPortfolio) {
      new QRCode(document.getElementById(targetDivId), {
          text: hashLink,
          width: 128,
          height: 128,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.Q
      });
      console.log('QR code created');
  } else {
      // For products, append the toggle button and QR code 
      $('#' + targetDivId).append('<button id="' + buttonId + '" class="btn btn-light" type="button" style="border: 1px solid #ced4da; color: #495057;">QR</button>');
      $('#' + targetDivId).append('<div id="' + qrCodeDivId + '" style="display: none;"></div>');

      // Button click event to toggle the QR code display
      $('#' + buttonId).click(function(event) {
          event.preventDefault(); // Prevent default button click behavior
          event.stopPropagation();
          // Toggle the QR code display
          $('#' + qrCodeDivId).toggle();

          // Update button text based on visibility
          var buttonText = $('#' + qrCodeDivId).is(':visible') ? 'Hide QR Code' : 'QR';
          $('#' + buttonId).text(buttonText);

          // Generate QR code only once when it is first shown
          if ($('#' + qrCodeDivId).is(':visible') && $('#' + qrCodeDivId).is(':empty')) {
              new QRCode(document.getElementById(qrCodeDivId), {
                  text: hashLink,
                  width: 128,
                  height: 128,
                  colorDark: "#000000",
                  colorLight: "#ffffff",
                  correctLevel: QRCode.CorrectLevel.H
              });
          }
      });
  }
}

