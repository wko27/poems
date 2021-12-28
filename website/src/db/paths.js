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
};

export function paths() {
  return allPaths;
}
