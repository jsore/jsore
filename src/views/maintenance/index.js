/**
 * jsore/src/views/maintenance/index.js
 */

const fs = require('fs');

const page = fs.readFileSync(__dirname + '/index.html');

module.exports = {
  view: function(res) {
    return page;
  },

  // virtDom: function() {
  //   const dom = new JSDOM(page, {
  //     contentType: 'text/html',
  //   });
  //   console.log(dom.serialize());
  //   return dom;
  // }
};
