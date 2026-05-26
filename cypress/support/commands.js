Cypress.Commands.add('validarCartFragment', () => {
    cy.wait('@cartFragment')
    cy.wait('@cartFragment').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body.cart_hash).to.not.be.empty
    })
})