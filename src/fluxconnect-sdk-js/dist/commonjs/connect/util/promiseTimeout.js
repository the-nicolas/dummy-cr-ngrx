'use strict';

exports.__esModule = true;

var promiseTimeout = function promiseTimeout(timeout, promise, err, callback) {

  var timeoutPr = new Promise(function (resolve, reject) {
    var id = setTimeout(function () {
      clearTimeout(id);
      if (callback) callback();
      reject(err ? err : new Error('timeout'));
    }, timeout);
  });

  return Promise.race([promise, timeoutPr]);
};

exports['default'] = promiseTimeout;
module.exports = exports['default'];