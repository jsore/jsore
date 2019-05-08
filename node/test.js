//const http = require('http');
//const express = require('express');
//const app = express();
//app.get('/', (req, res) => {
//  res.send('test');
//});
//http.createServer((req, res) => {
//  console.log('running test ');
//  res.writehead(200);
//  res.end('hi');
//
//}).listen(3001, '127.0.0.1');


//const proxy = require('http-proxy').createProxyServer();

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const prodKey = fs.readFileSync('/etc/letsencrypt/live/jsore.com/privkey.pem', 'utf8');
  const prodCert = fs.readFileSync('/etc/letsencrypt/live/jsore.com/cert.pem', 'utf8');
  const prodCA = fs.readFileSync('/etc/letsencrypt/live/jsore.com/chain.pem', 'utf8');
  const creds = { key: prodKey, cert: prodCert, ca: prodCA };

app.get('/', (req, res) => {
  res.send('yup');
});

const httpsServer = https.createServer(creds, app);
httpsServer.listen(443, (req, res) => {
    //res.writeHead(200);
    console.log('HTTPS server running');
    //res.end('test');
    //console.log(`Environment: "${NODE_ENV}"\nWhich means isDev = "${isDev}"`);
    //console.log('viewed ', req.session.views['/#welcome'], ' times');
});
