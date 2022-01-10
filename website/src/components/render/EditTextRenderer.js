import * as _ from 'lodash';

import React, { useState, useEffect, useRef } from 'react';

import styled from '@emotion/styled';

import {
  Backdrop,
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
  Tooltip,
  Typography,
} from '@mui/material';

import KeyEventHandler from 'components/utils/KeyEventHandler';

import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import AddDetailDialog from 'components/dialogs/AddDetailDialog';
import AddLinkDialog from 'components/dialogs/AddLinkDialog';
import ButtonControl from 'components/buttons/ButtonControl';
import TextView from 'components/viewer/TextView';
import ViewSkeleton from 'components/viewer/ViewSkeleton';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AnnotateIcon from '@mui/icons-material/BorderColor';
import ViewIcon from '@mui/icons-material/Search';

import {
  MaxWidthDivRow,
  DivColumn,
  PaperColumn,
  createTypographyTextareaAutosize,
} from 'styles';

import {
  truncate,
  isDoubleClick,
} from 'utils';

const MAX_TITLE_FONT_REM = 4;
const MAX_TITLE_VIEW_WIDTH = 70;

const DEFAULT_CONTENT_FONT_REM = 1.25;

const DEBUG_TITLE_EDITOR = false;

const EXPLANATION_TRUNCATE_LENGTH = 30;

const ESCAPE_KEY_CODE = 27;

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
        style={{ padding: 8 }}
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

const ContentContainer = (props) => {
  const {
    isEditingContent,
    isAnnotating,
    selectedAnnotationIdx,
    content,
    annotations,
    onUpdateContent,
    setIsEditingContent,
    handleAnnotateTextSelection,
    handleClickContent,
  } = props;

  let tooltipTitle;
  let icon;
  let iconButtonDisabled;
  let innerContentContainer;

  if (isEditingContent) {
    tooltipTitle="Click to save, or click outside the content area";
    icon = (<ViewIcon />);
    iconButtonDisabled = false;
    innerContentContainer = (
      <ContentEditor
        content={content}
        onSave={(updatedContent) => {
          if (content !== updatedContent) {
            onUpdateContent(updatedContent)
          }
          setIsEditingContent(false);
        }}
      />
    );
  } else if (selectedAnnotationIdx != null) {
    tooltipTitle = isAnnotating
      ? "Disable annotating before editing content"
      : "Click to edit content, or double click the content area";
    icon = (<EditIcon />);
    iconButtonDisabled = isAnnotating;
    innerContentContainer = (
      <TextView
        content={content}
        onSelectText={handleAnnotateTextSelection}
        annotations={[annotations[selectedAnnotationIdx]]}
      />
    );
  } else {
    tooltipTitle = "Click to edit content, or double click the content area";
    icon = (<EditIcon />);
    iconButtonDisabled = false;
    innerContentContainer = (
      <TextView
        content={content}
        annotations={annotations}
        onClick={handleClickContent}
      />
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', padding: 8 }}>
      <Tooltip title={tooltipTitle}>
        <span
          style={{
            position: 'absolute',
            top: 16,
            right: 0,
          }}
        >
          <IconButton
            onClick={() => setIsEditingContent(true)}
            disabled={iconButtonDisabled}
          >
            {icon}
          </IconButton>
        </span>
      </Tooltip>
      {innerContentContainer}
    </div>
  );
}

const AnnotationsContainer = (props) => {
  const {
    annotations = [],
    selectedAnnotationIdx,
    setSelectedAnnotationIdx,
    isAnnotating,
    setIsAnnotating,
    addAnnotation,
    removeAnnotation,
    saveAnnotation,
  } = props;
  
  const selectedAnnotationExplanation = selectedAnnotationIdx == null ? "" : annotations[selectedAnnotationIdx].explanation;

  const [dialog, setDialog] = useState();
  const [editedAnnotationIdx, setEditedAnnotationIdx] = useState(null);
  const [editedExplanation, setEditedExplanation] = useState(selectedAnnotationExplanation);

  const handleAddAnnotation = () => {
    // First, save any outstanding edits
    handleSave();

    addAnnotation();
  };

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
    console.log(`Selecting annotations ${annotationIdx}`);
    setIsAnnotating(false);
    setSelectedAnnotationIdx(annotationIdx);    
  };

  const handleEditExplanation = (annotationIdx) => {
    setEditedAnnotationIdx(annotationIdx);
    setEditedExplanation(annotations[annotationIdx].explanation);
  }

  const handleChange = (event) => setEditedExplanation(event.target.value);

  const handleSave = () => {
    if (editedAnnotationIdx == null) {
      return;
    }
    const updatedAnnotation = {
      ...annotations[editedAnnotationIdx],
      explanation: editedExplanation,
    };

    saveAnnotation(editedAnnotationIdx, updatedAnnotation);
    setEditedAnnotationIdx(null);
  };

  const handleToggleAnnotating = () => {
    if (isAnnotating) {
      console.log(`Disabling annotating`);
    } else {
      console.log(`Enabling annotating`);
    }
    setIsAnnotating(!isAnnotating)
  };

  const handleClickAwayAnnotationsContainer = () => {
    if (isAnnotating) {
      return;
    }
    handleSelectAnnotation(null);
  };

  return (
    <>
      {
        !_.isEmpty(annotations) && (
          <ClickAwayListener onClickAway={handleClickAwayAnnotationsContainer}>
            <Table>
              <TableBody>
                {
                  annotations.map((annotation, idx) => {
                    const {
                      sections,
                      explanation,
                    } = annotation;

                    const isSelected = idx === selectedAnnotationIdx;

                    const numSections = _.size(sections);

                    const explanationContainer = editedAnnotationIdx === idx
                      ? (
                        <ClickAwayListener onClickAway={handleSave}>
                          <AnnotationExplanationTextareaAutosize
                            aria-label="explanation"
                            value={editedExplanation}
                            onChange={handleChange}
                            minRows={2}
                          />
                        </ClickAwayListener>
                      )
                      : (
                        <Typography variant='body1'>
                          {truncate(explanation || "[not set]", EXPLANATION_TRUNCATE_LENGTH)}
                        </Typography>
                      );

                    const annotateIcon = isSelected && isAnnotating
                      ? (
                        <Tooltip title="Disable highlighter">
                          <AnnotateIcon sx={{ color: 'red' }} />
                        </Tooltip>
                      )
                      : (
                        <Tooltip title="Toggle the highlighter to mark sections of text for this annotation.">
                          <AnnotateIcon />
                        </Tooltip>
                      )
                    
                    return (
                      <TableRow
                        key={idx}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        hover
                        selected={isSelected}
                        onClick={() => handleSelectAnnotation(idx)}
                      >
                        <TableCell align='center' onClick={() => handleEditExplanation(idx)} sx={{ width: '80%' }}>
                          {explanationContainer}
                        </TableCell>
                        <TableCell align='center'>
                          {`${numSections} highlighted regions`}
                        </TableCell>
                        <TableCell align='center'>
                          <IconButton onClick={() => handleToggleAnnotating()}>
                            {annotateIcon}
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
          </ClickAwayListener>
        )
      }
      <Button
        onClick={handleAddAnnotation}
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
  const [selectedAnnotationIdx, setSelectedAnnotationIdx] = useState(null);
  const [isAnnotating, setIsAnnotating] = useState(false);

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

  const handleAnnotateTextSelection = (selection) => {
    const {
      lineIdx,
      selectionStartIdx,
      selectionEndIdx,
      selectedText,
    } = selection;

    if (selectionStartIdx === selectionEndIdx) {
      return;
    }
    
    console.log(`Selected Line ${lineIdx} - Offset (${selectionStartIdx}, ${selectionEndIdx}): '${selectedText}'`);

    const selectedAnnotation = annotations[selectedAnnotationIdx];
    const {
      sections = [],
    } = selectedAnnotation;

    const matchedSectionIdx = _.findIndex(sections, section => 
      lineIdx === section[0]
      && selectionStartIdx === section[1]
      && selectionEndIdx === section[2]
    );
    
    console.log(sections);
    console.log(matchedSectionIdx);

    let updatedSections;
    
    if (matchedSectionIdx === -1) {
      // If no matched section, then add a new one
      updatedSections = [
        ...sections,
        [
          lineIdx,
          selectionStartIdx,
          selectionEndIdx,
        ]
      ];
    } else {
      // If a section did match, then remove it
      updatedSections = [...sections.filter((section, idx) => idx !== matchedSectionIdx)];
    }

    const copy = [...annotations];
    copy[selectedAnnotationIdx] = {
      ...selectedAnnotation,
      sections: updatedSections,
    };
    
    onUpdateAnnotations(copy);
  }

  const handleClickContent = (event) => {
    if (isDoubleClick(event)) {
      setIsEditingContent(true);
    }
  };

  const annotationsContainer = (
    <AnnotationsContainer
      annotations={annotations}
      selectedAnnotationIdx={selectedAnnotationIdx}
      setSelectedAnnotationIdx={(annotationIdx) => setSelectedAnnotationIdx(annotationIdx)}
      isAnnotating={isAnnotating}
      setIsAnnotating={setIsAnnotating}
      addAnnotation={() => onUpdateAnnotations(
        [...annotations, { explanation: "" }]
      )}
      removeAnnotation={(idx) => {
        setSelectedAnnotationIdx(null);
        onUpdateAnnotations(
          [...annotations.filter((annotation, annotationIdx) => annotationIdx !== idx)]
        );
      }}
      saveAnnotation={(annotationIdx, updatedAnnotation) => {
        const copy = [...annotations];
        copy[annotationIdx] = updatedAnnotation;
        onUpdateAnnotations(copy);
      }}
    />
  );

  const contentContainer = (
    <ContentContainer
      isEditingContent={isEditingContent}
      isAnnotating={isAnnotating}
      selectedAnnotationIdx={selectedAnnotationIdx}
      content={content}
      annotations={annotations}
      onUpdateContent={onUpdateContent}
      setIsEditingContent={setIsEditingContent}
      handleAnnotateTextSelection={handleAnnotateTextSelection}
      handleClickContent={handleClickContent}
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
