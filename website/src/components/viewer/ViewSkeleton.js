import styled from '@emotion/styled';

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
    max-width: 30vw;
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
    info,
    details,
    links,
  } = props;

  return (
    <DescriptionContainer>
      <DescriptionSection>
        <DescriptionSectionHeader>
          <Typography variant='h4'>
            Info
          </Typography>
        </DescriptionSectionHeader>
        <DescriptionSectionContent>
          {info}
        </DescriptionSectionContent>
      </DescriptionSection>
      
      {
        details == null ? null : (
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
        )
      }

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

export const CenterPane = styled.div(
  ({ theme }) => `
    ${FLEX_COLUMN_CENTERED};
    width: 100%;
  `
);

const RightPane = (props) => {
  const {
    annotations,
  } = props;

  return (
    <AnnotationContainer>
      <Typography variant='h4'>
        Annotations
      </Typography>
      {annotations}
    </AnnotationContainer>
  );
}

const ViewSkeleton = (props) => {
  const {
    title,
    info,
    details,
    links,
    annotations,
    content,
  } = props;

  return (
    <Root>
      <StickyColumn>
        <LeftPane
          info={info}
          details={details}
          links={links}
        />
      </StickyColumn>
      <Column>
        <CenterPane>
          {title}
          {content}
        </CenterPane>
      </Column>
      <StickyColumn>
        <RightPane
          annotations={annotations}
        />
      </StickyColumn>
    </Root>
  );
};

export default ViewSkeleton;
