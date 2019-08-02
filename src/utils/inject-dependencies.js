/**
 * jsore/src/utils/inject-dependencies
 *
 * const injectDependencies = require('./utils/inject-dependencies.js');
 * ...
 * app.get('/', injectDependencies.intoHandlers(...));
 */

module.exports = {
  dependencies: function(handler, handlerToRouteMap, handlerToViewMap, page, underMaintenance) {
    const router = handlerToRouteMap.get(handler);
    const currentView = handlerToViewMap.get(handler);
    return (req, res, next) => { handler.handle(req, res, next, router, currentView, page); };
  }
};
