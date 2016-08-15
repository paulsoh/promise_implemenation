var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;


function Promise () {
  var state = PENDING;
  var value = null;
  var handlers = [];
}
