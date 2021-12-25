import React from 'react';

import styled from '@emotion/styled';

import Button from '@mui/material/Button';

import AssignIcon from '@material-ui/icons/ChevronRight';
import UnassignIcon from '@material-ui/icons/ChevronLeft';

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
    padding: ${theme.spacing(2)};
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
        startIcon={<UnassignIcon />}
        endIcon={<AssignIcon style={{visibility: "hidden"}}/>}
        onClick={onBack}
        disabled={disableBack}
      >
        Previous
      </Button>
      <Button
        startIcon={<UnassignIcon style={{visibility: "hidden"}}/>}
        endIcon={<AssignIcon />}
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
        startIcon={<UnassignIcon />}
        onClick={onBack}
        disabled={disableBack}
      >
        Previous
      </Button>
      <Button
        endIcon={<AssignIcon />}
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
