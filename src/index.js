/**
 * jsore/src/index.js - Entrypoint for portfolio
 *
 * client sends request to domain...
 *
 * -> the server receives the request
 * -> server sends req to handler/<page-requested> after
 *    injecting all required dependencies
 *    ( for easier unit testing )
 * -> handler parses the req and loads the correct route
 * -> route retrieves the correct view
 * <- view sends HTML back to Express to render
 * <- files the HTML depends on ( styles, scripts ) are
 *    provided by Express for the client
 */

const express = require('express');
/** templating engine */
// const exphbs = require('express-handlebars');
// const Handlebars = require('../node_modules/handlebars/dist/handlebars.js');
const Handlebars = require('handlebars');
const morgan = require('morgan');


/*----------  custom modules  ----------*/

/** high-order function, returns the results of a handler */
const inject = require('./utils/inject-dependencies.js');

/** private util for Dev to get keys for https module */
const developmentServer = require('./utils/priv/load-dev-server.js') || '';

/** responds to client if view is found or is not found */
const pageStatus = require('./utils/page.js');

/**
 * req -> server -> route handler -> route -> view
 * client <- Express <- page.js <- handler <- view
 */
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


/*----------  app init  ----------*/

const app = express();
// app.set('views', `${__dirname}/views/`);
// const hbs = exphbs.create({ /* config */
  // layoutsDir: 'src/views',
  // partialsDir = [{

  // }],
// });
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// hbs.loadPartials();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/../dist'));


/*----------  routes  ----------*/

/**
 * we want this page to be available to all methods but
 * without the performance hit of app.all()
 */
// app.use('*/404-not-found/', inject.dependencies(pageNotFoundHandler, handlerMaps, viewMaps, pageStatus));
app.get('*/404-not-found/', inject.dependencies(pageNotFoundHandler, handlerMaps, viewMaps, pageStatus));
// app.use('*404-not-found/', inject.dependencies(pageNotFoundHandler, handlerMaps, viewMaps, pageStatus));

/**
 * '/ checks if a MAINTENANCE_FLAG variable is set
 *
 * if set, the request falls through to a route that serves
 * a page telling the client the site is under maintenance
 */
app.get('/', inject.dependencies(homeHandler, handlerMaps, viewMaps, pageStatus));
app.get('/', inject.dependencies(maintenanceHandler, handlerMaps, viewMaps, pageStatus));
// app.get('/', function(req, res) {
//   let comp;
//   const placeholder = (req, res) => {
//     comp = Handlebars.compile(`<div><h1>test</h1></div>`);
//     res.end();
//   };
//   placeholder(req, res);
// });

/**
 * middleware that executes after Express parses all routes
 *
 * if no route was hit, let Express assume we want this
 * route to be followed, which serves a 404 page
 */
app.use((req, res) => {
 return pageStatus.notfound('Page Not Found', req, res);
});


/*----------  server init  ----------*/

/** load localhost with HTTPS if we're in dev... */
const developmentMode = developmentServer.devKeys(app) || '';
/** ...otherwise use NGINX's SSL config */
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`jsore running on port ${port}`);
});