const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    },

    // other e2e configuration options
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://7cows.io'
  },
});
