var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

/**
 * Check if a value is a Promise and, if it is,
 * return the `then` method of that promise.
 *
 * @param {Promise|Any} value
 * @return {Function|Null}
 */
function getThen(value) {
  var t = typeof value;
  if (value && (t === 'object' || t === 'function')) {
    var then = value.then;
    if (typeof then === 'function') {
      return then;
    }
  }
  return null;
}

/**
 * Take a potentially misbehaving resolve function and make sure
 * onFulfulled and onRejected are only called once.
 *
 * Makes no guarantess about asynchrony
 *
 * @param {Function} fn A resolve that may not be trusted
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 */
// doResolve(then.bind(result), resolve, reject)
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

function Promise () {
  var state = PENDING;
  var value = null;
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
  }

  // Note how `resolve` accepts either a promise or a plain value and if it's a promise, waits for it to complete. A promise must never be fulfilled with another promise, so it is this `resolve` function that we will expose, rather than the internal `fulfill`. We've used a couple of helper methods, so lets define those: getThen, doResolve
  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }
}
