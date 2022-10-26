/// <reference types="cypress" />
// ***********************************************
//1. Log in to the App with token

Cypress.Commands.add('loginToApplication', () =>{

    const userCredentials = {
      
        "user": {
            "email": "zdr.bona",
            "password": "CypressTest1"
        
    }
    }

    cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
    .its('body').then( body =>{
        const token = body.user.token
        cy.wrap(token).as('token')
        cy.visit('/', {
            onBeforeLoad (win){
                win.localStorage.setItem('jwtToken', token)
            }
        }
        )
    })
// Log in to the App with the user's credentials

    cy.visit('/login')
    cy.get('[placeholder="Email"]').type('zdr.bona')
    cy.get('[placeholder="Password"]').type('CypressTest1')
    cy.get('form').submit()
})
