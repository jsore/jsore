/**
 * jsore/src/views/maintenance/index.js - generates the view
 * the client is requesting
 */

// const fs = require('fs');
// const header = require('../header')();
// const footer = require('../footer')();
// const page = fs.readFileSync(__dirname + '/index.html');
// const resources = [header, page, footer];


// const generator = require('../utils/generateViewTemplate.js')(`${__dirname}`);
// const dir = `${__dirname}`;
// const generator = require('../../utils/generateViewTemplate.js')(dir);
const generatePartials = require('../view-template.js');



// module.exports = (res) => resources;
// module.exports = (res) => generatePartials(dir);
// module.exports = () => generatePartials();


// module.exports = generatePartials;

const contentScriptAPI = (dom) => {
  // redirectTimer(dom);
  return dom.serialize();
};

module.exports = (res) => {
  const dir = __dirname;
  // return generatePartials(dir);
  const fullView = generatePartials(dir);
  return contentScriptAPI(fullView);
};
