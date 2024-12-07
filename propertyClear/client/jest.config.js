module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Transform JavaScript/TypeScript files
        "^.+\\.js$": "babel-jest", // Ensure JS files are transformed
        "^.+\\.css$": "jest-transform-stub", // Mock CSS imports
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(axios)/)", // Transform `axios` and other ES Modules
    ],
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy', // Mocking CSS styles in tests
    },
};
