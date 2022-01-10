import * as _ from 'lodash';

import { styled } from '@mui/system';

import TextPart from './TextPart';

import {
  findDistinctSections,
} from 'logic';

const PLAIN = "PLAIN";
const HIGHLIGHTED = "HIGHLIGHTED";
const BOLDED = "BOLDED";

const StanzaStart = styled('div')(
  ({ theme }) => `
    margin-top: ${theme.spacing(4)};
    margin-bottom: ${theme.spacing(0.5)};
  `
);

const StanzaBody = styled('div')(
  ({ theme }) => `
    margin-top: ${theme.spacing(0.5)};
    margin-bottom: ${theme.spacing(0.5)};
  `
);

/*
 * Each poem is parsed into a list of stanzas
 * Each stanza comprises of a list of lines
 * Each line is a list of contiguous PLAIN, HIGHLIGHTED, and BOLDED text
 */
const parseStructure = (content, annotations, selectedAnnotation) => {
  const uniqueSections = [];
  const annotationsBySection = {};  

  const sortedAnnotations = [...annotations];
  if (selectedAnnotation != null) {
    sortedAnnotations.unshift(selectedAnnotation);
  }

  for (const annotation of sortedAnnotations) {
    const {
      sections = [],
    } = annotation;
    for (const section of sections) {
      const unique = findDistinctSections(uniqueSections, section);

      unique.forEach((s) => {
        uniqueSections.push(s)
        annotationsBySection[s] = [...(annotationsBySection[s] || []), annotation];
      });
    }
  }

  const uniqueSortedSections = _.sortBy(uniqueSections,
    ([lineIdx, startIdx, endIdx]) => lineIdx,
    ([lineIdx, startIdx, endIdx]) => startIdx,
  );

  const selectedSections = selectedAnnotation == null ? [] : selectedAnnotation.sections;

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
      if (sectionIdx >= uniqueSortedSections.length) {
        break;
      }

      const section = uniqueSortedSections[sectionIdx];

      const isSelected = selectedSections.includes(section);
      const [sectionLineIdx, startIdx, endIdx] = section;

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
        type: isSelected ? BOLDED : HIGHLIGHTED,
        lineIdx,
        lineOffset: startIdx,
        annotations: annotationsBySection[section],
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

const TextView = (props) => {
  const {
    content = "",
    selectedAnnotation,
    annotations = [],
    onSelectAnnotations = () => {},
    onSelectText = () => {},
    setAnnotatedRef,
    onClick = () => {},
  } = props;

  const {
    contentLines,
    stanzas,
  } = parseStructure(content, annotations, selectedAnnotation);

  const elements = [];

  let firstRefSet = false;
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
          annotations,
        } = part;

        const onSelect = (selectedText) => {
          onSelectAnnotations(annotations);
          onSelectText(selectedText);
        };

        switch (type) {
          case PLAIN:
            lineElements.push(
              <TextPart
                key={lineElements.length}
                lineIdx={lineIdx}
                lineOffset={lineOffset}
                text={text}
                contentLines={contentLines}
                onSelect={onSelect}
              />
            );
            break;
          case HIGHLIGHTED:
            lineElements.push(
              <TextPart
                highlight
                key={lineElements.length}
                lineIdx={lineIdx}
                lineOffset={lineOffset}
                text={text}
                contentLines={contentLines}
                onSelect={onSelect}
              />
            );
            break;
          case BOLDED:
            if (!firstRefSet && setAnnotatedRef) {
              lineElements.push(
                <span key="injected" ref={setAnnotatedRef}></span>
              );
              firstRefSet = true;
            }

            lineElements.push(
              <TextPart
                bold
                key={lineElements.length}
                lineIdx={lineIdx}
                lineOffset={lineOffset}
                text={text}
                contentLines={contentLines}
                onSelect={onSelect}
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

  return (
    <div onClick={onClick}>
      {elements}
    </div>
  );
}

export default TextView;
