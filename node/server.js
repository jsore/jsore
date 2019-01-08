/**
 * html/node/server.js
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


if (isDev) {
    http.createServer(app).listen(8008, () => console.log('dev server ready'));
} else {
    const httpsOptions = {
        /** TODO: move this to nconf */
        key: fs.readFileSync('/etc/letsencrypt/live/jsore.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/jsore.com/cert.pem'),
    };
    https.createServer(httpsOptions, app)
        .listen(443, () => console.log('https ready'));

    http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80, () => console.log('http ready'));
}



//https.createServer(httpsOptions, app)
//    .listen(443, () => console.log('https ready'));

/**
 * http >> https redirect
 *
 * this is replacing my Apache <virtualhost> options since
 *   I'm not using Apache at all on this project
 */
//http.createServer((req, res) => {
//    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//    res.end();
//}).listen(80, () => console.log('http ready'));



//app.use('/api');
//app.listen(443, () => console.log('app.listen ready'));


// https://www.zeptobook.com/how-to-create-restful-crud-api-with-node-js-mongodb-and-express-js/
/*
// get dependencies
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// default route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to ZeptoBook Product app"});
});
// listen on port 3000
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
*/
