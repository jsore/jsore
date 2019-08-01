/**
 * jsore/src/handlers/home/index.js
 */

module.exports = {
  // homeHandler: function(req, res, next, router, currentView) {
  handle: function(req, res, next, router, currentView) {
    if (process.env.MAINTENANCE_FLAG) {
    /** fallback to maintenace splash page */
      next();
    } else {
      /** open router for homepage */
    }
  }
};

