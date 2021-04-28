module.exports = {
  setupFiles: ['./test/env-setup.js'],
  setupFilesAfterEnv: ['./test/test-setup.js'],
  // node_modules is default.
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  clearMocks: true,
  coverageReporters: [
    "text",
    "cobertura"
  ],
};
