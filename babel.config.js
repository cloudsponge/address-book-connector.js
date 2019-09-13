module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
  ],
};
