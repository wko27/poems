import { styled } from '@mui/system';

import Typography from '@mui/material/Typography';

const Highlighted = styled(Typography)(
  ({ theme }) => `
    text-decoration: underline;
    background-color: ${theme.palette.info.light};
  `
);

const HighlightedText = (props) => {
  const {
    text,
    lineIdx,
    lineOffset,
    contentLines,
    highlight,
  } = props;

  const onSelect = (event) => {
    const selection = window.getSelection();

    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    } = selection;

    if (focusNode !== anchorNode) {
      console.log(`A single annotation can only reside in one line`);
      return;
    }

    if (anchorOffset === focusOffset) {
      return;
    }

    const selectionStartIdx = lineOffset + anchorOffset;
    const selectionEndIdx = lineOffset + focusOffset;
    const selectedText = contentLines[lineIdx].substring(selectionStartIdx, selectionEndIdx);

    console.log(`Line ${lineIdx} - Offset (${selectionStartIdx}, ${selectionEndIdx}): '${selectedText}'`);
  }

  return highlight
    ? (
      <Highlighted
        variant="h6"
        component="span"
        onClick={onSelect}
      >
        {text}
      </Highlighted>
    )
    : (
      <Typography
        variant="h6"
        component="span"
        onClick={onSelect}
      >
        {text}
      </Typography>
    );
}

export default HighlightedText;