/**
 * jsore/src/views/page-not-found/index.js
 */
// redirectToHome

const fs = require('fs');

module.exports = {
  view: function(res) {
    const page = fs.readFileSync(__dirname + '/index.html');
    return page;
  }
};
