/* eslint-disable */
/// <reference types="cypress" />

describe('User Authentication and Profile API Tests', () => {
    let userId;

    beforeEach('login before each', () => {
        cy.login();
    });

    it('Sign up', { skipBeforeEach: true }, () => {
        const bodyRequest = {
            name: 'Administrator',
            teacherId: 'TC003',
            email: 'admin@gmail.com',
            phoneNumber: '0986407145',
            password: 'abc.12345',
            passwordConfirm: 'abc.12345',
        };

        cy.request(
            'POST',
            `${Cypress.env('apiUrl')}api/v1/users/signup`,
            bodyRequest,
        )
            .its('body')
            .then((body) => {
                expect(body.status).to.equal('success');
                expect(body.user.name).to.equal('Administrator');
                expect(body.user.email).to.equal('admin@gmail.com');
                userId = body.user._id;
            });
    });

    it('Update user', () => {
        const updatedUserData = {
            name: 'NewName',
        };

        cy.get('@token').then((token) => {
            cy.request({
                method: 'PATCH',
                url: `${Cypress.env('apiUrl')}api/v1/users/${userId}`,
                headers: { Authorization: `Bearer ${token}` },
                body: updatedUserData,
            })
                .its('body')
                .then((body) => {
                    expect(body.data.user.name).to.equal('NewName');
                });
        });
    });

    it('Delete user', () => {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'DELETE',
                url: `${Cypress.env('apiUrl')}api/v1/users/${userId}`,
                headers: { Authorization: `Bearer ${token}` },
            }).then((response) => {
                expect(response.status).to.equal(204);
            });
        });
    });

    it('Login', { skipBeforeEach: true }, () => {
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
                expect(body.status).to.equal('success');
            });
    });

    it('Get session', () => {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('apiUrl')}api/v1/auth/session`,
                headers: { Authorization: `Bearer ${token}` },
            })
                .its('body')
                .then((body) => {
                    expect(body.status).to.equal('success');
                });
        });
    });
});
