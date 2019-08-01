/**
 * jsore/src/views/maintenance/index.js
 */

const fs = require('fs');

module.exports = {
  view: function(res) {
    console.log('view/maintenance reached');
    const page = fs.readFileSync(__dirname + '/index.html');
    // return page;
    res.status(200);
    res.set('Content-Type', 'text/html');
    res.write(page);
    return res.end();
  }
};
