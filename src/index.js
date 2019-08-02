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
const inject = require('./utils/inject-dependencies.js');
/** private util for Dev to get keys for https module */
const developmentServer = require('./utils/priv/load-dev-server.js') || '';
/** responds to client if view is found or is not found */
const pageStatus = require('./utils/page.js');
/** ignore all subpaths queried by client, go back to '/' */
const nukeSubPaths = require('./utils/nuclear-root-redirect.js');

/** handles passing to and receiving routing results */
const homeHandler = require('./handlers/home');
const maintenanceHandler = require('./handlers/maintenance');
const pageNotFoundHandler = require('./handlers/page-not-found');

/** routes to a view, returns it for Express to render */
const homeRouter = require('./routes/home');
const maintenanceRouter = require('./routes/maintenance');
const pageNotFoundRouter = require('./routes/page-not-found');

/** grabs the current view, passes it back to routers */
const homeView = require('./views/home');
const maintenanceView = require('./views/maintenance');
const pageNotFoundView = require('./views/page-not-found');


/** associates handler contexts */
const handlerMaps = new Map([
  [homeHandler, homeRouter],
  [maintenanceHandler, maintenanceRouter],
  [pageNotFoundHandler, pageNotFoundRouter],
]);

const viewMaps = new Map([
  [homeHandler, homeView],
  [maintenanceHandler, maintenanceView],
  [pageNotFoundHandler, pageNotFoundView],
]);


/** init services */
const app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/../dist'));


/**
 * '/' handler checks if a MAINTENANCE_FLAG is set and lets
 * GET fall through to the 'Under Maintenance' handler if found
 */
app.use('/404-not-found', inject.dependencies(pageNotFoundHandler, handlerMaps, viewMaps, pageStatus));
app.get('/', inject.dependencies(homeHandler, handlerMaps, viewMaps, pageStatus));
app.get('/', inject.dependencies(maintenanceHandler, handlerMaps, viewMaps, pageStatus));

/** should always be dead last - turns off undefined views */
// app.get('/*', (req, res) => nukeSubPaths.goBackHome(req, res));
app.use('/*', (req, res) => pageStatus.notfound('not found', req, res));


/** load localhost with HTTPS if we're in dev... */
const developmentMode = developmentServer.devKeys(app) || '';
/** ...otherwise use NGINX's SSL config */
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`jsore running on port ${port}`);
});
