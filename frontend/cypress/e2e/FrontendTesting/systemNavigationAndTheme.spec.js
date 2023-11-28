/// <reference types="cypress" />

import { navigationTo } from '../../support/page_objects/navigationPage';

describe('System Navigation and Theme Customization', () => {
    beforeEach('Login to the App', () => {
        cy.loginToApplication();
    });

    it('Switch theme color', () => {
        const darkColor = 'rgb(24, 33, 47)';
        const lightColor = 'rgb(255, 255, 255)';

        cy.window()
            .its('localStorage.isDarkMode')
            .then((isDarkMode) => {
                cy.get('[class="sc-fujznN jHxXLh"]').first().click();
                if (isDarkMode === 'true') {
                    cy.get('header')
                        .should('have.css', 'background-color')
                        .should('eq', lightColor);
                } else {
                    cy.get('header')
                        .should('have.css', 'background-color')
                        .should('eq', darkColor);
                }
            });
    });

    it('Navigate to pages', () => {
        navigationTo.myClassesPage();
        navigationTo.newStudentPage();
        navigationTo.userManagementPage();
        navigationTo.profilePage();
    });
});
