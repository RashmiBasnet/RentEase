/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/tests/**/*.test.ts"],
    clearMocks: true,
    // Keep tests self-contained: never let a stray import open a real DB/network.
    setupFiles: ["<rootDir>/src/tests/setup.ts"],
};
