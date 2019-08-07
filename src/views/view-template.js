/**
 * jsore/src/views/view-template.js
 */

const fs = require('fs');

/** get my universal partials */
const header = require('./header')();
const footer = require('./footer')();

/** init headless browser to mimic browser DOM interactions */
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = (view) => {
  /**
   * grab the requesting view's HTML and prepend/append the
   * universal header/footer
   */
  const page = fs.readFileSync(`${view}/index.html`);
  const sources = header + page + footer;

  /**
   * create the JSDOM environment and send that instance
   * back to the current view
   */
  const dom = new JSDOM(sources, {
    resources: "usable"
  });
  return dom;
};
