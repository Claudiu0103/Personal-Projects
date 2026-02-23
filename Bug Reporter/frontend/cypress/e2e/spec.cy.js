describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('.MuiTypography-body1').click()
    cy.get('[placeholder="username"]').type("vasi")
    cy.get('[placeholder="password"]').type("1234567v")
    cy.get('[type="submit"]').click()
    cy.wait(1000)
    cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButton-textPrimary').click()
    cy.get('.css-xdyiv9 > .MuiButton-textError').click()
  })
})