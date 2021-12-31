import React, { useState } from 'react';

import styled from '@emotion/styled';

import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import {
  FLEX_COLUMN_CENTERED,
  DivColumn,
  PaperColumn,
} from 'styles';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
`;

const Column = styled.div`
  width: 33%;
  ${FLEX_COLUMN_CENTERED};
`;

const StickyColumn = styled.div`
  width: 33%;
  ${FLEX_COLUMN_CENTERED};
  top: 0;
  position: sticky;
`;

const DescriptionContainer = styled.div(
  ({ theme }) => `
    ${FLEX_COLUMN_CENTERED};
    max-width: 20vw;
  `
);

const DescriptionSection = styled(DivColumn)(
  ({ theme }) => `
    padding: ${theme.spacing(1)};
    margin: ${theme.spacing(1)};
  `
);

const DescriptionSectionHeader = styled.div(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(1)};
  `
);

const DescriptionSectionContent = (props) => {
  return (
    <PaperColumn variant='outlined' sx={{ p: 1 }}>
      {props.children}
    </PaperColumn>
  );
}

const AnnotationContainer = styled.div`
  ${FLEX_COLUMN_CENTERED};
  width: 20vw;
`;

const LeftPane = (props) => {
  const {
    details,
    context,
    links,
  } = props;

  return (
    <DescriptionContainer>
      <DescriptionSection>
        <DescriptionSectionHeader>
          <Typography variant='h4'>
            Details
          </Typography>
        </DescriptionSectionHeader>
        <DescriptionSectionContent>
          {details}
        </DescriptionSectionContent>
      </DescriptionSection>
      
      <DescriptionSection>
        <DescriptionSectionHeader>
          <Typography variant='h4'>
            Context
          </Typography>
        </DescriptionSectionHeader>
        <DescriptionSectionContent>
          {context}
        </DescriptionSectionContent>
      </DescriptionSection>

      {
        links == null ? null : (
          <DescriptionSection>
            <DescriptionSectionHeader>
              <Typography variant='h4'>
                Links
              </Typography>
            </DescriptionSectionHeader>
            <DescriptionSectionContent>
              {links}
            </DescriptionSectionContent>
          </DescriptionSection>
        )
      }
    </DescriptionContainer>
  );
}

const RightPane = (props) => {
  const {
    notes,
  } = props;

  return (
    <AnnotationContainer>
      <Typography variant='h4'>
        Notes
      </Typography>
      {notes}
    </AnnotationContainer>
  );
}

const PoemSkeleton = (props) => {
  const {
    title,
    details,
    context,
    links,
    notes,
    poem,
  } = props;

  return (
    <Root>
      <StickyColumn>
        <LeftPane
          details={details}
          context={context}
          links={links}
        />
      </StickyColumn>
      <Column>
        <DivColumn>
          {title}
          {poem}
        </DivColumn>
      </Column>
      <StickyColumn>
        <RightPane
          notes={notes}
        />
      </StickyColumn>
    </Root>
  );
};

export default PoemSkeleton;
