describe('Visit 7cows and interact', () => {
  it('clicks on the button and checks field values', () => {
    cy.visit('/cf');
    cy.get('#example-btn-1').click();

    cy.wait(1000); // wait for any updates

    cy.get('body').then(() => {
      const aDisplayVal = Cypress.$('#ADisplay-1').val();
      const p0DisplayVal = Cypress.$('#P0Display-1').val();

      // Use custom task to log to the terminal
      cy.task('log', `ADisplay-1 Value: ${aDisplayVal}`);
      cy.task('log', `P0Display-1 Value: ${p0DisplayVal}`);

      expect(aDisplayVal !== '' || p0DisplayVal !== '', 'At least one field should have a value').to.be.true;
    });
  });
});
