/* eslint-disable */
/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
    const userCredentials = {
        email: Cypress.env('email'),
        password: Cypress.env('password'),
    };

    cy.request(
        'POST',
        `${Cypress.env('apiUrl')}api/v1/users/login`,
        userCredentials,
    )
        .its('body')
        .then((body) => {
            const { token, user } = body;
            cy.wrap(token).as('token');
            cy.wrap(user).as('user');
        });
});
