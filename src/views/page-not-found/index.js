/**
 * jsore/src/views/page-not-found/index.js - generates the
 * view the client is requesting
 */

const generatePartials = require('../view-template.js');

/** content script 1 - load a countdown timer and redirect */
const redirectTimer = (req, res, dom, window, document) => {

  let seconds = 10;

  /**
   * insert a script that can run in the browser DOM in the
   * background while Node continues processing stuff
   */
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
      process.stdout.write(`${s} `);
      s--;
      if (s < 1) {
        clearInterval(counter);
        process.stdout.write('Redirecting...' + '\n');
      }
    }, 1000);
    window.addEventListener('popstate', handler, false);
    function handler() {
      clearInterval(counter);
      process.stdout.write('Redirecting...' + '\n');
    }
  };
  nodeCounter(seconds);
};


module.exports = (req, res) => {
  const dir = __dirname;
  const view = generatePartials.buildDom(dir);
  console.log('notfoundview.exports()');
  generatePartials.scriptAPI(req, res, view, redirectTimer);
  return view.serialize();
};
