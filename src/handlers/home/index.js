/**
 * jsore/src/handlers/home/index.js
 */

module.exports = {
  // homeHandler: function(req, res, next, router, currentView) {
  handle: function(req, res, next, router, currentView) {
    /** fallback to maintenace splash page if necessary */
    if (process.env.MAINTENANCE_FLAG) {
      // console.log(req);
      next();
      // new Promise(next()).then();
    } else {
      /** open router for homepage */
    }
  }
};

