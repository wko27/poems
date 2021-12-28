import { styled } from '@mui/system';

import HighlightedText from './HighlightedText';

const PLAIN = "PLAIN";
const HIGHLIGHTED = "HIGHLIGHTED";

const StanzaStart = styled('p')(
  ({ theme }) => `
    margin-top: ${theme.spacing(4)};
    margin-bottom: ${theme.spacing(0.5)};
  `
);

const StanzaBody = styled('p')(
  ({ theme }) => `
    margin-top: ${theme.spacing(0.5)};
    margin-bottom: ${theme.spacing(0.5)};
  `
);

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

const HighlightedPoem = (props) => {
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
              <HighlightedText
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
              <HighlightedText
                highlight
                key={lineElements.length}
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

      if (isFirstLineOfStanza) {
        elements.push(
          <StanzaStart key={elements.length}>
            {lineElements}
          </StanzaStart>
        );
      } else {
        elements.push(
          <StanzaBody key={elements.length}>
            {lineElements}
          </StanzaBody>
        );
      }

      isFirstLineOfStanza = false;
    }
  }

  return elements;
}

export default HighlightedPoem;
