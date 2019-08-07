/**
 * jsore/src/routes/page-not-found/index.js - gets the view for
 * the current route
 */

module.exports = (req, res, currentView) => currentView(res);
