/**
 * jsore/src/routes/maintenance/index.js
 */

module.exports = {
  route: function(req, res, currentView) {
    // return currentView.view().then(page => page);

    // return currentView.view(res);

    // try {
      return currentView.view(res);
    // } catch (err) {
      // return err.message;
    // }
  }
};
