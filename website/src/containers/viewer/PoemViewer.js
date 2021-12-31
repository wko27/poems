import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from "react-router-dom";

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
    author,
    dedicatedTo,
    created,
    meter,
    type,
    context,
    links,
    content,
    annotations,
  } = poem;

  const allowEdit = creatorUserId === userId;

  return (
    <ViewPoemRenderer
      poemId={poemId}
      title={title}
      author={author}
      dedicatedTo={dedicatedTo}
      created={created}
      meter={meter}
      type={type}
      context={context}
      links={links}
      content={content}
      annotations={annotations}
      allowEdit={allowEdit}
    />
  );
};

export default PoemViewer;
