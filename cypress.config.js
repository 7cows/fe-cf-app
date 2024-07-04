const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Define tasks here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      // You can include other configurations and event handlers as needed
    },

    // Your other e2e configuration options
    baseUrl: 'https://7cows.io',  // Adjust as needed for your app
  },
});
