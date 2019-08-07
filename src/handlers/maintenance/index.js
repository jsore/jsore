/**
 * jsore/src/handlers/maintenance/index.js - passes the
 * request to the appropriate router
 */

module.exports = {
  handle: function(req, res, next, router, currentView, page) {
    /** use the router to get the view */
    try {
      let retrievedView = router(req, res, currentView);
      return page.found(req, res, retrievedView);
    } catch {
      const err = `View " ${req.url} " exists but could not be loaded`;
      console.log(err);
      return page.notfound(err, req, res);
    }
  }
};
