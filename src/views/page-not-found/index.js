/**
 * jsore/src/views/page-not-found/index.js - generates the
 * view the client is requesting
 */

// const fs = require('fs');
// const header = require('../header')();
// const footer = require('../footer')();
// const page = fs.readFileSync(__dirname + '/index.html');
// const resources = [header, page, footer];
const generatePartials = require('../view-template.js');
// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
// const dom = new JSDOM(`<someHTML></someHTML>`);
// console.log(dom.window.document.querySelector('p').textContent);


// module.exports = (res) => {
//   const dir = __dirname;
//   return generatePartials(dir);
// };


// const buildDom = (view) => {
//   const dom = new JSDOM(view, (window) => {
//     const doc = window.document;
//     const timer = doc.getElementById('redirect-timer');
//     timer.innerHTML = 'node script reached';
//     // return doc;
//     console.log(doc);
//   });
//   return dom;
// };


const redirectTimer = (dom) => {
  // console.log(dom.window.document.querySelector('p').innerHTML);
  // dom.window.document.querySelector('p').innerHTML = 'test2';

  const timer = dom.window.document.getElementById('redirect-timer');
  timer.innerHTML = 'script reached';

  // return dom;
  // return dom.serialize();
};

/**
 * higher order function for managing running the JSDOM
 * through all of the content scripts this view requires
 */
const contentScriptAPI = (dom) => {
  redirectTimer(dom);
  return dom.serialize();
};

module.exports = (res) => {
  const dir = __dirname;
  const fullView = generatePartials(dir);
  // return fullView;
  return contentScriptAPI(fullView);

};
