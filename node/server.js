/**
 * __dirname/node/server.js
 *
 * handles server management
 *
 * $ NODE_ENV=<development> npm start
 * $ pm2 start
 * $ pm2 start npm -- start
 */


/** bring most of our shit in */
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');   /** web application context */
const helmet = require('helmet');     /** further https sanitization */
const {URL} = require('url');         /** url parsing */
const nconf = require('nconf');       /** app settings */
const morgan = require('morgan');     /** HTTP logger */


const app = express();                /** global context init */


/** detect env and set name of config file */
nconf.argv().env('__').defaults({'NODE_ENV': 'development'});
const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';
nconf
  .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
  .file(nconf.get('conf'));


/**
 * these were originally declared and set within the truth-y
 * isDev if statement
 *
 * I apparently did not remember what scope was, until trying
 * to start my server in production and causing chrome to
 * freak out about the authenticity of my SSL keys ( it was
 * of course not able to match key=CA because no access )
 *
 * after an entire day of debugging and creating/trashing
 * new SSL certs for my domain, this fixed the issue
 */
let prodKey = '';     // a note on my SSL certs so that I don't forget to remember
let prodCert = '';    // renews through a cronjob, once a month, 1st day of month
let prodCa = '';      //
let creds = {};       // $ crontab -e


/** use and log everything at this url */
const baseURL = new URL(nconf.get('serviceUrl'));
app.use(morgan('dev'));


/** sanitize HTTP headers sent by Express */
app.use(helmet());


/** start managing user sessions */
const expressSession = require('express-session');
const parseurl = require('parseurl');


/** if NODE_ENV is set to 'development'... */
if (isDev) {
  /** ...use 'development.config.json' */
  /** mkcert keys */
  const devKey = fs.readFileSync(`${nconf.get('devKey')}`, 'utf8');
  const devCert = fs.readFileSync(`${nconf.get('devCert')}`, 'utf8');
  /** CA managed by env variable */
  creds = {};
  creds = { key: devKey, cert: devCert };

  /** user session management */
  const FileStore = require('session-file-store')(expressSession);
  app.use(expressSession({
    resave: false,                    /** don't save for each request */
    saveUninitialized: true,          /** save unmodified sessions */
    secret: nconf.get('itsasecret'),
    store: new FileStore()            /** stores in ./sessions */
  }));

} else {
  /**
   * ...else PM2 is handling this app's instance
   * - run with $ pm2 start
   * - overwrites NODE_ENV to 'production' ( ecosystem.config.js )
   */
  prodKey = fs.readFileSync(`${nconf.get('prodKey')}`, 'utf8');
  prodCert = fs.readFileSync(`${nconf.get('prodCert')}`, 'utf8');
  prodCA = fs.readFileSync(`${nconf.get('prodCA')}`, 'utf8');
  creds = { key: prodKey, cert: prodCert, ca: prodCA };

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


/** serve webpack package */
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackConfig = require('./webpack.config.js');
  app.use(webpackMiddleware(webpack(webpackConfig), {
    // mode: 'development',
    publicPath: '/',
    stats: 'errors-only',
  }));


const httpsServer = https.createServer(creds, app);
httpsServer.listen(443, (req, res) => {
    console.log('HTTPS server running');
    console.log(`Environment: "${NODE_ENV}"\nWhich means isDev = "${isDev}"`);
});


/** for HTTP redirect >> HTTPS */
const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end('Redirecting to HTTPS...');
}).listen(80, () => console.log('HTTP server up for HTTPS redirects'));

