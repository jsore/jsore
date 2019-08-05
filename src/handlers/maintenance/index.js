/**
 * jsore/src/handlers/maintenance/index.js
 */

module.exports = {
  handle: function(req, res, next, router, currentView, page, ViewError) {
    /** use the router to get the view */
    try {
      let retrievedView = router.route(req, res, currentView);
      return page.found(req, res, retrievedView);
    } catch {
      const err = `View " ${req.url} " exists but could not be loaded`;
      console.log(err);
      return page.notfound(err, req, res);
    }
  }
};
