import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import strip from 'rollup-plugin-strip';
import { uglify } from 'rollup-plugin-uglify';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

// import pkg from './package.json';
const babelOptions = require('./babel.config');

const input = './src/index.js';
const extensions = ['.js'];

// Treat as externals all not relative and not absolute paths
const excludeAllExternals = id => !id.startsWith('.') && !id.startsWith('/');

const getBabelOptions = () => ({
  exclude: 'node_modules/**',
  runtimeHelpers: true,
  ...babelOptions,
});

const snapshotArgs =
  process.env.SNAPSHOT === 'match'
    ? {
        matchSnapshot: true,
        threshold: 1000,
      }
    : {};

const commonjsArgs = {
  include: 'node_modules/**',
};

export default [
  // Universal module definition (UMD) build
  // - including console.* statements
  // - conditionally used to match snapshot size
  {
    input,
    output: {
      file: 'dist/address-book-connector.js',
      format: 'umd',
      name: 'addressBookConnector',
      globals: { window: 'window' },
    },
    plugins: [
      babel(getBabelOptions()),
      resolve({ extensions }),
      commonjs(commonjsArgs),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(snapshotArgs),
    ],
  },

  // Minified UMD build
  {
    input,
    output: {
      file: 'dist/address-book-connector.min.js',
      format: 'umd',
      name: 'address-book-connector',
      globals: { window: 'window' },
    },
    plugins: [
      babel(getBabelOptions()),
      resolve({ extensions }),
      commonjs(commonjsArgs),
      strip({ debugger: true }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(snapshotArgs),
      uglify(),
    ],
  },
];
