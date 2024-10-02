describe('Test button click to add new credit', () => {
    it('clicks the "New Product" button and checks for the presence of a page-link', () => {
      // Visit the correct page
      cy.visit('/cf');
  
      // Click the 'newCreditBtn'
      cy.get('#newCreditBtn').click();
  
      // Wait for any updates
      cy.wait(250);
  
      // Check that an 'a' tag with the class 'page-link' has appeared
      cy.get('a.page-link[href="#"]').contains('2').should('exist');
    });
  });
  