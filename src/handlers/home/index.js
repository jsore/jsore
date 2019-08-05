/**
 * jsore/src/handlers/home/index.js
 */

module.exports = {
  handle: function(req, res, next, router, currentView) {
    /** fallback to maintenace splash page if necessary */
    if (process.env.MAINTENANCE_FLAG) {
      // console.log(req);
      return next();
      // new Promise(next()).then();
    } else {
      /** open router for homepage */
    }
  }
};

