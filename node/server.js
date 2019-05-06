const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();

/**
 * should NODE_ENV be 'development' on local machine???
 *
 * ../Pub/jsore/node $ set NODE_ENV=development
 *
 * dev-server.js and server-old.js
 *
 *  nconf
 *   .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
 *   .file(nconf.get('conf'));
 *
 * so
 * ...if NODE_ENV is set on linode server as production
 * ...if NODE_ENV is set on local macbook as development
 *   config files = development.config.json, production.config.json
 *   that's where I'd stick each specific thing I'm wanting, including SSL keys
 */


/** handles and logs current environment */
const nconf = require('nconf');
nconf
  .argv()
  .env('__')
  .defaults({'NODE_ENV': 'development'});
const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';

/**
 * server.js is managed and started with pm2
 * pm2 overwrites this default NODE_ENV when the server is started
 */
nconf
  .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
  .file(nconf.get('conf'));


//const privKey = fs.readFileSync('/etc/letsencrypt/live/jsore.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/jsore.com/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/jsore.com/chain.pem', 'utf8');
const privKey = fs.readFileSync(`${nconf.get('privKeyPath')}`, 'utf8');
const certificate = fs.readFileSync(`${nconf.get('certificatePath')}`, 'utf8');
const ca = fs.readFileSync(`${nconf.get('caPath')}`, 'utf8');
const creds = {
    key: privKey,
    cert: certificate,
    ca: ca
};


app.use((req, res) => {
    res.send('hello');
});
app.use(helmet()); /** further HTTPS sanitation */
//app.use('/', someMiddleware());
//app.use('/', aDifferentMiddleware());
//app.use((req, res) => {
//    res.writeHead(200);
//    res.end("hi there");
//});

const httpsServer = https.createServer(creds, app);
httpsServer.listen(443, () => {
    console.log('https running');
    console.log(`${NODE_ENV}`);
});

/** for HTTP redirect >> HTTPS */
const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, () => console.log('http server running puerly for redirect to https'));
