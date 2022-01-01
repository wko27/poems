import * as _ from 'lodash';

import React, { useState, useCallback } from 'react';

import { useNavigate } from "react-router-dom";

import {
  Button,
  Link,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

import ConditionalTooltip from 'components/validation/ConditionalTooltip';
import ButtonControl from 'components/buttons/ButtonControl';
import HighlightedPoem from 'components/poem/HighlightedPoem';
import PoemSkeleton from 'components/viewer/PoemSkeleton';

import EditIcon from '@mui/icons-material/Edit';

import {
  PaperColumn,
} from 'styles';

const Info = (props) => {
  const {
    author,
    creatorUsername,
    created,
  } = props;

  const writtenBy = author || creatorUsername;

  return (
    <>
      <Typography variant='body1'>
        {`Author: ${writtenBy}`}
      </Typography>
      <Typography variant='body1'>
        {`Written: ${new Date(created).toLocaleDateString()}`}
      </Typography>
    </>
  );
};

const Details = (props) => {
  const {
    details,
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
    poemId,
    title,
    content,
    annotations = [],
    creatorUsername,
    author,
    created,
    details,
    context,
    links,
    allowEdit,
    disallowEditReason,
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

  const infoContainer = (
    <Info
      author={author}
      creatorUsername={creatorUsername}
      created={created}
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

  const handleEdit = () => navigate(`/poems/edit/${poemId}`);

  return (
    <>
      <ConditionalTooltip condition={!allowEdit} tooltipTitle={disallowEditReason}>
        <span>
          <Button
            startIcon={<EditIcon/>}
            onClick={handleEdit}
            disabled={!allowEdit}
          >
            Edit
          </Button>
        </span>
      </ConditionalTooltip>
      <PoemSkeleton
        title={titleContainer}
        info={infoContainer}
        details={detailsContainer}
        links={linksContainer}
        notes={notes}
        poem={poem}
      />
    </>
  );
};

export default ViewPoemRenderer;
