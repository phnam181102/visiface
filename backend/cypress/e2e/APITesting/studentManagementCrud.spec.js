/* eslint-disable */
/// <reference types="cypress" />

describe('Student CRUD API Tests', () => {
    let studentId;

    beforeEach('login before each', () => {
        cy.login();
    });

    it('Create new student', () => {
        const bodyRequest = {
            id: '54712',
            classId: 'ST20A2A',
            fullName: 'Phan Anh Trung',
            pinCode: '547123',
            email: 'trung@gmail.com',
            phoneNumber: '0336654712',
            gender: 1,
        };

        cy.get('@token').then((token) => {
            cy.request({
                method: 'POST',
                url: `${Cypress.env('apiUrl')}api/v1/students`,
                headers: { Authorization: `Bearer ${token}` },
                body: bodyRequest,
            })
                .its('body')
                .then((body) => {
                    expect(body.status).to.equal('success');
                    expect(body.data.student.fullName).to.equal(
                        'Phan Anh Trung',
                    );
                    expect(body.data.student.email).to.equal('trung@gmail.com');
                    studentId = body.data.student.id;
                });
        });
    });

    it('Update student', () => {
        const bodyRequest = {
            phoneNumber: '0321854723',
        };

        cy.get('@token').then((token) => {
            cy.request({
                method: 'PATCH',
                url: `${Cypress.env('apiUrl')}api/v1/students/${studentId}`,
                headers: { Authorization: `Bearer ${token}` },
                body: bodyRequest,
            })
                .its('body')
                .then((body) => {
                    expect(body.status).to.equal('success');
                    expect(body.data.student.phoneNumber).to.equal(
                        '0321854723',
                    );
                });
        });
    });

    it('Get all student', () => {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env(
                    'apiUrl',
                )}api/v1/students?fields=id,pinCode,photo,fullName`,
                headers: { Authorization: `Bearer ${token}` },
            })
                .its('body')
                .then((body) => {
                    expect(body.status).to.equal('success');
                });
        });
    });

    it('Delete student', () => {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'DELETE',
                url: `${Cypress.env('apiUrl')}api/v1/students/${studentId}`,
                headers: { Authorization: `Bearer ${token}` },
            }).then((response) => {
                expect(response.status).to.equal(204);
            });
        });
    });
});
