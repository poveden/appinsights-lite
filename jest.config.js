'use strict';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: [
    '<rootDir>/test/jest-setup.js'
  ],
  collectCoverage: true,
  coverageDirectory: 'TestResults/coverage',
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'TestResults', outputName: 'testresults.xml' }],
  ],
  coverageReporters: ['text', 'html', 'cobertura'],
};
