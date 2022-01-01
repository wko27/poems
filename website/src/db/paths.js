import { getDatabase, ref } from "firebase/database";

import {
  assertNonEmptyString,
} from 'utils';

const allPaths = {
  getUsers: () => {
    return ref(getDatabase(), 'users');
  },

  getUser: (userId) => {
    assertNonEmptyString(userId, 'User id must be set');
    return ref(getDatabase(), 'users/' + userId);
  },

  getProfile: (username) => {
    assertNonEmptyString(username, 'Username must be set');
    return ref(getDatabase(), 'profiles/' + username);
  },

  getPoems: () => {
    return ref(getDatabase(), 'poems');
  },

  getPoem: (poemId) => {
    assertNonEmptyString(poemId, 'Poem id must be set');
    return ref(getDatabase(), 'poems/' + poemId);
  },

  getUserPoems: (userId) => {
    assertNonEmptyString(userId, 'User id must be set');
    return ref(getDatabase(), 'users/' + userId + '/poems');
  },

  getUserPoem: (userId, poemId) => {
    assertNonEmptyString(userId, 'User id must be set');
    assertNonEmptyString(poemId, 'Poem id must be set');
    return ref(getDatabase(), 'users/' + userId + '/poems/' + poemId);
  },
};

export function paths() {
  return allPaths;
}
