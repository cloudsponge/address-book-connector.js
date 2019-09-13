module.exports = {
  parser: 'babel-eslint',
  rules: {
    "max-len": [1, 120, 2, {ignoreComments: true}],
  },
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  plugins: [
    'prettier',
    'jest',
  ],
};
