/**
 * jsore/routes/http/index.js
 */
const http = require('http');

module.exports = {
// function redirectToHttps(req, res, next) {
redirectToHttps: function(req, res) {

  /** only care about redirects in production */
  if (!process.env.CURRENT_ENVIRONMENT) {
    const httpServer = http.createServer((req, res) => {
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end('Redirecting to HTTPS...');
    }).listen(80, () => console.log('HTTP redirect server running'));
    return httpServer;
  }
  // next();
}
}

// export default redirectHttpRequests;
// module.exports = redirectToHttps();
