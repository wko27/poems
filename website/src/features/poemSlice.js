import * as _ from 'lodash';

import * as db from 'db';

import {
  testPoem,
} from '../poems';

export const fetchPoem = async (poemId) => {

  if (true) {
    return testPoem;
  }

  const poemSnapshot = await db.read(
    `Loading poem ${poemId}`,
    db.paths().getPoem(poemId)
  );

  return poemSnapshot.val();
}

export const fetchUserPoems = async (userId) => {
  const userPoemsSnapshot = await db.read(
    `Loading user poems ${userId}`,
    db.paths().getUserPoems(userId)
  );

  const poems = userPoemsSnapshot.val();

  return _.toPairs(poems, (poemId, userPoem) => {
    return {
      poemId,
      userPoem,
    };
  });
}

export const createPoem = async (userId, title) => {
  const now = new Date().valueOf();

  const ref = await db.push(
    `Creating poem ${title} for user ${userId}`,
    db.paths().getAllPoems(),
    {
      userId,
      title,
      created: now,
    }
  );

  const poemId = ref.getKey();

  await db.update(
    `Creating poem ${title} for user ${userId}`,
    db.paths().getUserPoems(userId),
    {
      poemId: {
        title,
        created: now,
      },
    }
  );

  return poemId;
}
