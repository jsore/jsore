/**
 * jsore/src/handlers/home/index.js
 */

module.exports = (req, res, next, router, currentView, page) => {
  /** fallback to maintenace splash page if necessary */
  if (process.env.MAINTENANCE_FLAG) {
    // console.log(req);
    return next();
    // new Promise(next()).then();
  } else {
    /** open router for homepage */
  }
};


