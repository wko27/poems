import React, { useState } from 'react';

import styled from '@emotion/styled';

import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import ButtonControl from 'components/buttons/ButtonControl';
import HighlightedPoem from 'components/poem/HighlightedPoem';

const flexColumnCentered = `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
`;

const Title = styled.div`
  ${flexColumnCentered};
`;

const DescriptionContainer = styled.div`
  ${flexColumnCentered};
  top: 15vh;
  position: sticky;
  max-width: 20vw;
`;

const DescriptionSection = styled.div(
  ({ theme }) => `
    ${flexColumnCentered};
    padding: ${theme.spacing(1)};
  `
);

const DescriptionSectionHeader = styled.div(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(1)};
  `
);

const DescriptionSectionContent = styled(Paper)(
  ({ theme }) => `
    ${flexColumnCentered};
    padding: ${theme.spacing(1)};
  `
);

const Description = (props) => {
  const {
    title,
    author,
    dedicatedTo,
    created,
    meter,
    type,
    context,
    links = [],
  } = props;

  return (
    <DescriptionContainer>
      <DescriptionSection>
        <DescriptionSectionHeader>
          <Typography variant='h4'>
            Details
          </Typography>
        </DescriptionSectionHeader>
        <DescriptionSectionContent variant='outlined'>
          <Typography variant='body1'>
            {`Title: ${title}`}
          </Typography>
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
        </DescriptionSectionContent>
      </DescriptionSection>
      
      
      <DescriptionSection>
        <DescriptionSectionHeader>
          <Typography variant='h4'>
            Dedication
          </Typography>
        </DescriptionSectionHeader>
        <DescriptionSectionContent variant='outlined'>
          <Typography variant='body1'>
            {context}
          </Typography>
        </DescriptionSectionContent>
      </DescriptionSection>

      {
        links.length === 0 ? null : (
          <DescriptionSection>
            <DescriptionSectionHeader>
              <Typography variant='h4'>
                Links
              </Typography>
            </DescriptionSectionHeader>
            <DescriptionSectionContent variant='outlined'>
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
            </DescriptionSectionContent>
          </DescriptionSection>
        )
      }
    </DescriptionContainer>
  );
}

const AnnotationContainer = styled.div`
  ${flexColumnCentered};
  width: 20vw;
  top: 20vh;
  position: sticky;
  align-self: flex-start;
`;

const PoemRenderer = (props) => {
  const {
    title,
    content,
    annotations = [],
  } = props;

  const [selectedAnnotationIdx, setSelectedAnnotationIdx] = useState(0);

  const annotation = selectedAnnotationIdx == null ? null : annotations[selectedAnnotationIdx];

  const annotationDisplay = (
    <AnnotationContainer>
      <Typography variant='h4'>
        Notes
      </Typography>
      <ButtonControl
        onForward={() => setSelectedAnnotationIdx(selectedAnnotationIdx + 1)}
        disableForward={selectedAnnotationIdx >= annotations.length - 1}
        onBack={() => setSelectedAnnotationIdx(selectedAnnotationIdx - 1)}
        disableBack={selectedAnnotationIdx <= 0}
      />
      <DescriptionSectionContent variant='outlined'>
        <Typography variant='body1'>
          {annotation == null ? null : annotation.explanation}
        </Typography>
      </DescriptionSectionContent>
    </AnnotationContainer>
  );

  return (
    <Root>
      <Description
        {...props}
      />
      <Title>
        <Typography variant='h1'>
          {title}
        </Typography>
        <HighlightedPoem
          content={content}
          annotation={annotation}
        />
      </Title>
      {annotationDisplay}
    </Root>
  );
};

export default PoemRenderer;
