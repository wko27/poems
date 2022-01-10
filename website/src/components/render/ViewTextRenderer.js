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

import InfoContainer from './InfoContainer';
import TitleContainer from './TitleContainer';

import ButtonControl from 'components/buttons/ButtonControl';
import TextView from 'components/viewer/TextView';
import ViewSkeleton from 'components/viewer/ViewSkeleton';

import {
  PaperColumn,
} from 'styles';

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

const ViewTextRenderer = (props) => {
  const {
    poem: {
      creatorUsername,
      createdDate,
      author,
      authoredDate,
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
    <InfoContainer
      creatorUsername={creatorUsername}
      createdDate={createdDate}
      author={author}
      authoredDate={authoredDate}
    />
  );

  const detailsContainer = _.isEmpty(details) ? null : (
    <Details
      details={details}
    />
  )

  const linksContainer = _.isEmpty(links) ? null : (
    <Links links={links} />
  );

  const titleContainer = (
    <TitleContainer
      title={title}
      titleFontSize={titleFontSize}
    />
  );

  const contentContainer = (
    <TextView
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

  const annotationsContainer = (
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
    <ViewSkeleton
      title={titleContainer}
      info={infoContainer}
      details={detailsContainer}
      links={linksContainer}
      annotations={annotationsContainer}
      content={contentContainer}
    />
  );
};

export default ViewTextRenderer;
