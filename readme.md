
# Development

    yarn install

## Build

    yarn build

## Dependencies

`package.json` includes the following dev dependencies and rationale:

* compiling
  * @babel/core - babel compiler
  * @babel/preset-env - current standard babel preset
  * core-js - standard library polyfills for modern js
  * regenerator-runtime - supports `await` in our specs which depend on it to test the Promise response
* testing
  * jest - the one tool to test them all
* lint checking - tools and plugins to keep our code looking nice and consistent
  * eslint
  * eslint-config-prettier
  * eslint-plugin-prettier
  * eslint-plugin-jest
  * prettier
* building
  * rollup - build tool
  * rollup-plugin-node-resolve - resolves node_modules
  * rollup-plugin-babel - loads babel
  * rollup-plugin-copy - copies an html file to dist for testing
  * rollup-plugin-serve - a simple web server to manually test the lib locally
  * rollup-plugin-size-snapshot - captures build sizes
  * rollup-plugin-replace - env dependent replacements
  * rollup-plugin-strip - strips debugging statements from production builds
  * rollup-plugin-ugl - uglifier for prod
