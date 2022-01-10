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
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';

import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import AddDetailDialog from 'components/dialogs/AddDetailDialog';
import AddLinkDialog from 'components/dialogs/AddLinkDialog';
import ButtonControl from 'components/buttons/ButtonControl';
import TextView from 'components/viewer/TextView';
import ViewSkeleton from 'components/viewer/ViewSkeleton';

import DeleteIcon from '@mui/icons-material/Delete';
import AnnotateIcon from '@mui/icons-material/BorderColor';

import {
  MaxWidthDivRow,
  PaperColumn,
  createTypographyTextareaAutosize,
} from 'styles';

import {
  truncate,
} from 'utils';

const MAX_TITLE_FONT_REM = 4;
const MAX_TITLE_VIEW_WIDTH = 70;

const DEFAULT_CONTENT_FONT_REM = 1.25;

const DEBUG_TITLE_EDITOR = false;

const EXPLANATION_TRUNCATE_LENGTH = 30;

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

const ContentTextareaAutosize = createTypographyTextareaAutosize('h6');

const AnnotationExplanationTextareaAutosize = createTypographyTextareaAutosize('body1');

const ContentEditor = (props) => {
  const {
    content,
    onSave,
  } = props;

  const [editedContent, setEditedContent] = useState(content);

  const handleChange = (event) => setEditedContent(event.target.value);

  const handleSave = () => onSave(editedContent);

  return (
    <ClickAwayListener onClickAway={handleSave}>
      <ContentTextareaAutosize
        aria-label="content"
        minRows={10}
        value={editedContent}
        onChange={handleChange}
      />
    </ClickAwayListener>
  );
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

  const handleChange = (event) => setEditedTitle(event.target.value);

  const handleSave = () => onSave(editedTitle, titleInputFontSize);

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

  const handleDeleteDetail = (key) => {
    setDialog(
      <ConfirmDialog
        title="Delete Detail"
        content="Confirm?"
        onConfirm={() => {
          removeDetail(key)
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
        autoFocus
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
                        <IconButton onClick={() => handleDeleteDetail(key)}>
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
    addLink,
    removeLink,
  } = props;

  const [dialog, setDialog] = useState();

  const handleAddLink = () => {
    setDialog(
      <AddLinkDialog
        onAdd={(title, url) => {
          addLink(title, url);
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
      />
    );
  };

  const handleDeleteLink = (linkIdx) => {
    setDialog(
      <ConfirmDialog
        title="Delete Link"
        content="Confirm?"
        onConfirm={() => {
          removeLink(linkIdx);
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
        autoFocus
      />
    );
  };

  return (
    <>
      {
        !_.isEmpty(links) && (
          <Table>
            <TableBody>
              {
                links.map((link, idx) => {
                  const {
                    title,
                    url,
                  } = link;
                  
                  return (
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='center'>
                        <Link key={idx} href={url} target='_blank'>
                          {title}
                        </Link>
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={() => handleDeleteLink(idx)}>
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
        onClick={handleAddLink}
      >
        Add Link
      </Button>
      {dialog}
    </>
  );
};

const AnnotationsContainer = (props) => {
  const {
    annotations = [],
    selectedAnnotationIdx,
    annotating,
    setAnnotating,
    addAnnotation,
    removeAnnotation,
    saveAnnotationExplanation,
    selectAnnotationIdx,
  } = props;
  
  const selectedAnnotationExplanation = selectedAnnotationIdx == null ? "" : annotations[selectedAnnotationIdx].explanation;

  const [dialog, setDialog] = useState();
  const [editedExplanation, setEditedExplanation] = useState(selectedAnnotationExplanation);

  const handleDeleteAnnotation = (annotationIdx) => {
    setDialog(
      <ConfirmDialog
        title="Delete Annotation"
        content="Confirm?"
        onConfirm={() => {
          removeAnnotation(annotationIdx);
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
        autoFocus
      />
    );
  };

  const handleSelectAnnotation = (annotationIdx) => {
    if (selectedAnnotationIdx === annotationIdx) {
      return;
    }
    selectAnnotationIdx(annotationIdx);
    setEditedExplanation(annotations[annotationIdx].explanation);
  };

  const handleChange = (event) => setEditedExplanation(event.target.value);

  const handleSave = () => saveAnnotationExplanation(editedExplanation);

  const handleToggleAnnotate = () => setAnnotating(!annotating);

  return (
    <>
      {
        !_.isEmpty(annotations) && (
          <Table>
            <TableBody>
              {
                annotations.map((annotation, idx) => {
                  const {
                    sections,
                    explanation,
                  } = annotation;

                  const explanationContainer = (idx === selectedAnnotationIdx)
                    ? (
                      <ClickAwayListener onClickAway={handleSave}>
                        <AnnotationExplanationTextareaAutosize
                          aria-label="explanation"
                          value={editedExplanation}
                          onChange={handleChange}
                          maxRows={1}
                        />
                      </ClickAwayListener>
                    )
                    : (
                      <Typography variant='body1'>
                        {truncate(explanation || "[not set]", EXPLANATION_TRUNCATE_LENGTH)}
                      </Typography>
                    );
                  
                  return (
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='center' onClick={() => handleSelectAnnotation(idx)}>
                        {explanationContainer}
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={handleToggleAnnotate}>
                          <AnnotateIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={() => handleDeleteAnnotation(idx)}>
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
        onClick={addAnnotation}
      >
        Add Annotation
      </Button>
      {dialog}
    </>
  );
};

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
      annotations = [],
      links = [],
    },
    onUpdateTitle,
    onUpdateDetails,
    onUpdateLinks,
    onUpdateContent,
    onUpdateAnnotations,
  } = props;
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [selectedAnnotationIdx, setSelectedAnnotationIdx] = useState(null);

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
        console.log(`Removing detail '${key}'`);
        const copy = [...details.filter((detail) => detail[0] !== key)];
        onUpdateDetails(copy);
      }}
    />
  );

  const linksContainer = (
    <Links
      links={links}
      addLink={(title, url) => onUpdateLinks([
        ...links,
        {
          title,
          url,
        },
      ])}
      removeLink={(idx) => {
        const copy = [...links.filter((link, linkIdx) => linkIdx !== idx)];
        onUpdateLinks(copy);
      }}
    />
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

  const annotationsContainer = (
    <AnnotationsContainer
      annotations={annotations}
      selectedAnnotationIdx={selectedAnnotationIdx}
      annotating={isAnnotating}
      setAnnotating={setIsAnnotating}
      selectAnnotationIdx={(annotationIdx) => setSelectedAnnotationIdx(annotationIdx)}
      addAnnotation={() => onUpdateAnnotations(
        [...annotations, { explanation: "" }]
      )}
      removeAnnotation={(idx) => onUpdateAnnotations(
        [...annotations.filter((annotation, annotationIdx) => annotationIdx !== idx)]
      )}
      saveAnnotation={(updatedAnnotation) => {
        const copy = [...annotations];
        copy[selectedAnnotationIdx] = updatedAnnotation;
        onUpdateAnnotations(copy);
      }}
      saveAnnotationExplanation={(editedExplanation) => {
        console.log(`Saving annotation ${selectedAnnotationIdx}`);
        const selectedAnnotation = annotations[selectedAnnotationIdx];
        if (selectedAnnotation.explanation === editedExplanation) {
          setSelectedAnnotationIdx(null);
          return;
        }

        const copy = [...annotations];
        copy[selectedAnnotationIdx] = {
          ...selectedAnnotation,
          explanation: editedExplanation,
        };

        onUpdateAnnotations(copy);
        setSelectedAnnotationIdx(null);
      }}
    />
  );

  const contentContainer = 
    isEditingContent ? (
        <ContentEditor
          content={content}
          onSave={(updatedContent) => {
            if (content !== updatedContent) {
              onUpdateContent(updatedContent)
            }
            setIsEditingContent(false);
          }}
        />
      )
      : isAnnotating
        ? (
            <TextView
              content={content}
              onSelectText={handleSelectText}
              annotations={annotations}
            />
          )
        : (
          <TextView
            content={content}
            onSelectText={handleSelectText}
            annotations={[]}
            onClick={() => setIsEditingContent(true)}
          />
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

export default EditPoemRenderer;
