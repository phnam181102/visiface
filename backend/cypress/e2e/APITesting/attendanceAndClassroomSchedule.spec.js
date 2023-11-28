/* eslint-disable */
/// <reference types="cypress" />

describe('Attendance and Classroom Schedule API Tests', () => {
    beforeEach('login before each', () => {
        cy.login();
    });

    it('Get attendance summary', () => {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env(
                    'apiUrl',
                )}api/v1/attendance/summary?studentId=54882&subjectId=SJ001`,
                headers: { Authorization: `Bearer ${token}` },
            })
                .its('body')
                .then((body) => {
                    expect(body.status).to.equal('success');
                    expect(body.data.attendance._id).to.equal('54882');
                });
        });
    });

    it('Get all classroom schedules', () => {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('apiUrl')}api/v1/classroom-schedule`,
                headers: { Authorization: `Bearer ${token}` },
            })
                .its('body')
                .then((body) => {
                    expect(body.status).to.equal('success');
                });
        });
    });

    it('Get classroom schedule by ưưeekday', () => {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env(
                    'apiUrl',
                )}api/v1/classroom-schedule/102/monday`,
                headers: { Authorization: `Bearer ${token}` },
            })
                .its('body')
                .then((body) => {
                    expect(body.status).to.equal('success');
                });
        });
    });
});
