import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from "react-router-dom";

import EditPoemRenderer from './EditPoemRenderer';

import BlockingProgressIndicator from 'components/progress/BlockingProgressIndicator';

import {
  fetchPoem,
  updatePoemTitle,
} from 'features/poemSlice';

const PoemEditor = (props) => {
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

  if (poem === null) {
    return (<BlockingProgressIndicator/>);
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
    <EditPoemRenderer
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

export default PoemEditor;
