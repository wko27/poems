import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import AssignIcon from '@material-ui/icons/ChevronRight';
import UnassignIcon from '@material-ui/icons/ChevronLeft';

export const TopBottomButtonControl = (props) => {
  const {
    classes,
    onForward,
    onBack,
    disableForward,
    disableBack,
  } = props;

  return (
    <div className={classes.topBottomContainer}>
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
    </div>
  );
}

export const SideBySideButtonControl = (props) => {
  const {
    classes,
    onForward,
    onBack,
    disableForward,
    disableBack,
  } = props;

  return (
    <div className={classes.sideBySideContainer}>
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
    </div>
  );
}

const styles = (theme) => ({
  topBottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBySideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(2),
  },
});

export default withStyles(styles)(SideBySideButtonControl);
