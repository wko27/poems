import { forwardRef } from 'react';

import { styled } from '@mui/system';

import Typography from '@mui/material/Typography';

const Bolded = styled(Typography)(
  ({ theme }) => `
      background-color: ${theme.palette.highlight.main};
    `
);

const Highlighted = styled(Typography)(
  ({ theme }) => `
    background-color: ${theme.palette.highlight.light};
  `
);

const TextPart = forwardRef((props, ref) => {
  const {
    text,
    lineIdx,
    lineOffset,
    contentLines,
    highlight,
    bold,
    onSelect = () => {},
  } = props;

  const handleSelect = (event) => {
    const selection = window.getSelection();

    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    } = selection;

    if (focusNode !== anchorNode) {
      console.log(`Ignoring text selection that spans multiple lines`);
      return;
    }

    const selectionStartIdx = lineOffset + anchorOffset;
    const selectionEndIdx = lineOffset + focusOffset;
    const selectedText = contentLines[lineIdx].substring(selectionStartIdx, selectionEndIdx);

    onSelect({
      lineIdx,
      selectionStartIdx,
      selectionEndIdx,
      selectedText,
    });
  }

  return bold
    ? (
        <Bolded
          variant="h6"
          component="span"
          onClick={handleSelect}
        >
          {text}
        </Bolded>
      )
    : highlight
      ? (
        <Highlighted
          variant="h6"
          component="span"
          onClick={handleSelect}
        >
          {text}
        </Highlighted>
      )
      : (
        <Typography
          variant="h6"
          component="span"
          onClick={handleSelect}
        >
          {text}
        </Typography>
      );
});

export default TextPart;
