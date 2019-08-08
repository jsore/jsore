/**
 * jsore/src/views/view-template.js
 */

const fs = require('fs');

/** get my universal partials */
const header = require('./header')();
const footer = require('./footer')();

/** init headless browser to mimic browser DOM interactions */
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
  buildDom: function(view) {
    /**
     * grab the requesting view's HTML and prepend/append the
     * universal header/footer
     */
    const page = fs.readFileSync(`${view}/index.html`);
    const sources = header + page + footer;

    /**
     * set up a JSDOM virtual console and forward output to
     * local Node.js console and suppress jsdomError events
     *
     * example:
     *
     *   - subresource parsing or loading errors
     *   - script execution errors, handle these explicitly
     *     when required with window.onerror event handler
     *   - errors resulting from JSDOM not implementing methods
     *     normally available to browsers like window.alert()
     *
     * this is the reason the call to window.location.assign()
     * in page-not-found.redirectTimer.timerScript was erroring
     *
     * https://github.com/jsdom/jsdom#virtual-consoles
     */
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console, { omitJSDOMErrors: true });
    /**
     * create the JSDOM environment and send that instance
     * back to the current view
     */
    const dom = new JSDOM(sources, {
      resources: "usable",
      runScripts: "dangerously",
      virtualConsole
    });
    return dom;
  },

  /**
   * higher order function for managing running the JSDOM
   * through all of the content scripts this view requires
   */
  scriptAPI: function(req, res, view, ...params) {
    const window = view.window;
    const document = view.window.document;
    params.map((func) => {
      return func(req, res, view, window, document);
    });
  }
};
