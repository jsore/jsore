/**
 * jsore/src/views/maintenance/index.js - generates the view
 * the client is requesting
 */

const generatePartials = require('../view-template.js');

module.exports = (req, res) => {
  const dir = __dirname;
  const view = generatePartials.buildDom(dir);
  generatePartials.scriptAPI(req, res, view);
  return view.serialize();
};
