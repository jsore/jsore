/**
 * jsore/src/utils/page.js
 *
 * 200 OK & 400 NOT FOUND helper utility
 */

module.exports = {

  found: function(res, retrievedView) {
    res.status(200);
    res.set('Content-Type', 'text/html');
    res.write(retrievedView);
    return res.end();
  },

  notfound: function(err, req, res) {
    console.log(err.message);
    res.status(404);
    res.writeHead(301, {
      'Location': 'https://' + req.headers['host'] + '/404-Not-Found'
    });
    return res.end();
  }
};
