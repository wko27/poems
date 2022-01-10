import styled from '@emotion/styled';

import {
  TextareaAutosize,
  TextField,
} from '@mui/material';

export const createTypographyTextField = (variant) => styled(TextField)(
  ({theme}) => {
    const displayVariant = theme.typography[variant];
    return `
      width: 100%;
      font-family: ${displayVariant.fontFamily};
      font-weight: ${displayVariant.fontWeight};
      font-size: ${displayVariant.fontSize};
      line-height: ${displayVariant.lineHeight};
    `;
  }
);

export const createTypographyTextareaAutosize = variant => styled(TextareaAutosize)(
  ({theme}) => {
    const displayVariant = theme.typography[variant];
    return `
      width: 100%;
      font-family: ${displayVariant.fontFamily};
      font-weight: ${displayVariant.fontWeight};
      font-size: ${displayVariant.fontSize};
      line-height: ${displayVariant.lineHeight};
    `;
  }
);
