import * as _ from 'lodash';

import React, { useState, useEffect, useRef } from 'react';

import styled from '@emotion/styled';

import {
  Button,
  ClickAwayListener,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from '@mui/material';

import AddDetailDialog from 'components/dialogs/AddDetailDialog';
import ButtonControl from 'components/buttons/ButtonControl';
import TextView from 'components/viewer/TextView';
import ViewSkeleton from 'components/viewer/ViewSkeleton';

import DeleteIcon from '@mui/icons-material/Delete';

import {
  MaxWidthDivRow,
  PaperColumn,
  TYPOGRAPHY_H1,
} from 'styles';

const MAX_TITLE_FONT_REM = 4;
const MAX_TITLE_VIEW_WIDTH = 70;

const DEBUG_TITLE_EDITOR = false;

function textComputedWidth(text, fontSizeRem) {
  return (text.length + 1) * (fontSizeRem);
}

function textFontFits(text, fontSizeRem, maxViewWidthProportion) {
  const bodyFontSize = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'));
  const viewWidthPx = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

  const computedWidthRem = textComputedWidth(text, fontSizeRem);
  const computedWidthPx = computedWidthRem * bodyFontSize;

  if (DEBUG_TITLE_EDITOR) {
    console.log(fontSizeRem, computedWidthRem, computedWidthPx, maxViewWidthProportion * viewWidthPx / 100);
  }

  return computedWidthPx < maxViewWidthProportion * viewWidthPx / 100;
}

const TitleEditor = (props) => {
  const {
    title,
    titleFontSize,
    onSave,
  } = props;

  const [editedTitle, setEditedTitle] = useState(title);
  const [titleInputFontSize, setTitleInputFontSize] = useState(titleFontSize);
 
  useEffect(() => {
    const smallerFontFits = textFontFits(editedTitle, titleInputFontSize - 1, MAX_TITLE_VIEW_WIDTH);
    const currentFontFits = textFontFits(editedTitle, titleInputFontSize, MAX_TITLE_VIEW_WIDTH);
    const largerFontFits = textFontFits(editedTitle, titleInputFontSize + 1, MAX_TITLE_VIEW_WIDTH);

    if (DEBUG_TITLE_EDITOR) {
      console.log(
        smallerFontFits,
        currentFontFits,
        largerFontFits
      );
    }

    if (!currentFontFits && smallerFontFits && titleInputFontSize > 1) {
      setTitleInputFontSize(titleInputFontSize - 0.1);
      return;
    }

    if (largerFontFits && titleInputFontSize < MAX_TITLE_FONT_REM) {
      setTitleInputFontSize(titleInputFontSize + 0.1);
      return;
    }
  }, [editedTitle, titleInputFontSize]);

  const titleProps = {
    width: `100%`,
    fontSize: `${titleInputFontSize}rem`,
    textAlign: 'center',
  };

  const handleChange = (event) => {
    const newTitle = event.target.value;
    setEditedTitle(newTitle);
  };

  const handleSave = () => {
    onSave(editedTitle, titleInputFontSize);
  };

  return (
    <ClickAwayListener onClickAway={handleSave}>
      <MaxWidthDivRow>
        <TextField
          id="title"
          type="text"
          fullWidth
          required
          defaultValue={editedTitle}
          onChange={handleChange}
          inputProps={{ style: titleProps }}
          InputLabelProps={{ style: titleProps }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleSave();
            }
          }}
        />
      </MaxWidthDivRow>
    </ClickAwayListener>
  );
};

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
    details = [],
    addDetail,
    removeDetail,
  } = props;

  const [dialog, setDialog] = useState();

  const handleAddDetail = () => {
    setDialog(
      <AddDetailDialog
        details={details}
        onAdd={(key, value) => {
          addDetail(key, value);
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
      />
    );
  };

  return (
    <>
      {
        !_.isEmpty(details) && (
          <Table>
            <TableBody>
              {
                details.map(([key, value]) => {
                  return (
                    <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='center'>{key}</TableCell>
                      <TableCell align='center'>{value}</TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={() => removeDetail(key)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        )
      }
      <Button
        onClick={handleAddDetail}
      >
        Add Detail
      </Button>
      {dialog}
    </>
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

const EditPoemRenderer = (props) => {
  const {
    poem: {
      creatorUsername,
      created,
      author,
      published,
      title,
      titleFontSize,
      content,
      details = [],
      context,
      annotations,
      links,
    },
    onUpdateTitle,
    onUpdateDetails,
  } = props;
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const titleContainer = !isEditingTitle
    ? (
      <Typography
        variant='h2'
        sx={{ fontSize: `${titleFontSize}rem` }}
        onClick={() => setIsEditingTitle(true)}
      >
        {title}
      </Typography>
    )
    : (
      <TitleEditor
        title={title}
        titleFontSize={titleFontSize}
        onSave={(updatedTitle, updatedTitleFontSize) => {
          if (updatedTitle !== title || updatedTitleFontSize !== titleFontSize) {
            onUpdateTitle(updatedTitle, updatedTitleFontSize);
          }
          setIsEditingTitle(false);
        }}
      />
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
      addDetail={(key, value) => onUpdateDetails([
        ...details,
        [key, value],
      ])}
      removeDetail={(key) => {
        const copy = [...details.filter((detail) => !detail[0] === key)];
        onUpdateDetails(copy);
      }}
    />
  );

  const linksContainer = (
    <Links links={links} />
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

  const notes = null;

  const contentContainer = (
    <TextView
      content={content}
      onSelectText={handleSelectText}
      annotations={[]}
    />
  );

  return (
    <ViewSkeleton
      title={titleContainer}
      info={infoContainer}
      details={detailsContainer}
      links={linksContainer}
      notes={notes}
      content={contentContainer}
    />
  );
};

export default EditPoemRenderer;
