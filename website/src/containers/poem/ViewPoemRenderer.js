import * as _ from 'lodash';

import React, { useState, useCallback } from 'react';

import {
  Link,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

import ButtonControl from 'components/buttons/ButtonControl';
import HighlightedPoem from 'components/poem/HighlightedPoem';
import PoemSkeleton from 'components/viewer/PoemSkeleton';

import {
  PaperColumn,
} from 'styles';

const Info = (props) => {
  const {
    creatorUsername,
    created,
    author,
    published,
  } = props;

  const authored = (author == null)
    ? `Creator: ${creatorUsername}`
    : `Author: ${author}`;

  const written = (published == null)
    ? `Published: ${new Date(published).toLocaleDateString()}`
    : `Created: ${new Date(created).toLocaleDateString()}`

  return (
    <>
      <Typography variant='body1'>
        {authored}
      </Typography>
      <Typography variant='body1'>
        {written}
      </Typography>
    </>
  );
};

const Details = (props) => {
  const {
    details = [],
  } = props;

  return (
    <Table>
      <TableBody>
        {
          details.map(([key, value]) => {
            return (
              <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align='center'>{key}</TableCell>
                <TableCell align='center'>{value}</TableCell>
              </TableRow>
            );
          })
        }
      </TableBody>
    </Table>
  );
};

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
    poem: {
      creatorUsername,
      created,
      author,
      published,
      title,
      titleFontSize,
      content,
      details,
      context,
      annotations,
      links,
    },
  } = props;

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

  const infoContainer = (
    <Info
      creatorUsername={creatorUsername}
      created={created}
      author={author}
      published={published}
    />
  );

  const detailsContainer = (
    <Details
      details={details}
    />
  )

  const linksContainer = (
    <Links links={links} />
  );

  const titleContainer = (
    <Typography
      variant='h2'
      sx={{ fontSize: `${titleFontSize}rem` }}
    >
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
      {
        !_.isEmpty(annotations) && (
          <ButtonControl
            onForward={() => setSelectedAnnotationIdx(selectedAnnotationIdx + 1)}
            disableForward={selectedAnnotationIdx >= annotations.length - 1}
            onBack={() => setSelectedAnnotationIdx(selectedAnnotationIdx - 1)}
            disableBack={selectedAnnotationIdx < 0}
          />
        )
      }
      {
        <PaperColumn variant='outlined' sx={{ p: 1, m: 2 }}>
          <Typography variant='body1'>
            {selectedAnnotation == null ? context : selectedAnnotation.explanation}
          </Typography>
        </PaperColumn>
      }
    </>
  );

  return (
    <PoemSkeleton
      title={titleContainer}
      info={infoContainer}
      details={detailsContainer}
      links={linksContainer}
      notes={notes}
      poem={poem}
    />
  );
};

export default ViewPoemRenderer;
