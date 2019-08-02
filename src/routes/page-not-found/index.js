/**
 * jsore/src/routes/page-not-found/index.js
 */

module.exports = {
  route: function(req, res, currentView) {
    return currentView.view(res);
  }
};
