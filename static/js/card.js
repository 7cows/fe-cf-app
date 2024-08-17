const elementKeys = ['P0', 'short_desc', 'r', 'T', 'A', 'n','shift', 'minimumPayment', 'compounding', 'remaining_debt','paydown'];

function constructFormElementsHtml(id, settings, translations, pivot) {
    let formElements = getFormElements(id, translations);        
    let formElementsHtml = elementKeys.map((key, index) => {
        return settings[index] === pivot ? formElements[key] : '';
    }).join('');
    return formElementsHtml;
}

function getFormElements(id, translations){
    let dct = {
        'short_desc': `
        <tr>
            <td class="col-md-4">${translations['short_desc']}</td>
            <td class="col-md-6">
                <input type="text" id="short_descDisplay-${id}" class="form-control" value="" placeholder="e.g. car loan" maxlength="10">
            </td>
            <td class="col-md-2">
            </td>
        </tr>
    `
        ,
        'P0': `
        <tr>
            <td class="col-md-4">
                <strong>
                    ${translations['P0']}:
                </strong>
            </td>
            <td class="col-md-6">
                <div class="input-sign-wrapper" data-sign="$">
                    <input type="text" id="P0Display-${id}" class="form-control currency-input" value="" placeholder="e.g. 500'000"
                    data-toggle="tooltip" title="${translations['The total amount of money borrowed or the remaining loan balance you need to repay']}" data-placement='left'>
                </div>
                <input type="hidden" id="P0-${id}" name="P0" value="">
            </td>
            <td class="col-md-2">
                <input type="radio" id="rbP0-${id}" name="AnnuityFreeParameter" value="1" onclick="chooseAnnFreeParameter(this, ${id});">
            </td>
        </tr>
        `,
        'r': `
        <tr>
            <td class="col-md-4">
                <strong>
                    ${translations['r']}:
                </strong>
            </td>
            <td class="col-md-6">
                <div class="input-sign-wrapper" data-sign="%">
                <input type="text" id="r-${id}" class="form-control" value="" placeholder="e.g. 4" disabled=""
                data-toggle="tooltip" title="${translations['The percentage charged on the principal by the lender, representing the cost of borrowing']}" data-placement='left'>
                </div>
            </td>
            <td class="col-md-2"><input type="radio" id="rbr-${id}" name="AnnuityFreeParameter" value="2" onclick="chooseAnnFreeParameter(this, ${id});" checked=""></td>
        </tr>
        `,
        'T': `
        <tr>
            <td class="col-md-4">
                <strong>
                ${translations['T']}:
                </strong>
            </td>
            <td class="col-md-6"
            
            data-toggle="tooltip" title="${translations['The period until the final payment is due']}" data-placement='left'>
                <div class="dropdown d-inline">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="T_YearsDropdown-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">10 years</button>
                    <div class="dropdown-menu" aria-labelledby="T_YearsDropdown-${id}">
                            ${generateYearDropdownItems(30)}
                    </div>
                    <input type="hidden" id="T_years-${id}" name="T_years" value="10">
                </div>

                <div class="dropdown d-inline ml-2">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="T_MonthsDropdown-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">0 months</button>
                    <div class="dropdown-menu" aria-labelledby="T_MonthsDropdown-${id}" style="">
                            ${generateMonthDropdownItems()}
                    </div>
                    <input type="hidden" id="T_months-${id}" name="T_months" value="0">
                </div>
                <input type="range" id="T_Slider-${id}" min="0" max="360" step="1" value="120" oninput="updateSlider(${id},'T_')">
            </td>
            <td class="col-md-2"><input type="radio" id="rbT-${id}" name="AnnuityFreeParameter" value="3" onclick="chooseAnnFreeParameter(this, ${id});"></td>
        </tr>
        `,
        'A': `
        <tr>
            <td class="col-md-4">
                <strong>
                    ${translations['A']}:
                </strong>
            </td>
            <td class="col-md-6">
            <div class="input-sign-wrapper" data-sign="$">
                    <input type="text" id="ADisplay-${id}" class="form-control currency-input" value="" placeholder="e.g. 2'000"
                    data-toggle="tooltip" title="${translations['The amount of money paid back to the lender at regular intervals']}" data-placement='left'>
                </div>
                <input type="hidden" id="A-${id}" name="A" value="">
            </td>
            <td class="col-md-2">
                <input type="radio" id="rbA-${id}" name="AnnuityFreeParameter" value="4" onclick="chooseAnnFreeParameter(this, ${id});">
            </td>
        </tr>
        `,
        'n': `
        <tr>
            <td class="col-md-4">
                <strong>
                    ${translations['n']}:
                </strong>
            </td>
            <td class="col-md-6" colspan="3">
                <input type="range" id="nSlider-${id}" name="annFreqVisual" min="1" max="3" value="3" class="custom-range" onchange="updateFrequencyLabel(this.value, ${id})"
                data-toggle="tooltip" title="${translations['How often payments are made, e.g., monthly or quarterly, affecting the total interest paid and the speed of loan repayment.']}" data-placement='left'>
                <span id="frequencyLabel-${id}">Monthly</span>
                <input type="hidden" id="n-${id}" name="n" value="12">
            </td>
        </tr>
        `,
        'shift': `
        <tr>
            <td class="col-md-4">
                <strong>
                    ${translations['shift']}:
                </strong>
            </td>
            <td class="col-md-6">
                <div class="dropdown d-inline">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="shift_YearsDropdown-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">0 years</button>
                    <div class="dropdown-menu" aria-labelledby="shift_YearsDropdown-${id}">
                            ${generateYearDropdownItems(10, 'shift')}
                    </div>
                    <input type="hidden" id="shift_years-${id}" name="shift_Years" value="0">
                </div>

                <div class="dropdown d-inline ml-2">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="shift_MonthsDropdown-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">0 months</button>
                    <div class="dropdown-menu" aria-labelledby="shift_MonthsDropdown-${id}" style="">
                            ${generateMonthDropdownItems('shift')}
                    </div>
                    <input type="hidden" id="shift_months-${id}" name="shift_Months" value="0">
                </div>
                <input type="range" id="shift_Slider-${id}" min="0" max="120" step="1" value="0" oninput="updateSlider(${id}, 'shift_')">
            </td>
            <td class="col-md-2"></td>
        </tr>
    `,
    'minimumPayment': `
        <tr>
            <td class="col-md-4">
                <strong>
                 ${translations['minimumPayment']}:
                </strong>
            </td>
            <td class="col-md-6">
                <div class="input-sign-wrapper" data-sign="$">
                    <input type="text" id="minPaymentDisplay-${id}" class="form-control currency-input" value="" placeholder="e.g. 2'000"
                    data-toggle="tooltip" title="The minimum amount of money you need to pay back to the lender at regular intervals" data-placement='left'>
                </div>
                <input type="hidden" id="minPayment-${id}" name="minPayment" value="0">
            </td>
            <td class="col-md-2">
            </td>
        </tr>
        `,
        'compounding': `
        <tr>
            <td class="col-md-4">
                <strong>
                    ${translations['compounding']}:
                </strong>
            </td>
            <td class="col-md-6"><input class="form-check-input" type="checkbox" value="" id="compounding-${id}" unchecked></td>
            <td class="col-md-2"></td>
        </tr>        
        `,
    'remaining_debt': `
        <tr>
            <td class="col-md-4">
                <strong>
                ${translations['remaining_debt']}:
                </strong>
            </td>
            <td class="col-md-6">
            <div class="input-sign-wrapper" data-sign="$">
                    <input type="text" id="remainingDebtDisplay-${id}" class="form-control currency-input" value="" placeholder="e.g. 2'000"
                    data-toggle="tooltip" title="The remaining debt after the loan maturity" data-placement='left'>
            </div>
            <input type="hidden" id="remainingDebt-${id}" name="rDebt" value="0">
            </td>
            <td class="col-md-2">
                <input type="radio" id="rbremainingDebt-${id}" name="RemainingDebtFreeParameter" value="1" onclick="chooseAnnFreeParameter(this, ${id});"
            </td>
        </tr>
        `,
        'paydown': `
        <tr>
            <td class="col-md-4">
                <strong>
                    ${translations['paydown']}:
                </strong>
            </td>
            <td class="col-md-6"><input class="form-check-input" type="checkbox" value="" id="zeropaydown-${id}" checked></td>
            <td class="col-md-2"></td>
        </tr>        
        `}
        return dct;
}
const htmlElements = {
    'KPI': function(id) {
      return `<div id="card-info-${id}" class="card card-info" style="display: none">
        <div class="card-header">
            KPIs <a data-toggle="collapse" data-target="#collapseKPIs-${id}" href="#collapseKPIs-${id}" class="collapsed">
                <span class="toggle-sign" data-toggle="tooltip" data-placement="top" title="" data-original-title="${translations['Show details']}">+</span>
            </a>
        </div>
        <div id="collapseKPIs-${id}" class="card-collapse collapse">
            <div id="extra-info-placeholder-${id}" class="card-body">
                <!-- Here your table will be appended using the htmlizeTable function -->
            </div>
        </div>
      </div>`;
    },
    'opt_params': function(id, settings='111112222') {
        let formElementsHtml = constructFormElementsHtml(id, settings, translations, '2');
        
        return `<div id="card-extra-${id}" class="card card-info">
          <div class="card-header">
              Optional parameters <a data-toggle="collapse" data-target="#collapseExtras-${id}" href="#collapseExtras-${id}" class="collapsed">
                  <span class="toggle-sign" data-toggle="tooltip" data-placement="top" title="" data-original-title="${translations['Show details']}">+</span>
              </a>
          </div>
          <div id="collapseExtras-${id}" class="card-collapse collapse">
              <div id="extra-params-${id}" class="card-body">
                <table class="table table-hover leftAlignedColumnTable">
                    ${formElementsHtml}
                </table>
              </div>
              
          </div>
        </div>`;
      },
    'annuity_table': function(id, settings='111112222') {
        let formElementsHtml = constructFormElementsHtml(id, settings, translations, '1');
    
        return `
        <table class="table table-hover leftAlignedColumnTable">
            <thead>
                <tr>
                    <th class="col-md-4">${translations['Parameter']}</th>
                    <th class="col-md-6">${translations['Value']}</th>
                    <th class="col-md-2"><a href="#" style="color: inherit; text-decoration: none;" data-toggle="tooltip" title="Choose which parameter will be calculated (derived) with the rest being fixed" data-placement='right'>
                    ${translations['Find']}
                    </a></th>
                </tr>
            </thead>
            <tbody>
                ${formElementsHtml}
                <tr>
                    <td class="col-md-12" colspan="4">
                        <input type="hidden" id="productType-${id}" value="annuity"> <!-- or value="deposit" -->
                        <button data-product-id="${id}" class="btn btn-success calc-product" type="submit" id="search-btn-${id}"
                            data-toggle="tooltip" data-placement="bottom"
                            data-title="${translations['calculate the visible loan, fill derived parameter and update KPIs']}"
                        >${translations['Calculate']}</button>
                        <button data-product-id="${id}" class="btn btn-dark calc-example" type="submit" id="example-btn-${id}"
                            data-toggle="tooltip" data-placement="bottom"
                            data-title="${translations['a random example of a loan']}"
                        >${translations['Example']}</button>
                    </td>
                </tr>
            </tbody>
        </table>
        `;
    }
    ,
    'card': function(id, table, kpi, opt_params='') {
        return `
            <form id="product-form-${id}">
                <div class="row">    
                    <div class="card card-info" id="cardAnnuity-${id}">
                        <div class="card-header">
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownProductButton-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-product-type="annuity">
                                    ${translations['Amortizing loan']}
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownProductButton-${id}">
                                    <a class="dropdown-item annuity-switch" href="#" data-value="${id}">${translations['Amortizing loan']}</a>
                                    <!--<a class="dropdown-item rd-switch" href="#" data-value="${id}">${translations['Savings plan']}</a>-->
                                </div>
                            </div>
                                <a data-toggle="collapse" data-target="#collapseAnnuity-${id}" href="#collapseAnnuity-${id}" class="" aria-expanded="true">
                                    <span class="toggle-sign" data-toggle="tooltip" data-placement="top" title="" data-original-title="${translations['Show details']}">-</span>
                                </a>
                            <div id="permahash-${id}"></div>                 
                        </div>
                        <div id="collapseAnnuity-${id}" class="card-collapse collapse show" style="">
                            <div class="card-body">
                                ${table}
                            </div> <!-- end of annuity card body -->
                            ${opt_params}
                            ${kpi}
                        </div> 
                    </div>
                </div>
            </form>
        `;
    }
  };

let specificId = 0; // to keep track of IDs to ensure uniqueness.

function generateCardId(settings='111110000') {
    console.log('Generating new card with ID: ', specificId);
    specificId++; // Increment the ID each time to ensure uniqueness
    let kpi = htmlElements['KPI'](specificId);
    let table = htmlElements['annuity_table'](specificId, settings);
    var opt_params = '';
    if (settings.includes('2')){
        opt_params = htmlElements['opt_params'](specificId, settings);
    } 
    let card = htmlElements['card'](specificId, table, kpi, opt_params);
    
    return card;
}

function generateMonthDropdownItems(prefix='T_') {
    let dropdownHTML = '';
    for(let i=0; i<=11; i++) {
        dropdownHTML += `<a class="dropdown-item month-item ${prefix}" href="#" data-value="${i}">${i} month${i !== 1 ? 's' : ''}</a>\n`;
    }
    return dropdownHTML;
}

function generateYearDropdownItems(n, prefix='T_') {
    let dropdownHTML = '';
    for(let i=1; i<=n; i++) {
        dropdownHTML += `<a class="dropdown-item year-item ${prefix}" href="#" data-value="${i}">${i} year${i !== 1 ? 's' : ''}</a>\n`;
    }
    return dropdownHTML;
}
  
function setMaturityBasedOnPrevious(productId) {
    // Check if there's a previous product (productId is not the first one)
    if (productId > 1) {
      // Using jQuery to fetch the slider elements
      var previousSlider = $("#T_Slider-" + (productId - 1));
      var currentSlider = $("#T_Slider-" + productId);
      
      if (previousSlider.length) {
        if (currentSlider.length) {
          // Set the value of the current slider to that of the previous one
          var previousSliderValue = previousSlider.val();
          console.log("Previous slider value: ", previousSliderValue);
          currentSlider.val(previousSliderValue);
          
          // Update the display elements related to the current slider
          // Reusing your existing function to reflect the changes
          updateSlider(productId,'T_');
        } else {
          console.error("Current slider not found");
        }
      } else {
        console.error("Previous slider not found");
      }
    } else {
      console.error("No previous slider (this is the first one)");
    }
  }
  