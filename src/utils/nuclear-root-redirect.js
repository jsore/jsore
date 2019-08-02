/**
 * jsore/src/utils/nuclear-root-redirect.js
 */

module.exports = {
  goBackHome: function(req, res) {
    // res.writeHead(301, { 'Location': `https://${req.headers['host']}` });
    res.writeHead(404, { 'Location': `https://${req.headers['host']}/404-not-found` });
    return res.end(
      `View: " ${req.url} " not allowed while maintenance is underway`
    );
  }
};
