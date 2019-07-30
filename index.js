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

/**
 * custom modules
 */
// const httpRequests = require('./routes/http/index.js');


const app = express();


app.use(morgan('dev'));
// app.use(httpRequests.redirectToHttps());
// app.use(httpRequests.redirectToHttps(req, res));


const assets = fs.readFileSync('./dist/index.html', 'utf8');
// app.use(express.static(__dirname + './dist/index.html'));
// app.use(express.static(__dirname + './dist/'));
app.use(express.static('dist'));

   // "devKey": "/Users/justin/Core/Dev/localtest.com+2-key.pem",
   // "devCert": "/Users/justin/Core/Dev/localtest.com+2.pem"


app.get('/', function(req, res) {
  res.status(200);
  res.set('Content-Type', 'text/html');
  res.write(assets);
  res.end();
});

const port = process.env.SERVER_PORT;

if (process.env.CURRENT_ENVIRONMENT === 'dev') {

  let developmentKey = fs.readFileSync(`${process.env.DEVELOPMENT_KEY}`, 'utf8');
  let developmentCert = fs.readFileSync(`${process.env.DEVELOPMENT_CERT}`, 'utf8');
  let creds = { key: developmentKey, cert: developmentCert };

  const httpsServer = https.createServer(creds, app);
  httpsServer.listen(443, (req, res) => {
    console.log('dev server running');
  });
}

app.listen(port, () => {
  console.log(`jsore running on port ${port}`);
});
