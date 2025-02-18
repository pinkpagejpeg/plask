module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    testPathIgnorePatterns: ['<rootDir>/routes/__tests__/checkRouter.js'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
