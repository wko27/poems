import { css } from '@emotion/react';

import Typography from '@mui/material/Typography';

const PLAIN = "PLAIN";
const HIGHLIGHTED = "HIGHLIGHTED";

/*
 * Each poem is parsed into a list of stanzas
 * Each stanza comprises of a list of lines
 * Each line is a list of contiguous PLAIN and HIGHLIGHTED text
 */
const parseStructure = (content, sections) => {
  const lines = content.trim().split('\n');

  // Start with one stanza containing one line
  const stanzas = [[]];

  let sectionIdx = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx ++) {
    const line = lines[lineIdx];

    // Double newline means a new stanza
    if (line === "") {
      // Add a new stanza with an empty line
      stanzas.push([]);

      continue;
    }

    const currentStanza = stanzas[stanzas.length - 1];
    currentStanza.push([]);

    const currentLine = currentStanza[currentStanza.length - 1];

    // Index into the current line
    let lineOffset = 0;

    while (true) {
      if (sectionIdx >= sections.length) {
        break;
      }

      const [sectionLineIdx, startIdx, endIdx] = sections[sectionIdx];

      // Each section must be contained within a line
      // If the section is before or after this line, then it is not in this line
      if (lineIdx !== sectionLineIdx) {
        break;
      }
      
      if (lineOffset !== startIdx) {
        currentLine.push({
          text: line.substring(lineOffset, startIdx),
          type: PLAIN,
          lineIdx,
          lineOffset,
        });
        
      }

      currentLine.push({
        text: line.substring(startIdx, endIdx),
        type: HIGHLIGHTED,
        lineIdx,
        lineOffset: startIdx,
      });

      lineOffset = endIdx;

      sectionIdx ++;
    }

    if (lineOffset !== line.length) {
      currentLine.push({
        text: line.substring(lineOffset),
        type: PLAIN,
        lineIdx,
        lineOffset,
      });
    }
  }

  return {
    contentLines: lines,
    stanzas,
  };
};

const TextPart = (props) => {
  const {
    css,
    text,
    lineIdx,
    lineOffset,
    contentLines,
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

  return (
    <Typography
      css={css}
      variant="h6"
      component="span"
      onClick={onSelect}
    >
      {text}
    </Typography>
  );
}

const ParsedPoem = (props) => {
  const {
    content,
    annotation,
  } = props;

  const {
    sections = [],
  } = annotation || {};

  const {
    contentLines,
    stanzas,
  } = parseStructure(content, sections);

  const elements = [];

  for (const stanza of stanzas) {
    let isFirstLineOfStanza = true;

    for (const line of stanza) {
      const lineElements = [];
      for (const part of line) {
        const {
          type,
          text,
          lineIdx,
          lineOffset,
        } = part;

        switch (type) {
          case PLAIN:
            lineElements.push(
              <TextPart
                key={lineElements.length}
                lineIdx={lineIdx}
                lineOffset={lineOffset}
                text={text}
                contentLines={contentLines}
              />
            );
            break;
          case HIGHLIGHTED:
            lineElements.push(
              <TextPart
                key={lineElements.length}
                css={(theme) => css`
                  textDecoration: 'underline',
                  backgroundColor: theme.palette.info.light,
                `}
                lineIdx={lineIdx}
                lineOffset={lineOffset}
                text={text}
                contentLines={contentLines}
              />
            );
            break;
          default:
            throw Error(`Unknown parsed type ${type}`);
        }
      }

      const css = isFirstLineOfStanza
        ? (theme) => css`
          marginTop: theme.spacing(4),
          marginBottom: theme.spacing(0.5),
        `
        : (theme) => css`
          marginTop: theme.spacing(0.5),
          marginBottom: theme.spacing(0.5),
        `;
      elements.push((
        <p key={elements.length} css={css}>
          {lineElements}
        </p>
      ));

      isFirstLineOfStanza = false;
    }
  }

  return elements;
}

const styles = (theme) => ({
  plain: {
  },
  highlighted: {
    textDecoration: 'underline',
    backgroundColor: theme.palette.info.light,
  },
});

export default ParsedPoem;

