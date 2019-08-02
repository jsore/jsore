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

/** custom modules */

/** high-order function, returns the results of a handler */
const injectDependencies = require('./utils/inject-dependencies.js');

/** private util for Dev to get keys for https module */
const developmentServer = require('./utils/priv/load-dev-server.js') || '';

/** 200 OK || 400 NOT FOUND util */
const pageStatus = require('./utils/page.js');

// /** content scripts for DOM manipulations */
// const scripts = require('require-all')({
//   dirname: __dirname + '/content-scripts',
//   filter: /((\w+-?){1,})\.js$/,
//   recursive: true,
//   map: function(name, path) {
//     return name.replace(/-([a-z])/g, function(m, c) {
//       return c.toUpperCase();
//     });
//   }//,
//   //resolve: function(name) {
//   //  return new name();
//   //}
// });
//
// usage, get afterInterval() export from src/content-scripts/page-not-found/redirectToHome.js:
//
// scripts.pageNotFound.redirectToHome.afterInterval()


/** handles passing to and receiving routing results */
const homeHandler = require('./handlers/home/index.js');
const maintenanceHandler = require('./handlers/maintenance/index.js');
const pageNotFoundHandler = require('./handlers/page-not-found/index.js');

/** routes to a view, returns it for Express to render */
const homeRouter = require('./routes/home/index.js');
const maintenanceRouter = require('./routes/maintenance/index.js');
const pageNotFoundRouter = require('./routes/page-not-found/index.js');

/** grabs the current view, passes it back to routers */
const homeView = require('./views/home/index.js');
const maintenanceView = require('./views/maintenance/index.js');
const pageNotFoundView = require('./views/page-not-found/index.js');


/** associates handler contexts */
const handlerToRouteMap = new Map([
  [homeHandler, homeRouter],
  [maintenanceHandler, maintenanceRouter],
  [pageNotFoundHandler, pageNotFoundRouter],
]);

const handlerToViewMap = new Map([
  [homeHandler, homeView],
  [maintenanceHandler, maintenanceView],
  [pageNotFoundHandler, pageNotFoundView],
]);


/** init services */
const app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/../dist'));


app.use('/404-not-found',
  injectDependencies.intoHandlers(
    pageNotFoundHandler, handlerToRouteMap, handlerToViewMap, pageStatus
  )
);

/**
 * homepage is the default route...
 */
app.get('/', injectDependencies.intoHandlers(
  homeHandler, handlerToRouteMap, handlerToViewMap, pageStatus
));

/**
 * ...but it falls back here if maintenance flag is set
 */
app.get('/', injectDependencies.intoHandlers(
  maintenanceHandler, handlerToRouteMap, handlerToViewMap, pageStatus
));

app.get('/*', function(req, res) {
  res.writeHead(301, {
    'Location': 'https://jsore.com',
  });
  // res.redirect('/');
  res.end();
});


/**
 * if we're on the development machine, load HTTPS server
 * for TLS/SSL over localhost...
 */
const developmentMode = developmentServer.devKeys(app) || '';

/**
 * ...otherwise use NGINX's SSL config
 */
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`jsore running on port ${port}`);
});
