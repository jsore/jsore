/**
 * jsore/index.js
 */

// console.log('init');

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');
// const path = require('path');


const app = express();
app.use(morgan('dev'));
/** let NGINX handle redirection instead */
// app.use(httpRequests.redirectToHttps());


const assets = fs.readFileSync('./dist/index.html', 'utf8');
// app.use(express.static(__dirname + './dist/index.html'));
// app.use(express.static(__dirname + './dist/'));
app.use(express.static('dist'));


app.get('/', function(req, res) {
  res.status(200);
  res.set('Content-Type', 'text/html');
  res.write(assets);
  res.end();
});


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
