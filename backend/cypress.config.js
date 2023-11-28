/* eslint-disable */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
    env: {
        email: 'nam@gmail.com',
        password: 'nam12345',
        apiUrl: 'http://localhost:3000/',
    },
    screenshotOnRunFailure: false,
    video: false,
    retries: {
        openMode: 2,
        runMode: 1,
    },
    e2e: {
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
