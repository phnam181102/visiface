export class SmartTablePage {
    updateAgeByFirstName(firstName, age) {
        cy.get('tbody')
            .contains('tr', firstName)
            .then((tableRow) => {
                cy.wrap(tableRow).find('.nb-edit').click();
                cy.wrap(tableRow)
                    .find('[ng-reflect-name="age"]')
                    .clear()
                    .type(age);
                cy.wrap(tableRow).find('.nb-checkmark').click();

                cy.wrap(tableRow).find('td').eq(6).should('contain', age);
            });
    }

    addNewRecord(firstName, lastName, username, email, age) {
        cy.get('thead').find('.nb-plus').click();
        cy.get('thead')
            .find('tr')
            .eq(2)
            .then((tableRow) => {
                cy.wrap(tableRow)
                    .find('[ng-reflect-name="firstName"]')
                    .type(firstName);
                cy.wrap(tableRow)
                    .find('[ng-reflect-name="lastName"]')
                    .type(lastName);
                cy.wrap(tableRow)
                    .find('[ng-reflect-name="username"]')
                    .type(username);
                cy.wrap(tableRow).find('[ng-reflect-name="email"]').type(email);
                cy.wrap(tableRow).find('[ng-reflect-name="age"]').type(age);

                cy.wrap(tableRow).find('.nb-checkmark').click();
            });

        cy.get('tbody tr')
            .first()
            .find('td')
            .then((tableColumn) => {
                cy.wrap(tableColumn).eq(2).should('contain', firstName);
                cy.wrap(tableColumn).eq(3).should('contain', lastName);
                cy.wrap(tableColumn).eq(4).should('contain', username);
                cy.wrap(tableColumn).eq(5).should('contain', email);
                cy.wrap(tableColumn).eq(6).should('contain', age);
            });
    }

    deleteRowByIndex(index) {
        const stub = cy.stub();
        cy.on('window:confirm', stub);
        cy.get('tbody tr')
            .eq(index)
            .find('.nb-trash')
            .click()
            .then(() => {
                expect(stub.getCall(0)).to.be.calledWith(
                    'Are you sure you want to delete?'
                );
            });
    }

    filterByAge(age) {
        cy.get('thead tr [placeholder="Age"]').clear().type(age);

        cy.wait(500);
        cy.get('tbody tr').each((tableRow) => {
            if (age === 200) {
                cy.wrap(tableRow).should('contain', 'No data found');
            } else {
                cy.wrap(tableRow).find('td').last().should('contain', age);
            }
        });
    }
}

export const onSmartTablePage = new SmartTablePage();
