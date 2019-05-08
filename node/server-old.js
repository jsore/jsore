/**
 * html/node/server.js
 *
 * PRODUCTION VERSION
 *
 * Entry point for jsore.com
 */
const fs = require('fs');
const https = require('https');
const http = require('http');

const {URL} = require('url');
const path = require('path');


const nconf = require('nconf');
nconf
    .argv()
    .env('__')
    .defaults({'NODE_ENV': 'development'});
const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';

nconf
    .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
    .file(nconf.get('conf'));


//const serviceUrl = 'https://jsore.com';
const serviceUrl = new URL(nconf.get('serviceUrl'));
//const servicePort = 443;
const servicePort =
    serviceUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);

const express = require('express');
/** HTTP logger */
const morgan = require('morgan');


const app = express();


const privKey = fs.readFileSync('/etc/letsencrypt/live/jsore.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/jsore.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/jsore.com/chain.pem', 'utf8');
const creds = {
    key: privKey,
    cert: certificate,
    ca: ca
};

//const httpsOptions = {
//    /** TODO: move this to nconf */
//    key: fs.readFileSync('/etc/letsencrypt/live/jsore.com/privkey.pem'),
//    cert: fs.readFileSync('/etc/letsencrypt/live/jsore.com/cert.pem'),
//};


app.use(morgan('dev'));



if (isDev) {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('./webpack.config.js');
    app.use(webpackMiddleware(webpack(webpackConfig), {
        publicPath: '/',
        stats: {colors: true},
    }));
} else {
    // prod
}
//    const webpack = require('webpack');
//    const webpackMiddleware = require('webpack-dev-middleware');
//    const webpackConfig = require('./webpack.config.js');
//    app.use(webpackMiddleware(webpack(webpackConfig), {
//        publicPath: '/',
//        stats: {colors: true},
//    }));
//





/** basic helper func to test connectivity */
app.get('/hello/:name', (req, res) => {
    res.status(200).json({'hello': req.params.name});
});

app.get('/', (req, res) => {
    res.send('working');
});

//app.use(require('./lib/bundle.js'));



//app.get('./well-known/acme-challenge/:string', (req, res) => {
//    let filename = req.params.string;
//    let file = `../.well-known/acme-challenge/${filename}`;
//    let challenge = fs.readFileSync(`${file}`);
//    res.send(challenge);
//}).use(express.static('../.well-known/acme-challenge', { dotfiles: 'allow' }));

/**
 * www.jsore.com >> jsore.com redirect
 */
//const wwwRedirect = (req, res, next) => {
//    if (req.headers.host.slice(0, 4) === 'www.') {
//        const cleanHost = req.headers.host.slice(4);
//        return res.redirect(301, req.protocol + '://' + cleanHost + req.originalUrl);
//    }
//    next();
//};
//app.set('trust proxy', true);
//app.use(wwwRedirect);


//https.createServer(httpsOptions, app)
https.createServer(creds, app)
    .listen(443, () => console.log('https ready'));


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



//app.use('/api');
//app.listen(443, () => console.log('app.listen ready'));