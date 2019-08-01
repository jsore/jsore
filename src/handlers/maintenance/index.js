/**
 * jsore/src/handlers/maintenance/index.js
 */

module.exports = {
  // maintenanceHandler: function(req, res, next, router, currentView) {
  handle: function(req, res, next, router, currentView) {
    console.log('maintenanceHandler reached');
    // return router.route(req, currentView).then((page) => {
    //   /** use the router to get the view */
    //   res.status(200);
    //   res.set('Content-Type', 'text/html');
    //   res.write(page);
    //   return res.end();
    // }).catch((err) => {
    //   /** or 404 */
    //   res.status(500);
    //   res.set('Content-Type', 'application/json');
    //   return res.json({ message: err.message });
    // });
    return router.route(req, res, currentView);
  }
};
