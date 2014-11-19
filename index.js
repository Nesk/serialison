// The whole project is written in ES6 and interpreted with 6to5
require('6to5/register');
require('6to5/polyfill');

// Export the library
module.exports = require('./lib/serialison.js').SerialiSON;