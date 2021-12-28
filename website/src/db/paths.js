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

  getPoems: () => {
    return ref(getDatabase(), 'poems');
  },

  getUserPoems: (userId) => {
    assertNonEmptyString(userId, 'User id must be set');
    return ref(getDatabase(), 'users/' + userId + '/poems');
  },
};

export function paths() {
  return allPaths;
}
