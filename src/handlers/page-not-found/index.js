/**
 * jsore/src/handlers/page-not-found/index.js - passes the
 * request to the appropriate router
 */
// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;

module.exports = {
  // handle: function(req, res, next, router, currentView) {
  //   try {
  //     /** throw the 404 view with proper status code */
  //     // let retrievedView = router.route(req, res, currentView);
  //
  //     /** don't use page.found(), status() shouldn't be 200 */
  //     let retrievedView = router(req, res, currentView);
  //     res.status(200);
  //     res.set('Content-Type', 'text/html');
  //     retrievedView.map(view =>  res.write(view));
  //     return res.end();
  //   } catch {
  //     /** if we've gotten here, it's gonna be a server issue */
  //     res.status(500);
  //     res.set('Content-Type', 'application/json');
  //     res.json({ message: 'Internal Server Error' });
  //     return res.end('Internal Server Error');
  //   }
  // }
  handle: function(req, res, next, router, currentView) {
    try {
      /** throw the 404 view with proper status code */

      /** don't use page.found(), status() shouldn't be 200 */
      const retrievedView = router(req, res, currentView);
      res.status(200);
      res.set('Content-Type', 'text/html');

      // const dom = new JSDOM(retrievedView, {
      //   resources: "usable"
      // });
      // res.write(dom.serialize());
      res.write(retrievedView);
      return res.end();

    } catch {
      /** if we've gotten here, it's gonna be a server issue */
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Internal Server Error' });
      return res.end('Internal Server Error');
    }
  }
};
