module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true
    },
    globals: {
        process: true,
        require: true,
        module: true
    },
    extends: [
        'plugin:vue/strongly-recommended',
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2015,
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    rules: {
    }
}
