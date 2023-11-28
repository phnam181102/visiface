/// <reference types="cypress" />

describe('Filter and Sort Functionality', () => {
    beforeEach('Login to the App', () => {
        cy.loginToApplication();
    });

    it('Filter', () => {
        cy.intercept('GET', '**/students*').as('getStudentRequest');

        cy.contains('Active').click();
        cy.url().should('contain', '?status=active');

        cy.wait('@getStudentRequest');
        cy.contains('div[role="table"]', 'Status')
            .get('section div')
            .then((tableRow) => {
                cy.wrap(tableRow).should('contain', 'active');
            });
    });

    it('Sort', () => {
        cy.intercept('GET', '**/students*').as('getStudentRequest');

        cy.get('select[class="sc-bBjSGg dPUfsa"]').select('name-desc');

        cy.url().should('contain', 'sortBy=name-');
        cy.wait('@getStudentRequest');

        cy.contains('div[role="table"]', 'Status')
            .get('section div[role="row"]')
            .as('tableRow');
        let name1;
        cy.get('@tableRow')
            .first()
            .within(() => {
                cy.get('div')
                    .eq(1)
                    .invoke('text')
                    .then((name) => {
                        name1 = name;
                    });
            });

        cy.get('@tableRow')
            .eq(1)
            .within(() => {
                cy.get('div')
                    .eq(1)
                    .invoke('text')
                    .then((name2) => {
                        expect(name2.localeCompare(name1)).to.be.lessThan(0);
                    });
            });
    });
});
