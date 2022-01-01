import React, { useState, useEffect } from 'react';

import ViewPoemRenderer from './ViewPoemRenderer';

import BlockingProgressIndicator from 'components/progress/BlockingProgressIndicator';

import {
  fetchPoem,
} from 'features/poemSlice';

const PoemViewer = (props) => {
  const { poemId } = props;

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

  return (
    <ViewPoemRenderer
      poem={poem}
    />
  );
};

export default PoemViewer;
