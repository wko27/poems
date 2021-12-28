/**
 * Wraps normal Firebase reference operations with a timeout that throws an error with a useful message
 */

import { get, update as firebaseUpdate, remove as firebaseRemove, set } from "firebase/database";

import { waitAtMost, assertNotNull } from 'utils';

const DEFAULT_TIMEOUT = 180000;

export function read(action, ref, timeout = DEFAULT_TIMEOUT) {
  assertNotNull(ref, 'Expected a ref to read');
  const start = Date.now();
  return waitAtMost(
    timeout,
    action,
    get(ref).then(value => {
      const elapsed = Date.now() - start;
      console.log(action + ' took ' + elapsed + ' ms');
      return value;
    })
  );
}

/** Delete is a keyword in Javascript, so they named it remove ... */
export function remove(action, ref, timeout = DEFAULT_TIMEOUT) {
  assertNotNull(ref, 'Expected a ref to remove');
  const start = Date.now();
  return waitAtMost(
    timeout,
    action,
    firebaseRemove(ref).then(value => {
      const elapsed = Date.now() - start;
      console.log(action + ' took ' + elapsed + ' ms');
      return value;
    })
  );
}

export function write(action, ref, value, timeout = DEFAULT_TIMEOUT) {
  assertNotNull(ref, 'Expected a ref to write');
  const start = Date.now();
  return waitAtMost(
    timeout,
    action,
    set(ref, value).then(value => {
      const elapsed = Date.now() - start;
      console.log(action + ' took ' + elapsed + ' ms');
      return value;
    })
  );
}

export function update(action, ref, value, timeout = DEFAULT_TIMEOUT) {
  assertNotNull(ref, 'Expected a ref to update');
  const start = Date.now();
  return waitAtMost(
    timeout,
    action,
    firebaseUpdate(ref, value).then(value => {
      const elapsed = Date.now() - start;
      console.log(action + ' took ' + elapsed + ' ms');
      return value;
    })
  );
}

export function push(action, ref, value, timeout = DEFAULT_TIMEOUT) {
  assertNotNull(ref, 'Expected a ref to push');
  const start = Date.now();
  return waitAtMost(
    timeout,
    action,
    ref.push(value).then(value => {
      const elapsed = Date.now() - start;
      console.log(action + ' took ' + elapsed + ' ms');
      return value;
    })
  );
}
