/**
 * jsore/src/content-scripts/page-not-found/redirectToHome.js
 */

// document.addEventListener('DOMContentLoaded', (event) => {
//   const timer = document.getElementById(redirect-timer);
//   window.location.replace("https://jsore.com");
// });



module.exports = {
  afterInterval: function() {
    // return window.location.replace('https://jsore.com');
    return res.redirect('/');
  }
};

// t1 = window.setTimeout(function(){
//   window.location = "http://www.yoururl.com";
// },3000);

// res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    // return res.end('Redirecting to HTTPS...');
