module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  // Tell Jest to redirect the SCALAR ESM package to our local TypeScript mock
  moduleNameMapper: {
    '^@scalar/fastify-api-reference$': '<rootDir>/tests/__mocks__/scalarMock.ts'
  }
};