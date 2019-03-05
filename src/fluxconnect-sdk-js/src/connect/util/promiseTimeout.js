/**
 * Create a promise that rejects in <timeout> milliseconds with err when defined
 */
let promiseTimeout = function(timeout, promise, err, callback) {

  let timeoutPr = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      if (callback) callback();
      reject(err ? err : new Error('timeout'));
    }, timeout);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeoutPr
  ]);
};

export default promiseTimeout;
