import React, { useState, useEffect } from 'react';

import PoemRenderer from './PoemRenderer';

import {
  fetchPoem,
} from 'features/poemSlice';

const PoemViewer = (props) => {
  const {
    poemId,
  } = props;

  const [poem, setPoem] = useState(null);

  const loadPoem = () => {
    async function loadPoemAsync() {
      const fetchedPoem = await fetchPoem(poemId);
      setPoem(fetchedPoem);
    };
    loadPoemAsync();
  };

  useEffect(loadPoem, [poemId]);

  if (poem === null) {
    return "Loading ...";
  }

  const {
    title,
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

  return (
    <PoemRenderer
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
    />
  );
};

export default PoemViewer;
