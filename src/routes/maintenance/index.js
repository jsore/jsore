/**
 * jsore/src/routes/maintenance/index.js
 */

module.exports = {
  route: function(req, res, currentView) {
    // return currentView.view().then(page => page);
    return currentView.view(res);
  }
};
