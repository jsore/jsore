/**
 * jsore/src/views/home/index.js
 */

const generatePartials = require('../view-template.js');

// content scripts


// const somefunction = (chevronMenuChild) => {
//   do something that resets display:hidden on hover
// }


// const someFunctionThatDoesAnAnimationOnLoad = () => {
//   slap a bandaid over fontawesome load lag
// }


// remove email signature footer from page


module.exports = (req, res) => {
  const dir = __dirname;
  const view = generatePartials.buildDom(dir);
  // console.log('notfoundview.exports()');

  // generatePartials.scriptAPI(req, res, view, contentScript);
  generatePartials.scriptAPI(req, res, view);
  return view.serialize();
};
