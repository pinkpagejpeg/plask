export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "^.+\\.svg$": "jest-transformer-svg",
        "^.+\\.(png|jpg|jpeg|gif)$": "jest-transform-stub",
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testPathIgnorePatterns: ['<rootDir>/src/shared/api/__tests__/checkApi.ts'],
}