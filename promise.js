var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;


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
}
