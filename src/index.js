/**
 * jsore/src/index.js
 *
 * Entrypoint for portfolio
 *
 * src/index.js
 *  -> req /
 *     -> handler to parse the correct route
 *         -> router to get the view
 *             -> view to pass the view back
 */

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');

const injectDependencies = require('./utils/injectDependencies.js');

const homeHandler = require('./handlers/home/index.js');
const maintenanceHandler = require('./handlers/maintenance/index.js');

const homeRouter = require('./routes/home/index.js');
const maintenanceRouter = require('./routes/maintenance/index.js');

const homeView = require('./views/home/index.js');
const maintenanceView = require('./views/maintenance/index.js');


// const maintenanceRedirect = require('./routes/maintenance/redirect/index.js');

const handlerToRouteMap = new Map([
  [homeHandler, homeRouter],
  [maintenanceHandler, maintenanceRouter],
]);

const handlerToViewMap = new Map([
  [homeHandler, homeView],
  [maintenanceHandler, maintenanceView],
]);


const app = express();
app.use(morgan('dev'));
/** let NGINX handle redirection instead */
// app.use(httpRequests.redirectToHttps());


////// const assets = fs.readFileSync(__dirname + '/../dist/index.html', 'utf8');
////// app.use(express.static(__dirname + '/../dist'));
app.use(express.static(__dirname + '/../dist/styles'));


/** move this to MVC module */
// app.get('/', function(req, res) {
//   res.status(200);
//   res.set('Content-Type', 'text/html');
//   res.write(assets);
//   res.end();
// });
/**
 * set homepage as default but fallback to maintenance page
 * if maintenance flag is set
 */
app.get('/', injectDependencies.intoHandlers(homeHandler, handlerToRouteMap, handlerToViewMap));
app.get('/', injectDependencies.intoHandlers(maintenanceHandler, handlerToRouteMap, handlerToViewMap));

// app.all('/*', maintenanceRedirect.)


/**
 * set some defaults that are sanitized this time
 */
const port = process.env.SERVER_PORT;
if (process.env.CURRENT_ENVIRONMENT === 'dev') {
  /**
   * TODO: move this into util function, get it out of the
   * main stage...
   */
  let developmentKey = fs.readFileSync(`${process.env.DEVELOPMENT_KEY}`, 'utf8');
  let developmentCert = fs.readFileSync(`${process.env.DEVELOPMENT_CERT}`, 'utf8');
  let creds = { key: developmentKey, cert: developmentCert };
  /** ...and instead, just return an HTTP server back here */
  const httpsServer = https.createServer(creds, app);

  httpsServer.listen(443, (req, res) => {
    console.log('dev server running');
  });
}


app.listen(port, () => {
  console.log(`jsore running on port ${port}`);
});
