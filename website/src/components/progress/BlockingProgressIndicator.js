/**
 * Progress indicator modal dialog which blocks all interactions while rendered
 *
 * Example usage:
 * <BlockingProgressIndicator
 *   title={"title"}
 * />
 */
import React, { useRef } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

import TireIcon from '@mui/icons-material/Album';

// import { green, grey } from '@mui/material/colors';

/** Size of inner icon size in pixels */
const TIRE_SIZE = 64;

export const BlockingProgressIndicator = (props) => {
  const {
    // classes,
    tooltip,
    title,
    onClose,
  } = props;

  const dialogTitle = title == null ? null : (
    <Tooltip title={tooltip}>
      <DialogTitle id={title}>
        {title}
      </DialogTitle>
    </Tooltip>
  )

  const wrapperRef = useRef(null);

  const runAway = event => {
    let left = wrapperRef.current.offsetLeft;
    let top = wrapperRef.current.offsetTop;
    const width = wrapperRef.current.offsetWidth;
    const height = wrapperRef.current.offsetHeight;

    const centerX = (left + (width / 2));
    const centerY = (top + (height / 2));

    const angle = Math.atan2(centerY - event.clientY, event.clientX - centerX);
    const directionX = -Math.cos(angle);
    const directionY = Math.sin(angle);

    top += directionY * 15;
    left += directionX * 15;

    if (top < 0) {
      top = 0;
    }

    if (left < 0) {
      left = 0;
    }

    if (top + height > window.innerHeight) {
      top = window.innerHeight - height;
    }

    if (left + width > window.innerWidth) {
      left = window.innerWidth - width;
    }

    const style = wrapperRef.current.style;
    style.setProperty("top", `${top}px`);
    style.setProperty("left", `${left}px`);
  };

  return (
    <Dialog
      // classes={{
      //   paper: classes.dialogPaper
      // }}
      open={true}
      aria-labelledby={title}
    >
      {dialogTitle}
      <DialogContent
        // className={classes.content}
      >
        <div
          // className={classes.wrapper}
          onMouseOver={runAway}
          onClick={onClose}
          ref={wrapperRef}
        >
          <TireIcon
            // className={classes.icon}
          />
          <CircularProgress
            // className={classes.progress}
            size={TIRE_SIZE}
          />
          <CircularProgress
            // className={classes.innerProgress}
            size={22}
            thickness={6}
          />
          <Skeleton
            // classes={{
            //   root: classes.skeletonRoot,
            //   text: classes.skeletonText,
            //   wave: classes.skeletonWave,
            // }}
            animation={'wave'}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// const styles = theme => {
//   return ({
//     dialogPaper: {
//       alignItems: 'center',
//     },
//     content: {
//       height: '50px',
//     },
//     wrapper: {
//       margin: theme.spacing(1),
//       position: 'fixed',
//       top: 'calc(50vh - 20px)',
//       left: 'calc(50vw - 35px)',
//     },
//     icon: {
//       width: `${TIRE_SIZE}px`,
//       height: `${TIRE_SIZE}px`,
//     },
//     progress: {
//       color: green[900],
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       zIndex: 1,
//     },
//     innerProgress: {
//       color: grey[700],
//       position: 'absolute',
//       top: 21,
//       left: 21,
//       zIndex: 1,
//     },
//     skeletonRoot: {
//       backgroundColor: 'rgba(80, 80, 80, 1.0)',
//       position: 'absolute',
//       top: 50,
//       width: `${TIRE_SIZE}px`,
//       zIndex: 4,
//     },
//     skeletonText: {
//       transform: 'scale(1, 0.45)',
//     },
//     skeletonWave: {
//       '&::after': {
//         animationDirection: 'reverse',
//         background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)`
//       },
//     },
//   });
// };

export default BlockingProgressIndicator;
