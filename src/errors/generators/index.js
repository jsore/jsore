/**
 * jsore/src/errors/generators/index.js
 */



// module.exports = ViewError;
module.exports = {
  msg: function(text) {
    class ViewError extends Error {
    constructor(...params) {
      super(...params);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ViewError);
      }
    }
  }
    return new ViewError(text);
  }
};
