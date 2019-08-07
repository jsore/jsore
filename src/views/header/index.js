/**
 * jsore/src/views/header/index.js
 */
const fs = require('fs');
// const header = fs.readFileSync(__dirname + '/index.html', "utf8");
const header = fs.readFileSync(__dirname + '/index.html');

module.exports = () => header;

