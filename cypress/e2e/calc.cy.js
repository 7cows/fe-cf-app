describe('Test calculation with user input', () => {
    it('enters values and verifies the calculated rate', () => {
      // Visit the correct page
    cy.visit('/cf');

    // -----------------
    // Test 1: calculate the interest rate
    // Enter 100000 in P0Display-1
    cy.get('#P0Display-1').clear().type('100000');

    // Enter 1000 in ADisplay-1
    cy.get('#ADisplay-1').clear().type('1000');

    // Click the "Calculate" button
    cy.get('#search-btn-1').click();

    // Wait for calculations to complete
    cy.wait(300);

    // Check that the value of 'r-1' is approximately 3.737
    cy.get('#r-1').should('have.value', '3.737');

    // -----------------
    // Test 2: calculate the regular payment
    // Click on the radio button 'rbA-1'
    cy.get('#rbA-1').click();

    // Enter 108000 in P0Display-1
    cy.get('#P0Display-1').clear().type('108000');

    // Enter 0 in r-1
    // Enter 108000 in P0Display-1
    cy.get('#r-1').clear().type('0');

    // Click the "Calculate" button again
    cy.get('#search-btn-1').click();

    // Wait for calculations to complete
    cy.wait(300);

    // Check that the value of 'ADisplay-1' is approximately 900
    cy.get('#ADisplay-1').should('have.value', '900');

    // -----------------
    // Test 3: calculate the loan amount
    cy.get('#rbP0-1').click();

    // Enter 108000 in P0Display-1
    cy.get('#ADisplay-1').clear().type('1000');
    cy.get('#r-1').clear().type('4');

    // Click the "Calculate" button again
    cy.get('#search-btn-1').click();

    // Wait for calculations to complete
    cy.wait(300);

    // Check that the value of 'ADisplay-1' is approximately 900
    cy.get('#P0Display-1').should('have.value', '98770.17');

    // -----------------
    // Test 4: calculate the regular payment
    //cy.visit('/cf');
    cy.get('#rbT-1').click();

    // Enter 108000 in P0Display-1
    
    cy.get('#ADisplay-1').clear().type('1000');
    cy.get('#r-1').clear().type('4');
    cy.get('#P0Display-1').clear().type('90000');

    // Click the "Calculate" button again
    cy.get('#search-btn-1').click();

    // Wait for calculations to complete
    cy.wait(400);

    // Check that the value of 'ADisplay-1' is approximately 900
    cy.get('#T_years-1').should('have.value', '9');
    cy.get('#T_months-1').should('have.value', '0');

    
    });
  });
  