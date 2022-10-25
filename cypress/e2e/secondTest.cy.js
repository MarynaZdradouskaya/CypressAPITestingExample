/// <reference types="cypress" />

describe('Log out', () => {
    beforeEach('Login to the app', () => {
        cy.loginToApplication()
    })

    it('verify use can log successfully', () => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })
})