import * as _ from 'lodash';

import React, { useState, useEffect } from 'react';

import { useParams } from "react-router-dom";

import { useSelector } from 'react-redux';

import ViewPoemRenderer from './ViewPoemRenderer';

import BlockingProgressIndicator from 'components/progress/BlockingProgressIndicator';

import {
  fetchPoem,
} from 'features/poemSlice';

const PoemViewer = (props) => {
  const { poemId } = useParams();

  const [poem, setPoem] = useState(null);

  const loadPoem = () => {
    async function loadPoemAsync() {
      const fetchedPoem = await fetchPoem(poemId);
      setPoem(fetchedPoem);
    };
    loadPoemAsync();
  };

  useEffect(loadPoem, [poemId]);

  const userId = useSelector((state) => state.user.userId);

  if (poem === null) {
    return (<BlockingProgressIndicator/>);
  }

  const {
    title,
    creatorUserId,
    creatorUsername,
    author,
    created,
    details,
    context,
    links,
    content,
    annotations,
    flags: {
      canEdit,
    } = {},
    allowedEditors,
  } = poem;

  let allowEdit = canEdit;
  let disallowEditReason = undefined;

  if (!allowEdit) {
    disallowEditReason = `This poem can not be edited`;
  } else if (creatorUserId !== userId && !_.includes(allowedEditors || [], userId)) {
    allowEdit = false;
    disallowEditReason = `You do not have edit permissions, please ask the creator for access`;
  }

  return (
    <ViewPoemRenderer
      poemId={poemId}
      title={title}
      creatorUsername={creatorUsername}
      author={author}
      created={created}
      details={details}
      context={context}
      links={links}
      content={content}
      annotations={annotations}
      allowEdit={allowEdit}
      disallowEditReason={disallowEditReason}
    />
  );
};

export default PoemViewer;
