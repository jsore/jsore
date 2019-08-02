/**
 * jsore/src/utils/inject-dependencies
 *
 * const injectDependencies = require('./utils/inject-dependencies.js');
 * ...
 * app.get('/', injectDependencies.intoHandlers(...));
 */

module.exports = {
  intoHandlers: function(handler, handlerToRouteMap, handlerToViewMap, page) {
    const router = handlerToRouteMap.get(handler);
    const currentView = handlerToViewMap.get(handler);
    // return (req, res, next) => { handler(req, res, next, router, currentView); };
    return (req, res, next) => { handler.handle(req, res, next, router, currentView, page); };
  }
};
