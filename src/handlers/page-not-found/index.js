/**
 * jsore/src/handlers/page-not-found/index.js
 */

module.exports = {
  handle: function(req, res, next, router, currentView) {
    try {
      /** throw the 404 view with proper status code */
      let retrievedView = router.route(req, res, currentView);
      // res.status(404);
      res.set('Content-Type', 'text/html');
      res.write(retrievedView);
      return res.end();
      // return page.found(req, res, retrievedView);
    } catch {
      /** if we've gotten here, it's gonna be a server issue */
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Internal Server Error' });
      return res.end('Internal Server Error');
    }

  }
};
