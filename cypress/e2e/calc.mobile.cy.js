describe('Test calculation with user input on Mobile 390x844', () => {
    beforeEach(() => {
        // Set the viewport to a mobile resolution (iPhone 12 Pro dimensions)
        cy.viewport(390, 844);

        // Simulate a mobile user-agent
        cy.visit('/cf', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1'
            }
        });
    });

    it('enters values and verifies the calculated rate on 390x844 mobile screen', () => {
        // Test 1: Calculate the interest rate
        cy.get('#P0Display-1').click().type('100000');
        cy.get('#ADisplay-1').click().type('1000');
        cy.get('#search-btn-1').click();
        cy.wait(300);
        cy.get('#r-1').should('have.value', '3.737');

        // Test 2: Calculate the regular payment
        cy.get('#rbA-1').click();
        cy.get('#P0Display-1').clear().click().type('108000');
        cy.get('#r-1').clear().click().type('0');
        cy.get('#search-btn-1').click();
        cy.wait(300);
        cy.get('#ADisplay-1').should('have.value', '900');

        // Test 3: Calculate the loan amount
        cy.get('#rbP0-1').click();
        cy.get('#ADisplay-1').clear().click().type('1000');
        cy.get('#r-1').clear().type('4');
        cy.get('#search-btn-1').click();
        cy.wait(300);
        cy.get('#P0Display-1').should('have.value', '98770.17');

        // Test 4: Calculate the loan term
        cy.get('#rbT-1').click();
        cy.get('#ADisplay-1').clear().click().type('1000');
        cy.get('#r-1').clear().type('4');
        cy.get('#P0Display-1').clear().click().type('90000');
        cy.get('#search-btn-1').click();
        cy.wait(400);
        cy.get('#T_years-1').should('have.value', '9');
        cy.get('#T_months-1').should('have.value', '0');
    });
});
