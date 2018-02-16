module.exports = function () {
    process.env.NODE_PATH = require('path').join(__dirname, '../node_modules');
    return {
        files: [
            'src/**/*.ts',
            'test-helpers/**/*.ts',
            { pattern: 'src/**/*.spec.ts', ignore: true }
        ],

        tests: [
            'src/**/*.spec.ts'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'jasmine',

        // as the db needs to be reset in between some tests we cannot test in parallel
        workers: {
            initial: 1,
            regular: 1
        }
    };
};