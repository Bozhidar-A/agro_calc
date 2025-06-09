const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',

  // 👇 преобразувай ESM пакети (lucide-react)
  transformIgnorePatterns: ['node_modules/(?!(lucide-react)/)'],

  // 👇 задължи babel-jest да обработва .ts/.tsx
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};

module.exports = createJestConfig(customJestConfig);
