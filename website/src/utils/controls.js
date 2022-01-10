export function isControlShiftKeyEvent(e) {
  return e.ctrlKey && e.shiftKey;
}

export function isKeyCode(keyCode, e) {
  return e.keyCode === keyCode;
}

export function isDoubleClick(e) {
  return e.detail === 2;
}
