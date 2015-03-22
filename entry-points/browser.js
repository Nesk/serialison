// We want only what we need to reduce the size of the final output
require('core-js/src/es6.symbol');
require('core-js/src/es6.object.statics');
require('core-js/src/es6.array.statics');
require('core-js/src/es6.collections');
require('regenerator-babel/runtime');

// Export the library
module.exports = require('../lib/serialison');
