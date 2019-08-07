/**
 * jsore/src/views/footer/index.js
 */
const fs = require('fs');
const footer = fs.readFileSync(__dirname + '/index.html');

module.exports = () => footer;
