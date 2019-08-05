/**
 * jsore/src/utils/inject-dependencies - takes all the deps
 * for a specific route and loads them into the pre-route
 * handler specific to a view
 */

module.exports = {
  dependencies: function(handler, handlerToRouteMap, handlerToViewMap, page) {
    const router = handlerToRouteMap.get(handler);
    const currentView = handlerToViewMap.get(handler);
    return (req, res, next) => { handler.handle(req, res, next, router, currentView, page); };
  }
};
