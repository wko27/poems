import React from 'react';

import {
  isControlShiftKeyEvent,
  isKeyCode,
} from 'utils';

/** Handles key events for admin actions */
const KeyEventHandler = (props) => {
  const {
    requireControlShift,
    keyCode,
    onKeyCode,
  } = props;

  const handleKeyEvent = event => {
    if (requireControlShift && !isControlShiftKeyEvent(event)) {
      return;
    }

    event.preventDefault();

    if (isKeyCode(keyCode, event)) {
      onKeyCode();
    }
  };

  React.useEffect(function setupListener() {
    window.addEventListener('keydown', handleKeyEvent);

    return function cleanupListener() {
      window.removeEventListener('keydown', handleKeyEvent);
    }
  });

  // This component does not render anything
  return null;
};

export default KeyEventHandler;
