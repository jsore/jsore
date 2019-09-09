/**
 * jsore/src/handlers/home/index.js - handler will receive a
 * view and all of its dependencies by the higher order
 * inject.dependencies()
 *
 * handler then invokes the router to route the fully built
 * view back to the handler
 *
 * handler then invokes the page.found helper function that
 * sets sane res() defaults & returns the response to Express
 */

module.exports = (req, res, next, router, currentView, page) => {

  /**
   * fallback to maintenace splash page if necessary
   *
   * this just drops Express down to the next view assigned
   * to home ('/'), which is mapped to maintenanceHandler
   */
  if (process.env.MAINTENANCE_FLAG) {
    // console.log(req);
    return next();
    // new Promise(next()).then();

  } else {
    /**
     * else a maintenance_flag environment variable wasn't
     * detected on application load, so we can just go to
     * the proper home page ( 'About Me' )
     */

    try {
      const retrievedView = router(req, res, currentView);
      return page.found(res, retrievedView);
    } catch {
      const err = `View " ${req.url} " exists but could not be loaded`;
      console.log(err);
      return page.notfound(err, req, res);
    }
  }
};


