import * as _ from 'lodash';

import * as db from 'db';

import {
  ALL_CODED_POEMS,
} from 'logic';

export const fetchPoem = async (poemId) => {
  if (poemId.startsWith("coded")) {
    return _.find(ALL_CODED_POEMS, poem => poem.poemId === poemId);
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
  
  return _.toPairs(poems).map(([poemId, userPoem]) => {
    return {
      poemId,
      ...userPoem,
    };
  });
}

export const createPoem = async (creatorUserId, creatorUsername, title='Untitled') => {
  const now = new Date().valueOf();

  const ref = await db.push(
    `Creating poem ${title} for user ${creatorUserId}`,
    db.paths().getPoems(),
    {
      creatorUsername,
      creatorUserId,
      title,
      created: now,
    }
  );

  const poemId = ref.key;

  await db.update(
    `Creating poem ${title} for user ${creatorUserId}`,
    db.paths().getUserPoems(creatorUserId),
    {
      [poemId]: {
        title,
        created: now,
      },
    }
  );

  return poemId;
}

export const updatePoemTitle = async (userId, poemId, title) => {
  await db.update(
    `Updating poem title for ${poemId}`,
    db.paths().getPoem(poemId),
    {
      title,
    }
  );

  await db.update(
    `Creating poem ${title} for user ${userId}`,
    db.paths().getUserPoem(userId, poemId),
    {
      title,
    }
  );
}
