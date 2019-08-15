/**
 * jsore/src/views/page-not-found/index.js - generates the
 * view the client is requesting
 */

const generatePartials = require('../view-template.js');

/**
 * content script 1 - load a countdown timer and redirect
 *
 * insert a script that can run in the browser DOM in the
 * background while Node continues processing stuff
 *
 * all this does is start a timer, beginning at 10, then
 * ticking down 1 int every second, finally redirecting
 * the client to the homepage and triggering a listener to
 * halt another timer running parallel, printing to STDOUT
 */
const redirectTimer = (req, res, dom, window, document) => {
  let seconds = 10;
  const timerScript = document.createElement('script');
  timerScript.innerHTML = `
    function countdown(seconds) {
      let timerElm = document.getElementById('redirect-timer');
      timerElm.innerHTML = seconds;
      const interval = setInterval(() => {
        timerElm.innerHTML = --seconds;
        if (seconds < 1) {
          clearInterval(interval);
          timerElm.innerHTML = 'Now';
          window.location.assign('${process.env.HOST}');
          window.dispatchEvent(new Event('popstate'));
        }
      }, 1000);
    };
    countdown(${seconds});
  `;
  document.body.appendChild(timerScript);

  /**
   * set a counter independent from the DOM script to take
   * advantage of process.stdout piping on a single line
   *
   * this could probably be done better
   */
  const nodeCounter = (s) => {
    const counter = setInterval(() => {
      process.stdout.write(`  Page Not Found, redirecting in... ${s} \r`);
      s--;
      if (s < 1) {
        /** this redirects after the default Node countdown */
        clearInterval(counter);
        process.stdout.write(`\n  Now\n`);
      }
    }, 1000);
    // window.addEventListener('popstate', handler, false);
    /** this redirects if page is refreshed during load... */
    window.addEventListener('change', handler);
    function handler() {
      /** ...otherwise the counter just keeps tickin along */
      clearInterval(counter);
      process.stdout.write(`\n  Now\n`);
      dom.window.location.assign(process.env.HOST);
    }
  };
  nodeCounter(seconds);
};


/**
 * hooks into the view to grab HTML/CSS assets, injects any
 * content scripts I want running on the page onload then
 * return serialized HTML to Express to serve to the client
 */
module.exports = (req, res) => {
  const dir = __dirname;
  const view = generatePartials.buildDom(dir);
  // console.log('notfoundview.exports()');
  generatePartials.scriptAPI(req, res, view, redirectTimer);
  return view.serialize();
};
