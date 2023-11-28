/// <reference types="cypress" />

describe('User Authentication', () => {
    beforeEach('removeToken', () => {
        cy.intercept('POST', '**/users/login').as('loginRequest');
        cy.removeToken();
    });

    it('Login with correct email and password', () => {
        cy.contains('Email address').click().type(Cypress.env('email'));
        cy.contains('Password').click().type(Cypress.env('password'));
        cy.contains('Login').click();

        cy.wait('@loginRequest');
        cy.get('@loginRequest').then((xhr) => {
            expect(xhr.response.statusCode).to.equal(200);
            cy.url().should('contain', '/my-classes');
        });
    });

    it('Login with incorrect email or password', () => {
        cy.contains('Email address').click().type(Cypress.env('email'));
        cy.contains('Password').click().type('password');
        cy.contains('Login').click();

        cy.wait('@loginRequest');
        cy.get('@loginRequest')
            .its('response.body')
            .then((body) => {
                expect(body.status).to.equal('fail');
                expect(body.message).to.equal('Incorrect email or password');
            });
    });

    it('Login with empty email or password', () => {
        cy.contains('Login').click();

        cy.wait(1000);

        cy.get('@loginRequest').then((request) => {
            cy.wrap(request).should('eq', null);
            cy.url().should('contain', '/login');
        });
    });

    it('Logout', () => {
        cy.loginToApplication();

        cy.get('[class="sc-fujznN jHxXLh"]').eq(1).click();
        cy.url().should('contain', '/login');
        cy.get('[id="root"]').should('contain', 'Login');
    });
});
