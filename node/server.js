/**
 * html/node/server.js
 *
 * Entry point for jsore.com
 */
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');

const app = express();
const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/jsore.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/jsore.com/cert.pem'),
};

/** HTTP logger */
const morgan = require('morgan');
app.use(morgan('dev'));

/** basic helper func to test connectivity */
app.get('/hello/:name', (req, res) => {
    res.status(200).json({'hello': req.params.name});
});


https.createServer(httpsOptions, app)
    //.listen(443, () => console.log('https ready'));
    .listen(443, () => console.log('https ready'));
//app.listen(httpsOptions, app)


/**
 * http >> https redirect
 *
 * this is replacing my Apache <virtualhost> options since
 *   I'm not using Apache at all on this project
 */
http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, () => console.log('http ready'));


