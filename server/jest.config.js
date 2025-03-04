module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    testPathIgnorePatterns: [
        '<rootDir>/routes/__tests__/integration/checkRouter.js',
        '<rootDir>/routes/__tests__/unit/checkRouter.js',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
