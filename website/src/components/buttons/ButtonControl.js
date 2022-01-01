import React from 'react';

import styled from '@emotion/styled';

import Button from '@mui/material/Button';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const TopBottomRoot = styled.div`
  display: flex
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SideBySideRoot = styled.div(
  ({ theme }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `
);

export const TopBottomButtonControl = (props) => {
  const {
    onForward,
    onBack,
    disableForward,
    disableBack,
  } = props;

  return (
    <TopBottomRoot>
      <Button
        startIcon={<ChevronLeftIcon />}
        endIcon={<ChevronRightIcon style={{visibility: "hidden"}}/>}
        onClick={onBack}
        disabled={disableBack}
      >
        Previous
      </Button>
      <Button
        startIcon={<ChevronLeftIcon style={{visibility: "hidden"}}/>}
        endIcon={<ChevronRightIcon />}
        onClick={onForward}
        disabled={disableForward}
      >
        Next
      </Button>
    </TopBottomRoot>
  );
}

export const SideBySideButtonControl = (props) => {
  const {
    onForward,
    onBack,
    disableForward,
    disableBack,
  } = props;

  return (
    <SideBySideRoot>
      <Button
        startIcon={<ChevronLeftIcon />}
        onClick={onBack}
        disabled={disableBack}
      >
        Previous
      </Button>
      <Button
        endIcon={<ChevronRightIcon />}
        onClick={onForward}
        disabled={disableForward}
      >
        Next
      </Button>
    </SideBySideRoot>
  );
}

const ButtonControl = SideBySideButtonControl;

export default ButtonControl;
