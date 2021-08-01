/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
  testEnvironment: "node",
  clearMocks: true,
  errorOnDeprecated: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.*"],
  coverageReporters: ["text", "lcov"]
};

module.exports = config;
