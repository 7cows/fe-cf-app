$(document).ready(function() {
    //let rTable = htmlizeTable(sumCashFlows, 'table table-hover');
    console.log("ready.js/sumCashFlows", sumCashFlows);
    if (Object.keys(sumCashFlows).length  > 0)
    {
        let rendered_raster =  htmlizeTable(renderRaster(sumCashFlows, 1, translations, curr), 'table table-hover');
        $('#raster-placeholder').html(rendered_raster);    
    }
    createCFDropdown(); // Create the dropdown if needed
    // Define your handlers
    const handlers = {
        'year-item': clickYearsDropdown,
        'month-item': clickMonthsDropdown,
        'annuity-switch': handleAnnuityClick,
        'rd-switch': handleRecurringDepositClick,
        '0bond-switch': handle0bondClick
    };

    // Additional classes to loop through
    const additionalClasses = ['T_', 'shift_'];

    $.each(handlers, function(baseClass, handler) {
        // Attach the base handler without a prefix
        
    
        // If the handler supports prefixes, handle additional classes
        if (['year-item', 'month-item'].includes(baseClass)) {
            // Loop through additional classes and attach handlers with prefixes
            additionalClasses.forEach(prefix => {
                $(document).on('click', `.${baseClass}.${prefix}`, function(e) {
                    //e.preventDefault();    
                    handler.call(this, e, prefix);
                });
            });
        } else {
            $(document).on('click', `.${baseClass}`, handler);
        }
    });


    // Loop through each handler
    $.each(handlers, function(baseClass, handler) {
        if (['year-item', 'month-item'].includes(baseClass)) {
            // Loop through additional classes and attach handlers
            additionalClasses.forEach(additionalClass => {
                $(document).on('click', `.${baseClass}.${additionalClass}`, handler);
            });
        } else {
            // Attach the base handler
            $(document).on('click', `.${baseClass}`, handler);
        }
    });

    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $(document).on('click', '.dropdown-menu a', function() {
        var btn = $(this).closest('.dropdown').find('.btn');
        var inputHidden = $(this).closest('.dropdown').find('input[type="hidden"]');
        
        btn.text($(this).text());
        inputHidden.val($(this).data('value'));
    });
    
    // Assuming that productId is related to a form. 
    // This will get productId from the first form on the page.
    let productId = $('form').find('[id^="search-btn-"]').data('product-id');

    hookFormEventsForProduct(productId);
    //attachEventHandlers(productId); 

    $('#newCreditBtn').click(function() {
        console.log('New credit button clicked');
        let MAX_NUM_PRODUCTS = 10;
        if (specificId < MAX_NUM_PRODUCTS) {
            generateProductCard(form_settings, {});
            // Optionally, switch to the new card in the pagination
            $('#pagination .page-item').last().find('a').click();
        } else {
            alert(translations["Maximum number of products"] + " (" + MAX_NUM_PRODUCTS + ") " + translations["reached"]);
            console.warn("Maximum number of products (" + MAX_NUM_PRODUCTS + ")  reached.");
        }
    });
    
  
    for (let productId in productTypes) {

        let productType = productTypes[productId];
        // Find the element and set the product type
        let elementId = 'dropdownProductButton-' + productId;
        let element = document.getElementById(elementId);
        if (productType === 'annuity') {
            element.textContent = translations['Amortizing loan'];
            element.setAttribute('data-product-type', 'annuity');
        } else if (productType === 'deposit') {
            element.textContent = translations['Savings plan'];
            element.setAttribute('data-product-type', 'deposit');
        } else if (productType === '0bond') {
            element.textContent = translations['Zero bond'];
            element.setAttribute('data-product-type', '0bond');
        }
    }
    $('#pagination .page-item.active a').trigger('click');
});

$(document).on('click', '.calc-product', function(e) {
    e.preventDefault();
    let productId = $(this).data('product-id');
    // Retrieve product type. Adjust the selector based on where the product type is stored.
    let productTypeElement = $('#productType-' + productId);
    let productType = productTypeElement.val();
    console.log("productType", productType);
    if (productId) {
        console.info('click on "Create" butto of the #', productId);
        callApi(productId, productType, false);
    } else {
        console.error('Product ID not found');
    }
});

$(document).on('click', '.calc-example', function(e) {
    e.preventDefault();
    let productId = $(this).data('product-id');
    // Retrieve product type. Adjust the selector based on where the product type is stored.
    let productTypeElement = $('#productType-' + productId);
    let productType = productTypeElement.val();
    console.log("productType", productType);
    if (productId) {
        console.info('click on "Create" butto of the #', productId);
        callApi(productId, productType, true);
    } else {
        console.error('Product ID not found');
    }
});
