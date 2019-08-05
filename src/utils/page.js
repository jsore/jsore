/**
 * jsore/src/utils/page.js
 *
 * 200 OK & 400 NOT FOUND helper utility
 */

/**
 * not sure if it's necessary to obfuscate this by hiding it
 * but there's no harm in doing so
 */
const pageNotFound = req => `https://${req.headers['host']}${req.url}/404-not-found`;

module.exports = {

  found: function(req, res, retrievedView) {
    res.status(200);
    res.set('Content-Type', 'text/html');
    res.write(retrievedView);
    return res.end();
  },

  notfound: function(error, req, res) {
    // console.log(
    //   `View: " ${req.url} " not allowed while maintenance is underway`
    // );

    try {
      console.log(error);
      /** defaults to a custom 404 page */
      res.redirect(`${pageNotFound(req)}`);
      // return res.end();
    } catch {
      /** or loads as JSON or text if req doesnt Accept HTML */
      if (req.accepts('json')) {
        res.send({ error: 'Not Found' });
      } else {
        res.type('txt').send('Not Found');
      }
      // return res.end();
    } finally {
      return res.end();
      // return ViewError.msg(`View "${req.url}" could not be loaded`);

    }
  }
};
