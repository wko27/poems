import styled from '@emotion/styled';

import Paper from '@mui/material/Paper';

export const FLEX_COLUMN_CENTERED = `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FLEX_ROW_CENTERED = `
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const PaperColumn = styled(Paper)(
  ({ theme }) => `
    ${FLEX_COLUMN_CENTERED};
  `
);

export const DivColumn = styled.div(
  ({ theme }) => `
    ${FLEX_COLUMN_CENTERED};
  `
);

export const DivRow = styled.div(
  ({ theme }) => `
    ${FLEX_ROW_CENTERED};
  `
);

export const MaxWidthDivRow = styled.div(
  ({ theme }) => `
    ${FLEX_ROW_CENTERED};
    width: 100%;
  `
);

export const TYPOGRAPHY_H1 = {
  fontWeight: '300',
  fontSize: '6rem',
  lineHeight: '1.167',
}

