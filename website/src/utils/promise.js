import * as _ from 'lodash';

export async function waitAtMost(ms, action, promise) {
  return Promise.race([
    promise,
    waitThenReject(ms, action + ' took more than ' + ms + ' ms'),
  ]);
}

export async function waitThenReject(ms, msg) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(Error(msg));
    }, ms)
  );
}

export async function waitThenResolve(ms) {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}

/** Takes in an object of keys to promises and returns object of keys to results once complete */
export async function mapPromiseToResultValues(promiseMapping) {
  const keys = _.keys(promiseMapping);
  const promises = keys.map(key => promiseMapping[key]);
  const results = await Promise.all(promises);
  const withResults = keys.map((v, i) => [v, results[i]]);
  return _.fromPairs(withResults);
}
