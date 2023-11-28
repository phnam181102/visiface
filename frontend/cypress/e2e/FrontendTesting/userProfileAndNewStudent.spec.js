/// <reference types="cypress" />

import { navigationTo } from '../../support/page_objects/navigationPage';

describe('User Profile Management and Create New Student ', () => {
    beforeEach('Login to the App', () => {
        cy.loginToApplication();
    });

    it('Update current user information', () => {
        cy.intercept('PATCH', '**/users/updateMe', {
            fixture: 'userUpdated.json',
        }).as('updateUser');

        navigationTo.profilePage();

        cy.contains('div[type="vertical"]', 'Update user data')
            .get('form')
            .as('updateUserForm');

        cy.get('@updateUserForm')
            .get('input[id="email"]')
            .as('emailInput')
            .clear()
            .type('namphan@donga.edu.vn');
        cy.get('@updateUserForm')
            .get('input[id="phoneNumber"]')
            .as('phoneNumberInput')
            .clear()
            .type('0986407625');
        cy.get('@updateUserForm').contains('Update account').click();

        cy.wait('@updateUser');
        cy.get('@emailInput')
            .invoke('val')
            .then((emailValue) => {
                expect(emailValue).to.equal('namphan@donga.edu.vn');
            });
        cy.get('@phoneNumberInput')
            .invoke('val')
            .then((emailValue) => {
                expect(emailValue).to.equal('0986407625');
            });
    });

    it('Create new student with empty fields', () => {
        navigationTo.newStudentPage();

        cy.contains('div', 'Create a new student')
            .get('form')
            .as('createStudentForm');

        cy.contains('Create new student').click();

        cy.get('@createStudentForm').should(
            'contain',
            'This field is required!'
        );
    });

    it('Create new student with some invalid fields', () => {
        navigationTo.newStudentPage();

        cy.contains('div', 'Create a new student')
            .get('form')
            .as('createStudentForm');

        cy.get('@createStudentForm')
            .get('[id="fullName"]')
            .type('Le Van Quang');
        cy.get('@createStudentForm').get('[id="id"]').type('54183');
        cy.get('@createStudentForm').get('[id="birthday"]').type('Today');
        cy.get('@createStudentForm').get('[id="classId"]').type('ST20A2A');
        cy.get('@createStudentForm').get('[id="phoneNumber"]').type('123456');
        cy.get('@createStudentForm')
            .get('[id="email"]')
            .type('quangteo@donga.edu.vn');
        cy.get('@createStudentForm').get('[id="pinCode"]').type('145327');
        cy.get('@createStudentForm')
            .get('[id="pinCodeConfirm"]')
            .type('000000');

        cy.contains('Create new student').click();

        cy.get('@createStudentForm').should(
            'contain',
            'Please provide a valid birthday'
        );
        cy.get('@createStudentForm').should(
            'contain',
            'Please provide a valid phone number'
        );
        cy.get('@createStudentForm').should(
            'contain',
            'PIN code need to match'
        );
    });
});
