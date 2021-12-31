import * as _ from 'lodash';

import React, { useState, useCallback, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import ButtonControl from 'components/buttons/ButtonControl';
import HighlightedPoem from 'components/poem/HighlightedPoem';
import PoemSkeleton from 'components/viewer/PoemSkeleton';

import EditIcon from '@mui/icons-material/Edit';

import {
  PaperColumn,
} from 'styles';

const Context = (props) => {
  const {
    context,
  } = props;

  return (
    <Typography variant='body1'>
      {context}
    </Typography>
  );
}

const Details = (props) => {
  const {
    author,
    dedicatedTo,
    created,
    meter,
    type,
  } = props;

  return (
    <>
      <Typography variant='body1'>
        {`Author: ${author}`}
      </Typography>
      <Typography variant='body1'>
        {`Dedicated To: ${dedicatedTo}`}
      </Typography>
      <Typography variant='body1'>
        {`Written: ${created}`}
      </Typography>
      <Typography variant='body1'>
        {`Meter: ${meter}`}
      </Typography>
      <Typography variant='body1'>
        {`Type: ${type}`}
      </Typography>
    </>
  );
}

const Links = (props) => {
  const {
    links = [],
  } = props;

  if (_.isEmpty(links)) {
    return null;
  }

  return (
    <>
      {
        links.map((link, idx) => {
          const {
            title,
            url,
          } = link;
          
          return (
            <Link key={idx} href={url} target='_blank'>
              {title}
            </Link>
          );
        })
      }
    </>
  );
}

const ViewPoemRenderer = (props) => {
  const {
    poemId,
    title,
    content,
    annotations = [],
    author,
    dedicatedTo,
    created,
    meter,
    type,
    context,
    links,
    allowEdit,
  } = props;

  const navigate = useNavigate();

  const [selectedAnnotationIdx, setSelectedAnnotationIdx] = useState(-1);

  const selectedAnnotation = selectedAnnotationIdx === -1 ? null : annotations[selectedAnnotationIdx];

  const handleSelectAnnotation = async (annotationIdx) => {
    setSelectedAnnotationIdx(annotationIdx);
  }

  const setAnnotatedRef = useCallback(
    (node) => {
      if (!node) {
        return;
      }
      
      node.scrollIntoView({});
    },
    []
  );

  const details = (
    <Details
      author={author}
      dedicatedTo={dedicatedTo}
      created={created}
      meter={meter}
      type={type}
    />
  );

  const contextContainer = (
    <Context context={context} />
  );

  const linksContainer = (
    <Links links={links} />
  );

  const titleContainer = (
    <Typography variant='h2'>
      {title}
    </Typography>
  );

  const poem = (
    <HighlightedPoem
      content={content}
      selectedAnnotation={selectedAnnotation}
      setAnnotatedRef={setAnnotatedRef}
      annotations={annotations}
      onSelectAnnotations={(selectedAnnotations) => {
        if (selectedAnnotations == null) {
          return;
        }
        const first = selectedAnnotations[0];
        const annotationIdx = annotations.indexOf(first);

        if (annotationIdx === -1) {
          console.warn(`Invalid selected annotation ${first}`);
          return;
        }

        console.log(`Selected annotation at idx ${annotationIdx}`);
        handleSelectAnnotation(annotationIdx);
      }}
    />
  );

  const notes = (
    <>
      <ButtonControl
        onForward={() => setSelectedAnnotationIdx(selectedAnnotationIdx + 1)}
        disableForward={selectedAnnotationIdx >= annotations.length - 1}
        onBack={() => setSelectedAnnotationIdx(selectedAnnotationIdx - 1)}
        disableBack={selectedAnnotationIdx < 0}
      />
      {
        selectedAnnotation != null && (
          <PaperColumn variant='outlined' sx={{ p: 1 }}>
            <Typography variant='body1'>
              {selectedAnnotation.explanation}
            </Typography>
          </PaperColumn>
        )
      }
    </>
  );

  const handleEdit = () => navigate(`/poems/edit/${poemId}`);

  return (
    <>
      {
        allowEdit && (
          <Button
            startIcon={<EditIcon/>}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )
      }
      <PoemSkeleton
        title={titleContainer}
        details={details}
        context={contextContainer}
        links={linksContainer}
        notes={notes}
        poem={poem}
      />
    </>
  );
};

export default ViewPoemRenderer;
