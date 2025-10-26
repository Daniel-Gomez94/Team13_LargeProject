/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.mjs"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1.js"
  },
  verbose: false
};
