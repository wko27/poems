import * as _ from 'lodash';

import * as db from 'db';

import {
  ALL_CODED_POEMS,
} from 'logic';

const ALL_CODED_POEMS_BY_ID = _.keyBy(ALL_CODED_POEMS, (poem) => poem.poemId);

export const fetchPoem = async (poemId) => {
  if (ALL_CODED_POEMS_BY_ID.hasOwnProperty(poemId)) {
    return ALL_CODED_POEMS_BY_ID[poemId];
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
      createdDate: now,
      title,
    }
  );

  const poemId = ref.key;

  await db.update(
    `Creating poem ${title} for user ${creatorUserId}`,
    db.paths().getUserPoems(creatorUserId),
    {
      [poemId]: {
        createdDate: now,
        title,
      },
    }
  );

  return poemId;
}

export const updatePoemTitle = async (userId, poemId, title, titleFontSize) => {
  await db.update(
    `Updating poem title for ${poemId}`,
    db.paths().getPoem(poemId),
    {
      title,
      titleFontSize,
    }
  );

  await db.update(
    `Updating poem title for user ${userId}, poem ${poemId}`,
    db.paths().getUserPoem(userId, poemId),
    {
      title,
    }
  );
}

export const updatePoemInfo = async (userId, poemId, author, authoredDate) => {
  // Remove undefined values
  const update = _.pickBy({
    author,
    authoredDate,
  });

  await db.update(
    `Updating poem info for ${poemId}`,
    db.paths().getPoem(poemId),
    update,
  );
}

export const updatePoemDetails = async (userId, poemId, details) => {
  await db.update(
    `Updating poem details for ${poemId}`,
    db.paths().getPoem(poemId),
    {
      details,
    }
  );
}

export const updatePoemLinks = async (userId, poemId, links) => {
  await db.update(
    `Updating poem links for ${poemId}`,
    db.paths().getPoem(poemId),
    {
      links,
    }
  );
}

export const updatePoemContent = async (userId, poemId, content) => {
  await db.update(
    `Updating poem content for ${poemId}`,
    db.paths().getPoem(poemId),
    {
      content,
    }
  );
}

export const updatePoemAnnotations = async (userId, poemId, annotations) => {
  await db.update(
    `Updating poem annotations for ${poemId}`,
    db.paths().getPoem(poemId),
    {
      annotations,
    }
  );
}
