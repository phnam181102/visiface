import { defineConfig } from 'cypress';

export default defineConfig({
    viewportHeight: 1080,
    viewportWidth: 1920,
    video: false,
    env: {
        email: 'nam@gmail.com',
        password: 'nam12345',
        apiUrl: 'http://localhost:3000/',
    },
    retries: {
        openMode: 2,
        runMode: 1,
    },
    e2e: {
        baseUrl: 'http://localhost:5173/',
        specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
