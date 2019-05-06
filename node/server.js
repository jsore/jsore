/**
 * __dirname/node/server.js
 *
 * handles server management
 */

/**
 * ..notes/node-js/project-files/fortify/B4/server.js
 */

/** bring in most of our shit in */
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
/** web application context */
const express = require('express');
/** further https sanitization */
const helmet = require('helmet');
/** url parsing */
const {URL} = require('url');
/** app settings */
const nconf = require('nconf');
/** get/post logger */
const morgan = require('morgan');
/** global inits */
const app = express();


/** detect current environment */
nconf.argv().env('__').defaults({'NODE_ENV': 'development'});
const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';


/** pm2 overwrites this default on startup in prod */
nconf
  .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
  .file(nconf.get('conf'));


const baseURL = new URL(nconf.get('serviceUrl'));
//const servicePort = baseUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);


/** for sanity checking w/o webpack */
//app.use((req, res) => {
//  res.writeHead(200);
//  res.end('hello');
//});

app.use(morgan('dev'));
app.use(helmet()); /** further HTTPS sanitation */


/** start managing user sessions */
const expressSession = require('express-session');
const parseurl = require('parseurl');

/** handles switch between prod/dev environments */
let creds = {};
if (isDev) {
  const devKey = fs.readFileSync(`${nconf.get('devKey')}`, 'utf8');
  const devCert = fs.readFileSync(`${nconf.get('devCert')}`, 'utf8');
  /** CA managed by env variable */
  creds = { key: devKey, cert: devCert };

  /** user session management */

  /** pull in FileStore class from expressSession */
  const FileStore = require('session-file-store')(expressSession);  // need to npm install
  /** change secret to kick all current user sessions */
  app.use(expressSession({  // https://github.com/expressjs/session
    /** don't save for each request */
    resave: false,
    /** save new unmodified sessions? yes, we want all session data */
    saveUninitialized: true,
    secret: nconf.get('itsasecret'),
    //cookie: { secure: true },
    store: new FileStore()  // stores in ./sessions
  }));

  app.use((req, res, next) => {
    if (!req.session.views) {
      req.session.views = {}
    }
    //const hashlink = parseurl(req).hash;
    const pathname = parseurl(req).pathname;
    //req.session.views[hashlink] = (req.session.views[hashlink] || 0) + 1;
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
    next();
  });


  /** serve webpack package */
  const webpack = require('webpack');
  /** serve from memory via Express */
  const webpackMiddleware = require('webpack-dev-middleware');
  /** $ webpack --mode development local, production on server */
  const webpackConfig = require('./webpack.config.js');
  app.use(webpackMiddleware(webpack(webpackConfig), {
    // mode: 'development',
    publicPath: '/',
    stats: {colors: true},
  }));

} else {
  const prodKey = fs.readFileSync(`${nconf.get('privKeyPath')}`, 'utf8');
  const prodCert = fs.readFileSync(`${nconf.get('certificatePath')}`, 'utf8');
  const prodCA = fs.readFileSync(`${nconf.get('caPath')}`, 'utf8');
  const creds = { key: prodKey, cert: prodCert, ca: prodCA };

  /** user session management for prod (express has memory leaks) */
  /** future feature */
  //const RedisStore = require('connect-redis')(expressSession);
  //app.use(expressSession({
  //  resave: false,
  //  /** don't store un-auth'ed session data */
  //  saveUninitialized: false,
  //  /** securely grab the secret */
  //  secret: nconf.get('redis:secret'),
  //  /** new session via connect-redis module */
  //  store: new RedisStore({
  //    host: nconf.get('redis:host'),
  //    port: nconf.get('redis:port'),
  //  }),
  //}));


  /** serve webpack package */
  app.use(express.static('dist'));
};


//app.get('/resume', (req, res) => {
//  // show resume;
//});

//app.get('/', (req, res) => {
//  res.send('viewed ', req.session.views['/#welcome'], ' times');
//});


const httpsServer = https.createServer(creds, app);
httpsServer.listen(443, (req, res) => {
    console.log('HTTPS server running');
    console.log(`Environment: "${NODE_ENV}": "${isDev}"`);
    //console.log('viewed ', req.session.views['/#welcome'], ' times');
});

/** for HTTP redirect >> HTTPS */
const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, () => console.log('HTTP server up for HTTPS redirects'));
