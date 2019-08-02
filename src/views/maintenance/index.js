/**
 * jsore/src/views/maintenance/index.js
 */

const fs = require('fs');

module.exports = {
  view: function(res) {
    const page = fs.readFileSync(__dirname + '/index.html');
    return page;
  }
};
