import * as _ from 'lodash';

import React, { useState, useEffect, useRef } from 'react';

import { useNavigate } from "react-router-dom";

import styled from '@emotion/styled';

import {
  Button,
  IconButton,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import ButtonControl from 'components/buttons/ButtonControl';
import HighlightedPoem from 'components/poem/HighlightedPoem';
import PoemSkeleton from 'components/viewer/PoemSkeleton';

import ViewIcon from '@mui/icons-material/Search';

import {
  MaxWidthDivRow,
  PaperColumn,
  TYPOGRAPHY_H1,
} from 'styles';

const MAX_TITLE_FONT_REM = 4;
const DEFAULT_TITLE_WIDTH_REM = 12 * MAX_TITLE_FONT_REM;
const MAX_TITLE_VIEW_WIDTH = 33;

const TitleFiller = styled.div`
  /*width: 100%;*/
  /*flex-grow: 1;*/
`

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

function textComputedWidth(text, fontSizeRem) {
  return (text.length + 1) * (fontSizeRem * 0.5) + 32;
}

function textFontFits(text, fontSizeRem, maxViewWidthProportion) {
  const bodyFontSize = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'));
  const viewWidthPx = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

  const computedWidthRem = textComputedWidth(text, fontSizeRem);
  const computedWidthPx = computedWidthRem * bodyFontSize;

  console.log(fontSizeRem, computedWidthRem, computedWidthPx, maxViewWidthProportion * viewWidthPx / 100);

  return computedWidthPx < maxViewWidthProportion * viewWidthPx / 100;
}

const EditPoemRenderer = (props) => {
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
  } = props;

  const navigate = useNavigate();
  
  const titleRef = useRef(null);
  const titleContainerRef = useRef(null);
  const [newTitle, setTitle] = useState(title);
  const [titleInputFontSize, setTitleInputFontSize] = useState(MAX_TITLE_FONT_REM);
  const [titleInputWidth, setTitleInputWidth] = useState(textComputedWidth(newTitle, titleInputFontSize));
 
  useEffect(() => {
    if (!titleRef.current || !titleContainerRef.current) {
      return;
    }

    const proportion = titleRef.current.offsetWidth / titleContainerRef.current.offsetWidth;

    console.log(proportion);

    const smallerFontFits = textFontFits(newTitle, titleInputFontSize - 1, MAX_TITLE_VIEW_WIDTH);
    const currentFontFits = textFontFits(newTitle, titleInputFontSize, MAX_TITLE_VIEW_WIDTH);
    const largerFontFits = textFontFits(newTitle, titleInputFontSize + 1, MAX_TITLE_VIEW_WIDTH);

    console.log(
      smallerFontFits,
      currentFontFits,
      largerFontFits
    );

//     if (!currentFontFits && smallerFontFits && titleInputFontSize > 1) {
//       setTitleInputFontSize(titleInputFontSize - 0.1);
//       return;
//     }
// 
//     if (largerFontFits && titleInputFontSize < MAX_TITLE_FONT_REM) {
//       setTitleInputFontSize(titleInputFontSize + 0.1);
//       return;
//     }

    const computedWidthRem = textComputedWidth(newTitle, titleInputFontSize);
    console.log(computedWidthRem);

    setTitleInputWidth(Math.min(computedWidthRem, DEFAULT_TITLE_WIDTH_REM));
  }, [newTitle, titleInputFontSize, titleRef, titleContainerRef]);

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

  const titleProps = {
    width: `100%`,
    // maxWidth: `${MAX_TITLE_VIEW_WIDTH}vw`,
    fontSize: `${titleInputFontSize}rem`,
    textAlign: 'center',
  };

  const titleContainer = (
    <MaxWidthDivRow ref={titleContainerRef}>
      <TextField
        ref={titleRef}
        id="title"
        type="text"
        fullWidth
        required
        defaultValue={newTitle}
        onChange={event => setTitle(event.target.value)}
        inputProps={{ style: titleProps }}
        InputLabelProps={{ style: titleProps }}
      />
    </MaxWidthDivRow>
  );

  const handleSelectText = (selection) => {
    const {
      lineIdx,
      selectionStartIdx,
      selectionEndIdx,
      selectedText,
    } = selection;
    
    console.log(`Selected Line ${lineIdx} - Offset (${selectionStartIdx}, ${selectionEndIdx}): '${selectedText}'`);
  }

  const poem = (
    <HighlightedPoem
      content={content}
      onSelectText={handleSelectText}
      annotations={[]}
    />
  );

  const handleView = () => navigate(`/poems/view/${poemId}`);

  return (
    <>
      <Button
        startIcon={<ViewIcon/>}
        onClick={handleView}
      >
        View
      </Button>
      <PoemSkeleton
        title={titleContainer}
        details={details}
        context={contextContainer}
        links={linksContainer}
        poem={poem}
      />
    </>
  );
};

export default EditPoemRenderer;
