/**
 * jsore/src/handlers/maintenance/index.js - passes the
 * request to the appropriate router
 */

module.exports = (req, res, next, router, currentView, page) => {
  /** use the router to get the view */
  try {
    const retrievedView = router(currentView);
    return page.found(res, retrievedView);
  } catch {
    const err = `View " ${req.url} " exists but could not be loaded`;
    console.log(err);
    return page.notfound(err, req, res);
  }
};

