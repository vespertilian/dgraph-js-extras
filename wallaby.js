module.exports = function () {
    process.env.NODE_PATH = require('path').join(__dirname, '../node_modules');
    return {
        files: [
            'src/**/*.ts',
            { pattern: 'src/**/*.spec.ts', ignore: true }
        ],

        tests: [
            'src/**/*.spec.ts'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'jasmine'
    };
};