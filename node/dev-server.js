/**
 * ~/Desktop/DevProjects/node-dev/jsore/html
 *
 * DEVELOPMENT VERSION
 *
 * Entry point for jsore.com
 */
const fs = require('fs');
const https = require('https');
const http = require('http');

const {URL} = require('url');
const path = require('path');

// trying to get HTTPS in dev
const nconf = require('nconf');
//nconf
//    .argv()
//    .env('__')
//    .defaults({'NODE_ENV': 'development'});
//const NODE_ENV = nconf.get('NODE_ENV');
const NODE_ENV = nconf.get('NODE_ENV');
//const isDev = NODE_ENV === 'development';
//
nconf
    .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
    .file(nconf.get('conf'));


//const serviceUrl = 'https://jsore.com';
// trying to get https in dev
//const serviceUrl = new URL(nconf.get('serviceUrl'));
const serviceUrl = new URL('https://apachetestserver.com');
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


// trying to get HTTPS in dev
if (serviceUrl) {
//if (isDev) {
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


// trying to get HTTPS in dev
//if (isDev) {
//    http.createServer(app).listen(8008, () => console.log('dev server ready'));
//} else {
    const httpsOptions = {
        /** TODO: move this to nconf */
        //key: fs.readFileSync('/etc/letsencrypt/live/jsore.com/privkey.pem'),
        //cert: fs.readFileSync('/etc/letsencrypt/live/jsore.com/cert.pem'),
        // trying for HTTPS in dev
        key: fs.readFileSync('../../../../../../apachetestserver.com+3-key.pem'),
        //key: fs.readFileSync('../../../../../../Library/Application Support/mkcert/rootCA-key.pem'),
        cert: fs.readFileSync('../../../../../../apachetestserver.com+3.pem'),
        //cert: fs.readFileSync('../../../../../../Library/Application Support/mkcert/rootCA.pem'),
    };
    https.createServer(httpsOptions, app)
        .listen(443, () => console.log('https ready'));
        //.listen(8282, () => console.log('https ready'));

    http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    })
        .listen(80, () => console.log('http ready'));
        //.listen(8383, () => console.log('http ready'));
//}





/*----------  https option  ----------*/

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








/*----------  another https option, stolen from reddit  ----------*/

// from https://medium.freecodecamp.org/the-definitive-node-js-handbook-6912378afc6e
// Making HTTP requests with Node.js

// How to perform HTTP requests with Node.js using GET, POST, PUT and DELETE.

// I use the term HTTP, but HTTPS is what should be used everywhere, therefore these examples use HTTPS instead of HTTP.
// Perform a GET Request

// const https = require('https')
// const options = {
//   hostname: 'flaviocopes.com',
//   port: 443,
//   path: '/todos',
//   method: 'GET'
// }

// const req = https.request(options, (res) => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', (d) => {
//     process.stdout.write(d)
//   })
// })

// req.on('error', (error) => {
//   console.error(error)
// })

// req.end()

// Perform a POST Request

// const https = require('https')

// const data = JSON.stringify({
//   todo: 'Buy the milk'
// })

// const options = {
//   hostname: 'flaviocopes.com',
//   port: 443,
//   path: '/todos',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Content-Length': data.length
//   }
// }

// const req = https.request(options, (res) => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', (d) => {
//     process.stdout.write(d)
//   })
// })

// req.on('error', (error) => {
//   console.error(error)
// })

// req.write(data)
// req.end()

// PUT and DELETE

// PUT and DELETE requests use the same POST request format, and just change the options.method value.