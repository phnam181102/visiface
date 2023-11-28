export class NavigationPage {
    myClassesPage() {
        cy.contains('My Classes').click();
    }

    newStudentPage() {
        cy.contains('New Student').click();
    }

    userManagementPage() {
        cy.contains('User Management').click();
    }

    profilePage() {
        cy.contains('Profile Settings').click();
    }
}

export const navigationTo = new NavigationPage();
