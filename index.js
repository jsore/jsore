/**
 * jsore/index.js
 */

// console.log('init');

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const fs = require('fs');
// const path = require('path');


const app = express();
app.use(morgan('dev'));

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

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`jsore running on port ${port}`);
});
