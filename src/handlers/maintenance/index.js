/**
 * jsore/src/handlers/maintenance/index.js
 */

module.exports = {
  // maintenanceHandler: function(req, res, next, router, currentView) {
  handle: function(req, res, next, router, currentView, page) {
    /** use the router to get the view */

    // return router.route(req, res, currentView);


    try {
      let retrievedView = router.route(req, res, currentView);
      return page.found(res, retrievedView);

    } catch (err) {
      // return err.message;
      // let pageNotFound = router.route(req, res, )
      return page.notfound(err, req, res);
    }
  }
};
